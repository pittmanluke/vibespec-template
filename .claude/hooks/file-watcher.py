#!/usr/bin/env python3
"""
Hook: file-watcher
Purpose: Real-time file monitoring that detects violations and triggers appropriate agents
Execution time target: <5s (for setup, then runs continuously)
Platform: Cross-platform (Linux/macOS/WSL)

This hook provides real-time monitoring of the file system to detect naming convention
violations, specification drift, and other issues that require immediate attention.
"""

import json
import sys
import os
import time
import hashlib
import threading
import queue
import signal
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Set, Optional, Any, Callable
import re
import subprocess

# Platform-specific imports
try:
    # Linux - inotify
    import inotify_simple
    HAS_INOTIFY = True
except ImportError:
    HAS_INOTIFY = False

try:
    # macOS - fsevents via fswatch
    import subprocess
    HAS_FSWATCH = os.system('which fswatch >/dev/null 2>&1') == 0
except:
    HAS_FSWATCH = False

class FileWatcher:
    """Cross-platform file system watcher for VibeSpec workflow automation."""
    
    def __init__(self, daemon_mode: bool = False):
        self.hook_name = "file-watcher"
        self.start_time = time.time()
        self.daemon_mode = daemon_mode
        self.running = False
        
        # Directory setup
        self.base_dir = Path('.claude')
        self.logs_dir = self.base_dir / 'logs'
        self.state_dir = self.base_dir / 'workflow-state'
        self.cache_dir = self.base_dir / 'cache'
        self.config_dir = self.base_dir / 'config'
        
        # Ensure directories exist
        for dir_path in [self.logs_dir, self.state_dir, self.cache_dir, self.config_dir]:
            dir_path.mkdir(parents=True, exist_ok=True)
        
        # Load configuration
        self.config = self._load_config()
        
        # Event processing
        self.event_queue = queue.Queue()
        self.event_batch = []
        self.last_batch_time = time.time()
        
        # State tracking
        self.monitored_files = set()
        self.violation_cache = {}
        self.agent_triggers = {}
        
        # Platform-specific watcher
        self.watcher = None
        self.watch_thread = None
        
    def _load_config(self) -> Dict[str, Any]:
        """Load configuration with platform-specific defaults."""
        config_file = self.config_dir / 'hooks.json'
        default_config = {
            'hooks': {
                'file-watcher': {
                    'enabled': True,
                    'debounce_ms': 1000,
                    'batch_events': True,
                    'batch_size': 50,
                    'batch_timeout': 5.0,
                    'monitor_directories': [
                        'src/', 'app/', 'components/', 'lib/', 'hooks/',
                        'types/', 'services/', 'providers/', 'pages/',
                        'specs/', 'plans/', 'docs/', '.claude/agents/',
                        '.claude/commands/', '.claude/workflow-state/'
                    ],
                    'ignore_patterns': [
                        '*.log', '*.tmp', '*~', '.#*', '#*#',
                        'node_modules/*', '.git/*', 'dist/*', 
                        'build/*', '.next/*', 'coverage/*',
                        '*.lock', 'package-lock.json'
                    ],
                    'watch_extensions': [
                        '.ts', '.tsx', '.js', '.jsx', '.json', '.md',
                        '.sh', '.py', '.yml', '.yaml', '.env', '.css'
                    ],
                    'trigger_agents': {
                        'naming_violations': ['compliance'],
                        'spec_changes': ['spec-guardian'],
                        'code_changes': ['reviewer'],
                        'config_changes': ['architect'],
                        'ui_changes': ['ui-enhancer']
                    }
                }
            },
            'file_monitoring': {
                'use_polling_fallback': True,
                'polling_interval': 2.0,
                'max_file_size_mb': 50,
                'enable_content_analysis': True,
                'violation_threshold': 3
            }
        }
        
        try:
            if config_file.exists():
                with open(config_file) as f:
                    loaded_config = json.load(f)
                self._deep_merge(default_config, loaded_config)
        except Exception as e:
            self._log_error(f"Failed to load config: {e}")
        
        return default_config
    
    def _deep_merge(self, base: Dict, overlay: Dict) -> Dict:
        """Deep merge two dictionaries."""
        for key, value in overlay.items():
            if key in base and isinstance(base[key], dict) and isinstance(value, dict):
                self._deep_merge(base[key], value)
            else:
                base[key] = value
        return base
    
    def _log_info(self, message: str):
        """Log info message with timestamp."""
        timestamp = datetime.now(timezone.utc).isoformat()
        log_entry = f"[{timestamp}] INFO: {message}"
        if not self.daemon_mode:
            print(log_entry)
        
        log_file = self.logs_dir / 'hooks.log'
        with open(log_file, 'a') as f:
            f.write(log_entry + '\n')
    
    def _log_error(self, message: str):
        """Log error message with timestamp."""
        timestamp = datetime.now(timezone.utc).isoformat()
        log_entry = f"[{timestamp}] ERROR: {message}"
        if not self.daemon_mode:
            print(log_entry, file=sys.stderr)
        
        log_file = self.logs_dir / 'hooks.log'
        with open(log_file, 'a') as f:
            f.write(log_entry + '\n')
    
    def _log_debug(self, message: str):
        """Log debug message if debug mode enabled."""
        if os.environ.get('HOOK_DEBUG', 'false').lower() == 'true':
            timestamp = datetime.now(timezone.utc).isoformat()
            log_entry = f"[{timestamp}] DEBUG: {message}"
            
            debug_log = self.logs_dir / 'hooks-debug.log'
            with open(debug_log, 'a') as f:
                f.write(log_entry + '\n')
    
    def _should_monitor_path(self, path: Path) -> bool:
        """Check if path should be monitored based on configuration."""
        config = self.config['hooks']['file-watcher']
        str_path = str(path.relative_to('.'))
        
        # Check ignore patterns
        for pattern in config['ignore_patterns']:
            if pattern.endswith('/*'):
                if str_path.startswith(pattern[:-2]):
                    return False
            elif pattern.startswith('*.'):
                if str_path.endswith(pattern[1:]):
                    return False
            elif pattern in str_path:
                return False
        
        # Check if in monitored directories
        for monitor_dir in config['monitor_directories']:
            if str_path.startswith(monitor_dir.rstrip('/')):
                # Check extension if it's a file
                if path.is_file():
                    if path.suffix in config['watch_extensions'] or not path.suffix:
                        return True
                else:
                    return True
        
        return False
    
    def _validate_naming_convention(self, file_path: Path) -> List[str]:
        """Validate file naming conventions and return violations."""
        violations = []
        
        if not file_path.exists():
            return violations
        
        # File naming validation
        basename = file_path.name
        
        # Patterns for valid names
        kebab_case = r'^[a-z0-9]+(-[a-z0-9]+)*\.[a-z0-9]+$'
        component_name = r'^[A-Z][a-zA-Z0-9]*\.(tsx?|jsx?)$'
        special_files = r'^(README|LICENSE|CHANGELOG|Dockerfile)(\.[a-z]+)?$'
        config_files = r'^(\.|[a-z])[a-z0-9.-]*$'
        
        # Check if file name is valid
        if not (re.match(kebab_case, basename) or
                re.match(component_name, basename) or
                re.match(special_files, basename) or
                (not '.' in basename and re.match(config_files, basename))):
            violations.append(f"File '{basename}' should use kebab-case naming")
        
        # Directory naming validation
        for parent in file_path.parents:
            if parent.name == '.':
                break
            
            dir_name = parent.name
            
            # Skip certain directories
            if dir_name in ['node_modules', '.git', '.next', 'dist', 'build', '__pycache__']:
                break
            
            # Check directory naming
            if not re.match(r'^[a-z0-9]+(-[a-z0-9]+)*$', dir_name) and \
               not re.match(r'^\..*$', dir_name) and \
               dir_name not in ['src', 'app', 'pages', 'public', 'components', 'lib', 'hooks', 'types', 'config', 'utils']:
                violations.append(f"Directory '{dir_name}' should use kebab-case naming")
        
        return violations
    
    def _analyze_file_content(self, file_path: Path) -> Dict[str, Any]:
        """Analyze file content for specification drift and other issues."""
        analysis = {
            'type': 'unknown',
            'issues': [],
            'triggers': []
        }
        
        try:
            if not file_path.is_file() or file_path.stat().st_size > 50 * 1024 * 1024:
                return analysis
            
            # Determine file type
            if file_path.suffix in ['.ts', '.tsx', '.js', '.jsx']:
                analysis['type'] = 'code'
            elif file_path.suffix == '.md':
                analysis['type'] = 'documentation'
            elif file_path.suffix in ['.json', '.yml', '.yaml']:
                analysis['type'] = 'configuration'
            elif 'spec' in str(file_path) or 'plan' in str(file_path):
                analysis['type'] = 'specification'
            
            # Read content for analysis
            try:
                content = file_path.read_text(encoding='utf-8', errors='ignore')
            except:
                return analysis
            
            # Code analysis
            if analysis['type'] == 'code':
                # Check for console.log statements
                if 'console.log' in content:
                    analysis['issues'].append("Contains console.log statements")
                
                # Check for TODO/FIXME comments
                if re.search(r'(TODO|FIXME|XXX|HACK)', content, re.IGNORECASE):
                    analysis['issues'].append("Contains TODO/FIXME comments")
                
                # Check import patterns
                if '../' in content and '@/' not in content:
                    analysis['issues'].append("Uses relative imports instead of @/ paths")
                
                # Trigger appropriate agents
                if analysis['issues']:
                    analysis['triggers'].append('reviewer')
                
                if any('ui' in issue.lower() for issue in analysis['issues']):
                    analysis['triggers'].append('ui-enhancer')
            
            # Specification analysis
            elif analysis['type'] == 'specification':
                # Look for incomplete specifications
                if 'TBD' in content or 'TODO' in content:
                    analysis['issues'].append("Specification contains incomplete sections")
                
                # Trigger spec-guardian for specification changes
                analysis['triggers'].append('spec-guardian')
            
            # Configuration analysis
            elif analysis['type'] == 'configuration':
                # Check for sensitive data in config
                sensitive_patterns = [
                    r'password\s*[:=]\s*["\'][^"\']+["\']',
                    r'secret\s*[:=]\s*["\'][^"\']+["\']',
                    r'key\s*[:=]\s*["\'][^"\']+["\']'
                ]
                
                for pattern in sensitive_patterns:
                    if re.search(pattern, content, re.IGNORECASE):
                        analysis['issues'].append("May contain sensitive data")
                        break
                
                if analysis['issues']:
                    analysis['triggers'].append('architect')
            
        except Exception as e:
            self._log_debug(f"Failed to analyze {file_path}: {e}")
        
        return analysis
    
    def _create_file_event(self, event_type: str, file_path: Path) -> Dict[str, Any]:
        """Create standardized file event."""
        return {
            'type': event_type,
            'path': str(file_path.relative_to('.')),
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'size': file_path.stat().st_size if file_path.exists() else 0,
            'monitored': self._should_monitor_path(file_path)
        }
    
    def _process_file_event(self, event: Dict[str, Any]):
        """Process individual file event."""
        if not event['monitored']:
            return
        
        file_path = Path(event['path'])
        self._log_debug(f"Processing {event['type']} event for {file_path}")
        
        # Validate naming conventions
        naming_violations = self._validate_naming_convention(file_path)
        
        # Analyze file content
        content_analysis = self._analyze_file_content(file_path)
        
        # Combine issues
        all_issues = naming_violations + content_analysis['issues']
        
        if all_issues:
            self._log_info(f"Issues detected in {file_path}: {len(all_issues)} issues")
            
            # Cache violations to avoid repeated processing
            self.violation_cache[str(file_path)] = {
                'violations': all_issues,
                'timestamp': time.time(),
                'triggers': content_analysis['triggers']
            }
            
            # Determine agents to trigger
            agents_to_trigger = set()
            
            if naming_violations:
                agents_to_trigger.add('compliance')
            
            agents_to_trigger.update(content_analysis['triggers'])
            
            # Save trigger suggestions
            if agents_to_trigger:
                self._save_trigger_suggestion(file_path, list(agents_to_trigger), all_issues)
    
    def _save_trigger_suggestion(self, file_path: Path, agents: List[str], issues: List[str]):
        """Save agent trigger suggestion."""
        suggestion = {
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'file': str(file_path),
            'agents': agents,
            'issues': issues,
            'priority': 'high' if 'compliance' in agents else 'normal'
        }
        
        # Save to trigger suggestions file
        suggestions_file = self.state_dir / 'file-watcher-triggers.json'
        
        try:
            # Load existing suggestions
            suggestions = []
            if suggestions_file.exists():
                with open(suggestions_file) as f:
                    suggestions = json.load(f)
            
            # Add new suggestion
            suggestions.append(suggestion)
            
            # Keep only last 100 suggestions
            suggestions = suggestions[-100:]
            
            # Save updated suggestions
            with open(suggestions_file, 'w') as f:
                json.dump(suggestions, f, indent=2)
            
            self._log_info(f"Saved trigger suggestion: {agents} for {file_path}")
            
        except Exception as e:
            self._log_error(f"Failed to save trigger suggestion: {e}")
    
    def _process_event_batch(self):
        """Process batch of file events."""
        if not self.event_batch:
            return
        
        self._log_debug(f"Processing batch of {len(self.event_batch)} events")
        
        # Group events by file
        file_events = {}
        for event in self.event_batch:
            file_path = event['path']
            if file_path not in file_events:
                file_events[file_path] = []
            file_events[file_path].append(event)
        
        # Process each file's events
        for file_path, events in file_events.items():
            # Use the latest event for each file
            latest_event = max(events, key=lambda e: e['timestamp'])
            self._process_file_event(latest_event)
        
        # Clear batch
        self.event_batch.clear()
        self.last_batch_time = time.time()
    
    def _start_inotify_watcher(self):
        """Start inotify-based file watcher (Linux)."""
        try:
            import inotify_simple
            
            self.watcher = inotify_simple.INotify()
            watch_flags = (inotify_simple.flags.CREATE | 
                          inotify_simple.flags.DELETE |
                          inotify_simple.flags.MODIFY |
                          inotify_simple.flags.MOVED_TO |
                          inotify_simple.flags.MOVED_FROM)
            
            # Add watches for monitored directories
            for monitor_dir in self.config['hooks']['file-watcher']['monitor_directories']:
                dir_path = Path(monitor_dir.rstrip('/'))
                if dir_path.exists():
                    self.watcher.add_watch(str(dir_path), watch_flags)
                    self._log_debug(f"Added inotify watch for {dir_path}")
            
            self._log_info("Started inotify file watcher")
            
            # Watch loop
            while self.running:
                events = self.watcher.read(timeout=1000)
                for event in events:
                    try:
                        file_path = Path(event.path) / event.name if event.name else Path(event.path)
                        event_type = 'modified'
                        
                        if event.mask & inotify_simple.flags.CREATE:
                            event_type = 'created'
                        elif event.mask & inotify_simple.flags.DELETE:
                            event_type = 'deleted'
                        elif event.mask & (inotify_simple.flags.MOVED_TO | inotify_simple.flags.MOVED_FROM):
                            event_type = 'moved'
                        
                        file_event = self._create_file_event(event_type, file_path)
                        self.event_queue.put(file_event)
                        
                    except Exception as e:
                        self._log_debug(f"Error processing inotify event: {e}")
                        
        except Exception as e:
            self._log_error(f"Failed to start inotify watcher: {e}")
            self._start_polling_watcher()
    
    def _start_fswatch_watcher(self):
        """Start fswatch-based file watcher (macOS)."""
        try:
            # Build fswatch command
            cmd = ['fswatch', '-r', '--event', 'Created', '--event', 'Updated', 
                   '--event', 'Removed', '--event', 'Renamed']
            
            for monitor_dir in self.config['hooks']['file-watcher']['monitor_directories']:
                dir_path = Path(monitor_dir.rstrip('/'))
                if dir_path.exists():
                    cmd.append(str(dir_path))
            
            self._log_info("Starting fswatch file watcher")
            
            # Start fswatch process
            process = subprocess.Popen(cmd, stdout=subprocess.PIPE, 
                                     stderr=subprocess.PIPE, text=True)
            
            while self.running:
                line = process.stdout.readline()
                if not line:
                    break
                
                try:
                    file_path = Path(line.strip())
                    event_type = 'modified'  # fswatch doesn't provide detailed event types
                    
                    file_event = self._create_file_event(event_type, file_path)
                    self.event_queue.put(file_event)
                    
                except Exception as e:
                    self._log_debug(f"Error processing fswatch event: {e}")
            
            process.terminate()
            
        except Exception as e:
            self._log_error(f"Failed to start fswatch watcher: {e}")
            self._start_polling_watcher()
    
    def _start_polling_watcher(self):
        """Start polling-based file watcher (fallback)."""
        self._log_info("Starting polling file watcher (fallback)")
        
        # Track file states
        file_states = {}
        
        def get_file_state(file_path: Path) -> Optional[str]:
            try:
                stat = file_path.stat()
                return f"{stat.st_mtime}:{stat.st_size}"
            except:
                return None
        
        # Initial scan
        for monitor_dir in self.config['hooks']['file-watcher']['monitor_directories']:
            dir_path = Path(monitor_dir.rstrip('/'))
            if dir_path.exists():
                for file_path in dir_path.rglob('*'):
                    if file_path.is_file() and self._should_monitor_path(file_path):
                        state = get_file_state(file_path)
                        if state:
                            file_states[str(file_path)] = state
        
        # Polling loop
        poll_interval = self.config['file_monitoring']['polling_interval']
        
        while self.running:
            time.sleep(poll_interval)
            
            current_files = set()
            
            # Scan for changes
            for monitor_dir in self.config['hooks']['file-watcher']['monitor_directories']:
                dir_path = Path(monitor_dir.rstrip('/'))
                if not dir_path.exists():
                    continue
                
                for file_path in dir_path.rglob('*'):
                    if not file_path.is_file() or not self._should_monitor_path(file_path):
                        continue
                    
                    file_str = str(file_path)
                    current_files.add(file_str)
                    
                    current_state = get_file_state(file_path)
                    previous_state = file_states.get(file_str)
                    
                    if current_state != previous_state:
                        if previous_state is None:
                            event_type = 'created'
                        else:
                            event_type = 'modified'
                        
                        file_event = self._create_file_event(event_type, file_path)
                        self.event_queue.put(file_event)
                        
                        if current_state:
                            file_states[file_str] = current_state
            
            # Check for deleted files
            for file_str in list(file_states.keys()):
                if file_str not in current_files:
                    file_path = Path(file_str)
                    file_event = self._create_file_event('deleted', file_path)
                    self.event_queue.put(file_event)
                    del file_states[file_str]
    
    def _event_processor_thread(self):
        """Event processor thread that handles batching and processing."""
        config = self.config['hooks']['file-watcher']
        batch_timeout = config['batch_timeout']
        
        while self.running:
            try:
                # Get event with timeout
                try:
                    event = self.event_queue.get(timeout=0.5)
                    self.event_batch.append(event)
                except queue.Empty:
                    pass
                
                # Check if we should process batch
                current_time = time.time()
                batch_ready = (
                    len(self.event_batch) >= config['batch_size'] or
                    (self.event_batch and (current_time - self.last_batch_time) >= batch_timeout)
                )
                
                if batch_ready:
                    self._process_event_batch()
                
            except Exception as e:
                self._log_error(f"Error in event processor: {e}")
    
    def start_watching(self):
        """Start the file watcher."""
        if self.running:
            return
        
        config = self.config['hooks']['file-watcher']
        if not config['enabled']:
            self._log_info("File watcher disabled in configuration")
            return
        
        self.running = True
        self._log_info("Starting file watcher")
        
        # Start event processor thread
        self.event_processor = threading.Thread(target=self._event_processor_thread, daemon=True)
        self.event_processor.start()
        
        # Start appropriate watcher based on platform
        if HAS_INOTIFY and os.name == 'posix':
            self.watch_thread = threading.Thread(target=self._start_inotify_watcher, daemon=True)
        elif HAS_FSWATCH and os.name == 'posix':
            self.watch_thread = threading.Thread(target=self._start_fswatch_watcher, daemon=True)
        else:
            self.watch_thread = threading.Thread(target=self._start_polling_watcher, daemon=True)
        
        self.watch_thread.start()
        
        if self.daemon_mode:
            self._log_info("File watcher running in daemon mode")
            # Keep main thread alive in daemon mode
            try:
                while self.running:
                    time.sleep(1)
            except KeyboardInterrupt:
                self.stop_watching()
        else:
            self._log_info("File watcher started in background")
    
    def stop_watching(self):
        """Stop the file watcher."""
        if not self.running:
            return
        
        self._log_info("Stopping file watcher")
        self.running = False
        
        # Process any remaining events
        if self.event_batch:
            self._process_event_batch()
        
        # Wait for threads to finish
        if self.watch_thread and self.watch_thread.is_alive():
            self.watch_thread.join(timeout=5)
        
        # Close watcher
        if self.watcher and hasattr(self.watcher, 'close'):
            try:
                self.watcher.close()
            except:
                pass
        
        # Log performance
        execution_time = time.time() - self.start_time
        perf_file = self.logs_dir / 'performance.json'
        perf_entry = {
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'hook': self.hook_name,
            'execution_time': execution_time,
            'status': 'stopped'
        }
        
        try:
            with open(perf_file, 'a') as f:
                f.write(json.dumps(perf_entry) + '\n')
        except:
            pass
        
        self._log_info("File watcher stopped")
    
    def scan_once(self) -> Dict[str, Any]:
        """Perform one-time scan of monitored files."""
        self._log_info("Performing one-time file scan")
        
        results = {
            'scanned_files': 0,
            'violations_found': 0,
            'agents_suggested': set(),
            'issues': []
        }
        
        for monitor_dir in self.config['hooks']['file-watcher']['monitor_directories']:
            dir_path = Path(monitor_dir.rstrip('/'))
            if not dir_path.exists():
                continue
            
            for file_path in dir_path.rglob('*'):
                if not file_path.is_file() or not self._should_monitor_path(file_path):
                    continue
                
                results['scanned_files'] += 1
                
                # Check naming conventions
                violations = self._validate_naming_convention(file_path)
                
                # Analyze content
                analysis = self._analyze_file_content(file_path)
                
                # Combine issues
                all_issues = violations + analysis['issues']
                
                if all_issues:
                    results['violations_found'] += len(all_issues)
                    results['issues'].append({
                        'file': str(file_path),
                        'issues': all_issues,
                        'suggested_agents': analysis['triggers']
                    })
                    
                    if violations:
                        results['agents_suggested'].add('compliance')
                    
                    results['agents_suggested'].update(analysis['triggers'])
        
        # Convert set to list for JSON serialization
        results['agents_suggested'] = list(results['agents_suggested'])
        
        self._log_info(f"Scan complete: {results['scanned_files']} files, "
                      f"{results['violations_found']} violations")
        
        return results

