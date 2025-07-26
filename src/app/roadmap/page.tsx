"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, ChevronDown, ChevronUp, ArrowLeft, ExternalLink } from "lucide-react";
import { RoadmapItemComponent, type RoadmapItem } from "./components/roadmap-item";
import { PrioritySection } from "./components/priority-section";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { Logo } from "@/components/ui/logo";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

// Roadmap data
const roadmapItems: RoadmapItem[] = [
  // In Progress
  {
    id: "enhanced-docs",
    title: "Enhanced documentation",
    description: "Improved docs and AI workflow guides",
    priority: "in-progress",
    status: "active",
    votes: 42
  },
  {
    id: "spec-templates",
    title: "Enhanced spec templates",
    description: "More templates for common patterns",
    priority: "in-progress",
    status: "active",
    votes: 38
  },
  {
    id: "sub-agent-workflows",
    title: "Sub-agent workflows",
    description: "Automated AI agents for development tasks",
    priority: "in-progress",
    status: "active",
    votes: 68
  },
  
  // Up Next
  {
    id: "more-sub-agents",
    title: "More Sub-agents",
    description: "Expand automated AI agent capabilities",
    priority: "up-next",
    status: "planned",
    votes: 95
  },
  {
    id: "deeper-command-integrations",
    title: "Deeper integrations with /commands",
    description: "Enhanced Claude Code command workflows",
    priority: "up-next",
    status: "planned",
    votes: 82
  },
  {
    id: "claude-code-hooks",
    title: "Claude Code Hooks",
    description: "Event-driven automation hooks for development",
    priority: "up-next",
    status: "planned",
    votes: 74
  },
  
  // Future Ideas
  {
    id: "video-tutorials",
    title: "Video tutorials",
    description: "Step-by-step walkthroughs",
    priority: "future",
    status: "planned",
    votes: 45
  },
  {
    id: "discord-community",
    title: "Discord community",
    description: "Connect with other developers",
    priority: "future",
    status: "planned",
    votes: 48
  },
  {
    id: "default-mcp-config",
    title: "Default MCP configuration",
    description: "Pre-configured Model Context Protocol setup",
    priority: "future",
    status: "planned",
    votes: 52
  }
];

// Recently completed items
const recentlyShipped: RoadmapItem[] = [
  {
    id: "claude-code-subagents",
    title: "Claude Code sub-agents",
    description: "Automated AI agents for quality control and workflow automation",
    priority: "in-progress",
    status: "completed",
    votes: 0,
    completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
  },
  {
    id: "firebase-integration",
    title: "Firebase integration",
    description: "Optional authentication and database",
    priority: "in-progress",
    status: "completed",
    votes: 0,
    completedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) // 14 days ago
  },
  {
    id: "session-management",
    title: "Session management",
    description: "Track development sessions with memory",
    priority: "in-progress",
    status: "completed",
    votes: 0,
    completedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000) // 21 days ago
  },
  {
    id: "claude-integration",
    title: "Claude Code integration",
    description: "Custom commands and CLAUDE.md file",
    priority: "in-progress",
    status: "completed",
    votes: 0,
    completedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000) // 28 days ago
  },
  {
    id: "spec-workflow",
    title: "Spec-driven workflow",
    description: "Transform designs and PRDs into specifications",
    priority: "in-progress",
    status: "completed",
    votes: 0,
    completedAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000) // 35 days ago
  }
];

const VOTES_KEY = 'vibespec-roadmap-votes';

