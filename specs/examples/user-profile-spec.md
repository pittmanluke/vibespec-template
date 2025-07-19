# User Profile Component Specification

## Overview
A responsive user profile component that displays user information, statistics, and actions. This component is used throughout the application wherever user details need to be shown.

## Component Structure

### Props Interface
```typescript
interface UserProfileProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: 'user' | 'admin' | 'moderator';
    joinDate: Date;
    bio?: string;
    stats?: {
      posts: number;
      followers: number;
      following: number;
    };
  };
  variant?: 'compact' | 'full' | 'card';
  showActions?: boolean;
  onEdit?: () => void;
  onMessage?: () => void;
  onFollow?: () => void;
  isFollowing?: boolean;
}
```

## Visual Design

### Layout Structure
```
┌─────────────────────────────────────┐
│ ┌─────┐  Name           [Actions]   │
│ │     │  @username                  │
│ │Avatar│  Role Badge                │
│ │     │  Joined date                │
│ └─────┘                             │
│                                     │
│ Bio text here...                    │
│                                     │
│ ┌──────┬──────┬──────┐             │
│ │Posts │Follow│Follow│             │
│ │ 123  │ 456  │ 789  │             │
│ └──────┴──────┴──────┘             │
└─────────────────────────────────────┘
```

### Variants

#### Compact (default)
- Shows avatar, name, role, and primary action
- Single row layout
- 48px avatar size
- Used in lists and comments

#### Full
- Shows all user information
- Multi-row layout with bio
- 96px avatar size
- Statistics displayed
- Used on profile pages

#### Card
- Elevated card container
- Full information layout
- Hover effects
- Used in user grids

## Behavior

### Interactive States
1. **Hover**
   - Card variant: Subtle elevation change
   - Compact variant: Background color change
   - Avatar: Slight scale (1.05)

2. **Actions**
   - Edit: Opens edit modal (if own profile)
   - Message: Opens message composer
   - Follow: Toggles follow state with optimistic update

3. **Loading States**
   - Skeleton loader while data fetches
   - Preserve layout during updates

### Responsive Behavior
- **Mobile (<640px)**: Stack elements vertically
- **Tablet (640-1024px)**: Compact layout
- **Desktop (>1024px)**: Full layout with side-by-side elements

## Implementation Details

### File Structure
```
src/components/features/user-profile/
├── user-profile.tsx
├── user-profile.types.ts
├── user-profile-skeleton.tsx
├── user-profile-actions.tsx
└── index.ts
```

### Dependencies
- `@/components/ui/avatar`
- `@/components/ui/button`
- `@/components/ui/card` (for card variant)
- `@/components/ui/badge`
- `@/hooks/use-user`
- `date-fns` for date formatting

### State Management
- Local state for optimistic follow updates
- Error boundaries for failed data loads
- Suspense boundaries for async components

## Styling Guidelines

### Colors
- Avatar border: 2px solid border color
- Role badges:
  - Admin: `destructive` variant
  - Moderator: `secondary` variant
  - User: `outline` variant
- Stats text: `muted-foreground`

### Typography
- Name: `text-lg font-semibold`
- Username: `text-sm text-muted-foreground`
- Bio: `text-sm`
- Stats numbers: `text-2xl font-bold`
- Stats labels: `text-xs text-muted-foreground`

### Spacing
- Consistent use of gap-4 between major elements
- Padding: p-4 (compact), p-6 (full/card)
- Avatar margin: mr-4

## Accessibility

- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Screen reader announcements for state changes
- Focus indicators on all interactive elements
- Alt text for avatar images

## Performance Considerations

- Lazy load avatar images
- Memoize component when in lists
- Debounce follow actions
- Virtual scrolling for user lists
- Optimistic updates for better UX

## Error Handling

- Fallback avatar for failed image loads
- Error state for failed user data fetch
- Graceful degradation for missing optional fields
- Toast notifications for action failures

## Testing Scenarios

1. Renders all variants correctly
2. Handles missing optional data
3. Follow/unfollow actions work
4. Responsive breakpoints function
5. Accessibility standards met
6. Loading states display properly
7. Error states handle gracefully