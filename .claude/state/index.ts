/**
 * Workflow State Management System
 * High-performance, atomic state persistence with sub-500ms operations
 */

// Core exports
export * from './types.js';
export * from './state-manager.js';
export * from './checkpoint-manager.js';
export * from './session-manager.js';
export * from './workflow-state-api.js';
export * from './hook-integration.js';

// Main API exports
export { WorkflowStateAPI, workflowStateAPI, createWorkflowStateAPI } from './workflow-state-api.js';
export { StateHookIntegrator, createStateHookIntegrator } from './hook-integration.js';

// Type exports for external use
export type {
  WorkflowState,
  SessionState,
  StateCheckpoint,
  CheckpointId,
  WorkflowId,
  SessionId,
  StateOperationResult,
  CheckpointResult,
  RestoreResult,
  StatePersistenceConfig
} from './types.js';

/**
 * Quick start configuration for common use cases
 */
export const QuickStartConfigs = {
  /**
   * Development configuration - fast operations, minimal storage
   */
  development: {
    compression: {
      enabled: false,
      algorithm: 'gzip' as const,
      level: 1,
      threshold: 10240,
      chunkSize: 32 * 1024
    },
    performance: {
      maxMemoryUsage: 128,
      maxFileSize: 50,
      batchSize: 25,
      parallelOperations: 2
    },
    reliability: {
      enableWAL: false,
      syncFrequency: 60000,
      backupRetention: 3,
      checksumValidation: false
    },
    monitoring: {
      enableMetrics: true,
      metricsInterval: 30000,
      alertThresholds: {
        saveTime: 2000,
        loadTime: 1000,
        errorRate: 0.1,
        memoryUsage: 100
      }
    }
  },

  /**
   * Production configuration - optimized for reliability and performance
   */
  production: {
    compression: {
      enabled: true,
      algorithm: 'gzip' as const,
      level: 6,
      threshold: 1024,
      chunkSize: 64 * 1024
    },
    performance: {
      maxMemoryUsage: 512,
      maxFileSize: 200,
      batchSize: 100,
      parallelOperations: 8
    },
    reliability: {
      enableWAL: true,
      syncFrequency: 10000,
      backupRetention: 20,
      checksumValidation: true
    },
    monitoring: {
      enableMetrics: true,
      metricsInterval: 15000,
      alertThresholds: {
        saveTime: 500,
        loadTime: 200,
        errorRate: 0.02,
        memoryUsage: 400
      }
    }
  },

  /**
   * High-throughput configuration - optimized for maximum performance
   */
  highThroughput: {
    compression: {
      enabled: true,
      algorithm: 'lz4' as const,
      level: 1,
      threshold: 512,
      chunkSize: 128 * 1024
    },
    performance: {
      maxMemoryUsage: 1024,
      maxFileSize: 500,
      batchSize: 200,
      parallelOperations: 16
    },
    reliability: {
      enableWAL: true,
      syncFrequency: 5000,
      backupRetention: 10,
      checksumValidation: false // Disabled for speed
    },
    monitoring: {
      enableMetrics: true,
      metricsInterval: 5000,
      alertThresholds: {
        saveTime: 100,
        loadTime: 50,
        errorRate: 0.01,
        memoryUsage: 800
      }
    }
  }
};

/**
 * Usage Examples and Helper Functions
 */

/**
 * Initialize state management system with quick start
 */
export async function initializeWorkflowState(
  environment: 'development' | 'production' | 'highThroughput' = 'development',
  baseDirectory: string = '.claude/state'
): Promise<{
  stateAPI: WorkflowStateAPI;
  hookIntegrator: StateHookIntegrator;
}> {
  const config = QuickStartConfigs[environment];
  
  const stateAPI = createWorkflowStateAPI(baseDirectory, config);
  await stateAPI.initialize(config);
  
  const hookIntegrator = createStateHookIntegrator(stateAPI, {
    enableAutoCheckpoints: true,
    checkpointFrequency: environment === 'development' ? 10 : 5,
    enablePerformanceTracking: true,
    enableCrashRecovery: environment !== 'development',
    hookDirectory: '.claude/hooks',
    stateDirectory: baseDirectory
  });

  return { stateAPI, hookIntegrator };
}

/**
 * Example: Complete workflow with state persistence
 */
