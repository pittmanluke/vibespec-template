import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Circle, Zap, Users, Code2, Shield, Palette, Globe } from "lucide-react";

const roadmapCategories = [
  {
    title: "Core Features",
    icon: Code2,
    items: [
      { title: "Spec-driven workflow", status: "completed", description: "Transform designs and PRDs into specifications" },
      { title: "Claude Code integration", status: "completed", description: "Custom commands and CLAUDE.md file" },
      { title: "Session management", status: "completed", description: "Track development sessions with memory" },
      { title: "Firebase integration", status: "completed", description: "Optional authentication and database" },
      { title: "Enhanced spec templates", status: "in-progress", description: "More templates for common patterns" },
      { title: "Spec validation", status: "planned", description: "Automated checks for spec completeness" },
    ]
  },
  {
    title: "Developer Experience",
    icon: Zap,
    items: [
      { title: "Quick start guide", status: "completed", description: "Get up and running in minutes" },
      { title: "VS Code extension", status: "planned", description: "Direct IDE integration for commands" },
      { title: "CLI tool", status: "planned", description: "Standalone CLI for spec operations" },
      { title: "Spec linting", status: "planned", description: "Ensure spec quality and consistency" },
    ]
  },
  {
    title: "Community",
    icon: Users,
    items: [
      { title: "Documentation site", status: "in-progress", description: "Comprehensive guides and tutorials" },
      { title: "Example gallery", status: "planned", description: "Real-world spec examples" },
      { title: "Discord community", status: "planned", description: "Connect with other developers" },
      { title: "Video tutorials", status: "planned", description: "Step-by-step walkthroughs" },
    ]
  },
  {
    title: "Enterprise",
    icon: Shield,
    items: [
      { title: "Team workspaces", status: "planned", description: "Collaborate on specifications" },
      { title: "Custom AI models", status: "planned", description: "Bring your own AI provider" },
      { title: "SSO integration", status: "planned", description: "Enterprise authentication" },
      { title: "Audit logs", status: "planned", description: "Track all spec changes" },
    ]
  },
];

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12 space-y-4">
          <Badge variant="outline" className="mb-4">
            <Globe className="w-3 h-3 mr-2" />
            Public Roadmap
          </Badge>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Where We&apos;re Going
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            VibeSpec is evolving based on community feedback and real-world usage. 
            Here&apos;s what we&apos;re building next.
          </p>
        </div>

        {/* Roadmap Grid */}
        <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-2">
          {roadmapCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Card key={index} className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {category.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex gap-3">
                        <div className="mt-0.5">
                          {item.status === "completed" ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : item.status === "in-progress" ? (
                            <div className="relative">
                              <Circle className="w-5 h-5 text-yellow-500" />
                              <div className="absolute inset-0 w-5 h-5 rounded-full bg-yellow-500/20 animate-pulse" />
                            </div>
                          ) : (
                            <Circle className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{item.title}</h3>
                            {item.status === "in-progress" && (
                              <Badge variant="secondary" className="text-xs">
                                In Progress
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Community Input */}
        <Card className="max-w-4xl mx-auto mt-12 bg-gradient-to-br from-primary/5 to-background">
          <CardContent className="p-8 text-center">
            <Palette className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-4">Shape the Future</h2>
            <p className="text-muted-foreground mb-6">
              Your feedback drives our roadmap. Join the discussion on GitHub to suggest features, 
              report issues, or contribute to the project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://github.com/pittmanluke/vibespec/discussions"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Join the Discussion
              </a>
              <a
                href="https://github.com/pittmanluke/vibespec/issues/new"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              >
                Suggest a Feature
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}