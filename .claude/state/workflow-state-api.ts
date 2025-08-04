/**
 * Workflow State API
 * Unified interface for workflow state persistence, checkpoints, and session management
 */

import * as path from 'path';
import {
  WorkflowState,
  SessionState,
  StateCheckpoint,
  CheckpointId,
  WorkflowId,
  SessionId,
  StateOperationResult,
  CheckpointResult,
  RestoreResult,
  StatePersistenceConfig,
  StateQuery,
  StateQueryResult,
  AgentState,
  StepOutput,
  WorkflowStep,
  PerformanceMetrics
} from './types.js';
import { StateManager } from './state-manager.js';
import { CheckpointManager } from './checkpoint-manager.js';
import { SessionManager } from './session-manager.js';

/**
 * High-level API for workflow state management
 * Provides atomic operations, checkpoint management, and session continuity
 */
export class WorkflowStateAPI {
  private stateManager: StateManager;
  private checkpointManager: CheckpointManager;
  private sessionManager: SessionManager;
  private config: StatePersistenceConfig;
  private initialized: boolean = false;

  constructor(baseDirectory: string = '.claude/state') {
    this.config = this.createDefaultConfig(baseDirectory);
    this.stateManager = new StateManager(this.config);
    this.checkpointManager = new CheckpointManager(this.stateManager, this.config);
    this.sessionManager = new SessionManager(this.stateManager, this.checkpointManager, this.config);
  }

  /**
   * Initialize the state API with custom configuration
   */
  async initialize(customConfig?: Partial<StatePersistenceConfig>): Promise<void> {
    if (customConfig) {
      this.config = { ...this.config, ...customConfig };
    }

    // Ensure all components are properly initialized
    this.initialized = true;
  }

  /**
   * Create a new workflow with initial state
   */
  async createWorkflow(
    workflowId: WorkflowId,
    name: string,
    sessionId: SessionId,
    steps: Omit<WorkflowStep, 'status' | 'startTime' | 'endTime' | 'retryCount' | 'error' | 'output'>[] = []
  ): Promise<StateOperationResult<WorkflowState>> {
    this.ensureInitialized();

    const now = Date.now();
    const workflowState: WorkflowState = {
      metadata: {
        id: workflowId,
        version: '1.0.0',
        createdAt: now,
        updatedAt: now,
        checksum: '',
        size: 0,
        compressed: false
      },
      workflow: {
        id: workflowId,
        name,
        status: 'idle',
        currentStep: null,
        steps: steps.map(step => ({
          ...step,
          status: 'pending',
          startTime: null,
          endTime: null,
          retryCount: 0,
          error: null,
          output: null
        })),
        progress: 0,
        startTime: null,
        endTime: null,
        error: null
      },
      agents: {},
      outputs: {},
      context: {
        sessionId,
        userId: null,
        environment: 'development',
        configuration: {},
        variables: {},
        secrets: {},
        features: {}
      },
      performance: {
        totalExecutionTime: 0,
        stepExecutionTimes: {},
        agentPerformance: {},
        memoryPeakUsage: 0,
        ioOperations: 0,
        networkRequests: 0,
        cacheHitRate: 0,
        errorCount: 0
      }
    };

    const result = await this.stateManager.saveWorkflowState(workflowState);
    
    if (result.success) {
      // Create initial checkpoint
      await this.checkpointManager.createCheckpoint(
        workflowState,
        'manual',
        'Initial workflow creation',
        ['creation', 'initial']
      );
    }

    return result;
  }

  /**
   * Save workflow state with automatic checkpoint creation
   */
  async saveWorkflowState(
    workflowState: WorkflowState,
    createCheckpoint: boolean = false,
    checkpointTags: string[] = []
  ): Promise<StateOperationResult<void>> {
    this.ensureInitialized();

    const result = await this.stateManager.saveWorkflowState(workflowState);

    if (result.success && createCheckpoint) {
      await this.checkpointManager.createCheckpoint(
        workflowState,
        'automatic',
        'Auto-checkpoint on save',
        checkpointTags
      );
    }

    return result;
  }

