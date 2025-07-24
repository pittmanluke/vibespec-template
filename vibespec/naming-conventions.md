# Naming Conventions

This document defines the strict naming conventions for all files, directories, and code exports in VibeSpec projects.

## Core Rules

### Files: ALWAYS use kebab-case
```
✅ Good:
- user-profile.tsx
- auth-service.ts
- mock-data.json
- api-utils.ts

❌ Bad:
- userProfile.tsx
- AuthService.ts
- mockData.json
- apiUtils.ts
```

### Directories: ALWAYS use kebab-case
```
✅ Good:
- user-management/
- auth-providers/
- api-routes/
- ui-components/

❌ Bad:
- userManagement/
- authProviders/
- apiRoutes/
- uiComponents/
```

### Component Exports: ALWAYS use PascalCase
```typescript
// File: user-profile.tsx
export function UserProfile() {  // ✅ PascalCase export
  return <div>...</div>
}

// File: auth-provider.tsx
export const AuthProvider = () => {  // ✅ PascalCase export
  return <div>...</div>
}
```

## NO EXCEPTIONS

These rules have **no exceptions**. Every file and directory must follow these conventions.

## Specific Examples

### React Components
```
File: button.tsx
Export: export function Button() {}

File: user-avatar.tsx
Export: export function UserAvatar() {}

File: navigation-menu.tsx
Export: export function NavigationMenu() {}
```

### Services
```
File: auth-service.ts
Export: export class AuthService {} or export const authService = {}

File: user-service.ts
Export: export class UserService {} or export const userService = {}
```

### Utilities
```
File: format-date.ts
Export: export function formatDate() {}

File: api-client.ts
Export: export const apiClient = {}
```

### Types
```
File: user.ts
Export: export interface User {}

File: api-response.ts
Export: export type ApiResponse = {}
```

### Hooks
```
File: use-auth.ts
Export: export function useAuth() {}

File: use-local-storage.ts
Export: export function useLocalStorage() {}
```

## Multi-Word Names

Always use hyphens to separate words in file and directory names:

```
✅ Good:
- user-profile-card.tsx
- api-error-handler.ts
- mock-auth-service.ts
- use-window-size.ts

❌ Bad:
- userProfileCard.tsx
- user_profile_card.tsx
- apiErrorHandler.ts
- mockAuthService.ts
```

## Index Files

Index files follow the same rules:

```
✅ Good:
- components/ui/index.ts
- services/auth/index.ts

❌ Bad:
- components/ui/Index.ts
- services/auth/INDEX.ts
```

## Special Files

Even special files follow kebab-case where possible:

```
✅ Good:
- package.json (standard)
- tsconfig.json (standard)
- next.config.ts
- jest.config.ts
- .env.local

Note: Some files like package.json and tsconfig.json 
are industry standards and keep their conventional names.
```

## Common Mistakes to Avoid

### 1. Mixed Naming in Same Directory
```
❌ Bad:
components/
├── Button.tsx        # Wrong: PascalCase file
├── user-card.tsx     # Correct
└── NavMenu.tsx       # Wrong: PascalCase file
```

### 2. Inconsistent Export Naming
```typescript
// ❌ Bad: File and export don't match pattern
// File: UserProfile.tsx (wrong filename)
export function UserProfile() {}

// ✅ Good: Correct pattern
// File: user-profile.tsx
export function UserProfile() {}
```

### 3. Acronyms in Names
```
✅ Good:
- api-key.ts
- url-parser.ts
- html-renderer.tsx

❌ Bad:
- APIKey.ts
- URLParser.ts
- HTMLRenderer.tsx
```

## Enforcement

These conventions are enforced through:

1. **Build Process**: `npm run build` will fail if conventions are violated
2. **Linting**: ESLint rules check import paths
3. **Code Review**: All PRs must follow conventions
4. **AI Assistant Rules**: AI must follow these conventions

## Benefits

1. **Consistency**: Predictable file locations
2. **Clarity**: Clear distinction between files and exports
3. **Tooling**: Better IDE support and auto-imports
4. **Team Alignment**: No debates about naming
5. **AI Compatibility**: AI assistants work better with consistent patterns

## Quick Reference

| Type | File Name | Export Name |
|------|-----------|-------------|
| Component | `user-profile.tsx` | `UserProfile` |
| Service | `auth-service.ts` | `AuthService` or `authService` |
| Hook | `use-auth.ts` | `useAuth` |
| Utility | `format-date.ts` | `formatDate` |
| Type | `user.ts` | `User` |
| Directory | `user-management/` | N/A |

Remember: When in doubt, use kebab-case for files and directories, PascalCase for component exports.