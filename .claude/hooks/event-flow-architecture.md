# Event Flow Architecture for VibeSpec Hook Infrastructure

## Overview

This document defines the comprehensive event flow architecture that orchestrates the VibeSpec multi-agent workflow system. The architecture is designed to handle thousands of events per second with sub-100ms latency while guaranteeing zero event loss.

## Event Flow Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Event Source  │    │   Event Router  │    │ Priority Queues │
│                 │    │                 │    │                 │
│ • File Changes  │───▶│ • Route Table   │───▶│ • Critical      │
│ • Tool Usage    │    │ • Filters       │    │ • High          │
│ • Git Actions   │    │ • Deduplication │    │ • Normal        │
│ • Workflow Ops  │    │ • Load Balance  │    │ • Low           │
│ • Agent Events  │    │ • Circuit Break │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       ▼
         │                       │            ┌─────────────────┐
         │                       │            │ Event Processor │
         │                       │            │                 │
         │                       │            │ • Batch Process │
         │                       │            │ • Handler Exec  │
         │                       │            │ • Error Retry   │
         │                       │            │ • Dead Letter   │
         │                       │            └─────────────────┘
         │                       │                       │
         │                       │                       ▼
         │                       │            ┌─────────────────┐
         │                       │            │  Hook Handlers  │
         │                       │            │                 │
         │                       │            │ • file-watcher  │
         │                       │            │ • post-tool-use │
         │                       │            │ • sub-agent-stop│
         │                       │            │ • pre-commit    │
         │                       │            └─────────────────┘
         │                       │                       │
         │                       │                       ▼
         │                       │            ┌─────────────────┐
         │                       │            │ Agent Triggers  │
         │                       │            │                 │
         │                       │            │ • compliance    │
         │                       │            │ • reviewer      │
         │                       │            │ • ui-enhancer   │
         │                       │            │ • spec-guardian │
         │                       │            └─────────────────┘
         │                       │                       │
         │                       ▼                       ▼
    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
    │ State Manager   │    │ Performance     │    │ Recovery System │
    │                 │    │ Monitor         │    │                 │
    │ • Session State │    │                 │    │ • Event Replay  │
    │ • Workflow State│    │ • Latency Track │    │ • Dead Letter Q │
    │ • Agent Context │    │ • Throughput    │    │ • Circuit Break │
    │ • File Snapshots│    │ • Error Rates   │    │ • Retry Logic   │
    └─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Event Propagation Patterns

### 1. Immediate Propagation
For critical events that require immediate processing:

```
Event → Router → Handler (< 50ms)
```

**Use Cases:**
- Workflow failures
- Security violations  
- Critical errors
- System alerts

**Implementation:**
- Synchronous processing
- No batching
- Direct handler invocation
- Timeout: 50ms max

### 2. Batched Propagation  
For high-volume events that can be processed in groups:

```
Events → Accumulator → Batch Processor → Handlers (< 2s)
```

**Use Cases:**
- File change events
- Performance metrics
- Usage tracking
- Compliance checks

**Implementation:**
- Configurable batch sizes (5-100 events)
- Time-based batching (max 2s wait)
- Efficient bulk processing
- State compression

### 3. Asynchronous Propagation
For events that don't require immediate feedback:

```
Event → Queue → Background Processor → Handler
```

**Use Cases:**
- Documentation updates
- Archive operations
- Metric aggregation
- Cleanup tasks

**Implementation:**
- Background processing pools
- Configurable delays
- Error tolerance
- Optional persistence

## State Synchronization Mechanisms

### Workflow State Synchronization

```typescript
interface WorkflowState {
  session_id: string;
  workflow_id: string;
  current_stage: string;
  agent_progress: {
    [agent_name: string]: {
      status: 'pending' | 'running' | 'completed' | 'failed';
      start_time: timestamp;
      end_time?: timestamp;
      context: object;
      outputs: object[];
    }
  };
  shared_context: object;
  performance_metrics: {
    total_duration: number;
    agent_durations: { [agent: string]: number };
    memory_usage: number;
    event_count: number;
  };
}
```

**Synchronization Strategy:**
- Write-through caching to filesystem
- Optimistic locking for concurrent updates
- Event-sourced state reconstruction
- Incremental state updates only

### Agent Context Propagation

```typescript
interface AgentContext {
  session_context: {
    files_modified: string[];
    tools_used: string[];
    workflow_progress: object;
    user_intent: string;
  };
  predecessor_outputs: {
    [agent_name: string]: {
      summary: string;
      structured_data: object;
      recommendations: string[];
    }
  };
  environmental_context: {
    project_structure: object;
    recent_changes: object[];
    performance_baseline: object;
  };
}
```

**Propagation Efficiency:**
- Lazy loading of context data
- Delta-based updates
- Compression for large contexts
- TTL-based cache eviction

## Queue Management Architecture

### Priority Queue System

