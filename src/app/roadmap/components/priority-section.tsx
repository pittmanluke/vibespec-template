import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PrioritySectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function PrioritySection({ title, children, className }: PrioritySectionProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <h2 className="heading-2">{title}</h2>
      <div>
        {children}
      </div>
    </div>
  );
}