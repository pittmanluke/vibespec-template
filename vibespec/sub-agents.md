# Sub-Agents in VibeSpec

This document explains the sub-agent system integrated with VibeSpec projects to accelerate development and maintain quality standards.

## What Are Sub-Agents?

Sub-agents are specialized AI assistants that work alongside Claude Code to handle specific aspects of VibeSpec development. They operate with focused expertise, their own context windows, and specific tool permissions to ensure efficient, high-quality development.

### Key Benefits

- **Automated Quality Control**: Agents proactively enforce VibeSpec standards
- **Specification Alignment**: Prevent drift between specs and implementation
- **Velocity Maintenance**: Keep projects focused on shipping MVPs
- **Context Preservation**: Capture development state for seamless handoffs
- **Agent Design Automation**: Create new specialized agents for your specific needs

## Available Sub-Agents

### 1. spec-guardian

**Purpose**: Ensures implementations match their specifications exactly, preventing the #1 cause of wasted time in AI development - building the wrong thing.

**Activates When**:
- After `/transpose` or `/breakdown` commands
- During implementation when significant changes detected
- On `/session:update` to verify alignment

**What It Does**:
- Loads current specification from `/specs`
- Analyzes recent code changes
- Identifies deviations (added features, missing requirements, UI differences)
- Reports findings by severity (Critical/Warning/Note)

**Example Intervention**:
```
🚨 CRITICAL: Authentication feature detected but not in spec
The current implementation includes user login functionality, but 
the specification at /specs/dashboard-spec.md does not mention 
authentication. Per VibeSpec principles, auth should be added last.

Recommendation: Remove auth code and save for final implementation phase.
```

### 2. velocity

**Purpose**: Prevents feature creep and maintains shipping momentum by enforcing "done is better than perfect."

**Activates When**:
- Multiple rounds of improvements on working code
- Suggestions to "enhance" or "refactor" 
- Architecture discussions for MVP features
- Implementation time exceeds estimates

**What It Does**:
- Monitors for perfectionism patterns
- Checks against original MVP scope
- Intervenes with shipping-focused reminders
- Suggests saving improvements for v2

**Example Intervention**:
```
⚡ VELOCITY CHECK: Working code detected!

You have a functional user dashboard that meets the spec. 
Time invested: 3 hours
Additional features suggested: 5

Recommendation: Ship this version now. Create `/specs/dashboard-v2.md` 
for the excellent enhancement ideas. Real user feedback > imagined features.
```

### 3. compliance

**Purpose**: Enforces the 12 strict VibeSpec rules and architectural patterns without slowing development.

**Activates When**:
- After any code modifications
- Before commits
- File creation or renaming
- Import statements added

**What It Checks**:
- File naming (kebab-case mandatory)
- No test files created
- Import paths use `@/`
- No console.log statements
- Architectural compliance
- Build and lint success

**Example Intervention**:
```
❌ VIBESPEC VIOLATIONS DETECTED:

1. File naming: /components/UserProfile.tsx
   Fix: Rename to user-profile.tsx

2. Import path: import { Button } from '../../../ui/button'
   Fix: import { Button } from '@/components/ui/button'

3. Console.log at line 45 in user-service.ts
   Fix: Remove console.log statement

Run these commands to fix:
- mv components/UserProfile.tsx components/user-profile.tsx
- Update imports as shown above
```

### 4. session-tracker

**Purpose**: Captures comprehensive development state to ensure seamless continuation between sessions and prevent context loss.

**Activates When**:
- `/session:update` command
- Approaching context window limits
- Session ending
- Complex debugging sessions

**What It Captures**:
- Git state (diffs, commits, branch info)
- Task progress from todos
- Key decisions and rationale
- Current working context
- Next steps for resumption

