'use client';

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileText, Terminal, Brain } from "lucide-react";

const examples = [
  {
    title: "BYOE: Bring Your Own Example",
    icon: FileText,
    description: "Transform UI examples into working features",
    steps: [
      {
        label: "1. Save your example",
        code: [
          "// Save artifact to examples/",
          "// e.g., dashboard-ui.tsx"
        ]
      },
      {
        label: "2. Transpose to spec",
        code: [
          "claude",
          "/transpose @examples/dashboard-ui.tsx",
          "// Creates specs/transposed-dashboard.md"
        ]
      },
      {
        label: "3. Build from spec",
        code: [
          "// AI now understands your feature",
          "// Builds using template patterns",
          "// Components mapped to shadcn/ui"
        ]
      }
    ]
  },
  {
    title: "BYOS: Bring Your Own Spec",
    icon: Brain,
    description: "Break down PRDs into implementation plans",
    steps: [
      {
        label: "1. Write your PRD",
        code: [
          "// Create detailed spec",
          "// Save to specs/my-feature.md"
        ]
      },
      {
        label: "2. Break it down",
        code: [
          "claude",
          "/breakdown @specs/my-feature.md",
          "// Creates phased implementation plan"
        ]
      },
      {
        label: "3. Execute phases",
        code: [
          "// Follow the generated plan",
          "// Each phase is manageable",
          "// Clear acceptance criteria"
        ]
      }
    ]
  },
  {
    title: "Session Management",
    icon: Terminal,
    description: "Handle long coding sessions effectively",
    steps: [
      {
        label: "1. Start session",
        code: [
          "claude",
          "/session:start",
          "// Context loaded, ready to work"
        ]
      },
      {
        label: "2. Track progress",
        code: [
          "// After significant changes:",
          "/session:update",
          "// Saves current state"
        ]
      },
      {
        label: "3. Resume anytime",
        code: [
          "// Context window full?",
          "// Start fresh conversation",
          "// Previous work is remembered"
        ]
      }
    ]
  }
];

export function CodeComparison() {
  return (
    <section className="container mx-auto px-4 py-24">
      <div className="text-center mb-12 space-y-4">
        <h2 className="text-3xl font-bold">
          Practical AI Workflows
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Three ways to work more effectively with AI coding assistants. 
          Choose the approach that fits your project.
        </p>
      </div>

      <Tabs defaultValue="0" className="max-w-5xl mx-auto">
        <TabsList className="grid grid-cols-3 w-full max-w-lg mx-auto mb-8">
          {examples.map((example, index) => (
            <TabsTrigger key={index} value={index.toString()} className="text-xs sm:text-sm">
              {example.title.split(':')[0]}
            </TabsTrigger>
          ))}
        </TabsList>

        {examples.map((example, index) => {
          const Icon = example.icon;
          return (
            <TabsContent key={index} value={index.toString()} className="space-y-6">
              <Card className="p-8">
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary">
                      <Icon className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{example.title}</h3>
                      <p className="text-muted-foreground">{example.description}</p>
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="grid md:grid-cols-3 gap-6">
                    {example.steps.map((step, stepIndex) => (
                      <div key={stepIndex} className="space-y-3">
                        <Badge variant="outline" className="text-xs">
                          {step.label}
                        </Badge>
                        <div className="bg-gray-100 dark:bg-zinc-900 rounded-lg p-4 font-mono text-sm space-y-1">
                          {step.code.map((line, lineIndex) => (
                            <div key={lineIndex} className="text-muted-foreground">
                              {line.startsWith('//') ? (
                                <span className="text-green-600 dark:text-green-400">{line}</span>
                              ) : line.startsWith('claude') || line.startsWith('/') ? (
                                <span>
                                  <span className="text-primary">$</span> {line}
                                </span>
                              ) : (
                                line
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Bottom note */}
      <div className="mt-12 text-center max-w-3xl mx-auto">
        <p className="text-sm text-muted-foreground">
          These workflows help manage complexity and context limitations when building with AI. 
          Start with whichever approach feels most natural for your project.
        </p>
      </div>
    </section>
  );
}