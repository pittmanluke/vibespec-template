/**
 * State Persistence Types
 * High-performance, type-safe state definitions for workflow persistence
 */

// Core state schema version for migrations
export const STATE_SCHEMA_VERSION = '1.0.0';

// Performance thresholds (in milliseconds)
export const PERFORMANCE_TARGETS = {
  SAVE_OPERATION: 500,
  LOAD_OPERATION: 200,
  CHECKPOINT_CREATION: 100,
  RECOVERY_TIME: 1000,
} as const;

// State operation status
export type StateOperationStatus = 'pending' | 'success' | 'error' | 'rolled_back';

// Unique identifier for state operations
export type StateOperationId = string;
export type CheckpointId = string;
export type SessionId = string;
export type WorkflowId = string;

// Base metadata for all state objects
export interface StateMetadata {
  id: string;
  version: string;
  createdAt: number;
  updatedAt: number;
  checksum: string;
  size: number;
  compressed: boolean;
}

// Workflow execution state
export interface WorkflowState {
  metadata: StateMetadata;
  workflow: {
    id: WorkflowId;
    name: string;
    status: 'idle' | 'running' | 'paused' | 'completed' | 'failed';
    currentStep: string | null;
    steps: WorkflowStep[];
    progress: number; // 0-100
    startTime: number | null;
    endTime: number | null;
    error: string | null;
  };
  agents: {
    [agentId: string]: AgentState;
  };
  outputs: {
    [stepId: string]: StepOutput;
  };
  context: WorkflowContext;
  performance: PerformanceMetrics;
}

// Individual workflow step state
export interface WorkflowStep {
  id: string;
  name: string;
  agentId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  startTime: number | null;
  endTime: number | null;
  dependencies: string[];
  parallel: boolean;
  retryCount: number;
  maxRetries: number;
  error: string | null;
  output: any;
}

// Agent execution state
export interface AgentState {
  id: string;
  name: string;
  status: 'idle' | 'active' | 'busy' | 'error';
  currentTask: string | null;
  taskQueue: string[];
  performance: {
    tasksCompleted: number;
    averageExecutionTime: number;
    errorRate: number;
    lastActivity: number;
  };
  resources: {
    memoryUsage: number;
    cpuUsage: number;
    ioOperations: number;
  };
}

// Step output with versioning
export interface StepOutput {
  stepId: string;
  agentId: string;
  output: any;
  timestamp: number;
  size: number;
  compressed: boolean;
  checksum: string;
  version: number;
}

// Workflow execution context
export interface WorkflowContext {
  sessionId: SessionId;
  userId: string | null;
  environment: 'development' | 'production' | 'test';
  configuration: Record<string, any>;
  variables: Record<string, any>;
  secrets: Record<string, string>; // Encrypted
  features: Record<string, boolean>;
}

// Performance tracking
export interface PerformanceMetrics {
  totalExecutionTime: number;
  stepExecutionTimes: Record<string, number>;
  agentPerformance: Record<string, number>;
  memoryPeakUsage: number;
  ioOperations: number;
  networkRequests: number;
  cacheHitRate: number;
  errorCount: number;
}

// Checkpoint for state recovery
export interface StateCheckpoint {
  metadata: StateMetadata;
  checkpointId: CheckpointId;
  workflowId: WorkflowId;
  sessionId: SessionId;
  type: 'manual' | 'automatic' | 'pre_step' | 'post_step' | 'error';
  state: WorkflowState;
  delta: StateDelta | null; // Incremental changes since last checkpoint
  parentCheckpointId: CheckpointId | null;
  tags: string[];
  description: string;
}

// Incremental state changes for efficient updates
export interface StateDelta {
  workflowChanges: Partial<WorkflowState['workflow']>;
  agentChanges: Record<string, Partial<AgentState>>;
  outputChanges: Record<string, StepOutput>;
  contextChanges: Partial<WorkflowContext>;
  performanceChanges: Partial<PerformanceMetrics>;
  removedKeys: string[];
}

