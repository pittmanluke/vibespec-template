'use client';

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category: 'general' | 'technical' | 'workflow';
}

const faqItems: FAQItem[] = [
  // General Questions
  {
    category: 'general',
    question: "What is VibeSpec?",
    answer: "VibeSpec is a template for spec-driven AI-assisted coding. It provides a structured approach to building applications with AI coding assistants like Claude Code, following the principle of 'specifications first, code second' helping you build MVPs faster with structured workflows."
  },
  {
    category: 'general',
    question: "Who is VibeSpec for?",
    answer: "VibeSpec is perfect for developers and teams who want to leverage AI coding assistants effectively. It's especially valuable for startups building MVPs, agencies delivering client projects, and any developer who wants to maintain high code quality while moving fast with AI assistance."
  },
  {
    category: 'general',
    question: "Is VibeSpec free to use?",
    answer: "Yes! VibeSpec is completely open source under the MIT License. You can use it for personal projects, commercial applications, or as a starting point for your own templates. We encourage contributions and feedback from the community."
  },
  {
    category: 'general',
    question: "How is VibeSpec different from other templates?",
    answer: "VibeSpec is specifically optimized for AI-assisted development. It includes custom Claude commands, a clear project structure that AI can understand, comprehensive documentation in CLAUDE.md, and built-in patterns that prevent common AI coding mistakes."
  },
  // Technical Questions
  {
    category: 'technical',
    question: "What's included in the template?",
    answer: "VibeSpec includes Next.js 15 with App Router, React 19, TypeScript, Tailwind CSS v4, shadcn/ui components, optional Firebase integration with feature flags, mock services for development, and comprehensive AI assistant instructions."
  },
  {
    category: 'technical',
    question: "Can I use VibeSpec without Firebase?",
    answer: "Absolutely! VibeSpec uses feature flags to toggle Firebase services. When disabled, mock services provide the same API, allowing you to develop without any external dependencies. You can enable Firebase features gradually as needed."
  },
  {
    category: 'technical',
    question: "How does VibeSpec work with Claude Code?",
    answer: "VibeSpec includes a CLAUDE.md file with detailed instructions for AI assistants, custom commands for common workflows, and a project structure that's easy for AI to navigate. This ensures Claude Code understands your project context and follows your conventions."
  },
  {
    category: 'technical',
    question: "What are feature flags and how do they work?",
    answer: "Feature flags in VibeSpec allow you to toggle Firebase services (Auth, Firestore, Storage, Functions) via environment variables. This lets you start with mock services and gradually adopt real services, test different configurations, and ship faster without backend dependencies."
  },
  // Workflow Questions
  {
    category: 'workflow',
    question: "How do I get started with VibeSpec?",
    answer: "Clone the repository from GitHub, copy .env.local.example to .env.local, run npm install, then npm run dev. You can start building immediately with mock services, then enable Firebase features as needed by updating environment variables."
  },
  {
    category: 'workflow',
    question: "What are Claude commands?",
    answer: "Claude commands are custom shortcuts that automate common workflows. Examples include /context-prime to load project context, /transpose to convert designs to specs, /breakdown to split complex features into phases, and /session commands to track development progress."
  },
  {
    category: 'workflow',
    question: "How do specs improve AI coding?",
    answer: "Specifications provide clear requirements that AI can follow precisely. They reduce ambiguity, prevent scope creep, ensure consistent implementation, and create a shared understanding between you and the AI assistant. This leads to fewer revisions and higher quality code."
  },
  {
    category: 'workflow',
    question: "What are VibeSpec sub-agents?",
    answer: "Sub-agents are specialized AI assistants that monitor your development process. They include spec-alignment-guardian (ensures code matches specs), velocity-guardian (prevents feature creep), vibespec-compliance-validator (enforces conventions), and more. They activate automatically when needed."
  }
];

export function FAQSection() {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayedItems = isExpanded ? faqItems : faqItems.slice(0, 4);

  return (
    <section className="container mx-auto px-4 section-padding">
      <div className="content-width-lg">
        <h3 className="heading-3 mb-6 text-left">FAQ</h3>
        
        <Card className="bg-transparent border-border/50 transition-shadow hover:shadow-lg">
          <CardContent className="p-6 md:p-8">
            <Accordion type="single" collapsible className="w-full">
              {displayedItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-border/50">
                  <AccordionTrigger className="text-left hover:no-underline py-4 px-0">
                    <span className="font-semibold pr-4">{item.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            
            {faqItems.length > 4 && (
              <div className="mt-6 text-center">
                <Button
                  variant="ghost"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="group focus-ring"
                >
                  {isExpanded ? (
                    <>
                      Show less
                      <ChevronUp className="ml-2 h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
                    </>
                  ) : (
                    <>
                      Show more
                      <ChevronDown className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}