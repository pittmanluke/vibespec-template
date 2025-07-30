import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/ui/logo";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { ArrowRight, Code2, Zap, Shield, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Logo size={24} />
            <h1 className="text-xl font-bold">My App</h1>
          </div>
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition">
                Dashboard
              </Link>
              <Link href="/docs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition">
                Documentation
              </Link>
            </nav>
            <ModeToggle />
            <Button asChild>
              <Link href="/auth/login">
                Get Started
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            Built with VibeSpec Template
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Welcome to Your New App
          </h1>
          <p className="text-xl text-muted-foreground">
            A modern, production-ready starter template with authentication, 
            theme switching, and Firebase integration.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button size="lg" asChild>
              <Link href="/auth/signup">
                Start Building
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/dashboard">
                View Demo
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Everything You Need to Ship Fast</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            This template includes all the essentials for building modern web applications.
            Start with a solid foundation and focus on what makes your app unique.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <Code2 className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>TypeScript Ready</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Full TypeScript support with strict mode enabled for better developer experience.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>Authentication</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Firebase Auth with mock service for development. Protected routes included.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>Feature Flags</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Toggle Firebase services on/off. Start with mocks, add real services when ready.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Sparkles className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>AI-Ready</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Optimized for Claude Code with commands, sub-agents, and structured workflows.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Build?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              This template provides everything you need to start building your next project.
              Check out the documentation to learn more about the features and best practices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/docs">
                  Read Documentation
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="https://github.com/vibespec/vibespec-template">
                  View on GitHub
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <Logo size={20} />
              <span className="text-sm text-muted-foreground">
                Built with VibeSpec Template
              </span>
            </div>
            <nav className="flex gap-6 text-sm">
              <Link href="/docs" className="text-muted-foreground hover:text-foreground transition">
                Documentation
              </Link>
              <Link href="https://github.com/vibespec/vibespec-template" className="text-muted-foreground hover:text-foreground transition">
                GitHub
              </Link>
              <Link href="https://vibespec.dev" className="text-muted-foreground hover:text-foreground transition">
                VibeSpec
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}