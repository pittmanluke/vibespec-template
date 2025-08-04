/**
 * Hook Integration
 * Integrates state persistence with the existing hook system for seamless workflow coordination
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import {
  WorkflowState,
  WorkflowId,
  SessionId,
  CheckpointId,
  AgentState,
  StateOperationResult
} from './types.js';
import { WorkflowStateAPI } from './workflow-state-api.js';

// Hook event types that trigger state operations
export type HookEvent = 
  | 'workflow_start'
  | 'workflow_complete' 
  | 'workflow_error'
  | 'step_start'
  | 'step_complete'
  | 'step_error'
  | 'agent_start'
  | 'agent_complete'
  | 'agent_error'
  | 'checkpoint_request'
  | 'session_start'
  | 'session_end';

// Hook payload data structures
export interface HookPayload {
  workflowId: WorkflowId;
  sessionId: SessionId;
  timestamp: number;
  data: any;
}

export interface WorkflowHookPayload extends HookPayload {
  workflowName: string;
  status: 'started' | 'completed' | 'failed';
  error?: string;
}

export interface StepHookPayload extends HookPayload {
  stepId: string;
  stepName: string;
  agentId: string;
  status: 'started' | 'completed' | 'failed';
  output?: any;
  error?: string;
  duration?: number;
}

export interface AgentHookPayload extends HookPayload {
  agentId: string;
  agentName: string;
  status: 'started' | 'completed' | 'failed';
  performance?: {
    memoryUsage: number;
    executionTime: number;
    tasksCompleted: number;
  };
  error?: string;
}

export interface CheckpointHookPayload extends HookPayload {
  checkpointId?: CheckpointId;
  type: 'manual' | 'automatic';
  description: string;
  tags: string[];
}

// State hook configuration
export interface StateHookConfig {
  enableAutoCheckpoints: boolean;
  checkpointFrequency: number; // steps between auto checkpoints
  enablePerformanceTracking: boolean;
  enableCrashRecovery: boolean;
  hookDirectory: string;
  stateDirectory: string;
}

/**
 * Integrates workflow state persistence with the hook system
 */
export class StateHookIntegrator {
  private stateAPI: WorkflowStateAPI;
  private config: StateHookConfig;
  private hookListeners: Map<HookEvent, Set<(payload: HookPayload) => Promise<void>>>;
  private activeWorkflows: Map<WorkflowId, WorkflowState>;
  private stepCounters: Map<WorkflowId, number>;
  
  constructor(stateAPI: WorkflowStateAPI, config: StateHookConfig) {
    this.stateAPI = stateAPI;
    this.config = config;
    this.hookListeners = new Map();
    this.activeWorkflows = new Map();
    this.stepCounters = new Map();
    
    this.initializeHookIntegration();
  }

  private async initializeHookIntegration(): Promise<void> {
    // Set up hook listeners for each event type
    this.setupHookListeners();
    
    // Create hook files if they don't exist
    await this.createHookFiles();
    
    // Monitor hook directory for new events
    this.startHookMonitoring();
  }

  /**
   * Register state operations for hook events
   */
  private setupHookListeners(): void {
    // Workflow lifecycle hooks
    this.registerHookListener('workflow_start', this.handleWorkflowStart.bind(this));
    this.registerHookListener('workflow_complete', this.handleWorkflowComplete.bind(this));
    this.registerHookListener('workflow_error', this.handleWorkflowError.bind(this));
    
    // Step lifecycle hooks
    this.registerHookListener('step_start', this.handleStepStart.bind(this));
    this.registerHookListener('step_complete', this.handleStepComplete.bind(this));
    this.registerHookListener('step_error', this.handleStepError.bind(this));
    
    // Agent lifecycle hooks
    this.registerHookListener('agent_start', this.handleAgentStart.bind(this));
    this.registerHookListener('agent_complete', this.handleAgentComplete.bind(this));
    this.registerHookListener('agent_error', this.handleAgentError.bind(this));
    
    // Checkpoint hooks
    this.registerHookListener('checkpoint_request', this.handleCheckpointRequest.bind(this));
    
    // Session hooks
    this.registerHookListener('session_start', this.handleSessionStart.bind(this));
    this.registerHookListener('session_end', this.handleSessionEnd.bind(this));
  }

