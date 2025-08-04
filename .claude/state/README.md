# Workflow State Management System

A high-performance, atomic state persistence system for complex workflows with sub-500ms operations, automatic checkpoints, and cross-session continuity.

## Features

### 🚀 **High Performance**
- **Sub-500ms save operations** with streaming serialization
- **Sub-200ms load operations** with lazy loading
- **Efficient compression** with multiple algorithm support
- **Memory-optimized** operations preventing OOM errors
- **Parallel processing** for multi-core performance

### 🔒 **Atomic Operations**
- **Write-ahead logging** for crash recovery
- **Two-phase commit** for distributed updates
- **File system atomic operations** with temp files
- **Lock-free concurrent access** patterns
- **Rollback mechanisms** for failed operations

### 📊 **Checkpoint & Recovery**
- **Automatic checkpoint creation** at critical points
- **Incremental checkpoints** to minimize overhead
- **Fast recovery** from any checkpoint
- **Checkpoint validation** and integrity verification
- **Cross-session checkpoint compatibility**

### 🔄 **Session Continuity**
- **Cross-session state transfer** with integrity validation
- **Session crash detection** and automatic recovery
- **State synchronization** across environments
- **Session isolation** with shared state access

### 🎯 **Integration Ready**
- **Hook system coordination** for workflow events
- **Agent output persistence** with versioning
- **Command state management** integration
- **Performance monitoring** with alerting

## Quick Start

```typescript
import { initializeWorkflowState } from './.claude/state';

// Initialize with development configuration
const { stateAPI, hookIntegrator } = await initializeWorkflowState('development');

// Start a session
const session = await stateAPI.startSession('user123');

// Create a workflow
const workflowId = 'my_workflow';
await stateAPI.createWorkflow(workflowId, 'My Workflow', session.sessionId, [
  { id: 'step1', name: 'Initialize', agentId: 'agent1', dependencies: [], parallel: false, maxRetries: 3 }
]);

// Update step status
await stateAPI.updateStepStatus(workflowId, 'step1', 'completed', { result: 'success' });

// Create checkpoint
await stateAPI.createCheckpoint(workflowId, 'Milestone reached', ['milestone']);

// End session
await stateAPI.endSession(session.sessionId);
```

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                 Workflow State API                      │
│              (Unified Interface)                        │
├─────────────────────────────────────────────────────────┤
│  State Manager  │ Checkpoint Mgr │  Session Manager    │
│  • Atomic Ops   │ • Incremental  │  • Cross-session   │
│  • Compression  │ • Recovery     │  • Transfer        │
│  • WAL          │ • Cleanup      │  • Crash Recovery  │
├─────────────────────────────────────────────────────────┤
│              Hook Integration                           │
│           (Event-driven State)                          │
├─────────────────────────────────────────────────────────┤
│                File System                              │
│  workflows/  checkpoints/  sessions/  temp/            │
└─────────────────────────────────────────────────────────┘
```

## Configuration

### Environment Configurations

```typescript
// Development - Fast operations, minimal storage
const { stateAPI } = await initializeWorkflowState('development');

// Production - Optimized for reliability and performance  
const { stateAPI } = await initializeWorkflowState('production');

// High Throughput - Maximum performance optimization
const { stateAPI } = await initializeWorkflowState('highThroughput');
```

### Custom Configuration

```typescript
import { createWorkflowStateAPI } from './.claude/state';

const stateAPI = createWorkflowStateAPI('.claude/state', {
  compression: {
    enabled: true,
    algorithm: 'gzip',
    level: 6,
    threshold: 1024
  },
  performance: {
    maxMemoryUsage: 256, // MB
    maxFileSize: 100,    // MB
    batchSize: 50,
    parallelOperations: 4
  },
  reliability: {
    enableWAL: true,
    syncFrequency: 30000,
    backupRetention: 10,
    checksumValidation: true
  }
});
```

## Core APIs

### Workflow State Management

```typescript
// Create workflow
await stateAPI.createWorkflow(workflowId, name, sessionId, steps);

// Save state with auto-checkpoint
await stateAPI.saveWorkflowState(workflowState, true, ['auto']);

// Load state
const result = await stateAPI.loadWorkflowState(workflowId);

// Update step status
await stateAPI.updateStepStatus(workflowId, stepId, 'completed', output);

