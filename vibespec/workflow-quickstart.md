# AI Workflow Quick Reference

*A condensed guide for quick access to commands and workflow steps*

## Quick Start Checklist

### 🚀 New Project Setup
1. Create PRD in external AI tool (Claude Desktop)
2. Export artifacts to `examples/`
3. Initialize Next.js project
4. Enable Claude Code
5. Create initial specs in `specs/`

### 📝 Starting a Work Session
```bash
claude                    # Open Claude CLI
/session:start           # Begin session
/context-prime           # Load project context (activates sub-agents)
# Enter planning mode and create plan
# Save plan to plans/
```

**Active Sub-Agents**: Once you start a session, these agents monitor your work:
- 🎯 **spec-alignment-guardian** - Validates spec compliance
- ⚡ **velocity-guardian** - Prevents feature creep
- ✅ **vibespec-compliance-validator** - Checks code standards
- 💾 **session-state-tracker** - Captures progress
- 📚 **vibespec-docs-harmonizer** - Syncs documentation
- 🤖 **agent-architect** - Identifies automation opportunities
- 🎨 **ui-enhancement-specialist** - Improves UI components

### 🏁 Ending a Work Session
```bash
/session:update          # Track progress (triggers session-state-tracker)
git add . && git commit  # Commit changes (triggers compliance validator)
/session:end            # Close session
```

## Directory Quick Reference

| Directory | Purpose | Example Files |
|-----------|---------|---------------|
| `/docs` | Reference documents | `api-guide.md`, `architecture.md` |
| `/plans` | Task plans | `implement-auth.md`, `refactor-ui.md` |
| `/specs` | Feature specs & PRDs | `prd.md`, `user-profile-spec.md` |
| `/examples` | Code samples | `design-system.tsx`, `api-client.ts` |

## Claude Code Commands

### Essential Commands
```bash
/session:start          # Start development session
/context-prime          # Load project context & activate sub-agents
/session:update         # Update progress (triggers state tracking)
/session:end           # End and document session
/transpose @file        # Convert artifact to PRD (triggers spec guardian)
/breakdown @spec        # Create phased plan (triggers spec guardian)
```

### Planning Commands
- Enter planning mode when prompted
- Exit planning mode to start implementation

## Build Order Reference

1. **Structure** → Set up directories and configs
2. **Types** → Define data models and interfaces
3. **Theme** → Configure design system
4. **Services** → Build core functionality
5. **Features** → Implement user-facing features

## Workflow Steps

### Feature Implementation Flow
```
1. Read spec from /specs
2. Create plan in /plans
3. Enter planning mode
4. Build incrementally
5. Test manually
6. Update session
7. Commit changes
```

### Quick Git Commands
```bash
# Feature branch
git checkout -b feature/user-profile

# Stage and commit
git add .
git commit -m "feat: add user profile"

# Push changes
git push origin feature/user-profile
```

## Best Practices Reminders

### ✅ DO
- Plan before coding
- Test after each component
- Commit frequently
- Document decisions
- Update session regularly

### ❌ DON'T
- Skip planning phase
- Build multiple features at once
- Leave sessions open
- Forget to test
- Ignore failing builds

## Common Patterns

### Creating a New Feature
1. `specs/feature-name.md` - Write specification
2. `/session:start` - Begin work session
3. `plans/implement-feature-name.md` - Create plan
4. Build → Test → Commit → Repeat
5. `/session:end` - Close session

### Debugging Workflow
1. `/context-prime` - Ensure full context
2. Reference error in planning mode
3. Create fix plan
4. Implement → Test → Verify
5. Document solution

## Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| AI lacks context | Run `/context-prime` |
| Lost track of tasks | Check `plans/` directory |
| Unsure of spec | Review `specs/` directory |
| Need examples | Check `examples/` directory |

## File Naming Conventions

- **Specs**: `feature-name-spec.md`
- **Plans**: `implement-feature-name.md`
- **Docs**: `topic-guide.md`
- **Examples**: `component-example.tsx`

## Session History

Find previous sessions in:
```
.claude/sessions/
```

## Need More Detail?

See the full guide: [AI Workflow Guide](./ai-workflow-guide.md)