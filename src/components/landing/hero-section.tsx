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
          <Badge variant="secondary" className="px-4 py-1.5 transition-all hover:scale-105 cursor-default">
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

        {/* Terminal Animation */}
        <div className="mt-12 md:mt-16 max-w-3xl mx-auto">
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