# CLAUDE.md - AI Assistant Technical Context

**MANDATORY: This document contains strict rules and technical context for AI assistants. All rules must be followed without exception.**

> **Document Precedence**: User instructions > CLAUDE.md > VibeSpec Template Documentation

## VibeSpec Template Documentation

This project uses the VibeSpec template. For detailed template documentation, see:
- **Core Rules**: `vibespec/ai-assistant-rules.md` - The 12 strict rules for AI assistants
- **Architecture**: `vibespec/architecture-principles.md` - Core patterns and design principles
- **Project Structure**: `vibespec/project-structure.md` - Directory organization and file placement
- **Naming Conventions**: `vibespec/naming-conventions.md` - File and component naming rules
- **Tech Stack**: `vibespec/tech-stack.md` - Framework versions and configuration
- **Development Workflow**: `vibespec/development-workflow.md` - Common tasks and processes
- **Code Quality**: `vibespec/code-quality.md` - Standards and validation requirements
- **Feature Flags**: `vibespec/feature-flags.md` - Service toggling system
- **Claude Commands**: `vibespec/claude-commands.md` - Available automation commands
- **Sub-Agents**: `vibespec/sub-agents.md` - Specialized AI assistants for quality control

## Project Overview

This is a production-ready Next.js 15 template with optional Firebase integration. The key feature is its flexibility - developers can start immediately with mock services and enable Firebase features as needed.

**Note**: To adapt this documentation to your specific project after creating initial specifications, run `/adapt`.

## Key Architectural Decisions

### 1. Feature Flags for Firebase Services
All Firebase services can be toggled on/off via environment variables:
- `NEXT_PUBLIC_USE_FIREBASE_AUTH`
- `NEXT_PUBLIC_USE_FIRESTORE`
- `NEXT_PUBLIC_USE_STORAGE`
- `NEXT_PUBLIC_USE_FUNCTIONS`

This allows developers to:
- Start development without Firebase setup
- Gradually adopt Firebase services
- Test UI without backend dependencies

### 2. Mock Services Pattern
When Firebase is disabled, mock services provide the same API:
- `src/services/auth/mock/mock-auth-service.ts` - Mock authentication
- Sessions persist in localStorage
- Any email/password works
- Emails with "admin" get admin role

### 3. File Structure Organization
```
src/
├── app/           # Next.js pages ONLY
├── components/    # Reusable UI components
├── config/        # App configuration
├── hooks/         # Custom React hooks
├── lib/           # Utilities and core libraries
├── providers/     # ALL context providers
├── services/      # Business logic and APIs
└── types/         # TypeScript definitions

Project root:
├── docs/          # Reference documents
├── examples/      # Example files and artifacts
├── plans/         # Implementation plans
├── specs/         # Feature specifications and PRDs
└── .claude/       # Claude-specific configuration and commands
```

### 4. Naming Conventions
- **Files**: Always use kebab-case (e.g., `auth-provider.tsx`)
- **Directories**: Always use kebab-case
- **Components**: PascalCase exports
- **No exceptions** to these rules

## Important Technical Details

### Tailwind CSS v4
- Uses new `@theme` directive in CSS
- No `tailwind.config.js` file needed
- PostCSS configured with `@tailwindcss/postcss`
- VS Code settings disable CSS validation warnings

### React 19
- Project uses React 19 with some peer dependency warnings
- Use `--legacy-peer-deps` when installing packages
- All components work correctly with React 19

### TypeScript Configuration
- Strict mode enabled
- Build validates TypeScript (no skipping)
- ESLint runs on build (no skipping)

## Common Tasks

### Adding a New Provider
1. Create in `src/providers/` directory
2. Use kebab-case filename
3. Export from `src/providers/index.ts` if needed
4. Wrap in root layout if global

### Adding a New Service
1. Create in `src/services/` directory
2. Include mock implementation if Firebase-dependent
3. Use feature flags to switch between real/mock

### Adding New Components
1. UI primitives go in `src/components/ui/`
2. Feature components in `src/components/[feature]/`
3. Always use kebab-case for files

## Environment Setup

### Development (No Firebase)
```bash
cp .env.local.example .env.local
npm install
npm run dev
```

### Production (With Firebase)
1. Set Firebase config in `.env.local`
2. Set feature flags to `true`
3. Deploy to Vercel or Firebase Hosting

## Testing Approach

### Mock Services
- Test all UI flows with mock services
- Use different email patterns for roles
- Check localStorage for session persistence

### Firebase Services
- Enable one service at a time
- Test fallback to mock when disabled
- Verify Firebase rules work correctly

## Common Issues & Solutions

### Import Path Errors
- Use `@/` for src imports
- Services: `@/services/[service]`
- Providers: `@/providers/[provider]`
- Components: `@/components/[component]`

### TypeScript Errors
- Run `npm run build` to catch all errors
- Check that types are exported from index files
- Ensure all Firebase calls have null checks

### CSS/Tailwind Issues
- VS Code settings handle warnings
- Use `@theme` for new design tokens
- Check `globals.css` for custom CSS

## Development Workflow

1. **Start with Mock Services**
   - Faster development
   - No external dependencies
   - Test edge cases easily

2. **Enable Firebase Gradually**
   - One service at a time
   - Test both states (on/off)
   - Ensure graceful fallbacks

3. **Follow File Structure**
   - Don't create files in app/ except pages
   - Keep providers together
   - Separate business logic in services

## Code Quality Checklist

Before committing:
- [ ] Run `npm run build` - must pass
- [ ] Run `npm run lint` - must pass
- [ ] All files use kebab-case
- [ ] Imports use new paths
- [ ] Mock services work when Firebase disabled
- [ ] No console.log statements
- [ ] Types properly defined

