/**
 * Checkpoint Manager
 * Advanced checkpoint system with incremental updates, cleanup policies, and fast recovery
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import {
  StateCheckpoint,
  WorkflowState,
  CheckpointId,
  WorkflowId,
  SessionId,
  StateDelta,
  StateQuery,
  StateQueryResult,
  CheckpointResult,
  RestoreResult,
  CrashRecoveryData,
  StatePersistenceConfig
} from './types.js';
import { StateManager } from './state-manager.js';

interface CheckpointIndex {
  workflowId: WorkflowId;
  checkpoints: CheckpointEntry[];
  totalSize: number;
  lastCleanup: number;
}

interface CheckpointEntry {
  checkpointId: CheckpointId;
  timestamp: number;
  type: StateCheckpoint['type'];
  size: number;
  parentCheckpointId: CheckpointId | null;
  tags: string[];
  description: string;
  isIncremental: boolean;
  retentionExpiry: number | null;
}

interface CleanupPolicy {
  maxCheckpoints: number;
  maxAge: number; // milliseconds
  maxTotalSize: number; // bytes
  keepMinimum: number;
  preserveTypes: StateCheckpoint['type'][];
  preserveTags: string[];
}

export class CheckpointManager {
  private stateManager: StateManager;
  private config: StatePersistenceConfig;
  private checkpointIndexes: Map<WorkflowId, CheckpointIndex>;
  private cleanupPolicy: CleanupPolicy;
  private indexPath: string;

  constructor(stateManager: StateManager, config: StatePersistenceConfig) {
    this.stateManager = stateManager;
    this.config = config;
    this.checkpointIndexes = new Map();
    this.indexPath = path.join(config.baseDirectory, 'checkpoint-index.json');
    
    this.cleanupPolicy = {
      maxCheckpoints: 50,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      maxTotalSize: 1024 * 1024 * 1024, // 1GB
      keepMinimum: 5,
      preserveTypes: ['manual'],
      preserveTags: ['milestone', 'release', 'backup']
    };

    this.initializeCheckpointManager();
  }

  private async initializeCheckpointManager(): Promise<void> {
    // Load existing checkpoint indexes
    await this.loadCheckpointIndexes();
    
    // Schedule periodic cleanup
    setInterval(() => {
      this.performScheduledCleanup();
    }, 60 * 60 * 1000); // Every hour
  }

  /**
   * Create checkpoint with automatic incremental delta calculation
   */
  async createCheckpoint(
    workflowState: WorkflowState,
    type: StateCheckpoint['type'] = 'manual',
    description: string = '',
    tags: string[] = []
  ): Promise<CheckpointResult> {
    const workflowId = workflowState.workflow.id;
    
    // Get workflow's checkpoint index
    let index = this.checkpointIndexes.get(workflowId);
    if (!index) {
      index = {
        workflowId,
        checkpoints: [],
        totalSize: 0,
        lastCleanup: Date.now()
      };
      this.checkpointIndexes.set(workflowId, index);
    }

    // Find the most recent checkpoint for delta calculation
    const previousCheckpoint = await this.getLatestCheckpoint(workflowId);
    const isIncremental = previousCheckpoint !== null && type === 'automatic';

    let delta: StateDelta | null = null;
    if (isIncremental && previousCheckpoint) {
      delta = await this.calculateOptimizedDelta(previousCheckpoint.state, workflowState);
    }

    // Create checkpoint using state manager
    const result = await this.stateManager.createCheckpoint(workflowState, type, description, tags);
    
    if (result.success && result.data) {
      // Update checkpoint index
      const entry: CheckpointEntry = {
        checkpointId: result.checkpointId,
        timestamp: Date.now(),
        type,
        size: result.size,
        parentCheckpointId: previousCheckpoint?.checkpointId || null,
        tags,
        description,
        isIncremental,
        retentionExpiry: this.calculateRetentionExpiry(type, tags)
      };

      index.checkpoints.push(entry);
      index.totalSize += result.size;

      // Sort checkpoints by timestamp
      index.checkpoints.sort((a, b) => a.timestamp - b.timestamp);

      // Save updated index
      await this.saveCheckpointIndexes();

      // Check if cleanup is needed
      if (this.shouldTriggerCleanup(index)) {
        await this.cleanupWorkflowCheckpoints(workflowId);
      }
    }

    return result;
  }

  /**
   * Create automatic checkpoint at workflow milestones
   */
  async createAutomaticCheckpoint(
    workflowState: WorkflowState,
    trigger: 'step_completed' | 'error' | 'pause' | 'milestone'
  ): Promise<CheckpointResult> {
    const tags = [`auto_${trigger}`];
    const description = `Automatic checkpoint: ${trigger}`;

    // Add specific tags based on trigger
    if (trigger === 'error') {
      tags.push('error_recovery');
    } else if (trigger === 'milestone') {
      tags.push('milestone');
    }

    return this.createCheckpoint(workflowState, 'automatic', description, tags);
  }

  /**
   * Get checkpoint by ID with validation
   */
  async getCheckpoint(checkpointId: CheckpointId): Promise<StateCheckpoint | null> {
    try {
      const checkpointPath = path.join(this.config.baseDirectory, 'checkpoints', `${checkpointId}.checkpoint`);
      const serialized = await fs.readFile(checkpointPath);
      
      // Use state manager's deserialization for consistency
      const checkpoint = JSON.parse(serialized.toString()); // Simplified for now
      
      // Validate checkpoint integrity
      if (!this.validateCheckpoint(checkpoint)) {
        throw new Error(`Checkpoint validation failed: ${checkpointId}`);
      }

      return checkpoint;
    } catch (error) {
      console.error(`Failed to load checkpoint ${checkpointId}:`, error);
      return null;
    }
  }

  /**
   * Restore workflow from checkpoint with recovery options
   */
  async restoreFromCheckpoint(
    checkpointId: CheckpointId,
    options: {
      validateIntegrity?: boolean;
      allowPartialRestore?: boolean;
      restoreStrategy?: 'full' | 'incremental' | 'minimal';
    } = {}
  ): Promise<RestoreResult> {
    const {
      validateIntegrity = true,
      allowPartialRestore = false,
      restoreStrategy = 'full'
    } = options;

    try {
      const checkpoint = await this.getCheckpoint(checkpointId);
      if (!checkpoint) {
        throw new Error(`Checkpoint not found: ${checkpointId}`);
      }

      // Validate checkpoint chain if doing incremental restore
      if (restoreStrategy === 'incremental' && checkpoint.delta) {
        const chainValid = await this.validateCheckpointChain(checkpointId);
        if (!chainValid && !allowPartialRestore) {
          throw new Error(`Checkpoint chain validation failed: ${checkpointId}`);
        }
      }

      // Restore state based on strategy
      let restoredState: WorkflowState;
      
      if (restoreStrategy === 'incremental' && checkpoint.delta) {
        restoredState = await this.reconstructFromDelta(checkpoint);
      } else {
        restoredState = checkpoint.state;
      }

      // Use state manager to restore
      const result = await this.stateManager.restoreFromCheckpoint(checkpointId);
      
      if (result.success) {
        // Update checkpoint index - mark as recently accessed
        await this.markCheckpointAccessed(checkpointId);
      }

      return result;

    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        restoredFromCheckpoint: checkpointId,
        dataLoss: true,
        warningsCount: 1,
        warnings: [(error as Error).message],
        operationId: 'restore_' + Date.now(),
        duration: 0,
        performance: {
          memoryUsed: process.memoryUsage().heapUsed,
          ioOperations: 0
        }
      };
    }
  }

  /**
   * List checkpoints with advanced filtering
   */
  async listCheckpoints(query: StateQuery): Promise<StateQueryResult<CheckpointEntry>> {
    const results: CheckpointEntry[] = [];
    
    // Get all relevant workflow indexes
    const workflowIds = query.workflowId ? [query.workflowId] : 
      Array.from(this.checkpointIndexes.keys());

    for (const workflowId of workflowIds) {
      const index = this.checkpointIndexes.get(workflowId);
      if (!index) continue;

      let checkpoints = [...index.checkpoints];

      // Apply filters
      if (query.timeRange) {
        checkpoints = checkpoints.filter(cp => 
          cp.timestamp >= query.timeRange!.start && 
          cp.timestamp <= query.timeRange!.end
        );
      }

      if (query.tags && query.tags.length > 0) {
        checkpoints = checkpoints.filter(cp =>
          query.tags!.some(tag => cp.tags.includes(tag))
        );
      }

      results.push(...checkpoints);
    }

    // Sort results
    const sortBy = query.sortBy || 'created';
    const sortOrder = query.sortOrder || 'desc';
    
    results.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'created') {
        comparison = a.timestamp - b.timestamp;
      } else if (sortBy === 'size') {
        comparison = a.size - b.size;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    // Apply pagination
    const offset = query.offset || 0;
    const limit = query.limit || 50;
    const paginatedResults = results.slice(offset, offset + limit);

    return {
      items: paginatedResults,
      total: results.length,
      hasMore: offset + limit < results.length,
      nextOffset: offset + limit < results.length ? offset + limit : undefined
    };
  }

  /**
   * Cleanup old checkpoints based on retention policy
   */
  async cleanupWorkflowCheckpoints(workflowId: WorkflowId): Promise<number> {
    const index = this.checkpointIndexes.get(workflowId);
    if (!index) return 0;

    const now = Date.now();
    let deletedCount = 0;
    const toDelete: CheckpointId[] = [];

    // Sort checkpoints by timestamp (oldest first)
    const sortedCheckpoints = [...index.checkpoints].sort((a, b) => a.timestamp - b.timestamp);

    // Apply cleanup rules
    for (let i = 0; i < sortedCheckpoints.length; i++) {
      const checkpoint = sortedCheckpoints[i];
      
      // Keep minimum number of checkpoints
      if (sortedCheckpoints.length - deletedCount <= this.cleanupPolicy.keepMinimum) {
        break;
      }

      // Preserve certain types
      if (this.cleanupPolicy.preserveTypes.includes(checkpoint.type)) {
        continue;
      }

      // Preserve certain tags
      if (checkpoint.tags.some(tag => this.cleanupPolicy.preserveTags.includes(tag))) {
        continue;
      }

      // Check age limit
      if (now - checkpoint.timestamp > this.cleanupPolicy.maxAge) {
        toDelete.push(checkpoint.checkpointId);
        deletedCount++;
        continue;
      }

      // Check if we exceed maximum checkpoints
      if (sortedCheckpoints.length - deletedCount > this.cleanupPolicy.maxCheckpoints) {
        toDelete.push(checkpoint.checkpointId);
        deletedCount++;
        continue;
      }

      // Check total size limit
      if (index.totalSize > this.cleanupPolicy.maxTotalSize) {
        toDelete.push(checkpoint.checkpointId);
        deletedCount++;
        index.totalSize -= checkpoint.size;
      }
    }

    // Delete checkpoints
    for (const checkpointId of toDelete) {
      await this.deleteCheckpoint(checkpointId);
      index.checkpoints = index.checkpoints.filter(cp => cp.checkpointId !== checkpointId);
    }

    // Update cleanup timestamp
    index.lastCleanup = now;
    await this.saveCheckpointIndexes();

    return deletedCount;
  }

  /**
   * Validate checkpoint integrity
   */
  async validateCheckpoint(checkpoint: StateCheckpoint): Promise<boolean> {
    try {
      // Check required fields
      if (!checkpoint.checkpointId || !checkpoint.workflowId || !checkpoint.state) {
        return false;
      }

      // Validate metadata
      if (!checkpoint.metadata || !checkpoint.metadata.checksum) {
        return false;
      }

      // Validate state structure
      const state = checkpoint.state;
      if (!state.workflow || !state.workflow.id || !state.metadata) {
        return false;
      }

      // Additional validation rules can be added here
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get recovery suggestions for corrupted or missing checkpoints
   */
  async getRecoverySuggestions(workflowId: WorkflowId): Promise<{
    availableCheckpoints: CheckpointEntry[];
    recommendedRecoveryPoint: CheckpointId | null;
    recoveryStrategy: 'latest' | 'stable' | 'manual_selection';
    warnings: string[];
  }> {
    const index = this.checkpointIndexes.get(workflowId);
    const warnings: string[] = [];
    
    if (!index || index.checkpoints.length === 0) {
      return {
        availableCheckpoints: [],
        recommendedRecoveryPoint: null,
        recoveryStrategy: 'manual_selection',
        warnings: ['No checkpoints available for recovery']
      };
    }

    // Find valid checkpoints
    const validCheckpoints: CheckpointEntry[] = [];
    for (const checkpoint of index.checkpoints) {
      const isValid = await this.validateCheckpointFile(checkpoint.checkpointId);
      if (isValid) {
        validCheckpoints.push(checkpoint);
      } else {
        warnings.push(`Checkpoint ${checkpoint.checkpointId} is corrupted or missing`);
      }
    }

    if (validCheckpoints.length === 0) {
      return {
        availableCheckpoints: [],
        recommendedRecoveryPoint: null,
        recoveryStrategy: 'manual_selection',
        warnings: ['All checkpoints are corrupted or missing']
      };
    }

    // Sort by timestamp (newest first)
    validCheckpoints.sort((a, b) => b.timestamp - a.timestamp);

    // Determine recovery strategy
    let recommendedRecoveryPoint = validCheckpoints[0].checkpointId;
    let recoveryStrategy: 'latest' | 'stable' | 'manual_selection' = 'latest';

    // Prefer manual or milestone checkpoints if available
    const stableCheckpoint = validCheckpoints.find(cp => 
      cp.type === 'manual' || cp.tags.includes('milestone') || cp.tags.includes('stable')
    );

    if (stableCheckpoint && Date.now() - stableCheckpoint.timestamp < 24 * 60 * 60 * 1000) {
      recommendedRecoveryPoint = stableCheckpoint.checkpointId;
      recoveryStrategy = 'stable';
    }

    return {
      availableCheckpoints: validCheckpoints,
      recommendedRecoveryPoint,
      recoveryStrategy,
      warnings
    };
  }

  /**
   * Export checkpoint for external backup
   */
  async exportCheckpoint(checkpointId: CheckpointId): Promise<Buffer> {
    const checkpoint = await this.getCheckpoint(checkpointId);
    if (!checkpoint) {
      throw new Error(`Checkpoint not found: ${checkpointId}`);
    }

    // Create export bundle with metadata
    const exportData = {
      version: '1.0',
      exportedAt: Date.now(),
      checkpoint,
      integrity: {
        checksum: checkpoint.metadata.checksum,
        size: checkpoint.metadata.size
      }
    };

    return Buffer.from(JSON.stringify(exportData, null, 2));
  }

  /**
   * Import checkpoint from external backup
   */
  async importCheckpoint(data: Buffer): Promise<CheckpointId> {
    const exportData = JSON.parse(data.toString());
    
    if (!exportData.checkpoint || !exportData.integrity) {
      throw new Error('Invalid checkpoint export format');
    }

    const checkpoint = exportData.checkpoint as StateCheckpoint;
    
    // Validate imported checkpoint
    if (!await this.validateCheckpoint(checkpoint)) {
      throw new Error('Imported checkpoint failed validation');
    }

    // Save checkpoint
    const checkpointPath = path.join(
      this.config.baseDirectory, 
      'checkpoints', 
      `${checkpoint.checkpointId}.checkpoint`
    );
    
    await fs.writeFile(checkpointPath, JSON.stringify(checkpoint));

    // Update index
    const workflowId = checkpoint.workflowId;
    let index = this.checkpointIndexes.get(workflowId);
    
    if (!index) {
      index = {
        workflowId,
        checkpoints: [],
        totalSize: 0,
        lastCleanup: Date.now()
      };
      this.checkpointIndexes.set(workflowId, index);
    }

    const entry: CheckpointEntry = {
      checkpointId: checkpoint.checkpointId,
      timestamp: checkpoint.metadata.createdAt,
      type: checkpoint.type,
      size: checkpoint.metadata.size,
      parentCheckpointId: checkpoint.parentCheckpointId,
      tags: checkpoint.tags,
      description: checkpoint.description,
      isIncremental: checkpoint.delta !== null,
      retentionExpiry: null // Imported checkpoints don't expire automatically
    };

    index.checkpoints.push(entry);
    index.totalSize += entry.size;
    
    await this.saveCheckpointIndexes();

    return checkpoint.checkpointId;
  }

  // Private helper methods

  private async loadCheckpointIndexes(): Promise<void> {
    try {
      const data = await fs.readFile(this.indexPath, 'utf8');
      const indexes = JSON.parse(data);
      
      for (const [workflowId, index] of Object.entries(indexes)) {
        this.checkpointIndexes.set(workflowId, index as CheckpointIndex);
      }
    } catch {
      // Index file doesn't exist, start fresh
    }
  }

  private async saveCheckpointIndexes(): Promise<void> {
    const indexes = Object.fromEntries(this.checkpointIndexes);
    await fs.writeFile(this.indexPath, JSON.stringify(indexes, null, 2));
  }

  private async getLatestCheckpoint(workflowId: WorkflowId): Promise<StateCheckpoint | null> {
    const index = this.checkpointIndexes.get(workflowId);
    if (!index || index.checkpoints.length === 0) {
      return null;
    }

    // Find most recent checkpoint
    const latest = index.checkpoints.reduce((latest, current) => 
      current.timestamp > latest.timestamp ? current : latest
    );

    return this.getCheckpoint(latest.checkpointId);
  }

  private async calculateOptimizedDelta(previousState: WorkflowState, currentState: WorkflowState): Promise<StateDelta> {
    // Advanced delta calculation with deep comparison
    const delta: StateDelta = {
      workflowChanges: {},
      agentChanges: {},
      outputChanges: {},
      contextChanges: {},
      performanceChanges: {},
      removedKeys: []
    };

    // Compare workflow state
    if (JSON.stringify(previousState.workflow) !== JSON.stringify(currentState.workflow)) {
      delta.workflowChanges = this.getObjectDiff(previousState.workflow, currentState.workflow);
    }

    // Compare agent states
    for (const [agentId, agentState] of Object.entries(currentState.agents)) {
      const previousAgentState = previousState.agents[agentId];
      if (!previousAgentState || JSON.stringify(previousAgentState) !== JSON.stringify(agentState)) {
        delta.agentChanges[agentId] = agentState;
      }
    }

    // Compare outputs
    for (const [stepId, output] of Object.entries(currentState.outputs)) {
      const previousOutput = previousState.outputs[stepId];
      if (!previousOutput || JSON.stringify(previousOutput) !== JSON.stringify(output)) {
        delta.outputChanges[stepId] = output;
      }
    }

    return delta;
  }

  private getObjectDiff(obj1: any, obj2: any): any {
    const diff: any = {};
    
    for (const key in obj2) {
      if (obj1[key] !== obj2[key]) {
        diff[key] = obj2[key];
      }
    }
    
    return diff;
  }

  private calculateRetentionExpiry(type: StateCheckpoint['type'], tags: string[]): number | null {
    // Manual checkpoints and milestones don't expire
    if (type === 'manual' || tags.includes('milestone') || tags.includes('backup')) {
      return null;
    }

    // Automatic checkpoints expire based on policy
    return Date.now() + this.cleanupPolicy.maxAge;
  }

  private shouldTriggerCleanup(index: CheckpointIndex): boolean {
    return (
      index.checkpoints.length > this.cleanupPolicy.maxCheckpoints ||
      index.totalSize > this.cleanupPolicy.maxTotalSize ||
      Date.now() - index.lastCleanup > 24 * 60 * 60 * 1000 // 24 hours
    );
  }

  private async performScheduledCleanup(): Promise<void> {
    for (const workflowId of this.checkpointIndexes.keys()) {
      const index = this.checkpointIndexes.get(workflowId)!;
      if (this.shouldTriggerCleanup(index)) {
        await this.cleanupWorkflowCheckpoints(workflowId);
      }
    }
  }

  private async deleteCheckpoint(checkpointId: CheckpointId): Promise<void> {
    try {
      const checkpointPath = path.join(
        this.config.baseDirectory, 
        'checkpoints', 
        `${checkpointId}.checkpoint`
      );
      await fs.unlink(checkpointPath);
    } catch {
      // Ignore errors for missing files
    }
  }

  private async validateCheckpointChain(checkpointId: CheckpointId): Promise<boolean> {
    // Implementation would validate the chain of incremental checkpoints
    return true;
  }

  private async reconstructFromDelta(checkpoint: StateCheckpoint): Promise<WorkflowState> {
    // Implementation would reconstruct full state from delta chain
    return checkpoint.state;
  }

  private async markCheckpointAccessed(checkpointId: CheckpointId): Promise<void> {
    // Implementation would update access timestamp for LRU cleanup
  }

  private async validateCheckpointFile(checkpointId: CheckpointId): Promise<boolean> {
    try {
      const checkpointPath = path.join(
        this.config.baseDirectory, 
        'checkpoints', 
        `${checkpointId}.checkpoint`
      );
      await fs.access(checkpointPath);
      return true;
    } catch {
      return false;
    }
  }
}