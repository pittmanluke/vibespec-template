# Tech Stack

This document details the technical stack and configuration for VibeSpec projects.

## Core Technologies

### Next.js 15
- **Version**: 15.x with App Router
- **Features**: 
  - Server Components by default
  - Parallel routes and intercepting routes
  - Built-in optimizations
  - Edge runtime support

### TypeScript 5.x
- **Configuration**: Strict mode enabled
- **Key Settings**:
  ```json
  {
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true,
    "strictNullChecks": true,
    "noImplicitAny": true
  }
  ```
- **Build Validation**: TypeScript errors block builds
- **No Skipping**: Cannot bypass type checking

### React 19
- **Version**: 19.x (Release Candidate)
- **Important Notes**:
  - Some peer dependency warnings are expected
  - Use `--legacy-peer-deps` when installing packages
  - All components work correctly despite warnings
  - New features like `use()` hook available

### Tailwind CSS v4
- **Version**: 4.x (Beta)
- **Key Changes**:
  - Uses new `@theme` directive in CSS
  - No `tailwind.config.js` file needed
  - PostCSS configured with `@tailwindcss/postcss`
  - CSS-first configuration approach

#### Tailwind v4 Configuration
```css
/* In globals.css */
@import "tailwindcss";

@theme {
  /* Custom theme configuration */
  --color-primary: #0070f3;
  --radius: 0.5rem;
}
```

#### VS Code Settings
The project includes settings to disable CSS validation warnings:
```json
{
  "css.lint.unknownAtRules": "ignore",
  "css.lint.validProperties": ["composes"]
}
```

## Package Management

### Installation Commands
```bash
# Initial installation
npm install --legacy-peer-deps

# Adding new packages
npm install [package] --legacy-peer-deps

# Clean installation
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Common Peer Dependency Issues
- React 19 warnings with older packages
- TypeScript version mismatches
- Always use `--legacy-peer-deps` flag

## Build System

### Build Configuration
- **ESLint**: Runs on every build (no skipping)
- **TypeScript**: Full type checking (no skipping)
- **Output**: Optimized for production

### Build Commands
```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Type checking only
npm run typecheck

# Linting only
npm run lint
```

### Build Requirements
All builds must:
1. Pass TypeScript compilation
2. Pass ESLint checks
3. Have no console.log statements
4. Follow naming conventions
5. Import paths must be valid

## Development Environment

### Recommended Extensions
- TypeScript language support
- ESLint
- Prettier (optional)
- Tailwind CSS IntelliSense

### Environment Variables
```bash
# Firebase Feature Flags
NEXT_PUBLIC_USE_FIREBASE_AUTH=false
NEXT_PUBLIC_USE_FIRESTORE=false
NEXT_PUBLIC_USE_STORAGE=false
NEXT_PUBLIC_USE_FUNCTIONS=false

# Firebase Config (when enabled)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## UI Components

### shadcn/ui
- **Version**: Latest
- **Components**: 40+ pre-built components
- **Styling**: Tailwind CSS based
- **Customization**: Fully customizable
- **Location**: `/src/components/ui/`

### Component Installation
```bash
# Add new shadcn/ui component
npx shadcn@latest add [component-name]

# Example
npx shadcn@latest add button
npx shadcn@latest add card
```

## State Management

### React Context
- Primary state management solution
- Providers in `/src/providers/`
- Use hooks for consumption

### Local Storage
- Session persistence
- User preferences
- Mock service data

## Styling Architecture

### CSS Organization
1. **Global Styles**: `/src/app/globals.css`
2. **Component Styles**: Tailwind utilities inline
3. **Theme Variables**: CSS custom properties
4. **No CSS Modules**: Use Tailwind exclusively

### Dark Mode
- System preference detection
- Manual toggle support
- CSS variables for theming
- Persistent user preference

## Performance Optimizations

### Built-in Next.js Features
- Automatic code splitting
- Image optimization
- Font optimization
- Prefetching
- Static generation where possible

### Manual Optimizations
- Lazy loading components
- Debounced inputs
- Memoized expensive computations
- Virtual scrolling for long lists

## Security Considerations

### TypeScript Strict Mode
- Prevents common security issues
- Null safety
- Type safety
- No implicit any

### Environment Variables
- Client variables prefixed with `NEXT_PUBLIC_`
- Server variables kept secret
- No sensitive data in client bundles

## Browser Support

### Minimum Requirements
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Progressive Enhancement
- Core functionality without JavaScript
- Enhanced features with JS
- Graceful degradation

## Testing Philosophy

### Manual Testing
- Primary testing approach
- Test in development
- Test with mock services
- Test with real services

### No Automated Tests
- No unit tests required
- No integration tests required
- No E2E tests required
- Focus on shipping features

## Deployment Targets

### Supported Platforms
1. **Vercel** (recommended)
2. **Firebase Hosting**
3. **Any Node.js host**
4. **Edge platforms**

### Build Output
- Optimized for serverless
- Static where possible
- API routes supported
- Edge functions ready

## Version Management

### Dependency Updates
- Conservative approach
- Test thoroughly before updating
- Use exact versions in package.json
- Document breaking changes

### Node Version
- Minimum: 18.17
- Recommended: 20.x
- Use `.nvmrc` for consistency

## Future Considerations

### Planned Updates
- React 19 stable release
- Tailwind CSS v4 stable
- Next.js minor updates
- Performance improvements

### Migration Path
- Document all custom code
- Keep dependencies minimal
- Follow official migration guides
- Test incrementally