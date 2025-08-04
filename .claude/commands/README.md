# Claude Commands Directory

This directory contains all available commands for the VibeSpec workflow automation system.

## 🚀 Command Categories

### Workflow Shortcuts (Most Used)
Fast commands for common workflows:
- **`/wr`** (wr.md) - Workflow Review: Parallel code review in 30-45s
- **`/wv`** (wv.md) - Workflow Validate: Pre-commit validation with early termination
- **`/wi`** (wi.md) - Workflow Implement: Guided feature implementation
- **`/wh`** (wh.md) - Workflow Help: Show available commands
- **`/wl`** (wl.md) - Workflow List: Detailed workflow descriptions

### Health Monitoring
Project health assessment:
- **`/vibespec:health`** (vibespec-health.md) - Comprehensive health dashboard
- `/vibespec:velocity` (coming soon) - Development pace analysis
- `/vibespec:sync-specs` (coming soon) - Specification alignment

### Core VibeSpec Commands
Essential VibeSpec operations:
- **`/adapt`** (adapt.md) - Adapt documentation to your project
- **`/breakdown`** (breakdown.md) - Break specs into implementation phases
- **`/context-prime`** (context-prime.md) - Load project context
- **`/transpose`** (transpose.md) - Convert artifacts to VibeSpec PRDs

### Utility Commands
Project maintenance and organization:
- **`/archive`** (archive.md) - Archive markdown files to clean project structure

### Session Management
Development session commands in `/session/`:
- **`/session:start`** - Begin development session
- **`/session:update`** - Update session progress
- **`/session:end`** - End session with handoff
- **`/session:current`** - View current session
- **`/session:list`** - List all sessions
- **`/session:help`** - Session command help

## 📊 Command Performance

| Command | Execution Time | Agents Used |
|---------|---------------|-------------|
| `/wr` | 30-45 seconds | 4 parallel agents |
| `/wv` | 10-30 seconds | 2-4 agents (conditional) |
| `/wi` | 30-60 minutes | Multiple phases |
| `/vibespec:health` | <10 seconds | 4 parallel agents |
| `/wh` | <5 seconds | None (static) |

## 🎯 Quick Usage Examples

```bash
# Daily workflow
/vibespec:health    # Check project health
/wr                 # Review recent changes
/wv                 # Validate before commit

# Feature development
/wi user-profile    # Implement new feature
/wr                 # Review implementation
/wv && git commit   # Validate and commit

# Get help
/wh                 # Show all commands
/wl                 # List workflows with details
```

## 🔧 Command Structure

Each command file contains:
1. **Command name and aliases**
2. **Description of functionality**
3. **Usage examples**
4. **Execution pattern**
5. **Expected output**
6. **Integration details**

## 📈 Benefits

- **70-80% time savings** through parallel execution
- **Early termination** prevents wasted time
- **Guided workflows** reduce errors
- **Consistent quality** through automation

## 🆕 Creating New Commands

To add a new command:
1. Create a `.md` file with the command name
2. Follow the existing command template
3. Define clear execution patterns
4. Include usage examples
5. Test thoroughly

## 📖 Full Documentation

For detailed information:
- [Workflow Automation Guide](/docs/vibespec-workflow-automation-guide.md)
- [Quick Reference Card](/docs/workflow-quick-reference.md)
- Individual command files for specific details