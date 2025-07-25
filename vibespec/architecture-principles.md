# Architecture Principles

This document outlines the core architectural principles and patterns that guide VibeSpec development.

## Automated Quality Assurance

VibeSpec employs specialized sub-agents to automatically enforce architectural principles:

- **spec-alignment-guardian**: Ensures implementations follow specifications
- **velocity-guardian**: Prevents over-engineering and scope creep
- **vibespec-compliance-validator**: Enforces file naming and code standards
- **session-state-tracker**: Maintains development continuity
- **vibespec-docs-harmonizer**: Keeps all documentation synchronized
- **agent-architect**: Creates new agents for project-specific automation needs

These agents work in the background, proactively preventing architectural drift. See [Sub-Agents Guide](./sub-agents.md) for details.

## Core Principles

### 1. Separation of Concerns

Each part of the application has a clear, single responsibility:

- **Pages** (`/app`): Route handling and page composition only
- **Logic** (`/services`): Business rules and data operations
- **UI** (`/components`): Presentation and user interaction
- **State** (`/providers`): Application state management

```typescript
// ✅ Good: Clear separation
// app/users/page.tsx
export default function UsersPage() {
  return <UserList />  // Page just composes
}

// components/users/user-list.tsx
export function UserList() {
  const users = useUsers()  // Component handles UI
  return <div>{/* render users */}</div>
}

// services/user/user-service.ts
export class UserService {
  async fetchUsers() {  // Service handles logic
    // fetch logic
  }
}
```

### 2. Feature Flags First

Every external service must be toggleable:

```typescript
// lib/feature-flags.ts
export const USE_FIREBASE_AUTH = 
  process.env.NEXT_PUBLIC_USE_FIREBASE_AUTH === 'true'

// services/auth/index.ts
export const authService = USE_FIREBASE_AUTH
  ? new FirebaseAuthService()
  : new MockAuthService()
```

Benefits:
- **Graceful Degradation**: Features work without external services
- **Progressive Enhancement**: Add capabilities incrementally
- **Development Speed**: No blocked dependencies

### 3. Developer Experience

Prioritize developer productivity and clarity:

- **Zero-Config Start**: Clone, install, run
- **Clear Error Messages**: Helpful, actionable errors
- **Consistent Patterns**: Same approach everywhere
- **Fast Feedback**: Quick build/lint cycles

```bash
# Should work immediately
git clone [repo]
cd [project]
npm install --legacy-peer-deps
npm run dev
# ✅ App running at localhost:3000
```

### 4. Type Safety

Leverage TypeScript for confidence and maintainability:

- **No `any` Types**: Always define proper types
- **Strict Null Checks**: Handle undefined/null cases
- **Validated at Build Time**: Catch errors before runtime

```typescript
// ❌ Bad: Using any
function processUser(user: any) {
  return user.name.toUpperCase()
}

// ✅ Good: Proper types
interface User {
  name: string
  email: string
}

function processUser(user: User): string {
  return user.name.toUpperCase()
}
```

## Key Architectural Decisions

### 1. Mock Services Pattern

Every external service has a mock counterpart:

```typescript
// services/auth/mock/mock-auth-service.ts
export class MockAuthService implements AuthService {
  async signIn(email: string, password: string) {
    // Simulate successful login
    const user = { id: '1', email, role: 'user' }
    localStorage.setItem('user', JSON.stringify(user))
    return user
  }
}
```

Why:
- Start development immediately
- Test edge cases easily
- Work offline
- Predictable behavior

### 2. Provider-Based State

Use React Context for state management:

```typescript
// providers/auth-provider.tsx
const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
```

### 3. Component Organization

Components are organized by feature and complexity:

```
components/
├── ui/               # Base primitives (from shadcn/ui)
│   ├── button.tsx
│   ├── card.tsx
│   └── input.tsx
└── dashboard/        # Feature components
    ├── dashboard-header.tsx
    ├── dashboard-stats.tsx
    └── index.ts
```

### 4. Service Layer Pattern

Services encapsulate business logic:

```typescript
// services/user/user-service.ts
export class UserService {
  constructor(private db: Database) {}
  
  async createUser(data: CreateUserInput): Promise<User> {
    // Validation
    if (!data.email) throw new Error('Email required')
    
    // Business logic
    const user = {
      ...data,
      createdAt: new Date(),
      role: 'user'
    }
    
    // Persistence
    return this.db.users.create(user)
  }
}
```

