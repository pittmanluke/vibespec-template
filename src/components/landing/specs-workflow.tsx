'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileCode2, FileText, FolderOpen, ArrowRight, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

export function SpecsWorkflow() {
  const [activeWorkflow, setActiveWorkflow] = useState<'example' | 'spec'>('example');
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 4);
    }, 3500);
    return () => clearInterval(interval);
  }, [activeWorkflow]);

  const workflows = {
    example: {
      title: "Start with an Example",
      icon: FileCode2,
      steps: [
        { label: "Drop your design", file: "dashboard.tsx", folder: "/examples" },
        { label: "Run transpose", command: "/transpose @examples/dashboard.tsx" },
        { label: "Spec generated", file: "dashboard-spec.md", folder: "/specs" },
        { label: "AI builds from spec", result: "Consistent, accurate implementation" }
      ]
    },
    spec: {
      title: "Start with a Spec",
      icon: FileText,
      steps: [
        { label: "Drop your PRD", file: "feature-prd.md", folder: "/" },
        { label: "Run breakdown", command: "/breakdown @feature-prd.md" },
        { label: "Specs created", file: "Multiple specs", folder: "/specs" },
        { label: "Phased implementation", result: "Clear roadmap to follow" }
      ]
    }
  };

  const currentWorkflow = workflows[activeWorkflow];

  return (
    <section className="container mx-auto px-4 py-16 md:py-24 bg-muted/30">
      <div className="text-center mb-12 space-y-4">
        <Badge variant="outline">
          <Sparkles className="w-3 h-3 mr-2" />
          Better Specs, Better Vibes
        </Badge>
        <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">
          Two Paths, One Destination
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Whether you start with a visual example or written requirements, 
          VibeSpec transforms them into clear specifications that AI understands.
        </p>
      </div>

      {/* Workflow Selector */}
      <div className="flex justify-center gap-4 mb-12">
        {Object.entries(workflows).map(([key, workflow]) => {
          const Icon = workflow.icon;
          const isActive = activeWorkflow === key;
          return (
            <button
              key={key}
              onClick={() => {
                setActiveWorkflow(key as 'example' | 'spec');
                setAnimationStep(0);
              }}
              className={`
                flex items-center gap-3 px-6 py-3 rounded-xl border-2 transition-all duration-300 ease-out transform hover:-translate-y-0.5
                ${isActive 
                  ? 'border-primary bg-primary/10 text-primary scale-105' 
                  : 'border-border bg-background hover:border-primary/50 hover:scale-102'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{workflow.title}</span>
            </button>
          );
        })}
      </div>

      {/* Animated Workflow */}
      <div className="max-w-5xl mx-auto">
        <Card className="overflow-hidden">
          <CardContent className="p-6 md:p-8">
            <div className="grid md:grid-cols-4 gap-6">
              {currentWorkflow.steps.map((step, index) => (
                <div key={index} className="relative">
                  <div className={`
                    space-y-4 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]
                    ${animationStep >= index ? 'opacity-100 translate-y-0' : 'opacity-30 translate-y-2'}
                  `}>
                    {/* Step Number */}
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ease-out
                      ${animationStep >= index 
                        ? 'bg-primary text-primary-foreground scale-110' 
                        : 'bg-muted text-muted-foreground scale-100'
                      }
                    `}>
                      {index + 1}
                    </div>

                    {/* Step Content */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium">{step.label}</p>
                      
                      {/* File/Command Display */}
                      {step.file && (
                        <div className={`
                          flex items-center gap-2 p-2 rounded-lg bg-muted text-sm font-mono transition-all duration-500 ease-out
                          ${animationStep === index ? 'scale-105 shadow-sm bg-primary/10 border border-primary/20' : 'hover:bg-muted/80'}
                        `}>
                          <FileCode2 className="w-4 h-4 text-primary" />
                          <span>{step.file}</span>
                        </div>
                      )}
                      
                      {step.command && (
                        <div className={`
                          p-2 rounded-lg bg-muted text-sm font-mono transition-all duration-300
                          ${animationStep === index ? 'scale-105 shadow-sm' : ''}
                        `}>
                          <span className="text-primary">$</span> {step.command}
                        </div>
                      )}
                      
                      {step.folder && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <FolderOpen className="w-3 h-3" />
                          <span>{step.folder}</span>
                        </div>
                      )}
                      
                      {step.result && (
                        <p className="text-sm text-muted-foreground italic">
                          {step.result}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Arrow */}
                  {index < currentWorkflow.steps.length - 1 && (
                    <div className={`
                      hidden md:flex absolute top-12 -right-4 transition-all duration-500
                      ${animationStep > index ? 'opacity-100' : 'opacity-20'}
                    `}>
                      <ArrowRight className="w-6 h-6 text-primary" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Result Message */}
            <div className={`
              mt-8 p-4 rounded-lg bg-primary/10 text-center transition-all duration-500
              ${animationStep === 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
            `}>
              <p className="text-sm font-medium text-primary">
                Clear specifications = Consistent AI output
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Note */}
      <p className="text-center mt-12 text-sm text-muted-foreground max-w-2xl mx-auto">
        No more guessing what AI will build. Specifications create a clear contract 
        between your vision and the implementation.
      </p>
    </section>
  );
}