## Architecture Principles

1. **Separation of Concerns**
   - Pages only in `/app`
   - Logic in `/services`
   - UI in `/components`
   - State in `/providers`

2. **Feature Flags First**
   - Every external service toggleable
   - Graceful degradation
   - Progressive enhancement

3. **Developer Experience**
   - Zero-config start
   - Clear error messages
   - Consistent patterns

4. **Type Safety**
   - No `any` types
   - Strict null checks
   - Validated at build time

## Future Considerations

When extending this template:
- Maintain the mock service pattern
- Keep feature flags for new services
- Follow established file structure
- Document decisions in this file
- Test with and without external services

## Strict Rules for AI Assistants

### RULE 1: Authentication Implementation
- DO NOT implement authentication unless explicitly instructed
- If authentication is required, implement it ONLY after ALL other features are complete
- Build all features assuming an authenticated user
- Exception: The existing mock auth service is acceptable and should be used

### RULE 2: Real Implementations Only
- NEVER create new mock services, mock data, or mock files
- ALWAYS use real implementations and real data
- Exception: The existing mock auth service in this template is intentional
- Exception: Feature flags for toggling Firebase services are encouraged
- If you cannot implement something real, ASK for clarification

### RULE 3: No Testing
- DO NOT write any tests (unit, integration, or E2E)
- DO NOT create test files or test directories
- DO NOT suggest adding tests
- Testing philosophy: Manual testing is sufficient for MVPs

### RULE 4: File Naming (NO EXCEPTIONS)
- Files: ALWAYS use kebab-case (e.g., `user-profile.tsx`)
- Directories: ALWAYS use kebab-case (e.g., `user-management/`)
- Component exports: ALWAYS use PascalCase (e.g., `export function UserProfile`)

### RULE 5: Error-Free Code Only
Before writing ANY code:
1. Check existing patterns in the codebase
2. Verify TypeScript types are imported
3. Use correct import paths (`@/` not relative)
4. Ensure no breaking changes

Your code MUST:
- Pass `npm run build`
- Pass `npm run lint`
- Not break existing functionality

### RULE 6: Regular Validation
After EVERY 5 changes, you MUST run:
```bash
npm run build
npm run lint
```
Fix any errors immediately.

### RULE 7: Commit Discipline
Commit after:
- Adding a new component
- Implementing a feature
- Fixing a bug
- Any significant change

Commit format:
```
<type>: <what was done>

- Specific change 1
- Specific change 2
```

### RULE 8: Scope Control
- ONLY implement features in the original specification
- DO NOT add extra features, pages, or components
- If you think of an improvement, ASK FIRST

### RULE 9: Code Reuse
Before creating anything:
1. Search for existing components in `/components`
2. Search for existing utilities in `/lib`
3. Search for existing types in `/types`
4. REUSE existing code

### RULE 10: Development Server
- If the user is already running the dev server, DO NOT run it again
- DO NOT run `npm run dev` to "verify" changes
- Wait for user feedback

### RULE 11: Communication Style
FORBIDDEN phrases:
- "This fixes the issue"
- "The problem is now resolved"
- "This should work now"

REQUIRED phrases:
- "I've made changes to address..."
- "Please test these changes"
- "Let me know if the issue persists"

### RULE 12: Task Boundaries
- Complete the current task
- Report what was done
- STOP and WAIT for next instructions
- DO NOT proceed to next features automatically

## Claude Commands

This project includes custom Claude commands for workflow automation:

### Available Commands
- `/context-prime` - Load project context and understand structure
- `/session:start` - Begin a development session
- `/session:update` - Track progress during development (triggers session-state-tracker)
- `/session:end` - Close and document session
- `/transpose` - Convert artifact files to template-compliant PRDs (triggers spec-alignment-guardian)
- `/breakdown` - Break external PRDs into phased implementation specs (triggers spec-alignment-guardian)
- `/adapt` - Adapt CLAUDE.md and README.md to your specific project

### Sub-Agents
VibeSpec includes specialized sub-agents that automatically monitor and assist development:
- **spec-alignment-guardian** - Ensures implementations match specifications exactly
- **velocity-guardian** - Prevents feature creep and maintains shipping momentum
- **vibespec-compliance-validator** - Enforces VibeSpec rules and conventions
- **session-state-tracker** - Captures comprehensive development state
- **vibespec-docs-harmonizer** - Keeps documentation synchronized
- **agent-architect** - Designs new sub-agents for automation opportunities
- **ui-enhancement-specialist** - Enhances UI components for accessibility, consistency, and quality

These agents activate automatically when needed or can be invoked manually. See `vibespec/sub-agents.md` for details.

### Workflow Integration
For detailed workflow guidance, see:
- [AI Workflow Guide](./vibespec/ai-workflow-guide.md) - Comprehensive development process
- [Workflow Quick Reference](./vibespec/workflow-quickstart.md) - Commands and tips
- [Claude Commands Reference](./vibespec/claude-commands.md) - Detailed command documentation
- [Sub-Agents Guide](./vibespec/sub-agents.md) - How sub-agents enhance your workflow

## Technical Context

This template prioritizes developer experience and flexibility. Maintain these principles in all modifications:

1. **Always check current file structure** before suggesting changes
2. **Respect the architecture** - no exceptions to file organization
3. **Use feature flags** for service toggling
4. **Build with mock services first** when developing new features
5. **Update this document** when making architectural changes
6. **Use provided commands** for session management and planning
7. **Document in appropriate directories** (specs/, plans/, docs/)