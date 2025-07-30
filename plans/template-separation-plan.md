# Template Separation Plan

## Overview

This plan outlines the process of separating the VibeSpec codebase into two distinct repositories:
1. **vibespec-template**: A clean starter template for developers building AI-assisted applications
2. **vibespec-landing**: The marketing/landing page for VibeSpec itself

The current codebase has evolved beyond its original purpose as a template, now containing significant landing page and marketing functionality that would confuse template users. This separation will provide clarity and better serve both use cases.

## Current State Analysis

### Landing Page Specific (To Be Removed from Template)

#### Components
- `/src/components/landing/` (all 13 components):
  - ai-benefits.tsx
  - claude-section.tsx
  - code-comparison.tsx
  - context-section.tsx
  - cta-section.tsx
  - faq-section.tsx
  - header-auth.tsx
  - hero-section.tsx
  - home-content.tsx
  - problem-solution.tsx
  - specs-workflow.tsx
  - workflow-section.tsx
  - workflow-visual.tsx

#### Pages
- `/src/app/roadmap/` (entire directory)
- `/src/app/docs/page.tsx` (placeholder)
- `/src/app/examples/page.tsx` (placeholder)

#### Analytics & SEO
- `/src/providers/analytics-provider.tsx` (Vercel Analytics)
- `/src/lib/analytics/` (entire directory)
- `/src/lib/seo/` (vibespec.dev specific configs)
- `/src/components/seo/json-ld.tsx`
- `/src/app/opengraph-image.png`
- `/src/app/twitter-image.png`
- `/src/app/robots.ts`
- `/src/app/sitemap.ts`

#### Marketing Plans
- All landing-page specific plans in `/plans/`:
  - analytics-seo-implementation-plan.md
  - analytics-seo-phase-2-enhancements.md
  - landing-page-animation-polish-plan.md
  - landing-page-restructure-plan.md
  - landing-page-ui-improvements-plan.md
  - vibespec-copy-improvement-plan.md
  - vibespec-polish-and-launch-plan.md
  - faq-section-implementation.md
  - roadmap-priority-redesign-plan.md

### Core Template Features (To Be Preserved)

#### Infrastructure
- VibeSpec methodology (`/vibespec/` documentation)
- Sub-agents system (`.claude/agents/`)
- Claude commands (`.claude/commands/`)
- Session management (`.claude/sessions/`)

#### Core Features
- Firebase integration with feature flags
- Mock authentication service pattern
- Protected route system
- Theme system with dark mode
- UI component library (`/src/components/ui/`)
- Common hooks (`/src/hooks/`)
- Utility functions (`/src/lib/utils.ts`)
- Type definitions (`/src/types/`)

#### Configuration
- TypeScript configuration
- ESLint configuration
- Tailwind CSS v4 setup
- PostCSS configuration
- Next.js configuration (needs modification)

## Repository Structure

### vibespec-template Repository
```
vibespec-template/
├── .claude/           # AI assistant configuration
├── docs/              # Template documentation
├── examples/          # Example implementations
├── plans/             # Template-specific plans
├── public/            # Static assets (generic)
├── specs/             # Specification examples
├── src/
│   ├── app/          # Minimal starter pages
│   ├── components/   # UI components (no landing)
│   ├── config/       # App configuration
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Utilities (no analytics/SEO)
│   ├── providers/    # Context providers
│   ├── services/     # Business logic
│   └── types/        # TypeScript types
├── vibespec/         # Methodology docs
└── [config files]    # Build configuration
```

### vibespec-landing Repository
```
vibespec-landing/
├── [full current structure]
└── Uses vibespec-template as foundation
```

## Implementation Phases

### Phase 1: Repository Setup (Day 1)

1. **Create New Repository**
   - Fork current repo as `vibespec-template`
   - Maintain git history for better tracking
   - Set up repository settings and description

2. **Initial Cleanup**
   - Create new branch `template-cleanup`
   - Remove `.git` directory if forking isn't used
   - Update repository metadata