  /**
   * Register a hook listener
   */
  registerHookListener(event: HookEvent, listener: (payload: HookPayload) => Promise<void>): void {
    if (!this.hookListeners.has(event)) {
      this.hookListeners.set(event, new Set());
    }
    this.hookListeners.get(event)!.add(listener);
  }

  /**
   * Emit a hook event with automatic state persistence
   */
  async emitHookEvent(event: HookEvent, payload: HookPayload): Promise<void> {
    try {
      // Write hook event to file system for external monitoring
      await this.writeHookEvent(event, payload);
      
      // Execute registered listeners
      const listeners = this.hookListeners.get(event);
      if (listeners) {
        await Promise.all(
          Array.from(listeners).map(listener => 
            listener(payload).catch(error => 
              console.error(`Hook listener error for ${event}:`, error)
            )
          )
        );
      }
    } catch (error) {
      console.error(`Failed to emit hook event ${event}:`, error);
    }
  }

  // Hook event handlers with state persistence

  private async handleWorkflowStart(payload: HookPayload): Promise<void> {
    const workflowPayload = payload as WorkflowHookPayload;
    
    try {
      // Create workflow state if it doesn't exist
      const loadResult = await this.stateAPI.loadWorkflowState(workflowPayload.workflowId);
      
      if (!loadResult.success) {
        // Create new workflow
        await this.stateAPI.createWorkflow(
          workflowPayload.workflowId,
          workflowPayload.workflowName,
          workflowPayload.sessionId
        );
      }

      // Load and update workflow state
      const workflowResult = await this.stateAPI.loadWorkflowState(workflowPayload.workflowId);
      if (workflowResult.success && workflowResult.data) {
        const workflowState = workflowResult.data;
        workflowState.workflow.status = 'running';
        workflowState.workflow.startTime = workflowPayload.timestamp;
        
        await this.stateAPI.saveWorkflowState(workflowState, true, ['workflow_start']);
        this.activeWorkflows.set(workflowPayload.workflowId, workflowState);
        this.stepCounters.set(workflowPayload.workflowId, 0);
      }
    } catch (error) {
      console.error(`Failed to handle workflow start for ${workflowPayload.workflowId}:`, error);
    }
  }

  private async handleWorkflowComplete(payload: HookPayload): Promise<void> {
    const workflowPayload = payload as WorkflowHookPayload;
    
    try {
      const workflowResult = await this.stateAPI.loadWorkflowState(workflowPayload.workflowId);
      if (workflowResult.success && workflowResult.data) {
        const workflowState = workflowResult.data;
        workflowState.workflow.status = 'completed';
        workflowState.workflow.endTime = workflowPayload.timestamp;
        workflowState.workflow.progress = 100;
        
        // Create final checkpoint
        await this.stateAPI.saveWorkflowState(workflowState, true, ['workflow_complete', 'final']);
        
        // Create final manual checkpoint for preservation
        await this.stateAPI.createCheckpoint(
          workflowPayload.workflowId,
          'Workflow completed successfully',
          ['completion', 'final', 'preserve']
        );
        
        this.activeWorkflows.delete(workflowPayload.workflowId);
        this.stepCounters.delete(workflowPayload.workflowId);
      }
    } catch (error) {
      console.error(`Failed to handle workflow completion for ${workflowPayload.workflowId}:`, error);
    }
  }

