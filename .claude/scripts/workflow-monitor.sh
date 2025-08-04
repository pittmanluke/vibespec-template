#!/bin/bash

# VibeSpec Workflow Monitor Dashboard
# Displays real-time workflow metrics and agent performance

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║            VibeSpec Workflow Monitor Dashboard               ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "📅 Date: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

# Today's workflow activity
echo "📊 Today's Workflow Activity"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━"
TODAY=$(date +%Y%m%d)
LOG_FILE=".claude/logs/workflow-$TODAY.log"

if [ -f "$LOG_FILE" ]; then
    TOTAL_RUNS=$(grep -c "SubagentStop" "$LOG_FILE" 2>/dev/null || echo "0")
    echo "Total Agent Executions: $TOTAL_RUNS"
    
    # Count unique timestamps (rough workflow count)
    WORKFLOW_COUNT=$(grep "SubagentStop" "$LOG_FILE" 2>/dev/null | awk -F'[\\[\\]]' '{print $2}' | cut -d'.' -f1 | sort -u | wc -l || echo "0")
    echo "Estimated Workflows Run: $WORKFLOW_COUNT"
else
    echo "No workflow activity today"
fi

echo ""
echo "🏃 Recent Agent Activity (Last 10)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ -f "$LOG_FILE" ]; then
    tail -10 "$LOG_FILE" 2>/dev/null | grep "SubagentStop" | tail -5 || echo "No recent activity"
else
    echo "No activity log found"
fi

echo ""
echo "💾 Workflow State Files"
echo "━━━━━━━━━━━━━━━━━━━━━━━"
if [ -d ".claude/workflow-state" ]; then
    STATE_COUNT=$(ls -1 .claude/workflow-state/*.json 2>/dev/null | wc -l || echo "0")
    echo "Active State Files: $STATE_COUNT"
    
    # Show most recent state files
    if [ "$STATE_COUNT" -gt 0 ]; then
        echo ""
        echo "Most Recent States:"
        ls -lt .claude/workflow-state/*.json 2>/dev/null | head -5 | awk '{print "  - " $9 " (" $6 " " $7 " " $8 ")"}'
    fi
else
    echo "No workflow state directory found"
fi

echo ""
echo "📝 Available Workflows"
echo "━━━━━━━━━━━━━━━━━━━━"
echo "  /wr  - Review (parallel)      ⚡ 30-45s"
echo "  /wv  - Validate (serial)      🔍 60-90s"
echo "  /wi  - Implement (pipeline)   🏗️  15m-2h"
echo ""
echo "Type /workflow:list for all available workflows"

echo ""
echo "🤖 Active Agents"
echo "━━━━━━━━━━━━━━━━"
AGENT_COUNT=$(ls -1 .claude/agents/*.md 2>/dev/null | wc -l || echo "0")
echo "Total Agents: $AGENT_COUNT"

if [ "$AGENT_COUNT" -gt 0 ]; then
    echo ""
    echo "Recently Modified:"
    ls -lt .claude/agents/*.md 2>/dev/null | head -3 | while read -r line; do
        AGENT_NAME=$(echo "$line" | awk '{print $9}' | xargs basename | sed 's/.md$//')
        echo "  - $AGENT_NAME"
    done
fi

echo ""
echo "🔧 Quick Actions"
echo "━━━━━━━━━━━━━━━"
echo "  1. Run comprehensive review:    /wr"
echo "  2. Validate before commit:      /wv"
echo "  3. Build new agent:             /workflow:build-agent [purpose]"
echo "  4. Check performance:           /workflow:performance"

echo ""
echo "💡 Tips"
echo "━━━━━━"
echo "• Parallel workflows save 70-80% time"
echo "• Use /wv before every commit"
echo "• Create agents for repetitive tasks"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Last updated: $(date '+%H:%M:%S') | Refresh: ./workflow-monitor.sh"