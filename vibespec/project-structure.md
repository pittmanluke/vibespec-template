# Project Structure

This document defines the file organization and directory structure for VibeSpec projects.

## Directory Structure

```
src/
├── app/           # Next.js pages ONLY
├── components/    # Reusable UI components
├── config/        # App configuration
├── hooks/         # Custom React hooks
├── lib/           # Utilities and core libraries
├── providers/     # ALL context providers
├── services/      # Business logic and APIs
└── types/         # TypeScript definitions

Project root:
├── docs/          # Reference documents
├── examples/      # Example files and artifacts
├── plans/         # Implementation plans
├── specs/         # Feature specifications and PRDs
├── vibespec/      # VibeSpec template documentation
└── .claude/       # Claude-specific configuration and commands
```

## Directory Guidelines

### `/src/app/`
- **Purpose**: Next.js App Router pages ONLY
- **Rules**: 
  - Only page.tsx, layout.tsx, and route handlers
  - No business logic or components
  - Use folders for route segments
  - Follow Next.js 15 conventions

### `/src/components/`
- **Purpose**: All React components
- **Structure**:
  - `/ui/` - Base UI primitives (buttons, inputs, etc.)
  - `/[feature]/` - Feature-specific components
- **Rules**:
  - One component per file
  - Include related styles and types
  - Export from index files when appropriate

### `/src/services/`
- **Purpose**: Business logic and API integrations
- **Structure**:
  - Organized by domain (auth, user, etc.)
  - Include mock implementations
  - Use feature flags for toggling
- **Example**: `services/auth/auth-service.ts`

### `/src/providers/`
- **Purpose**: React Context providers
- **Rules**:
  - All providers in one location
  - Export from index if needed
  - Document provider purpose

### `/src/lib/`
- **Purpose**: Utilities and helpers
- **Structure**:
  - Pure functions
  - No React dependencies
  - Reusable across projects

### `/src/types/`
- **Purpose**: TypeScript type definitions
- **Structure**:
  - Domain-based files
  - Shared types in `common.ts`
  - Export from `index.ts`

### `/src/config/`
- **Purpose**: Application configuration
- **Contents**:
  - Environment variables
  - Feature flags
  - Constants

### `/src/hooks/`
- **Purpose**: Custom React hooks
- **Rules**:
  - Start with 'use' prefix
  - Document hook purpose
  - Include usage examples

## Root-Level Directories

### `/specs/`
- Feature specifications and PRDs
- Source of truth for features
- Used by AI for implementation

### `/plans/`
- Implementation plans
- Created by `/breakdown` command
- Track development progress

### `/examples/`
- UI mockups and examples
- Input for `/transpose` command
- Reference implementations

### `/docs/`
- Additional documentation
- Architecture decisions
- API documentation

### `/.claude/`
- Claude Code configuration
- Custom commands
- Session management

### `/vibespec/`
- Template documentation
- Guidelines and rules
- Reference materials

## Import Path Conventions

### Use Absolute Imports
```typescript
// ✅ Good
import { Button } from '@/components/ui/button'
import { authService } from '@/services/auth'
import { User } from '@/types/user'

// ❌ Bad
import { Button } from '../../../components/ui/button'
import { authService } from './services/auth'
```

### Import Order
1. External packages
2. Internal aliases (@/)
3. Relative imports (if necessary)
4. Types

```typescript
// Example
import React from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { authService } from '@/services/auth'

import type { User } from '@/types/user'
```

## File Organization Rules

1. **Group by Feature**: Keep related files together
2. **Shallow Nesting**: Avoid deep directory structures
3. **Clear Naming**: File names should describe content
4. **Consistent Structure**: Follow patterns across features
5. **Index Files**: Use for clean exports when beneficial

## Common Patterns

### Service Pattern
```
services/
└── auth/
    ├── auth-service.ts        # Main service
    ├── mock/
    │   └── mock-auth-service.ts
    ├── types.ts              # Service-specific types
    └── index.ts              # Clean exports
```

### Component Pattern
```
components/
└── user-profile/
    ├── user-profile.tsx      # Main component
    ├── user-avatar.tsx       # Sub-component
    ├── types.ts             # Component types
    └── index.ts             # Exports
```

### Feature Pattern
```
app/
└── dashboard/
    ├── page.tsx             # Page component
    ├── layout.tsx           # Layout wrapper
    └── loading.tsx          # Loading state
```

## Anti-Patterns to Avoid

1. **Business logic in `/app`**: Keep pages thin
2. **Components in `/app`**: Use `/components` instead
3. **Deep nesting**: Maximum 3-4 levels
4. **Circular dependencies**: Use proper layering
5. **Mixed concerns**: Separate UI from logic

## Adding New Features

When adding a new feature:

1. Start with a specification in `/specs/`
2. Create necessary types in `/types/`
3. Implement services in `/services/`
4. Build components in `/components/`
5. Add pages in `/app/`
6. Update documentation

## File Naming Conventions

See [Naming Conventions](./naming-conventions.md) for detailed rules.