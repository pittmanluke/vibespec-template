# /wi - Workflow Implement (Guided Feature Implementation)

**Shortcut for**: `/workflow:implement`

## Description
Structured feature implementation with intelligent guidance and automatic checkpoints. Transforms specifications into working code with continuous validation.

## Usage
```
/wi [feature-name or path/to/spec.md]
```

## Examples
```
/wi user-authentication
/wi specs/shopping-cart.md
/wi "real-time notifications"
```

## Execution Pattern
When you run `/wi [feature]`, Claude will:

1. **Phase 1: Analysis & Planning** (~5 minutes)
   - `spec-guardian`: Analyze specification/requirements
   - `architect`: Create implementation plan
   - Output: Structured plan with checkpoints

2. **Phase 2: Implementation** (~20-40 minutes based on complexity)
   - Guided step-by-step implementation
   - Automatic compliance checking at each step
   - Progress tracking with TodoWrite

3. **Phase 3: Enhancement** (Parallel, ~10 minutes)
   - `ui-enhancer`: Improve UI/UX aspects
   - `performance-monitor`: Optimize performance
   - `reviewer`: Security hardening

4. **Phase 4: Documentation** (~5 minutes)
   - `docs-sync`: Update all documentation
   - Generate implementation summary

## Checkpoint System
Automatic checkpoints created at:
- ✓ Plan approved
- ✓ Data layer complete
- ✓ Business logic implemented
- ✓ UI components created
- ✓ Integration tested
- ✓ Documentation updated

## Example Flow
```
$ /wi user-profile

🚀 Starting Workflow Implementation: user-profile

Phase 1: Analysis & Planning
- Analyzing requirements...
- Creating implementation plan...
✓ Plan created: plans/user-profile-implementation.md

Continue with implementation? (y/n): y

Phase 2: Implementation
Step 1/5: Creating data models...
✓ Created: src/types/user-profile.ts
✓ Created: src/services/user-profile-service.ts

Step 2/5: Implementing API endpoints...
✓ Created: src/app/api/profile/route.ts
✓ Compliance check passed

Step 3/5: Building UI components...
✓ Created: src/components/user-profile/profile-card.tsx
✓ Created: src/components/user-profile/profile-editor.tsx

Step 4/5: Integration...
✓ Connected to existing auth system
✓ Added to navigation

Step 5/5: Testing...
✓ All components render correctly
✓ API endpoints responding

Phase 3: Enhancement
- Running UI enhancement...
- Optimizing performance...
✓ Enhancements complete

Phase 4: Documentation
✓ Updated README.md
✓ Created docs/features/user-profile.md

✅ Implementation Complete!
Time: 35 minutes (vs ~2 hours manual)
Files created: 8
Tests passing: ✓
Documentation: ✓
```

## Smart Features

### Specification Detection
- Automatically finds specs in `/specs` directory
- Parses requirements from markdown
- Identifies dependencies and constraints

### Progress Persistence
- State saved continuously
- Resume interrupted implementations
- Track completion across sessions

### Intelligent Validation
- Continuous compliance checking
- Early error detection
- Automatic fixes where possible

## Error Recovery
- Checkpoint rollback on failures
- Clear error messages with fixes
- Partial implementation preservation

## Integration
- Works with existing codebase patterns
- Respects VibeSpec rules
- Maintains architectural consistency
- Updates all related systems