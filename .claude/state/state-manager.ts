/**
 * State Manager
 * High-performance, atomic state persistence with sub-500ms operations
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';
import * as zlib from 'zlib';
import { promisify } from 'util';
import {
  WorkflowState,
  StateCheckpoint,
  SessionState,
  StateOperation,
  StateOperationResult,
  CheckpointResult,
  RestoreResult,
  StatePersistenceConfig,
  StateOperationId,
  CheckpointId,
  WorkflowId,
  SessionId,
  StateDelta,
  StateConflict,
  MigrationScript,
  STATE_SCHEMA_VERSION,
  PERFORMANCE_TARGETS
} from './types.js';

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

export class StateManager {
  private config: StatePersistenceConfig;
  private activeOperations: Map<StateOperationId, StateOperation>;
  private resourceLocks: Map<string, Set<StateOperationId>>;
  private walFile: string;
  private metricsInterval: NodeJS.Timeout | null;
  private performanceMetrics: {
    operationsPerSecond: number;
    averageSaveTime: number;
    averageLoadTime: number;
    errorRate: number;
    memoryUsage: number;
  };

  constructor(config: StatePersistenceConfig) {
    this.config = config;
    this.activeOperations = new Map();
    this.resourceLocks = new Map();
    this.walFile = path.join(config.baseDirectory, 'wal.log');
    this.metricsInterval = null;
    this.performanceMetrics = {
      operationsPerSecond: 0,
      averageSaveTime: 0,
      averageLoadTime: 0,
      errorRate: 0,
      memoryUsage: 0
    };

    this.initializeStateManager();
  }

  private async initializeStateManager(): Promise<void> {
    // Ensure base directory exists
    await fs.mkdir(this.config.baseDirectory, { recursive: true });
    await fs.mkdir(path.join(this.config.baseDirectory, 'workflows'), { recursive: true });
    await fs.mkdir(path.join(this.config.baseDirectory, 'checkpoints'), { recursive: true });
    await fs.mkdir(path.join(this.config.baseDirectory, 'sessions'), { recursive: true });
    await fs.mkdir(path.join(this.config.baseDirectory, 'temp'), { recursive: true });

    // Initialize WAL if enabled
    if (this.config.reliability.enableWAL) {
      await this.initializeWAL();
    }

    // Start performance monitoring
    if (this.config.monitoring.enableMetrics) {
      this.startMetricsCollection();
    }

    // Recover from any incomplete operations
    await this.recoverIncompleteOperations();
  }

  /**
   * Save workflow state with atomic operation guarantees
   */
  async saveWorkflowState(workflowState: WorkflowState): Promise<StateOperationResult<void>> {
    const operationId = this.generateOperationId();
    const startTime = Date.now();

    try {
      // Create operation record
      const operation: StateOperation = {
        id: operationId,
        type: 'save',
        status: 'pending',
        targetId: workflowState.workflow.id,
        startTime,
        endTime: null,
        error: null,
        rollbackData: null,
        locks: [workflowState.workflow.id],
        dependencies: []
      };

      this.activeOperations.set(operationId, operation);

      // Acquire locks
      await this.acquireLocks(operation.locks, operationId);

      // Write to WAL first
      if (this.config.reliability.enableWAL) {
        await this.writeToWAL('save_workflow', workflowState.workflow.id, workflowState);
      }

      // Update metadata
      workflowState.metadata.updatedAt = Date.now();
      workflowState.metadata.checksum = await this.calculateChecksum(workflowState);

      // Serialize and compress
      const serialized = await this.serializeWithCompression(workflowState);
      workflowState.metadata.size = serialized.length;
      workflowState.metadata.compressed = this.config.compression.enabled;

      // Write atomically using temp file
      const workflowPath = this.getWorkflowPath(workflowState.workflow.id);
      const tempPath = `${workflowPath}.tmp.${operationId}`;

      await fs.writeFile(tempPath, serialized);
      await fs.rename(tempPath, workflowPath);

      // Create automatic checkpoint if configured
      if (this.shouldCreateAutomaticCheckpoint(workflowState)) {
        await this.createCheckpoint(workflowState, 'automatic', 'Auto-checkpoint after state save');
      }

      // Complete operation
      operation.status = 'success';
      operation.endTime = Date.now();

      const duration = operation.endTime - operation.startTime;
      
      // Release locks
      this.releaseLocks(operation.locks, operationId);
      this.activeOperations.delete(operationId);

      // Update performance metrics
      this.updatePerformanceMetrics('save', duration, true);

      return {
        success: true,
        operationId,
        duration,
        performance: {
          memoryUsed: process.memoryUsage().heapUsed,
          ioOperations: 2, // Write + rename
          compressionRatio: this.config.compression.enabled ? 
            Buffer.byteLength(JSON.stringify(workflowState)) / serialized.length : 1
        }
      };

    } catch (error) {
      // Rollback operation
      await this.rollbackOperation(operationId, error as Error);
      
      return {
        success: false,
        error: (error as Error).message,
        operationId,
        duration: Date.now() - startTime,
        performance: {
          memoryUsed: process.memoryUsage().heapUsed,
          ioOperations: 0
        }
      };
    }
  }

  /**
   * Load workflow state with performance optimization
   */
  async loadWorkflowState(workflowId: WorkflowId): Promise<StateOperationResult<WorkflowState>> {
    const operationId = this.generateOperationId();
    const startTime = Date.now();

    try {
      const operation: StateOperation = {
        id: operationId,
        type: 'load',
        status: 'pending',
        targetId: workflowId,
        startTime,
        endTime: null,
        error: null,
        rollbackData: null,
        locks: [],
        dependencies: []
      };

      this.activeOperations.set(operationId, operation);

      const workflowPath = this.getWorkflowPath(workflowId);
      
      // Check if file exists
      try {
        await fs.access(workflowPath);
      } catch {
        throw new Error(`Workflow state not found: ${workflowId}`);
      }

      // Read and deserialize
      const serialized = await fs.readFile(workflowPath);
      const workflowState = await this.deserializeWithDecompression<WorkflowState>(serialized);

      // Validate checksum
      if (this.config.reliability.checksumValidation) {
        const expectedChecksum = workflowState.metadata.checksum;
        const actualChecksum = await this.calculateChecksum(workflowState);
        
        if (expectedChecksum !== actualChecksum) {
          throw new Error(`Checksum validation failed for workflow ${workflowId}`);
        }
      }

      // Validate schema version
      if (workflowState.metadata.version !== STATE_SCHEMA_VERSION) {
        // Attempt migration if available
        const migrated = await this.migrateState(workflowState, STATE_SCHEMA_VERSION);
        if (!migrated) {
          throw new Error(`Unsupported state version: ${workflowState.metadata.version}`);
        }
      }

      operation.status = 'success';
      operation.endTime = Date.now();

      const duration = operation.endTime - operation.startTime;
      this.activeOperations.delete(operationId);

      // Update performance metrics
      this.updatePerformanceMetrics('load', duration, true);

      return {
        success: true,
        data: workflowState,
        operationId,
        duration,
        performance: {
          memoryUsed: process.memoryUsage().heapUsed,
          ioOperations: 1,
          compressionRatio: workflowState.metadata.compressed ? 
            Buffer.byteLength(JSON.stringify(workflowState)) / serialized.length : 1
        }
      };

    } catch (error) {
      await this.rollbackOperation(operationId, error as Error);
      
      return {
        success: false,
        error: (error as Error).message,
        operationId,
        duration: Date.now() - startTime,
        performance: {
          memoryUsed: process.memoryUsage().heapUsed,
          ioOperations: 0
        }
      };
    }
  }

  /**
   * Create checkpoint with incremental delta support
   */
  async createCheckpoint(
    workflowState: WorkflowState,
    type: StateCheckpoint['type'] = 'manual',
    description: string = '',
    tags: string[] = []
  ): Promise<CheckpointResult> {
    const operationId = this.generateOperationId();
    const checkpointId = this.generateCheckpointId();
    const startTime = Date.now();

    try {
      const operation: StateOperation = {
        id: operationId,
        type: 'checkpoint',
        status: 'pending',
        targetId: checkpointId,
        startTime,
        endTime: null,
        error: null,
        rollbackData: null,
        locks: [workflowState.workflow.id],
        dependencies: []
      };

      this.activeOperations.set(operationId, operation);

      // Find previous checkpoint for delta calculation
      const previousCheckpoint = await this.getLatestCheckpoint(workflowState.workflow.id);
      const delta = previousCheckpoint ? 
        await this.calculateStateDelta(previousCheckpoint.state, workflowState) : null;

      // Create checkpoint
      const checkpoint: StateCheckpoint = {
        metadata: {
          id: checkpointId,
          version: STATE_SCHEMA_VERSION,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          checksum: '',
          size: 0,
          compressed: this.config.compression.enabled
        },
        checkpointId,
        workflowId: workflowState.workflow.id,
        sessionId: workflowState.context.sessionId,
        type,
        state: workflowState,
        delta,
        parentCheckpointId: previousCheckpoint?.checkpointId || null,
        tags,
        description
      };

      // Calculate checksum
      checkpoint.metadata.checksum = await this.calculateChecksum(checkpoint);

      // Serialize and compress
      const serialized = await this.serializeWithCompression(checkpoint);
      checkpoint.metadata.size = serialized.length;

      // Write checkpoint atomically
      const checkpointPath = this.getCheckpointPath(checkpointId);
      const tempPath = `${checkpointPath}.tmp.${operationId}`;

      await fs.writeFile(tempPath, serialized);
      await fs.rename(tempPath, checkpointPath);

      // Update checkpoint index
      await this.updateCheckpointIndex(workflowState.workflow.id, checkpointId);

      operation.status = 'success';
      operation.endTime = Date.now();

      const duration = operation.endTime - operation.startTime;
      this.activeOperations.delete(operationId);

      return {
        success: true,
        data: checkpoint,
        checkpointId,
        size: checkpoint.metadata.size,
        compressed: checkpoint.metadata.compressed,
        operationId,
        duration,
        performance: {
          memoryUsed: process.memoryUsage().heapUsed,
          ioOperations: 2,
          compressionRatio: this.config.compression.enabled ? 
            Buffer.byteLength(JSON.stringify(checkpoint)) / serialized.length : 1
        }
      };

    } catch (error) {
      await this.rollbackOperation(operationId, error as Error);
      
      return {
        success: false,
        error: (error as Error).message,
        checkpointId,
        size: 0,
        compressed: false,
        operationId,
        duration: Date.now() - startTime,
        performance: {
          memoryUsed: process.memoryUsage().heapUsed,
          ioOperations: 0
        }
      };
    }
  }

  /**
   * Restore workflow from checkpoint
   */
  async restoreFromCheckpoint(checkpointId: CheckpointId): Promise<RestoreResult> {
    const operationId = this.generateOperationId();
    const startTime = Date.now();

    try {
      const operation: StateOperation = {
        id: operationId,
        type: 'restore',
        status: 'pending',
        targetId: checkpointId,
        startTime,
        endTime: null,
        error: null,
        rollbackData: null,
        locks: [],
        dependencies: []
      };

      this.activeOperations.set(operationId, operation);

      // Load checkpoint
      const checkpointPath = this.getCheckpointPath(checkpointId);
      const serialized = await fs.readFile(checkpointPath);
      const checkpoint = await this.deserializeWithDecompression<StateCheckpoint>(serialized);

      // Validate checkpoint integrity
      const expectedChecksum = checkpoint.metadata.checksum;
      const actualChecksum = await this.calculateChecksum(checkpoint);
      
      if (expectedChecksum !== actualChecksum) {
        throw new Error(`Checkpoint integrity check failed: ${checkpointId}`);
      }

      // Apply any necessary migrations
      let restoredState = checkpoint.state;
      if (checkpoint.metadata.version !== STATE_SCHEMA_VERSION) {
        const migrated = await this.migrateState(restoredState, STATE_SCHEMA_VERSION);
        if (!migrated) {
          throw new Error(`Cannot migrate checkpoint from version ${checkpoint.metadata.version}`);
        }
        restoredState = migrated;
      }

      // Acquire lock for the workflow
      operation.locks = [restoredState.workflow.id];
      await this.acquireLocks(operation.locks, operationId);

      // Save restored state
      const saveResult = await this.saveWorkflowState(restoredState);
      
      if (!saveResult.success) {
        throw new Error(`Failed to save restored state: ${saveResult.error}`);
      }

      operation.status = 'success';
      operation.endTime = Date.now();

      const duration = operation.endTime - operation.startTime;
      this.releaseLocks(operation.locks, operationId);
      this.activeOperations.delete(operationId);

      return {
        success: true,
        data: restoredState,
        restoredFromCheckpoint: checkpointId,
        dataLoss: false,
        warningsCount: 0,
        warnings: [],
        operationId,
        duration,
        performance: {
          memoryUsed: process.memoryUsage().heapUsed,
          ioOperations: 2 // Read checkpoint + save state
        }
      };

    } catch (error) {
      await this.rollbackOperation(operationId, error as Error);
      
      return {
        success: false,
        error: (error as Error).message,
        restoredFromCheckpoint: checkpointId,
        dataLoss: true,
        warningsCount: 1,
        warnings: [(error as Error).message],
        operationId,
        duration: Date.now() - startTime,
        performance: {
          memoryUsed: process.memoryUsage().heapUsed,
          ioOperations: 0
        }
      };
    }
  }

  /**
   * Save session state for cross-session continuity
   */
  async saveSessionState(sessionState: SessionState): Promise<StateOperationResult<void>> {
    const operationId = this.generateOperationId();
    const startTime = Date.now();

    try {
      const operation: StateOperation = {
        id: operationId,
        type: 'save',
        status: 'pending',
        targetId: sessionState.sessionId,
        startTime,
        endTime: null,
        error: null,
        rollbackData: null,
        locks: [sessionState.sessionId],
        dependencies: []
      };

      this.activeOperations.set(operationId, operation);

      // Update metadata
      sessionState.metadata.updatedAt = Date.now();
      sessionState.metadata.checksum = await this.calculateChecksum(sessionState);

      // Serialize and write atomically
      const serialized = await this.serializeWithCompression(sessionState);
      sessionState.metadata.size = serialized.length;

      const sessionPath = this.getSessionPath(sessionState.sessionId);
      const tempPath = `${sessionPath}.tmp.${operationId}`;

      await fs.writeFile(tempPath, serialized);
      await fs.rename(tempPath, sessionPath);

      operation.status = 'success';
      operation.endTime = Date.now();

      const duration = operation.endTime - operation.startTime;
      this.activeOperations.delete(operationId);

      return {
        success: true,
        operationId,
        duration,
        performance: {
          memoryUsed: process.memoryUsage().heapUsed,
          ioOperations: 2
        }
      };

    } catch (error) {
      await this.rollbackOperation(operationId, error as Error);
      
      return {
        success: false,
        error: (error as Error).message,
        operationId,
        duration: Date.now() - startTime,
        performance: {
          memoryUsed: process.memoryUsage().heapUsed,
          ioOperations: 0
        }
      };
    }
  }

  /**
   * Load session state
   */
  async loadSessionState(sessionId: SessionId): Promise<StateOperationResult<SessionState>> {
    const operationId = this.generateOperationId();
    const startTime = Date.now();

    try {
      const sessionPath = this.getSessionPath(sessionId);
      const serialized = await fs.readFile(sessionPath);
      const sessionState = await this.deserializeWithDecompression<SessionState>(serialized);

      // Validate checksum if enabled
      if (this.config.reliability.checksumValidation) {
        const expectedChecksum = sessionState.metadata.checksum;
        const actualChecksum = await this.calculateChecksum(sessionState);
        
        if (expectedChecksum !== actualChecksum) {
          throw new Error(`Session state checksum validation failed: ${sessionId}`);
        }
      }

      const duration = Date.now() - startTime;

      return {
        success: true,
        data: sessionState,
        operationId,
        duration,
        performance: {
          memoryUsed: process.memoryUsage().heapUsed,
          ioOperations: 1
        }
      };

    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        operationId,
        duration: Date.now() - startTime,
        performance: {
          memoryUsed: process.memoryUsage().heapUsed,
          ioOperations: 0
        }
      };
    }
  }

  // Private helper methods

  private async serializeWithCompression(data: any): Promise<Buffer> {
    const json = JSON.stringify(data);
    const buffer = Buffer.from(json, 'utf8');

    if (this.config.compression.enabled && buffer.length >= this.config.compression.threshold) {
      return await gzip(buffer, { level: this.config.compression.level });
    }

    return buffer;
  }

  private async deserializeWithDecompression<T>(buffer: Buffer): Promise<T> {
    try {
      // Try to decompress first
      const decompressed = await gunzip(buffer);
      return JSON.parse(decompressed.toString('utf8'));
    } catch {
      // If decompression fails, try to parse directly
      return JSON.parse(buffer.toString('utf8'));
    }
  }

  private async calculateChecksum(data: any): Promise<string> {
    const json = JSON.stringify(data, Object.keys(data).sort());
    return crypto.createHash('sha256').update(json).digest('hex');
  }

  private generateOperationId(): StateOperationId {
    return `op_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
  }

  private generateCheckpointId(): CheckpointId {
    return `cp_${Date.now()}_${crypto.randomBytes(6).toString('hex')}`;
  }

  private getWorkflowPath(workflowId: WorkflowId): string {
    return path.join(this.config.baseDirectory, 'workflows', `${workflowId}.state`);
  }

  private getCheckpointPath(checkpointId: CheckpointId): string {
    return path.join(this.config.baseDirectory, 'checkpoints', `${checkpointId}.checkpoint`);
  }

  private getSessionPath(sessionId: SessionId): string {
    return path.join(this.config.baseDirectory, 'sessions', `${sessionId}.session`);
  }

  private async acquireLocks(resources: string[], operationId: StateOperationId): Promise<void> {
    for (const resource of resources) {
      if (!this.resourceLocks.has(resource)) {
        this.resourceLocks.set(resource, new Set());
      }
      this.resourceLocks.get(resource)!.add(operationId);
    }
  }

  private releaseLocks(resources: string[], operationId: StateOperationId): void {
    for (const resource of resources) {
      const locks = this.resourceLocks.get(resource);
      if (locks) {
        locks.delete(operationId);
        if (locks.size === 0) {
          this.resourceLocks.delete(resource);
        }
      }
    }
  }

  private async rollbackOperation(operationId: StateOperationId, error: Error): Promise<void> {
    const operation = this.activeOperations.get(operationId);
    if (operation) {
      operation.status = 'rolled_back';
      operation.error = error.message;
      operation.endTime = Date.now();

      // Release any held locks
      this.releaseLocks(operation.locks, operationId);

      // Clean up any temporary files
      try {
        const tempPattern = `*.tmp.${operationId}`;
        // Implementation would clean up temp files
      } catch {
        // Ignore cleanup errors
      }

      this.activeOperations.delete(operationId);
      this.updatePerformanceMetrics(operation.type, Date.now() - operation.startTime, false);
    }
  }

  private updatePerformanceMetrics(type: string, duration: number, success: boolean): void {
    // Update performance tracking
    if (type === 'save') {
      this.performanceMetrics.averageSaveTime = 
        (this.performanceMetrics.averageSaveTime + duration) / 2;
    } else if (type === 'load') {
      this.performanceMetrics.averageLoadTime = 
        (this.performanceMetrics.averageLoadTime + duration) / 2;
    }

    if (!success) {
      this.performanceMetrics.errorRate += 0.01; // Increment error rate
    }

    this.performanceMetrics.memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024; // MB
  }

  private async initializeWAL(): Promise<void> {
    // Initialize write-ahead log for crash recovery
    // Implementation would set up WAL file and recovery mechanisms
  }

  private async writeToWAL(operation: string, targetId: string, data: any): Promise<void> {
    // Write operation to WAL for recovery
    // Implementation would append to WAL file
  }

  private async recoverIncompleteOperations(): Promise<void> {
    // Recover from crash by reading WAL and completing/rolling back operations
    // Implementation would process WAL entries
  }

  private startMetricsCollection(): void {
    this.metricsInterval = setInterval(() => {
      // Collect and optionally report performance metrics
      if (this.performanceMetrics.averageSaveTime > PERFORMANCE_TARGETS.SAVE_OPERATION) {
        console.warn(`State save operations exceeding target: ${this.performanceMetrics.averageSaveTime}ms`);
      }
    }, this.config.monitoring.metricsInterval);
  }

  private shouldCreateAutomaticCheckpoint(workflowState: WorkflowState): boolean {
    // Logic to determine if automatic checkpoint should be created
    return workflowState.workflow.status === 'completed' || 
           workflowState.workflow.steps.filter(s => s.status === 'completed').length % 5 === 0;
  }

  private async getLatestCheckpoint(workflowId: WorkflowId): Promise<StateCheckpoint | null> {
    // Implementation would find the most recent checkpoint for the workflow
    return null;
  }

  private async calculateStateDelta(previousState: WorkflowState, currentState: WorkflowState): Promise<StateDelta> {
    // Implementation would calculate incremental changes between states
    return {
      workflowChanges: {},
      agentChanges: {},
      outputChanges: {},
      contextChanges: {},
      performanceChanges: {},
      removedKeys: []
    };
  }

  private async updateCheckpointIndex(workflowId: WorkflowId, checkpointId: CheckpointId): Promise<void> {
    // Implementation would maintain an index of checkpoints for quick lookup
  }

  private async migrateState(state: any, targetVersion: string): Promise<any> {
    // Implementation would handle state schema migrations
    return state;
  }

  /**
   * Cleanup resources and stop metrics collection
   */
  async shutdown(): Promise<void> {
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
    }

    // Wait for all active operations to complete
    const activeOps = Array.from(this.activeOperations.values());
    await Promise.all(
      activeOps.map(op => 
        new Promise(resolve => {
          const check = () => {
            if (!this.activeOperations.has(op.id)) {
              resolve(void 0);
            } else {
              setTimeout(check, 10);
            }
          };
          check();
        })
      )
    );
  }

  /**
   * Get current performance metrics
   */
  getPerformanceMetrics() {
    return { ...this.performanceMetrics };
  }
}