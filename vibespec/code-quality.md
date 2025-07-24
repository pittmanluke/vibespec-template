# Code Quality

This document defines code quality standards and validation requirements for VibeSpec projects.

## Code Quality Checklist

Before committing any code, ensure:

- [ ] Run `npm run build` - must pass
- [ ] Run `npm run lint` - must pass
- [ ] All files use kebab-case
- [ ] Imports use `@/` paths
- [ ] Mock services work when Firebase disabled
- [ ] No console.log statements
- [ ] Types properly defined
- [ ] Components follow established patterns
- [ ] Services include mock implementations if needed
- [ ] No `any` types used
- [ ] Error handling implemented
- [ ] Loading states handled

## Build Requirements

### TypeScript Compilation

The build **MUST** pass TypeScript compilation:

```bash
npm run build
# or
npm run typecheck
```

Common TypeScript issues to avoid:

```typescript
// ❌ Bad: Using any
const processData = (data: any) => {
  return data.value
}

// ✅ Good: Proper types
interface Data {
  value: string
}

const processData = (data: Data) => {
  return data.value
}
```

### ESLint Validation

The build **MUST** pass ESLint checks:

```bash
npm run lint
```

Common linting issues:

```typescript
// ❌ Bad: Unused variables
import { useState, useEffect } from 'react'  // useEffect unused

// ✅ Good: Only import what you use
import { useState } from 'react'

// ❌ Bad: Console logs
console.log('debugging')

// ✅ Good: Remove before committing
// console.log removed
```

## Import Standards

### Use Absolute Imports

Always use `@/` for src imports:

```typescript
// ❌ Bad: Relative imports
import { Button } from '../../../components/ui/button'
import { useAuth } from '../../hooks/use-auth'

// ✅ Good: Absolute imports
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
```

### Import Order

Maintain consistent import order:

```typescript
// 1. React and Next.js
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// 2. External packages
import { format } from 'date-fns'
import { z } from 'zod'

// 3. Internal imports (@/)
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { userService } from '@/services/user'

// 4. Types (with type keyword)
import type { User } from '@/types/user'
```

## Type Safety

### No Any Types

Never use `any` type:

```typescript
// ❌ Bad: Any type
function processUser(user: any) {
  return user.name
}

// ✅ Good: Specific type
interface User {
  id: string
  name: string
  email: string
}

function processUser(user: User) {
  return user.name
}

// ✅ Good: Unknown for truly dynamic data
function processData(data: unknown) {
  // Validate before use
  if (isUser(data)) {
    return data.name
  }
}
```

### Strict Null Checks

Handle null/undefined cases:

```typescript
// ❌ Bad: Ignoring null possibility
function getUserName(user: User | null) {
  return user.name  // Error if user is null
}

// ✅ Good: Handle null case
function getUserName(user: User | null) {
  return user?.name ?? 'Anonymous'
}

// ✅ Good: Guard early
function getUserName(user: User | null) {
  if (!user) return 'Anonymous'
  return user.name
}
```

### Type Exports

Export types from appropriate files:

```typescript
// types/user.ts
export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
}

export interface CreateUserInput {
  name: string
  email: string
  password: string
}

// types/index.ts
export type { User, CreateUserInput } from './user'
```

## Common Issues & Solutions

### Console Logs

Remove all console statements:

```typescript
// ❌ Bad: Left in code
function fetchUser(id: string) {
  console.log('Fetching user:', id)
  return userService.get(id)
}

// ✅ Good: Removed
function fetchUser(id: string) {
  return userService.get(id)
}

// ✅ Good: Use proper logging in production
import { logger } from '@/lib/logger'

function fetchUser(id: string) {
  logger.info('Fetching user', { userId: id })
  return userService.get(id)
}
```

### Error Handling

Always handle errors appropriately:

```typescript
// ❌ Bad: Unhandled errors
async function deleteUser(id: string) {
  await userService.delete(id)
}

// ✅ Good: Error handling
async function deleteUser(id: string) {
  try {
    await userService.delete(id)
    toast.success('User deleted')
  } catch (error) {
    console.error('Failed to delete user:', error)
    toast.error('Failed to delete user')
  }
}
```

### Loading States

Handle loading states in UI:

```typescript
// ❌ Bad: No loading state
function UserList() {
  const { data } = useUsers()
  
  return <div>{data.map(...)}</div>
}

// ✅ Good: Handle all states
function UserList() {
  const { data, error, isLoading } = useUsers()
  
  if (isLoading) return <Skeleton />
  if (error) return <ErrorMessage />
  if (!data) return <EmptyState />
  
  return <div>{data.map(...)}</div>
}
```

