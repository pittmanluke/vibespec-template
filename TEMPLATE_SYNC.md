# Template Synchronization Guide

## Overview

This repository (vibespec-landing) uses the vibespec-template as its foundation through a git submodule. This document explains how to manage updates and synchronization between the template and this landing page.

## Current Status

- **Template Version**: 1.0.0 (pending initial setup)
- **Last Sync Date**: 2025-07-30
- **Sync Method**: Git Submodule
- **Customization Level**: High (landing-specific features)

## Repository Structure

```
vibespec-landing/
├── template-core/        # Git submodule pointing to vibespec-template
├── src/
│   ├── components/
│   │   ├── landing/     # Landing-specific components (DO NOT sync)
│   │   └── overrides/   # Template component overrides
│   └── app/
│       ├── roadmap/     # Landing-specific feature
│       └── (other)/     # Mix of template and custom
├── .template-version    # Tracks template version
├── .sync/              # Sync metadata and history
└── sync-scripts/       # Automation scripts
```

## Customizations That Should NOT Be Synced

The following are landing-specific and should never be overwritten by template updates:

### Components
- `/src/components/landing/*` - All marketing components
- `/src/app/roadmap/*` - Roadmap feature
- Analytics integration (removed from template)
- SEO optimizations specific to vibespec.dev

### Configuration
- Production environment variables
- Deployment configurations
- Marketing-specific metadata

## Update Process

### 1. Check for Updates

```bash
# Check if template has updates
cd template-core
git fetch origin
git status

# Or use the sync agent
claude-code
> /sync:check
```

### 2. Review Changes

```bash
# See what changed
git log --oneline HEAD..origin/main
git diff HEAD..origin/main

# Or use sync agent for detailed analysis
> /sync:analyze origin/main
```

### 3. Apply Updates

#### Option A: Update Entire Submodule
```bash
cd template-core
git pull origin main
cd ..
git add template-core
git commit -m "Update template to latest version"
```

#### Option B: Selective Updates (Recommended)
```bash
# Use sync agent for selective updates
> /sync:apply components/ui
> /sync:skip components/admin
> /sync:apply hooks --except use-analytics
```

### 4. Handle Conflicts

If there are conflicts with your customizations:

```bash
# The sync agent will detect conflicts
> /sync:conflicts

# Review and resolve manually
> /sync:resolve components/header --keep-custom
```

### 5. Test Integration

```bash
# Run tests
npm run build
npm run lint
npm run typecheck

# Test specific features
npm run test:integration
```

### 6. Document the Sync

```bash
# Update tracking
> /sync:complete v1.1.0

# This updates .template-version and .sync/history.json
```

## Common Scenarios

### Scenario 1: Bug Fix in Template

Template fixes a bug in Button component:
```bash
> /sync:check
# Shows: Bug fix available in Button component

> /sync:apply components/ui/button
# Applies just the button fix

> npm run build
# Verify it works
```

### Scenario 2: New Feature in Template

Template adds a new DataTable component:
```bash
> /sync:analyze
# Shows: New component available: DataTable

# Decide if you need it
> /sync:apply components/ui/data-table
# OR
> /sync:skip components/ui/data-table --reason "Not needed for landing page"
```

### Scenario 3: Breaking Change

Template makes breaking changes:
```bash
> /sync:analyze v2.0.0
# Shows: BREAKING: Button 'color' prop renamed to 'variant'

> /sync:migrate button-color-to-variant
# Runs migration script

> /sync:apply components/ui/button
# Applies the update after migration
```

## Best Practices

1. **Regular Sync Checks**: Run `/sync:check` weekly
2. **Document Skips**: Always provide reasons when skipping updates
3. **Test Thoroughly**: Never sync without running tests
4. **Incremental Updates**: Apply updates component by component
5. **Keep History**: The .sync directory tracks all decisions

## Troubleshooting

### Submodule Issues

```bash
# If submodule is not initialized
git submodule update --init --recursive

# If submodule is detached
cd template-core
git checkout main
git pull origin main
```

### Sync Agent Issues

```bash
# Reset sync state
> /sync:reset

# Force re-analysis
> /sync:analyze --force

# View sync history
> /sync:history
```

### Build Errors After Sync

1. Check for missing imports
2. Verify override paths are correct
3. Run type checking: `npm run typecheck`
4. Check for API changes in CHANGELOG.md

## Emergency Rollback

If a sync causes major issues:

```bash
# Rollback submodule
cd template-core
git checkout <previous-commit>
cd ..
git add template-core
git commit -m "Rollback template to previous version"

# Update tracking
echo "ROLLBACK_REQUIRED=true" >> .template-version
```

## Contact & Support

- **Template Issues**: Create issue in vibespec-template repo
- **Sync Issues**: Create issue in this repo with [SYNC] tag
- **Questions**: Check template CHANGELOG.md first

## Appendix: Sync Metadata Structure

### .template-version
```
TEMPLATE_VERSION=1.0.0
TEMPLATE_COMMIT=abc123def
LAST_SYNC_DATE=2025-07-30
SYNC_STATUS=complete
```

### .sync/history.json
```json
{
  "syncHistory": [
    {
      "date": "2025-07-30",
      "fromVersion": "1.0.0",
      "toVersion": "1.1.0",
      "applied": ["components/ui/button"],
      "skipped": ["components/admin"],
      "conflicts": [],
      "notes": "Initial sync setup"
    }
  ]
}
```