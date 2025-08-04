# Claude Agents Directory

This directory contains 25 specialized AI agents that work together to automate and enhance your VibeSpec development workflow.

## 🤖 Agent Categories

### Core VibeSpec Agents
Essential agents for maintaining VibeSpec standards:
- **compliance.md** - Enforces all 12 VibeSpec rules
- **spec-guardian.md** - Prevents specification drift
- **velocity.md** - Maintains shipping momentum
- **reviewer.md** - Code quality and security review

### Workflow Automation Agents
Specialized for workflow orchestration:
- **workflow-builder.md** - Designs multi-agent workflows
- **workflow-shortcut-implementer.md** - Creates command shortcuts
- **parallel-orchestration-optimizer.md** - Optimizes parallel execution
- **workflow-performance-auditor.md** - Workflow performance analysis
- **plan-orchestration-strategist.md** - Strategic planning for complex implementations

### Infrastructure Agents
System infrastructure specialists:
- **hook-system-engineer.md** - Event-driven architecture
- **event-flow-designer.md** - Event propagation systems
- **session-tracker.md** - Session state management
- **session-continuity-guardian.md** - Cross-session continuity

### Utility Agents
Project maintenance and organization:
- **archive-manager.md** - Archives documentation to maintain clean structure
- **workflow-state-architect.md** - State persistence design
- **docs-sync.md** - Documentation synchronization

### Monitoring & Visualization Agents
Health and performance monitoring:
- **vibespec-health-engineer.md** - Project health assessment
- **project-metrics-visualizer.md** - Terminal dashboards
- **performance-monitor.md** - Performance analysis

### Development Support Agents
General development assistance:
- **architect.md** - System design and agent creation
- **meta-agent.md** - Creates new specialized agents
- **ui-enhancer.md** - UI/UX improvements
- **plan-automator.md** - Planning automation

### Testing Agents
Quality assurance specialists:
- **integration-test-conductor.md** - Multi-agent test orchestration
- **test-hello.md** - Simple test agent

## 🚀 How Agents Work

1. **Invocation**: Agents are called by Claude using the Task tool
2. **Parallel Execution**: Multiple agents can run simultaneously
3. **Specialization**: Each agent is expert in their specific domain
4. **Communication**: Agents share state through workflow-state directory

## 📊 Most Used Agents

1. **compliance** - Used in /wr and /wv workflows
2. **reviewer** - Critical for code review workflows
3. **spec-guardian** - Ensures specification alignment
4. **velocity** - Prevents over-engineering
5. **session-tracker** - Manages development continuity

## 🎯 Agent Capabilities

### Tools Available
- **Read/Write**: File operations
- **Grep/Glob**: Code search
- **Task**: Invoke other agents
- **Bash**: System commands
- **TodoWrite**: Task management

### Performance
- Most agents complete tasks in 10-60 seconds
- Parallel execution reduces total time by 70-80%
- Specialized focus improves accuracy

## 🔧 Creating New Agents

To create a new agent:
1. Use the meta-agent: "Create an agent that..."
2. Follow the agent template structure
3. Include 500+ word system prompt
4. Add 3-4 usage examples
5. Test with test scenarios

## 📖 Agent Documentation

Each agent file contains:
- **name**: Agent identifier
- **description**: When to use the agent
- **color**: Visual indicator
- **tools**: Available capabilities
- **System prompt**: Detailed instructions

For more details, read individual agent files or use:
```bash
/agents  # List all available agents
```