```
Critical Queue    (P0) │ ████████████████████ │ 1000 events max
High Queue        (P1) │ ████████████████████ │ 5000 events max  
Normal Queue      (P2) │ ████████████████████ │10000 events max
Low Queue         (P3) │ ████████████████████ │20000 events max
```

**Processing Order:**
1. Critical: Process immediately (< 50ms)
2. High: Process within 100ms 
3. Normal: Process within 500ms
4. Low: Process within 1000ms

**Queue Management:**
- Round-robin within priority levels
- Load-based queue switching
- Overflow handling with dropping policies
- Dead letter queues for failed events

### Batch Processing Optimization

```python
class EventBatcher:
    def __init__(self):
        self.batch_size = 50
        self.timeout_ms = 2000
        self.min_batch_size = 5
        
    def should_process_batch(self, events, last_flush):
        return (
            len(events) >= self.batch_size or
            (len(events) >= self.min_batch_size and 
             time_since(last_flush) > self.timeout_ms) or
            any(event.priority == 'critical' for event in events)
        )
```

**Optimization Strategies:**
- Dynamic batch sizing based on load
- Event type grouping for efficiency
- Parallel batch processing
- Smart timeout adjustment

## Recovery and Resilience Patterns

### Circuit Breaker Implementation

```python
class EventCircuitBreaker:
    def __init__(self):
        self.failure_threshold = 5
        self.recovery_timeout = 30000  # 30s
        self.state = 'CLOSED'  # CLOSED, OPEN, HALF_OPEN
        self.failure_count = 0
        self.last_failure_time = None
        
    def call(self, handler, event):
        if self.state == 'OPEN':
            if self.should_attempt_reset():
                self.state = 'HALF_OPEN'
            else:
                raise CircuitBreakerOpenError()
                
        try:
            result = handler(event)
            self.on_success()
            return result
        except Exception as e:
            self.on_failure()
            raise
```

**Circuit Breaker States:**
- **CLOSED**: Normal operation, monitoring failures
- **HALF_OPEN**: Testing if service recovered
- **OPEN**: Failing fast, preventing cascade failures

### Event Replay System

```python
class EventReplayManager:
    def replay_from_timestamp(self, timestamp):
        """Replay events from persistent store"""
        events = self.event_store.get_events_since(timestamp)
        
        for event in events:
            # Reconstruct event context
            event.context = self.rebuild_context(event)
            
            # Apply idempotency checks
            if not self.is_duplicate(event):
                self.event_router.route(event)
                
    def rebuild_context(self, event):
        """Rebuild event context from state snapshots"""
        snapshot = self.state_store.get_snapshot_at(event.timestamp)
        return self.context_builder.build(snapshot, event)
```

**Replay Capabilities:**
- Point-in-time recovery
- Selective event replay
- Context reconstruction
- Idempotency guarantees

### Dead Letter Queue Processing

```python
class DeadLetterProcessor:
    def process_dlq_events(self):
        """Process events from dead letter queue"""
        for event in self.dlq.get_events():
            # Analyze failure reason
            failure_info = self.analyze_failure(event)
            
            if failure_info.is_transient:
                # Retry with exponential backoff
                self.schedule_retry(event, failure_info.delay)
            elif failure_info.is_fixable:
                # Apply automatic fixes if possible
                fixed_event = self.apply_fixes(event, failure_info)
                self.event_router.route(fixed_event)
            else:
                # Manual intervention required
                self.alert_manager.send_alert(event, failure_info)
```

## Performance Optimization Strategies

### Event Deduplication

```python
class EventDeduplicator:
    def __init__(self):
        self.dedup_windows = {}  # event_type -> window_ms
        self.recent_events = {}  # event_type -> circular_buffer
        
    def is_duplicate(self, event):
        """Check if event is duplicate within dedup window"""
        window = self.dedup_windows.get(event.type, 1000)
        recent = self.recent_events.get(event.type, [])
        
        # Check for duplicates within time window
        cutoff = event.timestamp - window
        for prev_event in recent:
            if (prev_event.timestamp > cutoff and 
                self.events_match(event, prev_event)):
                return True
                
        # Add to recent events
        self.add_to_recent(event)
        return False
```

### Load Balancing and Throttling

```python
class EventLoadBalancer:
    def __init__(self):
        self.handlers = []
        self.current_loads = {}
        self.max_concurrent_per_handler = 10
        
    def select_handler(self, event):
        """Select best handler based on current load"""
        available_handlers = [
            h for h in self.handlers 
            if self.current_loads.get(h.id, 0) < self.max_concurrent_per_handler
        ]
        
        if not available_handlers:
            # All handlers at capacity
            return self.get_least_loaded_handler()
            
        # Round-robin among available handlers
        return min(available_handlers, key=lambda h: self.current_loads.get(h.id, 0))
```

### Memory Management

