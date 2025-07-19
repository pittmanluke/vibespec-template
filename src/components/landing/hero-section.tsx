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
    }, 2500);
    return () => clearInterval(interval);
  }, [steps.length, isClient]);

  return (
    <section className="container mx-auto px-4 py-16 md:py-24 animate-fade-in">
      <div className="text-center space-y-4">
        {/* Logo/Brand */}
        <div className="flex justify-center mb-6 animate-slide-up">
          <FileCode2 className="w-16 h-16 text-primary transition-transform duration-300 hover:scale-110" />
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          VibeSpec
        </h1>
        
        {/* Subheadline */}
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
          A template for spec-driven AI-assisted coding
        </p>

        {/* Badge */}
        <div className="flex justify-center">
          <Badge variant="secondary" className="px-4 py-1.5">
            Specifications first, code second
          </Badge>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6 px-4 sm:px-0">
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
        <div className="mt-12 md:mt-16 max-w-3xl mx-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-left shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="text-xs text-muted-foreground ml-2">terminal</span>
            </div>
            <div className="font-mono text-sm space-y-2 text-zinc-100">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                    isClient && index === currentStep 
                      ? 'opacity-100 text-foreground translate-x-0' 
                      : isClient && index < currentStep 
                        ? 'opacity-50 text-muted-foreground -translate-x-1' 
                        : 'opacity-20 text-muted-foreground translate-x-1'
                  }`}
                >
                  <span className="text-primary">$</span> {step.text}
                  {isClient && index === currentStep && (
                    <>
                      <span className="text-muted-foreground ml-4 text-xs italic transition-opacity duration-300">
                        {step.highlight}
                      </span>
                      <span className="inline-block w-2 h-4 bg-primary ml-1 animate-pulse" style={{ animation: 'blink 1s infinite' }} />
                    </>
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