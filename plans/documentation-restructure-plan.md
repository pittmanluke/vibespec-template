# Documentation Restructuring Plan

## Overview

This plan outlines the comprehensive restructuring of VibeSpec's documentation to better separate template-specific rules from project-specific content. The goal is to enable users to adapt the template to their own projects while maintaining clear references to core guidelines.

## Objectives

1. **Relocate template-specific documents** into a dedicated `/vibespec/` folder
2. **Preserve all content** from the existing CLAUDE.md file in organized sub-documents
3. **Create template versions** of CLAUDE.md and README.md for user projects
4. **Implement /adapt command** to help users customize documentation for their specific projects
5. **Maintain clear references** between project docs and template guidelines

## Phase 1: Organize Template Documentation in /vibespec/

### 1.1 Create Core Template Documents

We'll split the current CLAUDE.md content into logical, focused documents:

#### **vibespec/project-structure.md**
Content to include:
- File Structure Organization (lines 32-50 from CLAUDE.md)
- Naming Conventions (lines 52-56)
- Directory explanations and rules
- Import path conventions

#### **vibespec/tech-stack.md**
Content to include:
- Important Technical Details section (lines 58-75)
- Tailwind CSS v4 configuration
- React 19 notes
- TypeScript configuration
- Package management guidelines

#### **vibespec/ai-assistant-rules.md**
Content to include:
- All 12 Strict Rules for AI Assistants (lines 198-291)
- Communication guidelines
- Code quality requirements
- Development discipline

#### **vibespec/naming-conventions.md**
Content to include:
- File naming rules (kebab-case)
- Directory naming rules
- Component export conventions
- Import patterns

#### **vibespec/development-workflow.md**
Content to include:
- Common Tasks section (lines 76-93)
- Environment Setup (lines 94-107)
- Development Workflow (lines 138-154)
- Testing Approach (lines 108-119)

#### **vibespec/architecture-principles.md**
Content to include:
- Key Architectural Decisions (lines 11-31)
- Architecture Principles (lines 166-188)
- Future Considerations (lines 189-197)
- Technical Context (lines 310-320)

#### **vibespec/code-quality.md**
Content to include:
- Code Quality Checklist (lines 155-165)
- Common Issues & Solutions (lines 120-137)
- Build and lint requirements
- TypeScript strictness rules

#### **vibespec/feature-flags.md**
Content to include:
- Feature Flags for Firebase Services (lines 13-24)
- Mock Services Pattern (lines 25-31)
- Progressive enhancement approach

#### **vibespec/claude-commands.md**
Content to include:
- Claude Commands section (lines 293-309)
- Workflow integration
- Command documentation references

### 1.2 Update Existing Files in /vibespec/

The following files already exist and should remain:
- `ai-development-guide.md`
- `ai-workflow-guide.md`
- `commands.md`
- `getting-started.md`
- `quick-start.md`
- `specifications.md`
- `troubleshooting.md`
- `workflow-quickstart.md`

We'll add cross-references between these and the new documents where appropriate.

## Phase 2: Create Template Versions

### 2.1 CLAUDE.md Template

Location: `vibespec/templates/CLAUDE.md.template`

