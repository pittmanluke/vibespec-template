# Claude Commands

This document details the custom Claude commands available in VibeSpec projects for workflow automation.

## Sub-Agents Integration

VibeSpec commands work seamlessly with specialized sub-agents that provide automated assistance:

| Sub-Agent | Purpose | Activates |
|-----------|---------|----------|
| **spec-alignment-guardian** | Validates code matches specifications | After `/transpose`, `/breakdown`, during implementation |
| **velocity-guardian** | Prevents feature creep | When perfectionism detected, scope expansion |
| **vibespec-compliance-validator** | Enforces coding standards | After code changes, before commits |
| **session-state-tracker** | Captures development state | During `/session:update`, session end |
| **vibespec-docs-harmonizer** | Maintains documentation sync | When agents/commands/architecture change |

For detailed information about sub-agents, see `/vibespec/sub-agents.md`.

## Available Commands

### Core Commands

#### `/context-prime`
Load project context and understand structure.

```bash
/context-prime
```

**What it does:**
- Reads key documentation files
- Analyzes project structure
- Loads architectural patterns
- Prepares AI for development

**When to use:**
- Starting a new conversation
- After major project changes
- When context seems lost

#### `/session:start`
Begin a tracked development session.

```bash
/session:start
/session:start feature-name
```

**What it does:**
- Creates session file in `.claude/sessions/`
- Tracks start time
- Sets up progress tracking
- Prompts for session goals

**When to use:**
- Beginning focused work
- Starting a new feature
- Complex multi-step tasks

#### `/session:update`
Track progress during development.

```bash
/session:update
```

**What it does:**
- Updates current session file
- Documents completed work
- Notes any blockers
- Captures decisions made
- **Triggers session-state-tracker** for comprehensive state capture

**When to use:**
- After completing subtasks
- Before context window fills
- At natural break points

#### `/session:end`
Close and document session.

```bash
/session:end
```

**What it does:**
- Finalizes session documentation
- Summarizes accomplishments
- Notes next steps
- Archives session

**When to use:**
- Feature complete
- End of work period
- Switching contexts

### Specification Commands

#### `/transpose`
Convert artifact files to template-compliant PRDs.

```bash
/transpose @examples/dashboard-mockup.tsx
```

**What it does:**
- Analyzes TSX artifact file
- Extracts functionality and patterns
- Maps to template architecture
- Generates specification document
- **Triggers spec-alignment-guardian** to validate output

**Output:**
- `/specs/transposed-[feature].md` - Full PRD
- `/plans/implement-[feature].md` - Implementation plan

**When to use:**
- Have UI mockup from Claude Desktop
- Need to implement existing design
- Converting prototypes to specs

#### `/breakdown`
Break external PRDs into phased implementation specs.

```bash
/breakdown @specs/user-authentication.md
```

**What it does:**
- Analyzes requirements document
- Creates phased implementation plan
- Identifies dependencies
- Estimates complexity
- **Triggers spec-alignment-guardian** to check alignment

**Output:**
- `/plans/phase-1-[feature].md`
- `/plans/phase-2-[feature].md`
- etc.

**When to use:**
- Have detailed requirements
- Need step-by-step plan
- Complex features requiring phases

#### `/adapt` (New)
Adapt CLAUDE.md and README.md to specific project.

```bash
/adapt
```

**What it does:**
- Analyzes existing specifications
- Gathers project information
- Generates project-specific docs
- Maintains template references

**When to use:**
- After initial specs created
- Project identity established
- Ready to customize docs

### Session Management Commands

#### `/session:list`
List all development sessions.

```bash
/session:list
```

Shows:
- Session names
- Start/end times
- Current status
- Brief summary

#### `/session:current`
Show current active session.

```bash
/session:current
```

Displays:
- Session name
- Duration
- Current goals
- Recent updates

#### `/session:help`
Get help with session commands.

```bash
/session:help
```

## Workflow Integration with Sub-Agents

Sub-agents enhance the command workflow by providing automated quality control:

1. **Specification Commands** (`/transpose`, `/breakdown`)
   - spec-alignment-guardian validates output
   - Ensures specifications are complete and accurate

2. **Session Commands** (`/session:*`)
   - session-state-tracker captures comprehensive state
   - Enables seamless handoffs between sessions

3. **During Implementation**
   - vibespec-compliance-validator checks code standards
   - velocity-guardian prevents scope creep
   - spec-alignment-guardian ensures spec adherence

### Typical Development Flow

1. **Start New Feature**
   ```bash
   /context-prime
   /session:start user-dashboard
   ```

2. **Convert Design to Spec**
   ```bash
   /transpose @examples/dashboard-design.tsx
   ```

3. **Implement Feature**
   - AI uses generated spec
   - Builds according to plan
   - Updates session progress