**Example Output**:
```markdown
# Session State: 2025-07-25 16:45

## Git Status
- Branch: feature/user-dashboard
- Modified: 5 files
- Key changes: Added dashboard layout, user stats component

## Completed Tasks
- ✅ Create dashboard layout
- ✅ Implement user statistics display
- ✅ Add responsive design

## In-Progress
- 🔄 Integrating with user service (75% complete)
- Blocked on: Need clarification on stats calculation

## Next Steps
1. Resolve stats calculation approach
2. Complete service integration
3. Test responsive breakpoints
```

### 5. architect

**Purpose**: Designs and creates optimal sub-agent configurations for VibeSpec projects, analyzing tasks for automation opportunities and crafting specialized agents that follow VibeSpec patterns.

**Activates When**:
- Repetitive tasks that could benefit from automation detected
- User explicitly requests agent creation
- Complex workflows need streamlining
- Pattern emerges that matches agent automation use case

**What It Does**:
- Analyzes task requirements and patterns
- Determines if agent automation is appropriate
- Designs agent configurations following VibeSpec principles
- Creates comprehensive system prompts for domain expertise
- Ensures compliance with all VibeSpec rules and patterns

**Example Intervention**:
```
🤖 AGENT AUTOMATION OPPORTUNITY DETECTED

I notice you're frequently validating component naming conventions.
This is a perfect candidate for agent automation.

Let me design a naming-convention-validator agent that can:
- Automatically check file and directory names
- Validate component export patterns
- Suggest corrections following kebab-case rules
- Integrate with your commit workflow

Would you like me to create this agent configuration?
```

### 6. ui-enhancer

**Purpose**: Helps developers effectively and efficiently make edits, changes, and enhancements to UI components in VibeSpec projects. Specializes in React component development, Tailwind CSS v4, accessibility standards, and responsive design patterns.

**Activates When**:
- UI components need modification or improvement
- Accessibility enhancements are required
- Design consistency needs to be ensured across components
- Component styling needs updates
- Responsive design changes are needed
- UI code needs refactoring for better maintainability

**What It Does**:
- Analyzes existing UI components for improvement opportunities
- Identifies accessibility compliance issues (WCAG 2.1 AA)
- Ensures design consistency across components
- Validates Tailwind CSS v4 usage with @theme directive
- Checks CVA (class-variance-authority) pattern implementation
- Provides specific, actionable enhancement recommendations
- Ensures all changes follow VibeSpec standards

**Example Intervention**:
```
🎨 UI ENHANCEMENT ANALYSIS

## Component: ButtonComponent

### Current State
- Missing focus-visible states for keyboard navigation
- Inconsistent spacing with design system
- No loading state variant

### Enhancements

#### 1. Accessibility
**Issue**: No visible focus indicator for keyboard users
**Solution**: Add focus-visible:ring-2 focus-visible:ring-offset-2
**Impact**: Improves keyboard navigation (WCAG 2.1 compliance)

#### 2. Design Consistency
**Issue**: Using px-3 instead of design token
**Solution**: Use px-4 to match system spacing scale
**Impact**: Maintains consistent spacing across all components

### Implementation Priority
1. Critical: Accessibility fix
2. High: Design token consistency
3. Medium: Loading state addition
```

## How Sub-Agents Work

### Automatic Activation

Sub-agents monitor your development activity and activate when their expertise is needed:

1. **Pattern Detection**: Agents watch for specific patterns in code, commands, and conversation
2. **Context Analysis**: They analyze the current situation to determine if intervention would help
3. **Proactive Assistance**: Agents provide guidance before problems become costly

### Manual Invocation

You can explicitly request an agent's help:

```
> Use the spec-guardian to check my implementation
> Have the velocity review our current scope
> Ask the session-tracker to capture current state
```

### Integration with Commands

Sub-agents integrate seamlessly with VibeSpec commands:

| Command | Triggered Agents |
|---------|-----------------|
| `/transpose` | spec-guardian (validates generated spec) |
| `/breakdown` | spec-guardian (checks plan alignment) |
| `/session:update` | session-tracker (captures state) |
| Code changes | compliance (enforces rules) |

## Best Practices

### 1. Trust Agent Interventions