```markdown
# CLAUDE.md - AI Assistant Technical Context

**MANDATORY: This document contains project-specific rules and technical context for AI assistants. All rules must be followed without exception.**

> **Document Precedence**: User instructions > CLAUDE.md > VibeSpec Template Documentation

## VibeSpec Template Guidelines

This project is built using the VibeSpec template. For core development rules and patterns, refer to:
- **AI Assistant Rules**: `vibespec/ai-assistant-rules.md` - The 12 strict rules all AI assistants must follow
- **Architecture**: `vibespec/architecture-principles.md` - Core patterns and principles
- **File Structure**: `vibespec/project-structure.md` - Directory organization and import paths
- **Naming Conventions**: `vibespec/naming-conventions.md` - File and component naming rules
- **Development Workflow**: `vibespec/development-workflow.md` - Common tasks and processes
- **Code Quality**: `vibespec/code-quality.md` - Standards and validation requirements

## Project Overview

[PROJECT_NAME] is [PROJECT_DESCRIPTION]

### Key Features
[PROJECT_FEATURES]

### Target Audience
[TARGET_AUDIENCE]

## Technical Architecture

### Core Technologies
- Framework: Next.js 15 (App Router)
- Language: TypeScript 5.x
- Styling: Tailwind CSS v4
- UI Components: shadcn/ui
- [ADDITIONAL_TECH_STACK]

### Data Models
```typescript
// Define your primary data structures here
[PROJECT_DATA_MODELS]
```

### API Structure
[PROJECT_API_ENDPOINTS]

### Service Layer
[PROJECT_SERVICES]

## Project Status

### ✅ Completed Features
[COMPLETED_FEATURES]

### 🚧 In Progress
[IN_PROGRESS_FEATURES]

### 📋 Planned Features
[PLANNED_FEATURES]

## Project-Specific Guidelines

### Business Logic Rules
[PROJECT_BUSINESS_RULES]

### UI/UX Conventions
[PROJECT_UI_GUIDELINES]

### State Management
[PROJECT_STATE_MANAGEMENT]

### Authentication & Authorization
[PROJECT_AUTH_RULES]

### External Integrations
[PROJECT_INTEGRATIONS]

## Environment Configuration

### Required Environment Variables
```bash
[PROJECT_ENV_VARS]
```

### Feature Flags
[PROJECT_FEATURE_FLAGS]

## Deployment

### Target Platform
[DEPLOYMENT_PLATFORM]

### Build Configuration
[BUILD_CONFIG]

### Production Considerations
[PRODUCTION_NOTES]

## Development Notes

### Known Issues
[KNOWN_ISSUES]

### Performance Considerations
[PERFORMANCE_NOTES]

### Security Considerations
[SECURITY_NOTES]

## Quick Reference

### Common Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run linting
npm run typecheck    # TypeScript validation
[ADDITIONAL_COMMANDS]
```

### Key Files
- Entry point: `src/app/page.tsx`
- [OTHER_KEY_FILES]

## Additional Context

[ANY_OTHER_PROJECT_SPECIFIC_INFO]

---

**Remember**: Always refer to the VibeSpec template documentation in `/vibespec/` for foundational patterns and rules. This document contains project-specific adaptations only.
```

### 2.2 README.md Template

Location: `vibespec/templates/README.md.template`

```markdown
# [PROJECT_NAME]

[PROJECT_BADGES]

[PROJECT_TAGLINE]

## Overview

[PROJECT_DESCRIPTION_FULL]

### Why [PROJECT_NAME]?

[PROJECT_VALUE_PROPOSITION]

## ✨ Features

[PROJECT_FEATURES_DETAILED]

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm (or yarn/pnpm)
- Git
- [ADDITIONAL_PREREQUISITES]

### Installation

1. **Clone the repository**
   ```bash
   git clone [REPO_URL]
   cd [PROJECT_DIRECTORY]
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Set up environment**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
[PROJECT_NAME]/
├── src/
│   ├── app/              # Next.js pages and routing
│   ├── components/       # React components
│   │   ├── ui/          # Base UI components
│   │   └── [features]/  # Feature-specific components
│   ├── services/        # Business logic and APIs
│   ├── providers/       # Context providers
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utilities and helpers
│   ├── types/          # TypeScript definitions
│   └── config/         # Configuration files
│
├── public/             # Static assets
├── specs/              # Feature specifications
├── plans/              # Implementation plans
└── vibespec/           # Template documentation
```

