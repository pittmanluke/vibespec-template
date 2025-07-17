# Next.js Firebase Template

A production-ready template for building web applications with Next.js 15, Firebase, and shadcn/ui. Features a flexible architecture with mock services for development and optional Firebase integration.

> **For AI Development**: If you're using AI assistants (Claude, Cursor, etc.), check out:
> - [AI Development Guide](./ai-development-guide.md) - Best practices for AI-assisted development
> - [AI Workflow Guide](./ai-workflow-guide.md) - Comprehensive workflow from planning to deployment
> - [Workflow Quick Reference](./workflow-quickstart.md) - Commands and quick tips

## Features

- 🔐 **Flexible Authentication** - Mock auth for development, Firebase Auth for production
- 🎨 **Beautiful UI** - 40+ shadcn/ui components with dark mode support
- 🔥 **Optional Firebase** - Toggle Firebase services on/off with feature flags
- 📱 **Responsive Design** - Mobile-first approach with Tailwind CSS v4
- 🛡️ **Type Safety** - Full TypeScript support with strict validation
- 🚀 **Production Ready** - SEO optimized, performance focused
- 🔧 **Developer Experience** - Zero-config development with mock services
- 🏗️ **Clean Architecture** - Well-organized file structure with clear separation of concerns

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Authentication**: Firebase Auth (optional) / Mock Auth
- **Database**: Firestore (optional)
- **Storage**: Firebase Storage (optional)
- **Functions**: Firebase Cloud Functions (optional)
- **Language**: TypeScript
- **Package Manager**: npm

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase account (optional)

### Quick Start (No Firebase Required)

1. Clone this template:
```bash
git clone <your-repo-url>
cd template-app
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment template:
```bash
cp .env.local.example .env.local
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app running with mock services!

### Enabling Firebase Services

To use real Firebase services instead of mocks:

1. Create a new Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable desired services (Authentication, Firestore, Storage)
3. Update `.env.local` with your Firebase configuration
4. Set the feature flags to `true`:
   ```env
   NEXT_PUBLIC_USE_FIREBASE_AUTH=true
   NEXT_PUBLIC_USE_FIRESTORE=true
   NEXT_PUBLIC_USE_STORAGE=true
   ```

## Project Structure

```
template-app/
├── src/
│   ├── app/                    # Next.js app directory (pages only)
│   │   ├── auth/               # Authentication pages
│   │   │   ├── login/          # Login page
│   │   │   └── signup/         # Signup page
│   │   ├── dashboard/          # Protected dashboard page
│   │   ├── globals.css         # Global styles with Tailwind v4
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   ├── components/             # Reusable UI components
│   │   ├── auth/               # Authentication components
│   │   ├── theme/              # Theme-related components
│   │   │   └── mode-toggle.tsx # Dark mode toggle
│   │   └── ui/                 # shadcn/ui components
│   ├── config/                 # Configuration files
│   │   ├── app.config.ts       # App configuration
│   │   ├── firebase.config.ts  # Firebase feature flags
│   │   └── locale.config.ts    # Locale settings
│   ├── hooks/                  # Custom React hooks
│   │   └── use-toast.ts        # Toast notifications
│   ├── lib/                    # Utility functions and core libs
│   │   ├── firebase.ts         # Firebase initialization
│   │   ├── feature-flags.ts    # Feature flag utilities
│   │   ├── styles/             # Style utilities
│   │   └── utils.ts            # General utilities
│   ├── providers/              # All React Context providers
│   │   ├── auth-provider.tsx   # Authentication context
│   │   ├── online-status-provider.tsx # Online status
│   │   └── theme-provider.tsx  # Theme context
│   ├── services/               # Business logic and API services
│   │   └── auth/               # Authentication service
│   │       ├── auth-service.ts # Auth business logic
│   │       ├── mock/           # Mock auth implementation
│   │       └── use-auth-form.ts # Auth form hook
│   └── types/                  # TypeScript type definitions
│       ├── auth.ts             # Auth types
│       ├── common.ts           # Common types
│       └── user.ts             # User types
├── docs/                       # Reference documents for the project
├── examples/                   # Example files and exported artifacts
├── functions/                  # Firebase Cloud Functions
├── plans/                      # Detailed task plans created during development
├── public/                     # Static assets
├── specs/                      # Feature specifications and PRDs
├── .env.local.example          # Environment template
├── .eslintrc.json              # ESLint configuration
├── .vscode/                    # VS Code settings
│   └── settings.json           # Editor configuration
├── firebase.json               # Firebase configuration
├── firestore.rules             # Security rules
├── next.config.ts              # Next.js configuration
├── postcss.config.js           # PostCSS with Tailwind v4
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript compiler check
- `npm run emulators` - Start Firebase emulators
- `npm run emulators:export` - Export emulator data

## Authentication

The template includes a flexible authentication system that works with or without Firebase:

### Features
- Email/password authentication
- Google OAuth integration
- Protected routes with `ProtectedRoute` component
- Role-based access control (user/admin)
- Auth state management with React Context
- Mock authentication for development
- Persistent sessions (localStorage in dev, Firebase in prod)

### Usage

```tsx
import { useAuth } from '@/services/auth';

