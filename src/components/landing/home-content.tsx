'use client';

import Link from "next/link";
import { FileCode2 } from "lucide-react";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { HeroSection } from "@/components/landing/hero-section";
import { SpecsWorkflow } from "@/components/landing/specs-workflow";
import { ContextSection } from "@/components/landing/context-section";
import { ClaudeSection } from "@/components/landing/claude-section";
import { WorkflowSection } from "@/components/landing/workflow-section";
import { CTASection } from "@/components/landing/cta-section";
import { HeaderAuth } from "@/components/landing/header-auth";

export function HomeContent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <FileCode2 className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">VibeSpec</h1>
          </div>
          <div className="flex items-center space-x-4">
            <ModeToggle />
            <HeaderAuth />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <HeroSection />

      {/* Better Specs, Better Vibes */}
      <SpecsWorkflow />

      {/* Context is Key */}
      <ContextSection />

      {/* Optimized for Claude Code */}
      <ClaudeSection />

      {/* Our Workflow */}
      <WorkflowSection />

      {/* Secondary CTA */}
      <CTASection />

      {/* Footer */}
      <footer className="border-t py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              VibeSpec • Spec-driven development for AI coding
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 text-sm items-center">
              <Link href="/docs" className="text-muted-foreground hover:text-foreground transition">
                Docs
              </Link>
              <Link href="https://github.com/pittmanluke/vibespec" className="text-muted-foreground hover:text-foreground transition">
                GitHub
              </Link>
              <Link href="/roadmap" className="text-muted-foreground hover:text-foreground transition">
                Roadmap
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}