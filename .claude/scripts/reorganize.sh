#!/bin/bash

# .claude Directory Reorganization Script
# This script safely reorganizes the .claude directory structure

set -e  # Exit on error

echo "═══════════════════════════════════════════════════════"
echo "     .claude Directory Reorganization"
echo "═══════════════════════════════════════════════════════"
echo ""

# Check if we're in the right directory
if [ ! -d ".claude" ]; then
    echo "❌ Error: .claude directory not found. Run from project root."
    exit 1
fi

# Create backup
echo "1. Creating backup..."
cp -r .claude .claude.backup.$(date +%Y%m%d_%H%M%S)
echo "   ✅ Backup created"

# Create new directory structure
echo ""
echo "2. Creating new directory structure..."

# Agents subdirectories
mkdir -p .claude/agents/core
mkdir -p .claude/agents/workflow
mkdir -p .claude/agents/infrastructure
mkdir -p .claude/agents/monitoring
mkdir -p .claude/agents/testing

# Commands subdirectories
mkdir -p .claude/commands/core
mkdir -p .claude/commands/workflow
mkdir -p .claude/commands/health

# System directories
mkdir -p .claude/system/hooks/scripts
mkdir -p .claude/system/hooks/events
mkdir -p .claude/system/hooks/config
mkdir -p .claude/system/hooks/docs
mkdir -p .claude/system/health/dashboards
mkdir -p .claude/system/health/cli
mkdir -p .claude/system/health/tests
mkdir -p .claude/system/health/docs
mkdir -p .claude/system/state
mkdir -p .claude/system/scripts

# Config directory
mkdir -p .claude/config

# Data directories (runtime data)
mkdir -p .claude/data/cache
mkdir -p .claude/data/logs
mkdir -p .claude/data/sessions
mkdir -p .claude/data/workflow-state
mkdir -p .claude/data/test-results

# Docs directory
mkdir -p .claude/docs

echo "   ✅ Directory structure created"

# Move files to new locations
echo ""
echo "3. Reorganizing files..."

# Move agents
echo "   Moving agents..."
# Core agents
[ -f .claude/agents/compliance.md ] && mv .claude/agents/compliance.md .claude/agents/core/
[ -f .claude/agents/spec-guardian.md ] && mv .claude/agents/spec-guardian.md .claude/agents/core/
[ -f .claude/agents/velocity.md ] && mv .claude/agents/velocity.md .claude/agents/core/
[ -f .claude/agents/reviewer.md ] && mv .claude/agents/reviewer.md .claude/agents/core/

# Workflow agents
[ -f .claude/agents/workflow-builder.md ] && mv .claude/agents/workflow-builder.md .claude/agents/workflow/
[ -f .claude/agents/workflow-shortcut-implementer.md ] && mv .claude/agents/workflow-shortcut-implementer.md .claude/agents/workflow/
[ -f .claude/agents/parallel-orchestration-optimizer.md ] && mv .claude/agents/parallel-orchestration-optimizer.md .claude/agents/workflow/
[ -f .claude/agents/workflow-performance-auditor.md ] && mv .claude/agents/workflow-performance-auditor.md .claude/agents/workflow/
[ -f .claude/agents/plan-orchestration-strategist.md ] && mv .claude/agents/plan-orchestration-strategist.md .claude/agents/workflow/

# Infrastructure agents
[ -f .claude/agents/session-tracker.md ] && mv .claude/agents/session-tracker.md .claude/agents/infrastructure/
[ -f .claude/agents/session-continuity-guardian.md ] && mv .claude/agents/session-continuity-guardian.md .claude/agents/infrastructure/
[ -f .claude/agents/hook-system-engineer.md ] && mv .claude/agents/hook-system-engineer.md .claude/agents/infrastructure/
[ -f .claude/agents/event-flow-designer.md ] && mv .claude/agents/event-flow-designer.md .claude/agents/infrastructure/
[ -f .claude/agents/workflow-state-architect.md ] && mv .claude/agents/workflow-state-architect.md .claude/agents/infrastructure/
[ -f .claude/agents/docs-sync.md ] && mv .claude/agents/docs-sync.md .claude/agents/infrastructure/

# Monitoring agents
[ -f .claude/agents/vibespec-health-engineer.md ] && mv .claude/agents/vibespec-health-engineer.md .claude/agents/monitoring/
[ -f .claude/agents/project-metrics-visualizer.md ] && mv .claude/agents/project-metrics-visualizer.md .claude/agents/monitoring/
[ -f .claude/agents/performance-monitor.md ] && mv .claude/agents/performance-monitor.md .claude/agents/monitoring/

