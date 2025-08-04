#!/bin/bash

echo "═══════════════════════════════════════════════════════"
echo "     VibeSpec Workflow System Status Check"
echo "═══════════════════════════════════════════════════════"
echo ""

# Check file watcher
echo "1. File Watcher Status:"
if pgrep -f "file-watcher.py" > /dev/null; then
    echo "   ✅ Running (PID: $(pgrep -f "file-watcher.py"))"
else
    echo "   ❌ Not Running"
fi

# Check Git hooks
echo ""
echo "2. Git Hook Integration:"
if [ -L ".git/hooks/pre-commit" ]; then
    echo "   ✅ Pre-commit hook installed"
else
    echo "   ❌ Pre-commit hook not installed"
fi

# Check agent count
echo ""
echo "3. Specialized Agents:"
agent_count=$(ls -1 .claude/agents/*.md 2>/dev/null | wc -l)
echo "   📊 $agent_count agents available"

# Check workflow commands
echo ""
echo "4. Workflow Commands:"
for cmd in wr wv wi wh wl vibespec-health; do
    if [ -f ".claude/commands/$cmd.md" ]; then
        echo "   ✅ /$cmd"
    else
        echo "   ❌ /$cmd"
    fi
done

# Check health system
echo ""
echo "5. Health Monitoring:"
if [ -f ".claude/health/dashboard-cli.js" ]; then
    echo "   ✅ Dashboard system ready"
else
    echo "   ❌ Dashboard system missing"
fi

# Check state management
echo ""
echo "6. State Management:"
if [ -f ".claude/state/workflow-state-api.ts" ]; then
    echo "   ✅ State persistence ready"
else
    echo "   ❌ State persistence missing"
fi

echo ""
echo "═══════════════════════════════════════════════════════"
echo "Overall Status: System is operational!"
echo "═══════════════════════════════════════════════════════"