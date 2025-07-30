# VibeSpec Template

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](./LICENSE)
[![Claude Code](https://img.shields.io/badge/Claude_Code-Ready-purple?style=flat-square)](https://claude.ai)

A production-ready Next.js template optimized for AI-assisted development. Build your MVP faster with structured workflows, Firebase integration, and Claude Code optimization.

> **Note**: This is the template repository. For the VibeSpec landing page and documentation site, visit [vibespec.dev](https://vibespec.dev).

## ✨ What Makes This Special

### 🤖 AI-First Development
- **Built for Claude Code**: Optimized project structure and documentation
- **Smart Sub-Agents**: Automated quality control and workflow assistance
- **Session Management**: Track development progress across sessions
- **Structured Workflows**: Consistent patterns that AI understands

### 🚀 Production Ready
- **Next.js 15**: Latest features with App Router
- **TypeScript**: Full type safety with strict mode
- **Tailwind CSS v4**: Modern styling with new features
- **Firebase Ready**: Optional integration with feature flags

### 🛠️ Developer Experience
- **Zero Config Start**: Works out of the box with mock services
- **Feature Flags**: Toggle Firebase services on/off
- **Clean Architecture**: Organized file structure
- **Quality Built-in**: ESLint, TypeScript, and formatting configured

## 🚀 Quick Start

```bash
# Create a new project
npx create-next-app@latest my-app --example github.com/vibespec/vibespec-template
cd my-app

# Install dependencies
npm install

# Set up environment
cp .env.local.example .env.local

# Start developing
npm run dev
```

Visit `http://localhost:3000` to see your app.

## 📁 Project Structure

```
src/
├── app/              # Next.js pages and routes
├── components/       # Reusable UI components
│   ├── ui/          # Base UI components (Button, Card, etc.)
│   └── auth/        # Authentication components
├── services/         # Business logic and APIs
│   └── auth/        # Auth service with mock fallback
├── providers/        # React context providers
├── hooks/           # Custom React hooks
├── lib/             # Utility functions
├── types/           # TypeScript type definitions
└── config/          # App configuration

vibespec/            # VibeSpec methodology docs
.claude/             # Claude Code configuration
├── agents/          # AI sub-agents for automation
├── commands/        # Custom Claude commands
└── sessions/        # Development session tracking
```

## 🔧 Key Features

### Authentication System
- Firebase Auth integration (optional)
- Mock authentication for development
- Protected routes
- User management
- Social login support

### UI Components
- 30+ pre-built components from shadcn/ui
- Dark mode support
- Responsive design
- Accessibility built-in
- Customizable with Tailwind

### Development Tools
- Hot reload
- TypeScript checking
- ESLint with auto-fix
- Prettier formatting
- Git hooks with Husky

### Firebase Integration
Enable any combination of services:
- Authentication
- Firestore Database
- Cloud Storage
- Cloud Functions

## 🎯 Usage Examples

### Authentication
```typescript
import { useAuth } from '@/services/auth';

function MyComponent() {
  const { user, signIn, signOut } = useAuth();
  
  if (!user) {
    return <button onClick={() => signIn(email, password)}>Login</button>;
  }
  
  return <div>Welcome {user.email}!</div>;
}
```

### Protected Routes
```typescript
import ProtectedRoute from '@/components/auth/protected-route';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <YourProtectedContent />
    </ProtectedRoute>
  );
}
```

### Feature Flags
```env
# .env.local
NEXT_PUBLIC_USE_FIREBASE_AUTH=false  # Use mock auth
NEXT_PUBLIC_USE_FIRESTORE=true       # Use real Firestore
```

## 🤖 Claude Code Integration

This template is optimized for AI-assisted development:

### Available Commands
- `/adapt` - Customize template for your project
- `/context-prime` - Load project context
- `/session:start` - Begin tracked development session
- `/transpose` - Convert designs to specifications
- `/breakdown` - Break specs into implementation tasks

### Sub-Agents
Automated assistants that help maintain quality:
- **spec-alignment-guardian** - Ensures implementation matches specs
- **velocity-guardian** - Prevents scope creep
- **ui-enhancement-specialist** - Improves UI components
- **vibespec-compliance-validator** - Enforces conventions

## 📚 Documentation

- [Getting Started Guide](./vibespec/getting-started.md)
- [Architecture Principles](./vibespec/architecture-principles.md)
- [AI Workflow Guide](./vibespec/ai-workflow-guide.md)
- [Development Workflow](./vibespec/development-workflow.md)

## 🚢 Deployment

### Vercel (Recommended)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vibespec/vibespec-template)

### Other Platforms
Works with any Next.js compatible platform:
- Firebase Hosting
- Netlify
- AWS Amplify
- Railway
- Render

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Setup
```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/vibespec-template.git
cd vibespec-template

# Install dependencies
npm install

# Create feature branch
git checkout -b feature/amazing-feature

# Make changes and test
npm run dev
npm run build
npm run lint

# Submit PR
```

## 📈 Roadmap

- [ ] More UI component variants
- [ ] Additional auth providers
- [ ] Internationalization support
- [ ] E2E testing setup
- [ ] Docker configuration
- [ ] More sub-agents

## 💬 Community

- [Discord](https://discord.gg/vibespec)
- [GitHub Discussions](https://github.com/vibespec/vibespec-template/discussions)
- [Twitter](https://twitter.com/vibespec)

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com) for the component system
- [Next.js](https://nextjs.org) team for the amazing framework
- [Vercel](https://vercel.com) for hosting and deployment
- [Claude](https://claude.ai) for AI assistance

---

Built with ❤️ by the VibeSpec team. Happy coding!