4. **Track Progress**
   ```bash
   /session:update
   # Added dashboard components
   # Integrated with auth service
   ```

5. **Complete Feature**
   ```bash
   /session:end
   git commit -m "feat: add user dashboard"
   ```

### Complex Feature Flow

1. **Break Down Requirements**
   ```bash
   /breakdown @specs/marketplace-feature.md
   ```

2. **Implement Phase 1**
   ```bash
   /session:start marketplace-phase-1
   # Work on phase 1 tasks
   /session:update
   ```

3. **Continue Phases**
   ```bash
   /session:end
   /session:start marketplace-phase-2
   # Continue implementation
   ```

## Command Details

### Context Prime Deep Dive

The `/context-prime` command loads:

1. **Project Documentation**
   - README.md
   - CLAUDE.md
   - Architecture guides

2. **Project Structure**
   - Directory organization
   - File naming patterns
   - Import conventions

3. **Technical Context**
   - Tech stack details
   - Feature flags
   - Development patterns

4. **Workflow Guides**
   - AI development guide
   - Workflow quickstart
   - Command references

### Transpose Deep Dive

The `/transpose` command performs:

1. **Deep Analysis**
   - Component structure
   - State management
   - UI patterns
   - Data flow

2. **Template Mapping**
   - Maps to shadcn/ui components
   - Identifies service needs
   - Plans file structure

3. **PRD Generation**
   - Comprehensive specification
   - User stories
   - Technical requirements
   - Implementation phases

4. **Planning Output**
   - Step-by-step tasks
   - Dependency order
   - Complexity estimates

### Breakdown Deep Dive

The `/breakdown` command creates:

1. **Phased Approach**
   - Logical feature chunks
   - Dependency ordering
   - Risk mitigation

2. **Detailed Tasks**
   - Specific implementation steps
   - File locations
   - Code patterns

3. **Validation Criteria**
   - Acceptance tests
   - Success metrics
   - Quality checks

## Best Practices

### Session Management

1. **Start Sessions for Focused Work**
   - Don't use for quick fixes
   - Name sessions descriptively
   - Set clear goals

2. **Update Regularly**
   - Every 30-60 minutes
   - At major milestones
   - Before breaking

3. **End Sessions Cleanly**
   - Summarize accomplishments
   - Note any blockers
   - Plan next steps

### Specification Usage

1. **Always Start with Specs**
   - Use `/transpose` for designs
   - Use `/breakdown` for requirements
   - Reference during implementation

2. **Keep Specs Updated**
   - Modify if requirements change
   - Note deviations
   - Document decisions

3. **Follow Spec Structure**
   - Don't skip sections
   - Be thorough
   - Think about edge cases

### Context Management

1. **Prime When Needed**
   - New conversations
   - After long breaks
   - When switching features

2. **Don't Over-Prime**
   - Once per conversation usually enough
   - Not needed for minor tasks
   - Trust AI memory

## Troubleshooting

### Command Not Working

1. **Check Command Syntax**
   ```bash
   /transpose @examples/file.tsx  # Correct
   /transpose examples/file.tsx   # Missing @
   ```

2. **Verify File Exists**
   - Commands need valid file paths
   - Use @ for file references
   - Check file location

3. **Review Error Messages**
   - Commands provide helpful errors
   - Follow suggestions
   - Ask for clarification

### Session Issues

1. **Lost Session**
   - Check `.claude/sessions/`
   - Use `/session:list`
   - Start new if needed

2. **Can't Update**
   - Ensure session is active
   - Check file permissions
   - Start fresh session

### Specification Problems

1. **Poor Transpose Results**
   - Ensure artifact is complete
   - Add more detail to mockup
   - Manual adjustments OK

2. **Breakdown Too Complex**
   - Split into smaller docs
   - Focus on MVP first
   - Iterate on phases

## Advanced Usage

### Chaining Commands

```bash
# Full feature flow
/context-prime
/session:start new-feature
/transpose @examples/feature.tsx
# AI implements based on spec
/session:update
/session:end
```

### Custom Workflows

Create your own workflow patterns:

```bash
# Design-first workflow
/transpose @examples/design.tsx
/breakdown @specs/transposed-design.md
/session:start implement-design

# Spec-first workflow  
/breakdown @specs/requirements.md
/session:start phase-1
# Implement phase 1
/session:end
/session:start phase-2
```

### Team Collaboration

Share context across team:

```bash
# Developer A
/session:start feature-x
/session:update  # Documents progress
/session:end

# Developer B  
/context-prime
/session:list  # See what's been done
# Continue where A left off
```

## Summary

Claude commands in VibeSpec:
- **Streamline development** workflow
- **Maintain context** across sessions
- **Generate specifications** from artifacts
- **Track progress** systematically
- **Ensure consistency** in implementation

Use these commands to maximize productivity and maintain high-quality development standards.