// Update agent state  
await stateAPI.updateAgentState(workflowId, agentId, agentState);

// Add step output
await stateAPI.addStepOutput(workflowId, stepId, output, agentId);
```

### Checkpoint Management

```typescript
// Create manual checkpoint
const checkpoint = await stateAPI.createCheckpoint(
  workflowId, 
  'Milestone reached', 
  ['milestone', 'stable']
);

// Restore from checkpoint
const restored = await stateAPI.restoreFromCheckpoint(checkpointId);

// List checkpoints
const checkpoints = await stateAPI.listCheckpoints(workflowId, 20);

// Get recovery suggestions
const suggestions = await stateAPI.getRecoverySuggestions(workflowId);
```

### Session Management

```typescript
// Start session
const session = await stateAPI.startSession('user123', { env: 'dev' });

// Resume session
const resumed = await stateAPI.resumeSession(sessionId);

// Export session for transfer
const transferData = await stateAPI.exportSession(sessionId);

// Import session
const result = await stateAPI.importSession(transferData, newSessionId);

// End session
await stateAPI.endSession(sessionId, true);
```

## Hook Integration

The state system integrates seamlessly with the existing hook system for event-driven state management:

```typescript
import { createStateHookIntegrator } from './.claude/state';

const hookIntegrator = createStateHookIntegrator(stateAPI, {
  enableAutoCheckpoints: true,
  checkpointFrequency: 5, // Every 5 steps
  enablePerformanceTracking: true,
  enableCrashRecovery: true
});

// Emit workflow events
await hookIntegrator.emitHookEvent('workflow_start', {
  workflowId,
  sessionId,
  timestamp: Date.now(),
  data: { workflowName: 'My Workflow', status: 'started' }
});

await hookIntegrator.emitHookEvent('step_complete', {
  workflowId,
  sessionId,
  timestamp: Date.now(),
  data: { stepId: 'step1', status: 'completed', output: { result: 'success' } }
});
```

## Performance Monitoring

```typescript
import { StatePerformanceMonitor } from './.claude/state';

const monitor = new StatePerformanceMonitor(stateAPI);
monitor.startMonitoring(30000); // Every 30 seconds

// Get current metrics
const metrics = stateAPI.getPerformanceMetrics();
console.log(`Avg Save Time: ${metrics.averageSaveTime}ms`);
console.log(`Avg Load Time: ${metrics.averageLoadTime}ms`);
console.log(`Error Rate: ${metrics.errorRate * 100}%`);
```

## Recovery & Crash Handling

### Automatic Crash Detection

The system automatically detects crashed sessions and provides recovery options:

```typescript
// Check for crashed sessions on startup
const recoveryPlans = await sessionManager.detectAndRecoverCrashedSessions();

for (const plan of recoveryPlans) {
  console.log(`Recovery strategy: ${plan.strategy}`);
  console.log(`Estimated data loss: ${plan.estimatedDataLoss}%`);
  console.log(`Recoverable workflows: ${plan.recoverableWorkflows.length}`);
}
```

### Manual Recovery

```typescript
// Get recovery suggestions for a workflow
const suggestions = await stateAPI.getRecoverySuggestions(workflowId);

