import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Terminal, 
  FileText, 
  GitBranch, 
  FileCode2,
  MessageSquare,
  HardDrive,
  BookOpen,
  Palette
} from "lucide-react";

const benefits = [
  {
    icon: Terminal,
    title: "Claude Code Commands",
    description: "Transform examples and specs into working code with built-in commands.",
    features: ["/transpose @example.tsx", "/breakdown @spec.md", "/context-prime"],
    badge: "Commands"
  },
  {
    icon: MessageSquare,
    title: "Session Management",
    description: "Handle context window limitations with session tracking commands.",
    features: ["/session:start", "/session:update", "Resume where you left off"],
    badge: "Memory"
  },
  {
    icon: HardDrive,
    title: "Local-First Development",
    description: "Build and test with real data locally. No external services required to start.",
    features: ["No API keys needed", "Real data patterns", "Firebase when ready"],
    badge: "Simple"
  },
  {
    icon: FileCode2,
    title: "AI-Friendly Structure",
    description: "Organized file structure with clear patterns that AI assistants understand.",
    features: ["Consistent naming", "Clear separation", "Documented patterns"],
    badge: "Structure"
  },
  {
    icon: BookOpen,
    title: "Workflow Documentation",
    description: "Suggested AI coding workflows based on real experience.",
    features: ["Planning guides", "Session workflows", "Best practices"],
    badge: "Guides"
  },
  {
    icon: FileText,
    title: "Two Ways to Start",
    description: "BYOE: Bring your own example file. BYOS: Bring your own spec.",
    features: ["Example → Spec → Code", "Spec → Plan → Code", "Your choice"],
    badge: "Flexible"
  },
  {
    icon: GitBranch,
    title: "Progressive Enhancement",
    description: "Start simple, add complexity as needed with feature flags.",
    features: ["Local → Firebase", "Simple → Complex", "Your timeline"],
    badge: "Gradual"
  },
  {
    icon: Palette,
    title: "Ready-to-Use UI",
    description: "40+ shadcn/ui components with Tailwind v4. Focus on features, not styling.",
    features: ["Dark mode included", "Fully accessible", "Easy to customize"],
    badge: "UI/UX"
  }
];

export function AIBenefits() {
  return (
    <section className="container mx-auto px-4 py-24">
      <div className="text-center mb-12 space-y-4">
        <h2 className="text-3xl font-bold">
          Features for AI-Assisted Development
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Practical tools and patterns that help founders and developers 
          work more effectively with AI coding assistants.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;
          return (
            <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="absolute top-4 right-4">
                <Badge variant="secondary" className="text-xs">
                  {benefit.badge}
                </Badge>
              </div>
              <CardHeader>
                <div className="mb-4 p-3 w-fit rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">{benefit.title}</CardTitle>
                <CardDescription className="text-sm">
                  {benefit.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-1.5">
                  {benefit.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground">
          A thoughtful collection of tools to help you ship MVPs with AI assistance.
        </p>
      </div>
    </section>
  );
}