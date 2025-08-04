# /wr - Workflow Review (Parallel Comprehensive Review)

**Shortcut for**: `/workflow:review`

## Description
Executes a comprehensive parallel code review in 30-45 seconds instead of 2-3 minutes. Runs multiple specialized agents simultaneously to analyze code from different perspectives.

## Usage
```
/wr
```

## Execution Pattern
When you run `/wr`, Claude will:

1. **Invoke 4 agents in parallel** (single response, multiple Task calls):
   - `compliance`: Check VibeSpec rules and conventions
   - `reviewer`: Security and code quality analysis  
   - `ui-enhancer`: UI/UX standards (if UI files changed)
   - `spec-guardian`: Specification alignment (if specs exist)

2. **Consolidate results** into a unified review report with:
   - 🔴 Critical issues (must fix)
   - 🟡 Important improvements (should fix)
   - 🟢 Suggestions (nice to have)
   - ✅ Positive findings (what's working well)

3. **Save report** to `reviews/workflow-review-[timestamp].md`

## Expected Performance
- **Traditional sequential review**: 2-3 minutes
- **Parallel workflow review**: 30-45 seconds
- **Time savings**: 70-80%

## Example Output
```markdown
# Workflow Review Report
Generated: 2025-08-01 15:30:45

## 🔴 Critical Issues (2)
1. **Missing null check** in auth-service.ts:45
   - Agent: reviewer
   - Risk: Potential runtime error
   - Fix: Add null check before accessing user.id

2. **Incorrect file naming** new-Component.tsx
   - Agent: compliance  
   - Rule: Files must use kebab-case
   - Fix: Rename to new-component.tsx

## 🟡 Important Improvements (3)
...

## 🟢 Suggestions (5)
...

## ✅ Positive Findings
- Excellent TypeScript type coverage
- Good component composition
- Proper error handling in API calls
```

## Integration
- Works with changed files since last commit
- Respects .gitignore patterns
- Skips test files unless requested
- Integrates with CI/CD pipelines

## Error Handling
- If any agent fails, continues with others
- Partial results are still valuable
- Clear error reporting for debugging
- Automatic retry for transient failures