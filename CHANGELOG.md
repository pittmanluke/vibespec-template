# Changelog

All notable changes to the VibeSpec template will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Documentation restructuring with `/vibespec/` directory
- `/adapt` command for customizing project documentation
- Deployment guides for Vercel and Firebase Hosting
- `.env.local.example` with comprehensive variable documentation
- `CONTRIBUTING.md` with contribution guidelines
- GitHub issue and PR templates
- `typecheck` npm script

### Changed
- Improved organization of template documentation
- Updated package.json with generic metadata
- Enhanced README structure

## [1.0.0] - 2024-07-24

### Added
- Initial release of VibeSpec template
- Next.js 15 with App Router support
- TypeScript 5.x with strict mode configuration
- Tailwind CSS v4 integration with new @theme directive
- 40+ shadcn/ui components pre-configured
- Firebase integration with feature flags
- Mock services for local development
- Claude Code automation commands
- Comprehensive documentation structure
- Specification-driven development workflow

### Features
- **Claude Commands**:
  - `/context-prime` - Load project context and understand structure
  - `/session:start` - Begin tracked development session
  - `/session:update` - Track progress during development
  - `/session:end` - Close and document session
  - `/transpose` - Convert design artifacts to specifications
  - `/breakdown` - Break requirements into phased plans

- **Development Experience**:
  - Zero-config local development
  - Hot reload with error overlay
  - TypeScript strict mode enforcement
  - ESLint configuration
  - Organized file structure

- **Firebase Features**:
  - Optional authentication with feature flag
  - Optional Firestore database with feature flag
  - Optional Cloud Storage with feature flag
  - Optional Cloud Functions with feature flag
  - Mock implementations for all services

- **UI/UX**:
  - Dark mode support with system preference detection
  - Responsive design patterns
  - Accessible components from shadcn/ui
  - Tailwind CSS v4 with CSS-first configuration

### Documentation
- Project structure guide
- AI assistant rules
- Development workflow
- Architecture principles
- Troubleshooting guide
- Quick start guide

### Developer Tools
- Session management for long development tasks
- Specification templates
- Implementation plan templates
- Git-friendly workflow

## [0.9.0] - 2024-07-01 (Beta)

### Added
- Beta release for testing
- Core template structure
- Basic Firebase integration
- Initial documentation

### Changed
- Refined file organization
- Improved TypeScript configuration

### Fixed
- Build issues with React 19
- Tailwind CSS v4 compatibility

## Upgrade Guide

### From 0.9.0 to 1.0.0

1. **Update dependencies**:
   ```bash
   npm update --legacy-peer-deps
   ```

2. **Update environment variables**:
   - Copy new `.env.local.example`
   - Migrate your existing values

3. **Update imports**:
   - Check for any changed import paths
   - Update to use new structure

4. **Review breaking changes**:
   - File structure reorganization
   - Updated naming conventions

---

For more details on each release, see the [GitHub Releases](https://github.com/vibespec/vibespec/releases) page.