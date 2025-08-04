# Integration Patterns for VibeSpec Event System

## Overview

This document defines the integration patterns that enable seamless communication between the event system, hook infrastructure, workflow orchestration, and agent coordination mechanisms. These patterns ensure efficient event aggregation, cross-session persistence, and optimal real-time vs batch processing decisions.

## Hook Communication Patterns

### 1. Event Bridge Pattern

The Event Bridge acts as the central communication hub between hooks and the workflow system:

```python
class EventBridge:
    """Central communication bridge for hook-workflow integration"""
    
    def __init__(self):
        self.event_processor = get_event_processor()
        self.workflow_manager = WorkflowManager()
        self.active_sessions = {}
        
    def hook_to_workflow(self, hook_name: str, hook_output: Dict[str, Any]):
        """Bridge hook output to workflow events"""
        
        # Map hook outputs to workflow events
        event_mappings = {
            'file-watcher': self._handle_file_watcher_output,
            'post-tool-use': self._handle_post_tool_use_output,
            'sub-agent-stop': self._handle_sub_agent_stop_output,
            'pre-commit': self._handle_pre_commit_output
        }
        
        handler = event_mappings.get(hook_name)
        if handler:
            events = handler(hook_output)
            for event in events:
                self.event_processor.submit_event(event)
    
    def _handle_file_watcher_output(self, output: Dict[str, Any]) -> List[Event]:
        """Convert file watcher output to events"""
        events = []
        
        for file_change in output.get('changes', []):
            event = Event(
                id=f"file-{file_change['action']}-{int(time.time()*1000)}",
                type=f"file.{file_change['action']}",
                timestamp=time.time(),
                priority=Priority.NORMAL,
                data={
                    'file_path': file_change['path'],
                    'file_type': file_change.get('type', 'unknown'),
                    'size': file_change.get('size', 0)
                }
            )
            events.append(event)
            
        return events
```

### 2. Hook Chaining Pattern

Enables sequential hook execution with context passing:

```python
class HookChain:
    """Orchestrate sequential hook execution"""
    
    def __init__(self):
        self.chain_definitions = {
            'code-review': [
                'compliance-checker',
                'security-scanner', 
                'performance-analyzer',
                'ui-validator'
            ],
            'pre-commit': [
                'lint-checker',
                'test-runner',
                'security-scan',
                'build-validator'
            ]
        }
    
    async def execute_chain(self, chain_name: str, initial_context: Dict[str, Any]):
        """Execute hook chain with context propagation"""
        chain = self.chain_definitions.get(chain_name, [])
        context = initial_context.copy()
        results = []
        
        for hook_name in chain:
            # Execute hook with accumulated context
            result = await self._execute_hook(hook_name, context)
            results.append(result)
            
            # Update context with hook output
            context.update(result.get('context_updates', {}))
            
            # Check if chain should continue
            if result.get('stop_chain', False):
                break
                
        return {
            'chain_name': chain_name,
            'results': results,
            'final_context': context
        }
```

### 3. Hook Aggregation Pattern

Combines outputs from multiple parallel hooks:

```python
class HookAggregator:
    """Aggregate outputs from parallel hook executions"""
    
    def __init__(self):
        self.aggregation_rules = {
            'review-summary': {
                'hooks': ['compliance', 'reviewer', 'ui-enhancer'],
                'aggregator': self._aggregate_review_results
            },
            'validation-result': {
                'hooks': ['spec-guardian', 'compliance'],
                'aggregator': self._aggregate_validation_results
            }
        }
    
    def aggregate_results(self, aggregation_type: str, hook_results: Dict[str, Any]) -> Dict[str, Any]:
        """Aggregate hook results based on type"""
        rule = self.aggregation_rules.get(aggregation_type)
        if not rule:
            return hook_results
            
        return rule['aggregator'](hook_results)
    
    def _aggregate_review_results(self, results: Dict[str, Any]) -> Dict[str, Any]:
        """Aggregate code review results"""
        aggregated = {
            'overall_score': 0,
            'critical_issues': [],
            'recommendations': [],
            'positive_findings': [],
            'metrics': {}
        }
        
        total_score = 0
        agent_count = 0
        
        for agent_name, result in results.items():
            if 'score' in result:
                total_score += result['score']
                agent_count += 1
                
            aggregated['critical_issues'].extend(result.get('critical_issues', []))
            aggregated['recommendations'].extend(result.get('recommendations', []))
            aggregated['positive_findings'].extend(result.get('positive_findings', []))
            
            # Merge metrics
            if 'metrics' in result:
                aggregated['metrics'][agent_name] = result['metrics']
        
        if agent_count > 0:
            aggregated['overall_score'] = total_score / agent_count
            
        return aggregated
```

