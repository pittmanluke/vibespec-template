# VibeSpec

Spec-driven development for agentic coding. Ship MVPs faster with AI that actually works.

## Quick Start

```bash
npx create-next-app@latest my-app --example github.com/yourusername/vibespec
cd my-app
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) - you're building!

## What is VibeSpec?

A Next.js starter designed for founders using AI tools. Features:
- **Claude Code native** - Built-in commands and workflows
- **Specification system** - AI builds what you actually want  
- **Zero setup** - Start coding in 5 minutes
- **Beautiful UI** - 40+ components, dark mode ready

## Two Ways to Build

### Start with Design
```bash
claude
/transpose @examples/your-mockup.tsx
# Generates specification from your design
# AI builds exactly what you showed it
```

### Start with Specs
```bash
claude  
/breakdown @specs/your-idea.md
# Creates phased implementation plan
# Build systematically, ship incrementally
```

## Core Commands

- `/transpose` - Transform designs to specifications
- `/breakdown` - Break PRDs into implementation phases
- `/session:start` - Begin tracked development session
- `/session:update` - Save progress checkpoint
- `/context-prime` - Load project structure into AI

## Project Structure

```
src/
├── app/          # Pages (Next.js 15)
├── components/   # UI components  
├── services/     # Business logic
└── specs/        # Your specifications

Key directories:
├── examples/     # Design examples
├── plans/        # Implementation plans
└── docs/         # Documentation
```

## Tech Stack

- Next.js 15 + React 19
- TypeScript + Tailwind CSS v4
- Claude Code optimized
- Local-first development
- Firebase ready (when you need it)

## Links

- [Full Documentation](./docs)
- [AI Development Guide](./ai-development-guide.md)
- [Example Projects](./examples)
- [Discord Community](https://discord.gg/vibespec)

## License

MIT - Build something amazing!

---
*Built by founders, for founders. Ship faster with VibeSpec.*