# Testing agents
[ -f .claude/agents/integration-test-conductor.md ] && mv .claude/agents/integration-test-conductor.md .claude/agents/testing/
[ -f .claude/agents/test-hello.md ] && mv .claude/agents/test-hello.md .claude/agents/testing/

# Other agents (keep in root for now)
# architect.md, meta-agent.md, ui-enhancer.md, plan-automator.md

# Move commands
echo "   Moving commands..."
# Core commands
[ -f .claude/commands/adapt.md ] && mv .claude/commands/adapt.md .claude/commands/core/
[ -f .claude/commands/breakdown.md ] && mv .claude/commands/breakdown.md .claude/commands/core/
[ -f .claude/commands/context-prime.md ] && mv .claude/commands/context-prime.md .claude/commands/core/
[ -f .claude/commands/transpose.md ] && mv .claude/commands/transpose.md .claude/commands/core/

# Workflow shortcuts
[ -f .claude/commands/wr.md ] && mv .claude/commands/wr.md .claude/commands/workflow/
[ -f .claude/commands/wv.md ] && mv .claude/commands/wv.md .claude/commands/workflow/
[ -f .claude/commands/wi.md ] && mv .claude/commands/wi.md .claude/commands/workflow/
[ -f .claude/commands/wh.md ] && mv .claude/commands/wh.md .claude/commands/workflow/
[ -f .claude/commands/wl.md ] && mv .claude/commands/wl.md .claude/commands/workflow/

# Health commands
[ -f .claude/commands/vibespec-health.md ] && mv .claude/commands/vibespec-health.md .claude/commands/health/

# Remove duplicate workflow commands
rm -f .claude/commands/workflow-*.md 2>/dev/null || true

# Move hook system files
echo "   Moving hook system..."
[ -f .claude/hooks/pre-commit.sh ] && mv .claude/hooks/pre-commit.sh .claude/system/hooks/scripts/
[ -f .claude/hooks/file-watcher.py ] && mv .claude/hooks/file-watcher.py .claude/system/hooks/scripts/
[ -f .claude/hooks/post-tool-use.py ] && mv .claude/hooks/post-tool-use.py .claude/system/hooks/scripts/
[ -f .claude/hooks/sub-agent-stop.py ] && mv .claude/hooks/sub-agent-stop.py .claude/system/hooks/scripts/
[ -f .claude/hooks/hook-manager.sh ] && mv .claude/hooks/hook-manager.sh .claude/system/hooks/scripts/
[ -f .claude/hooks/hook-utils.sh ] && mv .claude/hooks/hook-utils.sh .claude/system/hooks/scripts/

# Move event system files
[ -f .claude/hooks/event-processor.py ] && mv .claude/hooks/event-processor.py .claude/system/hooks/events/
[ -f .claude/hooks/event-routing-table.json ] && mv .claude/hooks/event-routing-table.json .claude/system/hooks/events/
[ -f .claude/hooks/event-system-manager.sh ] && mv .claude/hooks/event-system-manager.sh .claude/system/hooks/events/
[ -f .claude/hooks/event-system-integrator.py ] && mv .claude/hooks/event-system-integrator.py .claude/system/hooks/events/

