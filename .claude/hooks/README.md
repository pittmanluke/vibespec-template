# VibeSpec Hook Infrastructure

Complete hook system for workflow automation and quality assurance in VibeSpec projects.

## Quick Start

```bash
# Install complete event system
./.claude/hooks/event-system-manager.sh install

# Start event processing
./.claude/hooks/event-system-manager.sh start

# Check system status
./.claude/hooks/event-system-manager.sh status

# Monitor event flow
./.claude/hooks/event-system-manager.sh monitor events
```

## Event System Architecture

The VibeSpec hook infrastructure now includes a sophisticated event routing and propagation system designed for sub-100ms latency and zero event loss:

### Core Components

1. **Event Routing Table** (`event-routing-table.json`)
   - Central configuration for event types and handlers
   - Priority-based processing with 4 levels (Critical, High, Normal, Low)
   - Intelligent deduplication and filtering
   - Agent trigger mappings

2. **Event Processor** (`event-processor.py`)
   - High-performance Python engine with multi-threading
   - Circuit breaker protection for fault tolerance
   - Adaptive batching based on system load
   - Dead letter queue for failed events

3. **Event System Integrator** (`event-system-integrator.py`)
   - Bridges legacy hooks with new event system
   - Process monitoring and auto-restart capabilities
   - Cross-session state management

4. **Event System Manager** (`event-system-manager.sh`)
   - Complete management interface for the event system
   - Installation, configuration, monitoring, and troubleshooting
   - Performance benchmarking and health checks

### Event Flow Architecture

```
File Changes → Event Router → Priority Queues → Event Processor → Hook Handlers → Agent Triggers
     ↓              ↓              ↓               ↓               ↓              ↓
State Manager ← Performance Monitor ← Circuit Breakers ← Recovery System ← Dead Letter Queue
```

### Performance Characteristics

- **Latency**: Sub-100ms for 95% of events
- **Throughput**: 1000+ events/second sustained
- **Memory Usage**: <100MB under normal load
- **Reliability**: Zero event loss through DLQ and retry mechanisms

## Available Hooks

### 1. Pre-Commit Hook (`pre-commit.sh`)
**Purpose**: Git pre-commit validation that automatically runs `/wv` (workflow validate)

**Features**:
- Prevents commits if validation fails
- Quick naming convention checks
- Caches validation results (30 minutes)
- Clear error messages with fix suggestions
- <5 second execution time

**Usage**:
```bash
# Automatic on git commit
git commit -m "your message"

# Manual installation
./.claude/hooks/pre-commit.sh --install

# Test manually
./.claude/hooks/pre-commit.sh
```

### 2. Post-Tool-Use Hook (`post-tool-use.py`)
**Purpose**: Captures state after tool usage for workflow continuity

**Features**:
- Monitors significant file changes
- Tracks session state across Claude interactions
- Enables cross-session continuity
- Intelligent change detection
- Batched event processing

**Integration**: Automatically triggered by Claude Code after tool usage

### 3. Sub-Agent-Stop Hook (`sub-agent-stop.py`)
**Purpose**: Manages agent coordination and handoffs in multi-agent workflows

**Features**:
- Captures agent outputs for handoffs
- Intelligent agent chaining recommendations
- Performance metrics tracking
- Workflow state management
- Agent output parsing and structuring

**Integration**: Automatically triggered when sub-agents complete

### 4. File Watcher (`file-watcher.py`)
**Purpose**: Real-time file monitoring for immediate violation detection

**Features**:
- Cross-platform file monitoring (Linux/macOS/Windows WSL)
- Real-time naming convention validation
- Specification drift detection
- Agent trigger suggestions
- Batched event processing

**Usage**:
```bash
# One-time scan
./.claude/hooks/file-watcher.py --scan

# Background monitoring
./.claude/hooks/file-watcher.py &

# Daemon mode
./.claude/hooks/file-watcher.py --daemon

# Install as system service (Linux)
sudo ./.claude/hooks/file-watcher.py --install-service
```

## Event System Management

### Installation

```bash
# Install complete event system with all components
./.claude/hooks/event-system-manager.sh install

# Install individual hooks (legacy)
./.claude/hooks/hook-manager.sh install

# Install specific hook
./.claude/hooks/hook-manager.sh install pre-commit
```

### Service Management

