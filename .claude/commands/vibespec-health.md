# VibeSpec Health Command

**Command**: `/vibespec:health`  
**Aliases**: `/vh`, `/health`  
**Agent**: `vibespec-health-engineer`  
**Performance Target**: <10 seconds  

## Overview

Provides comprehensive project health assessment with multi-dimensional scoring, real-time metrics aggregation, and actionable insights for maintaining optimal project health across all VibeSpec dimensions.

## Usage

```bash
/vibespec:health
/vh
/health

# With options
/vibespec:health --detailed
/vibespec:health --history
/vibespec:health --export
```

## Health Scoring Algorithm

```
Overall Health = (
  Compliance * 0.30 +        # VibeSpec rules adherence
  Velocity * 0.25 +          # Shipping momentum
  Spec_Alignment * 0.25 +    # Implementation fidelity
  Code_Quality * 0.15 +      # Technical quality
  Architecture * 0.05        # Structure integrity
)
```

## Implementation Strategy

### Phase 1: Core Health Assessment (Primary)

**Agent Coordination**:
```
vibespec-health-engineer (orchestrator)
├── compliance (parallel) - All 12 VibeSpec rules
├── spec-guardian (parallel) - Spec-to-implementation alignment
├── velocity (parallel) - Shipping momentum analysis
└── reviewer (parallel) - Code quality assessment
```

**Execution Flow**:
1. **Initialize** health check session with timestamp
2. **Parallel Analysis** across all dimensions
3. **Aggregate Results** with weighted scoring
4. **Generate Report** with actionable insights
5. **Persist Data** for historical tracking

### Phase 2: Real-Time Metrics Collection

**Data Sources**:
```typescript
interface HealthMetrics {
  git: {
    recentCommits: GitCommit[]
    branchStatus: BranchHealth
    commitFrequency: number
  }
  build: {
    lastBuildStatus: 'success' | 'failure'
    buildTime: number
    lintErrors: number
    typeErrors: number
  }
  structure: {
    fileCompliance: number
    namingCompliance: number
    organizationScore: number
  }
  specs: {
    coverage: number
    alignment: number
    missingFeatures: string[]
  }
  performance: {
    buildSpeed: number
    lintSpeed: number
    healthCheckSpeed: number
  }
}
```

**Collection Strategy**:
- **Git Analysis**: Parse commit history, branch status, frequency patterns
- **Build Status**: Check last build results, lint output, TypeScript compilation
- **File Structure**: Validate against VibeSpec conventions
- **Spec Coverage**: Compare specs/ directory with implementation
- **Performance**: Measure metric collection times

### Phase 3: Health Dimensions

#### 1. Compliance Score (30% weight)
**Data Source**: `compliance` agent
**Validation**:
- Rule 1-4: Implementation patterns, authentication
- Rule 5-8: File naming, validation, commits
- Rule 9-12: Code reuse, communication, scope

**Scoring**:
```typescript
const complianceScore = rules.reduce((total, rule) => {
  const weight = rule.severity === 'critical' ? 10 : 5
  const passed = rule.status === 'passed'
  return total + (passed ? weight : 0)
}, 0) / totalPossiblePoints * 100
```

#### 2. Velocity Score (25% weight)
**Data Source**: `velocity` agent + git analysis
**Metrics**:
- Commit frequency (commits/week)
- Feature completion rate
- Build success rate
- Time-to-deployment
- Scope creep detection

**Scoring**:
```typescript
const velocityScore = (
  commitFrequency * 0.3 +
  featureCompletionRate * 0.4 +
  buildSuccessRate * 0.2 +
  deploymentSpeed * 0.1
)
```

#### 3. Specification Alignment (25% weight)
**Data Source**: `spec-guardian` agent
**Analysis**:
- Feature coverage matrix
- Implementation completeness
- API contract validation
- User story completion

**Scoring**:
```typescript
const alignmentScore = (
  featureCoverage * 0.4 +
  implementationCompleteness * 0.3 +
  apiContractCompliance * 0.2 +
  userStoryCompletion * 0.1
)
```

#### 4. Code Quality Score (15% weight)
**Data Source**: `reviewer` agent + build tools
**Validation**:
- TypeScript compilation
- ESLint compliance
- Build success
- Import path consistency

**Scoring**:
```typescript
const qualityScore = (
  typeScriptCompliance * 0.4 +
  lintCompliance * 0.3 +
  buildHealth * 0.2 +
  importPathConsistency * 0.1
)
```

#### 5. Architecture Integrity (5% weight)
**Data Source**: File system analysis
**Validation**:
- Directory structure compliance
- File naming conventions
- Component organization
- Service patterns

## Output Format

### Standard Health Report
```
VIBESPEC PROJECT HEALTH DASHBOARD
=====================================

Overall Health Score: 87/100 [EXCELLENT]

DIMENSIONAL BREAKDOWN:
├── Compliance:        92/100 [↑ +3]
├── Velocity:          84/100 [↓ -2]
├── Spec Alignment:    89/100 [→ 0]
├── Code Quality:      85/100 [↑ +5]
└── Architecture:      95/100 [→ 0]

HEALTH STATUS: EXCELLENT
TREND: IMPROVING (+1.2 this week)

CRITICAL ISSUES: 0
WARNING ISSUES: 3
PASSED CHECKS: 47

TOP RECOMMENDATIONS:
1. [HIGH] Increase commit frequency to maintain velocity momentum
2. [MED] Address 3 ESLint warnings in user management components
3. [LOW] Consider extracting common utilities from authentication service

VELOCITY INSIGHTS:
├── Commits this week: 12 (target: 15+)
├── Features completed: 2/3 planned
├── Build success rate: 94%
└── Average time to deploy: 8 minutes

RECENT IMPROVEMENTS:
✓ Fixed TypeScript strict mode compliance
✓ Improved file naming consistency
✓ Updated import paths to use @ alias

Next health check recommended: 24 hours
```

