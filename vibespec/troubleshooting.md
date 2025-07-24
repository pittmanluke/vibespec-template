# Troubleshooting Guide

This guide helps you resolve common issues when working with VibeSpec and AI-assisted development.

## Common Issues

### AI Building the Wrong Thing

**Symptoms**:
- AI creates components that don't match your vision
- Features work differently than expected
- Styling doesn't match your design

**Root Cause**: No specification or unclear requirements

**Solutions**:

1. **Create a specification first**:
```bash
# If you have a design
> /transpose @examples/your-design.tsx

# If you have requirements
> /breakdown @specs/your-requirements.md
```

2. **Be specific in your mockups**:
```tsx
// Bad ❌
<div>User Profile</div>

// Good ✅
<div className="max-w-2xl mx-auto p-6">
  <div className="flex items-center gap-4 mb-6">
    <img src="/avatar.png" className="w-16 h-16 rounded-full" />
    <div>
      <h1 className="text-2xl font-bold">John Doe</h1>
      <p className="text-muted-foreground">john@example.com</p>
    </div>
  </div>
  {/* Complete the entire design */}
</div>
```

3. **Update CLAUDE.md** with project-specific rules

---

### Lost Context Mid-Development

**Symptoms**:
- AI forgets what you're building
- Suggests changes that break existing code
- Repeats work already done

**Root Cause**: Context window limit reached

**Solutions**:

1. **Use session management**:
```bash
# Before context fills up
> /session:update

# In new conversation
> /context-prime
> /session:update  # AI recalls where you left off
```

2. **Compact when needed**:
```bash
> /compact  # Hide previous messages
```

3. **Break work into smaller chunks**:
- Complete one component at a time
- Update session after each milestone
- Start fresh conversations for new features

---

### High Token Usage

**Symptoms**:
- Rapid API cost increase
- Repeated instructions to AI
- Long conversations without progress

**Root Cause**: Working without specifications

**Solutions**:

1. **Always use specifications**:
- Reduces token usage by 50%+
- Prevents repeated explanations
- Ensures consistent output

2. **Efficient commands**:
```bash
# Inefficient ❌
"Build me a dashboard with charts, user stats, and..."
*AI asks questions*
"No, I meant like this..."
*More back and forth*

# Efficient ✅
> /transpose @examples/dashboard.tsx
*AI builds exactly what's specified*
```

3. **Regular session updates**:
- Checkpoint progress
- Start fresh with context

---

### Build Errors

**Symptoms**:
- `npm run build` fails
- TypeScript errors
- ESLint warnings

**Root Cause**: AI generated invalid code

**Solutions**:

1. **Run build regularly**:
```bash
npm run build  # Catch errors early
npm run lint   # Fix style issues
```

2. **Check imports**:
```tsx
// Common AI mistake
import { Component } from './component'  // Wrong!

// Correct
import { Component } from '@/components/component'
```

3. **Verify file structure**:
```bash
# Components NOT in app directory
src/components/feature/  ✅
src/app/components/     ❌

# Routes ONLY in app directory
src/app/dashboard/page.tsx  ✅
src/pages/dashboard.tsx     ❌
```

---

### Component Not Found

**Symptoms**:
- Import errors
- "Module not found"
- Components not rendering

**Root Cause**: Wrong file location or import path

**Solutions**:

1. **Check file exists**:
```bash
# Use the LS tool
> LS src/components
```

2. **Fix import paths**:
```tsx
// From app directory
import { Button } from '@/components/ui/button'

// From components
import { useUser } from '@/hooks/use-user'

// Never use relative paths from app
import { Button } from '../../../components/ui/button' ❌
```

3. **Export from index files**:
```tsx
// components/features/index.ts
export * from './user-card'
export * from './dashboard'
```

---

### Mock Services Not Working

**Symptoms**:
- Authentication fails
- No data appears
- Firebase errors in console

**Root Cause**: Environment configuration

**Solutions**:

1. **Check environment variables**:
```env
# .env.local
NEXT_PUBLIC_USE_FIREBASE_AUTH=false  # Use mock auth
NEXT_PUBLIC_USE_FIRESTORE=false     # Use mock data
```

2. **Clear localStorage**:
```javascript
// In browser console
localStorage.clear()
// Refresh page
```

