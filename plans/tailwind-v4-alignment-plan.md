# Tailwind CSS v4 Alignment Plan

## Overview
This plan addresses the proper configuration and alignment of Tailwind CSS v4 in the VibeSpec project to ensure a solid foundation for the design system and resolve compatibility issues.

## Current State Analysis

### What's Working
1. **CSS-First Configuration**: Project correctly uses Tailwind v4's CSS-first approach with `@import "tailwindcss"`
2. **PostCSS Setup**: Proper PostCSS configuration with `@tailwindcss/postcss`
3. **Custom Variant**: Dark mode properly configured with `@custom-variant dark`
4. **Base Color System**: OKLCH color system properly defined in `:root`

### Issues Identified

#### 1. Incomplete @theme Mappings
**Current State**: Only 4 colors mapped in @theme block
```css
--color-background: var(--background);
--color-foreground: var(--foreground);
--color-border: var(--border);
--color-ring: var(--ring);
```

**Problem**: Components use utilities for colors not mapped in @theme:
- `ring-offset-background` (used in textarea.tsx, radio-group.tsx)
- `primary`, `secondary`, `muted`, `accent`, `destructive` colors
- `input`, `card`, `popover`, `sidebar` colors

#### 2. Inconsistent Focus State Implementation
**Mixed Approaches**:
- Modern v4 pattern: `focus-visible:ring-ring/50` (button.tsx, input.tsx)
- Legacy pattern: `ring-offset-background`, `ring-offset-2` (textarea.tsx, radio-group.tsx)
- Custom utility classes: `.focus-ring` using invalid utilities

#### 3. CSS Variable References in @theme
**Issue**: The @theme block references CSS variables instead of providing static values, which Tailwind v4 cannot resolve at build time.

## Proposed Solution

### Phase 1: Complete @theme Mappings

#### Add Missing Color Mappings
```css
@theme {
  /* Existing radius tokens */
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  
  /* Complete color mappings */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
}
```

### Phase 2: Standardize Focus States

#### Update Focus Ring Utilities
```css
@layer utilities {
  /* Tailwind v4 compliant focus utilities */
  .focus-ring {
    @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20;
  }
  
  .focus-ring-primary {
    @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20;
  }
}
```

#### Component Updates Required
1. **textarea.tsx**: Replace `ring-offset-background` with proper border/ring utilities
2. **radio-group.tsx**: Update to use new focus pattern
3. **Landing page components**: Already updated, verify they work with new theme

### Phase 3: Remove Ring Offset Utilities

Since Tailwind v4 handles ring offsets differently, we need to:
1. Remove all uses of `ring-offset-background` 
2. Remove all uses of `ring-offset-2`
3. Replace with appropriate `ring-` utilities with opacity modifiers

### Phase 4: Validate Color Usage

#### Ensure All Colors Work
1. Test each color utility in light/dark modes
2. Verify opacity modifiers work (e.g., `/50`, `/20`)
3. Check that all UI components render correctly

## Implementation Steps

### Step 1: Update globals.css
1. Add all missing color mappings to @theme block
2. Update focus-ring utilities to use valid Tailwind v4 patterns
3. Remove any legacy utility definitions

### Step 2: Update UI Components
1. Find all components using `ring-offset-background`
2. Replace with modern focus patterns
3. Test each component's focus state

### Step 3: Verify Build
1. Run `npm run build` to ensure no utility errors
2. Check that CSS file generates properly
3. Verify all colors work in browser

### Step 4: Test Thoroughly
1. Test all interactive components
2. Verify light/dark mode switching
3. Check accessibility (focus states visible)
4. Test on multiple browsers

## Success Criteria

1. **No Build Errors**: All Tailwind utilities compile successfully
2. **Consistent Focus States**: All components use the same focus pattern
3. **Complete Color System**: All design tokens available as utilities
4. **Dark Mode Works**: Theme switching functions properly
5. **Accessibility Maintained**: Focus states clearly visible

## Notes

- Tailwind CSS v4 uses a different approach than v3 for theme configuration
- The @theme block defines design tokens that Tailwind uses to generate utilities
- CSS variables in @theme are resolved at build time, not runtime
- This approach maintains the existing design system while aligning with v4 best practices

## References
- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs/v4)
- [CSS-First Configuration](https://tailwindcss.com/docs/v4/css-first-configuration)
- [Theme Configuration](https://tailwindcss.com/docs/v4/theme-configuration)