if (suggestions.recommendedRecoveryPoint) {
  const restored = await stateAPI.restoreFromCheckpoint(
    suggestions.recommendedRecoveryPoint
  );
  
  if (restored.success) {
    console.log('Recovery successful!');
  }
}
```

## State Schema

### Workflow State Structure

```typescript
interface WorkflowState {
  metadata: StateMetadata;           // Version, checksums, timestamps
  workflow: {                        // Core workflow info
    id: WorkflowId;
    name: string;
    status: 'idle' | 'running' | 'paused' | 'completed' | 'failed';
    currentStep: string | null;
    steps: WorkflowStep[];
    progress: number;               // 0-100
    startTime: number | null;
    endTime: number | null;
    error: string | null;
  };
  agents: Record<string, AgentState>; // Agent execution states
  outputs: Record<string, StepOutput>; // Step outputs
  context: WorkflowContext;          // Session and environment
  performance: PerformanceMetrics;   // Execution metrics
}
```

### Checkpoint Structure

```typescript
interface StateCheckpoint {
  metadata: StateMetadata;
  checkpointId: CheckpointId;
  workflowId: WorkflowId;
  sessionId: SessionId;
  type: 'manual' | 'automatic' | 'pre_step' | 'post_step' | 'error';
  state: WorkflowState;             // Full state snapshot
  delta: StateDelta | null;         // Incremental changes
  parentCheckpointId: CheckpointId | null;
  tags: string[];
  description: string;
}
```

## File Structure

```
.claude/state/
├── workflows/           # Workflow state files
│   ├── workflow_123.state
│   └── workflow_456.state
├── checkpoints/         # Checkpoint files
│   ├── cp_789.checkpoint
│   └── cp_012.checkpoint
├── sessions/           # Session state files
│   ├── session_345.session
│   └── session_678.session
├── temp/              # Temporary files for atomic operations
└── checkpoint-index.json # Checkpoint metadata index
```

## Performance Targets

| Operation | Target | Typical |
|-----------|--------|---------|
| Save State | <500ms | 150-300ms |
| Load State | <200ms | 50-150ms |
| Create Checkpoint | <100ms | 30-80ms |
| Recovery Time | <1000ms | 200-600ms |
| Memory Usage | <50MB | 20-40MB |
| Compression Ratio | >60% | 65-80% |

## Error Handling

The system provides comprehensive error handling with automatic recovery:

```typescript
// All operations return detailed results
const result = await stateAPI.saveWorkflowState(workflowState);

if (!result.success) {
  console.error('Save failed:', result.error);
  console.log('Operation ID:', result.operationId);
  console.log('Duration:', result.duration + 'ms');
  
  // Automatic rollback already performed
  // Check performance metrics for diagnostics
  const metrics = result.performance;
  console.log('Memory used:', metrics.memoryUsed);
  console.log('IO operations:', metrics.ioOperations);
}
```

## Migration & Versioning

The system supports automatic state migration between versions:

```typescript
// Migration is automatic on load
const result = await stateAPI.loadWorkflowState(workflowId);

if (result.success) {
  // State automatically migrated if needed
  const state = result.data;
  console.log('State version:', state.metadata.version);
}
```

## Best Practices

### 1. **Checkpoint Strategy**
- Create manual checkpoints at important milestones
- Use descriptive tags for easy identification
- Leverage automatic checkpoints for routine saves

### 2. **Performance Optimization**
- Use appropriate environment configuration
- Monitor performance metrics regularly
- Adjust compression settings based on data patterns

### 3. **Error Recovery**
- Always check operation results
- Implement retry logic for transient failures
- Use recovery suggestions for systematic failures

### 4. **Session Management**
- End sessions gracefully when possible
- Export sessions before environment changes
- Monitor for crashed sessions on startup

### 5. **Hook Integration**
- Emit events at workflow lifecycle points
- Use consistent event data structures
- Handle event failures gracefully

## Troubleshooting

### Common Issues

**Slow Save Operations**
```typescript
// Check compression settings
const metrics = stateAPI.getPerformanceMetrics();
if (metrics.averageSaveTime > 500) {
  // Consider reducing compression level or disabling
}
```

**Memory Usage Issues**
```typescript
// Monitor memory usage
const metrics = stateAPI.getPerformanceMetrics();
if (metrics.memoryUsage > 200 * 1024 * 1024) { // 200MB
  // Consider reducing batch sizes or parallel operations
}
```

**Checkpoint Corruption**
```typescript
// Validate checkpoint integrity
const suggestions = await stateAPI.getRecoverySuggestions(workflowId);
if (suggestions.warnings.length > 0) {
  console.log('Checkpoint issues:', suggestions.warnings);
}
```

### Debug Mode

```typescript
// Enable detailed logging in development
const { stateAPI } = await initializeWorkflowState('development');

// Performance monitoring
const monitor = new StatePerformanceMonitor(stateAPI);
monitor.startMonitoring(5000); // Every 5 seconds in debug mode
```

## Contributing

When extending the state management system:

1. **Maintain Performance**: All operations must meet performance targets
2. **Atomic Operations**: Ensure all state changes are atomic
3. **Error Handling**: Provide comprehensive error information
4. **Testing**: Test crash scenarios and recovery paths
5. **Documentation**: Update this README for new features

## License

This state management system is part of the VibeSpec template and follows the same licensing terms.