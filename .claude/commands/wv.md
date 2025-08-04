# /wv - Workflow Validate (Pre-Commit Validation)

**Shortcut for**: `/workflow:validate`

## Description
Fast pre-commit validation with early termination. Catches issues before they enter the codebase by running quick checks first, then deeper analysis only if needed.

## Usage
```
/wv
```

## Execution Pattern
When you run `/wv`, Claude will:

1. **Stage 1: Quick Checks** (Parallel, ~10 seconds)
   - `compliance`: VibeSpec rules validation
   - `spec-guardian`: Scope creep detection
   - **Early termination**: If critical issues found, stop here

2. **Stage 2: Deep Analysis** (Only if Stage 1 passes, ~20 seconds)
   - `reviewer`: Security and quality scan
   - `velocity`: Over-engineering detection
   - `performance-monitor`: Performance impact (if available)

3. **Result**:
   - ✅ **PASS**: Ready to commit
   - ❌ **FAIL**: Issues to fix (with specific guidance)

## Expected Performance
- **Quick validation**: 10-30 seconds total
- **Early termination**: Saves time on obvious issues
- **Smart gating**: Only runs expensive checks when needed

## Example Output

### Success Case
```
🎯 Workflow Validation: PASSED

Stage 1: Quick Checks ✅
- Compliance: All VibeSpec rules followed
- Specifications: No scope creep detected

Stage 2: Deep Analysis ✅  
- Security: No vulnerabilities found
- Quality: Code meets standards
- Velocity: Appropriate complexity

Ready to commit! 🚀
```

### Failure Case
```
❌ Workflow Validation: FAILED

Stage 1: Quick Checks
- Compliance: 2 violations found
  1. File uses PascalCase: NewComponent.tsx
     Fix: Rename to new-component.tsx
  2. Console.log found: user-service.ts:45
     Fix: Remove console statement

Validation stopped at Stage 1 to save time.
Fix these issues and run /wv again.
```

## Integration
- Designed for pre-commit hooks
- Can be run manually anytime
- Integrates with CI/CD pipelines
- Respects .gitignore patterns

## Configuration
Future versions will support:
- Custom validation rules
- Stage configuration
- Severity thresholds
- Skip patterns

## Performance Optimization
- Parallel execution within stages
- Smart file filtering
- Incremental validation
- Result caching