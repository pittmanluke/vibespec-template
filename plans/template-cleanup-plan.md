# VibeSpec Template Cleanup Plan

## Overview
This plan details the simplification of the VibeSpec template to create a leaner, more focused starter template for new users. The goal is to remove non-essential files while preserving the core functionality and VibeSpec methodology.

## Objectives
- Remove ~25% of files to reduce complexity
- Eliminate demo/landing page content
- Remove unused dependencies
- Simplify the initial user experience
- Preserve all VibeSpec methodology and AI assistant features

## Phase 1: Root Directory Cleanup

### Files to Delete
- [ ] `README_BACKUP.md`
- [ ] `README_TEMPLATE.md`
- [ ] `TEMPLATE_README.md`
- [ ] `TEMPLATE_SYNC.md`
- [ ] `GITHUB_SETUP_INSTRUCTIONS.md`

### Files to Move
- [ ] Move `CONTRIBUTING.md` to `/vibespec/contributing.md`
- [ ] Move `CHANGELOG.md` to `/vibespec/changelog.md`

## Phase 2: Remove Firebase Functions

### Directories to Delete
- [ ] `/functions/` (entire directory)

### Files to Update
- [ ] `firebase.json` - Remove functions configuration:
  ```json
  // Remove this section:
  "functions": {
    "source": "functions",
    "predeploy": [
      "npm --prefix \"$RESOURCE_DIR\" run build"
    ]
  }
  ```

- [ ] `.env.local.example` - Remove:
  ```
  # Enable Cloud Functions
  NEXT_PUBLIC_USE_FUNCTIONS=false
  ```

## Phase 3: Simplify Source Code

### Files to Delete
- [ ] `/src/app/docs/page.tsx` - Documentation page
- [ ] `/src/components/ui/terminal-animation.tsx` - Demo component

### Files to Modify
- [ ] `/src/app/page.tsx` - Replace with minimal version:
  ```tsx
  import Link from "next/link";
  import { Button } from "@/components/ui/button";
  import { Logo } from "@/components/ui/logo";
  import { ModeToggle } from "@/components/theme/mode-toggle";

  export default function Home() {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center space-x-2">
            <Logo size={48} />
            <h1 className="text-4xl font-bold">Welcome</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-md">
            Get started with your new app powered by the VibeSpec template.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-8">
            Learn more about VibeSpec at{" "}
            <Link href="https://vibespec.dev" className="underline">
              vibespec.dev
            </Link>
          </p>
        </div>
        <div className="absolute top-4 right-4">
          <ModeToggle />
        </div>
      </div>
    );
  }
  ```

## Phase 4: Clean Up Dependencies

### Dependencies to Remove from `package.json`
- [ ] `recharts` - Not used in template
- [ ] `@tanstack/react-table` - Not used in template
- [ ] `react-day-picker` - Not used in template
- [ ] `firebase-admin` - Only needed for functions

### Update package.json
Run after removing dependencies:
```bash
npm uninstall recharts @tanstack/react-table react-day-picker firebase-admin
```

## Phase 5: Other Cleanup

### Directories to Delete
- [ ] `/sync-scripts/` - Internal tooling

### Environment Variables to Remove
From `.env.local.example`:
- [ ] `NEXT_PUBLIC_ENABLE_EMAIL_SUBSCRIPTION`

## Phase 6: Update Documentation

### Files to Update
- [ ] `/README.md` - Simplify and focus on quick start
  - Remove references to functions
  - Remove references to removed dependencies
  - Add prominent link to vibespec.dev
  - Focus on getting started quickly

## Verification Checklist

### Pre-Implementation
- [ ] Create git branch: `git checkout -b template-cleanup`
- [ ] Ensure clean working directory: `git status`

### Post-Implementation Tests
- [ ] Run `npm install` - Should complete without errors
- [ ] Run `npm run dev` - Development server starts
- [ ] Visit homepage - Shows simplified welcome page
- [ ] Visit `/dashboard` - Protected route works
- [ ] Visit `/auth/login` - Authentication works
- [ ] Run `npm run build` - Build completes successfully
- [ ] Run `npm run lint` - No linting errors

### Final Checks
- [ ] All links work (no 404s)
- [ ] Theme toggle works
- [ ] Mock authentication works
- [ ] No console errors
- [ ] File count reduced by ~25%

## Rollback Plan
If issues arise:
```bash
git checkout main
git branch -D template-cleanup
```

## Implementation Order
1. Create branch and backup
2. Clean root directory (Phase 1)
3. Remove Firebase Functions (Phase 2)
4. Update source files (Phase 3)
5. Clean dependencies (Phase 4)
6. Final cleanup (Phase 5)
7. Update documentation (Phase 6)
8. Run verification tests
9. Commit changes

## Expected Outcome
- Cleaner, more focused template
- Faster initial setup for new users
- All core features preserved
- VibeSpec methodology intact
- Simplified but functional starting point

## Notes
- Keep all `/vibespec/` documentation for AI assistance
- Keep all `/specs/`, `/plans/`, `/examples/` directories
- Keep all `/docs/` content
- Preserve authentication system and UI components
- Maintain feature flag system for Firebase services