  private async handleWorkflowError(payload: HookPayload): Promise<void> {
    const workflowPayload = payload as WorkflowHookPayload;
    
    try {
      const workflowResult = await this.stateAPI.loadWorkflowState(workflowPayload.workflowId);
      if (workflowResult.success && workflowResult.data) {
        const workflowState = workflowResult.data;
        workflowState.workflow.status = 'failed';
        workflowState.workflow.endTime = workflowPayload.timestamp;
        workflowState.workflow.error = workflowPayload.error || 'Unknown error';
        workflowState.performance.errorCount++;
        
        // Create error checkpoint for recovery
        await this.stateAPI.saveWorkflowState(workflowState, true, ['workflow_error', 'error_recovery']);
        
        // Create manual checkpoint for error analysis
        await this.stateAPI.createCheckpoint(
          workflowPayload.workflowId,
          `Workflow failed: ${workflowPayload.error}`,
          ['error', 'recovery', 'analysis']
        );
        
        this.activeWorkflows.delete(workflowPayload.workflowId);
        this.stepCounters.delete(workflowPayload.workflowId);
      }
    } catch (error) {
      console.error(`Failed to handle workflow error for ${workflowPayload.workflowId}:`, error);
    }
  }

  private async handleStepStart(payload: HookPayload): Promise<void> {
    const stepPayload = payload as StepHookPayload;
    
    try {
      await this.stateAPI.updateStepStatus(
        stepPayload.workflowId,
        stepPayload.stepId,
        'running'
      );

      // Update current step in workflow
      const workflowResult = await this.stateAPI.loadWorkflowState(stepPayload.workflowId);
      if (workflowResult.success && workflowResult.data) {
        const workflowState = workflowResult.data;
        workflowState.workflow.currentStep = stepPayload.stepId;
        await this.stateAPI.saveWorkflowState(workflowState);
      }
    } catch (error) {
      console.error(`Failed to handle step start for ${stepPayload.stepId}:`, error);
    }
  }

  private async handleStepComplete(payload: HookPayload): Promise<void> {
    const stepPayload = payload as StepHookPayload;
    
    try {
      await this.stateAPI.updateStepStatus(
        stepPayload.workflowId,
        stepPayload.stepId,
        'completed',
        stepPayload.output
      );

      // Add step output if provided
      if (stepPayload.output) {
        await this.stateAPI.addStepOutput(
          stepPayload.workflowId,
          stepPayload.stepId,
          stepPayload.output,
          stepPayload.agentId
        );
      }

      // Check if auto-checkpoint is needed
      if (this.config.enableAutoCheckpoints) {
        const stepCount = this.stepCounters.get(stepPayload.workflowId) || 0;
        this.stepCounters.set(stepPayload.workflowId, stepCount + 1);
        
        if ((stepCount + 1) % this.config.checkpointFrequency === 0) {
          const workflowResult = await this.stateAPI.loadWorkflowState(stepPayload.workflowId);
          if (workflowResult.success && workflowResult.data) {
            await this.stateAPI.createCheckpoint(
              stepPayload.workflowId,
              `Auto-checkpoint after ${stepCount + 1} steps`,
              ['auto', 'step_milestone']
            );
          }
        }
      }
    } catch (error) {
      console.error(`Failed to handle step completion for ${stepPayload.stepId}:`, error);
    }
  }

  private async handleStepError(payload: HookPayload): Promise<void> {
    const stepPayload = payload as StepHookPayload;
    
    try {
      await this.stateAPI.updateStepStatus(
        stepPayload.workflowId,
        stepPayload.stepId,
        'failed',
        stepPayload.output,
        stepPayload.error
      );

      // Create error checkpoint for step-level recovery
      if (this.config.enableCrashRecovery) {
        const workflowResult = await this.stateAPI.loadWorkflowState(stepPayload.workflowId);
        if (workflowResult.success && workflowResult.data) {
          await this.stateAPI.createCheckpoint(
            stepPayload.workflowId,
            `Step failed: ${stepPayload.stepId} - ${stepPayload.error}`,
            ['step_error', 'recovery', stepPayload.stepId]
          );
        }
      }
    } catch (error) {
      console.error(`Failed to handle step error for ${stepPayload.stepId}:`, error);
    }
  }