```bash
# Start event processing services
./.claude/hooks/event-system-manager.sh start

# Stop event processing services
./.claude/hooks/event-system-manager.sh stop

# Restart services
./.claude/hooks/event-system-manager.sh restart

# Check service status
./.claude/hooks/event-system-manager.sh status
```

### Configuration

```bash
# Show current configuration
./.claude/hooks/event-system-manager.sh config show

# Edit event routing configuration
./.claude/hooks/event-system-manager.sh config edit

# Reset to default configuration
./.claude/hooks/event-system-manager.sh config reset
```

### Monitoring

```bash
# Monitor event flow in real-time
./.claude/hooks/event-system-manager.sh monitor events

# Monitor performance metrics
./.claude/hooks/event-system-manager.sh monitor performance

# Monitor queue depths
./.claude/hooks/event-system-manager.sh monitor queues

# Monitor agent activity
./.claude/hooks/event-system-manager.sh monitor agents
```

### Testing

```bash
# Test complete system
./.claude/hooks/event-system-manager.sh test

# Test specific components
./.claude/hooks/event-system-manager.sh test routing
./.claude/hooks/event-system-manager.sh test processing
./.claude/hooks/event-system-manager.sh test integration
./.claude/hooks/event-system-manager.sh test performance
```

## Event Types and Handlers

### File System Events

| Event Type | Priority | Handlers | Description |
|------------|----------|----------|-------------|
| `file.created` | Normal | file-watcher, compliance-validator, spec-guardian | New file creation tracking |
| `file.modified` | High | file-watcher, post-tool-use, compliance-validator | File change monitoring |
| `file.deleted` | High | file-watcher, cleanup-manager | File deletion handling |

### Workflow Events

| Event Type | Priority | Handlers | Description |
|------------|----------|----------|-------------|
| `workflow.started` | Critical | workflow-state-manager, performance-monitor | Workflow initiation |
| `workflow.completed` | Critical | workflow-state-manager, agent-coordinator | Workflow completion |
| `workflow.failed` | Critical | workflow-state-manager, error-recovery | Workflow failure handling |

### Agent Events

| Event Type | Priority | Handlers | Description |
|------------|----------|----------|-------------|
| `agent.started` | Normal | agent-coordinator, performance-monitor | Agent execution tracking |
| `agent.completed` | High | agent-coordinator, sub-agent-stop | Agent completion handling |
| `agent.failed` | Critical | agent-coordinator, error-recovery | Agent failure recovery |

### System Events

| Event Type | Priority | Handlers | Description |
|------------|----------|----------|-------------|
| `git.commit` | High | pre-commit, compliance-validator | Git operation monitoring |
| `tool.used` | Normal | post-tool-use, performance-monitor | Tool usage tracking |
| `performance.threshold` | Critical | performance-monitor, alert-manager | Performance monitoring |

## Agent Trigger Configuration

### Automatic Agent Triggering

The event system automatically triggers agents based on configurable conditions:

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

### Supported Agents

- **compliance**: File naming and code standards enforcement
- **reviewer**: Security and code quality analysis
- **ui-enhancer**: UI/UX improvements and accessibility
- **spec-guardian**: Specification alignment verification
- **architect**: System design and architecture review
- **velocity**: Scope creep prevention and shipping focus
- **performance-monitor**: Performance analysis and optimization
- **meta-agent**: Creates new agents for automation opportunities

## State Management

### Session State
- **Session Continuity**: Maintains state across Claude Code sessions
- **File Change Tracking**: Comprehensive history of modifications
- **Context Preservation**: Workflow progress and agent outputs

### Workflow State
- **Active Workflows**: Current execution status and progress
- **Agent Coordination**: Handoffs and chaining decisions
- **Performance Metrics**: Execution times and resource usage

### Cross-Session Persistence
- **Event Store**: Persistent event history with compression
- **State Reconstruction**: Rebuild context from event history
- **Session Recovery**: Resume interrupted workflows

## Performance Targets

All hooks are designed for <5 second execution time:

- **Pre-Commit**: <5s (triggers /wv which takes ~90s)
- **Post-Tool-Use**: <5s (monitors and captures state)
- **Sub-Agent-Stop**: <5s (processes agent outputs)
- **File-Watcher**: <5s (for setup, then continuous)
- **Event Processing**: <100ms (for 95% of events)

## Cross-Platform Compatibility

### Linux
- Uses `inotify` for file watching
- Full systemd service support
- All hooks fully supported

