# Contributing to VibeSpec

Thank you for your interest in contributing to VibeSpec! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

- **Be respectful**: Treat everyone with respect and kindness
- **Be inclusive**: Welcome diverse perspectives and experiences
- **Be professional**: Focus on constructive feedback and collaboration
- **Be patient**: Remember that everyone is learning and growing

## How to Contribute

### Reporting Issues

Before creating an issue:
1. Check the [existing issues](https://github.com/vibespec/vibespec/issues) to avoid duplicates
2. Ensure you're using the latest version of the template
3. Gather relevant information about your environment

When creating an issue:
- Use a clear, descriptive title
- Provide detailed steps to reproduce the problem
- Include error messages, screenshots, or code samples
- Specify your environment (OS, Node version, etc.)

### Suggesting Enhancements

We welcome suggestions for improvements! Please:
1. Check if the enhancement has already been suggested
2. Clearly describe the proposed feature and its benefits
3. Explain how it aligns with VibeSpec's goals
4. Consider providing examples or mockups

### Submitting Pull Requests

#### Before You Start

1. **Fork the repository** and create your branch from `main`
2. **Set up your development environment**:
   ```bash
   git clone https://github.com/your-username/vibespec.git
   cd vibespec
   npm install --legacy-peer-deps
   cp .env.local.example .env.local
   ```

3. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

#### Development Guidelines

1. **Follow the established patterns**:
   - Use TypeScript with strict mode
   - Follow the file naming conventions (kebab-case)
   - Maintain the project structure
   - Use existing utilities and components

2. **Write clean code**:
   - Keep functions small and focused
   - Add comments for complex logic
   - Use meaningful variable names
   - Follow the existing code style

3. **Test your changes**:
   - Test with mock services enabled
   - Test with Firebase services (if applicable)
   - Verify responsive design
   - Check for TypeScript errors
   - Run linting

4. **Validate before committing**:
   ```bash
   npm run build
   npm run lint
   npm run typecheck
   ```

#### Commit Guidelines

Follow conventional commit format:

```
<type>: <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Test additions or changes
- `chore`: Maintenance tasks

Example:
```
feat: add user profile component

- Create user-profile.tsx with avatar support
- Add profile editing functionality
- Include responsive design

Closes #123
```

#### Submitting Your PR

1. **Update documentation** if needed
2. **Ensure all checks pass**
3. **Create a pull request** with:
   - Clear title describing the change
   - Detailed description of what and why
   - Reference to related issues
   - Screenshots for UI changes

4. **Respond to feedback** promptly and professionally

### Documentation Contributions

Documentation improvements are always welcome! This includes:
- Fixing typos or clarifying instructions
- Adding examples or use cases
- Improving guides and tutorials
- Translating documentation

## Development Setup

### Prerequisites

- Node.js 18.17 or later
- npm (or yarn/pnpm)
- Git
- Code editor with TypeScript support

### Local Development

1. **Install dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Set up environment**:
   ```bash
   cp .env.local.example .env.local
   # Configure as needed
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open browser**:
   Navigate to `http://localhost:3000`

### Project Structure

Familiarize yourself with the project structure:
- `/src/app/` - Next.js pages (routes only)
- `/src/components/` - React components
- `/src/services/` - Business logic
- `/vibespec/` - Template documentation
- `/.claude/` - AI automation commands

See `vibespec/project-structure.md` for detailed information.

## Coding Standards

### TypeScript
- Use strict mode
- Define proper types (no `any`)
- Handle null/undefined cases
- Export types from appropriate files

### File Naming
- Always use kebab-case for files and directories
- Use PascalCase for component exports
- See `vibespec/naming-conventions.md`

### Imports
- Use absolute imports with `@/`
- Order: React → External → Internal → Types
- Group related imports

### Components
- One component per file
- Use functional components
- Include proper TypeScript interfaces
- Follow existing patterns

## Review Process

After submitting a PR:
1. Automated checks will run
2. A maintainer will review your code
3. You may receive feedback or requests for changes
4. Once approved, your PR will be merged

## Getting Help

If you need help:
- Check the [documentation](./vibespec/)
- Look at existing code for examples
- Open a [discussion](https://github.com/vibespec/vibespec/discussions)
- Ask in the issues section

## Recognition

Contributors will be recognized in:
- The project's contributors list
- Release notes for significant contributions
- Special mentions for exceptional work

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for helping make VibeSpec better! 🚀