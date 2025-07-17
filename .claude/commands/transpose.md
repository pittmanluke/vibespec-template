Analyze a .tsx artifact file from @examples/ and transpose it into a PRD that conforms to this template's architecture and constraints.

## Usage
`/transpose @examples/[filename].tsx`

## Process

### Phase 1: Deep Analysis
First, thoroughly analyze the provided .tsx file to understand:

1. **Core Functionality**
   - What problem does this component solve?
   - What are the main features and capabilities?
   - What user interactions are supported?

2. **Component Structure**
   - Identify all React components (main and sub-components)
   - Map the component hierarchy
   - Note any custom hooks or utilities

3. **State Management**
   - What state variables are used?
   - How is state updated and managed?
   - Are there any complex state patterns?

4. **UI/UX Patterns**
   - What design system is implied?
   - What UI components are used?
   - What animations or interactions exist?

5. **Data Flow**
   - What data structures are defined?
   - How does data flow through the component?
   - What would the API requirements be?

6. **Styling Approach**
   - What styling patterns are used?
   - How can these map to Tailwind CSS v4?
   - What theme variables are needed?

### Phase 2: Template Mapping
Map the artifact's patterns to this template's architecture:

1. **Component Mapping**
   - Which shadcn/ui components can replace custom ones?
   - What goes in `/components/ui/` vs `/components/[feature]/`?
   - How to maintain the component hierarchy?

2. **Service Layer Design**
   - What services are needed in `/services/`?
   - How to implement with mock-first approach?
   - What feature flags might be needed?

3. **Type Definitions**
   - Extract TypeScript interfaces
   - Map to template's `/types/` structure
   - Ensure consistency with existing types

4. **Provider Requirements**
   - Does this need new context providers?
   - Can existing providers be leveraged?
   - Where in `/providers/` would they go?

### Phase 3: Generate PRD
Create a comprehensive PRD in `/specs/transposed-[feature-name].md` with:

```markdown
# Feature Specification: [Feature Name]

## Origin
- Source: @examples/[filename].tsx
- Type: Claude Desktop Artifact
- Original Purpose: [Brief description]

## Overview
[Translated description fitting template context]

## Core Features
[List main features extracted from artifact]

## User Stories
[Convert interactions into user stories]

## Technical Requirements

### Components Structure
- Main Components:
  - `[ComponentName]` → `/components/[feature]/[component-name].tsx`
  - [Map all components to template structure]

### Data Models
[TypeScript interfaces needed in /types/]

### Services
[Services needed in /services/ with mock implementations]

### UI Components
- Existing shadcn/ui components to use:
  - [List specific components]
- Custom components needed:
  - [List any that don't exist]

## Implementation Phases

### Phase 1: Core Structure
1. Set up types in `/types/[feature].ts`
2. Create base component structure
3. Implement mock service

### Phase 2: UI Implementation
1. Build main component with shadcn/ui
2. Implement responsive design
3. Add theme support

### Phase 3: Functionality
1. Wire up state management
2. Connect to mock service
3. Implement user interactions

### Phase 4: Polish
1. Add animations/transitions
2. Implement error states
3. Add loading states

## Acceptance Criteria
[Specific, testable criteria based on original functionality]

## Template Integration Notes
- Styling: Convert to Tailwind CSS v4 utilities
- State: Use React hooks, consider if provider needed
- Data: Start with mock service, prepare for Firebase
- Routing: Define pages needed in `/app/`

## Potential Pitfalls
- Avoid adding dependencies not in template
- Don't recreate existing UI components
- Follow kebab-case naming strictly
- Keep mock-first approach

## Out of Scope
[What from the original won't be implemented]
```

### Phase 4: Additional Outputs

1. **Quick Implementation Plan**
   - Save to `/plans/implement-[feature-name].md`
   - Include specific tasks with template paths
   - Reference the generated PRD

2. **Component Stubs** (Optional)
   - Suggest basic file structure
   - Include imports from template
   - Note which shadcn/ui components to use

## Important Guidelines

1. **Respect Template Constraints**
   - Don't suggest new dependencies unless absolutely necessary
   - Use existing patterns and components
   - Follow the established file structure

2. **Feature Flags**
   - Prepare for future Firebase integration
   - Use feature flags appropriately

3. **Maintain Simplicity**
   - MVP mindset - what's the minimum needed?
   - Leverage existing template features
   - Avoid over-engineering

4. **Follow Conventions**
   - Strict kebab-case for files/folders
   - PascalCase for component exports
   - Use template's import patterns (@/)

## Example Usage

```
/transpose @examples/improved-design-generator.tsx
```

This would analyze the design generator artifact and create:
- `/specs/transposed-design-generator.md` - Full PRD
- `/plans/implement-design-generator.md` - Implementation plan
- Clear mapping of design system features to template structure

## Success Criteria

The transposition is successful when:
1. The PRD clearly maps artifact features to template patterns
2. No unnecessary dependencies are introduced
3. The implementation plan follows the standard build order
4. All components fit within existing file structure
5. The feature can be built using template's existing tools