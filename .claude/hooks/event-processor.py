#!/usr/bin/env python3
"""
Event Processor - Core event routing and propagation engine for VibeSpec hooks
Purpose: High-performance event processing with sub-100ms latency and zero event loss
Platform: Cross-platform (Linux/macOS/WSL)

This is the central event processing engine that coordinates all hook and agent activities
in the VibeSpec workflow system.
"""

import json
import sys
import os
import time
import threading
import queue
import hashlib
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Set, Optional, Any, Callable
from collections import defaultdict, deque
from dataclasses import dataclass, asdict
from enum import Enum
import asyncio
import gzip

class Priority(Enum):
    CRITICAL = 0
    HIGH = 1
    NORMAL = 2
    LOW = 3

class ProcessingMode(Enum):
    IMMEDIATE = "immediate"
    BATCHED = "batched" 
    ASYNC = "async"

class CircuitBreakerState(Enum):
    CLOSED = "closed"
    OPEN = "open"
    HALF_OPEN = "half_open"

@dataclass
class Event:
    """Core event structure"""
    id: str
    type: str
    timestamp: float
    priority: Priority
    data: Dict[str, Any]
    context: Optional[Dict[str, Any]] = None
    session_id: Optional[str] = None
    workflow_id: Optional[str] = None
    source: Optional[str] = None
    retry_count: int = 0
    max_retries: int = 3

    def to_dict(self) -> Dict[str, Any]:
        """Convert event to dictionary"""
        return {
            'id': self.id,
            'type': self.type,
            'timestamp': self.timestamp,
            'priority': self.priority.name,
            'data': self.data,
            'context': self.context,
            'session_id': self.session_id,
            'workflow_id': self.workflow_id,
            'source': self.source,
            'retry_count': self.retry_count,
            'max_retries': self.max_retries
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Event':
        """Create event from dictionary"""
        return cls(
            id=data['id'],
            type=data['type'],
            timestamp=data['timestamp'],
            priority=Priority[data['priority']],
            data=data['data'],
            context=data.get('context'),
            session_id=data.get('session_id'),
            workflow_id=data.get('workflow_id'),
            source=data.get('source'),
            retry_count=data.get('retry_count', 0),
            max_retries=data.get('max_retries', 3)
        )

class EventDeduplicator:
    """Efficient event deduplication with configurable windows"""
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.recent_events = defaultdict(deque)
        self.cleanup_interval = 60  # seconds
        self.last_cleanup = time.time()
        
    def is_duplicate(self, event: Event) -> bool:
        """Check if event is duplicate within dedup window"""
        event_type = event.type
        window_ms = self.config.get('event_types', {}).get(event_type, {}).get('deduplication_window', 1000)
        
        if window_ms == 0:
            return False  # No deduplication for this event type
            
        self._cleanup_if_needed()
        
        # Generate event fingerprint
        fingerprint = self._generate_fingerprint(event)
        cutoff_time = event.timestamp - (window_ms / 1000.0)
        
        # Check recent events for this type
        recent = self.recent_events[event_type]
        for timestamp, fp in recent:
            if timestamp > cutoff_time and fp == fingerprint:
                return True
                
        # Add this event to recent list
        recent.append((event.timestamp, fingerprint))
        
        return False
    
    def _generate_fingerprint(self, event: Event) -> str:
        """Generate fingerprint for event deduplication"""
        # Create stable hash of event data (excluding timestamp and id)
        stable_data = {
            'type': event.type,
            'data': event.data,
            'source': event.source,
            'session_id': event.session_id,
            'workflow_id': event.workflow_id
        }
        
        # Sort keys for consistent hashing
        content = json.dumps(stable_data, sort_keys=True)
        return hashlib.sha256(content.encode()).hexdigest()[:16]
    
    def _cleanup_if_needed(self):
        """Cleanup old events from deduplication cache"""
        now = time.time()
        if now - self.last_cleanup < self.cleanup_interval:
            return
            
        # Clean up events older than max dedup window
        max_window = max(
            et.get('deduplication_window', 1000) 
            for et in self.config.get('event_types', {}).values()
        ) / 1000.0
        
        cutoff = now - max_window - 60  # Extra buffer
        
        for event_type in self.recent_events:
            recent = self.recent_events[event_type]
            while recent and recent[0][0] < cutoff:
                recent.popleft()
                
        self.last_cleanup = now

class CircuitBreaker:
    """Circuit breaker for fault tolerance"""
    
    def __init__(self, failure_threshold: int = 5, recovery_timeout: float = 30.0):
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.failure_count = 0
        self.last_failure_time = None
        self.state = CircuitBreakerState.CLOSED
        self._lock = threading.Lock()
    
    def call(self, func: Callable, *args, **kwargs):
        """Execute function with circuit breaker protection"""
        with self._lock:
            if self.state == CircuitBreakerState.OPEN:
                if self._should_attempt_reset():
                    self.state = CircuitBreakerState.HALF_OPEN
                else:
                    raise Exception("Circuit breaker is OPEN")
        
        try:
            result = func(*args, **kwargs)
            self._on_success()
            return result
        except Exception as e:
            self._on_failure()
            raise
    
    def _should_attempt_reset(self) -> bool:
        """Check if circuit breaker should attempt reset"""
        if self.last_failure_time is None:
            return True
        return time.time() - self.last_failure_time > self.recovery_timeout
    
    def _on_success(self):
        """Handle successful execution"""
        with self._lock:
            self.failure_count = 0
            self.state = CircuitBreakerState.CLOSED
    
    def _on_failure(self):
        """Handle failed execution"""
        with self._lock:
            self.failure_count += 1
            self.last_failure_time = time.time()
            
            if self.failure_count >= self.failure_threshold:
                self.state = CircuitBreakerState.OPEN

class EventBatcher:
    """Intelligent event batching for efficiency"""
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.batches = defaultdict(list)
        self.last_flush_times = defaultdict(float)
        self._lock = threading.Lock()
    
    def add_event(self, event: Event) -> Optional[List[Event]]:
        """Add event to batch, return batch if ready for processing"""
        with self._lock:
            event_type = event.type
            batch_config = self.config.get('queue_configuration', {}).get('batch_processing', {})
            
            max_batch_size = batch_config.get('max_batch_size', 100)
            timeout_ms = batch_config.get('batch_timeout_ms', 2000)
            min_batch_size = batch_config.get('min_batch_size', 5)
            
            # Add event to batch
            self.batches[event_type].append(event)
            
            # Check if batch is ready
            current_batch = self.batches[event_type]
            last_flush = self.last_flush_times.get(event_type, 0)
            time_since_last_flush = (time.time() - last_flush) * 1000  # ms
            
            should_flush = (
                len(current_batch) >= max_batch_size or
                (len(current_batch) >= min_batch_size and time_since_last_flush > timeout_ms) or
                event.priority == Priority.CRITICAL
            )
            
            if should_flush:
                batch = current_batch.copy()
                self.batches[event_type].clear()
                self.last_flush_times[event_type] = time.time()
                return batch
                
            return None

class EventProcessor:
    """Main event processing engine"""
    
    def __init__(self):
        self.base_dir = Path('.claude')
        self.hooks_dir = self.base_dir / 'hooks'
        self.state_dir = self.base_dir / 'workflow-state'
        self.logs_dir = self.base_dir / 'logs'
        self.config_dir = self.base_dir / 'config'
        
        # Ensure directories exist
        for dir_path in [self.hooks_dir, self.state_dir, self.logs_dir, self.config_dir]:
            dir_path.mkdir(parents=True, exist_ok=True)
        
        # Load configuration
        self.config = self._load_config()
        
        # Initialize components
        self.deduplicator = EventDeduplicator(self.config)
        self.batcher = EventBatcher(self.config)
        self.circuit_breakers = {}
        
        # Priority queues
        self.queues = {
            Priority.CRITICAL: queue.PriorityQueue(maxsize=1000),
            Priority.HIGH: queue.PriorityQueue(maxsize=5000),
            Priority.NORMAL: queue.PriorityQueue(maxsize=10000),
            Priority.LOW: queue.PriorityQueue(maxsize=20000)
        }
        
        # Dead letter queue
        self.dlq = queue.Queue()
        
        # Processing stats
        self.stats = {
            'events_processed': 0,
            'events_deduplicated': 0,
            'events_batched': 0,
            'events_failed': 0,
            'processing_times': deque(maxlen=1000),
            'start_time': time.time()
        }
        
        # Worker threads
        self.workers = []
        self.shutdown_event = threading.Event()
        
        # Start processing threads
        self._start_workers()
    
    def _load_config(self) -> Dict[str, Any]:
        """Load event processing configuration"""
        routing_table_file = self.hooks_dir / 'event-routing-table.json'
        hooks_config_file = self.config_dir / 'hooks.json'
        
        config = {}
        
        try:
            if routing_table_file.exists():
                with open(routing_table_file) as f:
                    config.update(json.load(f))
        except Exception as e:
            self._log_error(f"Failed to load routing table: {e}")
        
        try:
            if hooks_config_file.exists():
                with open(hooks_config_file) as f:
                    hooks_config = json.load(f)
                    config.update(hooks_config)
        except Exception as e:
            self._log_error(f"Failed to load hooks config: {e}")
        
        return config
    
    def _start_workers(self):
        """Start worker threads for processing events"""
        # Start one worker per priority level
        for priority in Priority:
            worker = threading.Thread(
                target=self._worker_loop,
                args=(priority,),
                name=f"EventWorker-{priority.name}",
                daemon=True
            )
            worker.start()
            self.workers.append(worker)
        
        # Start DLQ processor
        dlq_worker = threading.Thread(
            target=self._dlq_processor,
            name="DLQProcessor",
            daemon=True
        )
        dlq_worker.start()
        self.workers.append(dlq_worker)
    
    def _worker_loop(self, priority: Priority):
        """Main worker loop for processing events"""
        queue_obj = self.queues[priority]
        
        while not self.shutdown_event.is_set():
            try:
                # Get event from queue with timeout
                _, event = queue_obj.get(timeout=1.0)
                
                # Process event
                self._process_event(event)
                
                # Mark task as done
                queue_obj.task_done()
                
            except queue.Empty:
                continue
            except Exception as e:
                self._log_error(f"Worker error: {e}")
    
    def _process_event(self, event: Event):
        """Process a single event"""
        start_time = time.time()
        
        try:
            # Get handlers for this event type
            handlers = self._get_handlers_for_event(event)
            
            if not handlers:
                self._log_debug(f"No handlers found for event type: {event.type}")
                return
            
            # Process with each handler
            for handler_name in handlers:
                try:
                    self._invoke_handler(handler_name, event)
                except Exception as e:
                    self._log_error(f"Handler {handler_name} failed for event {event.id}: {e}")
                    
                    # If critical event fails, send to DLQ
                    if event.priority == Priority.CRITICAL:
                        self._send_to_dlq(event, f"Handler {handler_name} failed: {e}")
            
            # Update stats
            processing_time = time.time() - start_time
            self.stats['events_processed'] += 1
            self.stats['processing_times'].append(processing_time)
            
            # Log performance warning if too slow
            if processing_time > 0.1:  # 100ms threshold
                self._log_warning(f"Slow event processing: {processing_time:.3f}s for {event.type}")
                
        except Exception as e:
            self._log_error(f"Failed to process event {event.id}: {e}")
            self.stats['events_failed'] += 1
            self._send_to_dlq(event, str(e))
    
    def _get_handlers_for_event(self, event: Event) -> List[str]:
        """Get list of handlers for an event type"""
        event_config = self.config.get('event_types', {}).get(event.type, {})
        return event_config.get('handlers', [])
    
    def _invoke_handler(self, handler_name: str, event: Event):
        """Invoke a specific event handler"""
        # Get or create circuit breaker for this handler
        if handler_name not in self.circuit_breakers:
            self.circuit_breakers[handler_name] = CircuitBreaker()
        
        circuit_breaker = self.circuit_breakers[handler_name]
        
        # Execute handler with circuit breaker protection
        circuit_breaker.call(self._execute_handler, handler_name, event)
    
    def _execute_handler(self, handler_name: str, event: Event):
        """Execute the actual handler logic"""
        # Map handler names to actual implementations
        handler_map = {
            'file-watcher': self._handle_file_watcher,
            'post-tool-use': self._handle_post_tool_use,
            'sub-agent-stop': self._handle_sub_agent_stop,
            'pre-commit': self._handle_pre_commit,
            'compliance-validator': self._handle_compliance_validator,
            'spec-guardian': self._handle_spec_guardian,
            'performance-monitor': self._handle_performance_monitor,
            'workflow-state-manager': self._handle_workflow_state_manager,
            'agent-coordinator': self._handle_agent_coordinator,
            'session-tracker': self._handle_session_tracker,
            'alert-manager': self._handle_alert_manager,
            'error-recovery': self._handle_error_recovery
        }
        
        handler_func = handler_map.get(handler_name)
        if handler_func:
            handler_func(event)
        else:
            self._log_warning(f"Unknown handler: {handler_name}")
    
    def _handle_file_watcher(self, event: Event):
        """Handle file watcher events"""
        # Trigger file watcher hook
        hook_script = self.hooks_dir / 'file-watcher.py'
        if hook_script.exists():
            self._execute_hook_script(hook_script, event)
    
    def _handle_post_tool_use(self, event: Event):
        """Handle post-tool-use events"""
        hook_script = self.hooks_dir / 'post-tool-use.py'
        if hook_script.exists():
            self._execute_hook_script(hook_script, event)
    
    def _handle_sub_agent_stop(self, event: Event):
        """Handle sub-agent-stop events"""
        hook_script = self.hooks_dir / 'sub-agent-stop.py'
        if hook_script.exists():
            self._execute_hook_script(hook_script, event)
    
    def _handle_pre_commit(self, event: Event):
        """Handle pre-commit events"""
        hook_script = self.hooks_dir / 'pre-commit.sh'
        if hook_script.exists():
            self._execute_hook_script(hook_script, event)
    
    def _handle_compliance_validator(self, event: Event):
        """Handle compliance validation events"""
        # Trigger compliance agent if needed
        self._maybe_trigger_agent('compliance', event)
    
    def _handle_spec_guardian(self, event: Event):
        """Handle spec guardian events"""
        self._maybe_trigger_agent('spec-guardian', event)
    
    def _handle_performance_monitor(self, event: Event):
        """Handle performance monitoring events"""
        self._maybe_trigger_agent('performance-monitor', event)
    
    def _handle_workflow_state_manager(self, event: Event):
        """Handle workflow state management"""
        # Update workflow state based on event
        self._update_workflow_state(event)
    
    def _handle_agent_coordinator(self, event: Event):
        """Handle agent coordination events"""
        # Coordinate agent execution based on event
        self._coordinate_agents(event)
    
    def _handle_session_tracker(self, event: Event):
        """Handle session tracking events"""
        # Update session state
        self._update_session_state(event)
    
    def _handle_alert_manager(self, event: Event):
        """Handle alert management events"""
        # Send alerts for critical events
        self._send_alert(event)
    
    def _handle_error_recovery(self, event: Event):
        """Handle error recovery events"""
        # Implement error recovery logic
        self._recover_from_error(event)
    
    def _execute_hook_script(self, script_path: Path, event: Event):
        """Execute a hook script with event data"""
        import subprocess
        
        try:
            # Prepare input data for hook
            hook_input = {
                'event': event.to_dict(),
                'timestamp': time.time()
            }
            
            # Execute hook script
            result = subprocess.run(
                [str(script_path)],
                input=json.dumps(hook_input),
                text=True,
                capture_output=True,
                timeout=30
            )
            
            if result.returncode != 0:
                self._log_error(f"Hook script {script_path} failed: {result.stderr}")
            else:
                self._log_debug(f"Hook script {script_path} completed successfully")
                
        except subprocess.TimeoutExpired:
            self._log_error(f"Hook script {script_path} timed out")
        except Exception as e:
            self._log_error(f"Failed to execute hook script {script_path}: {e}")
    
    def _maybe_trigger_agent(self, agent_name: str, event: Event):
        """Check if agent should be triggered for event"""
        agent_config = self.config.get('agent_triggers', {}).get(agent_name, {})
        
        if not agent_config:
            return
        
        # Check if event type matches
        if event.type not in agent_config.get('events', []):
            return
        
        # Check conditions
        conditions = agent_config.get('conditions', {})
        if not self._check_agent_conditions(conditions, event):
            return
        
        # Check debounce
        debounce_ms = agent_config.get('debounce_ms', 0)
        if not self._check_debounce(agent_name, debounce_ms):
            return
        
        # Trigger agent
        self._trigger_agent(agent_name, event)
    
    def _check_agent_conditions(self, conditions: Dict[str, Any], event: Event) -> bool:
        """Check if agent conditions are met"""
        # Implement condition checking logic
        return True  # Simplified for now
    
    def _check_debounce(self, agent_name: str, debounce_ms: int) -> bool:
        """Check if agent is within debounce period"""
        if debounce_ms == 0:
            return True
        
        # Check last trigger time for agent
        # Simplified implementation
        return True
    
    def _trigger_agent(self, agent_name: str, event: Event):
        """Trigger a specific agent"""
        self._log_info(f"Triggering agent {agent_name} for event {event.type}")
        
        # Create agent trigger event
        trigger_event = Event(
            id=f"trigger-{agent_name}-{int(time.time() * 1000)}",
            type='agent.trigger',
            timestamp=time.time(),
            priority=Priority.HIGH,
            data={
                'agent': agent_name,
                'trigger_event': event.to_dict()
            },
            context=event.context,
            session_id=event.session_id,
            workflow_id=event.workflow_id
        )
        
        # Add to processing queue
        self.submit_event(trigger_event)
    
    def _update_workflow_state(self, event: Event):
        """Update workflow state based on event"""
        if not event.workflow_id:
            return
        
        state_file = self.state_dir / f"workflow-{event.workflow_id}.json"
        
        # Load current state
        state = {}
        if state_file.exists():
            try:
                with open(state_file) as f:
                    state = json.load(f)
            except Exception as e:
                self._log_error(f"Failed to load workflow state: {e}")
        
        # Update state based on event
        if 'events' not in state:
            state['events'] = []
        
        state['events'].append({
            'timestamp': event.timestamp,
            'type': event.type,
            'data': event.data
        })
        
        # Keep only recent events
        cutoff = time.time() - 3600  # 1 hour
        state['events'] = [
            e for e in state['events'] 
            if e['timestamp'] > cutoff
        ]
        
        # Save updated state
        try:
            with open(state_file, 'w') as f:
                json.dump(state, f, indent=2)
        except Exception as e:
            self._log_error(f"Failed to save workflow state: {e}")
    
    def _coordinate_agents(self, event: Event):
        """Coordinate agent execution"""
        # Implement agent coordination logic
        pass
    
    def _update_session_state(self, event: Event):
        """Update session state"""
        # Implement session state updates
        pass
    
    def _send_alert(self, event: Event):
        """Send alert for critical events"""
        # Implement alerting logic
        self._log_warning(f"ALERT: {event.type} - {event.data}")
    
    def _recover_from_error(self, event: Event):
        """Implement error recovery"""
        # Implement error recovery logic
        pass
    
    def _send_to_dlq(self, event: Event, reason: str):
        """Send event to dead letter queue"""
        dlq_event = {
            'event': event.to_dict(),
            'reason': reason,
            'timestamp': time.time()
        }
        
        try:
            self.dlq.put(dlq_event, timeout=1.0)
        except queue.Full:
            self._log_error("Dead letter queue is full, dropping event")
    
    def _dlq_processor(self):
        """Process events from dead letter queue"""
        while not self.shutdown_event.is_set():
            try:
                dlq_event = self.dlq.get(timeout=1.0)
                
                # Log DLQ event
                self._log_error(f"DLQ Event: {dlq_event['reason']}")
                
                # Save to persistent DLQ file
                dlq_file = self.logs_dir / 'dead-letter-queue.jsonl'
                with open(dlq_file, 'a') as f:
                    f.write(json.dumps(dlq_event) + '\n')
                
                self.dlq.task_done()
                
            except queue.Empty:
                continue
            except Exception as e:
                self._log_error(f"DLQ processor error: {e}")
    
    def submit_event(self, event: Event) -> bool:
        """Submit event for processing"""
        try:
            # Check for duplicates
            if self.deduplicator.is_duplicate(event):
                self.stats['events_deduplicated'] += 1
                self._log_debug(f"Duplicate event filtered: {event.id}")
                return True
            
            # Check if event should be batched
            processing_mode = self._get_processing_mode(event)
            
            if processing_mode == ProcessingMode.BATCHED:
                batch = self.batcher.add_event(event)
                if batch:
                    # Process batch
                    for batch_event in batch:
                        self._submit_to_queue(batch_event)
                    self.stats['events_batched'] += len(batch)
                return True
            else:
                # Process immediately
                return self._submit_to_queue(event)
                
        except Exception as e:
            self._log_error(f"Failed to submit event: {e}")
            return False
    
    def _get_processing_mode(self, event: Event) -> ProcessingMode:
        """Determine processing mode for event"""
        event_config = self.config.get('event_types', {}).get(event.type, {})
        propagation = event_config.get('propagation', {})
        
        if event.priority == Priority.CRITICAL:
            return ProcessingMode.IMMEDIATE
        
        # Check propagation configuration
        if 'immediate' in propagation and propagation['immediate']:
            return ProcessingMode.IMMEDIATE
        elif 'batched' in propagation and propagation['batched']:
            return ProcessingMode.BATCHED
        else:
            return ProcessingMode.IMMEDIATE
    
    def _submit_to_queue(self, event: Event) -> bool:
        """Submit event to appropriate priority queue"""
        try:
            queue_obj = self.queues[event.priority]
            
            # Use timestamp as priority (lower = higher priority)
            queue_obj.put((event.timestamp, event), timeout=1.0)
            return True
            
        except queue.Full:
            self._log_error(f"Queue full for priority {event.priority.name}")
            self._send_to_dlq(event, f"Queue full: {event.priority.name}")
            return False
        except Exception as e:
            self._log_error(f"Failed to submit to queue: {e}")
            return False
    
    def get_stats(self) -> Dict[str, Any]:
        """Get processing statistics"""
        processing_times = list(self.stats['processing_times'])
        
        stats = self.stats.copy()
        
        if processing_times:
            stats['avg_processing_time'] = sum(processing_times) / len(processing_times)
            stats['max_processing_time'] = max(processing_times)
            stats['min_processing_time'] = min(processing_times)
        else:
            stats['avg_processing_time'] = 0
            stats['max_processing_time'] = 0
            stats['min_processing_time'] = 0
        
        stats['uptime'] = time.time() - stats['start_time']
        stats['events_per_second'] = stats['events_processed'] / max(stats['uptime'], 1)
        
        return stats
    
    def shutdown(self):
        """Shutdown event processor"""
        self._log_info("Shutting down event processor")
        
        # Signal shutdown
        self.shutdown_event.set()
        
        # Wait for queues to empty
        for queue_obj in self.queues.values():
            queue_obj.join()
        
        self.dlq.join()
        
        # Wait for workers
        for worker in self.workers:
            worker.join(timeout=5.0)
        
        self._log_info("Event processor shutdown complete")
    
    def _log_info(self, message: str):
        """Log info message"""
        timestamp = datetime.now(timezone.utc).isoformat()
        log_entry = f"[{timestamp}] INFO: {message}"
        print(log_entry)
        
        log_file = self.logs_dir / 'event-processor.log'
        with open(log_file, 'a') as f:
            f.write(log_entry + '\n')
    
    def _log_error(self, message: str):
        """Log error message"""
        timestamp = datetime.now(timezone.utc).isoformat()
        log_entry = f"[{timestamp}] ERROR: {message}"
        print(log_entry, file=sys.stderr)
        
        log_file = self.logs_dir / 'event-processor.log'
        with open(log_file, 'a') as f:
            f.write(log_entry + '\n')
    
    def _log_warning(self, message: str):
        """Log warning message"""
        timestamp = datetime.now(timezone.utc).isoformat()
        log_entry = f"[{timestamp}] WARNING: {message}"
        print(log_entry)
        
        log_file = self.logs_dir / 'event-processor.log'
        with open(log_file, 'a') as f:
            f.write(log_entry + '\n')
    
    def _log_debug(self, message: str):
        """Log debug message"""
        if os.environ.get('EVENT_DEBUG', 'false').lower() == 'true':
            timestamp = datetime.now(timezone.utc).isoformat()
            log_entry = f"[{timestamp}] DEBUG: {message}"
            
            debug_log = self.logs_dir / 'event-processor-debug.log'
            with open(debug_log, 'a') as f:
                f.write(log_entry + '\n')

# Global event processor instance
_event_processor = None

def get_event_processor() -> EventProcessor:
    """Get global event processor instance"""
    global _event_processor
    if _event_processor is None:
        _event_processor = EventProcessor()
    return _event_processor

def submit_event(event_type: str, data: Dict[str, Any], 
                priority: Priority = Priority.NORMAL,
                context: Optional[Dict[str, Any]] = None,
                session_id: Optional[str] = None,
                workflow_id: Optional[str] = None) -> bool:
    """Convenience function to submit events"""
    event = Event(
        id=f"{event_type}-{int(time.time() * 1000000)}",
        type=event_type,
        timestamp=time.time(),
        priority=priority,
        data=data,
        context=context,
        session_id=session_id,
        workflow_id=workflow_id
    )
    
    processor = get_event_processor()
    return processor.submit_event(event)

def main():
    """Main entry point for standalone event processor"""
    processor = EventProcessor()
    
    try:
        # Keep processor running
        while True:
            time.sleep(1)
            
            # Print stats every 60 seconds
            if int(time.time()) % 60 == 0:
                stats = processor.get_stats()
                processor._log_info(f"Stats: {stats}")
                
    except KeyboardInterrupt:
        processor._log_info("Received shutdown signal")
    finally:
        processor.shutdown()

if __name__ == "__main__":
    main()