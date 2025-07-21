'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Workflow, FileText, GitBranch, Zap, Brain, Terminal } from "lucide-react";
import { useState } from "react";

const workflowSteps = [
  {
    icon: FileText,
    title: "Spec Design",
    description: "Transform ideas into clear specifications",
    details: [
      "Visual mockups → Specs",
      "Requirements → Specs", 
      "Consistent format"
    ],
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20"
  },
  {
    icon: GitBranch,
    title: "Planning",
    description: "Break down features into phases",
    details: [
      "Manageable chunks",
      "Clear milestones",
      "Incremental progress"
    ],
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20"
  },
  {
    icon: Zap,
    title: "Context Priming",
    description: "AI understands your project",
    details: [
      "Load project structure",
      "Understand conventions",
      "Consistent output"
    ],
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/20"
  },
  {
    icon: Brain,
    title: "Memory Management",
    description: "Never lose progress",
    details: [
      "Session tracking",
      "Progress checkpoints",
      "Seamless continuation"
    ],
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20"
  }
];

const commandExamples = [
  {
    command: "/transpose",
    description: "Convert artifacts to specifications",
    example: "/transpose image.png"
  },
  {
    command: "/breakdown",
    description: "Create phased implementation plans",
    example: "/breakdown spec.md"
  },
  {
    command: "/context-prime",
    description: "Load project context for AI",
    example: "/context-prime"
  },
  {
    command: "/session:start",
    description: "Begin tracking development",
    example: "/session:start 'add user auth'"
  }
];

export function WorkflowSection() {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  return (
    <section className="container mx-auto px-4 py-24 bg-muted/30">
      <div className="text-center mb-12 space-y-4">
        <Badge variant="outline" className="mb-4">
          <Workflow className="w-3 h-3 mr-2" />
          Our Workflow
        </Badge>
        <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">
          Four Steps to Efficient AI Coding
        </h2>
        <p className="mx-auto max-w-[600px] text-lg text-muted-foreground">
          A proven workflow that transforms how you build with AI. 
          Follow these steps for maximum efficiency.
        </p>
      </div>

      <div className="max-w-5xl mx-auto">
        {/* 2x2 Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {workflowSteps.map((step, index) => {
            const Icon = step.icon;
            const isHovered = hoveredStep === index;
            
            return (
              <div
                key={index}
                className="relative"
                onMouseEnter={() => setHoveredStep(index)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                <Card className={`
                  transition-all duration-300 cursor-pointer h-full
                  ${isHovered ? 'shadow-lg scale-[1.02]' : 'shadow-sm hover:shadow-md'}
                  ${isHovered ? step.borderColor : ''}
                `}>
                  <CardContent className="p-6">
                    {/* Step Number */}
                    <div className={`
                      absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center
                      font-bold text-sm transition-colors duration-300
                      ${isHovered ? step.bgColor + ' ' + step.color : 'bg-muted text-muted-foreground'}
                    `}>
                      {index + 1}
                    </div>

                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`
                        w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300
                        ${isHovered ? step.bgColor : 'bg-muted'}
                      `}>
                        <Icon className={`w-6 h-6 transition-colors duration-300 ${isHovered ? step.color : 'text-muted-foreground'}`} />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {step.description}
                        </p>
                        
                        {/* Details */}
                        <ul className="space-y-1">
                          {step.details.map((detail, i) => (
                            <li key={i} className={`
                              text-xs transition-all duration-300 flex items-start gap-2
                              ${isHovered ? 'text-foreground translate-x-2' : 'text-muted-foreground'}
                            `}>
                              <span className={`transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-50'}`}>→</span>
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Command Examples Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <Badge variant="secondary" className="mb-4">
              <Terminal className="w-3 h-3 mr-2" />
              Quick Commands
            </Badge>
            <h3 className="text-2xl font-semibold">
              Powerful Commands at Your Fingertips
            </h3>
            <p className="text-muted-foreground mt-2 max-w-[600px] mx-auto">
              Use these commands in Claude to streamline your workflow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {commandExamples.map((cmd, index) => (
              <Card key={index} className="border-dashed hover:border-solid transition-all duration-300 hover:shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded bg-muted flex items-center justify-center flex-shrink-0">
                      <Terminal className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <code className="text-sm font-mono text-primary font-semibold">
                        {cmd.command}
                      </code>
                      <p className="text-xs text-muted-foreground mt-1">
                        {cmd.description}
                      </p>
                      <code className="text-xs font-mono text-muted-foreground mt-2 block">
                        {cmd.example}
                      </code>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Bottom Message */}
        <div className="text-center mt-16">
          <p className="text-lg font-medium">
            Start with Step 1 and watch your development process transform.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Each step builds on the previous, creating a seamless development experience.
          </p>
        </div>
      </div>
    </section>
  );
}