# .claude Directory Structure

This directory contains all Claude-specific configurations, agents, commands, and infrastructure for the VibeSpec workflow automation system.

## 📊 System Statistics
- **Total Agents**: 25 specialized AI agents
- **Workflow Commands**: 7 shortcuts + core commands
- **Hook Scripts**: 6 automation hooks
- **Health Tools**: Dashboard, CLI, tests

## 📁 Directory Overview

### 🤖 `/agents/` - Specialized AI Agents (25 agents)
Purpose-built AI assistants for specific tasks:
- **Core VibeSpec**: compliance, reviewer, spec-guardian, velocity
- **Workflow**: workflow-builder, parallel-orchestration-optimizer
- **Infrastructure**: hook-system-engineer, session-tracker
- **Monitoring**: vibespec-health-engineer, performance-monitor
- **Testing**: integration-test-conductor
- **Utility**: archive-manager

### 🚀 `/commands/` - Workflow Commands
Quick shortcuts and commands:
- **Workflow Shortcuts**: `/wr`, `/wv`, `/wi`, `/wh`, `/wl`
- **Health Commands**: `/vibespec:health`
- **Core Commands**: adapt, breakdown, context-prime, transpose
- **Session Commands**: start, update, end
- **Utility Commands**: `/archive`

### 🔧 `/hooks/` - Event-Driven Infrastructure
Automated workflow triggers:
- `pre-commit.sh` - Git pre-commit validation
- `file-watcher.py` - Real-time file monitoring
- `event-processor.py` - Event routing system
- `hook-manager.sh` - Hook management utility

### 📊 `/health/` - Health Monitoring System
Project health dashboards and visualization:
- Dashboard renderers and visualizations
- CLI tools for health checks
- Integration test suites
- Performance benchmarking tools

### 💾 `/state/` - State Management
Workflow state persistence:
- State serialization (TypeScript)
- Checkpoint management
- Session continuity
- Cross-session state transfer

### ⚙️ `/config/` - Configuration Files
System configuration:
- `performance.json` - Performance settings
- `hooks.json` - Hook configuration
- `settings.local.json` - Local settings

### 📂 `/workflow-state/` - Runtime State
Active workflow data (changes frequently):
- Agent outputs
- Session state
- Execution logs

### 📜 `/logs/` - System Logs
Operational logs:
- Performance metrics
- Hook debug logs
- Agent execution logs

### 🛠️ `/scripts/` - Utility Scripts
Helper scripts:
- `system-status.sh` - Check system status
- `workflow-monitor.sh` - Monitor workflows

### 💾 `/cache/` - Temporary Cache
Performance optimization cache (can be cleared)

### 🗜️ `/sessions/` - Session History
Development session records and handoffs

## 🚀 Quick Access

### Most Used Files
- **Commands**: `/commands/wr.md`, `/commands/wv.md`
- **Agents**: `/agents/compliance.md`, `/agents/reviewer.md`
- **Health**: `/health/dashboard-cli.js`
- **Hooks**: `/hooks/hook-manager.sh`

## 🚀 Quick Start

1. **Check System Status**:
   ```bash
   ./.claude/scripts/system-status.sh
   ```

2. **View Available Commands**:
   ```bash
   /wh  # Workflow help
   ```

3. **Run Health Check**:
   ```bash
   /vibespec:health
   ```

4. **Manage Hooks**:
   ```bash
   ./.claude/hooks/hook-manager.sh status
   ```

## 📊 Key Files

- **Most Used Commands**: `/commands/wr.md`, `/commands/wv.md`
- **Core Agents**: `/agents/compliance.md`, `/agents/reviewer.md`
- **Hook Manager**: `/hooks/hook-manager.sh`
- **Health Dashboard**: `/health/dashboard-cli.js`

## 🔧 Maintenance

### Common Commands
```bash
# Check system status
./.claude/scripts/system-status.sh

# Run cleanup
./.claude/scripts/cleanup.sh

# Clear cache
rm -rf .claude/cache/*

# View logs
tail -f .claude/logs/*.log

# Check agents
ls -la .claude/agents/

# View help
/wh
```

## 📖 Documentation

For detailed documentation, see:
- [Workflow Automation Guide](/docs/vibespec-workflow-automation-guide.md)
- [Quick Reference](/docs/workflow-quick-reference.md)
- [System Architecture](/docs/workflow-system-architecture.md)