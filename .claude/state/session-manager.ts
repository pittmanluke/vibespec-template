/**
 * Session Manager
 * Cross-session state transfer and continuity management
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';
import {
  SessionState,
  WorkflowState,
  SessionId,
  WorkflowId,
  CheckpointId,
  CrashRecoveryData,
  StateOperationResult,
  StatePersistenceConfig,
  StateMetadata
} from './types.js';
import { StateManager } from './state-manager.js';
import { CheckpointManager } from './checkpoint-manager.js';

interface SessionTransferData {
  sessionId: SessionId;
  workflowStates: Record<WorkflowId, WorkflowState>;
  checkpoints: CheckpointId[];
  environment: Record<string, any>;
  timestamp: number;
  version: string;
  integrity: {
    checksum: string;
    totalSize: number;
  };
}

interface SessionRecoveryPlan {
  strategy: 'full_recovery' | 'partial_recovery' | 'fresh_start';
  recoverableWorkflows: WorkflowId[];
  corruptedWorkflows: WorkflowId[];
  suggestedCheckpoints: Record<WorkflowId, CheckpointId>;
  estimatedDataLoss: number; // percentage
  recoverySteps: string[];
  warnings: string[];
}

interface SessionMigrationResult {
  success: boolean;
  migratedWorkflows: WorkflowId[];
  failedWorkflows: WorkflowId[];
  warnings: string[];
  totalDuration: number;
}

export class SessionManager {
  private stateManager: StateManager;
  private checkpointManager: CheckpointManager;
  private config: StatePersistenceConfig;
  private activeSessions: Map<SessionId, SessionState>;
  private sessionLocks: Set<SessionId>;

  constructor(
    stateManager: StateManager, 
    checkpointManager: CheckpointManager,
    config: StatePersistenceConfig
  ) {
    this.stateManager = stateManager;
    this.checkpointManager = checkpointManager;
    this.config = config;
    this.activeSessions = new Map();
    this.sessionLocks = new Set();

    this.initializeSessionManager();
  }

  private async initializeSessionManager(): Promise<void> {
    // Load active sessions from storage
    await this.loadActiveSessions();
    
    // Check for crashed sessions and initiate recovery
    await this.detectAndRecoverCrashedSessions();
    
    // Set up periodic session state saving
    setInterval(() => {
      this.performPeriodicSessionSave();
    }, this.config.reliability.syncFrequency);
  }

  /**
   * Start a new session with initialization
   */
  async startSession(
    userId: string | null = null,
    environment: Record<string, any> = {},
    preferences: Record<string, any> = {}
  ): Promise<SessionState> {
    const sessionId = this.generateSessionId();
    
    const sessionState: SessionState = {
      metadata: {
        id: sessionId,
        version: '1.0.0',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        checksum: '',
        size: 0,
        compressed: false
      },
      sessionId,
      userId,
      startTime: Date.now(),
      endTime: null,
      status: 'active',
      activeWorkflows: [],
      completedWorkflows: [],
      environment,
      preferences,
      lastCheckpointId: null,
      crashRecoveryData: null
    };

    // Calculate initial checksum
    sessionState.metadata.checksum = await this.calculateSessionChecksum(sessionState);

    // Save session state
    const saveResult = await this.stateManager.saveSessionState(sessionState);
    if (!saveResult.success) {
      throw new Error(`Failed to start session: ${saveResult.error}`);
    }

    // Track active session
    this.activeSessions.set(sessionId, sessionState);

    return sessionState;
  }

  /**
   * Resume session from storage with validation
   */
  async resumeSession(sessionId: SessionId): Promise<SessionState> {
    // Check if session is already active
    if (this.activeSessions.has(sessionId)) {
      return this.activeSessions.get(sessionId)!;
    }

    // Load session from storage
    const loadResult = await this.stateManager.loadSessionState(sessionId);
    if (!loadResult.success || !loadResult.data) {
      throw new Error(`Failed to resume session: ${loadResult.error}`);
    }

    const sessionState = loadResult.data;

    // Validate session integrity
    const isValid = await this.validateSessionIntegrity(sessionState);
    if (!isValid) {
      throw new Error(`Session integrity validation failed: ${sessionId}`);
    }

    // Check for crash recovery data
    if (sessionState.crashRecoveryData) {
      console.warn(`Session ${sessionId} has crash recovery data. Consider running recovery.`);
    }

    // Update session as resumed
    sessionState.status = 'active';
    sessionState.metadata.updatedAt = Date.now();

    // Track active session
    this.activeSessions.set(sessionId, sessionState);

    // Save updated state
    await this.stateManager.saveSessionState(sessionState);

    return sessionState;
  }

  /**
   * End session with cleanup
   */
  async endSession(sessionId: SessionId, createFinalCheckpoint: boolean = true): Promise<void> {
    const sessionState = this.activeSessions.get(sessionId);
    if (!sessionState) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    // Acquire session lock
    if (this.sessionLocks.has(sessionId)) {
      throw new Error(`Session is locked for another operation: ${sessionId}`);
    }
    this.sessionLocks.add(sessionId);

    try {
      // Create final checkpoints for active workflows if requested
      if (createFinalCheckpoint) {
        for (const workflowId of sessionState.activeWorkflows) {
          try {
            const workflowResult = await this.stateManager.loadWorkflowState(workflowId);
            if (workflowResult.success && workflowResult.data) {
              await this.checkpointManager.createCheckpoint(
                workflowResult.data,
                'manual',
                'Session end checkpoint',
                ['session_end', sessionId]
              );
            }
          } catch (error) {
            console.warn(`Failed to create final checkpoint for workflow ${workflowId}:`, error);
          }
        }
      }

      // Update session state
      sessionState.status = 'completed';
      sessionState.endTime = Date.now();
      sessionState.metadata.updatedAt = Date.now();
      sessionState.metadata.checksum = await this.calculateSessionChecksum(sessionState);

      // Save final session state
      await this.stateManager.saveSessionState(sessionState);

      // Remove from active sessions
      this.activeSessions.delete(sessionId);

    } finally {
      this.sessionLocks.delete(sessionId);
    }
  }

  /**
   * Transfer session state to another environment
   */
  async exportSessionForTransfer(sessionId: SessionId): Promise<Buffer> {
    const sessionState = this.activeSessions.get(sessionId) || 
      (await this.stateManager.loadSessionState(sessionId)).data;
    
    if (!sessionState) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    // Collect all workflow states
    const workflowStates: Record<WorkflowId, WorkflowState> = {};
    const checkpoints: CheckpointId[] = [];

    for (const workflowId of [...sessionState.activeWorkflows, ...sessionState.completedWorkflows]) {
      try {
        const workflowResult = await this.stateManager.loadWorkflowState(workflowId);
        if (workflowResult.success && workflowResult.data) {
          workflowStates[workflowId] = workflowResult.data;

          // Get recent checkpoints for this workflow
          const checkpointList = await this.checkpointManager.listCheckpoints({
            workflowId,
            limit: 5,
            sortBy: 'created',
            sortOrder: 'desc'
          });

          checkpoints.push(...checkpointList.items.map(cp => cp.checkpointId));
        }
      } catch (error) {
        console.warn(`Failed to export workflow ${workflowId}:`, error);
      }
    }

    // Create transfer package
    const transferData: SessionTransferData = {
      sessionId,
      workflowStates,
      checkpoints,
      environment: sessionState.environment,
      timestamp: Date.now(),
      version: '1.0.0',
      integrity: {
        checksum: '',
        totalSize: 0
      }
    };

    // Calculate integrity data
    const serialized = JSON.stringify(transferData);
    transferData.integrity.checksum = crypto.createHash('sha256').update(serialized).digest('hex');
    transferData.integrity.totalSize = Buffer.byteLength(serialized);

    // Compress and return
    const compressed = await this.compressTransferData(transferData);
    return compressed;
  }

  /**
   * Import session from transfer data
   */
  async importSessionFromTransfer(
    transferData: Buffer,
    newSessionId?: SessionId
  ): Promise<SessionMigrationResult> {
    const startTime = Date.now();
    const result: SessionMigrationResult = {
      success: false,
      migratedWorkflows: [],
      failedWorkflows: [],
      warnings: [],
      totalDuration: 0
    };

    try {
      // Decompress and parse transfer data
      const decompressed = await this.decompressTransferData(transferData);
      const data: SessionTransferData = JSON.parse(decompressed.toString());

      // Validate transfer data integrity
      const expectedChecksum = data.integrity.checksum;
      const actualChecksum = crypto.createHash('sha256')
        .update(JSON.stringify({ ...data, integrity: { checksum: '', totalSize: 0 } }))
        .digest('hex');

      if (expectedChecksum !== actualChecksum) {
        throw new Error('Transfer data integrity check failed');
      }

      // Create new session or use existing
      const sessionId = newSessionId || this.generateSessionId();
      let sessionState: SessionState;

      try {
        sessionState = await this.resumeSession(sessionId);
        result.warnings.push('Session already exists, merging data');
      } catch {
        sessionState = await this.startSession(null, data.environment);
      }

      // Import workflow states
      for (const [workflowId, workflowState] of Object.entries(data.workflowStates)) {
        try {
          // Update workflow state session reference
          workflowState.context.sessionId = sessionId;
          workflowState.metadata.updatedAt = Date.now();

          // Save workflow state
          const saveResult = await this.stateManager.saveWorkflowState(workflowState);
          if (saveResult.success) {
            result.migratedWorkflows.push(workflowId);
            
            // Update session workflow tracking
            if (!sessionState.activeWorkflows.includes(workflowId) && 
                !sessionState.completedWorkflows.includes(workflowId)) {
              if (workflowState.workflow.status === 'completed') {
                sessionState.completedWorkflows.push(workflowId);
              } else {
                sessionState.activeWorkflows.push(workflowId);
              }
            }
          } else {
            result.failedWorkflows.push(workflowId);
            result.warnings.push(`Failed to import workflow ${workflowId}: ${saveResult.error}`);
          }
        } catch (error) {
          result.failedWorkflows.push(workflowId);
          result.warnings.push(`Error importing workflow ${workflowId}: ${(error as Error).message}`);
        }
      }

      // Import checkpoints
      for (const checkpointId of data.checkpoints) {
        try {
          // Note: In a real implementation, checkpoint data would be included in transfer
          result.warnings.push(`Checkpoint ${checkpointId} reference imported (data not included)`);
        } catch (error) {
          result.warnings.push(`Failed to import checkpoint ${checkpointId}: ${(error as Error).message}`);
        }
      }

      // Update and save session state
      sessionState.metadata.updatedAt = Date.now();
      await this.stateManager.saveSessionState(sessionState);

      result.success = result.migratedWorkflows.length > 0;
      result.totalDuration = Date.now() - startTime;

      return result;

    } catch (error) {
      result.warnings.push(`Import failed: ${(error as Error).message}`);
      result.totalDuration = Date.now() - startTime;
      return result;
    }
  }

  /**
   * Detect and recover from crashed sessions
   */
  async detectAndRecoverCrashedSessions(): Promise<SessionRecoveryPlan[]> {
    const recoveryPlans: SessionRecoveryPlan[] = [];

    try {
      // Find all session files
      const sessionsDir = path.join(this.config.baseDirectory, 'sessions');
      const sessionFiles = await fs.readdir(sessionsDir);

      for (const sessionFile of sessionFiles) {
        if (!sessionFile.endsWith('.session')) continue;

        const sessionId = sessionFile.replace('.session', '');
        
        try {
          const loadResult = await this.stateManager.loadSessionState(sessionId);
          if (!loadResult.success || !loadResult.data) continue;

          const sessionState = loadResult.data;

          // Check if session ended gracefully
          if (sessionState.status === 'active' && !this.activeSessions.has(sessionId)) {
            // Potential crashed session
            const recoveryPlan = await this.createRecoveryPlan(sessionState);
            recoveryPlans.push(recoveryPlan);

            // Auto-recover if strategy is clear
            if (recoveryPlan.strategy === 'full_recovery' && recoveryPlan.estimatedDataLoss < 10) {
              await this.executeRecoveryPlan(recoveryPlan);
            }
          }
        } catch (error) {
          console.warn(`Failed to check session ${sessionId} for crash recovery:`, error);
        }
      }
    } catch (error) {
      console.error('Failed to detect crashed sessions:', error);
    }

    return recoveryPlans;
  }

  /**
   * Create recovery plan for crashed session
   */
  private async createRecoveryPlan(sessionState: SessionState): Promise<SessionRecoveryPlan> {
    const plan: SessionRecoveryPlan = {
      strategy: 'fresh_start',
      recoverableWorkflows: [],
      corruptedWorkflows: [],
      suggestedCheckpoints: {},
      estimatedDataLoss: 100,
      recoverySteps: [],
      warnings: []
    };

    let totalWorkflows = sessionState.activeWorkflows.length + sessionState.completedWorkflows.length;
    let recoverableCount = 0;

    // Check each workflow
    for (const workflowId of [...sessionState.activeWorkflows, ...sessionState.completedWorkflows]) {
      try {
        // Try to load workflow state
        const workflowResult = await this.stateManager.loadWorkflowState(workflowId);
        
        if (workflowResult.success && workflowResult.data) {
          plan.recoverableWorkflows.push(workflowId);
          recoverableCount++;
          
          // Find best checkpoint for recovery
          const suggestions = await this.checkpointManager.getRecoverySuggestions(workflowId);
          if (suggestions.recommendedRecoveryPoint) {
            plan.suggestedCheckpoints[workflowId] = suggestions.recommendedRecoveryPoint;
          }
        } else {
          plan.corruptedWorkflows.push(workflowId);
          plan.warnings.push(`Workflow ${workflowId} state is corrupted or missing`);
        }
      } catch {
        plan.corruptedWorkflows.push(workflowId);
      }
    }

    // Determine recovery strategy
    if (recoverableCount === totalWorkflows) {
      plan.strategy = 'full_recovery';
      plan.estimatedDataLoss = 0;
    } else if (recoverableCount > totalWorkflows * 0.5) {
      plan.strategy = 'partial_recovery';
      plan.estimatedDataLoss = ((totalWorkflows - recoverableCount) / totalWorkflows) * 100;
    } else {
      plan.strategy = 'fresh_start';
      plan.estimatedDataLoss = 100;
    }

    // Generate recovery steps
    plan.recoverySteps = this.generateRecoverySteps(plan);

    return plan;
  }

  /**
   * Execute recovery plan
   */
  private async executeRecoveryPlan(plan: SessionRecoveryPlan): Promise<void> {
    console.log(`Executing recovery plan: ${plan.strategy}`);

    if (plan.strategy === 'fresh_start') {
      // Just mark session as recovered
      return;
    }

    // Restore recoverable workflows from checkpoints
    for (const workflowId of plan.recoverableWorkflows) {
      const checkpointId = plan.suggestedCheckpoints[workflowId];
      if (checkpointId) {
        try {
          await this.checkpointManager.restoreFromCheckpoint(checkpointId);
          console.log(`Restored workflow ${workflowId} from checkpoint ${checkpointId}`);
        } catch (error) {
          console.error(`Failed to restore workflow ${workflowId}:`, error);
        }
      }
    }
  }

  private generateRecoverySteps(plan: SessionRecoveryPlan): string[] {
    const steps: string[] = [];

    if (plan.strategy === 'full_recovery') {
      steps.push('1. Validate all workflow states');
      steps.push('2. Resume session normally');
      steps.push('3. Continue workflow execution');
    } else if (plan.strategy === 'partial_recovery') {
      steps.push('1. Restore recoverable workflows from checkpoints');
      steps.push('2. Mark corrupted workflows as failed');
      steps.push('3. Resume session with remaining workflows');
      steps.push('4. Review and restart failed workflows if needed');
    } else {
      steps.push('1. Archive current session state');
      steps.push('2. Start fresh session');
      steps.push('3. Manually review and restart workflows');
    }

    return steps;
  }

  private async loadActiveSessions(): Promise<void> {
    try {
      const sessionsDir = path.join(this.config.baseDirectory, 'sessions');
      const sessionFiles = await fs.readdir(sessionsDir);

      for (const sessionFile of sessionFiles) {
        if (!sessionFile.endsWith('.session')) continue;

        const sessionId = sessionFile.replace('.session', '');
        
        try {
          const loadResult = await this.stateManager.loadSessionState(sessionId);
          if (loadResult.success && loadResult.data && loadResult.data.status === 'active') {
            this.activeSessions.set(sessionId, loadResult.data);
          }
        } catch {
          // Ignore errors loading individual sessions
        }
      }
    } catch {
      // Sessions directory doesn't exist yet
    }
  }

  private async performPeriodicSessionSave(): Promise<void> {
    for (const sessionState of this.activeSessions.values()) {
      try {
        sessionState.metadata.updatedAt = Date.now();
        await this.stateManager.saveSessionState(sessionState);
      } catch (error) {
        console.error(`Failed to save session ${sessionState.sessionId}:`, error);
      }
    }
  }

  private generateSessionId(): SessionId {
    return `session_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
  }

  private async calculateSessionChecksum(sessionState: SessionState): Promise<string> {
    const { metadata, ...stateWithoutMetadata } = sessionState;
    const json = JSON.stringify(stateWithoutMetadata, Object.keys(stateWithoutMetadata).sort());
    return crypto.createHash('sha256').update(json).digest('hex');
  }

  private async validateSessionIntegrity(sessionState: SessionState): Promise<boolean> {
    try {
      const expectedChecksum = sessionState.metadata.checksum;
      const actualChecksum = await this.calculateSessionChecksum(sessionState);
      return expectedChecksum === actualChecksum;
    } catch {
      return false;
    }
  }

  private async compressTransferData(data: SessionTransferData): Promise<Buffer> {
    // Implementation would compress the transfer data
    return Buffer.from(JSON.stringify(data));
  }

  private async decompressTransferData(data: Buffer): Promise<Buffer> {
    // Implementation would decompress the transfer data
    return data;
  }

  /**
   * Get session statistics
   */
  getSessionStatistics(sessionId: SessionId): {
    workflowCount: number;
    activeWorkflows: number;
    completedWorkflows: number;
    sessionDuration: number;
    lastActivity: number;
  } | null {
    const sessionState = this.activeSessions.get(sessionId);
    if (!sessionState) return null;

    return {
      workflowCount: sessionState.activeWorkflows.length + sessionState.completedWorkflows.length,
      activeWorkflows: sessionState.activeWorkflows.length,
      completedWorkflows: sessionState.completedWorkflows.length,
      sessionDuration: Date.now() - sessionState.startTime,
      lastActivity: sessionState.metadata.updatedAt
    };
  }

  /**
   * List all sessions with filtering
   */
  async listSessions(filter: {
    status?: SessionState['status'];
    userId?: string;
    timeRange?: { start: number; end: number };
  } = {}): Promise<SessionState[]> {
    const sessions: SessionState[] = [];

    // Add active sessions
    for (const session of this.activeSessions.values()) {
      if (this.matchesSessionFilter(session, filter)) {
        sessions.push(session);
      }
    }

    // Load sessions from storage
    try {
      const sessionsDir = path.join(this.config.baseDirectory, 'sessions');
      const sessionFiles = await fs.readdir(sessionsDir);

      for (const sessionFile of sessionFiles) {
        if (!sessionFile.endsWith('.session')) continue;

        const sessionId = sessionFile.replace('.session', '');
        
        if (this.activeSessions.has(sessionId)) continue; // Already included

        try {
          const loadResult = await this.stateManager.loadSessionState(sessionId);
          if (loadResult.success && loadResult.data && this.matchesSessionFilter(loadResult.data, filter)) {
            sessions.push(loadResult.data);
          }
        } catch {
          // Ignore errors loading individual sessions
        }
      }
    } catch {
      // Sessions directory doesn't exist
    }

    return sessions.sort((a, b) => b.startTime - a.startTime);
  }

  private matchesSessionFilter(
    session: SessionState, 
    filter: { status?: SessionState['status']; userId?: string; timeRange?: { start: number; end: number } }
  ): boolean {
    if (filter.status && session.status !== filter.status) {
      return false;
    }

    if (filter.userId && session.userId !== filter.userId) {
      return false;
    }

    if (filter.timeRange) {
      if (session.startTime < filter.timeRange.start || session.startTime > filter.timeRange.end) {
        return false;
      }
    }

    return true;
  }
}