## Validation Process

### Every 5 Changes

After making 5 changes, run:

```bash
# Check TypeScript
npm run typecheck

# Check linting
npm run lint

# Or both at once
npm run build
```

### Before Committing

Always run full validation:

```bash
# Full build and validation
npm run build

# If successful, commit
git add .
git commit -m "feat: add user profile"
```

### Fixing Errors

When errors occur:

1. **Read the error message** - TypeScript errors are descriptive
2. **Fix the root cause** - Don't suppress or ignore
3. **Run validation again** - Ensure fix works
4. **Check related files** - Fix might affect imports

## Code Patterns

### Component Patterns

Follow consistent component patterns:

```typescript
// ✅ Good: Consistent pattern
interface UserCardProps {
  user: User
  onEdit?: (user: User) => void
  className?: string
}

export function UserCard({ 
  user, 
  onEdit,
  className 
}: UserCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
      </CardHeader>
      {onEdit && (
        <CardFooter>
          <Button onClick={() => onEdit(user)}>
            Edit
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
```

### Service Patterns

Consistent service implementation:

```typescript
// ✅ Good: Service pattern
export class UserService {
  async getUsers(): Promise<User[]> {
    if (!USE_FIRESTORE) {
      return mockUserService.getUsers()
    }
    
    const snapshot = await db.collection('users').get()
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as User))
  }
  
  async createUser(input: CreateUserInput): Promise<User> {
    // Validation
    const validated = userSchema.parse(input)
    
    // Business logic
    const user = {
      ...validated,
      id: generateId(),
      createdAt: new Date()
    }
    
    // Persistence
    if (!USE_FIRESTORE) {
      return mockUserService.createUser(user)
    }
    
    await db.collection('users').add(user)
    return user
  }
}
```

### Hook Patterns

Consistent custom hooks:

```typescript
// ✅ Good: Hook pattern
export function useUser(userId: string) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  
  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }
    
    userService.getUser(userId)
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [userId])
  
  return { user, loading, error }
}
```

## Performance Considerations

### Avoid Unnecessary Re-renders

```typescript
// ❌ Bad: New object every render
function UserList() {
  const style = { padding: 10 }  // New object
  return <div style={style}>...</div>
}

// ✅ Good: Stable reference
const listStyle = { padding: 10 }

function UserList() {
  return <div style={listStyle}>...</div>
}

// ✅ Good: Memoize if needed
function UserList() {
  const style = useMemo(() => ({ 
    padding: 10 
  }), [])
  
  return <div style={style}>...</div>
}
```

### Optimize Heavy Computations

```typescript
// ❌ Bad: Compute on every render
function UserStats({ users }: { users: User[] }) {
  const stats = users.reduce((acc, user) => {
    // Heavy computation
  }, {})
  
  return <div>{stats}</div>
}

// ✅ Good: Memoize computation
function UserStats({ users }: { users: User[] }) {
  const stats = useMemo(() => 
    users.reduce((acc, user) => {
      // Heavy computation
    }, {}),
    [users]
  )
  
  return <div>{stats}</div>
}
```

## Documentation Standards

### Component Documentation

```typescript
/**
 * Displays a user profile card with avatar and details.
 * 
 * @example
 * <UserCard user={currentUser} onEdit={handleEdit} />
 */
export function UserCard({ user, onEdit }: UserCardProps) {
  // Implementation
}
```

### Complex Logic Documentation

```typescript
/**
 * Calculates user permissions based on role and features.
 * Admin users get all permissions, regular users get subset.
 */
function calculatePermissions(user: User): Permission[] {
  // Complex logic with inline comments
  
  // Admins bypass all checks
  if (user.role === 'admin') {
    return ALL_PERMISSIONS
  }
  
  // Regular users get filtered permissions
  return PERMISSIONS.filter(permission => {
    // Check feature flags
    if (permission.requiresFlag && !isFeatureEnabled(permission.flag)) {
      return false
    }
    
    // Check user tier
    return permission.minTier <= user.tier
  })
}
```

## Summary

Code quality is maintained through:

1. **Automated validation** - Build and lint checks
2. **Type safety** - TypeScript strict mode
3. **Consistent patterns** - Following established conventions
4. **Regular checks** - Validation every 5 changes
5. **Clean commits** - Only working code committed

Remember: Quality over speed. Take time to write clean, maintainable code.