## Event Aggregation for Efficiency

### 1. Temporal Aggregation

Groups events by time windows for batch processing:

```python
class TemporalAggregator:
    """Aggregate events within time windows"""
    
    def __init__(self):
        self.time_windows = {
            'file.modified': 5000,    # 5 second window
            'tool.used': 10000,       # 10 second window
            'performance.metric': 30000  # 30 second window
        }
        self.event_buffers = defaultdict(list)
        self.last_flush_times = defaultdict(float)
    
    def aggregate_event(self, event: Event) -> Optional[Event]:
        """Add event to aggregation buffer, return aggregated event if ready"""
        event_type = event.type
        window_ms = self.time_windows.get(event_type, 0)
        
        if window_ms == 0:
            return event  # No aggregation for this type
        
        # Add to buffer
        self.event_buffers[event_type].append(event)
        
        # Check if window is complete
        now = time.time() * 1000
        last_flush = self.last_flush_times.get(event_type, 0)
        
        if (now - last_flush) >= window_ms:
            # Create aggregated event
            buffer = self.event_buffers[event_type]
            aggregated = self._create_aggregated_event(event_type, buffer)
            
            # Clear buffer and update flush time
            self.event_buffers[event_type].clear()
            self.last_flush_times[event_type] = now
            
            return aggregated
            
        return None
    
    def _create_aggregated_event(self, event_type: str, events: List[Event]) -> Event:
        """Create aggregated event from buffer"""
        if not events:
            return None
            
        first_event = events[0]
        last_event = events[-1]
        
        aggregated_data = {
            'event_count': len(events),
            'time_span': {
                'start': first_event.timestamp,
                'end': last_event.timestamp
            },
            'events': [e.to_dict() for e in events]
        }
        
        # Type-specific aggregation
        if event_type == 'file.modified':
            aggregated_data.update(self._aggregate_file_events(events))
        elif event_type == 'tool.used':
            aggregated_data.update(self._aggregate_tool_events(events))
        elif event_type == 'performance.metric':
            aggregated_data.update(self._aggregate_performance_events(events))
        
        return Event(
            id=f"aggregated-{event_type}-{int(time.time()*1000)}",
            type=f"{event_type}.aggregated",
            timestamp=last_event.timestamp,
            priority=max(e.priority for e in events),
            data=aggregated_data,
            context=last_event.context
        )
```

### 2. Semantic Aggregation

Groups related events based on semantic meaning:

```python
class SemanticAggregator:
    """Aggregate events based on semantic relationships"""
    
    def __init__(self):
        self.semantic_groups = {
            'feature-development': {
                'event_types': ['file.created', 'file.modified', 'tool.used'],
                'correlation_window': 300000,  # 5 minutes
                'correlation_rules': self._correlate_feature_development
            },
            'bug-fix': {
                'event_types': ['file.modified', 'git.commit', 'agent.completed'],
                'correlation_window': 180000,  # 3 minutes
                'correlation_rules': self._correlate_bug_fix
            }
        }
        self.event_cache = deque(maxlen=1000)
    
    def process_event(self, event: Event) -> List[Event]:
        """Process event and return any semantic aggregations"""
        self.event_cache.append(event)
        
        aggregations = []
        for group_name, config in self.semantic_groups.items():
            if event.type in config['event_types']:
                aggregation = self._check_for_aggregation(group_name, config, event)
                if aggregation:
                    aggregations.append(aggregation)
        
        return aggregations
    
    def _correlate_feature_development(self, events: List[Event]) -> Optional[Dict[str, Any]]:
        """Check if events represent feature development activity"""
        # Look for patterns: file creation + modifications + tool usage
        file_events = [e for e in events if e.type.startswith('file.')]
        tool_events = [e for e in events if e.type == 'tool.used']
        
        if len(file_events) >= 3 and len(tool_events) >= 2:
            # Extract feature context
            files_affected = set()
            for event in file_events:
                files_affected.add(event.data.get('file_path', ''))
            
            return {
                'activity_type': 'feature_development',
                'files_affected': list(files_affected),
                'event_count': len(events),
                'confidence': 0.8
            }
        
        return None
```

## Cross-Session Event Persistence

### 1. Session-Aware Event Store

Maintains event history across Claude Code sessions:

```python
class SessionAwareEventStore:
    """Persistent event storage with session awareness"""
    
    def __init__(self):
        self.storage_dir = Path('.claude/event-store')
        self.storage_dir.mkdir(exist_ok=True)
        self.current_session_id = None
        self.session_index = self._load_session_index()
        
    def start_session(self, session_id: str):
        """Start new session for event tracking"""
        self.current_session_id = session_id
        
        # Create session metadata
        session_meta = {
            'session_id': session_id,
            'start_time': time.time(),
            'event_count': 0,
            'file_path': f"session-{session_id}.jsonl"
        }
        
        self.session_index[session_id] = session_meta
        self._save_session_index()
    
    def store_event(self, event: Event):
        """Store event with session context"""
        if not self.current_session_id:
            self.start_session(f"auto-{int(time.time())}")
        
        # Add session context to event
        event.session_id = self.current_session_id
        
        # Append to session file
        session_file = self.storage_dir / f"session-{self.current_session_id}.jsonl"
        with open(session_file, 'a') as f:
            f.write(json.dumps(event.to_dict()) + '\n')
        
        # Update session metadata
        self.session_index[self.current_session_id]['event_count'] += 1
        self._save_session_index()
    
    def query_session_events(self, session_id: str, 
                           event_types: Optional[List[str]] = None,
                           start_time: Optional[float] = None,
                           end_time: Optional[float] = None) -> List[Event]:
        """Query events from specific session"""
        if session_id not in self.session_index:
            return []
        
        session_file = self.storage_dir / f"session-{session_id}.jsonl"
        if not session_file.exists():
            return []
        
        events = []
        with open(session_file) as f:
            for line in f:
                try:
                    event_data = json.loads(line.strip())
                    event = Event.from_dict(event_data)
                    
                    # Apply filters
                    if event_types and event.type not in event_types:
                        continue
                    if start_time and event.timestamp < start_time:
                        continue
                    if end_time and event.timestamp > end_time:
                        continue
                    
                    events.append(event)
                except Exception as e:
                    continue  # Skip malformed events
        
        return events
    
    def get_session_context(self, session_id: str) -> Dict[str, Any]:
        """Get rich context for session"""
        events = self.query_session_events(session_id)
        
        context = {
            'session_id': session_id,
            'event_count': len(events),
            'time_span': {},
            'activity_summary': {},
            'files_modified': set(),
            'agents_used': set(),
            'workflows_executed': set()
        }
        
        if events:
            context['time_span'] = {
                'start': min(e.timestamp for e in events),
                'end': max(e.timestamp for e in events)
            }
            
            # Analyze activity patterns
            for event in events:
                if event.type.startswith('file.'):
                    context['files_modified'].add(event.data.get('file_path', ''))
                elif event.type.startswith('agent.'):
                    context['agents_used'].add(event.data.get('agent', ''))
                elif event.type.startswith('workflow.'):
                    context['workflows_executed'].add(event.data.get('workflow', ''))
        
        # Convert sets to lists for JSON serialization
        context['files_modified'] = list(context['files_modified'])
        context['agents_used'] = list(context['agents_used'])
        context['workflows_executed'] = list(context['workflows_executed'])
        
        return context
```

### 2. Cross-Session State Reconstruction

Rebuilds state from event history:

```python
class StateReconstructor:
    """Reconstruct state from event history"""
    
    def __init__(self):
        self.event_store = SessionAwareEventStore()
        self.state_builders = {
            'workflow_state': self._build_workflow_state,
            'file_state': self._build_file_state,
            'agent_state': self._build_agent_state,
            'session_state': self._build_session_state
        }
    
    def reconstruct_state(self, session_id: str, state_type: str) -> Dict[str, Any]:
        """Reconstruct specific state type from events"""
        events = self.event_store.query_session_events(session_id)
        
        builder = self.state_builders.get(state_type)
        if not builder:
            raise ValueError(f"Unknown state type: {state_type}")
        
        return builder(events)
    
    def _build_workflow_state(self, events: List[Event]) -> Dict[str, Any]:
        """Reconstruct workflow state from events"""
        state = {
            'active_workflows': {},
            'completed_workflows': {},
            'workflow_history': []
        }
        
        for event in events:
            if event.type == 'workflow.started':
                workflow_id = event.data.get('workflow_id')
                state['active_workflows'][workflow_id] = {
                    'start_time': event.timestamp,
                    'workflow_type': event.data.get('workflow_type'),
                    'agents': [],
                    'status': 'running'
                }
            elif event.type == 'workflow.completed':
                workflow_id = event.data.get('workflow_id')
                if workflow_id in state['active_workflows']:
                    workflow = state['active_workflows'].pop(workflow_id)
                    workflow['end_time'] = event.timestamp
                    workflow['status'] = 'completed'
                    state['completed_workflows'][workflow_id] = workflow
        
        return state
    
    def _build_file_state(self, events: List[Event]) -> Dict[str, Any]:
        """Reconstruct file state from events"""
        state = {
            'file_states': {},
            'recent_changes': []
        }
        
        for event in events:
            if event.type.startswith('file.'):
                file_path = event.data.get('file_path')
                if file_path:
                    state['file_states'][file_path] = {
                        'last_action': event.type.split('.')[1],
                        'last_modified': event.timestamp,
                        'change_count': state['file_states'].get(file_path, {}).get('change_count', 0) + 1
                    }
                    
                    state['recent_changes'].append({
                        'file_path': file_path,
                        'action': event.type.split('.')[1],
                        'timestamp': event.timestamp
                    })
        
        # Keep only recent changes
        cutoff = time.time() - 3600  # 1 hour
        state['recent_changes'] = [
            c for c in state['recent_changes']
            if c['timestamp'] > cutoff
        ]
        
        return state
```

