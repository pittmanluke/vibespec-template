# AI Development Best Practices Guide

*A practical guide for building applications efficiently with AI coding assistants*

## Welcome! 👋

If you're using AI tools like Claude, Cursor, or Windsurf to build your MVP, this guide will help you avoid common pitfalls and ship faster. These practices come from real-world experience building production applications with AI assistance.

> **Looking for a structured workflow?** Check out our comprehensive [AI Workflow Guide](./ai-workflow-guide.md) for a systematic approach from planning to deployment, or see the [Quick Reference](./workflow-quickstart.md) for commands and tips.

## Who This Guide Is For

- Founders building their first MVP
- Developers new to AI-assisted coding
- Anyone who wants to ship fast without getting bogged down
- Teams embracing "agentic engineering" workflows

## The Core Philosophy

When building with AI, remember:
> **Done is better than perfect. Working code beats elegant architecture. Real users beat imaginary ones.**

## The 13 Best Practices for AI-Assisted Development

### 1. 🔐 Save Authentication for Last

**Why This Matters**: Authentication is a complexity multiplier. It touches every part of your app and introduces configuration headaches, permission issues, and testing difficulties.

**What To Do Instead**:
- Build your entire app as if users are already logged in
- Use a hardcoded user object if needed
- Only add auth after everything else works perfectly

**Pro Tip**: This template includes mock authentication for development. Use it to build features, then switch to real auth at the very end.

### 2. 📊 Use Real Data (With Smart Exceptions)

**The Problem**: AI assistants love creating mock data because it's "safe." But mock data becomes technical debt that obscures whether your app actually works.

**Better Approach**:
- Connect to real APIs from day one
- Use actual databases, not in-memory arrays
- If you need test data, use a real test database

**Smart Exception**: This template includes mock authentication that's intentionally designed for development. Use it! But don't create NEW mocks.

**Example**:
```javascript
// ❌ Don't let AI create new mocks
const mockUsers = [{id: 1, name: "Test User"}]

// ✅ Use real implementations
const users = await db.collection('users').get()

// ✅ Or use the template's existing mocks
import { useAuth } from '@/services/auth' // Uses mock or real based on feature flag
```

### 3. 🧪 Skip the Tests (For Now)

**Controversial But True**: Tests slow down MVP development. By the time you've iterated 50 times, those early tests are testing code that no longer exists.

**When To Add Tests**:
- After you have paying customers
- When you have a stable API
- When the cost of bugs exceeds the cost of testing

**What To Do Instead**: Manual testing is fine for MVPs. Your users will find bugs faster than any test suite.

### 4. 📁 Establish Naming Conventions Early

**Why**: Inconsistent naming creates confusion for both you and the AI. Set the rules once and enforce them always.

**Our Standard**:
- Files: `user-profile.tsx` (kebab-case)
- Folders: `user-management/` (kebab-case)  
- Components: `export function UserProfile` (PascalCase)

**Tip**: Tell your AI assistant about naming conventions in EVERY conversation. They don't remember between sessions.

### 5. 🏗️ Start With This Template

**The Reality**: Starting from scratch wastes the first 2 hours on boilerplate. This template gives you authentication, UI components, and structure out of the box.

**Template Features**:
- **Feature Flags**: Toggle Firebase services on/off via environment variables
- **Mock Auth**: Development-ready authentication (no Firebase setup needed)
- **40+ UI Components**: shadcn/ui components ready to use
- **Clean Architecture**: Enforced separation of concerns

**How To Use This Template**:
1. Clone and run `npm install`
2. Copy `.env.local.example` to `.env.local`
3. Run `npm run dev` - it works immediately!
4. Build your features with mock services
5. Enable Firebase when ready to deploy

### 6. ✅ Demand Error-Free Code

**Set Expectations**: Tell your AI assistant that every piece of code must compile and lint successfully. Don't accept "this should work" - demand "this does work."

**Your Mantra**: "No code gets committed until `npm run build` succeeds."

**Enforcement Tip**: Make your AI run build checks after every few changes.

### 7. 🔍 Check Early, Check Often

**The Habit**: 
```bash
# Run these commands frequently
npm run build  # Catches TypeScript errors
npm run lint   # Catches style issues
```

**Why**: Finding an error after 20 changes is painful. Finding it after 2 changes is trivial.

### 8. 💾 Commit Granularly

**The Pattern**:
1. Make a small change
2. Verify it works
3. Commit immediately
4. Repeat

**Good Commit Messages**:
```
feat: add user profile component
fix: correct API endpoint for user data
refactor: extract common form logic
```

**Why This Helps**: When (not if) something breaks, you can roll back to a working state from 5 minutes ago, not 5 hours ago.

### 9. 🚧 Prevent Feature Creep

**The Temptation**: AI assistants love suggesting "improvements." Don't let them.

**Your Response**: "Let's stick to the original spec. We can add that in v2."

**The Discipline**: 
- Build what you planned
- Ship it
- Get user feedback
- Then iterate

