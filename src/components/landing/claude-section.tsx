'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Terminal, FileText, Command } from "lucide-react";
import { useState } from "react";

const claudeMdContent = `# CLAUDE.md - AI Assistant Technical Context

## Project Overview
This is a production-ready Next.js 15 template with optional Firebase integration. 
The key feature is its flexibility - developers can start immediately with mock 
services and enable Firebase features as needed.

## Key Architectural Decisions

### 1. Feature Flags for Firebase Services
All Firebase services can be toggled on/off via environment variables

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
  const [activeTab, setActiveTab] = useState<'claude-md' | 'commands'>('claude-md');

  return (
    <section className="container mx-auto px-4 py-24">
      <div className="text-center mb-12 space-y-4">
        <Badge variant="outline" className="mb-4">
          <Terminal className="w-3 h-3 mr-2" />
          Optimized for Claude Code
        </Badge>
        <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">
          Native AI Integration
        </h2>
        <p className="mx-auto max-w-[600px] text-lg text-muted-foreground">
          Built from the ground up with Claude Code in mind. Custom commands, 
          optimized prompts, and deep integration.
        </p>
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Tab Selector */}
        <div className="flex justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab('claude-md')}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg transition-all
              ${activeTab === 'claude-md' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted hover:bg-muted/80'
              }
            `}
          >
            <FileText className="w-4 h-4" />
            CLAUDE.md Configuration
          </button>
          <button
            onClick={() => setActiveTab('commands')}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg transition-all
              ${activeTab === 'commands' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted hover:bg-muted/80'
              }
            `}
          >
            <Command className="w-4 h-4" />
            Custom Commands
          </button>
        </div>

        {/* Content */}
        {activeTab === 'claude-md' ? (
          <Card>
            <CardContent className="p-0">
              <div className="bg-zinc-900 rounded-lg overflow-hidden">
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
                <div className="p-4 text-sm font-mono text-zinc-100 overflow-x-auto">
                  <pre className="whitespace-pre-wrap">{claudeMdContent}</pre>
                </div>
              </div>
              
              <div className="p-4 bg-muted/50">
                <p className="text-sm text-muted-foreground">
                  The CLAUDE.md file provides essential context to AI assistants, 
                  ensuring they understand your project structure and conventions.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {commands.map((cmd, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-mono text-lg font-semibold text-primary mb-2">
                        {cmd.command}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {cmd.description}
                      </p>
                    </div>
                    <div className="bg-zinc-900 rounded-lg p-3 font-mono text-xs">
                      <pre className="text-zinc-100 whitespace-pre">{cmd.example}</pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground">
                Plus more commands in <code className="px-1 py-0.5 bg-muted rounded">/.claude/commands/</code>
              </p>
            </div>
          </div>
        )}
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