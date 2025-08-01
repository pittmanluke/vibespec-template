# Development Workflow

This document outlines the development workflow, common tasks, and best practices for VibeSpec projects.

## Sub-Agents Support

VibeSpec includes automated sub-agents that monitor and assist your development:

- **spec-guardian**: Ensures your implementation matches specifications
- **velocity**: Keeps you focused on shipping, not perfecting
- **compliance**: Automatically checks code standards
- **session-tracker**: Captures your progress for easy handoffs
- **docs-sync**: Keeps documentation in sync
- **architect**: Identifies and creates agents for repetitive tasks
- **ui-enhancer**: Helps improve UI components for accessibility and consistency

These agents work automatically in the background, intervening only when needed. See [Sub-Agents Guide](./sub-agents.md) for details.

## Getting Started

### Initial Setup

1. **Clone and Install**
   ```bash
   git clone [repository-url]
   cd [project-name]
   npm install --legacy-peer-deps
   ```

2. **Environment Configuration**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your settings
   ```

3. **Start Development**
   ```bash
   npm run dev
   # Open http://localhost:3000
   ```

4. **Initialize AI Assistant** (Recommended)
   ```bash
   claude
   /context-prime
   /session:start
   ```
   *This enables sub-agents to monitor your development*

## Development Approach

### 1. Start with Mock Services

Mock services allow immediate development without external dependencies:

- **Faster Development**: No API setup required
- **No External Dependencies**: Work offline
- **Test Edge Cases Easily**: Control all responses
- **Predictable Behavior**: Consistent during development

Example workflow:
```typescript
// Start with mock
const authService = new MockAuthService()

// Later, switch to real service
const authService = USE_FIREBASE_AUTH 
  ? new FirebaseAuthService() 
  : new MockAuthService()
```

### 2. Enable Firebase Gradually

Use feature flags to enable services one at a time:

```bash
# Start with all disabled
NEXT_PUBLIC_USE_FIREBASE_AUTH=false
NEXT_PUBLIC_USE_FIRESTORE=false

