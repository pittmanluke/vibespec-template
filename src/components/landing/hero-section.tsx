'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Clock, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";

export function HeroSection() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isClient, setIsClient] = useState(false);
  
  const steps = [
    { text: "git clone template", highlight: "# Start with a solid foundation" },
    { text: "/transpose @example.tsx", highlight: "# Turn examples into specs" },
    { text: "/breakdown @spec.md", highlight: "# Or bring your own spec" },
    { text: "npm run dev", highlight: "# Build locally, no setup needed" }
  ];

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return; // Don't start interval until client-side
    
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [steps.length, isClient]);

  return (
    <section className="container mx-auto px-4 py-24 space-y-8">
      <div className="text-center space-y-4">
        {/* Trust Badge */}
        <div className="flex justify-center mb-8">
          <Badge variant="outline" className="px-4 py-1.5">
            <Sparkles className="w-3 h-3 mr-2" />
            Built for Claude Code & AI-Assisted Development
          </Badge>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          Ship Your <span className="text-primary">MVP Faster</span> with AI
        </h1>
        
        {/* Subheadline */}
        <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl">
          A thoughtful starting point for founders building with AI. Manage context windows, 
          transform examples into specs, and develop locally without the complexity.
        </p>

        {/* Value Props */}
        <div className="flex flex-wrap justify-center gap-6 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span>Claude Code commands built-in</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4 text-primary" />
            <span>Session management for context</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Local-first development</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Button asChild size="lg" className="font-semibold">
            <Link href="/auth/signup">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/ai-development-guide.md" target="_blank">
              Read AI Dev Guide
            </Link>
          </Button>
        </div>

        {/* Animated Code Preview */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="bg-card border rounded-lg p-6 text-left">
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
                    <span className="text-muted-foreground ml-4 text-xs">
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