import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Github, BookOpen } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="container mx-auto px-4 section-padding">
      <Card className="bg-transparent border-border/50 content-width-lg border-0 transition-shadow hover:shadow-lg">
        <CardContent className="p-8 md:p-12 text-center space-y-6">
          <h2 className="heading-2">
            Ready to Build?
          </h2>
          <p className="body-lg text-muted-foreground content-width-sm">
            Join developers who are bringing structure and clarity to AI-assisted development. 
            VibeSpec is open source and improving every day.
          </p>
          
          {/* Primary Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild size="lg" className="font-semibold focus-ring transition-shadow hover:shadow-lg group">
              <Link href="https://github.com/pittmanluke/vibespec" target="_blank">
                <Github className="mr-2 h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
                Get Started on GitHub
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="focus-ring transition-shadow hover:shadow-lg group">
              <Link href="/docs">
                <BookOpen className="mr-2 h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
                Read Documentation
              </Link>
            </Button>
          </div>

        </CardContent>
      </Card>
    </section>
  );
}