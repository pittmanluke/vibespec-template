'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileCode2, FileText, FolderOpen, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

export function SpecsWorkflow() {
  const [exampleAnimationStep, setExampleAnimationStep] = useState(0);
  const [specAnimationStep, setSpecAnimationStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setExampleAnimationStep((prev) => (prev + 1) % 4);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Offset the spec animation by 1.75 seconds for visual interest
    let interval: NodeJS.Timeout;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        setSpecAnimationStep((prev) => (prev + 1) % 4);
      }, 3500);
    }, 1750);
    
    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, []);

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

  const renderWorkflow = (workflowKey: 'example' | 'spec', animationStep: number) => {
    const workflow = workflows[workflowKey];
    const Icon = workflow.icon;

    return (
      <Card className="overflow-hidden h-full">
        <CardContent className="p-6 md:p-8">
          {/* Workflow Header */}
          <div className="flex items-center gap-3 mb-6">
            <Icon className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-semibold">{workflow.title}</h3>
          </div>

          {/* Steps */}
          <div className="space-y-6">
            {workflow.steps.map((step, index) => (
              <div key={index} className="relative">
                <div className={`
                  flex gap-4 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]
                  ${animationStep >= index ? 'opacity-100 translate-x-0' : 'opacity-30 translate-x-2'}
                `}>
                  {/* Step Number */}
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ease-out shrink-0
                    ${animationStep >= index 
                      ? 'bg-primary text-primary-foreground scale-110' 
                      : 'bg-muted text-muted-foreground scale-100'
                    }
                  `}>
                    {index + 1}
                  </div>

                  {/* Step Content */}
                  <div className="space-y-2 flex-1">
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

                {/* Connecting Line */}
                {index < workflow.steps.length - 1 && (
                  <div className={`
                    absolute left-4 top-12 h-full w-px bg-border transition-all duration-500
                    ${animationStep > index ? 'opacity-100' : 'opacity-20'}
                  `} />
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
    );
  };

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
          VibeSpec transforms them into clear, project-aware specifications that AI understands.
        </p>
      </div>

      {/* Side-by-side Workflows */}
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Example Workflow */}
          {renderWorkflow('example', exampleAnimationStep)}
          
          {/* Spec Workflow */}
          {renderWorkflow('spec', specAnimationStep)}
        </div>
      </div>

      {/* Bottom Note */}
      <p className="text-center mt-12 text-sm text-muted-foreground max-w-2xl mx-auto">
        No more guessing what AI will build. Specifications create a clear contract 
        between your vision and the implementation.
      </p>
    </section>
  );
}