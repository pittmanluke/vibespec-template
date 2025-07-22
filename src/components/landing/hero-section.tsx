'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Github, BookOpen, FileCode2 } from "lucide-react";
import { TerminalAnimation } from "@/components/ui/terminal-animation";

export function HeroSection() {
  const terminalSteps = [
    { 
      text: "claude", 
      highlight: "# Start Claude Code CLI"
    },
    { 
      text: "/context-prime", 
      highlight: "# Load project context and structure"
    },
    { 
      text: "/transpose @examples/dashboard.png", 
      highlight: "# Convert design to specification"
    },
    { 
      text: "Build a dashboard based on this spec", 
      highlight: "# Natural language prompt"
    },
    { 
      text: "/session:start dashboard-implementation", 
      highlight: "# Track progress with sessions"
    },
    { 
      text: "/breakdown @specs/user-auth.md", 
      highlight: "# Break down complex features"
    },
    { 
      text: "Implement phase 1 of the auth flow", 
      highlight: "# AI builds incrementally"
    }
  ];

  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="text-center space-y-4">
        {/* Logo/Brand */}
        <div className="flex justify-center mb-6 animate-fade-in">
          <div className="relative group">
            <FileCode2 className="w-16 h-16 text-primary transition-all duration-300 transform-gpu group-hover:text-primary/80" 
                       style={{ backfaceVisibility: 'hidden' }} />
            {/* Glow effect on hover instead of scale */}
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl animate-fade-in animation-delay-100">
          VibeSpec
        </h1>
        
        {/* Subheadline */}
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl animate-fade-in animation-delay-200">
          A template for spec-driven AI-assisted coding
        </p>

        {/* Badge */}
        <div className="flex justify-center animate-fade-in animation-delay-300">
          <Badge variant="secondary" className="px-4 py-1.5 transition-all duration-300 hover:shadow-md hover:shadow-primary/10 cursor-default transform-gpu"
                 style={{ backfaceVisibility: 'hidden' }}>
            Specifications first, code second
          </Badge>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6 px-4 sm:px-0 animate-fade-in animation-delay-400">
          <Button asChild size="lg" className="font-semibold group">
            <Link href="https://github.com/pittmanluke/vibespec" target="_blank">
              <Github className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
              View on GitHub
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="group">
            <Link href="/docs">
              <BookOpen className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
              Read the Docs
            </Link>
          </Button>
        </div>

        {/* Terminal Animation */}
        <div className="mt-12 md:mt-16 max-w-3xl mx-auto animate-fade-in animation-delay-500">
          <TerminalAnimation 
            steps={terminalSteps}
            intervalMs={3000}
            typingSpeed={60}
            title="claude"
          />
        </div>
      </div>
    </section>
  );
}