# Move hook documentation
[ -f .claude/hooks/README.md ] && mv .claude/hooks/README.md .claude/system/hooks/docs/
[ -f .claude/hooks/*.md ] && mv .claude/hooks/*.md .claude/system/hooks/docs/ 2>/dev/null || true

# Move health system files
echo "   Moving health system..."
# Fix nested .claude directories first
if [ -d ".claude/health/.claude" ]; then
    mv .claude/health/.claude/health/* .claude/data/ 2>/dev/null || true
    mv .claude/health/.claude/logs/* .claude/data/logs/ 2>/dev/null || true
    mv .claude/health/.claude/workflow-state/* .claude/data/workflow-state/ 2>/dev/null || true
    rm -rf .claude/health/.claude
fi

# Move health dashboards
[ -f .claude/health/dashboard-renderer.js ] && mv .claude/health/dashboard-renderer.js .claude/system/health/dashboards/
[ -f .claude/health/visualization-components.js ] && mv .claude/health/visualization-components.js .claude/system/health/dashboards/
[ -f .claude/health/report-templates.js ] && mv .claude/health/report-templates.js .claude/system/health/dashboards/
[ -f .claude/health/integration-utils.js ] && mv .claude/health/integration-utils.js .claude/system/health/dashboards/
[ -f .claude/health/health-command-integration.js ] && mv .claude/health/health-command-integration.js .claude/system/health/dashboards/

# Move health CLI
[ -f .claude/health/dashboard-cli.js ] && mv .claude/health/dashboard-cli.js .claude/system/health/cli/

# Move health tests
[ -f .claude/health/integration-test-suite.py ] && mv .claude/health/integration-test-suite.py .claude/system/health/tests/
[ -f .claude/health/performance-benchmarks.py ] && mv .claude/health/performance-benchmarks.py .claude/system/health/tests/
[ -f .claude/health/load-test-runner.py ] && mv .claude/health/load-test-runner.py .claude/system/health/tests/
[ -f .claude/health/run-comprehensive-tests.sh ] && mv .claude/health/run-comprehensive-tests.sh .claude/system/health/tests/
[ -f .claude/health/test-config.json ] && mv .claude/health/test-config.json .claude/system/health/tests/

# Move health docs
[ -f .claude/health/README.md ] && mv .claude/health/README.md .claude/system/health/docs/
[ -f .claude/health/*.md ] && mv .claude/health/*.md .claude/system/health/docs/ 2>/dev/null || true

# Move state system
echo "   Moving state system..."
[ -f .claude/state/*.ts ] && mv .claude/state/*.ts .claude/system/state/ 2>/dev/null || true
[ -f .claude/state/README.md ] && mv .claude/state/README.md .claude/system/state/

# Move scripts
echo "   Moving scripts..."
[ -f .claude/scripts/*.sh ] && mv .claude/scripts/*.sh .claude/system/scripts/ 2>/dev/null || true

# Move config files
echo "   Moving config files..."
[ -f .claude/config/*.json ] && mv .claude/config/*.json .claude/config/ 2>/dev/null || true
[ -f .claude/settings.local.json ] && mv .claude/settings.local.json .claude/config/

# Move runtime data
echo "   Moving runtime data..."
[ -f .claude/cache/* ] && mv .claude/cache/* .claude/data/cache/ 2>/dev/null || true
[ -f .claude/logs/* ] && mv .claude/logs/* .claude/data/logs/ 2>/dev/null || true
[ -f .claude/sessions/* ] && mv .claude/sessions/* .claude/data/sessions/ 2>/dev/null || true
[ -f .claude/workflow-state/* ] && mv .claude/workflow-state/* .claude/data/workflow-state/ 2>/dev/null || true

# Move test results
[ -f .claude/health/*-results*.json ] && mv .claude/health/*-results*.json .claude/data/test-results/ 2>/dev/null || true
[ -f .claude/health/integration-test-report*.md ] && mv .claude/health/integration-test-report*.md .claude/data/test-results/ 2>/dev/null || true

# Move documentation
[ -f .claude/*.md ] && mv .claude/*.md .claude/docs/ 2>/dev/null || true

echo "   ✅ Files reorganized"

# Clean up empty directories
echo ""
echo "4. Cleaning up..."
find .claude -type d -empty -delete 2>/dev/null || true
echo "   ✅ Empty directories removed"

# Update symlinks
echo ""
echo "5. Updating symlinks..."
# Update pre-commit hook symlink
if [ -L ".git/hooks/pre-commit" ]; then
    rm .git/hooks/pre-commit
    ln -s ../../.claude/system/hooks/scripts/pre-commit.sh .git/hooks/pre-commit
    echo "   ✅ Git pre-commit hook updated"
fi

# Create convenience symlinks at root level
ln -sf system/hooks .claude/hooks
ln -sf system/health .claude/health
ln -sf system/state .claude/state
echo "   ✅ Convenience symlinks created"

echo ""
echo "6. Creating .gitignore for data directory..."
cat > .claude/data/.gitignore << 'EOF'
# Ignore all runtime data
*
!.gitignore
!README.md
EOF

cat > .claude/data/README.md << 'EOF'
# Runtime Data Directory

This directory contains runtime data that should not be committed to version control:

- `cache/` - Temporary cache files
- `logs/` - Application and system logs
- `sessions/` - Session state files
- `workflow-state/` - Workflow execution state
- `test-results/` - Test execution results

All contents (except this README) are gitignored.
EOF

echo "   ✅ .gitignore created for data directory"

echo ""
echo "═══════════════════════════════════════════════════════"
echo "✅ Reorganization Complete!"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "New structure:"
echo ".claude/"
echo "├── agents/          # Organized by category"
echo "├── commands/        # Organized by type"
echo "├── system/          # All infrastructure"
echo "├── config/          # Configuration files"
echo "├── data/           # Runtime data (gitignored)"
echo "└── docs/           # Documentation"
echo ""
echo "Backup saved at: .claude.backup.*"
echo ""
echo "Please test your workflows to ensure everything works!"
echo "═══════════════════════════════════════════════════════"