### macOS
- Uses `fswatch` for file watching
- Launchd service support available
- All hooks fully supported

### Windows WSL
- Polling-based file watching fallback
- All hooks supported with minor performance differences

## Troubleshooting

### Common Issues

#### Event System Not Starting
```bash
# Check prerequisites
./.claude/hooks/event-system-manager.sh validate

# Check logs
./.claude/hooks/event-system-manager.sh troubleshoot

# Restart system
./.claude/hooks/event-system-manager.sh restart
```

#### High Event Processing Latency
```bash
# Monitor performance
./.claude/hooks/event-system-manager.sh monitor performance

# Check queue depths
./.claude/hooks/event-system-manager.sh monitor queues

# Review configuration
./.claude/hooks/event-system-manager.sh config show
```

#### File Watcher Not Detecting Changes
```bash
# Check if running
ps aux | grep file-watcher

# Check logs
./.claude/hooks/event-system-manager.sh monitor events

# Restart file watcher
./.claude/hooks/event-system-manager.sh restart
```

### Debug Mode
Enable debug logging for detailed troubleshooting:

```bash
export EVENT_DEBUG=true
./.claude/hooks/event-system-manager.sh test processing
```

Debug logs are written to `.claude/logs/event-processor-debug.log`.

### Validation
Validate complete installation:

```bash
./.claude/hooks/event-system-manager.sh validate
```

## Integration with VibeSpec Workflows

### Workflow Commands
The hooks integrate seamlessly with VibeSpec workflow commands:

- `/workflow:validate` (triggered by pre-commit)
- `/workflow:review` (can be triggered by file watcher)
- `/workflow:implement` (coordinates with sub-agent-stop)

### Agent Coordination
Sub-agent-stop hook enables intelligent agent chaining:

```
compliance → reviewer → ui-enhancer
spec-guardian → architect → velocity
```

### State Continuity
Post-tool-use hook ensures workflow state is preserved:

- Session continuity across Claude interactions
- File change tracking for context awareness
- Workflow progress preservation

## Advanced Configuration

### Custom Event Types
Add new event types by updating `event-routing-table.json`:

```json
{
  "event_types": {
    "custom.event": {
      "description": "Custom event type",
      "priority": "normal",
      "handlers": ["custom-handler"],
      "filters": {
        "include_patterns": ["custom/*"]
      }
    }
  }
}
```

### Performance Tuning
Adjust performance parameters:

```json
{
  "queue_configuration": {
    "batch_processing": {
      "max_batch_size": 100,
      "batch_timeout_ms": 2000,
      "min_batch_size": 5
    }
  }
}
```

### Custom Agent Triggers
Define custom agent trigger conditions:

```json
{
  "agent_triggers": {
    "custom-agent": {
      "events": ["file.modified"],
      "conditions": {
        "file_patterns": ["custom/**/*"],
        "custom_condition": true
      },
      "debounce_ms": 5000
    }
  }
}
```

## Documentation

- **Architecture**: `event-flow-architecture.md` - Complete system architecture
- **Integration**: `integration-patterns.md` - Integration patterns and examples
- **Visualization**: `event-flow-visualization.md` - Event flow diagrams and timing
- **API Reference**: `event-system-documentation.md` - Complete API documentation

## Contributing

When adding new hooks:

1. Follow the naming convention: `hook-name.{sh|py}`
2. Include comprehensive error handling
3. Target <5 second execution time for legacy hooks
4. Target <100ms for event processing
5. Add to event routing configuration
6. Include installation/uninstallation logic
7. Add test cases
8. Update this documentation

## Support

For issues with the hook system:

1. **Check logs**: `./.claude/hooks/event-system-manager.sh troubleshoot`
2. **Validate installation**: `./.claude/hooks/event-system-manager.sh validate`
3. **Review configuration**: `./.claude/hooks/event-system-manager.sh config show`
4. **Test components**: `./.claude/hooks/event-system-manager.sh test all`
5. **Monitor system**: `./.claude/hooks/event-system-manager.sh monitor events`

For VibeSpec-specific issues, see the main project documentation.

## Version Information

- **Event System Version**: 1.0.0
- **Hook Infrastructure Version**: 1.0.0
- **Compatibility**: VibeSpec Template v2.0+
- **Last Updated**: 2025-08-02

The VibeSpec Hook Infrastructure provides a robust, high-performance foundation for workflow automation while maintaining the flexibility needed for complex multi-agent coordination scenarios.