### Phase 2: Remove Landing-Specific Code (Day 1-2)

1. **Delete Landing Components**
   ```bash
   rm -rf src/components/landing/
   rm -rf src/app/roadmap/
   rm src/app/docs/page.tsx
   rm src/app/examples/page.tsx
   ```

2. **Remove Analytics & SEO**
   ```bash
   rm src/providers/analytics-provider.tsx
   rm -rf src/lib/analytics/
   rm src/components/seo/json-ld.tsx
   rm src/app/opengraph-image.png
   rm src/app/twitter-image.png
   rm src/app/robots.ts
   rm src/app/sitemap.ts
   ```

3. **Clean Up Plans**
   - Keep only template-relevant plans
   - Remove all landing-page specific plans

### Phase 3: Create Starter Content (Day 2-3)

1. **New Home Page**
   - Create `/src/app/page.tsx` with template showcase
   - Include:
     - Welcome message
     - Feature highlights
     - Links to documentation
     - Getting started steps

2. **Example Dashboard**
   - Enhance `/src/app/dashboard/page.tsx`
   - Add example widgets
   - Demonstrate data fetching patterns
   - Show protected route usage

3. **Template Documentation Page**
   - Create `/src/app/docs/page.tsx`
   - Link to vibespec documentation
   - Quick start guide
   - Common patterns

### Phase 4: Update Configurations (Day 3)

1. **package.json Updates**
   ```json
   {
     "name": "vibespec-template",
     "version": "1.0.0",
     "description": "Production-ready Next.js template for AI-assisted development",
     "repository": {
       "url": "https://github.com/vibespec/vibespec-template"
     }
   }
   ```

2. **Environment Variables**
   - Update `.env.local.example`
   - Remove vibespec.dev references
   - Add generic defaults

3. **Metadata Updates**
   - Generic title and description in `layout.tsx`
   - Remove vibespec.dev URLs
   - Update favicon references

4. **README Rewrite**
   - Focus on getting started
   - Clear installation instructions
   - Feature overview
   - Link to methodology docs

### Phase 5: Testing & Validation (Day 4)

1. **Fresh Install Test**
   ```bash
   git clone [template-repo]
   cd vibespec-template
   npm install
   npm run dev
   ```

2. **Feature Verification**
   - Firebase feature flags work
   - Mock auth functions
   - Theme switching works
   - Protected routes work
   - Build succeeds

3. **Documentation Review**
   - All links work
   - Instructions are clear
   - No landing page references

### Phase 6: Landing Page Updates (Day 4-5)

1. **Update Landing Repository**
   - Add link to template
   - Update README
   - Add "Built with VibeSpec" badge

2. **Create Template Showcase**
   - Add section showing template features
   - Link to GitHub repository
   - Include getting started CTA

## File Migration Matrix

### Files to Delete Completely
```
src/components/landing/**
src/app/roadmap/**
src/app/docs/page.tsx
src/app/examples/page.tsx
src/providers/analytics-provider.tsx
src/lib/analytics/**
src/components/seo/json-ld.tsx
src/app/opengraph-image.png
src/app/twitter-image.png
src/app/robots.ts
src/app/sitemap.ts
plans/analytics-seo-*.md
plans/landing-page-*.md
plans/vibespec-copy-*.md
plans/vibespec-polish-*.md
plans/faq-section-*.md
plans/roadmap-*.md
```

### Files to Modify
```
src/app/layout.tsx         # Remove analytics, update metadata
src/app/page.tsx          # Complete rewrite
src/lib/seo/metadata.ts   # Genericize
src/lib/seo/structured-data.ts # Genericize
package.json              # Update metadata
README.md                 # Complete rewrite
.env.local.example        # Remove specific URLs
next.config.ts           # Keep as-is
CLAUDE.md                # Update project references
```

### Files to Add
```
src/app/page.tsx         # New starter home page
src/components/template/ # Template-specific components
docs/TEMPLATE_GUIDE.md   # How to use the template
examples/               # More example implementations
```