  private async handleAgentStart(payload: HookPayload): Promise<void> {
    const agentPayload = payload as AgentHookPayload;
    
    try {
      const agentState: AgentState = {
        id: agentPayload.agentId,
        name: agentPayload.agentName,
        status: 'active',
        currentTask: null,
        taskQueue: [],
        performance: {
          tasksCompleted: 0,
          averageExecutionTime: 0,
          errorRate: 0,
          lastActivity: agentPayload.timestamp
        },
        resources: {
          memoryUsage: 0,
          cpuUsage: 0,
          ioOperations: 0
        }
      };

      await this.stateAPI.updateAgentState(
        agentPayload.workflowId,
        agentPayload.agentId,
        agentState
      );
    } catch (error) {
      console.error(`Failed to handle agent start for ${agentPayload.agentId}:`, error);
    }
  }

  private async handleAgentComplete(payload: HookPayload): Promise<void> {
    const agentPayload = payload as AgentHookPayload;
    
    try {
      const workflowResult = await this.stateAPI.loadWorkflowState(agentPayload.workflowId);
      if (workflowResult.success && workflowResult.data) {
        const workflowState = workflowResult.data;
        const agentState = workflowState.agents[agentPayload.agentId];
        
        if (agentState) {
          agentState.status = 'idle';
          agentState.performance.tasksCompleted++;
          agentState.performance.lastActivity = agentPayload.timestamp;
          
          if (agentPayload.performance) {
            agentState.performance.averageExecutionTime = 
              (agentState.performance.averageExecutionTime + agentPayload.performance.executionTime) / 2;
            agentState.resources.memoryUsage = agentPayload.performance.memoryUsage;
          }

          await this.stateAPI.updateAgentState(
            agentPayload.workflowId,
            agentPayload.agentId,
            agentState
          );
        }
      }
    } catch (error) {
      console.error(`Failed to handle agent completion for ${agentPayload.agentId}:`, error);
    }
  }

  private async handleAgentError(payload: HookPayload): Promise<void> {
    const agentPayload = payload as AgentHookPayload;
    
    try {
      const workflowResult = await this.stateAPI.loadWorkflowState(agentPayload.workflowId);
      if (workflowResult.success && workflowResult.data) {
        const workflowState = workflowResult.data;
        const agentState = workflowState.agents[agentPayload.agentId];
        
        if (agentState) {
          agentState.status = 'error';
          agentState.performance.errorRate += 0.1;
          agentState.performance.lastActivity = agentPayload.timestamp;

          await this.stateAPI.updateAgentState(
            agentPayload.workflowId,
            agentPayload.agentId,
            agentState
          );
        }
      }
    } catch (error) {
      console.error(`Failed to handle agent error for ${agentPayload.agentId}:`, error);
    }
  }

  private async handleCheckpointRequest(payload: HookPayload): Promise<void> {
    const checkpointPayload = payload as CheckpointHookPayload;
    
    try {
      const result = await this.stateAPI.createCheckpoint(
        checkpointPayload.workflowId,
        checkpointPayload.description,
        checkpointPayload.tags
      );

      if (result.success) {
        // Emit checkpoint created event
        await this.emitHookEvent('checkpoint_request', {
          ...checkpointPayload,
          data: { checkpointId: result.checkpointId, success: true }
        });
      }
    } catch (error) {
      console.error(`Failed to handle checkpoint request for ${checkpointPayload.workflowId}:`, error);
    }
  }

  private async handleSessionStart(payload: HookPayload): Promise<void> {
    try {
      // Session is managed by the state API, just track it
      console.log(`Session started: ${payload.sessionId}`);
    } catch (error) {
      console.error(`Failed to handle session start for ${payload.sessionId}:`, error);
    }
  }

