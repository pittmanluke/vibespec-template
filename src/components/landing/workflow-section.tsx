'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Workflow, FileText, GitBranch, Zap, Brain } from "lucide-react";
import { useState, useEffect } from "react";

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
    color: "text-blue-500"
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
    color: "text-green-500"
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
    color: "text-yellow-500"
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
    color: "text-purple-500"
  }
];

export function WorkflowSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (!isAnimating) return;
    
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % workflowSteps.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isAnimating]);

  return (
    <section className="container mx-auto px-4 py-24 bg-muted/30">
      <div className="text-center mb-12 space-y-4">
        <Badge variant="outline" className="mb-4">
          <Workflow className="w-3 h-3 mr-2" />
          Our Workflow
        </Badge>
        <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">
          Four Pillars of Efficient AI Coding
        </h2>
        <p className="mx-auto max-w-[600px] text-lg text-muted-foreground">
          A continuous cycle that transforms how you build with AI. 
          Each element reinforces the others for maximum efficiency.
        </p>
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Circular Workflow Diagram */}
        <div className="relative mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {workflowSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = activeStep === index;
              
              return (
                <div
                  key={index}
                  className="relative"
                  onMouseEnter={() => {
                    setIsAnimating(false);
                    setActiveStep(index);
                  }}
                  onMouseLeave={() => setIsAnimating(true)}
                >
                  <Card className={`
                    transition-all duration-300 cursor-pointer
                    ${isActive ? 'scale-105 shadow-lg' : 'hover:scale-102'}
                  `}>
                    <CardContent className="p-6 text-center">
                      {/* Icon */}
                      <div className={`
                        w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-all
                        ${isActive ? 'bg-primary/20' : 'bg-muted'}
                      `}>
                        <Icon className={`w-8 h-8 ${isActive ? step.color : 'text-muted-foreground'}`} />
                      </div>
                      
                      {/* Title */}
                      <h3 className="font-semibold mb-2">{step.title}</h3>
                      
                      {/* Description */}
                      <p className="text-sm text-muted-foreground mb-3">
                        {step.description}
                      </p>
                      
                      {/* Details (shown when active) */}
                      <div className={`
                        space-y-1 transition-all duration-300 overflow-hidden
                        ${isActive ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}
                      `}>
                        {step.details.map((detail, i) => (
                          <p key={i} className="text-xs text-muted-foreground">
                            • {detail}
                          </p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>

          {/* Connecting Lines (Desktop Only) */}
          <div className="hidden lg:block absolute inset-0 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 800 200">
              {/* Curved connecting lines */}
              <path
                d="M 200 100 Q 300 50 400 100"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`transition-all duration-300 ${activeStep === 0 || activeStep === 1 ? 'text-primary opacity-100' : 'text-muted-foreground opacity-30'}`}
                strokeDasharray="5,5"
              />
              <path
                d="M 400 100 Q 500 50 600 100"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`transition-all duration-300 ${activeStep === 1 || activeStep === 2 ? 'text-primary opacity-100' : 'text-muted-foreground opacity-30'}`}
                strokeDasharray="5,5"
              />
              <path
                d="M 600 100 Q 700 150 600 200"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`transition-all duration-300 ${activeStep === 2 || activeStep === 3 ? 'text-primary opacity-100' : 'text-muted-foreground opacity-30'}`}
                strokeDasharray="5,5"
              />
              <path
                d="M 200 100 Q 100 150 200 200"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`transition-all duration-300 ${activeStep === 3 || activeStep === 0 ? 'text-primary opacity-100' : 'text-muted-foreground opacity-30'}`}
                strokeDasharray="5,5"
              />
            </svg>
          </div>
        </div>

        {/* Command Examples */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-center">
              See It In Action
            </h3>
            <div className="bg-zinc-900 rounded-lg p-4 font-mono text-sm">
              <div className="space-y-2 text-zinc-100">
                <div className="opacity-60">
                  <span className="text-blue-400">$</span> claude
                </div>
                <div className={activeStep === 0 ? 'opacity-100' : 'opacity-40'}>
                  <span className="text-blue-400">&gt;</span> /transpose @examples/feature.tsx
                  <span className="text-zinc-500 ml-2"># Spec Design</span>
                </div>
                <div className={activeStep === 1 ? 'opacity-100' : 'opacity-40'}>
                  <span className="text-blue-400">&gt;</span> /breakdown @specs/feature.md
                  <span className="text-zinc-500 ml-2"># Planning</span>
                </div>
                <div className={activeStep === 2 ? 'opacity-100' : 'opacity-40'}>
                  <span className="text-blue-400">&gt;</span> /context-prime
                  <span className="text-zinc-500 ml-2"># Context Priming</span>
                </div>
                <div className={activeStep === 3 ? 'opacity-100' : 'opacity-40'}>
                  <span className="text-blue-400">&gt;</span> /session:update
                  <span className="text-zinc-500 ml-2"># Memory Management</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Message */}
        <div className="text-center mt-12">
          <p className="text-lg font-medium">
            This isn&apos;t just a workflow—it&apos;s a system that evolves with your project.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Each cycle makes AI more effective, your code more consistent, and your development faster.
          </p>
        </div>
      </div>
    </section>
  );
}