## Configuration Updates

### 1. Layout Metadata
```typescript
export const metadata: Metadata = {
  title: "My App - Built with VibeSpec",
  description: "AI-assisted application built with the VibeSpec template",
  // Remove all vibespec.dev references
};
```

### 2. Environment Variables
```env
# Remove
NEXT_PUBLIC_SITE_URL=https://vibespec.dev

# Add
NEXT_PUBLIC_APP_NAME=My App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Package.json
- Update name to "vibespec-template"
- Update repository URLs
- Remove landing-specific keywords
- Update description

## Documentation Updates

### Template README Structure
1. **Hero Section**
   - What is VibeSpec Template
   - Key benefits
   - Quick start

2. **Installation**
   - Prerequisites
   - Step-by-step setup
   - Configuration

3. **Features**
   - Complete feature list
   - Architecture overview
   - Technology stack

4. **Usage**
   - Project structure
   - Common patterns
   - Customization guide

5. **Resources**
   - Link to VibeSpec methodology
   - Community links
   - Support

### CLAUDE.md Updates
- Remove project-specific context
- Focus on template usage
- Generic examples
- Clear adaptation instructions

## Testing Strategy

### 1. Clean Installation Test
```bash
# Test fresh clone and setup
git clone https://github.com/vibespec/vibespec-template
cd vibespec-template
cp .env.local.example .env.local
npm install
npm run dev
```

### 2. Feature Tests
- [ ] Home page loads without errors
- [ ] Dashboard requires authentication
- [ ] Mock auth works (any email/password)
- [ ] Theme switching functions
- [ ] Firebase flags toggle correctly
- [ ] Build completes successfully
- [ ] Lint passes
- [ ] TypeScript has no errors

### 3. Documentation Tests
- [ ] All internal links work
- [ ] Code examples are accurate
- [ ] Setup instructions work
- [ ] No references to vibespec.dev

### 4. CI/CD Tests
- [ ] GitHub Actions work
- [ ] Vercel deployment succeeds
- [ ] Environment variables documented

## Maintenance Plan

### 1. Version Synchronization
- Major updates flow: template → landing
- Security fixes: immediate sync
- Feature additions: evaluate per case

### 2. Documentation Sync
- VibeSpec methodology updates
- Both repos updated together
- Changelog maintenance

### 3. Community Management
- Issues on appropriate repo
- Template feedback incorporated
- Landing page showcases updates

### 4. Release Process
1. Update template version
2. Test all features
3. Update landing page
4. Create release notes
5. Announce to community

## Success Criteria

### Template Repository Success
- [ ] Clean install works in <5 minutes
- [ ] No landing page code remains
- [ ] All features documented
- [ ] Generic branding throughout
- [ ] Build/lint/type-check pass
- [ ] Example implementations clear
- [ ] Developer can build new app immediately

### Landing Repository Success
- [ ] Links to template prominent
- [ ] Shows template in action
- [ ] Marketing copy updated
- [ ] Analytics functioning
- [ ] SEO optimized
- [ ] Clear value proposition

### Overall Success
- [ ] Two distinct, focused repositories
- [ ] Clear separation of concerns
- [ ] Easy maintenance workflow
- [ ] Community understands structure
- [ ] Both repos independently valuable

## Timeline

**Total Duration**: 5 days

- **Day 1**: Repository setup, initial cleanup
- **Day 2**: Remove landing code, start new content
- **Day 3**: Complete new content, update configs
- **Day 4**: Testing, validation, fixes
- **Day 5**: Landing updates, documentation, launch

## Next Steps

1. Review and approve this plan
2. Create `vibespec-template` repository
3. Begin Phase 1 implementation
4. Track progress with checklist
5. Test thoroughly before announcing

## Notes

- Maintain git history for better tracking
- Consider creating a migration script for future updates
- Document any gotchas discovered during implementation
- Plan announcement strategy for community