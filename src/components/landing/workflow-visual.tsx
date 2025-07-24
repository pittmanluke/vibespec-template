'use client';

import { Card, CardContent } from "@/components/ui/card";
import { 
  FileText, 
  Brain, 
  Code2,
  GitBranch,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { useState } from "react";

const pathways = [
  {
    id: "byoe",
    title: "BYOE: Bring Your Own Example",
    icon: FileText,
    description: "Start with a UI example or component",
    steps: [
      {
        title: "Create Example",
        commands: ["// Build in Claude Desktop", "// Save as dashboard.tsx", "// Copy to examples/"],
        description: "Design your UI first"
      },
      {
        title: "Transpose",
        commands: ["claude", "/transpose @examples/dashboard.tsx", "// Generates full spec"],
        description: "Transform to specification"
      },
      {
        title: "Build",
        commands: ["/context-prime", "// AI builds from spec", "// Using template patterns"],
        description: "Implement with AI"
      }
    ]
  },
  {
    id: "byos",
    title: "BYOS: Bring Your Own Spec", 
    icon: Brain,
    description: "Start with a product requirements document",
    steps: [
      {
        title: "Write PRD",
        commands: ["// Define requirements", "// User stories", "// Save to specs/"],
        description: "Document your vision"
      },
      {
        title: "Breakdown",
        commands: ["claude", "/breakdown @specs/feature.md", "// Creates phased plan"],
        description: "Generate implementation plan"
      },
      {
        title: "Execute",
        commands: ["// Follow phases", "// Clear milestones", "// Ship incrementally"],
        description: "Build systematically"
      }
    ]
  }
];

const commonSteps = [
  {
    icon: GitBranch,
    title: "Session Management",
    description: "Handle context windows",
    detail: "Use /session:start and /session:update to manage long coding sessions"
  },
  {
    icon: Code2,
    title: "Local Development",
    description: "No external services needed",
    detail: "Build with real data patterns locally, add Firebase when ready"
  },
  {
    icon: Sparkles,
    title: "Progressive Enhancement",
    description: "Start simple, add complexity",
    detail: "Feature flags let you control when to add external services"
  }
];

export function WorkflowVisual() {
  const [activePathway, setActivePathway] = useState("byoe");

  return (
    <section className="container mx-auto px-4 py-24">
      <div className="text-center mb-12 space-y-4">
        <h2 className="text-3xl font-bold">
          Two Paths to Your MVP
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Whether you start with an example UI or a detailed specification, 
          we have commands to help you build faster with AI.
        </p>
      </div>

      {/* Pathway Selector */}
      <div className="flex justify-center gap-4 mb-12">
        {pathways.map((pathway) => {
          const Icon = pathway.icon;
          return (
            <button
              key={pathway.id}
              onClick={() => setActivePathway(pathway.id)}
              className={`
                flex items-center gap-3 px-6 py-3 rounded-lg border-2 transition-all
                ${activePathway === pathway.id 
                  ? 'border-primary bg-primary/10 text-primary' 
                  : 'border-border bg-background hover:border-primary/50'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{pathway.title.split(':')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Active Pathway Details */}
      {pathways.map((pathway) => {
        if (pathway.id !== activePathway) return null;
        const Icon = pathway.icon;
        
        return (
          <div key={pathway.id} className="max-w-5xl mx-auto mb-16">
            <Card>
              <CardContent className="p-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    <Icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold">{pathway.title}</h3>
                    <p className="text-muted-foreground">{pathway.description}</p>
                  </div>
                </div>

                {/* Steps */}
                <div className="grid md:grid-cols-3 gap-6">
                  {pathway.steps.map((step, index) => (
                    <div key={index} className="relative">
                      {/* Step Number */}
                      <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      
                      <Card className="h-full">
                        <CardContent className="p-6 space-y-4">
                          <h4 className="font-semibold text-lg">{step.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {step.description}
                          </p>
                          <div className="bg-gray-100 dark:bg-zinc-900 rounded-lg p-4 font-mono text-sm space-y-1">
                            {step.commands.map((cmd, cmdIndex) => (
                              <div key={cmdIndex} className="text-muted-foreground">
                                {cmd.startsWith('//') ? (
                                  <span className="text-green-600 dark:text-green-400">{cmd}</span>
                                ) : cmd.startsWith('claude') || cmd.startsWith('/') ? (
                                  <span>
                                    <span className="text-primary">$</span> {cmd}
                                  </span>
                                ) : (
                                  cmd
                                )}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                      
                      {/* Arrow */}
                      {index < pathway.steps.length - 1 && (
                        <div className="hidden md:flex absolute top-1/2 -right-3 transform -translate-y-1/2">
                          <ArrowRight className="w-6 h-6 text-primary" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      })}

      {/* Common Steps */}
      <div className="max-w-4xl mx-auto">
        <h3 className="text-xl font-semibold text-center mb-8">
          Supporting Features for Both Paths
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          {commonSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6 text-center space-y-3">
                  <div className="inline-flex p-3 rounded-lg bg-primary/10 text-primary">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {step.detail}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Bottom Note */}
      <div className="mt-12 text-center max-w-3xl mx-auto">
        <p className="text-sm text-muted-foreground">
          Both approaches lead to the same destination: a working MVP built with AI assistance. 
          Choose the path that matches your starting point.
        </p>
      </div>
    </section>
  );
}