### 10. ♻️ Embrace Reusability

**Before Creating Anything New**, ask your AI:
- "Do we already have a component for this?"
- "Is there an existing utility function?"
- "Can we modify something that exists?"

**The Benefit**: Less code = fewer bugs = faster development

### 11. 🖥️ Don't Double-Run Dev Servers

**The Scenario**: You're testing the app while your AI wants to "verify" their changes.

**The Solution**: Tell your AI you're already running the server. They should just write code and wait for your feedback.

**Time Saved**: 2-3 minutes per iteration × 100 iterations = hours of productivity

### 12. ❓ Train Your AI to Be Uncertain

**Bad AI Behavior**: "I've fixed the issue. It should work now."

**Good AI Behavior**: "I've made changes that should address the issue. Please test and let me know."

**Why**: False confidence wastes time. Honest uncertainty speeds up debugging.

### 13. ⏸️ Control the Pace

**The Problem**: AI assistants want to be helpful and keep building. This leads to half-finished features.

**The Solution**: 
- Give clear, bounded tasks
- Explicitly say "stop and wait" after each task
- Review before moving forward

## Practical Workflows

### Starting a New Feature

1. **Define the feature clearly**: "Build a user profile page that shows name and email"
2. **Set boundaries**: "Just the display, no editing functionality yet"
3. **Check existing code**: "Use our existing components and styles"
4. **Verify completion**: Test it yourself before moving on

### Debugging with AI

1. **Describe the problem precisely**: "The user profile shows 'undefined' instead of the name"
2. **Provide context**: Share error messages and relevant code
3. **Set expectations**: "Find the issue but don't guess at fixes"
4. **Test incrementally**: Fix one thing at a time

### Managing Long Sessions

When context windows fill up:
1. Commit all working code
2. Start a fresh conversation
3. Provide a clear summary of where you left off
4. Reference the committed code

## Project-Specific Tips

### For This Template

- **Feature Flags**: Your best friend for gradual complexity
  ```env
  NEXT_PUBLIC_USE_FIREBASE_AUTH=false  # Start with mock
  NEXT_PUBLIC_USE_FIRESTORE=false      # Enable when ready
  ```
- **File Structure**: Sacred and enforced
  - `/app` - Pages ONLY (no components here!)
  - `/components` - All UI components
  - `/services` - Business logic and APIs
  - `/providers` - React Context providers
- **Mock Auth**: Intentionally included for rapid development
  - Any email/password works
  - Emails with "admin" get admin role
  - Sessions persist in localStorage
- **Tailwind v4**: Use the new `@theme` directive, stick to utility classes

### Working with Different AI Tools

**Claude**: 
- Excellent at understanding context
- Point it to CLAUDE.md for strict rules
- Give it the full picture upfront
- Remind it about naming conventions frequently

**Cursor/Windsurf**: 
- Great at following file patterns
- Let them see your codebase structure
- Be explicit about conventions

**GitHub Copilot**:
- Best for line-by-line assistance
- Write clear comments before code
- Review suggestions carefully

## Red Flags to Watch For

### When AI Is Going Off Track

- Creating NEW mock files (existing template mocks are OK)
- Suggesting architectural rewrites
- Adding unnecessary dependencies
- Writing tests unprompted
- Refactoring working code
- Ignoring the established file structure
- Using relative imports instead of `@/`

### Your Response

"Stop. Let's get back to the original task. We need to [specific thing] without adding complexity."

## The Mindset for Success

### Remember These Truths

1. **Your first version will be wrong** - Ship it anyway
2. **Users don't care about your code** - They care if it works
3. **Perfect is the enemy of done** - Ship at 80% and iterate
4. **Real feedback beats assumptions** - Get it in front of users ASAP

### Your Daily Checklist

- [ ] Am I building what users asked for?
- [ ] Is my AI following the established patterns?
- [ ] Can I ship this today?
- [ ] Am I adding complexity or removing it?

## Getting Help

### When Stuck

1. **Commit your current state** - Don't lose work
2. **Start a fresh AI conversation** - Clear context helps
3. **Describe the problem simply** - Complex explanations confuse AI
4. **Consider a simpler approach** - Maybe you don't need that feature

### Community Resources

- Share your experience with these practices
- Learn from others building with AI
- Remember: We're all figuring this out together

## Final Thoughts

Building with AI is a superpower, but only if you direct it properly. These practices will help you ship faster, with less frustration, and with code that actually works.

The goal isn't to build the perfect app. The goal is to build an app that solves a real problem for real users. Everything else is just details.

Now stop reading guides and go build something awesome! 🚀

---

*Remember: This guide is based on real experience building MVPs with AI assistance. The Next.js Firebase Template is specifically designed to support these practices. Your mileage may vary, but these practices have helped ship multiple successful MVPs. Try them before you dismiss them!*

**See Also**:
- [README.md](./README.md) - Project setup and features
- [CLAUDE.md](./CLAUDE.md) - Strict rules for AI assistants