function MyComponent() {
  const { user, loading, signIn, signOut } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  if (!user) {
    return <button onClick={() => signIn(email, password)}>Login</button>;
  }
  
  return <div>Welcome {user.email}!</div>;
}
```

### Mock Authentication
When `NEXT_PUBLIC_USE_FIREBASE_AUTH=false`, the app uses mock authentication:
- Any email/password combination works
- Emails containing "admin" get admin role
- Sessions persist in localStorage
- Perfect for UI development and testing

## UI Components

This template uses shadcn/ui components with Tailwind CSS v4. To add new components:

```bash
npx shadcn-ui@latest add [component-name]
```

### Included Components
- Forms (input, button, select, etc.)
- Layout (card, dialog, sheet, etc.)
- Feedback (alert, toast, skeleton, etc.)
- Navigation (tabs, dropdown, etc.)
- Data display (table, avatar, badge, etc.)

## Environment Variables

```env
# Firebase Configuration (optional - only needed if using Firebase)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# Firebase Feature Flags
NEXT_PUBLIC_USE_FIREBASE_AUTH=false        # Set to true to use Firebase Auth
NEXT_PUBLIC_USE_FIRESTORE=false           # Set to true to use Firestore
NEXT_PUBLIC_USE_STORAGE=false             # Set to true to use Firebase Storage
NEXT_PUBLIC_USE_FUNCTIONS=false           # Set to true to use Cloud Functions
NEXT_PUBLIC_USE_EMULATORS=false           # Set to true to use Firebase emulators
```

## Customization

### Theme
The template uses Tailwind CSS v4 with CSS variables. Edit `src/app/globals.css`:

```css
@theme {
  /* Customize your theme tokens */
  --color-primary: var(--primary);
  --radius-lg: var(--radius);
}

:root {
  /* Using modern oklch color space */
  --primary: oklch(0.21 0.006 285.885);
  --background: oklch(1 0 0);
  /* ... other colors */
}
```

### Adding New Features
1. Create new routes in `src/app/`
2. Add services in `src/services/`
3. Create reusable components in `src/components/`
4. Add providers in `src/providers/`
5. Define types in `src/types/`

## Code Style

### Naming Conventions
- **Files**: kebab-case (e.g., `auth-provider.tsx`, `use-auth-form.ts`)
- **Directories**: kebab-case
- **Components**: PascalCase exports (e.g., `export function AuthProvider`)
- **Utilities**: camelCase functions
- **Types**: PascalCase interfaces and types

### Best Practices
- Use TypeScript strict mode
- Follow ESLint rules (run `npm run lint`)
- Ensure builds pass before committing (`npm run build`)

## Development Workflow

### Quick Start Development
1. Start with mock services (no Firebase setup required)
2. Use feature flags to gradually enable Firebase services
3. Test different user roles: emails with "admin" get admin access
4. Deploy with real Firebase when ready

### AI-Assisted Development
This template is optimized for AI-assisted development with Claude:

1. **Start a session**: `claude` → `/session:start`
2. **Convert artifacts**: `/transpose @examples/[file].tsx`
3. **Break down PRDs**: `/breakdown @specs/[prd].md`
4. **Track progress**: `/session:update`

See the [AI Workflow Guide](./ai-workflow-guide.md) for detailed instructions.

### VS Code Setup
The project includes optimized VS Code settings:
- Tailwind CSS IntelliSense pre-configured
- CSS validation properly handled for Tailwind v4
- ESLint and TypeScript integration

### Architecture Guidelines
- **Pages**: `/app` directory (Next.js pages only)
- **Business Logic**: `/services` (API calls, data processing)
- **UI Components**: `/components` (reusable React components)
- **State Management**: `/providers` (React Context providers)
- **Configuration**: `/config` (app settings, constants)
- **Type Definitions**: `/types` (TypeScript interfaces)
- **Documentation**: `/docs` (reference documents)
- **Specifications**: `/specs` (PRDs and feature specs)
- **Plans**: `/plans` (implementation plans)
- **Examples**: `/examples` (artifacts and samples)

## Deployment

### Deploy to Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables
4. Deploy

### Deploy to Firebase Hosting
```bash
npm run build
firebase deploy
```

## Troubleshooting

### Common Issues

1. **CSS warnings in VS Code**
   - Already configured in `.vscode/settings.json`
   - Reload VS Code window if needed

2. **Firebase connection errors**
   - Check feature flags in `.env.local`
   - Ensure Firebase configuration is correct
   - Try with mock services first

3. **Build errors**
   - Run `npm run build` to catch TypeScript errors
   - Check that all imports use new paths
   - Clear `.next` folder and rebuild

4. **Authentication not working**
   - Check `NEXT_PUBLIC_USE_FIREBASE_AUTH` flag
   - For Firebase: Enable providers in console
   - For mock: Check browser localStorage

## Contributing

Contributions are welcome! Please:
1. Follow the established file structure and naming conventions
2. Ensure all TypeScript types are properly defined
3. Run `npm run build` and `npm run lint` before submitting
4. Keep the architecture clean and maintainable

For detailed technical guidelines, see [CLAUDE.md](./CLAUDE.md).

## License

This project is licensed under the MIT License.

## Support

For issues and feature requests, please use the GitHub issue tracker.