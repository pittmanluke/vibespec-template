# /wl - Workflow List

**Shortcut for**: `/workflow:list`

## Description
Lists all available workflows with detailed descriptions, expected duration, and usage patterns.

## Usage
```
/wl
```

## Output
When you run `/wl`, Claude will display:

```
🔄 Available Workflows

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Code Review (/wr or /workflow:review)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Purpose: Comprehensive parallel code analysis
   Duration: 30-45 seconds (vs 2-3 minutes sequential)
   Agents: compliance, reviewer, ui-enhancer, spec-guardian
   Best for: Pre-commit reviews, PR reviews, code quality checks
   
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. Validation Pipeline (/wv or /workflow:validate)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Purpose: Fast pre-commit validation with early termination
   Duration: 10-30 seconds
   Stages: Quick checks → Deep analysis (conditional)
   Best for: Pre-commit hooks, CI/CD gates, quick validation
   
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. Feature Implementation (/wi or /workflow:implement)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Purpose: Guided feature development with checkpoints
   Duration: 30-60 minutes (based on complexity)
   Phases: Analysis → Implementation → Enhancement → Docs
   Best for: New features, structured development, team handoffs
   Usage: /wi [feature-name or spec-file]
   
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. Health Check (/vibespec:health)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Purpose: Comprehensive project health assessment
   Duration: <10 seconds
   Metrics: Compliance, velocity, specs, quality, architecture
   Best for: Daily checks, sprint planning, quality gates
   
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5. Velocity Analysis (/vibespec:velocity)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Purpose: Development pace and shipping momentum tracking
   Duration: <10 seconds
   Analysis: Feature velocity, complexity trends, bottlenecks
   Best for: Sprint retrospectives, planning, optimization
   
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
6. Spec Sync (/vibespec:sync-specs)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Purpose: Verify implementation matches specifications
   Duration: 10-20 seconds
   Checks: Coverage, drift, unauthorized changes
   Best for: Feature completion, handoffs, compliance

Performance Gains:
  • Parallel execution: 70-80% time savings
  • Early termination: Skip unnecessary checks
  • Smart caching: Faster repeated runs
  • Batch processing: Handle multiple files efficiently

Type any workflow command to execute, or use --help for details.
```

## Features
- Complete workflow catalog
- Duration estimates
- Agent/stage information
- Use case recommendations
- Performance metrics
- Visual formatting for clarity

## Dynamic Content
- Automatically discovers new workflows
- Updates duration based on metrics
- Shows availability status
- Indicates experimental features