3. **Verify mock service files exist**:
```
src/services/auth/
├── index.ts
├── mock/
│   └── mock-auth-service.ts
└── firebase/
    └── firebase-auth-service.ts
```

---

### Styling Issues

**Symptoms**:
- Styles not applying
- Dark mode broken
- Responsive layout issues

**Root Cause**: Tailwind configuration or class conflicts

**Solutions**:

1. **Use Tailwind classes correctly**:
```tsx
// Bad ❌
<div className="background-red-500">  // Wrong class name

// Good ✅
<div className="bg-red-500">
```

2. **Check dark mode**:
```tsx
// Proper dark mode classes
<div className="bg-white dark:bg-zinc-900">
```

3. **Verify Tailwind config**:
- VibeSpec uses Tailwind v4
- No `tailwind.config.js` needed
- Configure in `globals.css`

---

### Session Management Issues

**Symptoms**:
- Can't find current session
- Session updates not working
- Lost track of progress

**Root Cause**: Session file issues

**Solutions**:

1. **Check current session**:
```bash
> Read .claude/sessions/.current-session
```

2. **Start new session**:
```bash
> /session:start new-feature
```

3. **Manual session recovery**:
```bash
# Find session files
> LS .claude/sessions

# Read specific session
> Read .claude/sessions/2024-01-15-feature.md
```

---

### Git and Version Control

**Symptoms**:
- Merge conflicts
- Lost changes
- Can't track progress

**Solutions**:

1. **Commit regularly**:
```bash
git add .
git commit -m "feat: add user profile"
```

2. **Use feature branches**:
```bash
git checkout -b feature/user-auth
# Work on feature
git commit
git checkout main
git merge feature/user-auth
```

3. **Track with sessions**:
```bash
> /session:update  # Includes git status
```

---

## Performance Issues

### Slow Development Speed

**Causes & Solutions**:

1. **No specifications**:
   - Always start with `/transpose` or `/breakdown`

2. **Fighting the structure**:
   - Follow VibeSpec patterns
   - Don't create custom architectures

3. **Context thrashing**:
   - Use session management
   - Regular updates

### Slow Application Performance

**Solutions**:

1. **Check bundle size**:
```bash
npm run build
# Check "First Load JS" in output
```

2. **Lazy load components**:
```tsx
const HeavyComponent = dynamic(() => import('./heavy-component'))
```

3. **Optimize images**:
```tsx
import Image from 'next/image'
<Image src="/hero.png" width={1200} height={600} />
```

---

## AI-Specific Issues

### AI Hallucinating Features

**Symptoms**: AI mentions features that don't exist

**Solutions**:
1. Run `/context-prime` to ground AI in reality
2. Refer to actual files with `@filename`
3. Ask AI to read files before modifying

### AI Making Breaking Changes

**Symptoms**: AI changes working code unnecessarily

**Solutions**:
1. Be specific: "Only change the button color"
2. Use version control to track changes
3. Review changes before accepting

### AI Ignoring Instructions

**Symptoms**: AI doesn't follow your requests

**Solutions**:
1. Check CLAUDE.md for conflicting rules
2. Be more specific in requests
3. Break complex requests into steps

---

## Environment Issues

### Node Version Mismatch

```bash
# Check version
node --version  # Should be 18.17+

# Use nvm to switch
nvm use 18
```

### Package Installation Failures

```bash
# Clear cache
npm cache clean --force

# Delete node_modules
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
npm run dev -- -p 3001
```

---

## Getting More Help

### 1. Check Documentation
- [Getting Started](./getting-started.md)
- [Specifications Guide](./specifications.md)
- [Commands Reference](./commands.md)

### 2. Review Examples
- Check `examples/` directory
- Look at `specs/` for patterns
- Read session files for context

### 3. Community Support
- GitHub Issues for bugs
- Discord for real-time help
- Twitter for updates

### 4. Debug Commands

```bash
# Check file structure
> Glob "**/*.tsx"

# Search for patterns
> Grep "import.*from" --type tsx

# Read specific files
> Read src/app/layout.tsx

# Check git status
> Bash git status
```

### 5. Last Resort

If nothing works:
1. Create minimal reproduction
2. File detailed issue on GitHub
3. Include session file and specs
4. Describe expected vs actual behavior

Remember: Most issues stem from not using specifications or fighting the established patterns. When in doubt, create a spec and follow VibeSpec conventions!