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

    return (
      <Card className="overflow-hidden">
        <CardContent className="p-6 md:p-8">
          {/* Steps */}
          <div className="space-y-6">
              {workflow.steps.map((step, index) => (
                <div key={index} className="relative min-h-[100px]">
                <div className={`
                  flex gap-4 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] transform-gpu
                  ${animationStep >= index ? 'opacity-100 translate-x-0' : 'opacity-30 translate-x-2'}
                `} style={{ backfaceVisibility: 'hidden' }}>
                  {/* Step Number */}
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ease-out shrink-0 transform-gpu border-2
                    ${animationStep >= index 
                      ? 'bg-primary text-primary-foreground border-primary shadow-primary/20' 
                      : 'bg-muted text-muted-foreground border-transparent'
                    }
                  `} style={{ 
                    backfaceVisibility: 'hidden',
                    boxShadow: animationStep >= index ? '0 4px 6px -1px rgba(var(--primary), 0.2)' : '0 0 0 0 transparent'
                  }}>
                    {index + 1}
                  </div>

                  {/* Step Content */}
                  <div className="space-y-2 flex-1">
                    <p className="text-sm font-medium">{step.label}</p>
                    
                    {/* File/Command Display */}
                    {step.file && (
                      <div className={`
                        flex items-center gap-2 p-2 rounded-lg text-sm font-mono transition-all duration-500 ease-out transform-gpu border
                        ${animationStep === index ? 'bg-primary/10 border-primary/20' : 'bg-muted border-transparent hover:bg-muted/80'}
                      `} style={{ 
                        backfaceVisibility: 'hidden',
                        boxShadow: animationStep === index ? '0 4px 6px -1px rgba(var(--primary), 0.1)' : '0 0 0 0 transparent'
                      }}>
                        <FileCode2 className="w-4 h-4 text-primary" />
                        <span>{step.file}</span>
                      </div>
                    )}
                    
                    {step.command && (
                      <div className={`
                        p-2 rounded-lg text-sm font-mono transition-all duration-300 transform-gpu border
                        ${animationStep === index ? 'bg-primary/5 border-primary/10' : 'bg-muted border-transparent'}
                      `} style={{ 
                        backfaceVisibility: 'hidden',
                        willChange: 'transform, opacity',
                        boxShadow: animationStep === index ? '0 4px 6px -1px rgba(var(--primary), 0.05)' : '0 0 0 0 transparent'
                      }}>
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
                    absolute left-4 top-12 w-px bg-border transition-opacity duration-500
                    ${animationStep > index ? 'opacity-100' : 'opacity-20'}
                  `} style={{ height: 'calc(100% - 3rem)' }} />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <section className="container mx-auto px-4 section-padding bg-muted/30">
      <div className="text-center mb-12 space-y-4">
        <Badge variant="outline">
          <Sparkles className="w-3 h-3 mr-2" />
          Better Specs, Better Vibes
        </Badge>
        <h2 className="heading-2">
          Two Paths, One Destination
        </h2>
        <p className="mx-auto max-w-2xl body-lg text-muted-foreground">
          Whether you start with a visual example or written requirements, 
          VibeSpec transforms them into clear, project-aware specifications that AI understands.
        </p>
      </div>

      {/* Side-by-side Workflows */}
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-8 md:grid-cols-2 mb-12">
          {/* Example Workflow */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-3">
              <FileCode2 className="w-6 h-6 text-primary" />
              Start with an Example
            </h3>
            {renderWorkflow('example', exampleAnimationStep)}
          </div>
          
          {/* Spec Workflow */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-3">
              <FileText className="w-6 h-6 text-primary" />
              Start with a Spec
            </h3>
            {renderWorkflow('spec', specAnimationStep)}
          </div>
        </div>
        
        {/* Centered message below both workflows */}
        <div className={`
          text-center transition-opacity duration-700 px-4
          ${(exampleAnimationStep === 3 || specAnimationStep === 3) ? 'opacity-100' : 'opacity-0'}
        `}>
          <div className="p-6 rounded-lg bg-primary/10 inline-block">
            <p className="text-lg font-medium text-primary">
              Clear specifications = Consistent AI output
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Note */}
      <p className="text-center mt-12 body-sm text-muted-foreground max-w-2xl mx-auto">
        No more guessing what AI will build. Specifications create a clear contract 
        between your vision and the implementation.
      </p>
    </section>
  );
}