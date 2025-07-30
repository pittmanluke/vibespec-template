# GitHub Repository Setup Instructions

## Step 1: Create the Template Repository

1. Go to https://github.com/new
2. Repository name: `vibespec-template`
3. Description: "Production-ready Next.js template optimized for AI-assisted development"
4. Public repository
5. Do NOT initialize with README (we have one)
6. Do NOT add .gitignore (we have one)
7. License: MIT
8. Click "Create repository"

## Step 2: Push the Template Code

After creating the repository, run these commands in your terminal:

```bash
# Add the template repository as a remote
git remote add template https://github.com/vibespec/vibespec-template.git

# Push the template-cleanup branch as main
git push template template-cleanup:main

# Create and push initial tag
git tag -a v1.0.0 -m "Initial template release"
git push template v1.0.0
```

## Step 3: Configure Repository Settings

In the GitHub repository settings:

### General Settings
- Topics: Add these topics:
  - `nextjs`
  - `template`
  - `typescript`
  - `tailwindcss`
  - `firebase`
  - `claude-code`
  - `ai-development`
  - `starter-template`

### Features
- ✅ Issues
- ✅ Discussions
- ❌ Sponsorships (optional)
- ✅ Projects
- ❌ Wiki (documentation is in the repo)

### Template Repository
- ✅ Check "Template repository" - This allows others to use it as a template

## Step 4: Create Initial Release

1. Go to Releases → "Create a new release"
2. Tag: `v1.0.0`
3. Release title: "Initial Release"
4. Description:
```markdown
# VibeSpec Template v1.0.0

First stable release of the VibeSpec template!

## Features
- ✅ Next.js 15 with App Router
- ✅ TypeScript with strict mode
- ✅ Tailwind CSS v4
- ✅ Firebase integration (optional)
- ✅ Mock services for development
- ✅ Authentication system
- ✅ Dark mode support
- ✅ 30+ UI components
- ✅ Claude Code optimized
- ✅ AI sub-agents included

## Getting Started
```bash
npx create-next-app@latest my-app --example github.com/vibespec/vibespec-template
```

See README for full documentation.
```

## Step 5: Update the Main Repository

After the template repo is created:

```bash
# In your main vibespec repository
# Add the submodule
git submodule add https://github.com/vibespec/vibespec-template.git template-core

# Configure to track main branch
git config -f .gitmodules submodule.template-core.branch main

# Initial update
git submodule update --init --recursive

# Commit the changes
git add .gitmodules template-core
git commit -m "Add vibespec-template as submodule"
```

## Step 6: Verify Everything Works

1. Check that the template repo is accessible
2. Test the npx command:
   ```bash
   npx create-next-app@latest test-app --example github.com/vibespec/vibespec-template
   ```
3. Verify submodule in main repo works
4. Update TEMPLATE_SYNC.md with actual URLs

## Notes

- The template repository should be kept clean and generic
- All VibeSpec-specific branding stays in the main repo
- Use semantic versioning for all releases
- Document breaking changes clearly
- Keep the template README focused on developers using it