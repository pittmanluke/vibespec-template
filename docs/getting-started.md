# Getting Started with VibeSpec

Welcome to VibeSpec! This guide will walk you through everything you need to know to start building with specification-driven development.

## What is VibeSpec?

VibeSpec is a Next.js template specifically designed for AI-assisted development. It transforms the chaotic process of building with AI into a structured, predictable workflow through specifications.

### The Problem We Solve

When building with AI assistants:
- 🤯 **Context Confusion**: AI loses track of what you're building
- 💸 **Token Waste**: Repeating the same instructions over and over
- 🔄 **Inconsistent Output**: Different results each time
- 😤 **Frustrating Rewrites**: AI builds the wrong thing

### The VibeSpec Solution

- 📋 **Specifications First**: Clear documents that tell AI exactly what to build
- 🚀 **Proven Workflows**: Two paths that work every time
- 🧠 **Smart Context**: AI always knows your project structure
- ⚡ **Ship Faster**: From idea to production in days, not months

## Prerequisites

Before you begin, ensure you have:

- **Node.js** 18.17 or later ([Download](https://nodejs.org/))
- **Git** installed ([Download](https://git-scm.com/))
- **Claude Code** CLI ([Installation Guide](https://docs.anthropic.com/claude-code))
- A code editor (VS Code recommended)

## Installation

### Method 1: Using Create Next App (Recommended)

```bash
npx create-next-app@latest my-startup --example github.com/pittmanluke/vibespec
cd my-startup
npm install
```

### Method 2: Clone Directly

```bash
git clone https://github.com/pittmanluke/vibespec.git my-startup
cd my-startup
npm install
```

### Method 3: Use as Template

1. Go to [github.com/pittmanluke/vibespec](https://github.com/pittmanluke/vibespec)
2. Click "Use this template"
3. Create your repository
4. Clone and install

## Project Structure

Understanding the structure is crucial for effective AI development:

```
my-startup/
├── src/
│   ├── app/              # Next.js pages (routes only!)
│   ├── components/       # Reusable UI components
│   │   ├── ui/          # Base shadcn components
│   │   └── features/    # Feature-specific components
│   ├── services/        # Business logic layer
│   ├── lib/            # Utilities and helpers
│   ├── hooks/          # Custom React hooks
│   ├── types/          # TypeScript definitions
│   └── config/         # App configuration
│
├── specs/              # Your specifications (source of truth)
├── plans/              # Implementation plans
├── examples/           # UI examples and mockups
├── docs/              # Additional documentation
└── .claude/           # Claude Code configuration
    ├── commands/      # Custom commands
    └── CLAUDE.md      # AI instructions
```

### Key Principles

1. **Routes Only in `/app`**: Never put components in the app directory
2. **Specifications Drive Development**: Always start with a spec
3. **Clear Separation**: Business logic in services, UI in components
4. **AI-Friendly Structure**: Consistent patterns AI can follow

## Your First Specification

Let's build your first feature using VibeSpec!

### Option 1: Design-First (You have mockups)

1. **Create your mockup** in `examples/`:
```tsx
// examples/user-profile.tsx
export default function UserProfileMockup() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1>User Profile</h1>
      {/* Your design here */}
    </div>
  );
}
```

2. **Transform to specification**:
```bash
claude
> /transpose @examples/user-profile.tsx
```

3. **Review the generated spec** in `specs/user-profile-spec.md`

4. **Build with AI** - AI now knows exactly what to build!

### Option 2: Spec-First (You have requirements)

1. **Write your requirements** in `specs/`:
```markdown
# User Authentication Specification

## Overview
Users should be able to sign up, log in, and manage their accounts.

## Requirements
- Email/password authentication
- Social login (Google, GitHub)
- Password reset flow
- Profile management

## User Stories
- As a user, I want to sign up with my email
- As a user, I want to reset my password
- ...
```

2. **Generate implementation plan**:
```bash
claude
> /breakdown @specs/user-authentication.md
```

3. **Follow the plan** in `plans/implement-user-authentication.md`

## Essential Commands

### Context Management
```bash
/context-prime       # Load project structure (use at start)
/session:start       # Begin tracked development session
/session:update      # Save progress checkpoint
/session:end         # Close session with summary
```

### Specification Commands
```bash
/transpose @file     # Convert design → specification
/breakdown @spec     # Convert requirements → plan
```

### Development Workflow

1. **Start your session**:
```bash
claude
> /context-prime
> /session:start authentication-feature
```

2. **Create specification** (choose one):
```bash
> /transpose @examples/login-page.tsx    # If you have design
> /breakdown @specs/authentication.md    # If you have requirements
```

3. **Build incrementally**:
- Let AI implement based on specifications
- Test as you go
- Use `/session:update` to checkpoint progress

4. **Handle context limits**:
```bash
# If you hit context limits:
# 1. Start new conversation
> /context-prime       # Reload context
> /session:update      # AI will know where you left off
# 2. Continue building
```

## Configuration

### Environment Variables

Create `.env.local`:
```env
# Optional Firebase (disabled by default)
NEXT_PUBLIC_USE_FIREBASE_AUTH=false
NEXT_PUBLIC_USE_FIRESTORE=false
NEXT_PUBLIC_USE_STORAGE=false
NEXT_PUBLIC_USE_FUNCTIONS=false

# Add your Firebase config if using
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
# ... etc
```

### Customizing for Your Project

1. **Update CLAUDE.md** with your project-specific rules
2. **Modify theme** in `src/app/globals.css`
3. **Add your components** to `src/components/ui/`
4. **Configure metadata** in `src/app/layout.tsx`

## Best Practices

### 1. Always Start with Specifications
```bash
# Good ✅
/transpose @examples/feature.tsx
# Then let AI build

# Bad ❌
"Build me a user dashboard with charts and..."
```

### 2. Use Session Management
```bash
# Good ✅
/session:start complex-feature
# ... work ...
/session:update   # Regular checkpoints
/session:end

# Bad ❌
# Working without sessions = losing progress
```

### 3. Follow the Structure
```bash
# Good ✅
components/features/dashboard/
services/dashboard/

# Bad ❌
app/dashboard/components/  # Never put components in app!
```

### 4. Leverage Mock Services
- Start with mock auth/data
- No Firebase setup required
- Switch to real services when ready

## Common Patterns

### Building a CRUD Feature

1. Design your UI in `examples/`
2. Run `/transpose` to generate spec
3. Let AI build:
   - Data types in `types/`
   - Service layer in `services/`
   - Components in `components/`
   - Page in `app/`

### Adding Authentication

1. Use built-in mock auth to start
2. Build your UI with mock data
3. Enable Firebase when ready:
   ```env
   NEXT_PUBLIC_USE_FIREBASE_AUTH=true
   ```

### Creating Reusable Components

1. Check `components/ui/` first
2. Build in `components/features/`
3. Use consistent patterns
4. Export from index files

## Troubleshooting

### "AI is building the wrong thing"
→ You need a specification! Use `/transpose` or `/breakdown`

### "Lost context mid-development"
→ Use `/session:update` regularly, then `/context-prime` in new chat

### "High token usage"
→ Specifications reduce tokens by 50%+ - always start there

### "Can't find the right file structure"
→ Follow the patterns in `src/` - AI knows these patterns

### "Build errors"
→ Run `npm run build` to catch TypeScript/ESLint issues

## Next Steps

1. **Explore Examples**: Check `examples/` for patterns
2. **Read the Specs**: Look at `specs/` for specification examples
3. **Join Community**: Get help and share your builds
4. **Build Something**: The best way to learn is by doing!

## Getting Help

- **Documentation**: You're here! 
- **GitHub Issues**: [Report bugs or request features](https://github.com/pittmanluke/vibespec/issues)
- **Discord Community**: [Join for real-time help](#)
- **Twitter**: [@vibespec](#) for updates

---

Ready to build? Let's create something amazing together! 🚀