[ADDITIONAL_STRUCTURE_NOTES]

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Check TypeScript
[ADDITIONAL_SCRIPTS]
```

### Development Workflow

This project follows the VibeSpec methodology. Key references:
- **Specifications**: See `/specs/` for feature specifications
- **Architecture**: See `vibespec/architecture-principles.md`
- **AI Development**: See `vibespec/ai-workflow-guide.md`
- **Troubleshooting**: See `vibespec/troubleshooting.md`

[PROJECT_SPECIFIC_WORKFLOW]

## 🔧 Configuration

### Environment Variables

[ENV_VAR_DOCUMENTATION]

### Feature Flags

[FEATURE_FLAG_DOCUMENTATION]

## 📦 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org)
- **Language**: [TypeScript](https://www.typescriptlang.org)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com)
- [ADDITIONAL_TECH]

## 🚢 Deployment

[DEPLOYMENT_INSTRUCTIONS]

### Build for Production

```bash
npm run build
```

[PLATFORM_SPECIFIC_DEPLOYMENT]

## 🤝 Contributing

[CONTRIBUTING_GUIDELINES]

## 📄 License

[LICENSE_INFO]

## 🙏 Acknowledgments

[ACKNOWLEDGMENTS]

---

Built with [VibeSpec](https://github.com/pittmanluke/vibespec) - Spec-driven development for agentic coding
```

## Phase 3: Create /adapt Command

### 3.1 Command Implementation

Location: `.claude/commands/adapt.md`

```markdown
Help users adapt CLAUDE.md and README.md to their specific project after initial planning and specification phases.

## Usage
`/adapt`

## Overview

The adapt command helps transition from VibeSpec template documentation to project-specific documentation. It should be run after:
1. Creating initial specifications (`/transpose` or `/breakdown`)
2. Implementing core features
3. Establishing project identity

## Process

### Phase 1: Project Analysis

1. **Scan existing specifications**
   - Read all files in `/specs/`
   - Extract feature names and descriptions
   - Identify data models and API structures

2. **Review implementation status**
   - Check `/plans/` for completed work
   - Analyze current `/src/` structure
   - Identify implemented vs planned features

3. **Examine current documentation**
   - Check if CLAUDE.md has been modified
   - Review README.md current state
   - Note any project-specific additions

### Phase 2: Interactive Information Gathering

Ask the user for the following information:

1. **Basic Project Information**
   - Project name
   - Brief tagline (one sentence)
   - Full description (2-3 sentences)
   - Target audience
   - Primary value proposition

2. **Technical Details**
   - Additional dependencies beyond template
   - External services/APIs used
   - Deployment platform preference
   - Any specific environment variables

3. **Features and Status**
   - Confirm discovered features from specs
   - Mark which are complete/in-progress/planned
   - Add any missing features
   - Priority order for planned features

4. **Project-Specific Rules**
   - Business logic constraints
   - UI/UX guidelines specific to this project
   - Authentication/authorization rules
   - Data validation requirements

5. **Additional Context**
   - Known issues or limitations
   - Performance considerations
   - Security requirements
   - Any other important context

### Phase 3: Generate Adapted Documentation

1. **Create new CLAUDE.md**
   - Use `vibespec/templates/CLAUDE.md.template`
   - Fill in all placeholders with gathered information
   - Preserve all VibeSpec template references
   - Add discovered specifications and types
   - Include project-specific rules and context

2. **Create new README.md**
   - Use `vibespec/templates/README.md.template`
   - Professional project description
   - Complete feature list with status indicators
   - Proper badges and links
   - Clear getting started instructions
   - Deployment instructions if known

3. **Generate supplementary docs if needed**
   - `CONTRIBUTING.md` if requested
   - `API.md` if complex API structure
   - `DEPLOYMENT.md` if complex deployment

### Phase 4: Review and Finalize

1. **Present proposed changes**
   - Show diff of current vs new CLAUDE.md
   - Show diff of current vs new README.md
   - Highlight any sections needing review

2. **Allow modifications**
   - Let user edit any section
   - Suggest improvements if needed
   - Ensure accuracy of all information

3. **Apply changes**
   - Back up existing files to `.backup/`
   - Write new files
   - Update any references in other docs

4. **Post-adaptation tasks**
   - Remind to review and commit changes
   - Suggest running build/lint to verify
   - Note any TODOs added to documents

## Interactive Prompts

### Project Information
```
Let's adapt the documentation to your specific project.

