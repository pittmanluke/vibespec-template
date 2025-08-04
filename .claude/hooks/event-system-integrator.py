#!/usr/bin/env python3
"""
Event System Integrator - Integration layer between existing hooks and new event system
Purpose: Bridge the gap between legacy hook system and new event-driven architecture
Platform: Cross-platform (Linux/macOS/WSL)

This script provides seamless integration with the existing hook infrastructure while
enabling the new event routing and processing capabilities.
"""

import json
import sys
import os
import time
import subprocess
import signal
import threading
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Optional, Any
import importlib.util

# Import the event processor
sys.path.append(str(Path(__file__).parent))
from event_processor import EventProcessor, Event, Priority, submit_event

class EventSystemIntegrator:
    """Integrates new event system with existing hook infrastructure"""
    
    def __init__(self):
        self.base_dir = Path('.claude')
        self.hooks_dir = self.base_dir / 'hooks'
        self.config_dir = self.base_dir / 'config'
        self.logs_dir = self.base_dir / 'logs'
        
        # Ensure directories exist
        for dir_path in [self.hooks_dir, self.config_dir, self.logs_dir]:
            dir_path.mkdir(parents=True, exist_ok=True)
        
        # Initialize event processor
        self.event_processor = EventProcessor()
        
        # Legacy hook mappings
        self.legacy_hooks = {
            'file-watcher.py': self._bridge_file_watcher,
            'post-tool-use.py': self._bridge_post_tool_use,
            'sub-agent-stop.py': self._bridge_sub_agent_stop,
            'pre-commit.sh': self._bridge_pre_commit
        }
        
        # Hook process monitoring
        self.monitored_processes = {}
        self.monitor_thread = None
        self.shutdown_event = threading.Event()
        
        # Load configuration
        self.config = self._load_config()
        
    def _load_config(self) -> Dict[str, Any]:
        """Load integration configuration"""
        config_file = self.config_dir / 'event-integration.json'
        default_config = {
            'bridge_legacy_hooks': True,
            'monitor_processes': True,
            'auto_start_watchers': True,
            'event_routing_enabled': True,
            'performance_monitoring': True,
            'debug_mode': False
        }
        
        try:
            if config_file.exists():
                with open(config_file) as f:
                    loaded_config = json.load(f)
                default_config.update(loaded_config)
        except Exception as e:
            self._log_error(f"Failed to load integration config: {e}")
        
        return default_config
    
    def start_integration(self):
        """Start the event system integration"""
        self._log_info("Starting Event System Integration")
        
        # Start hook bridges if enabled
        if self.config.get('bridge_legacy_hooks', True):
            self._start_hook_bridges()
        
        # Start process monitoring if enabled
        if self.config.get('monitor_processes', True):
            self._start_process_monitoring()
        
        # Auto-start file watcher if enabled
        if self.config.get('auto_start_watchers', True):
            self._start_file_watcher()
        
        self._log_info("Event System Integration started successfully")
    
    def _start_hook_bridges(self):
        """Start bridges for legacy hooks"""
        self._log_info("Starting hook bridges")
        
        for hook_file, bridge_func in self.legacy_hooks.items():
            hook_path = self.hooks_dir / hook_file
            if hook_path.exists():
                try:
                    bridge_func()
                    self._log_info(f"Bridge started for {hook_file}")
                except Exception as e:
                    self._log_error(f"Failed to start bridge for {hook_file}: {e}")
    
    def _bridge_file_watcher(self):
        """Bridge file watcher to event system"""
        def file_change_handler(event_data):
            """Handle file change events from legacy file watcher"""
            if 'changes' in event_data:
                for change in event_data['changes']:
                    action = change.get('action', 'unknown')
                    file_path = change.get('path', '')
                    
                    # Convert to new event format
                    submit_event(
                        event_type=f'file.{action}',
                        data={
                            'file_path': file_path,
                            'file_type': change.get('type', 'unknown'),
                            'size': change.get('size', 0),
                            'timestamp': change.get('timestamp', time.time())
                        },
                        priority=Priority.NORMAL if action == 'modified' else Priority.HIGH
                    )
        
        # Register file change handler
        self._register_legacy_hook_handler('file-watcher', file_change_handler)
    
    def _bridge_post_tool_use(self):
        """Bridge post-tool-use to event system"""
        def tool_use_handler(event_data):
            """Handle tool usage events from legacy hook"""
            tool_name = event_data.get('tool_name', 'unknown')
            
            submit_event(
                event_type='tool.used',
                data={
                    'tool_name': tool_name,
                    'execution_time': event_data.get('execution_time', 0),
                    'success': event_data.get('success', True),
                    'metadata': event_data.get('metadata', {})
                },
                priority=Priority.NORMAL
            )
        
        self._register_legacy_hook_handler('post-tool-use', tool_use_handler)
    
    def _bridge_sub_agent_stop(self):
        """Bridge sub-agent-stop to event system"""
        def agent_completion_handler(event_data):
            """Handle agent completion events from legacy hook"""
            agent_name = event_data.get('agent_name', 'unknown')
            status = event_data.get('status', 'completed')
            
            event_type = f'agent.{status}'
            priority = Priority.CRITICAL if status == 'failed' else Priority.HIGH
            
            submit_event(
                event_type=event_type,
                data={
                    'agent': agent_name,
                    'execution_time': event_data.get('execution_time', 0),
                    'outputs': event_data.get('outputs', {}),
                    'metrics': event_data.get('metrics', {}),
                    'chaining_recommendations': event_data.get('chaining_recommendations', [])
                },
                priority=priority
            )
        
        self._register_legacy_hook_handler('sub-agent-stop', agent_completion_handler)
    
    def _bridge_pre_commit(self):
        """Bridge pre-commit to event system"""
        def git_event_handler(event_data):
            """Handle git events from legacy hook"""
            submit_event(
                event_type='git.commit',
                data={
                    'files_changed': event_data.get('files_changed', []),
                    'validation_result': event_data.get('validation_result', 'unknown'),
                    'violations': event_data.get('violations', [])
                },
                priority=Priority.HIGH
            )
        
        self._register_legacy_hook_handler('pre-commit', git_event_handler)
    
    def _register_legacy_hook_handler(self, hook_name: str, handler_func: callable):
        """Register a handler for legacy hook events"""
        # This is a placeholder for the actual hook registration mechanism
        # In practice, this would integrate with the existing hook system
        self._log_info(f"Registered handler for legacy hook: {hook_name}")
    
    def _start_process_monitoring(self):
        """Start monitoring hook processes"""
        if self.monitor_thread is None or not self.monitor_thread.is_alive():
            self.monitor_thread = threading.Thread(
                target=self._monitor_processes,
                name="ProcessMonitor",
                daemon=True
            )
            self.monitor_thread.start()
            self._log_info("Process monitoring started")
    
    def _monitor_processes(self):
        """Monitor hook processes and restart if needed"""
        while not self.shutdown_event.is_set():
            try:
                # Check if file watcher is running
                if not self._is_process_running('file-watcher.py'):
                    if self.config.get('auto_restart_watchers', True):
                        self._restart_file_watcher()
                
                # Monitor other processes as needed
                self._check_process_health()
                
                # Sleep before next check
                self.shutdown_event.wait(30)  # Check every 30 seconds
                
            except Exception as e:
                self._log_error(f"Process monitoring error: {e}")
                self.shutdown_event.wait(5)  # Brief pause on error
    
    def _is_process_running(self, process_name: str) -> bool:
        """Check if a process is running"""
        try:
            result = subprocess.run(['pgrep', '-f', process_name], 
                                  capture_output=True, text=True)
            return result.returncode == 0
        except Exception:
            return False
    
    def _restart_file_watcher(self):
        """Restart the file watcher process"""
        try:
            file_watcher_path = self.hooks_dir / 'file-watcher.py'
            if file_watcher_path.exists():
                # Start file watcher in background
                process = subprocess.Popen(
                    ['python3', str(file_watcher_path), '--daemon'],
                    stdout=subprocess.DEVNULL,
                    stderr=subprocess.DEVNULL
                )
                
                self.monitored_processes['file-watcher'] = process
                self._log_info("File watcher restarted")
                
                # Send restart event
                submit_event(
                    event_type='process.restarted',
                    data={'process': 'file-watcher', 'pid': process.pid},
                    priority=Priority.NORMAL
                )
        except Exception as e:
            self._log_error(f"Failed to restart file watcher: {e}")
    
    def _start_file_watcher(self):
        """Start file watcher if not already running"""
        if not self._is_process_running('file-watcher.py'):
            self._restart_file_watcher()
    
    def _check_process_health(self):
        """Check health of monitored processes"""
        for process_name, process in list(self.monitored_processes.items()):
            if process.poll() is not None:  # Process has terminated
                self._log_warning(f"Process {process_name} has terminated")
                
                # Send termination event
                submit_event(
                    event_type='process.terminated',
                    data={'process': process_name, 'exit_code': process.returncode},
                    priority=Priority.HIGH
                )
                
                # Remove from monitored processes
                del self.monitored_processes[process_name]
    
    def handle_workflow_event(self, workflow_type: str, workflow_data: Dict[str, Any]):
        """Handle workflow events and route them through event system"""
        submit_event(
            event_type='workflow.started',
            data={
                'workflow_type': workflow_type,
                'workflow_data': workflow_data,
                'timestamp': time.time()
            },
            priority=Priority.CRITICAL
        )
    
    def handle_session_event(self, session_action: str, session_data: Dict[str, Any]):
        """Handle session events"""
        submit_event(
            event_type=f'session.{session_action}',
            data=session_data,
            priority=Priority.NORMAL
        )
    
    def trigger_agent_workflow(self, agent_names: List[str], context: Dict[str, Any]):
        """Trigger agent workflow through event system"""
        for agent_name in agent_names:
            submit_event(
                event_type='agent.trigger',
                data={
                    'agent': agent_name,
                    'context': context,
                    'trigger_source': 'workflow'
                },
                priority=Priority.HIGH
            )
    
    def get_system_status(self) -> Dict[str, Any]:
        """Get comprehensive system status"""
        # Get event processor stats
        event_stats = self.event_processor.get_stats()
        
        # Get process status
        process_status = {}
        for process_name in ['file-watcher.py', 'event-processor.py']:
            process_status[process_name] = self._is_process_running(process_name)
        
        # Get configuration status
        config_status = {
            'event_routing_enabled': self.config.get('event_routing_enabled', False),
            'bridge_legacy_hooks': self.config.get('bridge_legacy_hooks', False),
            'monitor_processes': self.config.get('monitor_processes', False)
        }
        
        return {
            'event_processor': event_stats,
            'processes': process_status,
            'configuration': config_status,
            'monitored_processes': len(self.monitored_processes),
            'integration_active': True
        }
    
    def shutdown(self):
        """Shutdown the integration system"""
        self._log_info("Shutting down Event System Integration")
        
        # Signal shutdown
        self.shutdown_event.set()
        
        # Stop monitored processes
        for process_name, process in self.monitored_processes.items():
            try:
                process.terminate()
                process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                process.kill()
            except Exception as e:
                self._log_error(f"Error stopping {process_name}: {e}")
        
        # Wait for monitor thread
        if self.monitor_thread and self.monitor_thread.is_alive():
            self.monitor_thread.join(timeout=5)
        
        # Shutdown event processor
        self.event_processor.shutdown()
        
        self._log_info("Event System Integration shutdown complete")
    
    def _log_info(self, message: str):
        """Log info message"""
        timestamp = datetime.now(timezone.utc).isoformat()
        log_entry = f"[{timestamp}] INFO: {message}"
        print(log_entry)
        
        log_file = self.logs_dir / 'event-integration.log'
        with open(log_file, 'a') as f:
            f.write(log_entry + '\n')
    
    def _log_error(self, message: str):
        """Log error message"""
        timestamp = datetime.now(timezone.utc).isoformat()
        log_entry = f"[{timestamp}] ERROR: {message}"
        print(log_entry, file=sys.stderr)
        
        log_file = self.logs_dir / 'event-integration.log'
        with open(log_file, 'a') as f:
            f.write(log_entry + '\n')
    
    def _log_warning(self, message: str):
        """Log warning message"""
        timestamp = datetime.now(timezone.utc).isoformat()
        log_entry = f"[{timestamp}] WARNING: {message}"
        print(log_entry)
        
        log_file = self.logs_dir / 'event-integration.log'
        with open(log_file, 'a') as f:
            f.write(log_entry + '\n')

