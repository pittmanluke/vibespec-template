# VibeSpec Template

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](./LICENSE)
[![Claude Code](https://img.shields.io/badge/Claude_Code-Ready-purple?style=flat-square)](https://claude.ai)

A production-ready Next.js template optimized for AI-assisted development. Build your MVP faster with structured workflows, Firebase integration, and Claude Code optimization.

## ✨ Features

### 🚀 Core Features
- **Next.js 15** with App Router and Server Components
- **TypeScript** with strict mode for type safety
- **Tailwind CSS v4** for modern styling
- **Authentication** ready with Firebase Auth or mock service
- **Dark Mode** with next-themes
- **Responsive Design** mobile-first approach

### 🔥 Firebase Integration (Optional)
- **Feature Flags** - Toggle Firebase services on/off
- **Mock Services** - Develop without Firebase setup
- **Authentication** - Email/password, Google, GitHub
- **Firestore** - NoSQL database
- **Cloud Storage** - File uploads
- **Cloud Functions** - Serverless backend

### 🤖 AI Development Ready
- **Claude Code Optimized** - Built for AI pair programming
- **VibeSpec Methodology** - Specification-first development
- **Sub-Agents** - Automated quality control
- **Structured Workflows** - Consistent patterns
- **Session Management** - Track development progress

### 🛠️ Developer Experience
- **ESLint & TypeScript** - Catch errors early
- **Organized Structure** - Clear file organization
- **Component Library** - Pre-built UI components
- **Protected Routes** - Authentication guards
- **Form Handling** - React Hook Form + Zod
- **Error Boundaries** - Graceful error handling

## 🚀 Quick Start

### Prerequisites
- Node.js 18.17 or later
- npm, yarn, or pnpm
- Git

### Installation

1. **Clone the template**
   ```bash
   npx create-next-app@latest my-app --example github.com/vibespec/vibespec-template
   cd my-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
src/
├── app/              # Next.js pages and routes
├── components/       # Reusable UI components
│   ├── ui/          # Base UI components
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
├── agents/          # AI sub-agents
├── commands/        # Custom commands
└── sessions/        # Development sessions
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with:

```env
# Firebase Feature Flags (set to true to enable)
NEXT_PUBLIC_USE_FIREBASE_AUTH=false
NEXT_PUBLIC_USE_FIRESTORE=false
NEXT_PUBLIC_USE_STORAGE=false
NEXT_PUBLIC_USE_FUNCTIONS=false

# Firebase Config (required if using Firebase)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# App Configuration
NEXT_PUBLIC_APP_NAME=My App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Feature Flags

Toggle Firebase services without code changes:

- **Mock Mode** (default): All flags `false`, uses mock services
- **Firebase Mode**: Set flags to `true`, requires Firebase config
- **Hybrid Mode**: Enable specific services as needed

## 🎯 Usage

### Authentication

The template includes a complete auth flow:

```typescript
// Using the auth service
import { useAuth } from '@/services/auth';

function MyComponent() {
  const { user, signIn, signOut } = useAuth();
  
  // User is typed and ready to use
  if (user) {
    return <div>Welcome {user.email}</div>;
  }
}
```

### Protected Routes

Wrap pages that require authentication:

```typescript
import ProtectedRoute from '@/components/auth/protected-route';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
```

### Adding New Features

1. **Create specifications** in `/specs/`
2. **Plan implementation** in `/plans/`
3. **Build with AI assistance** using Claude Code
4. **Document patterns** for future reference

## 🤖 AI Development

### Claude Code Integration

This template is optimized for Claude Code:

1. **Context-Aware**: CLAUDE.md provides project context
2. **Commands Ready**: Custom commands in `.claude/commands/`
3. **Sub-Agents**: Automated quality checks
4. **Session Tracking**: Development progress saved

### Available Commands

- `/adapt` - Customize template for your project
- `/context-prime` - Load project context
- `/session:start` - Begin development session
- `/session:update` - Track progress
- `/session:end` - Close session with summary

### VibeSpec Methodology

1. **Specification First**: Define before coding
2. **Structured Approach**: Consistent patterns
3. **AI Collaboration**: Let Claude handle implementation
4. **Quality Control**: Sub-agents ensure standards

## 📚 Documentation

### Template Guides
- [Getting Started](./vibespec/getting-started.md)
- [Project Structure](./vibespec/project-structure.md)
- [Development Workflow](./vibespec/development-workflow.md)
- [AI Workflow Guide](./vibespec/ai-workflow-guide.md)

### Reference
- [Architecture Principles](./vibespec/architecture-principles.md)
- [Naming Conventions](./vibespec/naming-conventions.md)
- [Code Quality Standards](./vibespec/code-quality.md)
- [Feature Flags](./vibespec/feature-flags.md)

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vibespec/vibespec-template)

### Other Platforms

The template works with any platform supporting Next.js:
- Firebase Hosting
- Netlify
- AWS Amplify
- Self-hosted

## 🛡️ Best Practices

### Code Organization
- Keep pages in `/app` only
- Business logic in `/services`
- UI components in `/components`
- Shared state in `/providers`

### Naming Conventions
- Files: `kebab-case.tsx`
- Components: `PascalCase`
- Utilities: `camelCase`
- No exceptions

### Development Flow
1. Start with mock services
2. Build features incrementally
3. Enable Firebase when ready
4. Test thoroughly
5. Deploy with confidence

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) first.

### Development

1. Fork the repository
2. Create your feature branch
3. Follow the code standards
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- Built with the [VibeSpec methodology](https://vibespec.dev)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Optimized for [Claude Code](https://claude.ai)

## 🔗 Links

- [VibeSpec Website](https://vibespec.dev)
- [Template Repository](https://github.com/vibespec/vibespec-template)
- [Documentation](https://github.com/vibespec/vibespec-template/wiki)
- [Issues](https://github.com/vibespec/vibespec-template/issues)

---

Built with ❤️ by the VibeSpec team