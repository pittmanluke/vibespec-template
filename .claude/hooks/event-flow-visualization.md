# Event Flow Visualization for VibeSpec Hook Infrastructure

## Overview

This document provides comprehensive visualizations of the event flow patterns within the VibeSpec hook infrastructure, illustrating how events propagate through the system, timing relationships, and critical path dependencies.

## System-Level Event Flow

### Complete Event Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           VibeSpec Event Flow Architecture                       │
└─────────────────────────────────────────────────────────────────────────────────┘

Event Sources                Event Router               Priority Queues            Processors
─────────────                ─────────────               ───────────────            ──────────

┌──────────────┐             ┌──────────────┐           ┌──────────────┐          ┌─────────────┐
│ File Watcher │────────────▶│              │           │   CRITICAL   │◀─────────│ Worker P0   │
│              │             │              │           │   Queue      │          │ (Immediate) │
│ • inotify    │             │ Event Router │           │   Max: 1000  │          └─────────────┘
│ • fswatch    │             │              │           │   Timeout:   │          ┌─────────────┐
│ • polling    │             │ • Route Table│           │   50ms       │◀─────────│ Worker P1   │
└──────────────┘             │ • Filters    │           └──────────────┘          │ (Fast)      │
                             │ • Dedup      │           ┌──────────────┐          └─────────────┘
┌──────────────┐             │ • Load Bal   │           │    HIGH      │          ┌─────────────┐
│ Tool Monitor │────────────▶│ • Circuit Br │           │   Queue      │◀─────────│ Worker P2   │
│              │             │              │           │   Max: 5000  │          │ (Normal)    │
│ • Read/Write │             │              │           │   Timeout:   │          └─────────────┘
│ • Glob/Search│             │              │           │   100ms      │          ┌─────────────┐
│ • Execute    │             │              │           └──────────────┘          │ Worker P3   │
└──────────────┘             │              │           ┌──────────────┐◀─────────│ (Background)│
                             │              │           │   NORMAL     │          └─────────────┘
┌──────────────┐             │              │           │   Queue      │
│ Git Monitor  │────────────▶│              │           │   Max: 10000 │          ┌─────────────┐
│              │             │              │           │   Timeout:   │          │ DLQ Worker  │
│ • pre-commit │             │              │           │   500ms      │          │             │
│ • post-merge │             │              │           └──────────────┘          │ • Retry     │
│ • push/pull  │             │              │           ┌──────────────┐◀─────────│ • Alert     │
└──────────────┘             │              │           │     LOW      │          │ • Analyze   │
                             │              │           │   Queue      │          └─────────────┘
┌──────────────┐             │              │           │   Max: 20000 │
│ Workflow Mgr │────────────▶│              │           │   Timeout:   │
│              │             │              │           │   1000ms     │
│ • Start/Stop │             │              │           └──────────────┘
│ • Agent Coord│             │              │
│ • State Mgmt │             │              │           ┌──────────────┐
└──────────────┘             └──────────────┘           │ Dead Letter  │
                                    │                   │   Queue      │
┌──────────────┐                    │                   │              │
│ Agent Events │────────────────────┘                   │ • Failed     │
│              │                                        │ • Retry      │
│ • Started    │                                        │ • Manual     │
│ • Completed  │                                        └──────────────┘
│ • Failed     │
└──────────────┘

                              State Management Layer
                              ─────────────────────────

┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Session     │    │ Workflow    │    │ Agent       │    │ File        │
│ State       │    │ State       │    │ Context     │    │ Snapshots   │
│             │    │             │    │             │    │             │
│ • Current   │    │ • Active    │    │ • Execution │    │ • Hash      │
│ • History   │    │ • Progress  │    │ • Outputs   │    │ • Changes   │
│ • Context   │    │ • Metrics   │    │ • Chains    │    │ • Metadata  │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       └───────────────────┼───────────────────┼───────────────────┘
                           │                   │
                           ▼                   ▼
                ┌─────────────────────────────────────┐
                │      Persistent Storage             │
                │                                     │
                │ • JSON Files                        │
                │ • Compressed Archives               │
                │ • Event Logs                        │
                │ • Performance Metrics               │
                └─────────────────────────────────────┘
