import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/ui/logo";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { ArrowLeft, Book, Code2, Rocket, Settings } from "lucide-react";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <Logo size={24} />
              <h1 className="text-xl font-bold">Documentation</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ModeToggle />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              VibeSpec Template Docs
            </Badge>
            <h1 className="text-4xl font-bold mb-4">Getting Started</h1>
            <p className="text-xl text-muted-foreground">
              Learn how to use the VibeSpec template to build your next project
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mb-12">
            <Card>
              <CardHeader>
                <Book className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Quick Start</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get up and running in minutes. Clone the template, install dependencies, and start building.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Code2 className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Project Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Understand the file organization and architectural patterns used in the template.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Settings className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Learn about environment variables, feature flags, and customization options.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Rocket className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Deployment</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Deploy your app to Vercel, Firebase Hosting, or any platform that supports Next.js.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Installation</CardTitle>
              <CardDescription>
                Follow these steps to get started with the VibeSpec template
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">1. Clone the template</h3>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <code>npx create-next-app@latest my-app --example github.com/vibespec/vibespec-template</code>
                </pre>
              </div>

              <div>
                <h3 className="font-semibold mb-2">2. Install dependencies</h3>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <code>cd my-app && npm install</code>
                </pre>
              </div>

              <div>
                <h3 className="font-semibold mb-2">3. Set up environment variables</h3>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <code>cp .env.local.example .env.local</code>
                </pre>
              </div>

              <div>
                <h3 className="font-semibold mb-2">4. Start the development server</h3>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <code>npm run dev</code>
                </pre>
              </div>
            </CardContent>
          </Card>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              For detailed documentation and guides, visit the VibeSpec documentation
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <Link href="/vibespec">
                  View Full Documentation
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="https://github.com/vibespec/vibespec-template">
                  GitHub Repository
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}