Project name: [user input]
Brief tagline (one sentence): [user input]
Full description (2-3 sentences): [user input]
Who is your target audience?: [user input]
What's the main value proposition?: [user input]
```

### Technical Details
```
Now for some technical details:

Have you added dependencies beyond the template? (y/n): [user input]
[if yes] Please list them: [user input]

Are you using any external APIs or services?: [user input]
What's your target deployment platform?: [user input]
Any custom environment variables? (beyond template): [user input]
```

### Feature Review
```
I found these features in your specifications:
[list discovered features]

For each feature, please indicate status:
✅ Complete
🚧 In Progress  
📋 Planned
❌ Not implementing

[interactive status selection]

Any features I missed?: [user input]
```

## Error Handling

- If no specs found: Ask user to create specs first
- If template files missing: Reconstruct from this documentation
- If user unsure about answers: Provide sensible defaults
- If conflicts detected: Always ask for clarification

## Success Criteria

The adaptation is successful when:
1. Both CLAUDE.md and README.md reflect the actual project
2. All template references remain intact
3. Project-specific information is complete
4. Documentation is professional and clear
5. No template boilerplate remains unfilled

## Notes

- This command should be run once project identity is established
- Can be re-run to update documentation as project evolves
- Always preserves connection to VibeSpec template docs
- Encourages best practices in documentation
```

## Phase 4: Implementation Sequence

### Step 1: Create /vibespec/ directory structure
1. Create `/vibespec/` folder
2. Create `/vibespec/templates/` subfolder
3. Move existing template docs from root to `/vibespec/`

### Step 2: Split CLAUDE.md content
1. Create each new document in `/vibespec/`
2. Copy relevant sections from CLAUDE.md
3. Ensure no content is lost
4. Add cross-references between documents
5. Create an index or navigation document

### Step 3: Create template files
1. Create `CLAUDE.md.template` with placeholders
2. Create `README.md.template` with placeholders
3. Test placeholder replacement logic
4. Ensure all sections are covered

### Step 4: Implement /adapt command
1. Create command file in `.claude/commands/`
2. Implement analysis logic
3. Create interactive prompts
4. Test with sample project

### Step 5: Update existing documentation
1. Update current CLAUDE.md to reference `/vibespec/` docs
2. Add note about using `/adapt` command
3. Update root README.md if needed
4. Create migration guide for existing users

## Phase 5: Validation Checklist

### Content Preservation
- [ ] All content from original CLAUDE.md is preserved
- [ ] No rules or guidelines are lost
- [ ] Cross-references work correctly
- [ ] Navigation between documents is clear

### Template Functionality
- [ ] Templates have all necessary placeholders
- [ ] Templates maintain VibeSpec references
- [ ] Templates are comprehensive but not overwhelming
- [ ] Placeholder names are clear and consistent

### Command Functionality
- [ ] /adapt discovers existing specs correctly
- [ ] Interactive flow is smooth and clear
- [ ] Generated documents are complete
- [ ] Error handling works properly
- [ ] Re-running command updates correctly

### User Experience
- [ ] Clear when to run /adapt command
- [ ] Easy to understand prompts
- [ ] Generated docs look professional
- [ ] Process is not too long or tedious
- [ ] Results match user expectations

## Benefits

1. **Clear Separation**: Template rules stay in `/vibespec/`, project rules in root
2. **Easy Onboarding**: New developers understand project faster
3. **Maintain Best Practices**: Template guidelines always accessible
4. **Reduce Confusion**: No mixing of template and project docs
5. **Enable Growth**: Projects can evolve beyond template while keeping foundation
6. **Better AI Context**: AI assistants get cleaner, more relevant context

## Migration Notes

For existing VibeSpec projects:
1. Run documentation restructure
2. Use `/adapt` to update project docs
3. Commit changes
4. Team members pull latest
5. Continue development with clearer documentation

## Success Metrics

- Documentation is clearer and more organized
- Users successfully adapt template to their projects
- AI assistants perform better with cleaner context
- Reduced confusion about template vs project rules
- Easier onboarding for new team members