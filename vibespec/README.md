# VibeSpec Template Documentation

This directory contains the core documentation for the VibeSpec template. These documents define the standards, patterns, and guidelines that make VibeSpec effective for AI-assisted development.

## Core Documentation

### 🤖 AI Development
- [**AI Assistant Rules**](./ai-assistant-rules.md) - The 12 strict rules all AI assistants must follow
- [**AI Development Guide**](./ai-development-guide.md) - Best practices for AI-assisted development
- [**AI Workflow Guide**](./ai-workflow-guide.md) - Comprehensive workflow from planning to deployment
- [**Claude Commands**](./claude-commands.md) - Available automation commands
- [**Sub-Agents Guide**](./sub-agents.md) - Specialized AI assistants for quality control

### 🏗️ Architecture & Structure
- [**Architecture Principles**](./architecture-principles.md) - Core patterns and design principles
- [**Project Structure**](./project-structure.md) - Directory organization and file placement
- [**Naming Conventions**](./naming-conventions.md) - File and component naming rules

### 💻 Development
- [**Development Workflow**](./development-workflow.md) - Common tasks and processes
- [**Tech Stack**](./tech-stack.md) - Framework versions and configuration
- [**Code Quality**](./code-quality.md) - Standards and validation requirements
- [**Feature Flags**](./feature-flags.md) - Service toggling system

### 🚀 Getting Started
- [**Quick Start**](./quick-start.md) - Get up and running quickly
- [**Getting Started**](./getting-started.md) - Comprehensive onboarding guide
- [**Workflow Quickstart**](./workflow-quickstart.md) - Commands and tips reference

### 📋 Specifications
- [**Specifications Guide**](./specifications.md) - How to write effective specifications
- [**Commands Reference**](./commands.md) - Detailed command documentation

### 🛠️ Troubleshooting
- [**Troubleshooting**](./troubleshooting.md) - Common issues and solutions

## Templates

The `templates/` subdirectory contains:
- `CLAUDE.md.template` - Template for project-specific AI context
- `README.md.template` - Template for project README

Use the `/adapt` command to customize these templates for your project.

## How to Use This Documentation

### For New Projects
1. Start with [Quick Start](./quick-start.md) or [Getting Started](./getting-started.md)
2. Review [AI Assistant Rules](./ai-assistant-rules.md) and [Architecture Principles](./architecture-principles.md)
3. Follow [Development Workflow](./development-workflow.md) for daily development
4. Use [Claude Commands](./claude-commands.md) for automation

### For AI Assistants
1. Always follow [AI Assistant Rules](./ai-assistant-rules.md)
2. Reference [Project Structure](./project-structure.md) for file placement
3. Use [Naming Conventions](./naming-conventions.md) for all files
4. Check [Code Quality](./code-quality.md) before committing
5. Work with [Sub-Agents](./sub-agents.md) for automated quality control

### When Customizing
1. Keep all template documentation intact
2. Use `/adapt` command to create project-specific docs
3. Project-specific rules go in root `CLAUDE.md`
4. Template rules stay in `/vibespec/`

## Important Notes

- **Don't modify** these template documents for project-specific needs
- **Do reference** these documents from your project's CLAUDE.md
- **Do use** `/adapt` command to create customized documentation
- **Do maintain** the document precedence: User > CLAUDE.md > Template Docs

## Quick Links

- [Start a session](/claude-commands.md#sessionstart): `/session:start`
- [Convert a design](/claude-commands.md#transpose): `/transpose @file`
- [Break down specs](/claude-commands.md#breakdown): `/breakdown @spec`
- [Adapt documentation](/claude-commands.md#adapt): `/adapt`