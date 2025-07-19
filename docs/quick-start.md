# VibeSpec Quick Start

Get running in 5 minutes.

## Setup

```bash
npx create-next-app@latest my-app --example github.com/pittmanluke/vibespec
cd my-app
npm install
npm run dev
```

## Start Building

```bash
claude
/context-prime    # Load project
/session:start    # Track progress
```

## Transform Designs → Specs

```bash
# Save mockup to examples/feature.tsx
/transpose @examples/feature.tsx
# Creates: specs/feature-spec.md
```

## Transform Requirements → Plans

```bash
# Write requirements in specs/feature.md
/breakdown @specs/feature.md
# Creates: plans/implement-feature.md
```

## Key Commands

- `/context-prime` - Load project structure
- `/session:start` - Begin development session
- `/session:update` - Save progress
- `/transpose` - Design → Specification
- `/breakdown` - Requirements → Implementation plan

## Project Structure

```
src/
├── app/          # Pages (routes only)
├── components/   # UI components
├── services/     # Business logic
specs/            # Your specifications
examples/         # Design mockups
```

## That's it!

You're ready to build. Check the [full README](../README.md) when you need more details.