export default function RoadmapPage() {
  const [items, setItems] = useState(roadmapItems);
  const [userVotes, setUserVotes] = useState<Record<string, boolean>>({});
  const [showAllFuture, setShowAllFuture] = useState(false);
  const { toast } = useToast();
  
  // Load votes from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(VOTES_KEY);
    if (stored) {
      try {
        setUserVotes(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load votes:', e);
      }
    }
  }, []);
  
  const handleVote = (itemId: string) => {
    const newVotes = { ...userVotes };
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    
    // Toggle vote
    newVotes[itemId] = !newVotes[itemId];
    
    // Update vote count
    const updatedItems = items.map(i => {
      if (i.id === itemId) {
        return {
          ...i,
          votes: newVotes[itemId] ? i.votes + 1 : i.votes - 1
        };
      }
      return i;
    });
    
    // Save to state and localStorage
    setUserVotes(newVotes);
    setItems(updatedItems);
    localStorage.setItem(VOTES_KEY, JSON.stringify(newVotes));
  };
  
  const handleSubscribe = async (email: string) => {
    try {
      // In a real implementation, this would save to Firestore
      // For now, we'll just simulate success
      console.log('Subscribing email:', email);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success!",
        description: "You'll receive updates when new features ship",
      });
      
      // In production, you would:
      // 1. Validate email server-side
      // 2. Save to Firestore subscribers collection
      // 3. Send confirmation email
      // 4. Handle errors appropriately
    } catch {
      toast({
        title: "Subscription failed",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };
  
  // Group items by priority
  const inProgress = items.filter(item => item.priority === 'in-progress');
  const upNext = items.filter(item => item.priority === 'up-next');
  const future = items.filter(item => item.priority === 'future').sort((a, b) => b.votes - a.votes);
  
  // Limit future items shown by default
  const futureToShow = showAllFuture ? future : future.slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      {/* Header - matching landing page style */}
      <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2 focus-ring rounded-lg px-2 py-1 -mx-2 -my-1">
              <Logo size={24} />
              <h1 className="text-xl font-bold">VibeSpec</h1>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Button asChild variant="ghost" size="sm" className="focus-ring">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
            </Button>
            <ModeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section - matching landing page style */}
      <section className="container mx-auto px-4 section-padding-lg">
        <div className="text-center space-y-4">
          {/* Badge */}
          <div className="flex justify-center animate-fade-in">
            <Badge variant="secondary" className="px-4 py-1.5 transition-all duration-300 hover:shadow-md hover:shadow-primary/10 cursor-default">
              <Globe className="w-3 h-3 mr-2" />
              Public Roadmap
            </Badge>
          </div>
          
          {/* Main Headline */}
          <h1 className="heading-1 animate-fade-in animation-delay-100">
            Where We&apos;re Going
          </h1>
          
          {/* Subheadline */}
          <p className="mx-auto max-w-2xl body-lg text-muted-foreground animate-fade-in animation-delay-200">
            VibeSpec is evolving based on community feedback. Vote on features 
            you care about and stay updated on our progress.
          </p>
        </div>
      </section>

      {/* Roadmap Content - with consistent spacing */}
      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto space-y-20">
          {/* In Progress */}
          {inProgress.length > 0 && (
            <div className="animate-fade-in animation-delay-400">
              <PrioritySection title="In Progress">
                <div className="space-y-4">
                  {inProgress.map((item, index) => (
                    <div 
                      key={item.id} 
                      className="animate-fade-in"
                      style={{ animationDelay: `${400 + index * 50}ms` }}
                    >
                      <RoadmapItemComponent
                        item={item}
                        onVote={handleVote}
                        hasVoted={userVotes[item.id]}
                        showVoting={true}
                      />
                    </div>
                  ))}
                </div>
              </PrioritySection>
            </div>
          )}

          {/* Up Next */}
          {upNext.length > 0 && (
            <div className="animate-fade-in animation-delay-500">
              <PrioritySection title="Up Next">
                <div className="space-y-4">
                  {upNext.map((item, index) => (
                    <div 
                      key={item.id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${500 + index * 50}ms` }}
                    >
                      <RoadmapItemComponent
                        item={item}
                        onVote={handleVote}
                        hasVoted={userVotes[item.id]}
                        showVoting={true}
                      />
                    </div>
                  ))}
                </div>
              </PrioritySection>
            </div>
          )}

          {/* Future Ideas */}
          {future.length > 0 && (
            <div className="animate-fade-in animation-delay-600">
              <div className="flex items-center justify-between mb-8">
                <h2 className="heading-2">Future Ideas</h2>
                <Button asChild variant="outline" size="sm" className="group focus-ring">
                  <a
                    href="https://github.com/pittmanluke/vibespec/issues/new"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Suggest a Feature
                  </a>
                </Button>
              </div>
              <div className="space-y-3">
                {futureToShow.map((item, index) => (
                  <div 
                    key={item.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${600 + index * 30}ms` }}
                  >
                    <RoadmapItemComponent
                      item={item}
                      onVote={handleVote}
                      hasVoted={userVotes[item.id]}
                      showVoting={true}
                      variant="compact"
                    />
                  </div>
                ))}
              </div>
              {future.length > 5 && (
                <Button
                  variant="outline"
                  onClick={() => setShowAllFuture(!showAllFuture)}
                  className="w-full mt-6 group focus-ring transition-all hover:shadow-md"
                >
                  {showAllFuture ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-2 transition-transform group-hover:-translate-y-0.5" />
                      Show less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-2 transition-transform group-hover:translate-y-0.5" />
                      Show {future.length - 5} more ideas
                    </>
                  )}
                </Button>
              )}
            </div>
          )}

          {/* Recently Shipped */}
          {recentlyShipped.length > 0 && (
            <div className="animate-fade-in animation-delay-700">
              <PrioritySection title="Recently Shipped">
                <div className="space-y-3">
                  {recentlyShipped.map((item, index) => (
                    <div 
                      key={item.id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${700 + index * 30}ms` }}
                    >
                      <RoadmapItemComponent
                        item={item}
                        showVoting={false}
                        variant="completed"
                      />
                    </div>
                  ))}
                </div>
              </PrioritySection>
            </div>
          )}
        </div>

        {/* Stay Connected Section */}
        <div className="max-w-2xl mx-auto mt-32 mb-32 animate-fade-in animation-delay-800 text-center">
          <div className="space-y-8">
            <div>
              <h2 className="heading-3 mb-4">Stay Connected</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Get notified when new features ship or contribute your ideas to shape the roadmap
              </p>
            </div>

            {/* Email Subscribe */}
            <div>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const email = formData.get('email') as string;
                if (email) handleSubscribe(email);
              }} className="flex max-w-sm mx-auto gap-3 mb-3">
                <Input
                  type="email"
                  name="email"
                  placeholder="email@example.com"
                  required
                  className="flex-1 focus-ring transition-all h-10"
                />
                <Button 
                  type="submit" 
                  className="group focus-ring transition-all hover:shadow-md h-10 px-8"
                >
                  Subscribe
                  <span className="ml-1.5 inline-block transition-transform group-hover:translate-x-0.5">→</span>
                </Button>
              </form>
              <p className="text-xs text-muted-foreground">
                No spam, just product updates. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-16 bg-background border-t border-border/40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-8">
            <div className="text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start mb-3">
                <Logo size={20} />
                <span className="font-semibold">VibeSpec</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Spec-driven development for AI coding
              </p>
            </div>
            <nav className="flex flex-wrap justify-center sm:justify-end gap-6 text-sm">
              <Link href="/docs" className="text-muted-foreground hover:text-foreground transition-colors focus-ring rounded px-1 py-0.5">
                Documentation
              </Link>
              <Link href="https://github.com/pittmanluke/vibespec" className="text-muted-foreground hover:text-foreground transition-colors focus-ring rounded px-1 py-0.5">
                GitHub
              </Link>
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors focus-ring rounded px-1 py-0.5">
                Home
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}