```

## Event Type Flow Patterns

### File System Event Flow

```
File Change Detection → Event Generation → Processing → Agent Triggering

┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ inotify/    │    │ File Event  │    │ Dedup +     │    │ Handler     │
│ fswatch     │───▶│ Created     │───▶│ Filter      │───▶│ Dispatch    │
│ Polling     │    │             │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                           │                   │                   │
                           ▼                   ▼                   ▼
                   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
                   │ Event Data: │    │ Check:      │    │ Trigger:    │
                   │ • file_path │    │ • Extension │    │ • compliance│
                   │ • action    │    │ • Directory │    │ • spec-guard│
                   │ • timestamp │    │ • Pattern   │    │ • ui-enhance│
                   │ • size      │    │ • Recent    │    │ • reviewer  │
                   └─────────────┘    └─────────────┘    └─────────────┘

Timeline Example:
T+0ms    File modified (user saves file)
T+10ms   inotify detects change
T+15ms   Event created and routed
T+20ms   Deduplication check passes
T+25ms   Added to HIGH priority queue
T+30ms   Worker picks up event
T+35ms   file-watcher hook executed
T+45ms   compliance agent triggered
T+50ms   Event processing complete

Performance Targets:
• Detection to processing: <50ms
• Processing to agent trigger: <100ms
• Total end-to-end: <150ms
```

### Workflow Event Flow

```
Workflow Lifecycle → State Updates → Agent Coordination

┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ /workflow:  │    │ workflow.   │    │ State       │    │ Agent       │
│ review      │───▶│ started     │───▶│ Update      │───▶│ Coordinator │
│ Command     │    │ Event       │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                           │                   │                   │
                           ▼                   ▼                   ▼
                   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
                   │ CRITICAL    │    │ workflow-   │    │ Parallel    │
                   │ Priority    │    │ state.json  │    │ Execution:  │
                   │ Immediate   │    │ Updated     │    │ • compliance│
                   │ Processing  │    │             │    │ • reviewer  │
                   └─────────────┘    └─────────────┘    │ • ui-enhance│
                                             │           └─────────────┘
                                             ▼
                                     ┌─────────────┐
                                     │ Agent       │
                                     │ Progress    │───┐
                                     │ Tracking    │   │
                                     └─────────────┘   │
                                             │         │
                                             ▼         ▼
                                     ┌─────────────┐   ┌─────────────┐
                                     │ agent.      │   │ Completion  │
                                     │ completed   │   │ Aggregation │
                                     │ Events      │   │             │
                                     └─────────────┘   └─────────────┘
                                             │                   │
                                             ▼                   ▼
                                     ┌─────────────┐    ┌─────────────┐
                                     │ workflow.   │    │ Final       │
                                     │ completed   │    │ Report      │
                                     │ Event       │    │ Generation  │
                                     └─────────────┘    └─────────────┘

Performance Characteristics:
• Workflow start latency: <50ms
• Agent coordination: <100ms
• Parallel agent execution: 30-90s
• Results aggregation: <500ms
• Total workflow time: 30-120s (depending on complexity)
```

### Agent Coordination Event Flow

```
Agent Execution Pipeline → Output Processing → Chain Decision

┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Agent       │    │ agent.      │    │ Output      │    │ Chain       │
│ Trigger     │───▶│ started     │───▶│ Capture     │───▶│ Analysis    │
│ Event       │    │ Event       │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Conditions: │    │ Execution   │    │ sub-agent-  │    │ Next Agent  │
│ • Debounce  │    │ Context:    │    │ stop Hook   │    │ Decision:   │
│ • Load      │    │ • Session   │    │             │    │             │
│ • Priority  │    │ • Files     │    │ • Parse     │    │ • compliance│
│ • Cooldown  │    │ • Previous  │    │ • Store     │    │   → reviewer│
└─────────────┘    │   Outputs   │    │ • Analyze   │    │ • spec-guard│
                   └─────────────┘    └─────────────┘    │   → architect│
                                             │           └─────────────┘
                                             ▼
                                     ┌─────────────┐
                                     │ Performance │
                                     │ Metrics:    │
                                     │ • Duration  │
                                     │ • Memory    │
                                     │ • Success   │
                                     │ • Quality   │
                                     └─────────────┘

Chain Decision Logic:
┌─────────────────────────────────────────────────────────────────────┐
│ IF agent = compliance AND violations_found                          │
│ THEN trigger reviewer (security focus)                              │
│                                                                     │
│ IF agent = spec-guardian AND drift_detected                        │
│ THEN trigger architect (design review)                             │
│                                                                     │
│ IF agent = reviewer AND performance_issues                         │
│ THEN trigger performance-monitor                                   │
│                                                                     │
│ IF agent = ui-enhancer AND accessibility_issues                   │
│ THEN trigger accessibility-validator                               │
└─────────────────────────────────────────────────────────────────────┘
```

## Timing Diagrams

### Real-time Event Processing Timeline

```
Time     Event Source    Router    Queue    Worker    Handler    Agent
────     ────────────    ──────    ─────    ──────    ───────    ─────
T+0      File Save       
         │               
T+10     │ inotify       
         │ │              
T+15     │ │ Event       
         │ │ │ Generated  
         │ │ │            
T+20     │ │ │ Routed     
         │ │ │ │          
         │ │ │ │ Queued   
         │ │ │ │ │        
T+30     │ │ │ │ │ Picked 
         │ │ │ │ │ │      
T+35     │ │ │ │ │ │ Hook  
         │ │ │ │ │ │ │ Exec
         │ │ │ │ │ │ │ │   
T+45     │ │ │ │ │ │ │ │ Agent
         │ │ │ │ │ │ │ │ │ Trigger
         │ │ │ │ │ │ │ │ │ │
T+50     ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓ Complete

Performance Zones:
├─ Detection Zone (0-20ms)     │ File system monitoring
├─ Routing Zone (20-30ms)      │ Event filtering and queueing  
├─ Processing Zone (30-45ms)   │ Hook execution
└─ Trigger Zone (45-50ms)      │ Agent activation
```

### Batch Processing Timeline

```
Batch Window: 2000ms                    Batch Size: 50 events

Events: ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
Time:   0────────────────────────────────────────────────2000ms
        │         │         │         │         │         │
        ├─Window 1─┤         │         │         │         │
        Events: 12│         │         │         │         │
                  │         │         │         │         │
        Triggered: Size < 50 AND timeout = 2000ms          │
                  │         │         │         │         │
                  ├─────────────Window 2─────────────────┤
                  Events: 48 (accumulated)               │
                  │         │         │         │         │
                  Triggered: Size = 48 < 50 BUT timeout  │
                  │         │         │         │         │
                  ├─────Window 3─────────────────────────┤
                  Events: 52 (accumulated)               │
                  │         │         │                   │
                  Triggered: Size >= 50 (immediate)      │

Batch Trigger Conditions:
1. Size >= max_batch_size (50)           → Immediate
2. Time >= batch_timeout (2000ms)        → Timeout-based  
3. Critical event in batch               → Immediate
4. System shutdown                       → Forced flush
```

### Agent Workflow Timeline

```
Parallel Agent Execution (Workflow Review)

Agent        Start    Duration    End      Status
─────        ─────    ────────    ───      ──────
compliance   T+0      45s         T+45     ✓ Success
reviewer     T+0      75s         T+75     ✓ Success  
ui-enhancer  T+0      60s         T+60     ✓ Success
spec-guard   T+0      30s         T+30     ✓ Success