  /**
   * Load workflow state with caching
   */
  async loadWorkflowState(workflowId: WorkflowId): Promise<StateOperationResult<WorkflowState>> {
    this.ensureInitialized();
    return this.stateManager.loadWorkflowState(workflowId);
  }

  /**
   * Update workflow step status with automatic state saving
   */
  async updateStepStatus(
    workflowId: WorkflowId,
    stepId: string,
    status: WorkflowStep['status'],
    output?: any,
    error?: string
  ): Promise<StateOperationResult<void>> {
    this.ensureInitialized();

    const loadResult = await this.stateManager.loadWorkflowState(workflowId);
    if (!loadResult.success || !loadResult.data) {
      return {
        success: false,
        error: `Failed to load workflow: ${loadResult.error}`,
        operationId: 'update_step_' + Date.now(),
        duration: 0,
        performance: { memoryUsed: 0, ioOperations: 0 }
      };
    }

    const workflowState = loadResult.data;
    const step = workflowState.workflow.steps.find(s => s.id === stepId);
    
    if (!step) {
      return {
        success: false,
        error: `Step not found: ${stepId}`,
        operationId: 'update_step_' + Date.now(),
        duration: 0,
        performance: { memoryUsed: 0, ioOperations: 0 }
      };
    }

    // Update step
    const now = Date.now();
    step.status = status;
    step.error = error || null;
    step.output = output || null;

    if (status === 'running' && !step.startTime) {
      step.startTime = now;
    } else if ((status === 'completed' || status === 'failed') && !step.endTime) {
      step.endTime = now;
      
      // Update performance metrics
      if (step.startTime) {
        const executionTime = step.endTime - step.startTime;
        workflowState.performance.stepExecutionTimes[stepId] = executionTime;
        workflowState.performance.totalExecutionTime += executionTime;
      }
    }

    // Update workflow progress
    const completedSteps = workflowState.workflow.steps.filter(s => 
      s.status === 'completed' || s.status === 'failed' || s.status === 'skipped'
    ).length;
    workflowState.performance.totalExecutionTime = (completedSteps / workflowState.workflow.steps.length) * 100;

    // Update workflow status
    if (status === 'failed' && error) {
      workflowState.workflow.status = 'failed';
      workflowState.workflow.error = error;
      workflowState.workflow.endTime = now;
    } else if (completedSteps === workflowState.workflow.steps.length) {
      const hasFailures = workflowState.workflow.steps.some(s => s.status === 'failed');
      workflowState.workflow.status = hasFailures ? 'failed' : 'completed';
      workflowState.workflow.endTime = now;
    }

    // Save updated state
    const saveResult = await this.stateManager.saveWorkflowState(workflowState);

    // Create checkpoint on significant events
    if (saveResult.success && (status === 'completed' || status === 'failed')) {
      await this.checkpointManager.createAutomaticCheckpoint(
        workflowState,
        status === 'failed' ? 'error' : 'milestone'
      );
    }

    return saveResult;
  }

  /**
   * Update agent state
   */
  async updateAgentState(
    workflowId: WorkflowId,
    agentId: string,
    agentState: AgentState
  ): Promise<StateOperationResult<void>> {
    this.ensureInitialized();

    const loadResult = await this.stateManager.loadWorkflowState(workflowId);
    if (!loadResult.success || !loadResult.data) {
      return {
        success: false,
        error: `Failed to load workflow: ${loadResult.error}`,
        operationId: 'update_agent_' + Date.now(),
        duration: 0,
        performance: { memoryUsed: 0, ioOperations: 0 }
      };
    }

    const workflowState = loadResult.data;
    workflowState.agents[agentId] = agentState;

    return this.stateManager.saveWorkflowState(workflowState);
  }