export async function exampleWorkflowWithState(): Promise<void> {
  // Initialize system
  const { stateAPI, hookIntegrator } = await initializeWorkflowState('development');

  try {
    // Start session
    const session = await stateAPI.startSession('user123', { 
      environment: 'development',
      features: { autoCheckpoints: true }
    });

    // Create workflow
    const workflowId = 'example_workflow_' + Date.now();
    await stateAPI.createWorkflow(workflowId, 'Example Workflow', session.sessionId, [
      { id: 'step1', name: 'Initialize', agentId: 'agent1', dependencies: [], parallel: false, maxRetries: 3 },
      { id: 'step2', name: 'Process', agentId: 'agent2', dependencies: ['step1'], parallel: false, maxRetries: 3 },
      { id: 'step3', name: 'Finalize', agentId: 'agent1', dependencies: ['step2'], parallel: false, maxRetries: 3 }
    ]);

    // Emit workflow start event
    await hookIntegrator.emitHookEvent('workflow_start', {
      workflowId,
      sessionId: session.sessionId,
      timestamp: Date.now(),
      data: { workflowName: 'Example Workflow', status: 'started' }
    });

    // Simulate step execution
    for (const stepId of ['step1', 'step2', 'step3']) {
      // Step start
      await hookIntegrator.emitHookEvent('step_start', {
        workflowId,
        sessionId: session.sessionId,
        timestamp: Date.now(),
        data: { stepId, stepName: `Step ${stepId}`, agentId: stepId === 'step2' ? 'agent2' : 'agent1', status: 'started' }
      });

      // Simulate work
      await new Promise(resolve => setTimeout(resolve, 100));

      // Step complete
      await hookIntegrator.emitHookEvent('step_complete', {
        workflowId,
        sessionId: session.sessionId,
        timestamp: Date.now(),
        data: { 
          stepId, 
          stepName: `Step ${stepId}`, 
          agentId: stepId === 'step2' ? 'agent2' : 'agent1', 
          status: 'completed',
          output: { result: `${stepId} completed successfully` }
        }
      });
    }

    // Workflow complete
    await hookIntegrator.emitHookEvent('workflow_complete', {
      workflowId,
      sessionId: session.sessionId,
      timestamp: Date.now(),
      data: { workflowName: 'Example Workflow', status: 'completed' }
    });

    // Create final checkpoint
    const checkpointResult = await stateAPI.createCheckpoint(
      workflowId,
      'Example workflow completed successfully',
      ['example', 'completed', 'demo']
    );

    console.log('Workflow completed successfully!');
    console.log('Checkpoint created:', checkpointResult.checkpointId);

    // End session
    await stateAPI.endSession(session.sessionId, true);

  } catch (error) {
    console.error('Workflow failed:', error);
  } finally {
    await hookIntegrator.shutdown();
    await stateAPI.shutdown();
  }
}

/**
 * Example: Recovery from checkpoint
 */
export async function exampleRecoveryFromCheckpoint(checkpointId: CheckpointId): Promise<void> {
  const { stateAPI } = await initializeWorkflowState('development');

  try {
    console.log(`Attempting recovery from checkpoint: ${checkpointId}`);
    
    const restoreResult = await stateAPI.restoreFromCheckpoint(checkpointId);
    
    if (restoreResult.success && restoreResult.data) {
      console.log('Recovery successful!');
      console.log('Restored workflow:', restoreResult.data.workflow.name);
      console.log('Workflow status:', restoreResult.data.workflow.status);
      console.log('Progress:', restoreResult.data.workflow.progress + '%');
      
      if (restoreResult.warnings.length > 0) {
        console.log('Warnings:', restoreResult.warnings);
      }
    } else {
      console.error('Recovery failed:', restoreResult.error);
    }
  } catch (error) {
    console.error('Recovery error:', error);
  } finally {
    await stateAPI.shutdown();
  }
}

/**
 * Example: Session transfer
 */
export async function exampleSessionTransfer(sessionId: SessionId): Promise<void> {
  const { stateAPI } = await initializeWorkflowState('development');

  try {
    console.log(`Exporting session: ${sessionId}`);
    
    // Export session
    const transferData = await stateAPI.exportSession(sessionId);
    console.log(`Session exported, size: ${transferData.length} bytes`);
    
    // Simulate transfer (save to file or send over network)
    // In real usage, you would transfer this data to another environment
    
    // Import to new session
    const importResult = await stateAPI.importSession(transferData, sessionId + '_imported');
    
    if (importResult.success) {
      console.log('Session transfer successful!');
      console.log('Migrated workflows:', importResult.migratedWorkflows);
      console.log('Failed workflows:', importResult.failedWorkflows);
      console.log('Total duration:', importResult.totalDuration + 'ms');
    } else {
      console.error('Session transfer failed');
    }
  } catch (error) {
    console.error('Transfer error:', error);
  } finally {
    await stateAPI.shutdown();
  }
}

/**
 * Performance monitoring utilities
 */
export class StatePerformanceMonitor {
  private stateAPI: WorkflowStateAPI;
  private monitoringInterval: NodeJS.Timeout | null = null;

  constructor(stateAPI: WorkflowStateAPI) {
    this.stateAPI = stateAPI;
  }

  startMonitoring(intervalMs: number = 30000): void {
    this.monitoringInterval = setInterval(() => {
      this.logPerformanceMetrics();
    }, intervalMs);
  }

  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }

  private logPerformanceMetrics(): void {
    const metrics = this.stateAPI.getPerformanceMetrics();
    
    console.log('State Performance Metrics:');
    console.log(`  Operations/sec: ${metrics.operationsPerSecond}`);
    console.log(`  Avg Save Time: ${metrics.averageSaveTime}ms`);
    console.log(`  Avg Load Time: ${metrics.averageLoadTime}ms`);
    console.log(`  Error Rate: ${(metrics.errorRate * 100).toFixed(2)}%`);
    console.log(`  Memory Usage: ${(metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB`);
    
    // Alert on performance issues
    if (metrics.averageSaveTime > 500) {
      console.warn('WARNING: Save operations exceeding 500ms target!');
    }
    
    if (metrics.averageLoadTime > 200) {
      console.warn('WARNING: Load operations exceeding 200ms target!');
    }
    
    if (metrics.errorRate > 0.05) {
      console.warn('WARNING: Error rate exceeding 5% threshold!');
    }
  }
}

/**
 * Default export for convenient imports
 */
export default {
  WorkflowStateAPI,
  workflowStateAPI,
  createWorkflowStateAPI,
  StateHookIntegrator,
  createStateHookIntegrator,
  initializeWorkflowState,
  QuickStartConfigs,
  StatePerformanceMonitor,
  
  // Example functions
  exampleWorkflowWithState,
  exampleRecoveryFromCheckpoint,
  exampleSessionTransfer
};