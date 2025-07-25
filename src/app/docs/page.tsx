import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Rocket, 
  Command, 
  GitBranch, 
  Code2, 
  BookOpen,
  ArrowRight,
  Github,
  Home
} from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";

export const metadata = generatePageMetadata('docs');

const docSections = [
  {
    icon: Rocket,
    title: "Quick Start",
    description: "Get up and running with VibeSpec in 5 minutes",
    badge: "Start Here",
    content: [
      "Installation and setup",
      "Your first specification",
      "Basic workflow overview",
      "Common patterns"
    ],
    link: "#quick-start"
  },
  {
    icon: FileText,
    title: "Core Concepts",
    description: "Understand the specification-driven approach",
    badge: "Essential",
    content: [
      "What are specifications?",
      "Design-first vs Spec-first",
      "Project structure explained",
      "Best practices"
    ],
    link: "#core-concepts"
  },
  {
    icon: Command,
    title: "Commands Reference",
    description: "All Claude Code commands and their usage",
    badge: "Reference",
    content: [
      "/context-prime",
      "/transpose",
      "/breakdown",
      "/session commands"
    ],
    link: "#commands"
  },
  {
    icon: GitBranch,
    title: "Workflows",
    description: "Step-by-step guides for common tasks",
    badge: "Guides",
    content: [
      "Building a new feature",
      "Managing long sessions",
      "Working with teams",
      "Debugging with AI"
    ],
    link: "#workflows"
  },
  {
    icon: Code2,
    title: "Examples",
    description: "Real-world examples and patterns",
    badge: "Learn",
    content: [
      "User authentication",
      "Dashboard components",
      "API integrations",
      "Full applications"
    ],
    link: "#examples"
  },
  {
    icon: BookOpen,
    title: "Resources",
    description: "Additional guides and references",
    badge: "More",
    content: [
      "AI Development Guide",
      "Troubleshooting",
      "Contributing",
      "Community"
    ],
    link: "#resources"
  }
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition">
              <Home className="h-5 w-5" />
              <span className="font-semibold">VibeSpec</span>
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium">Documentation</span>
          </div>
          <Button asChild variant="ghost" size="icon">
            <Link href="https://github.com/pittmanluke/vibespec" target="_blank" aria-label="GitHub">
              <Github className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">VibeSpec Documentation</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Everything you need to know about spec-driven development with AI
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="#quick-start">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="https://github.com/pittmanluke/vibespec" target="_blank">
              View on GitHub
            </Link>
          </Button>
        </div>
      </section>

      {/* Documentation Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {docSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <Badge variant="secondary">{section.badge}</Badge>
                  </div>
                  <CardTitle>{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {section.content.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button asChild variant="ghost" className="w-full">
                    <Link href={section.link}>
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Quick Start Section */}
      <section id="quick-start" className="container mx-auto px-4 py-16 border-t">
        <h2 className="text-3xl font-bold mb-8">Quick Start</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">1. Create Your Project</h3>
              <div className="bg-zinc-900 rounded-lg p-4 mb-4">
                <pre className="text-sm text-zinc-100">
                  <code>{`npx create-next-app@latest my-app \\
  --example vibespec
cd my-app
npm install`}</code>
                </pre>
              </div>
              <p className="text-muted-foreground">
                This creates a new project with VibeSpec already configured.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">2. Start Claude Code</h3>
              <div className="bg-zinc-900 rounded-lg p-4 mb-4">
                <pre className="text-sm text-zinc-100">
                  <code>{`claude
> /context-prime
> /session:start my-feature`}</code>
                </pre>
              </div>
              <p className="text-muted-foreground">
                Load your project context and begin a tracked session.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* More sections would go here... */}
      <section className="container mx-auto px-4 py-16 text-center border-t">
        <p className="text-muted-foreground mb-4">
          This documentation is a work in progress. More sections coming soon!
        </p>
        <Button asChild variant="outline">
          <Link href="https://github.com/pittmanluke/vibespec/issues" target="_blank">
            Help Improve These Docs
          </Link>
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            VibeSpec Documentation • MIT Licensed • Built with Next.js
          </p>
        </div>
      </footer>
    </div>
  );
}