  private async handleSessionEnd(payload: HookPayload): Promise<void> {
    try {
      // Clean up any active workflows for this session
      for (const [workflowId, workflowState] of this.activeWorkflows.entries()) {
        if (workflowState.context.sessionId === payload.sessionId) {
          // Create final checkpoint before session ends
          await this.stateAPI.createCheckpoint(
            workflowId,
            'Session end checkpoint',
            ['session_end', payload.sessionId]
          );
        }
      }
    } catch (error) {
      console.error(`Failed to handle session end for ${payload.sessionId}:`, error);
    }
  }

  /**
   * Write hook event to file system for external monitoring
   */
  private async writeHookEvent(event: HookEvent, payload: HookPayload): Promise<void> {
    try {
      const hookFile = path.join(this.config.hookDirectory, `${event}.json`);
      const eventData = {
        event,
        payload,
        timestamp: Date.now()
      };

      await fs.writeFile(hookFile, JSON.stringify(eventData, null, 2));
    } catch (error) {
      console.error(`Failed to write hook event ${event}:`, error);
    }
  }

  /**
   * Create hook files for external monitoring
   */
  private async createHookFiles(): Promise<void> {
    try {
      await fs.mkdir(this.config.hookDirectory, { recursive: true });
      
      const hookEvents: HookEvent[] = [
        'workflow_start', 'workflow_complete', 'workflow_error',
        'step_start', 'step_complete', 'step_error',
        'agent_start', 'agent_complete', 'agent_error',
        'checkpoint_request', 'session_start', 'session_end'
      ];

      for (const event of hookEvents) {
        const hookFile = path.join(this.config.hookDirectory, `${event}.json`);
        try {
          await fs.access(hookFile);
        } catch {
          // File doesn't exist, create empty hook file
          await fs.writeFile(hookFile, JSON.stringify({ event, lastTriggered: null }, null, 2));
        }
      }
    } catch (error) {
      console.error('Failed to create hook files:', error);
    }
  }

  /**
   * Monitor hook directory for external changes
   */
  private startHookMonitoring(): void {
    // Implementation would monitor the hook directory for external events
    // For now, this is a placeholder for file system watching
  }

  /**
   * Get hook integration statistics
   */
  getStatistics(): {
    activeWorkflows: number;
    totalHookEvents: number;
    averageResponseTime: number;
    errorRate: number;
  } {
    return {
      activeWorkflows: this.activeWorkflows.size,
      totalHookEvents: 0, // Would track total events processed
      averageResponseTime: 0, // Would track average processing time
      errorRate: 0 // Would track error percentage
    };
  }

  /**
   * Cleanup and shutdown hook integration
   */
  async shutdown(): Promise<void> {
    // Clean up active workflows
    for (const [workflowId, workflowState] of this.activeWorkflows.entries()) {
      try {
        await this.stateAPI.createCheckpoint(
          workflowId,
          'Shutdown checkpoint',
          ['shutdown', 'cleanup']
        );
      } catch (error) {
        console.error(`Failed to create shutdown checkpoint for ${workflowId}:`, error);
      }
    }

    this.activeWorkflows.clear();
    this.stepCounters.clear();
    this.hookListeners.clear();
  }
}

/**
 * Create and configure hook integration
 */
export function createStateHookIntegrator(
  stateAPI: WorkflowStateAPI,
  config?: Partial<StateHookConfig>
): StateHookIntegrator {
  const defaultConfig: StateHookConfig = {
    enableAutoCheckpoints: true,
    checkpointFrequency: 5, // Every 5 steps
    enablePerformanceTracking: true,
    enableCrashRecovery: true,
    hookDirectory: '.claude/hooks',
    stateDirectory: '.claude/state'
  };

  const finalConfig = { ...defaultConfig, ...config };
  return new StateHookIntegrator(stateAPI, finalConfig);
}