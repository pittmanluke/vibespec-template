#!/bin/bash

# Simple cleanup script for .claude directory
# Moves test outputs and organizes without breaking functionality

echo "=== .claude Directory Cleanup ==="
echo ""

# Create directories for organization
mkdir -p .claude/test-outputs
mkdir -p .claude/data/old-sessions

# Move test results to dedicated directory
echo "1. Moving test outputs..."
mv .claude/health/*-results*.json .claude/test-outputs/ 2>/dev/null || true
mv .claude/health/integration-test-report*.md .claude/test-outputs/ 2>/dev/null || true
mv .claude/workflow-state/*-test-*.json .claude/test-outputs/ 2>/dev/null || true
echo "   ✅ Test outputs moved"

# Move old session files
echo ""
echo "2. Archiving old sessions..."
find .claude/sessions -name "*.md" -mtime +7 -exec mv {} .claude/data/old-sessions/ \; 2>/dev/null || true
echo "   ✅ Old sessions archived"

# Clean up duplicate workflow commands
echo ""
echo "3. Removing duplicate workflow commands..."
# Keep the short versions, remove the long ones
rm -f .claude/commands/workflow-review.md 2>/dev/null || true
rm -f .claude/commands/workflow-validate.md 2>/dev/null || true
rm -f .claude/commands/workflow-implement.md 2>/dev/null || true
rm -f .claude/commands/workflow-help.md 2>/dev/null || true
rm -f .claude/commands/workflow-list.md 2>/dev/null || true
echo "   ✅ Duplicates removed"

# Clear old cache files
echo ""
echo "4. Clearing old cache..."
find .claude/cache -type f -mtime +1 -delete 2>/dev/null || true
echo "   ✅ Old cache cleared"

# Create a summary
echo ""
echo "5. Creating directory summary..."
cat > .claude/DIRECTORY_MAP.md << 'EOF'
# .claude Directory Map

## Quick Navigation

### 🚀 Most Used
- Commands: `/commands/wr.md`, `/commands/wv.md`
- Agents: `/agents/compliance.md`, `/agents/reviewer.md`
- Health: `/health/dashboard-cli.js`
- Hooks: `/hooks/hook-manager.sh`

### 📁 Directory Structure
```
.claude/
├── agents/         # 24 specialized AI agents
├── commands/       # Workflow shortcuts and commands
├── hooks/          # Event-driven automation
├── health/         # Monitoring and dashboards
├── state/          # State persistence system
├── config/         # Configuration files
├── workflow-state/ # Active workflow data
├── logs/          # System logs
├── sessions/      # Session records
├── scripts/       # Utility scripts
├── cache/         # Temporary cache
└── test-outputs/  # Test results (cleaned up)
```

### 📊 Statistics
- Total Agents: 24
- Workflow Commands: 6 shortcuts + core commands
- Hook Scripts: 6 automation hooks
- Health Tools: Dashboard, CLI, tests

### 🔧 Maintenance Commands
```bash
# Check system status
./.claude/scripts/system-status.sh

# Clean up old files
./.claude/scripts/cleanup.sh

# View help
/wh
```
EOF

echo "   ✅ Directory map created"

# Show summary
echo ""
echo "=== Cleanup Complete ==="
echo ""
echo "📊 Summary:"
echo "- Test outputs moved to: .claude/test-outputs/"
echo "- Old sessions archived to: .claude/data/old-sessions/"
echo "- Duplicate commands removed"
echo "- Old cache cleared"
echo "- Directory map created at: .claude/DIRECTORY_MAP.md"
echo ""
echo "✅ .claude directory is now organized and clean!"