```python
class EventMemoryManager:
    def __init__(self):
        self.max_memory_mb = 100
        self.current_memory = 0
        self.event_store_size_limit = 10000
        
    def check_memory_usage(self):
        """Monitor and manage memory usage"""
        if self.current_memory > self.max_memory_mb * 0.8:
            # Trigger cleanup
            self.cleanup_old_events()
            self.compress_state_data()
            self.evict_cached_contexts()
            
    def cleanup_old_events(self):
        """Remove old events from memory"""
        cutoff = time.time() - 3600  # 1 hour
        self.event_store = [
            e for e in self.event_store 
            if e.timestamp > cutoff
        ]
```

## Integration with Workflow System

### Workflow Event Bridge

```python
class WorkflowEventBridge:
    def __init__(self):
        self.active_workflows = {}
        self.workflow_event_mappings = {
            'file.modified': ['compliance', 'spec-guardian'],
            'git.commit': ['pre-commit'],
            'workflow.started': ['performance-monitor'],
            'agent.completed': ['sub-agent-stop']
        }
        
    def route_to_workflow(self, event):
        """Route events to appropriate workflow stages"""
        if event.workflow_id in self.active_workflows:
            workflow = self.active_workflows[event.workflow_id]
            workflow.handle_event(event)
        else:
            # Start new workflow if needed
            self.maybe_start_workflow(event)
```

### Agent Coordination Events

```python
class AgentCoordinationEvents:
    """Events for coordinating agent execution"""
    
    def on_agent_started(self, agent_name, context):
        """Notify when agent starts"""
        event = Event(
            type='agent.started',
            data={
                'agent': agent_name,
                'context': context,
                'timestamp': time.time()
            }
        )
        self.event_router.route(event)
        
    def on_agent_progress(self, agent_name, progress):
        """Notify of agent progress"""
        event = Event(
            type='agent.progress',
            data={
                'agent': agent_name,
                'progress': progress,
                'timestamp': time.time()
            }
        )
        self.event_router.route(event)
```

## Real-time vs Batch Processing Decisions

### Decision Matrix

| Event Type | Volume | Latency Req | Processing Mode | Reasoning |
|------------|--------|-------------|-----------------|-----------|
| file.created | High | Low | Batched | Can group similar operations |
| file.modified | High | Medium | Batched | Benefits from deduplication |
| workflow.failed | Low | Critical | Real-time | Immediate attention required |
| agent.completed | Medium | Medium | Real-time | Enables immediate chaining |
| performance.metrics | High | Low | Batched | Aggregation is more valuable |
| naming.violation | Low | High | Real-time | Quick feedback important |
| git.commit | Low | High | Real-time | Blocks user workflow |
| tool.used | High | Low | Batched | Usage patterns more important |

### Processing Mode Selection Algorithm

```python
def select_processing_mode(event):
    """Dynamically select processing mode"""
    
    # Critical events always go real-time
    if event.priority == 'critical':
        return ProcessingMode.REALTIME
        
    # Check current system load
    if system_load() > 0.8:
        # Prefer batching under high load
        return ProcessingMode.BATCHED
        
    # Check event characteristics
    if event.type in HIGH_VOLUME_EVENTS:
        return ProcessingMode.BATCHED
    elif event.type in USER_BLOCKING_EVENTS:
        return ProcessingMode.REALTIME
    else:
        return ProcessingMode.BATCHED
```

## Cross-Session Event Persistence

### Event Store Architecture

```python
class EventStore:
    def __init__(self):
        self.storage_backend = FileSystemBackend()
        self.index = EventIndex()
        self.compression = True
        
    def append_event(self, event):
        """Append event to persistent store"""
        serialized = self.serialize_event(event)
        if self.compression:
            serialized = compress(serialized)
            
        self.storage_backend.append(serialized)
        self.index.add_entry(event.id, event.timestamp, event.type)
        
    def query_events(self, start_time, end_time, event_types=None):
        """Query events by time range and type"""
        entries = self.index.query(start_time, end_time, event_types)
        events = []
        
        for entry in entries:
            data = self.storage_backend.read(entry.offset, entry.length)
            if self.compression:
                data = decompress(data)
            events.append(self.deserialize_event(data))
            
        return events
```

### Session Continuity Management

```python
class SessionContinuityManager:
    def __init__(self):
        self.session_store = SessionStore()
        self.event_store = EventStore()
        
    def restore_session_context(self, session_id):
        """Restore context from previous session"""
        session_data = self.session_store.get(session_id)
        if not session_data:
            return None
            
        # Get events since last checkpoint
        last_checkpoint = session_data.last_checkpoint
        recent_events = self.event_store.query_events(
            start_time=last_checkpoint,
            end_time=time.time()
        )
        
        # Rebuild context from events
        context = self.rebuild_context(session_data.base_context, recent_events)
        return context
        
    def create_checkpoint(self, session_id, context):
        """Create checkpoint for session continuity"""
        self.session_store.update(session_id, {
            'base_context': context,
            'last_checkpoint': time.time()
        })
```

This event flow architecture provides a robust, high-performance foundation for the VibeSpec hook infrastructure, ensuring reliable event processing, state management, and agent coordination while maintaining the performance targets of sub-100ms latency and zero event loss.