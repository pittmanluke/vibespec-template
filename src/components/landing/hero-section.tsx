'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Github, BookOpen, FileCode2 } from "lucide-react";
import { useState, useEffect } from "react";

export function HeroSection() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isClient, setIsClient] = useState(false);
  
  const steps = [
    { text: "npx create-next-app --example vibespec", highlight: "# Start with structure" },
    { text: "/transpose @examples/design.tsx", highlight: "# Transform to specification" },
    { text: "/breakdown @specs/feature.md", highlight: "# Or break down requirements" },
    { text: "/context-prime", highlight: "# AI understands your project" }
  ];

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [steps.length, isClient]);

  return (
    <section className="container mx-auto px-4 py-24 space-y-8">
      <div className="text-center space-y-6">
        {/* Logo/Brand */}
        <div className="flex justify-center mb-6">
          <FileCode2 className="w-16 h-16 text-primary" />
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          VibeSpec
        </h1>
        
        {/* Subheadline */}
        <p className="mx-auto max-w-[600px] text-xl text-muted-foreground md:text-2xl">
          A template for spec-driven AI-assisted coding
        </p>

        {/* Badge */}
        <div className="flex justify-center">
          <Badge variant="secondary" className="px-4 py-1.5">
            Specifications first, code second
          </Badge>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
          <Button asChild size="lg" className="font-semibold">
            <Link href="https://github.com/pittmanluke/vibespec" target="_blank">
              <Github className="mr-2 h-5 w-5" />
              View on GitHub
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/docs">
              <BookOpen className="mr-2 h-5 w-5" />
              Read the Docs
            </Link>
          </Button>
        </div>

        {/* Animated Terminal Preview */}
        <div className="mt-16 max-w-2xl mx-auto">
          <div className="bg-card border rounded-lg p-6 text-left shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="text-xs text-muted-foreground ml-2">terminal</span>
            </div>
            <div className="font-mono text-sm space-y-2">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`transition-all duration-500 ${
                    isClient && index === currentStep 
                      ? 'opacity-100 text-foreground' 
                      : isClient && index < currentStep 
                        ? 'opacity-50 text-muted-foreground' 
                        : 'opacity-20 text-muted-foreground'
                  }`}
                >
                  <span className="text-primary">$</span> {step.text}
                  {isClient && index === currentStep && (
                    <span className="text-muted-foreground ml-4 text-xs italic">
                      {step.highlight}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}