// Session state for cross-session continuity
export interface SessionState {
  metadata: StateMetadata;
  sessionId: SessionId;
  userId: string | null;
  startTime: number;
  endTime: number | null;
  status: 'active' | 'paused' | 'completed' | 'crashed';
  activeWorkflows: WorkflowId[];
  completedWorkflows: WorkflowId[];
  environment: Record<string, any>;
  preferences: Record<string, any>;
  lastCheckpointId: CheckpointId | null;
  crashRecoveryData: CrashRecoveryData | null;
}

// Crash recovery information
export interface CrashRecoveryData {
  timestamp: number;
  error: string;
  stackTrace: string;
  lastValidCheckpoint: CheckpointId;
  corruptedFiles: string[];
  recoveryStrategy: 'rollback' | 'repair' | 'rebuild';
  dataLoss: boolean;
}

// State operation for atomic transactions
export interface StateOperation {
  id: StateOperationId;
  type: 'save' | 'load' | 'checkpoint' | 'restore' | 'migrate' | 'compress';
  status: StateOperationStatus;
  targetId: string; // workflow, checkpoint, or session ID
  startTime: number;
  endTime: number | null;
  error: string | null;
  rollbackData: any | null;
  locks: string[]; // Resource locks held
  dependencies: StateOperationId[];
}

// Conflict resolution for concurrent access
export interface StateConflict {
  id: string;
  timestamp: number;
  conflictType: 'concurrent_write' | 'version_mismatch' | 'lock_timeout' | 'data_corruption';
  affectedResources: string[];
  operation1: StateOperationId;
  operation2: StateOperationId;
  resolution: 'last_writer_wins' | 'merge' | 'user_intervention' | 'rollback';
  resolvedBy: string | null;
  resolvedAt: number | null;
}

// Migration script for version updates
export interface MigrationScript {
  fromVersion: string;
  toVersion: string;
  description: string;
  reversible: boolean;
  script: (oldState: any) => any;
  validation: (newState: any) => boolean;
  rollback?: (newState: any) => any;
}

// Compression configuration
export interface CompressionConfig {
  enabled: boolean;
  algorithm: 'gzip' | 'brotli' | 'lz4' | 'zstd';
  level: number; // 1-9 for most algorithms
  threshold: number; // Minimum size in bytes to compress
  chunkSize: number; // For streaming compression
}

// State persistence configuration
export interface StatePersistenceConfig {
  baseDirectory: string;
  compression: CompressionConfig;
  performance: {
    maxMemoryUsage: number; // MB
    maxFileSize: number; // MB
    batchSize: number;
    parallelOperations: number;
  };
  reliability: {
    enableWAL: boolean; // Write-ahead logging
    syncFrequency: number; // milliseconds
    backupRetention: number; // number of backups
    checksumValidation: boolean;
  };
  monitoring: {
    enableMetrics: boolean;
    metricsInterval: number; // milliseconds
    alertThresholds: {
      saveTime: number;
      loadTime: number;
      errorRate: number;
      memoryUsage: number;
    };
  };
}

// API response types
export interface StateOperationResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  operationId: StateOperationId;
  duration: number;
  performance: {
    memoryUsed: number;
    ioOperations: number;
    compressionRatio?: number;
  };
}

export interface CheckpointResult extends StateOperationResult<StateCheckpoint> {
  checkpointId: CheckpointId;
  size: number;
  compressed: boolean;
}

export interface RestoreResult extends StateOperationResult<WorkflowState> {
  restoredFromCheckpoint: CheckpointId;
  dataLoss: boolean;
  warningsCount: number;
  warnings: string[];
}

// Query interfaces for state retrieval
export interface StateQuery {
  workflowId?: WorkflowId;
  sessionId?: SessionId;
  checkpointId?: CheckpointId;
  timeRange?: {
    start: number;
    end: number;
  };
  status?: string[];
  tags?: string[];
  limit?: number;
  offset?: number;
  sortBy?: 'created' | 'updated' | 'size';
  sortOrder?: 'asc' | 'desc';
}

export interface StateQueryResult<T> {
  items: T[];
  total: number;
  hasMore: boolean;
  nextOffset?: number;
}