def create_watcher_service():
    """Create systemd service file for file watcher daemon."""
    service_content = f"""[Unit]
Description=VibeSpec File Watcher
After=network.target

[Service]
Type=simple
User={os.getenv('USER', 'root')}
WorkingDirectory={os.getcwd()}
ExecStart={sys.executable} {__file__} --daemon
Restart=always
RestartSec=5
Environment=HOOK_DEBUG=false

[Install]
WantedBy=multi-user.target
"""
    
    service_file = Path('/etc/systemd/system/vibespec-file-watcher.service')
    
    try:
        with open(service_file, 'w') as f:
            f.write(service_content)
        
        print(f"Service file created at {service_file}")
        print("To enable and start the service:")
        print("  sudo systemctl enable vibespec-file-watcher")
        print("  sudo systemctl start vibespec-file-watcher")
        
    except PermissionError:
        print("Permission denied. Run with sudo to create service file.")
        return False
    
    return True

def main():
    """Main entry point for file watcher."""
    import argparse
    
    parser = argparse.ArgumentParser(description='VibeSpec File Watcher')
    parser.add_argument('--daemon', action='store_true', 
                       help='Run in daemon mode (continuous monitoring)')
    parser.add_argument('--scan', action='store_true',
                       help='Perform one-time scan and exit')
    parser.add_argument('--install-service', action='store_true',
                       help='Install systemd service (requires sudo)')
    parser.add_argument('--stop', action='store_true',
                       help='Stop running daemon')
    
    args = parser.parse_args()
    
    if args.install_service:
        return 0 if create_watcher_service() else 1
    
    watcher = FileWatcher(daemon_mode=args.daemon)
    
    # Set up signal handlers for graceful shutdown
    def signal_handler(signum, frame):
        watcher.stop_watching()
        sys.exit(0)
    
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    try:
        if args.scan:
            # One-time scan
            results = watcher.scan_once()
            print(json.dumps(results, indent=2))
            return 0
        else:
            # Start watching
            watcher.start_watching()
            return 0
            
    except Exception as e:
        watcher._log_error(f"File watcher failed: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(main())