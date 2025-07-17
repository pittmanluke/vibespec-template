# Examples Directory

This directory contains example code, reference implementations, and exported artifacts.

## What belongs here?

- **Exported Artifacts**: Files exported from Claude Desktop or other AI tools
- **Reference Implementations**: Example code showing how to use features
- **UI Components**: Sample component implementations
- **Code Snippets**: Reusable pieces of code
- **Configuration Examples**: Sample config files
- **Integration Examples**: How to integrate with third-party services

## What doesn't belong here?

- Production code (should be in `/src`)
- Documentation (use `/docs` instead)
- Plans or specifications (use `/plans` or `/specs`)
- Test files (keep with source code)

## Current Files

### improved-design-generator.tsx
This file was exported from Claude Desktop's artifact feature during the external planning phase. It's a React component that demonstrates an interactive design system generator, showcasing:
- Multiple design style presets (Linear, Stripe, Vercel, Carbon)
- Interactive UI for selecting design options
- Theme switching capabilities
- Responsive preview modes

This serves as a reference for the kind of interactive tools and design systems we might build in our application.

## Naming Convention

Use descriptive filenames that indicate the example's purpose:
- `auth-flow-example.tsx`
- `api-client-usage.ts`
- `firebase-config-example.json`
- `custom-hook-pattern.tsx`

## Best Practices

1. **Comment Thoroughly**: Examples should be well-documented
2. **Keep It Simple**: Focus on demonstrating one concept clearly
3. **Make It Runnable**: Examples should work with minimal setup
4. **Show Best Practices**: Examples should demonstrate good patterns
5. **Version Compatibility**: Note which versions the example works with

## Example File Template

```typescript
/**
 * Example: [What this demonstrates]
 * 
 * This example shows how to [specific use case].
 * 
 * Key concepts:
 * - [Concept 1]
 * - [Concept 2]
 * 
 * Usage:
 * [How to use this example]
 * 
 * Dependencies:
 * - [Required packages]
 * 
 * Created: [Date]
 * Source: [If exported from somewhere]
 */

// Example code here
```