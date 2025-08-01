# Claude Code Commands Reference

This guide covers all Claude Code commands available in VibeSpec, their usage, and best practices.

**Note**: VibeSpec commands integrate with specialized sub-agents that provide automated assistance. See [Sub-Agents Guide](./sub-agents.md) for details on how agents enhance your workflow.

## Core Commands

### `/context-prime`

**Purpose**: Load your project structure and context into Claude's memory.

**When to use**:
- At the start of every new conversation
- After hitting context window limits
- When switching between features

**Usage**:
```bash
claude
> /context-prime
```

**What it does**:
1. Loads project file structure
2. Reads CLAUDE.md instructions
3. Understands your conventions
4. Prepares for accurate code generation
5. Activates sub-agents for monitoring

**Best practices**:
- Always run first in new conversations
- Run after major refactoring
- Use before asking complex questions

---

### `/session:start`

**Purpose**: Begin a tracked development session for complex features.

**When to use**:
- Starting work on a new feature
- Beginning a multi-step task
- When you need progress tracking

**Sub-agent integration**:
- Enables session-tracker for automatic progress capture
- Activates all monitoring agents:
  - spec-guardian
  - velocity
  - compliance
  - docs-sync
  - architect

**Usage**:
```bash
> /session:start [session-name]

# Examples:
> /session:start user-authentication
> /session:start payment-integration
> /session:start ui-refactor
```

**What it does**:
1. Creates session file in `.claude/sessions/`
2. Tracks goals and progress
3. Maintains context across conversations
4. Documents your work

**Session file structure**:
```markdown
# Session: User Authentication
*Started: 2024-01-15 14:30*

## Goals
- [ ] Implement login page
- [ ] Add signup flow
- [ ] Create password reset

## Progress
### 14:30 - Session Started
- Created session file
- Planning authentication approach
```

---

### `/session:update`

**Purpose**: Save progress checkpoint during development.

**When to use**:
- After completing significant work
- Before switching to another task
- When approaching context limits
- After solving complex problems

**Usage**:
```bash
> /session:update

# Or with notes:
> /session:update Completed login UI, starting on API integration
```

**What it captures**:
- Current timestamp
- Git changes summary
- Todo list progress
- Implementation details
- Problems encountered

**Example update**:
```markdown
### Update - 2024-01-15 15:45

**Summary**: Implemented login page UI

**Git Changes**:
- Added: app/login/page.tsx
- Modified: components/ui/form.tsx
- Current branch: main (commit: abc123)

**Todo Progress**: 2 completed, 1 in progress
- ✓ Create login form component
- ✓ Add validation
- ⚡ Working on API integration

**Details**: Built responsive login form with email/password validation. Using react-hook-form with zod schemas.
```

---

### `/session:end`

**Purpose**: Close session with comprehensive summary.

**When to use**:
- Feature is complete
- Pausing work for extended time
- Handing off to another developer

**Usage**:
```bash
> /session:end
```

**What it generates**:
- Session duration
- Complete git diff summary
- All completed tasks
- Lessons learned
- Next steps

---

### `/transpose`

**Purpose**: Transform visual designs into detailed specifications.

**When to use**:
- You have UI mockups
- Converting Figma designs
- Documenting existing components

**Usage**:
```bash
> /transpose @examples/dashboard-mockup.tsx
> /transpose @examples/user-profile.tsx
```

**Input format**:
```tsx
// examples/feature-mockup.tsx
export default function FeatureMockup() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Feature Title</h1>
      {/* Your complete UI design */}
    </div>
  );
}
```

**Output**:
Creates `specs/feature-specification.md` with:
- Component breakdown
- Props and state
- Styling details
- Behavior descriptions
- Technical requirements

---

### `/breakdown`

**Purpose**: Convert requirements into phased implementation plans.

**When to use**:
- You have written requirements
- Starting from user stories
- Planning complex features

**Usage**:
```bash
> /breakdown @specs/payment-integration.md
> /breakdown @specs/user-stories.md
```

**Input format**:
```markdown
# Feature Requirements

## Overview
Users need to manage their subscriptions...

## User Stories
- As a user, I want to upgrade my plan
- As a user, I want to cancel anytime
- As an admin, I want to see revenue

## Requirements
- Stripe integration
- Webhook handling
- Invoice generation
```

