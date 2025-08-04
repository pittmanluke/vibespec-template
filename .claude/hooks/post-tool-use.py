#!/usr/bin/env python3
"""
Hook: post-tool-use
Purpose: State capture hook that monitors significant file changes and updates session state
Execution time target: <5s
Platform: Cross-platform (Linux/macOS/WSL)

This hook captures workflow state after tool usage to enable cross-session continuity
and intelligent workflow coordination.
"""

import json
import sys
import os
import hashlib
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Set, Optional, Any
import subprocess
import tempfile

class PostToolUseHook:
    """Handles post-tool-use state capture and workflow coordination."""
    
    def __init__(self):
        self.hook_name = "post-tool-use"
        self.start_time = time.time()
        
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
        
        # State tracking
        self.session_state = self._load_session_state()
        self.file_snapshots = self._load_file_snapshots()
        
    def _load_config(self) -> Dict[str, Any]:
        """Load hook configuration with defaults."""
        config_file = self.config_dir / 'hooks.json'
        default_config = {
            'hooks': {
                'post-tool-use': {
                    'enabled': True,
                    'timeout': 30,
                    'batch_size': 10,
                    'track_file_changes': True,
                    'monitor_directories': [
                        'src/', 'app/', 'components/', 'lib/', 'hooks/',
                        'types/', 'services/', 'providers/', 'pages/',
                        'specs/', 'plans/', 'docs/', '.claude/'
                    ],
                    'ignore_patterns': [
                        '*.log', '*.tmp', 'node_modules/*', '.git/*',
                        'dist/*', 'build/*', '.next/*', 'coverage/*'
                    ],
                    'significant_extensions': [
                        '.ts', '.tsx', '.js', '.jsx', '.json', '.md',
                        '.sh', '.py', '.yml', '.yaml', '.env'
                    ]
                }
            }
        }
        
        try:
            if config_file.exists():
                with open(config_file) as f:
                    loaded_config = json.load(f)
                # Merge with defaults
                default_config.update(loaded_config)
        except Exception as e:
            self._log_error(f"Failed to load config: {e}")
        
        return default_config
    
    def _load_session_state(self) -> Dict[str, Any]:
        """Load current session state."""
        state_file = self.state_dir / 'session-state.json'
        default_state = {
            'session_id': None,
            'start_time': None,
            'last_update': None,
            'tools_used': [],
            'file_changes': {},
            'workflow_progress': {},
            'context_updates': []
        }
        
        try:
            if state_file.exists():
                with open(state_file) as f:
                    state = json.load(f)
                # Validate and merge with defaults
                for key in default_state:
                    if key not in state:
                        state[key] = default_state[key]
                return state
        except Exception as e:
            self._log_error(f"Failed to load session state: {e}")
        
        return default_state
    
    def _load_file_snapshots(self) -> Dict[str, str]:
        """Load previous file snapshots for change detection."""
        snapshots_file = self.cache_dir / 'file-snapshots.json'
        
        try:
            if snapshots_file.exists():
                with open(snapshots_file) as f:
                    return json.load(f)
        except Exception as e:
            self._log_debug(f"Failed to load file snapshots: {e}")
        
        return {}
    
    def _save_file_snapshots(self, snapshots: Dict[str, str]):
        """Save file snapshots for future change detection."""
        snapshots_file = self.cache_dir / 'file-snapshots.json'
        
        try:
            with open(snapshots_file, 'w') as f:
                json.dump(snapshots, f, indent=2)
        except Exception as e:
            self._log_error(f"Failed to save file snapshots: {e}")
    
    def _save_session_state(self):
        """Save updated session state."""
        state_file = self.state_dir / 'session-state.json'
        
        try:
            with open(state_file, 'w') as f:
                json.dump(self.session_state, f, indent=2)
        except Exception as e:
            self._log_error(f"Failed to save session state: {e}")
    
    def _log_info(self, message: str):
        """Log info message with timestamp."""
        timestamp = datetime.now(timezone.utc).isoformat()
        log_entry = f"[{timestamp}] INFO: {message}"
        print(log_entry)
        
        log_file = self.logs_dir / 'hooks.log'
        with open(log_file, 'a') as f:
            f.write(log_entry + '\n')
    
    def _log_error(self, message: str):
        """Log error message with timestamp."""
        timestamp = datetime.now(timezone.utc).isoformat()
        log_entry = f"[{timestamp}] ERROR: {message}"
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
    
    def _get_file_hash(self, file_path: Path) -> Optional[str]:
        """Get hash of file contents for change detection."""
        try:
            if not file_path.exists() or not file_path.is_file():
                return None
            
            with open(file_path, 'rb') as f:
                return hashlib.sha256(f.read()).hexdigest()
        except Exception as e:
            self._log_debug(f"Failed to hash {file_path}: {e}")
            return None
    
    def _should_monitor_file(self, file_path: Path) -> bool:
        """Check if file should be monitored based on configuration."""
        config = self.config['hooks']['post-tool-use']
        
        # Check if file is in monitored directories
        str_path = str(file_path)
        
        # Check ignore patterns
        for pattern in config['ignore_patterns']:
            if pattern.replace('*', '') in str_path:
                return False
        
        # Check if in monitored directories
        for monitor_dir in config['monitor_directories']:
            if str_path.startswith(monitor_dir):
                # Check if significant extension
                if file_path.suffix in config['significant_extensions']:
                    return True
                # Also monitor files without extensions in certain dirs
                if not file_path.suffix and any(d in str_path for d in ['scripts/', 'hooks/']):
                    return True
        
        return False
    
    def _scan_file_changes(self) -> Dict[str, Dict[str, Any]]:
        """Scan for significant file changes since last run."""
        changes = {}
        current_snapshots = {}
        
        self._log_debug("Scanning for file changes")
        
        # Scan all monitored files
        for root_path in Path('.').rglob('*'):
            if not self._should_monitor_file(root_path):
                continue
            
            try:
                relative_path = str(root_path.relative_to('.'))
                current_hash = self._get_file_hash(root_path)
                
                if current_hash is None:
                    continue
                
                current_snapshots[relative_path] = current_hash
                
                # Check if file changed
                previous_hash = self.file_snapshots.get(relative_path)
                
                if previous_hash != current_hash:
                    file_info = {
                        'action': 'modified' if previous_hash else 'created',
                        'previous_hash': previous_hash,
                        'current_hash': current_hash,
                        'size': root_path.stat().st_size,
                        'timestamp': datetime.now(timezone.utc).isoformat()
                    }
                    
                    # Add file type and context
                    if root_path.suffix in ['.ts', '.tsx', '.js', '.jsx']:
                        file_info['type'] = 'code'
                    elif root_path.suffix in ['.md']:
                        file_info['type'] = 'documentation'
                    elif root_path.suffix in ['.json', '.yml', '.yaml']:
                        file_info['type'] = 'configuration'
                    elif 'spec' in relative_path or 'plan' in relative_path:
                        file_info['type'] = 'specification'
                    else:
                        file_info['type'] = 'other'
                    
                    changes[relative_path] = file_info
                    
            except Exception as e:
                self._log_debug(f"Error processing {root_path}: {e}")
                continue
        
        # Check for deleted files
        for previous_file in self.file_snapshots:
            if previous_file not in current_snapshots:
                changes[previous_file] = {
                    'action': 'deleted',
                    'previous_hash': self.file_snapshots[previous_file],
                    'current_hash': None,
                    'timestamp': datetime.now(timezone.utc).isoformat(),
                    'type': 'unknown'
                }
        
        # Save updated snapshots
        self._save_file_snapshots(current_snapshots)
        
        self._log_debug(f"Found {len(changes)} file changes")
        return changes
    
    def _detect_workflow_context(self, changes: Dict[str, Dict[str, Any]]) -> Dict[str, Any]:
        """Detect workflow context from file changes."""
        context = {
            'primary_activity': None,
            'affected_features': [],
            'code_areas': [],
            'workflow_stage': None,
            'priority': 'normal'
        }
        
        # Analyze file types and patterns
        code_changes = sum(1 for f, info in changes.items() if info['type'] == 'code')
        doc_changes = sum(1 for f, info in changes.items() if info['type'] == 'documentation')
        spec_changes = sum(1 for f, info in changes.items() if info['type'] == 'specification')
        config_changes = sum(1 for f, info in changes.items() if info['type'] == 'configuration')
        
        # Determine primary activity
        if spec_changes > 0:
            context['primary_activity'] = 'planning'
            context['workflow_stage'] = 'specification'
        elif code_changes > doc_changes:
            context['primary_activity'] = 'development'
            context['workflow_stage'] = 'implementation'
        elif doc_changes > 0:
            context['primary_activity'] = 'documentation'
            context['workflow_stage'] = 'documentation'
        elif config_changes > 0:
            context['primary_activity'] = 'configuration'
            context['workflow_stage'] = 'setup'
        
        # Detect affected features and areas
        affected_areas = set()
        for file_path in changes.keys():
            path_parts = file_path.split('/')
            
            # Extract feature/component names
            for part in path_parts:
                if part and not part.startswith('.') and part not in ['src', 'app', 'components']:
                    affected_areas.add(part.replace('-', ' ').replace('.tsx', '').replace('.ts', ''))
        
        context['affected_features'] = list(affected_areas)[:5]  # Limit to top 5
        
        # Determine priority based on change scope
        total_changes = len(changes)
        if total_changes > 10:
            context['priority'] = 'high'
        elif total_changes > 5:
            context['priority'] = 'medium'
        
        return context
    
    def _update_session_state(self, hook_input: Dict[str, Any], changes: Dict[str, Dict[str, Any]]):
        """Update session state with new information."""
        now = datetime.now(timezone.utc).isoformat()
        
        # Initialize session if needed
        if not self.session_state.get('session_id'):
            self.session_state['session_id'] = f"session-{int(time.time())}"
            self.session_state['start_time'] = now
        
        self.session_state['last_update'] = now
        
        # Track tool usage
        tool_name = hook_input.get('tool_name', 'unknown')
        if tool_name not in [t.get('name') for t in self.session_state['tools_used']]:
            self.session_state['tools_used'].append({
                'name': tool_name,
                'first_used': now,
                'usage_count': 1
            })
        else:
            # Update usage count
            for tool in self.session_state['tools_used']:
                if tool['name'] == tool_name:
                    tool['usage_count'] = tool.get('usage_count', 0) + 1
                    break
        
        # Update file changes
        for file_path, change_info in changes.items():
            if file_path not in self.session_state['file_changes']:
                self.session_state['file_changes'][file_path] = []
            
            self.session_state['file_changes'][file_path].append({
                'timestamp': now,
                'action': change_info['action'],
                'type': change_info['type']
            })
        
        # Update workflow context
        if changes:
            context = self._detect_workflow_context(changes)
            self.session_state['context_updates'].append({
                'timestamp': now,
                'context': context,
                'changes_count': len(changes)
            })
        
        # Trim old data to keep state manageable
        self._trim_session_state()
    
    def _trim_session_state(self):
        """Trim old data from session state to keep it manageable."""
        # Keep only last 100 context updates
        if len(self.session_state['context_updates']) > 100:
            self.session_state['context_updates'] = self.session_state['context_updates'][-100:]
        
        # Keep only last 1000 file change entries per file
        for file_path in self.session_state['file_changes']:
            if len(self.session_state['file_changes'][file_path]) > 1000:
                self.session_state['file_changes'][file_path] = \
                    self.session_state['file_changes'][file_path][-1000:]
    
    def _trigger_agents_if_needed(self, changes: Dict[str, Dict[str, Any]]):
        """Trigger appropriate agents based on detected changes."""
        if not changes:
            return
        
        context = self._detect_workflow_context(changes)
        agents_to_trigger = []
        
        # Determine which agents should be triggered
        if context['primary_activity'] == 'development':
            # Check for naming violations
            naming_violations = any(
                not self._validate_file_naming(file_path) 
                for file_path in changes.keys()
                if changes[file_path]['action'] in ['created', 'modified']
            )
            
            if naming_violations:
                agents_to_trigger.append('compliance')
        
        if context['primary_activity'] == 'planning':
            agents_to_trigger.append('spec-guardian')
        
        # Log potential triggers (don't actually trigger to avoid infinite loops)
        if agents_to_trigger:
            self._log_info(f"Changes detected that might benefit from agents: {agents_to_trigger}")
            
            # Save trigger suggestions for later use
            trigger_file = self.state_dir / 'suggested-triggers.json'
            triggers = {
                'timestamp': datetime.now(timezone.utc).isoformat(),
                'context': context,
                'suggested_agents': agents_to_trigger,
                'changes': list(changes.keys())
            }
            
            try:
                with open(trigger_file, 'w') as f:
                    json.dump(triggers, f, indent=2)
            except Exception as e:
                self._log_error(f"Failed to save trigger suggestions: {e}")
    
    def _validate_file_naming(self, file_path: str) -> bool:
        """Validate file naming conventions."""
        import re
        
        basename = os.path.basename(file_path)
        
        # Check if file uses kebab-case (with some exceptions)
        kebab_case_pattern = r'^[a-z0-9]+(-[a-z0-9]+)*\.[a-z0-9]+$'
        component_pattern = r'^[A-Z][a-zA-Z0-9]*$'
        special_files = r'^(README|LICENSE|CHANGELOG)(\.[a-z]+)?$'
        dotfiles = r'^\.[a-z]'
        
        return (re.match(kebab_case_pattern, basename) or
                re.match(component_pattern, basename) or
                re.match(special_files, basename) or
                re.match(dotfiles, basename))
    
    def _log_performance(self, status: str):
        """Log performance metrics."""
        execution_time = time.time() - self.start_time
        
        perf_file = self.logs_dir / 'performance.json'
        entry = {
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'hook': self.hook_name,
            'execution_time': execution_time,
            'status': status
        }
        
        try:
            # Append to performance log
            with open(perf_file, 'a') as f:
                f.write(json.dumps(entry) + '\n')
        except Exception as e:
            self._log_error(f"Failed to log performance: {e}")
    
    def process_hook(self, hook_input: Dict[str, Any]) -> Dict[str, Any]:
        """Main hook processing logic."""
        try:
            self._log_info("Post-tool-use hook started")
            
            # Check if hook is enabled
            if not self.config['hooks']['post-tool-use']['enabled']:
                self._log_info("Post-tool-use hook disabled in configuration")
                return {"continue": True}
            
            # Scan for file changes
            changes = self._scan_file_changes()
            
            if changes:
                self._log_info(f"Detected {len(changes)} file changes")
                
                # Update session state
                self._update_session_state(hook_input, changes)
                
                # Save session state
                self._save_session_state()
                
                # Check if agents should be triggered
                self._trigger_agents_if_needed(changes)
                
                # Log significant changes
                for file_path, change_info in changes.items():
                    self._log_debug(f"File {change_info['action']}: {file_path} ({change_info['type']})")
            else:
                self._log_debug("No significant file changes detected")
            
            self._log_performance("success")
            
            return {
                "continue": True,
                "suppressOutput": False,
                "metadata": {
                    "changes_detected": len(changes),
                    "session_id": self.session_state.get('session_id'),
                    "execution_time": time.time() - self.start_time
                }
            }
            
        except Exception as e:
            self._log_error(f"Hook processing failed: {e}")
            self._log_performance("error")
            
            # Return non-blocking error
            return {
                "continue": True,
                "suppressOutput": False,
                "error": str(e)
            }

def main():
    """Main entry point for the hook."""
    try:
        # Read hook input
        hook_input = json.load(sys.stdin)
        
        # Create and run hook
        hook = PostToolUseHook()
        result = hook.process_hook(hook_input)
        
        # Output result
        json.dump(result, sys.stdout, indent=2)
        return 0
        
    except Exception as e:
        # Fallback error handling
        error_result = {
            "continue": True,
            "error": f"Hook failed: {e}"
        }
        json.dump(error_result, sys.stdout)
        return 1

if __name__ == "__main__":
    sys.exit(main())