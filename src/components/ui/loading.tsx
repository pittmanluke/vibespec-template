import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LoadingProps {
  /**
   * The type of loader to display
   * - 'spinner': A circular spinner (default)
   * - 'dots': Three dots pulsing
   * - 'bar': A loading bar animation
   */
  type?: 'spinner' | 'dots' | 'bar';
  
  /**
   * The size of the loader
   * - 'sm': Small
   * - 'md': Medium (default)
   * - 'lg': Large
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Optional text to display below the loader
   */
  text?: string;
  
  /**
   * Whether to center the loader in its container
   */
  centered?: boolean;
  
  /**
   * Additional classes to apply to the component
   */
  className?: string;
}

/**
 * Loading component for consistent loading UIs across the application
 */
export function Loading({
  type = 'spinner',
  size = 'md',
  text,
  centered = false,
  className,
}: LoadingProps) {
  const sizeClasses = {
    sm: { wrapper: 'size-4', text: 'text-xs' },
    md: { wrapper: 'size-8', text: 'text-sm' },
    lg: { wrapper: 'size-12', text: 'text-base' },
  };
  
  const containerClasses = cn(
    'flex flex-col items-center justify-center',
    centered && 'h-[50vh] w-full',
    className
  );
  
  const renderLoader = () => {
    switch (type) {
      case 'spinner':
        return (
          <Loader2 className={cn(sizeClasses[size].wrapper, "animate-spin")} />
        );
      case 'dots':
        return (
          <div className="flex space-x-1">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  "rounded-full bg-current",
                  size === 'sm' ? 'size-1' : size === 'md' ? 'size-2' : 'size-3',
                  "animate-pulse"
                )}
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        );
      case 'bar':
        return (
          <div className={cn(
            "relative overflow-hidden",
            size === 'sm' ? 'h-1 w-20' : size === 'md' ? 'h-1.5 w-32' : 'h-2 w-48',
            "bg-muted rounded-full"
          )}>
            <div
              className="absolute inset-y-0 left-0 bg-primary rounded-full animate-[slide_1.5s_ease-in-out_infinite]"
              style={{ width: '40%' }}
            />
          </div>
        );
    }
  };
  
  return (
    <div className={containerClasses}>
      {renderLoader()}
      {text && <p className={cn("mt-2", sizeClasses[size].text)}>{text}</p>}
    </div>
  );
} 