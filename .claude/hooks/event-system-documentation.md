# VibeSpec Event System Documentation

## Overview

The VibeSpec Event System is a high-performance, resilient event processing infrastructure designed to coordinate multi-agent workflows with sub-100ms latency and zero event loss guarantees. This system serves as the backbone for all hook-based automation, agent coordination, and workflow orchestration in VibeSpec projects.

## Architecture Summary

```
┌─────────────────────────────────────────────────────────────────┐
│                    VibeSpec Event System                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │Event Sources│───▶│Event Router │───▶│Event Queues │         │
│  │             │    │             │    │             │         │
│  │• File Watch │    │• Route Table│    │• Priority   │         │
│  │• Tool Usage │    │• Filters    │    │• Batching   │         │
│  │• Git Actions│    │• Dedup      │    │• Circuit Br │         │
│  │• Workflows  │    │• Load Bal   │    │• Dead Letter│         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
│                                               │                 │
│                                               ▼                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │State Manager│    │Event Process│    │Hook Handlers│         │
│  │             │    │             │    │             │         │
│  │• Session    │◀───│• Multi-thread│───▶│• file-watch │         │
│  │• Workflow   │    │• Async/Sync │    │• post-tool  │         │
│  │• Agent Ctx  │    │• Recovery   │    │• sub-agent  │         │
│  │• Persistence│    │• Monitoring │    │• pre-commit │         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
│                                               │                 │
│                                               ▼                 │
│                        ┌─────────────┐                         │
│                        │Agent Trigger│                         │
│                        │             │                         │
│                        │• compliance │                         │
│                        │• reviewer   │                         │
│                        │• ui-enhance │                         │
│                        │• spec-guard │                         │
│                        └─────────────┘                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Event Routing Table (`event-routing-table.json`)

Central configuration defining how events flow through the system:

**Key Features:**
- **Event Type Definitions**: 15 distinct event types with priority levels
- **Handler Mappings**: Which handlers process each event type
- **Filter Rules**: Include/exclude patterns for efficient processing
- **Propagation Modes**: Immediate, batched, or async processing
- **Queue Configuration**: Priority-based queues with circuit breakers
- **Agent Trigger Rules**: Conditions for automated agent activation

**Performance Targets:**
- Sub-100ms processing latency for 95% of events
- 1000+ events/second throughput capacity
- Zero event loss through comprehensive retry mechanisms

### 2. Event Processor (`event-processor.py`)

High-performance Python engine handling all event processing:

**Architecture:**
- **Multi-threaded Design**: Separate workers for each priority level
- **Circuit Breaker Protection**: Fault tolerance for handler failures
- **Intelligent Deduplication**: Configurable windows prevent duplicate processing
- **Adaptive Batching**: Dynamic batch sizing based on system load
- **Dead Letter Queue**: Failed events captured for analysis and replay

**Key Classes:**
- `Event`: Core event structure with rich metadata
- `EventProcessor`: Main processing engine
- `EventDeduplicator`: Efficient duplicate detection
- `CircuitBreaker`: Fault tolerance implementation
- `EventBatcher`: Intelligent batching logic

### 3. Event Flow Architecture (`event-flow-architecture.md`)

Comprehensive documentation of event propagation patterns:

**Propagation Patterns:**
1. **Immediate**: Critical events processed in <50ms
2. **Batched**: High-volume events grouped for efficiency
3. **Asynchronous**: Non-urgent events processed in background

**State Synchronization:**
- Workflow state management across agent executions
- Agent context propagation with delta updates
- Cross-session state reconstruction from event history

**Recovery Mechanisms:**
- Circuit breaker implementation for cascade failure prevention
- Event replay system for point-in-time recovery
- Dead letter queue processing with automatic retry logic

### 4. Integration Patterns (`integration-patterns.md`)

Patterns for seamless system integration:

**Hook Communication:**
- Event Bridge pattern for hook-workflow integration
- Hook Chaining for sequential execution with context passing
- Hook Aggregation for combining parallel execution results

**Event Aggregation:**
- Temporal aggregation within configurable time windows
- Semantic aggregation based on event relationships
- Cross-session persistence with rich context reconstruction

**Processing Optimization:**
- Dynamic mode selection based on system conditions
- Adaptive batching that adjusts to performance metrics
- Hybrid processing combining real-time and batch strategies

## Event Types and Handlers

### File System Events

| Event Type | Priority | Handlers | Use Case |
|------------|----------|----------|----------|
| `file.created` | Normal | file-watcher, compliance-validator, spec-guardian | New file creation tracking |
| `file.modified` | High | file-watcher, post-tool-use, compliance-validator | File change monitoring |
| `file.deleted` | High | file-watcher, cleanup-manager | File deletion handling |

### Workflow Events

| Event Type | Priority | Handlers | Use Case |
|------------|----------|----------|----------|
| `workflow.started` | Critical | workflow-state-manager, performance-monitor | Workflow initiation |
| `workflow.completed` | Critical | workflow-state-manager, performance-monitor, agent-coordinator | Workflow completion |
| `workflow.failed` | Critical | workflow-state-manager, error-recovery, alert-manager | Workflow failure handling |

### Agent Events

| Event Type | Priority | Handlers | Use Case |
|------------|----------|----------|----------|
| `agent.started` | Normal | agent-coordinator, performance-monitor | Agent execution tracking |
| `agent.completed` | High | agent-coordinator, sub-agent-stop, output-processor | Agent completion handling |
| `agent.failed` | Critical | agent-coordinator, error-recovery | Agent failure recovery |

### System Events

| Event Type | Priority | Handlers | Use Case |
|------------|----------|----------|----------|
| `git.commit` | High | pre-commit, compliance-validator, change-tracker | Git operation monitoring |
| `tool.used` | Normal | post-tool-use, performance-monitor, usage-tracker | Tool usage tracking |
| `performance.threshold` | Critical | performance-monitor, alert-manager, auto-optimizer | Performance monitoring |

## Agent Trigger Configuration

### Trigger Conditions

Each agent has specific conditions that determine when it should be activated:

```json
{
  "compliance": {
    "events": ["file.created", "file.modified", "naming.violation"],
    "conditions": {
      "file_extensions": [".ts", ".tsx", ".js", ".jsx"],
      "violation_threshold": 1
    },
    "debounce_ms": 2000,
    "timeout_seconds": 120
  }
}
```

### Debouncing Strategy

Prevents excessive agent triggering:
- **Time-based debouncing**: Minimum interval between triggers
- **Event-based debouncing**: Accumulate similar events before triggering
- **Load-based debouncing**: Adjust intervals based on system load

## Performance Characteristics

### Latency Targets

| Priority Level | Target Latency | Use Cases |
|----------------|----------------|-----------|
| Critical | <50ms | System failures, security alerts |
| High | <100ms | User-blocking operations |
| Normal | <500ms | Background processing |
| Low | <1000ms | Analytics, cleanup |

### Throughput Capabilities

- **Peak Throughput**: 1000+ events/second
- **Sustained Throughput**: 500 events/second
- **Batch Processing**: Up to 100 events per batch
- **Memory Usage**: <100MB under normal load

### Reliability Guarantees

- **Zero Event Loss**: Through DLQ and retry mechanisms
- **At-Least-Once Delivery**: Events processed minimum once
- **Fault Tolerance**: Circuit breakers prevent cascade failures
- **Recovery Time**: <30 seconds for system recovery

## Monitoring and Observability

### Key Metrics

1. **Processing Metrics**
   - Events processed per second
   - Average processing latency
   - Queue depths by priority
   - Error rates by event type

2. **System Metrics**
   - Memory usage
   - CPU utilization
   - Thread pool utilization
   - Circuit breaker states

3. **Business Metrics**
   - Agent trigger frequency
   - Workflow completion rates
   - File change velocity
   - Code quality trends

### Alerting Thresholds

```json
{
  "queue_depth": 500,
  "processing_latency_ms": 1000,
  "error_rate_percent": 5,
  "memory_usage_mb": 100
}
```

## Configuration and Customization

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `EVENT_DEBUG` | false | Enable debug logging |
| `EVENT_BATCH_SIZE` | 50 | Default batch size |
| `EVENT_TIMEOUT_MS` | 2000 | Default batch timeout |
| `EVENT_QUEUE_SIZE` | 10000 | Default queue size |

### Configuration Files

1. **event-routing-table.json**: Core event routing configuration
2. **hooks.json**: Hook-specific settings
3. **performance.json**: Performance monitoring settings

### Custom Event Types

To add new event types:

1. Update `event-routing-table.json` with event definition
2. Add handlers to process the new event type
3. Update agent trigger conditions if needed
4. Test with monitoring enabled

## Troubleshooting

### Common Issues

1. **High Latency**
   - Check queue depths
   - Review circuit breaker states
   - Analyze slow handlers
   - Consider increasing worker threads

2. **Event Loss**
   - Check dead letter queue
   - Review error logs
   - Verify disk space
   - Check handler timeouts

3. **Memory Issues**
   - Monitor queue sizes
   - Check event deduplication
   - Review batch configurations
   - Clear old event history

### Debug Commands

```bash
# Check event processor status
python .claude/hooks/event-processor.py --status

