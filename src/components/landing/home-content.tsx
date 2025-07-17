'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Github } from "lucide-react";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { HeroSection } from "@/components/landing/hero-section";
import { AIBenefits } from "@/components/landing/ai-benefits";
import { ProblemSolution } from "@/components/landing/problem-solution";
import { WorkflowVisual } from "@/components/landing/workflow-visual";
import { CodeComparison } from "@/components/landing/code-comparison";
import { HeaderAuth } from "@/components/landing/header-auth";

export function HomeContent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">Next.js AI Development Template</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button asChild variant="ghost" size="icon">
              <Link href="https://github.com" target="_blank" aria-label="GitHub">
                <Github className="h-5 w-5" />
              </Link>
            </Button>
            <ModeToggle />
            <HeaderAuth />
          </div>
        </div>
      </header>

      {/* Hero Section with AI-focused messaging */}
      <HeroSection />

      {/* Problem/Solution comparison */}
      <ProblemSolution />

      {/* AI Development Benefits */}
      <AIBenefits />

      {/* Workflow Visual */}
      <WorkflowVisual />

      {/* Code Comparison */}
      <CodeComparison />

      {/* Final CTA Section */}
      <section className="container mx-auto px-4 py-24">
        <Card className="bg-gradient-to-r from-primary/90 to-primary text-primary-foreground">
          <CardContent className="flex flex-col items-center justify-center space-y-4 p-12">
            <h2 className="text-3xl font-bold text-center">
              Ready to Build Your MVP?
            </h2>
            <p className="text-center text-lg opacity-90 max-w-[600px]">
              This template is our attempt to make AI-assisted development a bit easier. 
              We hope it helps you ship something great.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/auth/signup">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="secondary" asChild className="bg-secondary/20 hover:bg-secondary/30">
                <Link href="https://github.com" target="_blank">
                  <Github className="mr-2 h-4 w-4" />
                  View on GitHub
                </Link>
              </Button>
            </div>
            <p className="text-sm opacity-75 mt-4">
              MIT licensed. Built by developers who use AI daily.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              A thoughtful starting point for AI-assisted development
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/ai-development-guide.md" className="text-muted-foreground hover:text-foreground transition">
                AI Dev Guide
              </Link>
              <Link href="https://github.com" className="text-muted-foreground hover:text-foreground transition">
                Documentation
              </Link>
              <Link href="https://github.com/issues" className="text-muted-foreground hover:text-foreground transition">
                Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}