**Output**:
Creates `plans/implement-feature.md` with:
- Phased approach (Phase 1, 2, 3...)
- Task breakdowns
- Dependencies
- Time estimates
- Risk considerations

---

## Workflow Commands

### `/compact`

**Purpose**: Reduce conversation context by hiding previous messages.

**When to use**:
- Long conversations
- Approaching context limits
- Need to focus on current task

**Usage**:
```bash
> /compact
```

---

### `/planning-crucible`

**Purpose**: Structured planning mode for complex features.

**When to use**:
- Starting large features
- Need systematic approach
- Multiple implementation paths

**Usage**:
```bash
> /planning-crucible authentication-system
```

**Process**:
1. Project understanding
2. Requirements analysis
3. Key decisions
4. Implementation approach
5. Final recommendations

---

## Custom Project Commands

### `/project:new-component`

**Purpose**: Scaffold new components with proper structure.

**Usage**:
```bash
> /project:new-component UserCard
```

**Creates**:
```
components/features/user-card/
├── user-card.tsx
├── user-card.types.ts
└── index.ts
```

---

### `/project:add-page`

**Purpose**: Create new pages with proper routing.

**Usage**:
```bash
> /project:add-page dashboard/analytics
```

**Creates**:
```
app/dashboard/analytics/
├── page.tsx
├── layout.tsx (if needed)
└── loading.tsx
```

---

## Best Practices

### Command Combinations

**Starting a new feature**:
```bash
> /context-prime
> /session:start feature-name
> /transpose @examples/feature.tsx
# AI builds based on specification
> /session:update
```

**Resuming work**:
```bash
> /context-prime
> /session:update
# Continue where you left off
```

**Planning complex features**:
```bash
> /context-prime
> /planning-crucible feature-name
> /breakdown @specs/requirements.md
> /session:start feature-name
```

### Context Management

**Prevent context overflow**:
```bash
# Regular updates
> /session:update     # Every 30-60 minutes

# New conversation
> /context-prime      # Reload context
> /session:update     # AI knows where you left off
```

### Specification Workflow

**Design-first approach**:
```bash
1. Create mockup in examples/
2. > /transpose @examples/mockup.tsx
3. Review generated spec
4. Let AI build from spec
```

**Requirements-first approach**:
```bash
1. Write requirements in specs/
2. > /breakdown @specs/requirements.md
3. Follow phased plan
4. > /session:update after each phase
```

## Troubleshooting

### "Command not found"
- Ensure you're in a VibeSpec project
- Check `.claude/commands/` exists
- Run `/context-prime` first

### "Can't read file"
- Use @ prefix for file references
- Ensure file exists
- Use relative paths from project root

### "Session not found"
- Check `.claude/sessions/.current-session`
- Start new session with `/session:start`

### "Specification not generated"
- Ensure mockup is complete
- Include all UI states
- Add comments for complex behavior

## Command Shortcuts

While not built-in, you can create aliases:

```bash
# In your shell config
alias prime="echo '/context-prime' | claude"
alias session="echo '/session:start' | claude"
alias update="echo '/session:update' | claude"
```

## Advanced Usage

### Chaining Commands
```bash
> /context-prime && /session:start feature && /transpose @examples/feature.tsx
```

### Command Arguments
```bash
> /session:update "Completed API integration, all tests passing"
> /breakdown @specs/feature.md --phases 5
```

### Custom Commands
Add your own in `.claude/commands/`:
```markdown
# .claude/commands/test-all.md
Run all tests and report results:
- Unit tests: `npm test`
- Integration: `npm run test:integration`
- E2E: `npm run test:e2e`
```

## Quick Reference

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `/context-prime` | Load project context | Start of conversation |
| `/session:start` | Begin tracked session | New feature work |
| `/session:update` | Checkpoint progress | Regular intervals |
| `/session:end` | Close with summary | Feature complete |
| `/transpose` | Design → Spec | Have mockups |
| `/breakdown` | Requirements → Plan | Have written requirements |
| `/compact` | Reduce context | Long conversations |

## Getting Help

- Check command output for errors
- Review generated files
- Ensure proper file structure
- Ask Claude for clarification

Remember: Commands are tools to enhance your workflow. Use them to maintain context, track progress, and ensure AI builds exactly what you need!