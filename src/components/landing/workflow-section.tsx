'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Workflow, FileText, GitBranch, Zap, Brain } from "lucide-react";
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
          Steps to Efficient AI Coding
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


        {/* Bottom Message */}
        <div className="text-center mt-16">
          <p className="text-lg font-medium">
            Embrace this workflow and watch your development process transform.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Each pillar reinforces the others, creating a seamless development experience.
          </p>
        </div>
      </div>
    </section>
  );
}