Timeline:
T+0     ├─ All agents started in parallel
        │
T+30    ├─ spec-guardian completes first
        │  • Output captured by sub-agent-stop hook
        │  • Results stored in workflow state
        │
T+45    ├─ compliance completes
        │  • Chain decision: No violations found
        │  • No additional agents triggered
        │
T+60    ├─ ui-enhancer completes  
        │  • Accessibility improvements suggested
        │  • No blocking issues found
        │
T+75    ├─ reviewer completes (last)
        │  • Security scan passed
        │  • Performance recommendations noted
        │  
T+76    ├─ Results aggregation begins
        │  • All outputs combined
        │  • Overall score calculated
        │  • Final report generated
        │
T+80    └─ Workflow completed
           • workflow.completed event fired
           • Final state persisted
           • User notified

Total Workflow Time: 80 seconds
Agent Overlap: 100% (all parallel)
Efficiency Gain: 70% vs sequential (45+75+60+30 = 210s)
```

## Critical Path Analysis

### Event Processing Critical Path

```
Critical Path: User Action → Agent Response

┌──────────────────────────────────────────────────────────────────────┐
│                         Critical Path Timeline                      │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│ User Action     File Detection    Event Processing    Agent Trigger  │
│     │               │                    │                 │         │
│     ▼               ▼                    ▼                 ▼         │
│ ┌─────────┐    ┌─────────┐         ┌─────────┐      ┌─────────┐      │
│ │ Save    │───▶│inotify  │────────▶│Router   │─────▶│Trigger  │      │
│ │ File    │    │Detect   │         │Process  │      │Agent    │      │
│ │         │    │         │         │         │      │         │      │
│ └─────────┘    └─────────┘         └─────────┘      └─────────┘      │
│      │              │                   │               │            │
│      0ms            10ms               35ms            50ms          │
│                                                                      │
│ Bottleneck Analysis:                                                 │
│ • File Detection: 10ms (system dependent)                           │
│ • Event Routing: 25ms (configurable)                                │
│ • Agent Trigger: 15ms (optimizable)                                 │
│                                                                      │
│ Optimization Opportunities:                                          │
│ 1. Faster file detection (inotify tuning)                          │
│ 2. Event routing optimization (skip filters for critical events)    │
│ 3. Agent trigger batching (group similar triggers)                  │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### Workflow Execution Critical Path

```
Parallel Workflow Critical Path Analysis

┌─────────────────────────────────────────────────────────────────────────┐
│                    Workflow: Code Review (/wr)                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│ Sequential Path (if no parallelization):                               │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                           │
│ │Start │▶│Compl │▶│Review│▶│UI-En │▶│Aggr  │ = 180s                     │
│ │ 0s   │ │ 45s  │ │ 75s  │ │ 60s  │ │ 5s   │                           │
│ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘                           │
│                                                                         │
│ Parallel Path (current implementation):                                │
│          ┌──────┐                                                      │
│          │Compl │ (45s)                                                │
│          │iance │                                                      │
│ ┌──────┐ ├──────┤         ┌──────┐                                     │
│ │Start │▶│Review│ (75s) ──│Aggr  │ = 80s                               │
│ │ 0s   │ │  er  │         │ 5s   │                                     │
│ └──────┘ ├──────┤         └──────┘                                     │
│          │UI-En │ (60s)                                                │
│          │hancer│                                                      │
│          └──────┘                                                      │
│                                                                         │
│ Critical Path: Start → Reviewer (75s) → Aggregation (5s) = 80s        │
│ Efficiency Gain: 100s saved (55% improvement)                          │
│ Parallelization Factor: 2.25x speedup                                  │
│                                                                         │
│ Dependencies:                                                           │
│ • All agents can start simultaneously (no dependencies)                │
│ • Aggregation waits for slowest agent (reviewer at 75s)               │
│ • No agent chains in this workflow                                     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## Error Flow Patterns

### Circuit Breaker State Transitions

```
Circuit Breaker State Machine for Handler Protection

