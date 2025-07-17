Analyze an external PRD from @specs/ and break it down into template-compliant build phases with separate spec documents.

## Usage
`/breakdown @specs/[prd-filename].md`

## Purpose
Transform an externally generated PRD (created without template context) into a structured set of specifications that align with this template's architecture, constraints, and build workflow.

## Process

### Phase 1: PRD Analysis & Validation

Thoroughly analyze the external PRD to:

1. **Extract Core Requirements**
   - Identify all features and functionality
   - List user stories and use cases
   - Note acceptance criteria
   - Extract any technical requirements

2. **Identify Red Flags**
   - Non-standard dependencies mentioned
   - Architectural patterns incompatible with template
   - Features requiring extensive customization
   - Overly complex state management needs

3. **Map to Template Capabilities**
   - Which requirements can use existing template features?
   - What needs mock services vs real implementation?
   - Which shadcn/ui components can be leveraged?
   - What can be simplified for MVP?

### Phase 2: Generate Adapted PRD

Create `/specs/[project-name]-template-prd.md` with:

```markdown
# [Project Name] - Template-Adapted PRD

## Origin
- Source: @specs/[original-prd].md
- Adapted for: Next.js Firebase Template
- Date: [Current Date]

## Overview
[Simplified overview focusing on MVP scope]

## Template Compatibility Notes
- ✅ Compatible Features: [List what works well]
- ⚠️ Adaptations Needed: [List what needs modification]
- ❌ Out of Scope: [List what can't/shouldn't be done]

## Core Features (MVP)
[Filtered list of features achievable with template]

## Technical Approach
- Authentication: [Mock/Firebase approach]
- Data Storage: [Mock/Firestore approach]
- UI Components: [shadcn/ui mapping]
- Services: [Mock-first implementation]

## Build Phases Overview
1. **Structure & Setup** - Project organization
2. **Data Models** - Type definitions
3. **Theme & Design** - UI consistency
4. **Core Services** - Business logic
5. **Feature Implementation** - User-facing features

## Risks & Mitigations
[Template-specific concerns and solutions]
```

### Phase 3: Create Phase-Specific Specs

Generate detailed specs for each build phase:

#### 3.1 Structure Spec
**File**: `/specs/phases/phase-1-structure.md`

```markdown
# Phase 1: Basic Core File Structure

## Objective
Set up project foundation following template patterns.

## Tasks
1. Directory Structure
   - [ ] Verify all template directories exist
   - [ ] Create feature-specific subdirectories
   - [ ] Set up `/docs`, `/plans`, `/specs` structure

2. Configuration
   - [ ] Review environment variables needed
   - [ ] Set up feature flags in firebase.config.ts
   - [ ] Configure any project-specific settings

3. Dependencies
   - [ ] List any additional packages needed (minimize!)
   - [ ] Verify compatibility with existing packages
   - [ ] Document why each is necessary

## Deliverables
- Clean project structure
- Updated configuration files
- Dependency documentation

## Success Criteria
- Project follows template structure exactly
- No unnecessary directories created
- All configurations documented
```

#### 3.2 Data Types Spec
**File**: `/specs/phases/phase-2-data-types.md`

```markdown
# Phase 2: Data Types

## Objective
Define all TypeScript interfaces and types.

## Type Categories

### User Types
[Map from PRD user requirements]

### Domain Types
[Core business objects]

### API Types
[Request/response shapes]

### UI Types
[Component prop types]

## Implementation
- Location: `/src/types/`
- Files:
  - `[feature].ts` - Feature-specific types
  - Update `index.ts` exports

## Mock Data Structures
[Define shapes for mock services]

## Validation Rules
[Business logic constraints]
```

#### 3.3 Theme Spec
**File**: `/specs/phases/phase-3-theme.md`

```markdown
# Phase 3: Theme & Design System

## Objective
Adapt design requirements to template's Tailwind CSS v4 system.

## Design Tokens
- Colors: [Map to CSS variables]
- Typography: [Font choices]
- Spacing: [Use template's scale]
- Borders: [Radius values]

## Component Styling
- Use existing shadcn/ui components
- Custom component needs
- Animation requirements

## Responsive Design
- Mobile-first approach
- Breakpoint usage
- Component adaptations

## Dark Mode
- Color adaptations
- Component considerations
```

#### 3.4 Services Spec
**File**: `/specs/phases/phase-4-services.md`

