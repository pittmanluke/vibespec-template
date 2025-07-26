'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Terminal, FileText, Bot } from "lucide-react";

const claudeMdContent = `# CLAUDE.md - AI Assistant Technical Context

**MANDATORY: This document contains strict rules and technical context for AI assistants. All rules must be followed without exception.**

> **Document Precedence**: User instructions > CLAUDE.md > VibeSpec Template Documentation

## VibeSpec Template Documentation

This project uses the VibeSpec template. For detailed template documentation, see:
- **Core Rules**: \`vibespec/ai-assistant-rules.md\` - The 12 strict rules for AI assistants
- **Architecture**: \`vibespec/architecture-principles.md\` - Core patterns and design principles
- **Project Structure**: \`vibespec/project-structure.md\` - Directory organization and file placement
- **Naming Conventions**: \`vibespec/naming-conventions.md\` - File and component naming rules
- **Tech Stack**: \`vibespec/tech-stack.md\` - Framework versions and configuration
- **Development Workflow**: \`vibespec/development-workflow.md\` - Common tasks and processes
- **Code Quality**: \`vibespec/code-quality.md\` - Standards and validation requirements
- **Feature Flags**: \`vibespec/feature-flags.md\` - Service toggling system
- **Claude Commands**: \`vibespec/claude-commands.md\` - Available automation commands
- **Sub-Agents**: \`vibespec/sub-agents.md\` - Specialized AI assistants for quality control

## Project Overview

This is a production-ready Next.js 15 template with optional Firebase integration. The key feature is its flexibility - developers can start immediately with mock services and enable Firebase features as needed.

**Note**: To adapt this documentation to your specific project after creating initial specifications, run \`/adapt\`.

## Key Architectural Decisions`;

const commands = [
  {
    command: "/context-prime",
    description: "Load project structure and understand context",
    example: "claude\n> /context-prime\n✓ Project context loaded"
  },
  {
    command: "/transpose",
    description: "Transform UI examples into specifications",
    example: "claude\n> /transpose @examples/dashboard.tsx\n✓ Created specs/dashboard-spec.md"
  },
  {
    command: "/breakdown",
    description: "Break PRDs into implementation phases",
    example: "claude\n> /breakdown @specs/feature.md\n✓ Generated phased plan"
  },
  {
    command: "/session:start",
    description: "Begin tracked development session",
    example: "claude\n> /session:start user-auth\n✓ Session started"
  }
];

const subAgents = [
  {
    name: "spec-alignment-guardian",
    description: "Ensures code matches specifications"
  },
  {
    name: "velocity-guardian",
    description: "Prevents feature creep, maintains momentum"
  },
  {
    name: "vibespec-compliance-validator",
    description: "Enforces naming conventions and standards"
  },
  {
    name: "session-state-tracker",
    description: "Captures development state between sessions"
  },
  {
    name: "vibespec-docs-harmonizer",
    description: "Keeps documentation synchronized"
  },
  {
    name: "ui-enhancement-specialist",
    description: "Helps improve UI components"
  }
];

export function ClaudeSection() {
  // Simplified - showing all content without expand/collapse
  
  return (
    <section className="container mx-auto px-4 section-padding">
      <div className="text-center mb-12 space-y-4">
        <Badge variant="outline">
          <Terminal className="w-3 h-3 mr-2" />
          Native AI Integration
        </Badge>
        <h2 className="heading-2">
          Optimized for Claude Code
        </h2>
        <p className="mx-auto max-w-2xl body-lg text-muted-foreground">
          Built from the ground up with Claude Code in mind. Custom /commands, 
          intelligent sub-agents, and deep integration.
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Responsive Grid - Stack on mobile, 2 cols on tablet, 3 on desktop */}
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3 items-start">
          {/* CLAUDE.md Content - Full width on mobile/tablet */}
          <div className="h-full flex flex-col md:col-span-2 xl:col-span-1 min-h-[500px] xl:h-[600px]">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">CLAUDE.md</h3>
            </div>
            <div className="flex-1 bg-zinc-900 rounded-lg overflow-hidden flex flex-col shadow-lg">
              {/* Editor Header */}
              <div className="flex items-center justify-between px-4 py-2 bg-zinc-800 border-b border-zinc-700">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-xs text-zinc-400 ml-2">CLAUDE.md</span>
                </div>
                <span className="text-xs text-zinc-500">AI Context File</span>
              </div>
              
              {/* Code Content */}
              <div className="relative flex-1 overflow-hidden flex flex-col">
                <div className="p-4 sm:p-6 text-xs sm:text-sm font-mono text-zinc-50 overflow-x-auto flex-1 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                  <pre className="whitespace-pre-wrap leading-relaxed">{claudeMdContent}</pre>
                </div>
                {/* Horizontal scroll indicator */}
                <div className="absolute bottom-2 right-2 text-xs text-zinc-500 pointer-events-none sm:hidden bg-zinc-900/80 backdrop-blur-sm px-2 py-1 rounded">
                  ← Scroll →
                </div>
                {/* Fade overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-zinc-900 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Commands Content */}
          <div className="h-full flex flex-col min-h-[500px] xl:h-[600px]">
            <div className="flex items-center gap-2 mb-6">
              <Terminal className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Custom Commands</h3>
            </div>
            <div className="flex flex-col gap-3 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
            {commands.map((cmd, index) => (
              <Card key={index} className="bg-transparent shadow-sm hover:shadow-md transition-shadow border-primary/10 hover:border-primary/20">
                <CardContent className="p-4">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Terminal className="w-4 h-4 text-primary/60" />
                          <h4 className="font-mono text-sm font-semibold text-primary">
                            {cmd.command}
                          </h4>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {cmd.description}
                        </p>
                      </div>
                    </div>
                    <div className="relative bg-zinc-900 dark:bg-zinc-950 rounded-md overflow-hidden border border-zinc-800">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800/50 border-b border-zinc-700">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 rounded-full bg-red-500/60" />
                          <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                          <div className="w-2 h-2 rounded-full bg-green-500/60" />
                        </div>
                        <span className="text-[10px] text-zinc-500 font-mono">terminal</span>
                      </div>
                      <div className="p-2 sm:p-3 font-mono text-[10px] sm:text-xs overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                        <pre className="text-zinc-50 whitespace-pre leading-relaxed">{cmd.example}</pre>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            </div>
          </div>

          {/* Sub-Agents Content */}
          <div className="h-full flex flex-col min-h-[500px] xl:h-[600px]">
            <div className="flex items-center gap-2 mb-6">
              <Bot className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Sub-Agents</h3>
            </div>
            <div className="flex flex-col gap-3 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
              {subAgents.map((agent, index) => (
                <Card key={index} className="bg-transparent shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-1">
                      <h4 className="font-mono text-sm font-semibold text-primary">
                        {agent.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {agent.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Note with Visual Separator */}
      <div className="mt-16 space-y-8">
        <div className="max-w-4xl mx-auto h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <p className="text-sm text-muted-foreground">
            These integrations aren&apos;t just add-ons—they&apos;re fundamental to how VibeSpec works. 
            Commands provide control, while intelligent agents proactively assist your development workflow.
          </p>
          <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Terminal className="w-3 h-3" />
              <span>Manual Commands</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
            <div className="flex items-center gap-2">
              <Bot className="w-3 h-3" />
              <span>Autonomous Agents</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}