┌─────────────────────────────────────────────────────────────────────────┐
│                      Circuit Breaker States                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│    CLOSED (Normal Operation)                                            │
│    ┌─────────────────────┐                                             │
│    │ • All requests pass │                                             │
│    │ • Monitor failures  │                                             │
│    │ • Count: 0/5        │                                             │
│    └─────────────────────┘                                             │
│            │                   │                                       │
│            ▼                   ▼                                       │
│    ┌─────────────────────┐     ┌─────────────────────┐                 │
│    │    Success          │     │     Failure         │                 │
│    │ • Reset counter     │     │ • Increment counter │                 │
│    │ • Continue normal   │     │ • Check threshold   │                 │
│    └─────────────────────┘     └─────────────────────┘                 │
│            │                           │                               │
│            ▼                           ▼                               │
│    ┌─────────────────────┐     ┌─────────────────────┐                 │
│    │ Stay CLOSED         │     │ Count >= 5?         │                 │
│    └─────────────────────┘     └─────────────────────┘                 │
│                                        │                               │
│                                        ▼ YES                          │
│                                ┌─────────────────────┐                 │
│                                │     OPEN            │                 │
│                                │ • Fail immediately  │                 │
│                                │ • No requests pass  │                 │
│                                │ • Start recovery    │                 │
│                                │   timer (30s)       │                 │
│                                └─────────────────────┘                 │
│                                        │                               │
│                                        ▼ After 30s                    │
│                                ┌─────────────────────┐                 │
│                                │   HALF_OPEN         │                 │
│                                │ • Allow test        │                 │
│                                │   requests          │                 │
│                                │ • Monitor closely   │                 │
│                                └─────────────────────┘                 │
│                                  │               │                     │
│                                  ▼ Success       ▼ Failure             │
│                          ┌─────────────────────┐ ┌─────────────────────┐ │
│                          │ Return to CLOSED    │ │ Return to OPEN      │ │
│                          └─────────────────────┘ └─────────────────────┘ │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

Error Handling Flow:
1. Handler fails → Increment failure count
2. Count reaches threshold → Circuit opens
3. Subsequent requests → Immediate failure (fast)
4. Recovery timer expires → Half-open state
5. Test request succeeds → Return to normal
6. Test request fails → Return to open state
```

### Dead Letter Queue Processing

```
Failed Event Recovery Pipeline

┌─────────────────────────────────────────────────────────────────────────┐
│                     Dead Letter Queue Flow                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│ Event Processing Failure                                                │
│ ┌─────────────────────┐                                                 │
│ │ • Handler timeout   │                                                 │
│ │ • Exception thrown  │                                                 │
│ │ • Circuit breaker   │                                                 │
│ │ • Queue overflow    │                                                 │
│ └─────────────────────┘                                                 │
│           │                                                             │
│           ▼                                                             │
│ ┌─────────────────────┐                                                 │
│ │ Add to DLQ with:    │                                                 │
│ │ • Original event    │                                                 │
│ │ • Failure reason    │                                                 │
│ │ • Retry count       │                                                 │
│ │ • Timestamp         │                                                 │
│ └─────────────────────┘                                                 │
│           │                                                             │
│           ▼                                                             │
│ ┌─────────────────────┐     ┌─────────────────────┐                     │
│ │ DLQ Processor       │────▶│ Failure Analysis    │                     │
│ │ • Periodic scan     │     │ • Transient?        │                     │
│ │ • Classify failures │     │ • Fixable?          │                     │
│ │ • Apply strategies  │     │ • Manual needed?    │                     │
│ └─────────────────────┘     └─────────────────────┘                     │
│           │                           │                                 │
│           ▼                           ▼                                 │
│ ┌─────────────────────┐     ┌─────────────────────┐                     │
│ │ Recovery Actions:   │     │ Escalation:         │                     │
│ │ • Retry with delay  │     │ • Alert admin       │                     │
│ │ • Fix and requeue   │     │ • Log for analysis  │                     │
│ │ • Route alternative │     │ • Manual review     │                     │
│ └─────────────────────┘     └─────────────────────┘                     │
│                                                                         │
│ Retry Schedule:                                                         │
│ • Attempt 1: Immediate                                                  │
│ • Attempt 2: 30 seconds                                                 │
│ • Attempt 3: 5 minutes                                                  │
│ • Attempt 4: 30 minutes                                                 │
│ • Final: Manual intervention                                            │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## Performance Monitoring Flow

