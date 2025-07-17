# Plans Directory

This directory contains detailed implementation plans created during development sessions.

## What belongs here?

- **Implementation Plans**: Step-by-step plans for building features
- **Task Breakdowns**: Detailed sub-tasks for complex implementations
- **Technical Approaches**: How to solve specific technical challenges
- **Refactoring Plans**: Strategies for improving existing code
- **Migration Plans**: Steps for updating dependencies or architectures

## What doesn't belong here?

- Feature specifications (use `/specs` instead)
- General documentation (use `/docs` instead)
- Code snippets (use `/examples` instead)
- Meeting notes or brainstorming

## Naming Convention

Use descriptive, action-oriented filenames:
- `implement-user-authentication.md`
- `refactor-api-client.md`
- `migrate-to-typescript.md`
- `optimize-bundle-size.md`

## Plan Template

```markdown
# Plan: [Feature/Task Name]

## Created
Date: YYYY-MM-DD
Session: [session-id if applicable]

## Objective
Clear statement of what this plan aims to accomplish.

## Context
- Related spec: [link to spec]
- Dependencies: [list any prerequisites]
- Estimated time: [rough estimate]

## Implementation Steps

### Phase 1: [Phase Name]
1. [ ] Specific task
2. [ ] Another specific task
   - [ ] Sub-task if needed
   - [ ] Another sub-task

### Phase 2: [Phase Name]
1. [ ] Task
2. [ ] Task

## Testing Strategy
How to verify each phase works correctly.

## Rollback Plan
How to revert if something goes wrong.

## Notes
Any additional considerations or decisions made during planning.
```

## Best Practices

1. **Be Specific**: Vague tasks lead to confusion
2. **Include Context**: Link to relevant specs and docs
3. **Break It Down**: Large tasks should have sub-tasks
4. **Consider Testing**: Include how to verify success
5. **Plan for Failure**: What's the rollback strategy?