  /**
   * Add step output
   */
  async addStepOutput(
    workflowId: WorkflowId,
    stepId: string,
    output: any,
    agentId: string
  ): Promise<StateOperationResult<void>> {
    this.ensureInitialized();

    const loadResult = await this.stateManager.loadWorkflowState(workflowId);
    if (!loadResult.success || !loadResult.data) {
      return {
        success: false,
        error: `Failed to load workflow: ${loadResult.error}`,
        operationId: 'add_output_' + Date.now(),
        duration: 0,
        performance: { memoryUsed: 0, ioOperations: 0 }
      };
    }

    const workflowState = loadResult.data;
    const stepOutput: StepOutput = {
      stepId,
      agentId,
      output,
      timestamp: Date.now(),
      size: Buffer.byteLength(JSON.stringify(output)),
      compressed: false,
      checksum: '',
      version: 1
    };

    workflowState.outputs[stepId] = stepOutput;

    return this.stateManager.saveWorkflowState(workflowState);
  }

  // Checkpoint Management API

  /**
   * Create manual checkpoint
   */
  async createCheckpoint(
    workflowId: WorkflowId,
    description: string = '',
    tags: string[] = []
  ): Promise<CheckpointResult> {
    this.ensureInitialized();

    const loadResult = await this.stateManager.loadWorkflowState(workflowId);
    if (!loadResult.success || !loadResult.data) {
      return {
        success: false,
        error: `Failed to load workflow: ${loadResult.error}`,
        checkpointId: '',
        size: 0,
        compressed: false,
        operationId: 'checkpoint_' + Date.now(),
        duration: 0,
        performance: { memoryUsed: 0, ioOperations: 0 }
      };
    }

    return this.checkpointManager.createCheckpoint(
      loadResult.data,
      'manual',
      description,
      tags
    );
  }

  /**
   * Restore workflow from checkpoint
   */
  async restoreFromCheckpoint(checkpointId: CheckpointId): Promise<RestoreResult> {
    this.ensureInitialized();
    return this.checkpointManager.restoreFromCheckpoint(checkpointId);
  }

  /**
   * List checkpoints for workflow
   */
  async listCheckpoints(workflowId: WorkflowId, limit: number = 20): Promise<StateQueryResult<any>> {
    this.ensureInitialized();
    return this.checkpointManager.listCheckpoints({ workflowId, limit });
  }

  /**
   * Get checkpoint recovery suggestions
   */
  async getRecoverySuggestions(workflowId: WorkflowId) {
    this.ensureInitialized();
    return this.checkpointManager.getRecoverySuggestions(workflowId);
  }

  // Session Management API

  /**
   * Start new session
   */
  async startSession(
    userId?: string,
    environment: Record<string, any> = {}
  ): Promise<SessionState> {
    this.ensureInitialized();
    return this.sessionManager.startSession(userId, environment);
  }

  /**
   * Resume existing session
   */
  async resumeSession(sessionId: SessionId): Promise<SessionState> {
    this.ensureInitialized();
    return this.sessionManager.resumeSession(sessionId);
  }

  /**
   * End session
   */
  async endSession(sessionId: SessionId, createFinalCheckpoint: boolean = true): Promise<void> {
    this.ensureInitialized();
    return this.sessionManager.endSession(sessionId, createFinalCheckpoint);
  }

  /**
   * Export session for transfer
   */
  async exportSession(sessionId: SessionId): Promise<Buffer> {
    this.ensureInitialized();
    return this.sessionManager.exportSessionForTransfer(sessionId);
  }

  /**
   * Import session from transfer
   */
  async importSession(transferData: Buffer, newSessionId?: SessionId) {
    this.ensureInitialized();
    return this.sessionManager.importSessionFromTransfer(transferData, newSessionId);
  }

  /**
   * List sessions
   */
  async listSessions(filter: any = {}): Promise<SessionState[]> {
    this.ensureInitialized();
    return this.sessionManager.listSessions(filter);
  }