### Real-time Metrics Collection

```
Metrics Collection and Analysis Pipeline

Event Source          Metrics Collection        Analysis Engine        Alerting
────────────          ──────────────────        ───────────────        ────────

┌──────────────┐     ┌──────────────────┐     ┌──────────────────┐     ┌──────────┐
│ Every Event  │────▶│ Performance      │────▶│ Threshold        │────▶│ Alert    │
│              │     │ Recorder         │     │ Monitor          │     │ Manager  │
│ • Timestamp  │     │                  │     │                  │     │          │
│ • Duration   │     │ • Latency        │     │ • Queue depth    │     │ • Email  │
│ • Queue Time │     │ • Throughput     │     │ • Error rate     │     │ • Slack  │
│ • Success    │     │ • Error count    │     │ • Memory usage   │     │ • Log    │
└──────────────┘     │ • Memory delta   │     │ • CPU usage      │     └──────────┘
                     └──────────────────┘     └──────────────────┘
                              │                         │
                              ▼                         ▼
                     ┌──────────────────┐     ┌──────────────────┐
                     │ Rolling Window   │     │ Trend Analysis   │
                     │ Aggregation      │     │                  │
                     │                  │     │ • 1min average   │
                     │ • Last 100 events│     │ • 5min trend     │
                     │ • Last 1000 events│     │ • 1hr baseline   │
                     │ • Percentiles    │     │ • Daily pattern  │
                     └──────────────────┘     └──────────────────┘

Metrics Dashboard:
┌─────────────────────────────────────────────────────────────────────────┐
│                        Real-time Metrics                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│ Event Processing Rate:    [████████████████████] 850 events/sec        │
│ Average Latency:          [██████████          ] 45ms                   │
│ Queue Depth (Critical):   [████                ] 45/1000               │
│ Queue Depth (High):       [████████            ] 230/5000              │
│ Queue Depth (Normal):     [██████████████      ] 1,250/10000           │
│ Queue Depth (Low):        [████████████████████] 8,900/20000           │
│                                                                         │
│ Error Rate:               [██                  ] 0.8%                   │
│ Circuit Breaker Status:   [All CLOSED          ] ✓                     │
│ Memory Usage:             [████████████████    ] 78MB/100MB            │
│ Worker Thread Status:     [████████████████████] 4/4 Active            │
│                                                                         │
│ Top Event Types (last hour):                                           │
│ 1. file.modified          2,450 events  avg: 35ms                      │
│ 2. tool.used              1,890 events  avg: 15ms                      │
│ 3. agent.completed          245 events  avg: 85ms                      │
│ 4. workflow.started          12 events  avg: 25ms                      │
│                                                                         │
│ Recent Alerts:                                                          │
│ [WARN] Queue depth high on Normal queue (1,250 > 1,000) - 2min ago     │
│ [INFO] Circuit breaker opened for compliance-validator - 15min ago     │
│ [INFO] Circuit breaker returned to CLOSED - 10min ago                  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

This comprehensive visualization system provides clear insight into event flow patterns, timing relationships, and system behavior, enabling effective monitoring, debugging, and optimization of the VibeSpec event processing infrastructure.