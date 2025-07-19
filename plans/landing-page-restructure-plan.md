# Landing Page Restructure Plan

*Created: 2025-07-18*

## Overview
Restructure the landing page to focus on the spec-driven workflow and methodology, emphasizing the process rather than promises.

## Section 1: Hero Section

### Layout
- Clean, minimal design
- Main headline: "VibeSpec"
- Subheadline: "A template for spec-driven AI-assisted coding"
- Two CTAs side by side

### Content Ideas
**Headline variations:**
- "VibeSpec: Spec-Driven Development for AI Coding"
- "Specifications First, Code Second"
- "Transform Ideas into Specs, Specs into Code"

**CTA Buttons:**
- Primary: "View on GitHub" → links to repo
- Secondary: "Read the Docs" → links to new docs landing page

**Visual:** Simple terminal animation showing the core workflow

## Section 2: Better Specs, Better Vibes

### Visual Concept
A split-screen diagram showing two paths:

**Path A: Example File**
1. Drag `dashboard.tsx` into `/examples`
2. Run `/transpose @examples/dashboard.tsx`
3. Creates `specs/dashboard-spec.md`

**Path B: External Spec**
1. Drag `feature-prd.md` into project
2. Run `/breakdown @feature-prd.md`
3. Creates multiple specs in `/specs`

### Key Message
"Two starting points, one destination: Clear specifications that AI understands"

### Visual Style
- Animated drag-and-drop effect
- File icons transforming into spec documents
- Clean folder structure visualization

## Section 3: Context is Key

### Layout
- Tech stack logos in a grid
- Visual showing project structure
- Emphasis on organization

### Content Elements
**Tech Stack Display:**
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Claude Code

**Project Structure Visual:**
```
src/
├── app/        → Routes only
├── components/ → UI components
├── services/   → Business logic
└── specs/      → Your specifications
```

**Key Message:**
"A well-defined foundation enables AI to build with precision"

## Section 4: Optimized for Claude Code

### Content Focus
- Show actual CLAUDE.md snippets
- Display custom commands
- Highlight integration points

### Visual Ideas
- Code editor showing CLAUDE.md
- Command palette with our custom commands
- Before/after comparison of AI understanding

### Commands to Showcase
- `/context-prime` - Load project context
- `/transpose` - Example to spec
- `/breakdown` - PRD to plan
- `/session:start` - Track progress

## Section 5: Our Workflow

### Four Pillars Visual
1. **Spec Design**
   - Transform ideas into specifications
   - Visual or textual starting points

2. **Planning**
   - Break down complex features
   - Phased implementation

3. **Context Priming**
   - AI understands your project
   - Consistent output

4. **Memory Management**
   - Never lose progress
   - Continue across sessions

### Workflow Diagram
Show how these elements work together in a cycle

## Section 6: Secondary CTA

### Options
**Version A: Community Focus**
- "Join developers building better with AI"
- Links: Discord | GitHub | Docs

**Version B: Action Focus**
- "Ready to build with specifications?"
- CTAs: "Get Started" | "See Examples"

**Version C: Learning Focus**
- "Learn the spec-driven approach"
- CTAs: "Read Guide" | "Watch Demo"

## Implementation Details

### New Docs Landing Page
Create `/docs/index.md` or similar with:
- Quick start guide
- Workflow overview
- Command reference
- Example projects

### Visual Design Principles
- Clean and minimal
- Focus on the workflow
- Use animations sparingly
- Emphasize file transformations

### Copy Guidelines
- No metrics or promises
- Focus on methodology
- Show the process clearly
- Let users see the value

## Benefits of This Structure

1. **Clear Value Prop**: Immediately understand it's about specifications
2. **Visual Learning**: See the workflow before reading about it
3. **Trust Building**: Show real tech stack and structure
4. **Practical Focus**: Emphasize tools and methods over promises
5. **Natural Flow**: From concept → implementation → action

This structure tells a story: Here's what we do → Here's how it works → Here's why it works → Try it yourself.

## Next Steps

1. Create new landing page components for each section
2. Design visual elements (drag-drop animation, workflow diagram)
3. Write copy for each section following guidelines
4. Create docs landing page
5. Update navigation and CTAs
6. Test the flow with fresh eyes