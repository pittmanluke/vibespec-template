import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Github, BookOpen, Users } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24 bg-muted/30">
      <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20 max-w-5xl mx-auto">
        <CardContent className="p-8 md:p-12 text-center space-y-6">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Ready to Build with Specifications?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join developers who are bringing structure and clarity to AI-assisted development. 
            VibeSpec is open source and improving every day.
          </p>
          
          {/* Primary Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild size="lg" className="font-semibold">
              <Link href="https://github.com/pittmanluke/vibespec" target="_blank">
                <Github className="mr-2 h-5 w-5" />
                Get Started on GitHub
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/docs">
                <BookOpen className="mr-2 h-5 w-5" />
                Read Documentation
              </Link>
            </Button>
          </div>

          {/* Secondary Links */}
          <div className="flex flex-wrap justify-center gap-6 pt-6 text-sm">
            <Link 
              href="#" 
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Users className="w-4 h-4" />
              Join Discord Community
            </Link>
            <Link 
              href="https://github.com/pittmanluke/vibespec/issues" 
              target="_blank"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              Report an Issue
            </Link>
            <Link 
              href="https://github.com/pittmanluke/vibespec/discussions" 
              target="_blank"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              Share Your Workflow
            </Link>
          </div>

          {/* Open Source Note */}
          <div className="pt-6 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              MIT Licensed • Built with Next.js, React, and TypeScript • Contributions Welcome
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}