# Enable as needed
NEXT_PUBLIC_USE_FIREBASE_AUTH=true  # Enable auth first
NEXT_PUBLIC_USE_FIRESTORE=true      # Then add Firestore
```

Test both states (on/off) to ensure graceful fallbacks.

### 3. Follow File Structure

Maintain strict separation of concerns:

- **Don't** create files in `/app` except pages
- **Keep** providers together in `/providers`
- **Separate** business logic in `/services`
- **Organize** components by feature

See [Project Structure](./project-structure.md) for details.

## Common Tasks

### Adding a New Provider

1. **Create Provider File**
   ```bash
   # Create in src/providers/
   touch src/providers/theme-provider.tsx
   ```

2. **Implement Provider**
   ```typescript
   // src/providers/theme-provider.tsx
   export function ThemeProvider({ children }: { children: React.ReactNode }) {
     // Provider implementation
   }
   ```

3. **Export from Index** (if needed)
   ```typescript
   // src/providers/index.ts
   export { ThemeProvider } from './theme-provider'
   ```

4. **Wrap in Root Layout** (if global)
   ```typescript
   // app/layout.tsx
   import { ThemeProvider } from '@/providers/theme-provider'
   
   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           <ThemeProvider>
             {children}
           </ThemeProvider>
         </body>
       </html>
     )
   }
   ```

### Adding a New Service

1. **Create Service Directory**
   ```bash
   mkdir -p src/services/user
   ```

2. **Create Service Files**
   ```typescript
   // src/services/user/user-service.ts
   export class UserService {
     async getUser(id: string) {
       // Implementation
     }
   }
   ```

3. **Include Mock Implementation** (if Firebase-dependent)
   ```typescript
   // src/services/user/mock/mock-user-service.ts
   export class MockUserService {
     async getUser(id: string) {
       // Mock implementation
     }
   }
   ```

4. **Use Feature Flags**
   ```typescript
   // src/services/user/index.ts
   import { USE_FIRESTORE } from '@/lib/feature-flags'
   
   export const userService = USE_FIRESTORE
     ? new UserService()
     : new MockUserService()
   ```

### Adding New Components

1. **UI Primitives** → `/components/ui/`
   ```bash
   # For base UI components
   npx shadcn@latest add button
   ```

2. **Feature Components** → `/components/[feature]/`
   ```bash
   # For feature-specific components
   mkdir -p src/components/dashboard
   touch src/components/dashboard/dashboard-stats.tsx
   ```

3. **Always use kebab-case** for files
   ```
   ✅ user-profile-card.tsx
   ❌ UserProfileCard.tsx
   ```

### Working with Environment Variables

1. **Development Setup**
   ```bash
   # Copy example file
   cp .env.local.example .env.local
   
   # Edit with your values
   # Feature flags (start with false)
   NEXT_PUBLIC_USE_FIREBASE_AUTH=false
   NEXT_PUBLIC_USE_FIRESTORE=false
   ```

2. **Production Setup**
   ```bash
   # Enable features for production
   NEXT_PUBLIC_USE_FIREBASE_AUTH=true
   NEXT_PUBLIC_USE_FIRESTORE=true
   
   # Add Firebase config
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
   ```

## Testing Approach

### Mock Services Testing

1. **Test All UI Flows**
   - User registration flow
   - Login/logout flow
   - Data creation/update/delete
   - Error states

2. **Use Different Email Patterns**
   ```typescript
   // Mock service recognizes patterns
   admin@example.com    // Gets admin role
   user@example.com     // Gets user role
   test@example.com     // Standard user
   ```

3. **Check LocalStorage**
   - Verify session persistence
   - Check saved preferences
   - Validate mock data storage

### Firebase Services Testing

1. **Enable One Service at a Time**
   - Start with authentication
   - Add Firestore
   - Then storage/functions

2. **Test Fallback Behavior**
   - Disable service, ensure mock works
   - Enable service, ensure real works
   - Test network failure scenarios

3. **Verify Firebase Rules**
   - Test security rules work
   - Validate access permissions
   - Check rate limiting

## Code Quality Checklist

Before committing any code:

- [ ] Run `npm run build` - must pass
- [ ] Run `npm run lint` - must pass
- [ ] All files use kebab-case
- [ ] Imports use `@/` paths
- [ ] Mock services work when Firebase disabled
- [ ] No console.log statements
- [ ] Types properly defined
- [ ] Components follow patterns
- [ ] Services include mocks if needed

## Build and Deploy

### Development Build
```bash
npm run dev
# Starts on http://localhost:3000
# Hot reload enabled
# Error overlay enabled
```

### Production Build
```bash
npm run build
# Creates .next/ directory
# Optimizes for production
# Runs type checking
# Runs linting
```

### Start Production Server
```bash
npm run start
# Serves production build
# No hot reload
# Optimized performance
```

## Troubleshooting Common Issues

### Import Path Errors
```typescript
// ❌ Wrong
import { Button } from '../components/ui/button'

// ✅ Correct
import { Button } from '@/components/ui/button'
```

### TypeScript Errors
- Run `npm run build` to catch all errors
- Check that types are exported from index files
- Ensure all Firebase calls have null checks

### CSS/Tailwind Issues
- VS Code settings handle warnings
- Use `@theme` for new design tokens
- Check `globals.css` for custom CSS

### Build Failures
1. Check error message carefully
2. Run `npm run typecheck` for type errors
3. Run `npm run lint` for linting errors
4. Fix root cause, not symptoms

## Best Practices

### 1. Incremental Development
- Build small features
- Test frequently
- Commit often
- Get feedback early

### 2. Use Existing Patterns
- Study existing code
- Follow established patterns
- Don't reinvent wheels
- Ask if unsure

### 3. Maintain Consistency
- Naming conventions
- File organization
- Code style
- Import patterns

### 4. Document Decisions
- Add comments for complex logic
- Update documentation
- Create examples
- Share knowledge

## Session Management

When working on features:

```bash
# Start session
/session:start feature-name

# Regular updates
/session:update

# End session
/session:end
```

This helps track progress and maintain context across development sessions.

## Getting Help

- Check [Troubleshooting Guide](./troubleshooting.md)
- Review [AI Workflow Guide](./ai-workflow-guide.md)
- Look at example implementations
- Ask in project discussions