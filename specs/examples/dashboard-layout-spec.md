# Dashboard Layout Specification

## Overview
A responsive dashboard layout that provides the main application structure with navigation, content area, and user controls. This layout wraps all authenticated pages.

## Layout Structure

### Desktop Layout (>1024px)
```
┌─────────────────────────────────────────────────────────┐
│ Header (64px)                                           │
│ ┌──────┬──────────────────────────────────┬──────────┐ │
│ │ Logo │     Navigation Menu              │ User Menu │ │
│ └──────┴──────────────────────────────────┴──────────┘ │
├─────────────┬───────────────────────────────────────────┤
│             │                                           │
│  Sidebar    │         Main Content Area                │
│  (240px)    │                                           │
│             │         <Outlet />                        │
│ ┌─────────┐ │                                           │
│ │ Nav     │ │                                           │
│ │ Items   │ │                                           │
│ │         │ │                                           │
│ │         │ │                                           │
│ └─────────┘ │                                           │
│             │                                           │
└─────────────┴───────────────────────────────────────────┘
```

### Mobile Layout (<768px)
```
┌─────────────────────┐
│ Header (56px)       │
│ ┌────┬────────┬───┐ │
│ │Menu│  Logo  │Use│ │
│ └────┴────────┴───┘ │
├─────────────────────┤
│                     │
│   Main Content      │
│                     │
│   <Outlet />        │
│                     │
├─────────────────────┤
│ Bottom Nav (56px)   │
│ ┌───┬───┬───┬───┐  │
│ │Ho │Da │An │Se │  │
│ └───┴───┴───┴───┘  │
└─────────────────────┘
```

## Components

### Header Component
```typescript
interface HeaderProps {
  user: User;
  notifications: Notification[];
  onMenuToggle: () => void;
}
```

**Features:**
- Logo with home link
- Search bar (desktop only)
- Notification bell with count
- User dropdown menu
- Mobile menu toggle

### Sidebar Component
```typescript
interface SidebarProps {
  navigation: NavItem[];
  isOpen: boolean;
  isCollapsed: boolean;
  onToggle: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
  children?: NavItem[];
}
```

**Features:**
- Collapsible on desktop
- Overlay drawer on mobile
- Active state highlighting
- Nested navigation support
- Permission-based visibility

### Main Content Area
```typescript
interface MainContentProps {
  breadcrumbs?: Breadcrumb[];
  title?: string;
  actions?: ReactNode;
  children: ReactNode;
}
```

**Features:**
- Breadcrumb navigation
- Page title and actions
- Scrollable content area
- Loading states
- Error boundaries

## Navigation Structure

### Primary Navigation
```
- Dashboard (/)
- Analytics (/analytics)
- Users (/users)
  - All Users
  - Roles & Permissions
- Content (/content)
  - Posts
  - Media
- Settings (/settings)
  - Profile
  - Account
  - Billing
```

### User Menu
```
- Profile
- Account Settings
- Help & Support
- Sign Out
```

## Behavior

### Responsive Breakpoints
- **Mobile**: <768px (bottom navigation, hamburger menu)
- **Tablet**: 768-1024px (collapsible sidebar)
- **Desktop**: >1024px (full sidebar)

### State Management
```typescript
interface DashboardLayoutState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  activeRoute: string;
  user: User | null;
  notifications: Notification[];
}
```

### Interactions
1. **Sidebar Toggle**
   - Desktop: Collapse to icons only
   - Mobile: Full overlay with backdrop
   - Persist preference in localStorage

2. **Route Changes**
   - Update active state
   - Close mobile menu
   - Scroll to top
   - Update breadcrumbs

3. **Notifications**
   - Real-time updates via WebSocket
   - Click to mark as read
   - Link to relevant content

## Styling

### Design Tokens
```css
--header-height: 64px;
--sidebar-width: 240px;
--sidebar-collapsed-width: 64px;
--mobile-header-height: 56px;
--mobile-nav-height: 56px;
```

### Colors
- Background: `bg-background`
- Header: `bg-card border-b`
- Sidebar: `bg-card border-r`
- Active nav: `bg-primary text-primary-foreground`

### Animations
- Sidebar slide: 300ms ease-in-out
- Route transitions: 200ms fade
- Hover states: 150ms ease-out

## Implementation

### File Structure
```
src/components/layouts/dashboard/
├── dashboard-layout.tsx
├── dashboard-header.tsx
├── dashboard-sidebar.tsx
├── dashboard-nav.tsx
├── dashboard-mobile-nav.tsx
├── dashboard-user-menu.tsx
└── index.ts
```

### Key Dependencies
- `next/navigation` for routing
- `@/hooks/use-media-query` for responsive behavior
- `@/stores/layout-store` for state management
- `@/components/ui/*` for UI components

### Performance Optimizations
- Lazy load route components
- Virtualize long navigation lists
- Debounce search input
- Cache user preferences
- Minimize re-renders with memo

## Accessibility

- Keyboard navigation for all interactive elements
- ARIA landmarks for main regions
- Skip to main content link
- Proper heading hierarchy
- Focus management on route changes
- Screen reader announcements

## Security Considerations

- Route-based access control
- Permission checks for navigation items
- Secure session management
- CSRF protection on actions
- Content Security Policy headers

## Testing Requirements

1. Responsive behavior at all breakpoints
2. Navigation state persistence
3. Keyboard navigation flow
4. Screen reader compatibility
5. Performance metrics (LCP < 2.5s)
6. Cross-browser compatibility
7. Deep linking support