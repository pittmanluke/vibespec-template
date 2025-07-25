# AI-Assisted Development Workflow Guide

*A comprehensive guide to building applications efficiently with AI tools throughout the entire development lifecycle*

## Overview

This guide documents a battle-tested workflow for building applications with AI assistance, from initial ideation through implementation. It emphasizes thorough planning, systematic execution, and proper documentation at every stage.

### Sub-Agents Integration

VibeSpec includes specialized sub-agents that automatically assist during development:
- **spec-alignment-guardian**: Validates implementations match specifications
- **velocity-guardian**: Prevents feature creep and maintains momentum
- **vibespec-compliance-validator**: Enforces coding standards and conventions
- **session-state-tracker**: Captures development state for seamless handoffs
- **vibespec-docs-harmonizer**: Keeps documentation synchronized

These agents activate automatically at key points in your workflow or can be invoked manually. See `/vibespec/sub-agents.md` for detailed information.

## Workflow Phases

### 1. External Planning Phase

Before writing any code, invest time in thorough planning using AI tools like Claude Desktop:

#### Research & Ideation
- **Deep Context Gathering**: Research existing solutions, understand the problem space
- **Problem Definition**: Work with AI to clearly articulate what problem you're solving and why
- **Solution Alignment**: Iterate with the AI until both parties fully understand the vision

#### Prototyping
- **Interactive Exploration**: Use Claude's artifact feature to build basic React prototypes
- **Rapid Iteration**: Test different UI/UX approaches quickly
- **Export Artifacts**: Save promising prototypes as `.tsx` files for reference

#### Documentation Creation
- **PRD Development**: Create a detailed Product Requirements Document
- **Iterative Refinement**: Review and refine until the specification is comprehensive
- **Phase Breakdown**: Work with AI to divide the project into manageable build phases

### 2. IDE Workflow

Once you have a clear plan, move into your development environment:

#### Session Management Process

1. **Start Session**
   ```bash
   claude
   /session:start
   ```

2. **Prime Context**
   ```bash
   /context-prime
   ```
   *Note: Sub-agents will now monitor your development activity*

3. **Planning Mode**
   - Enter planning mode to discuss approach
   - Align on implementation strategy
   - Create detailed plan documentation

4. **Document the Plan**
   - Save detailed plan to `plans/` directory
   - Include task breakdowns and sub-tasks
   - Reference relevant specs from `specs/`

5. **Execute & Track**
   ```bash
   /session:update  # After significant progress (triggers session-state-tracker)
   git commit       # Regular commits (triggers vibespec-compliance-validator)
   ```

6. **Close Session**
   ```bash
   /session:end     # When task is complete
   ```

### 3. Build Order

Follow this systematic approach for building features:

1. **Basic Core File Structure**
   - Set up directory organization
   - Configure build tools
   - Establish naming conventions

2. **Data Types**
   - Define TypeScript interfaces
   - Create type definitions
   - Set up data models

3. **Theme**
   - Configure design system
   - Set up color schemes
   - Define spacing and typography

4. **Core Services/APIs**
   - Build service layers
   - Set up API integrations
   - Create utility functions

5. **Features**
   - Implement features one by one
   - Manual testing after each feature
   - Progressive enhancement

## Directory Structure & Purpose

### `/docs`
**Purpose**: Reference documents for your project
- API documentation
- Architecture decisions
- Third-party service guides
- Research findings

### `/plans`
**Purpose**: Detailed task plans created during development
- Implementation plans from planning sessions
- Task breakdowns
- Technical approach documents
- Decision rationales

### `/specs`
**Purpose**: Feature specifications and requirements
- Master PRD (Product Requirements Document)
- Individual feature specs
- User stories
- Acceptance criteria

### `/examples`
**Purpose**: Example files and code samples
- Exported Claude artifacts
- Reference implementations
- Code snippets
- UI component examples

## Best Practices

### Planning
- **Never skip the planning phase** - It saves time in the long run
- **Get specific** - Vague requirements lead to wasted effort
- **Document decisions** - Your future self will thank you

### Development
- **One feature at a time** - Complete and test before moving on
- **Manual testing** - Verify each component works as expected
- **Regular commits** - Small, focused changes are easier to debug

### Documentation
- **Write as you go** - Don't leave it for "later"
- **Be detailed** - Assume no context when writing docs
- **Update regularly** - Keep specs aligned with implementation

## Quick Command Reference

### Claude Code Commands
```bash
/session:start       # Begin a new development session
/context-prime       # Load project context
/session:update      # Track progress
/session:end         # Close and document session
```

### Git Workflow
```bash
git add .
git commit -m "feat: implement user authentication"
git push origin main
```

## Tips for Success

1. **Context is King**: Always ensure AI has full context before starting work
2. **Plan in Detail**: Break large tasks into small, manageable pieces
3. **Test Often**: Manual testing catches issues early
4. **Document Everything**: Your future self (and team) will appreciate it
5. **Use Examples**: Reference implementations speed up development

## Example Workflow

Here's a typical workflow for adding a new feature:

1. **Review PRD** in `specs/product-requirements.md`
2. **Create feature spec** in `specs/feature-user-profile.md`
3. **Start Claude session** and load context
4. **Create implementation plan** in `plans/implement-user-profile.md`
5. **Build incrementally** following the plan
6. **Test thoroughly** after each component
7. **Update session** with progress
8. **Commit changes** with clear messages
9. **End session** with summary

## Troubleshooting

### Common Issues

**AI lacks context**
- Solution: Run `/context-prime` and reference specific docs

**Plan too vague**
- Solution: Break down further in planning mode

**Feature scope creep**
- Solution: Refer back to original spec, stay focused

**Lost track of progress**
- Solution: Check session history in `.claude/sessions/`

## Conclusion

This workflow emphasizes preparation, systematic execution, and comprehensive documentation. By following these practices, you can build complex applications efficiently while maintaining code quality and project clarity.

Remember: The time invested in planning and documentation pays dividends throughout the development process and beyond.