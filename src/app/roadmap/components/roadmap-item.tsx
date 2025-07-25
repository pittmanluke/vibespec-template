"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, CheckCircle2, Circle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  priority: 'in-progress' | 'up-next' | 'future';
  status: 'completed' | 'active' | 'planned';
  category: 'ai' | 'dx' | 'core' | 'community' | 'enterprise';
  votes: number;
  completedAt?: Date;
}

interface RoadmapItemProps {
  item: RoadmapItem;
  onVote?: (id: string) => void;
  hasVoted?: boolean;
  showVoting?: boolean;
  variant?: 'default' | 'compact' | 'completed';
}

const categoryLabels = {
  ai: 'AI',
  dx: 'DX',
  core: 'Core',
  community: 'Community',
  enterprise: 'Enterprise'
};

const categoryColors = {
  ai: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
  dx: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
  core: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
  community: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
  enterprise: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
};

export function RoadmapItemComponent({ 
  item, 
  onVote, 
  hasVoted = false, 
  showVoting = true,
  variant = 'default' 
}: RoadmapItemProps) {
  const isCompact = variant === 'compact';
  const isCompleted = variant === 'completed';

  if (isCompact) {
    return (
      <div className="group flex items-center justify-between py-3.5 px-5 rounded-lg border border-transparent hover:border-border/40 hover:bg-muted/10 transition-all duration-200">
        <div className="flex items-center gap-3 flex-1">
          <Circle className="w-4 h-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
          <span className="font-medium text-foreground/80 group-hover:text-foreground transition-colors">{item.title}</span>
          <Badge variant="secondary" className={cn("text-xs transition-all", categoryColors[item.category])}>
            {categoryLabels[item.category]}
          </Badge>
        </div>
        {showVoting && (
          <div className="flex items-center gap-3">
            <Button
              variant={hasVoted ? "ghost" : "outline"}
              size="sm"
              onClick={() => onVote?.(item.id)}
              className={cn(
                "h-8 w-8 p-0 transition-all focus-ring",
                hasVoted ? "hover:bg-transparent" : "hover:border-primary/50"
              )}
            >
              <ThumbsUp className={cn(
                "w-4 h-4 transition-transform",
                hasVoted && "fill-current"
              )} />
            </Button>
            <span className="text-sm text-muted-foreground tabular-nums min-w-[2.5rem] text-right">{item.votes}</span>
          </div>
        )}
      </div>
    );
  }

  if (isCompleted) {
    const daysAgo = item.completedAt 
      ? Math.floor((Date.now() - new Date(item.completedAt).getTime()) / (1000 * 60 * 60 * 24))
      : 0;
    
    return (
      <div className="group flex items-center gap-3 py-3.5 px-5 rounded-lg border border-transparent hover:border-border/40 hover:bg-muted/10 transition-all duration-200">
        <CheckCircle2 className="w-4 h-4 text-green-500/70 transition-transform group-hover:scale-110" />
        <span className="font-medium text-foreground/80 group-hover:text-foreground transition-colors flex-1">{item.title}</span>
        <span className="text-sm text-muted-foreground/60">
          {daysAgo === 0 ? 'Today' : daysAgo === 1 ? '1 day ago' : `${daysAgo} days ago`}
        </span>
      </div>
    );
  }

  return (
    <Card className={cn(
      "group bg-transparent transition-all duration-200 border-border/40 hover:border-border/60",
      item.status === 'active' && "border-primary/40 hover:border-primary/60"
    )}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              {item.status === 'active' ? (
                <div className="relative">
                  <Clock className="w-4 h-4 text-primary/70" />
                  <div className="absolute inset-0 w-4 h-4 rounded-full bg-primary/20 animate-pulse" />
                </div>
              ) : (
                <Circle className="w-4 h-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
              )}
              <h3 className="font-semibold text-base text-foreground/80 group-hover:text-foreground transition-colors">{item.title}</h3>
              <Badge variant="secondary" className={cn("text-xs transition-all", categoryColors[item.category])}>
                {categoryLabels[item.category]}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground/80 leading-relaxed pl-7">{item.description}</p>
          </div>
          {showVoting && (
            <div className="flex items-center gap-3">
              <Button
                variant={hasVoted ? "ghost" : "outline"}
                size="sm"
                onClick={() => onVote?.(item.id)}
                className={cn(
                  "h-8 w-8 p-0 transition-all focus-ring",
                  hasVoted ? "hover:bg-transparent" : "hover:border-primary/50"
                )}
              >
                <ThumbsUp className={cn(
                  "w-4 h-4 transition-transform",
                  hasVoted && "fill-current"
                )} />
              </Button>
              <span className="text-sm text-muted-foreground tabular-nums min-w-[2.5rem] text-right">{item.votes}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}