## Design Patterns

### 1. Composition Over Inheritance

Prefer component composition:

```typescript
// ✅ Good: Composition
function Card({ children, className }: CardProps) {
  return (
    <div className={cn('rounded-lg border', className)}>
      {children}
    </div>
  )
}

function UserCard({ user }: { user: User }) {
  return (
    <Card className="p-4">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </Card>
  )
}
```

### 2. Dependency Injection

Services receive dependencies:

```typescript
// ✅ Good: Dependency injection
class UserService {
  constructor(
    private auth: AuthService,
    private db: Database
  ) {}
}

// Easy to test and swap implementations
const userService = new UserService(mockAuth, mockDb)
```

### 3. Single Source of Truth

Each piece of data has one authoritative source:

```typescript
// ✅ Good: Single source
// User data comes from auth provider
function useCurrentUser() {
  const { user } = useAuth()
  return user
}

// ❌ Bad: Multiple sources
// Don't store user in multiple places
const [localUser, setLocalUser] = useState()
const { user: authUser } = useAuth()
```

### 4. Fail Fast, Recover Gracefully

Detect errors early but handle them gracefully:

```typescript
// Service fails fast
async function fetchUser(id: string): Promise<User> {
  if (!id) throw new Error('User ID required')
  
  const user = await api.get(`/users/${id}`)
  if (!user) throw new Error('User not found')
  
  return user
}

// Component recovers gracefully
function UserProfile({ userId }: { userId: string }) {
  const { data, error } = useUser(userId)
  
  if (error) {
    return <ErrorMessage message="Could not load user" />
  }
  
  if (!data) {
    return <Skeleton />
  }
  
  return <Profile user={data} />
}
```

## Performance Principles

### 1. Optimize for First Load

- Code split by route automatically
- Lazy load heavy components
- Minimize initial bundle

### 2. Progressive Enhancement

- Core features work without JavaScript
- Enhanced features with JS
- Graceful degradation

### 3. Cache Appropriately

- Static assets cached forever
- API responses cached as needed
- Local storage for offline

## Security Principles

### 1. Never Trust Client Input

```typescript
// ✅ Good: Validate on server
async function createPost(input: unknown) {
  const validated = postSchema.parse(input)
  // Process validated data
}
```

### 2. Principle of Least Privilege

- Minimal permissions by default
- Explicit permission grants
- Regular permission audits

### 3. Defense in Depth

- Multiple security layers
- Client validation + server validation
- Rate limiting + authentication

## Scalability Principles

### 1. Modular Architecture

- Features as modules
- Clear interfaces
- Loose coupling

### 2. Horizontal Scaling

- Stateless services
- Database per service
- Queue for async work

### 3. Performance Budget

- Maximum bundle size
- Maximum load time
- Regular monitoring

## Future Considerations

When extending the template:

1. **Maintain Mock Service Pattern**: Every external service needs a mock
2. **Keep Feature Flags**: New services should be toggleable
3. **Follow File Structure**: Don't break established patterns
4. **Document Decisions**: Update this document
5. **Test Both States**: With and without external services

## Anti-Patterns to Avoid

### 1. Prop Drilling
```typescript
// ❌ Bad: Passing props through many levels
<App user={user}>
  <Layout user={user}>
    <Page user={user}>
      <Component user={user} />
    </Page>
  </Layout>
</App>

// ✅ Good: Use context
<AuthProvider>
  <App />  // Components use useAuth()
</AuthProvider>
```

### 2. Business Logic in Components
```typescript
// ❌ Bad: Logic in component
function UserList() {
  const [users, setUsers] = useState([])
  
  const createUser = async (data) => {
    // Validation, API calls, etc in component
  }
}

// ✅ Good: Logic in service
function UserList() {
  const { createUser } = useUserService()
  // Component just handles UI
}
```

### 3. Tight Coupling
```typescript
// ❌ Bad: Direct dependency
import { firebaseAuth } from 'firebase/auth'

function useAuth() {
  return firebaseAuth  // Tied to Firebase
}

// ✅ Good: Abstraction
import { authService } from '@/services/auth'

function useAuth() {
  return authService  // Can swap implementation
}
```

## Summary

These principles ensure:
- **Maintainable** code that's easy to understand
- **Flexible** architecture that adapts to changes
- **Reliable** systems that handle errors gracefully
- **Fast** development with clear patterns
- **Scalable** solutions that grow with needs