  // Performance and Monitoring API

  /**
   * Get performance metrics
   */
  getPerformanceMetrics() {
    this.ensureInitialized();
    return this.stateManager.getPerformanceMetrics();
  }

  /**
   * Get session statistics
   */
  getSessionStatistics(sessionId: SessionId) {
    this.ensureInitialized();
    return this.sessionManager.getSessionStatistics(sessionId);
  }

  // Utility Methods

  /**
   * Validate workflow state integrity
   */
  async validateWorkflowState(workflowId: WorkflowId): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    this.ensureInitialized();

    const loadResult = await this.stateManager.loadWorkflowState(workflowId);
    const result = {
      isValid: true,
      errors: [] as string[],
      warnings: [] as string[]
    };

    if (!loadResult.success) {
      result.isValid = false;
      result.errors.push(`Failed to load workflow state: ${loadResult.error}`);
      return result;
    }

    const state = loadResult.data!;

    // Validate required fields
    if (!state.workflow.id || !state.workflow.name) {
      result.isValid = false;
      result.errors.push('Missing required workflow fields');
    }

    // Validate step consistency
    for (const step of state.workflow.steps) {
      if (!step.id || !step.name) {
        result.isValid = false;
        result.errors.push(`Invalid step: ${step.id}`);
      }

      if (step.status === 'running' && !step.startTime) {
        result.warnings.push(`Running step ${step.id} has no start time`);
      }

      if ((step.status === 'completed' || step.status === 'failed') && !step.endTime) {
        result.warnings.push(`Completed step ${step.id} has no end time`);
      }
    }

    // Validate agent states
    for (const [agentId, agentState] of Object.entries(state.agents)) {
      if (!agentState.id || !agentState.name) {
        result.warnings.push(`Invalid agent state: ${agentId}`);
      }
    }

    return result;
  }

  /**
   * Cleanup old data based on retention policies
   */
  async cleanup(): Promise<{
    deletedCheckpoints: number;
    deletedSessions: number;
    freedSpace: number;
  }> {
    this.ensureInitialized();

    // This would implement cleanup logic
    return {
      deletedCheckpoints: 0,
      deletedSessions: 0,
      freedSpace: 0
    };
  }

  /**
   * Shutdown the state API
   */
  async shutdown(): Promise<void> {
    if (this.initialized) {
      await this.stateManager.shutdown();
      this.initialized = false;
    }
  }

  // Private Helper Methods

  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error('WorkflowStateAPI must be initialized before use');
    }
  }

  private createDefaultConfig(baseDirectory: string): StatePersistenceConfig {
    return {
      baseDirectory: path.resolve(baseDirectory),
      compression: {
        enabled: true,
        algorithm: 'gzip',
        level: 6,
        threshold: 1024,
        chunkSize: 64 * 1024
      },
      performance: {
        maxMemoryUsage: 256, // MB
        maxFileSize: 100, // MB
        batchSize: 50,
        parallelOperations: 4
      },
      reliability: {
        enableWAL: true,
        syncFrequency: 30000, // 30 seconds
        backupRetention: 10,
        checksumValidation: true
      },
      monitoring: {
        enableMetrics: true,
        metricsInterval: 60000, // 1 minute
        alertThresholds: {
          saveTime: 1000, // ms
          loadTime: 500, // ms
          errorRate: 0.05, // 5%
          memoryUsage: 200 // MB
        }
      }
    };
  }
}

// Export a default instance for convenience
export const workflowStateAPI = new WorkflowStateAPI();

// Export factory function for custom configurations
export function createWorkflowStateAPI(
  baseDirectory: string,
  config?: Partial<StatePersistenceConfig>
): WorkflowStateAPI {
  const api = new WorkflowStateAPI(baseDirectory);
  if (config) {
    api.initialize(config);
  }
  return api;
}