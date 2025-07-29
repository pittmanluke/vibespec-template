# VibeSpec

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](./LICENSE)
[![Claude Code](https://img.shields.io/badge/Claude_Code-Ready-purple?style=flat-square)](https://claude.ai)

A template for spec-driven AI-assisted coding. Specifications first, code second.Build MVPs faster with Claude Code and structured workflows.

## Overview

VibeSpec is a Next.js starter specifically designed for founders and developers building with AI assistants like Claude Code. It solves the fundamental problems of AI-assisted development through a specification-first approach that ensures AI builds exactly what you envision.

### Why VibeSpec?

- **Specification-driven**: AI confusion eliminated through clear specs
- **Token efficient**: Reduce API costs by 50% with structured workflows  
- **Context aware**: Never lose progress to context window limits
- **Founder focused**: Ship MVPs in days, not months
- **Production ready**: Beautiful UI, TypeScript, all the essentials

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm (or yarn/pnpm)
- Git

### Quick Start

1. **Create your project**
   ```bash
   npx create-next-app@latest my-startup --example github.com/pittmanluke/vibespec
   cd my-startup
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start developing**
   ```bash
   npm run dev
   ```

4. **Open Claude Code**
   ```bash
   claude
   /context-prime  # Load project structure
   /session:start  # Begin tracked session
   ```

You're now ready to build with AI assistance!

## Core Concepts

### Specification-First Development

VibeSpec revolutionizes AI coding through specifications—structured documents that tell AI exactly what to build. No more prompt engineering, no more confusion.

### Two Development Paths

#### 1. Design-First Development
Perfect when you have mockups or UI examples:

```bash
# Save your design to examples/
claude
/transpose @examples/dashboard-mockup.tsx
# Creates: specs/dashboard-specification.md
# Now AI understands exactly what to build
```

#### 2. Spec-First Development  
Ideal when you have requirements or user stories:

```bash
# Write your requirements in specs/
claude
/breakdown @specs/user-authentication.md
# Creates: plans/implement-authentication.md
# Phased plan for systematic development
```

## Key Features

### 🤖 Claude Code Integration
- Custom commands pre-configured
- Optimized prompts and workflows
- MCP server compatibility
- Session management built-in

### 📋 Specification System
- Transform designs to specs automatically
- Break down PRDs into actionable tasks
- Ensure consistent AI output
- Reusable specification templates

### 🎨 Beautiful UI Out-of-Box
- 40+ shadcn/ui components
- Dark mode support
- Responsive design
- Tailwind CSS v4

### 🏗️ Smart Architecture
- Enforced file structure AI understands
- TypeScript with strict mode
- Local-first development
- Progressive enhancement

### ⚡ Developer Experience
- Zero configuration required
- Hot reload everything
- Clear error messages
- Git-friendly workflow

## Project Structure

```
vibespec/
├── src/
│   ├── app/              # Next.js pages (routes only)
│   ├── components/       # Reusable UI components
│   │   ├── ui/          # Base shadcn components
│   │   └── features/    # Feature-specific components
│   ├── services/        # Business logic layer
│   ├── lib/            # Utilities and helpers
│   ├── hooks/          # Custom React hooks
│   ├── types/          # TypeScript definitions
│   └── config/         # App configuration
│
├── specs/              # Specifications (your source of truth)
├── plans/              # Implementation plans
├── examples/           # UI examples and mockups
├── docs/              # Additional documentation
└── .claude/           # Claude Code configuration
```

### Key Directories Explained

- **specs/**: Where specifications live. These drive your development.
- **plans/**: Implementation plans created by `/breakdown` command
- **examples/**: UI mockups and examples for `/transpose` command
- **.claude/**: Custom commands and Claude Code configuration

## Available Commands

### Claude Code Commands
- `/context-prime` - Load project context
- `/session:start` - Begin development session
- `/session:update` - Checkpoint your progress
- `/session:end` - Close session with summary
- `/transpose @file` - Convert design to specification
- `/breakdown @spec` - Create implementation plan

### Development Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Check TypeScript
```

## Common Workflows

### Building a New Feature

1. **Define what you want**
   - Option A: Create a mockup in `examples/`
   - Option B: Write requirements in `specs/`

2. **Generate specification**
   ```bash
   claude
   /transpose @examples/feature.tsx  # If you have mockup
   # OR
   /breakdown @specs/feature.md      # If you have requirements
   ```

3. **Build with AI**
   - AI now has clear specifications
   - Builds exactly what you defined
   - No confusion or rewrites

4. **Ship it**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   npm run build  # Verify everything works
   ```

### Managing Long Sessions

When working on complex features:

```bash
claude
/session:start my-feature

# Work on your feature...
# After significant progress:
/session:update

# If context window fills:
# Start new conversation
/context-prime  # Reload context
# Continue where you left off

/session:end  # When complete
```

## Best Practices

1. **Always start with specifications**
   - Clear specs = consistent results
   - Reduces token usage significantly

2. **Use session management**
   - Track progress on complex features
   - Never lose work to context limits

3. **Leverage the structure**
   - Follow established patterns
   - AI works better with consistency

4. **Build incrementally**
   - Ship small features often
   - Get user feedback early

## Troubleshooting

### AI generates inconsistent code
→ Ensure you're using specifications via `/transpose` or `/breakdown`

### Lost context mid-development  
→ Use `/session:update` regularly and `/context-prime` to restore

### Slow development speed
→ Check if you're fighting the structure - follow VibeSpec patterns

### High token usage
→ Specifications reduce token usage by 50% - always start there

## Tech Stack Details

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui
- **React**: Version 19
- **Node**: 18.17+

## Contributing

We welcome contributions! Please:
1. Follow the established file structure
2. Use specifications for new features
3. Test with Claude Code
4. Submit PRs with clear descriptions

## Resources

- [Full Documentation](./docs)
- [AI Development Guide](./ai-development-guide.md)
- [AI Workflow Guide](./ai-workflow-guide.md)
- [Example Projects](./examples)
- [Discord Community](#)
- [Video Tutorials](#)

## Support

- **Discord**: [Join our community](#)
- **Issues**: [GitHub Issues](https://github.com/pittmanluke/vibespec/issues)
- **Twitter**: [@vibespec](#)

## License

MIT License - see [LICENSE](./LICENSE) for details

---

**Built by founders, for founders.** VibeSpec is the result of thousands of hours building with AI. We've made every mistake so you don't have to.

Ready to ship? Let's build something amazing together! 🚀