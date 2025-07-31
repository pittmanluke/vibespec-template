# VibeSpec Template

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](./LICENSE)
[![Claude Code](https://img.shields.io/badge/Claude_Code-Ready-purple?style=flat-square)](https://claude.ai)

A production-ready Next.js template optimized for AI-assisted development. Start building your MVP in minutes.

> **Learn more**: Visit [vibespec.dev](https://vibespec.dev) for detailed documentation and guides.

## 🚀 Quick Start

```bash
# Create a new project
npx create-next-app@latest my-app --example github.com/pittmanluke/vibespec-template
cd my-app

# Install dependencies
npm install

# Set up environment
cp .env.local.example .env.local

# Start developing
npm run dev
```

Visit `http://localhost:3000` to see your app.

## ✨ Features

- **Next.js 15** with App Router
- **TypeScript** with strict mode
- **Tailwind CSS v4** for styling
- **Authentication** ready (Firebase optional)
- **30+ UI Components** from shadcn/ui
- **Dark Mode** support
- **AI-Optimized** for Claude Code

## 📁 Project Structure

```
src/
├── app/              # Next.js pages and routes
├── components/       # Reusable UI components
├── services/         # Business logic and APIs
├── providers/        # React context providers
├── hooks/           # Custom React hooks
├── lib/             # Utility functions
├── types/           # TypeScript definitions
└── config/          # App configuration
```

## 🔧 Configuration

### Environment Variables

The template uses feature flags to toggle Firebase services:

```env
# Use mock services (default)
NEXT_PUBLIC_USE_FIREBASE_AUTH=false
NEXT_PUBLIC_USE_FIRESTORE=false
NEXT_PUBLIC_USE_STORAGE=false

# Or enable Firebase (requires configuration)
NEXT_PUBLIC_USE_FIREBASE_AUTH=true
# Add Firebase config values...
```

### Mock Services

By default, the template uses mock services for development:
- Mock authentication (any email/password works)
- Data persists in localStorage
- No external dependencies required

## 📚 Documentation

- [Getting Started](./vibespec/getting-started.md)
- [Architecture Guide](./vibespec/architecture-principles.md)
- [AI Workflow Guide](./vibespec/ai-workflow-guide.md)
- [Full Documentation](https://vibespec.dev)

## 🤖 Claude Code Integration

This template includes:
- Custom commands for workflow automation
- AI sub-agents for quality control
- Structured project organization
- Session management tools

Available commands:
- `/adapt` - Customize for your project
- `/context-prime` - Load project context
- `/session:start` - Begin development session
- `/transpose` - Convert designs to specs

## 🚢 Deployment

### Vercel (Recommended)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/pittmanluke/vibespec-template)

### Other Platforms
- Firebase Hosting
- Netlify
- AWS Amplify
- Any Next.js compatible platform

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

---

Built with ❤️ by the VibeSpec team. Happy coding!