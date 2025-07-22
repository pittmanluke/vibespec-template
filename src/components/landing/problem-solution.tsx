import { Card, CardContent } from "@/components/ui/card";
import { XCircle, CheckCircle2, Brain, FileText, Code2, Timer } from "lucide-react";

const problems = [
  {
    icon: Brain,
    problem: "Context window fills up mid-project",
    solution: "Session management with /session:start and /session:update",
    benefit: "Continue where you left off"
  },
  {
    icon: FileText,
    problem: "Starting from scratch every time",
    solution: "BYOE: /transpose your examples or BYOS: /breakdown your specs",
    benefit: "Turn ideas into code faster"
  },
  {
    icon: Code2,
    problem: "Complex setup before coding",
    solution: "Build locally without external services",
    benefit: "Start coding immediately"
  },
  {
    icon: Timer,
    problem: "AI gets confused by project structure",
    solution: "Suggested workflows and documented patterns",
    benefit: "Consistent, predictable results"
  }
];

export function ProblemSolution() {
  return (
    <section className="container mx-auto px-4 py-24">
      <div className="text-center mb-12 space-y-4">
        <h2 className="text-3xl font-bold">
          Common AI Coding Challenges
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          We&apos;ve experienced these frustrations firsthand. Here&apos;s how we approach them.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
        {problems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 space-y-3">
                    {/* Problem */}
                    <div>
                      <h3 className="font-semibold text-foreground flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-destructive" />
                        {item.problem}
                      </h3>
                    </div>
                    
                    {/* Solution */}
                    <div>
                      <h4 className="font-medium text-primary flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Solution
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.solution}
                      </p>
                    </div>
                    
                    {/* Benefit */}
                    <p className="text-sm font-medium text-foreground">
                      → {item.benefit}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-12 text-center max-w-3xl mx-auto">
        <p className="text-lg font-medium text-foreground">
          Small improvements that make a big difference
        </p>
        <p className="text-muted-foreground mt-2">
          This template is our attempt to reduce friction in AI-assisted development. 
          It&apos;s not perfect, but it&apos;s a solid starting point.
        </p>
      </div>
    </section>
  );
}