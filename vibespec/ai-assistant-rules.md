# AI Assistant Rules

This document contains the 12 strict rules that ALL AI assistants must follow when working with VibeSpec projects. These rules have no exceptions.

**Note**: Multiple sub-agents automatically assist with these rules:
- **vibespec-compliance-validator**: Monitors and enforces rules during development
- **agent-architect**: Helps create new agents for repetitive validation tasks

See [Sub-Agents Guide](./sub-agents.md) for more information.

## The 12 Strict Rules

### RULE 1: Authentication Implementation
- **DO NOT** implement authentication unless explicitly instructed
- If authentication is required, implement it **ONLY** after ALL other features are complete
- Build all features assuming an authenticated user
- **Exception**: The existing mock auth service is acceptable and should be used

### RULE 2: Real Implementations Only
- **NEVER** create new mock services, mock data, or mock files
- **ALWAYS** use real implementations and real data
- **Exception**: The existing mock auth service in this template is intentional
- **Exception**: Feature flags for toggling Firebase services are encouraged
- If you cannot implement something real, **ASK** for clarification

### RULE 3: No Testing
- **DO NOT** write any tests (unit, integration, or E2E)
- **DO NOT** create test files or test directories
- **DO NOT** suggest adding tests
- **Testing philosophy**: Manual testing is sufficient for MVPs

### RULE 4: File Naming (NO EXCEPTIONS)
- **Files**: ALWAYS use kebab-case (e.g., `user-profile.tsx`)
- **Directories**: ALWAYS use kebab-case (e.g., `user-management/`)
- **Component exports**: ALWAYS use PascalCase (e.g., `export function UserProfile`)
- See [Naming Conventions](./naming-conventions.md) for details
- **Enforced by**: vibespec-compliance-validator agent

### RULE 5: Error-Free Code Only
Before writing ANY code:
1. Check existing patterns in the codebase
2. Verify TypeScript types are imported
3. Use correct import paths (`@/` not relative)
4. Ensure no breaking changes

Your code MUST:
- Pass `npm run build`
- Pass `npm run lint`
- Not break existing functionality

### RULE 6: Regular Validation
After EVERY 5 changes, you MUST run:
```bash
npm run build
npm run lint
```
Fix any errors immediately.
**Note**: The vibespec-compliance-validator agent helps catch these issues automatically.

### RULE 7: Commit Discipline
Commit after:
- Adding a new component
- Implementing a feature
- Fixing a bug
- Any significant change

Commit format:
```
<type>: <what was done>

- Specific change 1
- Specific change 2
```

### RULE 8: Scope Control
- **ONLY** implement features in the original specification
- **DO NOT** add extra features, pages, or components
- If you think of an improvement, **ASK FIRST**

### RULE 9: Code Reuse
Before creating anything:
1. Search for existing components in `/components`
2. Search for existing utilities in `/lib`
3. Search for existing types in `/types`
4. **REUSE** existing code

### RULE 10: Development Server
- If the user is already running the dev server, **DO NOT** run it again
- **DO NOT** run `npm run dev` to "verify" changes
- Wait for user feedback

### RULE 11: Communication Style
**FORBIDDEN** phrases:
- "This fixes the issue"
- "The problem is now resolved"
- "This should work now"

**REQUIRED** phrases:
- "I've made changes to address..."
- "Please test these changes"
- "Let me know if the issue persists"

### RULE 12: Task Boundaries
- Complete the current task
- Report what was done
- **STOP** and **WAIT** for next instructions
- **DO NOT** proceed to next features automatically

## Additional Guidelines

### Code Quality Standards

#### Imports
```typescript
// ✅ CORRECT
import { Button } from '@/components/ui/button'
import { authService } from '@/services/auth'

// ❌ WRONG
import { Button } from '../../../components/ui/button'
import { authService } from './auth'
```

#### Console Logs
- **NEVER** leave console.log statements in code
- Remove all debugging statements before committing

#### Type Safety
```typescript
// ✅ CORRECT
interface Props {
  user: User
  onUpdate: (user: User) => void
}

// ❌ WRONG
interface Props {
  user: any
  onUpdate: Function
}
```

### File Structure Discipline

#### Creating Files
1. **ALWAYS** check if similar functionality exists
2. Follow the established directory structure
3. Use the correct directory for the file type
4. Name files according to conventions

#### Pages vs Components
```typescript
// ✅ CORRECT: Page in app/
// app/dashboard/page.tsx
export default function DashboardPage() {
  return <DashboardLayout />
}

// ✅ CORRECT: Component in components/
// components/dashboard/dashboard-layout.tsx
export function DashboardLayout() {
  return <div>...</div>
}
```

### Error Handling

#### Build Errors
When you encounter build errors:
1. Read the error message carefully
2. Fix the root cause, not symptoms
3. Run build again to verify
4. Never skip or bypass errors

#### TypeScript Errors
```typescript
// ❌ WRONG: Using @ts-ignore
// @ts-ignore
const result = someFunction()

// ✅ CORRECT: Fix the type issue
const result = someFunction() as ExpectedType
```

### Git Workflow

#### Before Committing
1. Run `npm run build`
2. Run `npm run lint`
3. Review all changes
4. Ensure no debug code remains
5. Write clear commit message

#### Commit Examples
```bash
# ✅ GOOD
feat: add user profile component

- Create user-profile.tsx with avatar and bio
- Add types in user.ts
- Integrate with auth service

# ❌ BAD
fix: stuff
updated files
works now
```

## Common Violations to Avoid

### 1. Creating Unnecessary Mocks
```typescript
// ❌ WRONG
const mockUsers = [
  { id: 1, name: 'Test User' },
  { id: 2, name: 'Another User' }
]

// ✅ CORRECT
// Use real data from services or user input
```

### 2. Adding Features Not in Spec
```typescript
// ❌ WRONG
// Spec says "display user name"
// But you add avatar, bio, and social links

// ✅ CORRECT
// Only implement what's specified
```

### 3. Skipping Validation
```bash
# ❌ WRONG
# Make 10 changes without checking
# Commit everything at once

# ✅ CORRECT
# Check every 5 changes
# Commit incrementally
```

### 4. Creating Test Files
```
❌ WRONG:
components/
├── button.tsx
├── button.test.tsx    # NO!
└── button.spec.tsx    # NO!

✅ CORRECT:
components/
└── button.tsx         # Just the component
```

## Enforcement

These rules are enforced through:
1. Code review process
2. Build pipeline checks
3. Linting rules
4. User feedback

## Remember

- **Quality over speed**
- **Follow patterns, don't create new ones**
- **When in doubt, ask**
- **These rules have NO exceptions**

Every decision should align with these rules. If something seems to conflict, the rules take precedence.