```markdown
# Phase 4: Core Services & APIs

## Objective
Implement business logic with mock-first approach.

## Services Needed

### [Service Name]
- Purpose: [What it does]
- Location: `/src/services/[service-name]/`
- Files:
  - `[service-name]-service.ts` - Main logic
  - `mock/mock-[service-name]-service.ts` - Mock implementation
- Methods:
  - `method1()` - [Description]
  - `method2()` - [Description]

## Mock Service Guidelines
- Use localStorage for persistence
- Simulate realistic delays
- Provide meaningful mock data
- Prepare for Firebase transition

## Feature Flags
- `NEXT_PUBLIC_USE_[SERVICE]` - Toggle mock/real

## API Integration Points
[Where services connect to components]
```

#### 3.5 Feature Specs
**Directory**: `/specs/phases/phase-5-features/`

For each major feature, create:
```markdown
# Feature: [Feature Name]

## Overview
[Feature description from PRD]

## Components
- Main: `/src/components/[feature]/[feature-name].tsx`
- Sub-components: [List]

## Pages
- Route: `/[feature-route]`
- File: `/src/app/[feature]/page.tsx`

## Service Integration
- Uses: [Which services]
- Data flow: [How data moves]

## UI Components
- shadcn/ui: [Which components]
- Custom: [What's needed]

## User Flow
1. [Step by step interaction]

## Acceptance Criteria
- [ ] [Specific testable criteria]
```

### Phase 4: Generate Master Implementation Plan

Create `/plans/implement-[project-name].md`:

```markdown
# Implementation Plan: [Project Name]

## Overview
Systematic implementation following template patterns.

## Phase Execution Order

### Phase 1: Structure (Day 1)
- [ ] Set up directories
- [ ] Configure environment
- [ ] Review dependencies
- Reference: `/specs/phases/phase-1-structure.md`

### Phase 2: Types (Day 2)
- [ ] Define all interfaces
- [ ] Create type exports
- [ ] Add mock data types
- Reference: `/specs/phases/phase-2-data-types.md`

### Phase 3: Theme (Day 3)
- [ ] Configure design tokens
- [ ] Test component styling
- [ ] Verify responsive design
- Reference: `/specs/phases/phase-3-theme.md`

### Phase 4: Services (Days 4-5)
- [ ] Implement mock services
- [ ] Test service methods
- [ ] Wire up feature flags
- Reference: `/specs/phases/phase-4-services.md`

### Phase 5: Features (Days 6+)
For each feature:
- [ ] Build components
- [ ] Create pages
- [ ] Connect services
- [ ] Test functionality
- Reference: `/specs/phases/phase-5-features/`

## Testing Strategy
- Manual testing after each phase
- Verify mock services work
- Test responsive design
- Check dark mode

## Risk Management
[Identified risks and mitigation strategies]
```

### Phase 5: Summary Report

Generate a summary of the breakdown process, highlighting:

1. **Major Adaptations Made**
   - What was simplified for MVP
   - What was restructured for template
   - What was removed as out of scope

2. **Dependency Analysis**
   - Required vs nice-to-have
   - Template alternatives suggested
   - Justification for any additions

3. **Timeline Estimate**
   - Days per phase
   - Total implementation time
   - Critical path items

4. **Success Metrics**
   - How to measure phase completion
   - Overall project success criteria

## Important Guidelines

1. **Template First**
   - Always prefer existing template patterns
   - Justify any deviations explicitly
   - Keep mock-first approach

2. **Simplification**
   - MVP over feature-complete
   - Iterate based on user feedback
   - Technical debt is acceptable initially

3. **Documentation**
   - Every decision should be documented
   - Link between related specs
   - Keep plans updated during implementation

4. **Validation**
   - Each phase should be testable
   - Clear success criteria
   - No phase proceeds until previous is solid

## Example Usage

```
/breakdown @specs/social-media-app-prd.md
```

This would analyze the social media PRD and create:
- Adapted PRD with template constraints
- 5 phase-specific spec documents
- Individual feature specs
- Complete implementation plan
- All properly structured for template success

## Success Indicators

The breakdown is successful when:
1. External PRD is fully mapped to template patterns
2. Each phase has clear, achievable goals
3. No unnecessary complexity is introduced
4. Implementation plan is realistic and testable
5. All specs reference template components/patterns