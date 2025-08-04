# /archive - Project Markdown Archiver

## Description
Archives markdown files from specs/, docs/, and plans/ directories to maintain clean project structure while preserving historical content. Moves files to organized archive/ subdirectories without deleting anything.

## Usage
```
/archive [options]
```

### Options
- `--all` or no option: Archive markdown files from all directories (default)
- `--specs`: Archive only specification files
- `--docs`: Archive only documentation files  
- `--plans`: Archive only planning files

## What Gets Archived
- All `.md` files in the target directories
- **Excludes**: 
  - `README.md` files (preserved in original locations)
  - Files in `specs/examples/` directory (example files remain active)
  - Files already in archive directories

## Archive Structure
Files maintain their directory structure within the archive:
```
docs/workflow-guide.md → archive/docs/workflow-guide.md
docs/deployment/guide.md → archive/docs/deployment/guide.md
plans/roadmap.md → archive/plans/roadmap.md
```

## Features
- **Preserves History**: Creates manifest files tracking what was archived when
- **Safe Operation**: Only moves files, never deletes
- **Clear Reporting**: Shows exactly what was moved where
- **Rollback Info**: Manifest includes original paths for recovery

## Examples
```bash
# Archive everything
/archive

# Archive only documentation
/archive --docs

# Archive specs and plans
/archive --specs --plans
```

## Output
```
📦 Archive Operation Summary
============================

📚 Documentation (5 files archived)
  ✓ workflow-guide.md → archive/docs/workflow-guide.md
  ✓ api-reference.md → archive/docs/api-reference.md
  ...

📋 Plans (3 files archived)
  ✓ q1-roadmap.md → archive/plans/q1-roadmap.md
  ...

Total: 8 files archived successfully
Manifests updated in each archive directory
```

## Integration
- Updates archive manifests with timestamps and file lists
- Works with session-tracker for continuity
- Maintains .gitignore compatibility
- Preserves file permissions and timestamps

## When to Use
- Before major project restructuring
- When docs/plans/specs directories get cluttered
- To preserve historical documentation versions
- During project cleanup phases

## Related
- Agent: `archive-manager`
- Manifests: `archive/*/archive-manifest.md`