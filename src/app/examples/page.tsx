import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Home, 
  Github,
  FileCode2,
  Layout,
  Users,
  ShoppingCart,
  BarChart3,
  MessageSquare,
  Settings
} from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";

export const metadata = generatePageMetadata('examples');

const examples = [
  {
    title: "User Dashboard",
    description: "Complete dashboard with analytics, charts, and user management",
    icon: Layout,
    tags: ["Full App", "Analytics", "Auth"],
    specs: "/specs/examples/dashboard-layout-spec.md",
    highlights: [
      "Responsive layout system",
      "Real-time data updates",
      "Role-based access control",
      "Dark mode support"
    ]
  },
  {
    title: "User Profile System",
    description: "Comprehensive user profiles with social features",
    icon: Users,
    tags: ["Component", "Social", "CRUD"],
    specs: "/specs/examples/user-profile-spec.md",
    highlights: [
      "Multiple display variants",
      "Follow/unfollow system",
      "Activity statistics",
      "Responsive design"
    ]
  },
  {
    title: "E-commerce Checkout",
    description: "Multi-step checkout flow with payment integration",
    icon: ShoppingCart,
    tags: ["Feature", "Payments", "Forms"],
    specs: "#",
    highlights: [
      "Cart management",
      "Stripe integration",
      "Order confirmation",
      "Inventory tracking"
    ]
  },
  {
    title: "Analytics Dashboard",
    description: "Data visualization with interactive charts",
    icon: BarChart3,
    tags: ["Component", "Charts", "Data"],
    specs: "#",
    highlights: [
      "Multiple chart types",
      "Real-time updates",
      "Export functionality",
      "Custom date ranges"
    ]
  },
  {
    title: "Chat Interface",
    description: "Real-time messaging with typing indicators",
    icon: MessageSquare,
    tags: ["Feature", "Real-time", "WebSocket"],
    specs: "#",
    highlights: [
      "Message threading",
      "File attachments",
      "Read receipts",
      "Emoji reactions"
    ]
  },
  {
    title: "Settings Panel",
    description: "Comprehensive app settings with preferences",
    icon: Settings,
    tags: ["Feature", "Forms", "UX"],
    specs: "#",
    highlights: [
      "Tabbed interface",
      "Form validation",
      "Preference persistence",
      "Import/export settings"
    ]
  }
];

export default function ExamplesPage() {
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
            <span className="font-medium">Examples</span>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/docs">Documentation</Link>
            </Button>
            <Button asChild variant="ghost" size="icon">
              <Link href="https://github.com/pittmanluke/vibespec" target="_blank" aria-label="GitHub">
                <Github className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center animate-fade-in">
        <Badge variant="outline" className="mb-4">
          <FileCode2 className="w-3 h-3 mr-2" />
          Real Examples
        </Badge>
        <h1 className="text-4xl font-bold mb-4">Example Specifications</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          See what you can build with VibeSpec. Each example includes complete specifications 
          and demonstrates different aspects of spec-driven development.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/docs/getting-started">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="https://github.com/pittmanluke/vibespec/tree/main/specs/examples" target="_blank">
              View on GitHub
            </Link>
          </Button>
        </div>
      </section>

      {/* Examples Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {examples.map((example, index) => {
            const Icon = example.icon;
            const hasSpec = example.specs !== "#";
            
            return (
              <Card 
                key={index} 
                className={`${hasSpec ? 'hover:shadow-lg cursor-pointer' : 'opacity-75'} transition-all duration-300 animate-fade-in`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex gap-2">
                      {example.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <CardTitle className="flex items-center justify-between">
                    {example.title}
                    {hasSpec && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
                  </CardTitle>
                  <CardDescription>{example.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Features:</h4>
                      <ul className="space-y-1">
                        {example.highlights.map((highlight, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {hasSpec ? (
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <Link href={example.specs}>
                          View Specification
                          <FileCode2 className="ml-2 h-3 w-3" />
                        </Link>
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" className="w-full" disabled>
                        Coming Soon
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center border-t">
        <h2 className="text-2xl font-bold mb-4">Ready to Build Your Own?</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          These examples show just a fraction of what&apos;s possible with VibeSpec. 
          Start with our templates or create your own specifications from scratch.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="group">
            <Link href="/docs/specifications">
              Learn About Specifications
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="https://github.com/pittmanluke/vibespec" target="_blank">
              <Github className="mr-2 h-5 w-5" />
              Star on GitHub
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            VibeSpec Examples • More examples coming soon • Contributions welcome
          </p>
        </div>
      </footer>
    </div>
  );
}