class EventSystemCLI:
    """Command line interface for event system management"""
    
    def __init__(self):
        self.integrator = EventSystemIntegrator()
    
    def start(self, daemon=False):
        """Start the event system"""
        if daemon:
            self._daemonize()
        
        try:
            self.integrator.start_integration()
            
            if not daemon:
                print("Event System Integration started. Press Ctrl+C to stop.")
                try:
                    while True:
                        time.sleep(1)
                except KeyboardInterrupt:
                    print("\nShutting down...")
        except Exception as e:
            print(f"Error starting event system: {e}")
            return 1
        finally:
            self.integrator.shutdown()
        
        return 0
    
    def stop(self):
        """Stop the event system"""
        try:
            # Find and stop the daemon process
            result = subprocess.run(['pgrep', '-f', 'event-system-integrator.py'], 
                                  capture_output=True, text=True)
            if result.returncode == 0:
                pids = result.stdout.strip().split('\n')
                for pid in pids:
                    try:
                        os.kill(int(pid), signal.SIGTERM)
                        print(f"Stopped event system process {pid}")
                    except ProcessLookupError:
                        print(f"Process {pid} was already stopped")
                    except Exception as e:
                        print(f"Error stopping process {pid}: {e}")
            else:
                print("No event system processes found")
        except Exception as e:
            print(f"Error stopping event system: {e}")
            return 1
        
        return 0
    
    def status(self):
        """Show event system status"""
        try:
            # Check if running
            result = subprocess.run(['pgrep', '-f', 'event-system-integrator.py'], 
                                  capture_output=True, text=True)
            
            if result.returncode == 0:
                print("Event System Integration: RUNNING")
                
                # Try to get detailed status
                try:
                    status = self.integrator.get_system_status()
                    self._print_status(status)
                except Exception as e:
                    print(f"Could not get detailed status: {e}")
            else:
                print("Event System Integration: STOPPED")
        except Exception as e:
            print(f"Error checking status: {e}")
            return 1
        
        return 0
    
    def _print_status(self, status: Dict[str, Any]):
        """Print formatted status information"""
        print("\n=== Event System Status ===")
        
        # Event processor stats
        event_stats = status.get('event_processor', {})
        print(f"Events Processed: {event_stats.get('events_processed', 0)}")
        print(f"Events Per Second: {event_stats.get('events_per_second', 0):.2f}")
        print(f"Average Processing Time: {event_stats.get('avg_processing_time', 0)*1000:.1f}ms")
        print(f"Uptime: {event_stats.get('uptime', 0):.1f}s")
        
        # Process status
        processes = status.get('processes', {})
        print("\n=== Process Status ===")
        for process, running in processes.items():
            status_icon = "✓" if running else "✗"
            print(f"{status_icon} {process}")
        
        # Configuration
        config = status.get('configuration', {})
        print("\n=== Configuration ===")
        for key, value in config.items():
            status_icon = "✓" if value else "✗"
            print(f"{status_icon} {key}")
    
    def _daemonize(self):
        """Daemonize the process"""
        try:
            pid = os.fork()
            if pid > 0:
                sys.exit(0)  # Parent process exits
        except OSError as e:
            print(f"Fork #1 failed: {e}")
            sys.exit(1)
        
        # Decouple from parent environment
        os.chdir("/")
        os.setsid()
        os.umask(0)
        
        # Second fork
        try:
            pid = os.fork()
            if pid > 0:
                sys.exit(0)  # Second parent exits
        except OSError as e:
            print(f"Fork #2 failed: {e}")
            sys.exit(1)
        
        # Redirect standard file descriptors
        sys.stdout.flush()
        sys.stderr.flush()
        
        with open('/dev/null', 'r') as si:
            os.dup2(si.fileno(), sys.stdin.fileno())
        with open('/dev/null', 'a+') as so:
            os.dup2(so.fileno(), sys.stdout.fileno())
        with open('/dev/null', 'a+') as se:
            os.dup2(se.fileno(), sys.stderr.fileno())

def main():
    """Main entry point"""
    import argparse
    
    parser = argparse.ArgumentParser(description='VibeSpec Event System Integration')
    parser.add_argument('command', choices=['start', 'stop', 'status', 'restart'],
                       help='Command to execute')
    parser.add_argument('--daemon', action='store_true',
                       help='Run as daemon (start command only)')
    
    args = parser.parse_args()
    
    cli = EventSystemCLI()
    
    if args.command == 'start':
        return cli.start(daemon=args.daemon)
    elif args.command == 'stop':
        return cli.stop()
    elif args.command == 'status':
        return cli.status()
    elif args.command == 'restart':
        cli.stop()
        time.sleep(2)
        return cli.start(daemon=True)
    
    return 0

if __name__ == "__main__":
    sys.exit(main())