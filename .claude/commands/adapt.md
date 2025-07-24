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