## Real-time vs Batch Processing Decisions

### 1. Dynamic Processing Mode Selection

Intelligently chooses processing mode based on system state:

```python
class ProcessingModeSelector:
    """Dynamic selection of processing mode based on system conditions"""
    
    def __init__(self):
        self.system_metrics = SystemMetrics()
        self.load_thresholds = {
            'cpu_high': 80,      # CPU usage %
            'memory_high': 85,   # Memory usage %
            'queue_high': 1000,  # Queue depth
            'latency_high': 200  # Latency in ms
        }
        
    def select_mode(self, event: Event, current_load: Dict[str, float]) -> ProcessingMode:
        """Select optimal processing mode for event"""
        
        # Critical events always go real-time
        if event.priority == Priority.CRITICAL:
            return ProcessingMode.IMMEDIATE
        
        # Check system load
        high_load_indicators = 0
        
        if current_load.get('cpu_percent', 0) > self.load_thresholds['cpu_high']:
            high_load_indicators += 1
        if current_load.get('memory_percent', 0) > self.load_thresholds['memory_high']:
            high_load_indicators += 1
        if current_load.get('queue_depth', 0) > self.load_thresholds['queue_high']:
            high_load_indicators += 1
        if current_load.get('avg_latency_ms', 0) > self.load_thresholds['latency_high']:
            high_load_indicators += 1
        
        # If system is under high load, prefer batching
        if high_load_indicators >= 2:
            return ProcessingMode.BATCHED
        
        # Check event characteristics
        event_config = self._get_event_config(event.type)
        
        # User-blocking events should be immediate
        if event_config.get('user_blocking', False):
            return ProcessingMode.IMMEDIATE
        
        # High-volume events should be batched
        if event_config.get('high_volume', False):
            return ProcessingMode.BATCHED
        
        # Default based on priority
        if event.priority in [Priority.HIGH]:
            return ProcessingMode.IMMEDIATE
        else:
            return ProcessingMode.BATCHED
    
    def _get_event_config(self, event_type: str) -> Dict[str, Any]:
        """Get configuration for event type"""
        event_configs = {
            'git.commit': {'user_blocking': True, 'high_volume': False},
            'file.modified': {'user_blocking': False, 'high_volume': True},
            'agent.completed': {'user_blocking': True, 'high_volume': False},
            'tool.used': {'user_blocking': False, 'high_volume': True},
            'workflow.failed': {'user_blocking': True, 'high_volume': False},
            'performance.metric': {'user_blocking': False, 'high_volume': True}
        }
        
        return event_configs.get(event_type, {})
```

### 2. Adaptive Batching Strategy

Adjusts batch parameters based on system performance:

```python
class AdaptiveBatcher:
    """Adaptive batching that adjusts parameters based on performance"""
    
    def __init__(self):
        self.base_config = {
            'max_batch_size': 50,
            'min_batch_size': 5,
            'timeout_ms': 2000
        }
        self.current_config = self.base_config.copy()
        self.performance_history = deque(maxlen=100)
        self.adjustment_cooldown = 30  # seconds
        self.last_adjustment = 0
        
    def adapt_configuration(self, performance_metrics: Dict[str, float]):
        """Adapt batch configuration based on performance"""
        now = time.time()
        if now - self.last_adjustment < self.adjustment_cooldown:
            return
        
        self.performance_history.append(performance_metrics)
        
        if len(self.performance_history) < 10:
            return  # Need more data
        
        # Calculate performance trends
        recent_metrics = list(self.performance_history)[-10:]
        avg_latency = sum(m.get('avg_latency_ms', 0) for m in recent_metrics) / len(recent_metrics)
        avg_throughput = sum(m.get('events_per_second', 0) for m in recent_metrics) / len(recent_metrics)
        
        # Adjust batch size based on performance
        if avg_latency > 150:  # Too slow
            # Reduce batch size to improve latency
            self.current_config['max_batch_size'] = max(
                self.current_config['max_batch_size'] - 5,
                self.base_config['min_batch_size']
            )
            self.current_config['timeout_ms'] = max(
                self.current_config['timeout_ms'] - 200,
                500
            )
        elif avg_latency < 50 and avg_throughput < 100:  # Too much overhead
            # Increase batch size to improve throughput
            self.current_config['max_batch_size'] = min(
                self.current_config['max_batch_size'] + 10,
                200
            )
            self.current_config['timeout_ms'] = min(
                self.current_config['timeout_ms'] + 500,
                5000
            )
        
        self.last_adjustment = now
    
    def get_current_config(self) -> Dict[str, int]:
        """Get current batch configuration"""
        return self.current_config.copy()
```

### 3. Hybrid Processing Pipeline

Combines real-time and batch processing optimally:

```python
class HybridProcessor:
    """Hybrid processor that optimally combines real-time and batch processing"""
    
    def __init__(self):
        self.realtime_processor = RealtimeProcessor()
        self.batch_processor = BatchProcessor()
        self.mode_selector = ProcessingModeSelector()
        self.adaptive_batcher = AdaptiveBatcher()
        
    async def process_event(self, event: Event) -> Dict[str, Any]:
        """Process event using optimal strategy"""
        
        # Get current system metrics
        system_load = self._get_system_load()
        
        # Select processing mode
        mode = self.mode_selector.select_mode(event, system_load)
        
        if mode == ProcessingMode.IMMEDIATE:
            return await self.realtime_processor.process(event)
        elif mode == ProcessingMode.BATCHED:
            return await self.batch_processor.add_to_batch(event)
        else:  # ASYNC
            return await self.async_processor.schedule(event)
    
    def _get_system_load(self) -> Dict[str, float]:
        """Get current system load metrics"""
        import psutil
        
        return {
            'cpu_percent': psutil.cpu_percent(interval=0.1),
            'memory_percent': psutil.virtual_memory().percent,
            'queue_depth': sum(q.qsize() for q in self.queues.values()),
            'avg_latency_ms': self._calculate_avg_latency()
        }
```

## Performance Monitoring Integration

### 1. Event Flow Metrics

Comprehensive metrics collection for event processing:

```python
class EventFlowMetrics:
    """Collect and analyze event flow performance metrics"""
    
    def __init__(self):
        self.metrics = {
            'event_counts': defaultdict(int),
            'processing_times': defaultdict(list),
            'queue_depths': defaultdict(list),
            'error_rates': defaultdict(float),
            'throughput': defaultdict(float)
        }
        
    def record_event_processed(self, event_type: str, processing_time: float):
        """Record event processing metrics"""
        self.metrics['event_counts'][event_type] += 1
        self.metrics['processing_times'][event_type].append(processing_time)
        
        # Keep only recent processing times
        if len(self.metrics['processing_times'][event_type]) > 1000:
            self.metrics['processing_times'][event_type] = \
                self.metrics['processing_times'][event_type][-1000:]
    
    def get_performance_summary(self) -> Dict[str, Any]:
        """Get comprehensive performance summary"""
        summary = {}
        
        for event_type in self.metrics['event_counts']:
            processing_times = self.metrics['processing_times'][event_type]
            
            if processing_times:
                summary[event_type] = {
                    'count': self.metrics['event_counts'][event_type],
                    'avg_processing_time_ms': sum(processing_times) / len(processing_times) * 1000,
                    'max_processing_time_ms': max(processing_times) * 1000,
                    'min_processing_time_ms': min(processing_times) * 1000,
                    'p95_processing_time_ms': self._percentile(processing_times, 95) * 1000,
                    'events_per_second': len(processing_times) / max(sum(processing_times), 0.001)
                }
        
        return summary
    
    def _percentile(self, data: List[float], percentile: int) -> float:
        """Calculate percentile value"""
        if not data:
            return 0
        sorted_data = sorted(data)
        index = int(len(sorted_data) * percentile / 100)
        return sorted_data[min(index, len(sorted_data) - 1)]
```

These integration patterns provide a comprehensive foundation for seamless communication between all components of the VibeSpec event system, ensuring optimal performance, reliability, and maintainability while meeting the strict sub-100ms latency and zero event loss requirements.