Agents are designed to accelerate development, not hinder it. When an agent intervenes:
- Read their feedback carefully
- Follow their specific recommendations
- Remember they're enforcing proven VibeSpec principles

### 2. Work With Agent Patterns

Structure your workflow to maximize agent effectiveness:
- Start with clear specifications
- Make incremental changes
- Commit frequently
- Update sessions regularly

### 3. Customize When Needed

While agents come pre-configured, you can adjust them:
- Edit agent descriptions for different activation patterns
- Modify system prompts for your team's style
- Add project-specific rules or patterns

## Troubleshooting

### Agent Not Activating

**Problem**: Expected an agent to help but it didn't appear

**Solutions**:
- Check if the agent's description matches your scenario
- Try explicit invocation
- Verify the agent has necessary tool permissions
- Review agent file in `.claude/agents/`

### Too Many Agent Interventions

**Problem**: Agents are activating too frequently

**Solutions**:
- Adjust agent descriptions to be more specific
- Add "only when critical" to intervention patterns
- Temporarily disable agents during experimentation

### Agent Conflicts

**Problem**: Multiple agents providing conflicting advice

**Solutions**:
- Agents are designed to complement each other
- Follow the most specific agent's advice
- spec-guardian takes precedence for spec issues
- compliance takes precedence for code standards

### Session State Issues

**Problem**: Session tracking missing information

**Solutions**:
- Ensure git is initialized in your project
- Check that todos are being tracked
- Verify file paths are correct
- Run `/session:update` more frequently

## Common Workflows with Agents

### Starting a New Feature

1. Create specification in `/specs`
2. Run `/transpose` or `/breakdown`
   - spec-guardian validates output
3. Begin implementation
   - compliance ensures standards
4. Regular `/session:update`
   - session-tracker captures progress
5. When tempted to add "one more thing"
   - velocity keeps you focused

### Resuming After Break

1. Run `/context-prime`
2. Check last session in `.claude/sessions/`
3. session-tracker provides quick-start guide
4. Continue where you left off

### Fixing Violations

1. compliance reports issues
2. Follow specific fix instructions
3. Run validation again
4. Commit when clean

## Agent Development

The sub-agents in VibeSpec are:
- **Project-specific**: Stored in `.claude/agents/`
- **Version controlled**: Check them into your repository
- **Team shareable**: Everyone gets the same development experience
- **Customizable**: Adjust for your project's needs

## Agent Creation

### Using the architect

The **architect** sub-agent helps you create new specialized agents for your project:

1. **Identify Automation Opportunities**
   ```
   "I keep having to check if my API responses match the TypeScript interfaces"
   > The architect can design an api-contract-validator for this
   ```

2. **Request Agent Creation**
   ```
   "Create an agent that ensures all images have alt text"
   > The architect will design an accessibility-checker agent
   ```

3. **Optimize Existing Workflows**
   ```
   "Can we automate checking for unused imports?"
   > The architect will create a code-hygiene agent
   ```

The architect ensures all new agents:
- Follow VibeSpec naming conventions (kebab-case)
- Include proper triggering conditions
- Have comprehensive system prompts
- Integrate with existing workflow
- Respect the 12 strict rules

## Future Enhancements

Potential agents for future development:
- **api-contract-guardian**: Ensures API implementations match their contracts
- **performance-sentinel**: Monitors for performance regressions
- **deps-harmony-keeper**: Manages dependency updates safely
- **database-schema-validator**: Ensures database changes are backward compatible
- **i18n-consistency-checker**: Validates translations and internationalization

Use the architect to design these or any other specialized agents your project needs!

## Summary

Sub-agents transform VibeSpec development by:
1. **Automating quality control** - No manual rule checking
2. **Preventing expensive mistakes** - Catch issues early
3. **Maintaining velocity** - Stay focused on shipping
4. **Preserving context** - Never lose progress

They embody VibeSpec's core philosophy: make the right way the easy way, ship fast, and iterate based on real user feedback.