# View performance metrics
cat .claude/logs/performance.json

# Monitor queue depths
watch -n 1 'ps aux | grep event-processor'

# Review dead letter queue
cat .claude/logs/dead-letter-queue.jsonl
```

### Log Analysis

Key log files:
- `.claude/logs/event-processor.log`: Main processing logs
- `.claude/logs/performance.json`: Performance metrics
- `.claude/logs/hooks.log`: Hook execution logs
- `.claude/logs/dead-letter-queue.jsonl`: Failed events

## Integration Examples

### Adding a New Hook

```python
# 1. Create hook script
def new_hook_handler(event):
    # Process event
    result = process_event_data(event.data)
    
    # Return processing result
    return {
        "continue": True,
        "metadata": result
    }

# 2. Update routing table
{
  "event_types": {
    "custom.event": {
      "handlers": ["new-hook-handler"],
      "priority": "normal"
    }
  }
}

# 3. Register handler in event processor
handler_map = {
    'new-hook-handler': self._handle_new_hook
}
```

### Creating Custom Workflows

```python
# 1. Define workflow events
submit_event('workflow.started', {
    'workflow_id': 'custom-workflow',
    'workflow_type': 'validation',
    'context': workflow_context
})

# 2. Process workflow steps
for step in workflow_steps:
    submit_event('workflow.step', {
        'workflow_id': 'custom-workflow',
        'step': step,
        'data': step_data
    })

