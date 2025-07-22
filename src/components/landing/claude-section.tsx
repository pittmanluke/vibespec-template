'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Terminal, FileText } from "lucide-react";

const claudeMdContent = `# CLAUDE.md - AI Assistant Technical Context

## Project Overview
This is a production-ready Next.js 15 template with optional 
Firebase integration. Developers can start immediately with 
mock services and enable Firebase features as needed.

## Key Architectural Decisions

### 1. Feature Flags for Firebase Services
All Firebase services can be toggled on/off via environment 
variables

### 2. Mock Services Pattern
When Firebase is disabled, mock services provide the same API

### 3. File Structure Organization
\`\`\`
src/
├── app/           # Next.js pages ONLY
├── components/    # Reusable UI components
├── services/      # Business logic and APIs
└── specs/         # Your specifications
\`\`\``;

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

export function ClaudeSection() {
  return (
    <section className="container mx-auto px-4 section-padding bg-muted/30">
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
          optimized prompts, and deep integration.
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Side-by-side Content */}
        <div className="grid gap-8 lg:gap-12 lg:grid-cols-2">
          {/* CLAUDE.md Content */}
          <div className="h-full flex flex-col">
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
              <div className="p-4 sm:p-6 text-xs sm:text-sm font-mono text-zinc-50 overflow-x-auto flex-1">
                <pre className="whitespace-pre-wrap leading-relaxed">{claudeMdContent}</pre>
              </div>
            </div>
          </div>

          {/* Commands Content */}
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <Terminal className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Custom Commands</h3>
            </div>
            <div className="flex flex-col gap-3 flex-1">
            {commands.map((cmd, index) => (
              <Card key={index} className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-mono text-sm font-semibold text-primary">
                          {cmd.command}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {cmd.description}
                        </p>
                      </div>
                    </div>
                    <div className="bg-zinc-900 dark:bg-zinc-950 rounded p-2 sm:p-3 font-mono text-[10px] sm:text-xs overflow-x-auto">
                      <pre className="text-zinc-50 whitespace-pre leading-relaxed">{cmd.example}</pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Note */}
      <div className="text-center mt-12 max-w-2xl mx-auto">
        <p className="text-sm text-muted-foreground">
          These integrations aren&apos;t just add-ons—they&apos;re fundamental to how VibeSpec works. 
          Every command is designed to streamline your AI development workflow.
        </p>
      </div>
    </section>
  );
}