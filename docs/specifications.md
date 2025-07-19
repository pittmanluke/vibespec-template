# Understanding Specifications

Specifications are the heart of VibeSpec. They're structured documents that tell AI exactly what to build, eliminating confusion and ensuring consistent results.

## What Are Specifications?

A specification is a detailed description of a feature that includes:
- **Purpose**: What problem it solves
- **Structure**: How it's organized
- **Behavior**: How it works
- **Design**: What it looks like
- **Technical Details**: Implementation requirements

Think of specifications as blueprints for AI. Just as a contractor needs blueprints to build a house, AI needs specifications to build features.

## Why Specifications Matter

### Without Specifications
```
You: "Build me a user dashboard"
AI: *builds something*
You: "No, not like that..."
AI: *builds something different*
You: "Still wrong..."
*Hours wasted, tokens burned*
```

### With Specifications
```
You: /transpose @examples/dashboard.tsx
AI: *reads specification*
AI: *builds exactly what you designed*
You: "Perfect!" ✅
```

## Types of Specifications

### 1. Component Specifications
Describe individual UI components:

```markdown
# UserCard Component Specification

## Purpose
Display user information in a compact card format.

## Props
- user: User object with name, email, avatar, role
- onEdit?: Function called when edit is clicked
- onDelete?: Function called when delete is clicked

## Structure
Card container with:
- Avatar (left side)
- User details (center)
- Action buttons (right side)

## Behavior
- Hover: Slight elevation change
- Click avatar: Opens user profile
- Edit button: Triggers onEdit callback
- Delete button: Shows confirmation dialog

## Design
- Use shadcn Card component
- Responsive: Stack on mobile
- Dark mode compatible
```

### 2. Feature Specifications
Describe complete features:

```markdown
# User Management Feature Specification

## Overview
Admin users can view, search, edit, and delete users.

## Components
1. UserList - Paginated table of users
2. UserSearch - Search bar with filters
3. UserModal - Edit/create user form
4. UserCard - Individual user display

## Data Flow
1. Load users from API on mount
2. Real-time search as user types
3. Optimistic updates for edits
4. Soft delete with undo option

## Pages
- /admin/users - Main user list
- /admin/users/new - Create user
- /admin/users/[id] - Edit user

## API Endpoints
- GET /api/users - List with pagination
- POST /api/users - Create user
- PATCH /api/users/[id] - Update user
- DELETE /api/users/[id] - Soft delete
```

### 3. Integration Specifications
Describe external service integrations:

```markdown
# Stripe Integration Specification

## Purpose
Handle subscription payments and billing.

## Components
- PricingCard - Display plan options
- CheckoutForm - Payment collection
- BillingDashboard - Subscription management

## Flow
1. User selects plan
2. Create Stripe checkout session
3. Redirect to Stripe
4. Handle success/cancel webhooks
5. Provision user access

## Security
- Never store card details
- Verify webhooks signatures
- Use server-side API calls only
```

## Creating Specifications

### Method 1: From Design (Recommended)

1. **Create visual mockup**:
```tsx
// examples/feature-mockup.tsx
export default function FeatureMockup() {
  return (
    <div>
      {/* Your complete UI design */}
    </div>
  );
}
```

2. **Generate specification**:
```bash
claude
> /transpose @examples/feature-mockup.tsx
```

3. **Review and refine** the generated spec

### Method 2: From Requirements

1. **Write requirements**:
```markdown
# Feature Requirements

## User Stories
- As a user, I want to...
- As an admin, I need to...

## Acceptance Criteria
- Must have...
- Should support...
- Nice to have...
```

2. **Generate plan**:
```bash
claude
> /breakdown @specs/feature-requirements.md
```

### Method 3: Manual Creation

Write specifications directly using this template:

```markdown
# [Feature Name] Specification

## Overview
Brief description of what this feature does and why.

## User Stories
- As a [role], I want to [action] so that [benefit]

## Components

### ComponentName
- **Purpose**: What it does
- **Props**: Input data
- **State**: Internal state
- **Events**: User interactions

## Data Model
```typescript
interface DataType {
  // TypeScript interfaces
}
```

## API Design
- **Endpoints**: REST or GraphQL
- **Authentication**: How it's secured
- **Validation**: Input rules

## UI/UX Details
- **Layout**: How it's arranged
- **Responsive**: Mobile behavior
- **Animations**: Transitions
- **Error States**: How errors appear

## Technical Requirements
- **Performance**: Load time goals
- **Security**: Auth requirements
- **Browser Support**: Compatibility
- **Accessibility**: WCAG compliance

## Implementation Notes
- Special considerations
- Third-party dependencies
- Potential challenges
```

## Specification Best Practices

### 1. Be Specific
```markdown
# Bad ❌
"Show user information"

# Good ✅
"Display user avatar (48x48px), full name (font-semibold), 
email (text-sm text-muted), and role badge"
```

### 2. Include Examples
```markdown
## Example Usage
```tsx
<UserCard 
  user={{
    name: "Jane Doe",
    email: "jane@example.com",
    role: "admin"
  }}
  onEdit={() => console.log('Edit clicked')}
/>
```
```

### 3. Define Error States
```markdown
## Error Handling
- Network error: Show toast with retry button
- Validation error: Inline field errors
- 404: Redirect to not found page
- 500: Show error boundary
```

### 4. Specify Responsive Behavior
```markdown
## Responsive Design
- Desktop (>1024px): 3 column grid
- Tablet (768-1024px): 2 column grid
- Mobile (<768px): Single column stack
```

### 5. Include Performance Goals
```markdown
## Performance Requirements
- Initial load: <3s
- Search results: <500ms
- Animations: 60fps
- Bundle size: <50KB
```

## Working with Specifications

### Reading Specifications
When AI reads a specification, it understands:
- What to build (components, features)
- How to structure it (file organization)
- What it should look like (design details)
- How it should behave (interactions)

### Updating Specifications
As requirements change:
1. Update the specification first
2. Have AI refactor based on new spec
3. Keep specifications in sync with code

### Versioning Specifications
For major changes:
```
specs/
├── user-auth-v1.md       # Original
├── user-auth-v2.md       # With OAuth
└── user-auth-current.md  # Symlink to latest
```

## Common Specification Patterns

### CRUD Operations
```markdown
# [Entity] Management Specification

## Operations
1. **Create**: Modal form with validation
2. **Read**: Paginated table with search
3. **Update**: Inline or modal editing
4. **Delete**: Soft delete with confirmation

## Components
- EntityList: Table view
- EntityForm: Create/edit form
- EntityDetails: Read-only view
- EntitySearch: Filter controls
```

### Authentication Flow
```markdown
# Authentication Specification

## Flow
1. Show login/signup form
2. Validate credentials
3. Generate session token
4. Redirect to dashboard
5. Persist session

## Security
- Hash passwords with bcrypt
- JWT tokens with refresh
- CSRF protection
- Rate limiting
```

### Dashboard Layout
```markdown
# Dashboard Layout Specification

## Structure
- Header: Logo, nav, user menu
- Sidebar: Navigation (collapsible)
- Main: Page content with breadcrumbs
- Footer: Links and version

## Responsive
- Desktop: Full sidebar
- Tablet: Collapsed sidebar
- Mobile: Bottom navigation
```

## Specification Examples

Check the `specs/` directory for real examples:
- `user-authentication-spec.md`
- `dashboard-layout-spec.md`
- `payment-integration-spec.md`

## Tools for Specifications

### VS Code Extensions
- **Markdown Preview**: View formatted specs
- **Mermaid**: Create diagrams in specs
- **Todo Tree**: Track spec tasks

### AI Commands
- `/transpose`: Design → Specification
- `/breakdown`: Requirements → Plan
- `/validate`: Check spec completeness

## Tips for Success

1. **Start Visual**: Mockups are easier than writing
2. **Iterate**: Specifications evolve with your product
3. **Be Complete**: Cover edge cases and errors
4. **Stay Consistent**: Use similar patterns across specs
5. **Version Control**: Track specification changes

## Next Steps

- Create your first specification
- Try both design-first and spec-first approaches
- Explore example specifications
- Build features with confidence

Remember: The time spent on specifications is paid back 10x in development speed and accuracy. Invest in good specs, and AI will build exactly what you envision!