# 3. Complete workflow
submit_event('workflow.completed', {
    'workflow_id': 'custom-workflow',
    'result': workflow_result
})
```

## Best Practices

### Event Design

1. **Use Structured Data**: Always include structured data in events
2. **Add Context**: Include session and workflow IDs
3. **Set Appropriate Priority**: Match priority to urgency
4. **Include Metadata**: Add debugging and tracing information

### Performance Optimization

1. **Batch Similar Events**: Group related events for efficiency
2. **Use Appropriate Handlers**: Don't over-process simple events
3. **Monitor Regularly**: Track metrics and adjust configuration
4. **Test Under Load**: Validate performance under realistic conditions

### Error Handling

1. **Implement Timeouts**: All handlers should have timeouts
2. **Use Circuit Breakers**: Protect against cascade failures
3. **Log Comprehensively**: Include context in error messages
4. **Plan for Recovery**: Design recovery procedures for failures

## Future Enhancements

### Planned Features

1. **Distributed Processing**: Scale across multiple nodes
2. **Advanced Analytics**: ML-based event pattern recognition
3. **Real-time Dashboards**: Live system monitoring
4. **Automatic Tuning**: Self-optimizing configurations

### Extension Points

1. **Custom Event Sources**: Add new event generation points
2. **Advanced Filters**: Implement complex filtering logic
3. **Custom Aggregators**: Create domain-specific aggregation rules
4. **External Integrations**: Connect to external monitoring systems

This event system provides a robust, scalable foundation for the VibeSpec workflow automation platform, ensuring reliable event processing while maintaining the flexibility needed for complex multi-agent coordination scenarios.