### Detailed Report (--detailed flag)
```
DETAILED HEALTH ANALYSIS
========================

COMPLIANCE ANALYSIS (92/100):
├── PASSED (10/12 rules)
├── Rule 1: Authentication Implementation [PASS]
├── Rule 2: Real Implementations Only [PASS]
├── Rule 3: No Testing [PASS]
├── Rule 4: File Naming [PASS]
├── Rule 5: Error-Free Code [PASS]
├── Rule 6: Regular Validation [WARN] - Run validation more frequently
├── Rule 7: Commit Discipline [PASS]
├── Rule 8: Scope Control [PASS]
├── Rule 9: Code Reuse [WARN] - Potential duplication in auth components
├── Rule 10: Development Server [PASS]
├── Rule 11: Communication Style [PASS]
└── Rule 12: Task Boundaries [PASS]

SPECIFICATION ALIGNMENT (89/100):
├── Feature Coverage: 94% (17/18 features implemented)
├── Missing Features:
│   └── User profile image upload (in progress)
├── Implementation Quality: 87%
├── API Contract Compliance: 92%
└── User Story Completion: 85%

VELOCITY ANALYSIS (84/100):
├── Commit Frequency: 1.7/day (target: 2+)
├── Feature Completion: 67% on schedule
├── Build Success Rate: 94%
├── Average Build Time: 45 seconds
└── Deployment Frequency: 2.3/week

CODE QUALITY ANALYSIS (85/100):
├── TypeScript Compilation: 100% success
├── ESLint Compliance: 94% (3 warnings)
├── Build Health: 94% success rate
├── Import Consistency: 100%
└── Recent Quality Trends: Improving

ARCHITECTURE ANALYSIS (95/100):
├── Directory Structure: 100% compliant
├── File Naming: 100% compliant
├── Component Organization: 95% optimal
└── Service Patterns: 90% consistent
```

## Data Persistence

### Health History Storage
```typescript
// .claude/logs/health-history.json
interface HealthHistory {
  timestamp: string
  overallScore: number
  dimensions: {
    compliance: number
    velocity: number
    specAlignment: number
    codeQuality: number
    architecture: number
  }
  criticalIssues: number
  warningIssues: number
  trends: {
    weeklyChange: number
    monthlyChange: number
    trajectory: 'improving' | 'stable' | 'declining'
  }
}
```

### Metrics Cache
```typescript
// .claude/workflow-state/health-cache.json
interface HealthCache {
  lastCheck: string
  buildStatus: BuildStatus
  gitMetrics: GitMetrics
  fileStructure: StructureAnalysis
  specCoverage: SpecificationCoverage
  performanceBaseline: PerformanceMetrics
}
```

## Performance Optimizations

### Parallel Execution
```typescript
const healthCheck = async () => {
  const [compliance, velocity, specs, quality] = await Promise.all([
    agents.compliance.validate(),
    agents.velocity.analyze(),
    agents.specGuardian.checkAlignment(),
    agents.reviewer.assessQuality()
  ])
  
  return aggregateHealthScore({ compliance, velocity, specs, quality })
}
```

### Incremental Analysis
- Cache expensive computations
- Only re-analyze changed files
- Use git diff for targeted checks
- Maintain performance baselines

### Early Termination
- Stop on critical failures
- Skip detailed analysis if basic checks fail
- Provide immediate feedback for blocking issues

## Integration Points

### Workflow Integration
```bash
# Auto-triggered in validation workflow
/workflow:validate -> includes health check

# Available as standalone command
/vibespec:health

# Integrated with session tracking
/session:update -> logs health metrics
```

### Agent Collaboration
- **compliance**: Provides VibeSpec rules validation
- **spec-guardian**: Ensures spec-implementation alignment
- **velocity**: Tracks shipping momentum and scope
- **reviewer**: Assesses code quality and security
- **performance-monitor**: Provides speed benchmarks

### Historical Tracking
- Daily health snapshots
- Weekly trend analysis
- Monthly performance reports
- Predictive health modeling

## Command Flags

- `--detailed`: Full dimensional breakdown with specific issues
- `--history`: Show health trends over time
- `--export`: Export health data to JSON/CSV
- `--baseline`: Set current state as performance baseline
- `--compare [date]`: Compare with previous health check

## Success Metrics

### Performance Targets
- Complete comprehensive check in <10 seconds
- 100% VibeSpec rule coverage
- Real-time metric collection
- Zero false positives in critical issues

### Quality Standards
- Accurate health scoring across all dimensions
- Actionable recommendations with clear next steps
- Historical trend accuracy for predictive insights
- Seamless integration with existing workflows

### User Experience Goals
- Health status immediately understandable
- Issues prioritized by business impact
- Progress tracking visible across cycles
- Continuous improvement guidance

## Error Handling

### Graceful Degradation
- Continue health check if one dimension fails
- Provide partial results with warnings
- Fall back to cached data when appropriate
- Clear error messages for resolution

### Recovery Strategies
- Retry failed agent calls with backoff
- Use alternative data sources when primary fails
- Maintain minimum viable health report
- Log errors for debugging and improvement

## Future Enhancements

### Predictive Analytics
- Health trend forecasting
- Issue probability modeling
- Optimal check frequency recommendations
- Automated health improvement suggestions

### Advanced Integrations
- CI/CD pipeline health checks
- Deployment readiness assessment
- Team productivity correlation
- Business metric alignment

### Machine Learning
- Pattern recognition in health degradation
- Personalized recommendations
- Anomaly detection in project metrics
- Automated health optimization