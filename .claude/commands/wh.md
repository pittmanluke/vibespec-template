# /wh - Workflow Help

**Shortcut for**: `/workflow:help`

## Description
Shows all available workflow commands with quick descriptions and usage examples.

## Usage
```
/wh
```

## Output
When you run `/wh`, Claude will display:

```
📚 Workflow Commands

Quick Shortcuts:
  /wr              - Workflow Review: Parallel code review (30-45s)
  /wv              - Workflow Validate: Pre-commit checks with early termination
  /wi [feature]    - Workflow Implement: Guided feature implementation
  /wh              - Workflow Help: Show this help
  /wl              - Workflow List: List all workflows with details

Full Commands:
  /workflow:review      - Comprehensive parallel code review
  /workflow:validate    - Pre-commit validation pipeline
  /workflow:implement   - Structured feature implementation
  /workflow:help        - Detailed workflow documentation
  /workflow:list        - Complete workflow catalog

VibeSpec Commands:
  /vibespec:health      - Project health dashboard
  /vibespec:velocity    - Development pace analysis
  /vibespec:sync-specs  - Specification alignment check

Quick Examples:
  /wr                   # Review recent changes
  /wv                   # Validate before commit
  /wi user-auth         # Implement user authentication
  /vibespec:health      # Check project health

For detailed help on any command, use: /[command] --help
```

## Features
- Organized by command type
- Shows both shortcuts and full commands
- Includes quick usage examples
- Links to detailed documentation

## Integration
- Always up-to-date with available commands
- Discovers new workflows automatically
- Respects user permissions
- Provides contextual help