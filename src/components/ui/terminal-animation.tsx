'use client';

import { useState, useEffect } from "react";

interface TerminalStep {
  text: string;
  highlight?: string;
}

interface TerminalAnimationProps {
  steps: TerminalStep[];
  intervalMs?: number;
  className?: string;
  showWindowControls?: boolean;
  title?: string;
}

export function TerminalAnimation({ 
  steps, 
  intervalMs = 2500,
  className = "",
  showWindowControls = true,
  title = "terminal"
}: TerminalAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, intervalMs);
    return () => clearInterval(interval);
  }, [steps.length, isClient, intervalMs]);

  return (
    <div className={`bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-left shadow-lg ${className}`}>
      {showWindowControls && (
        <div className="flex items-center gap-2 mb-4">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-xs text-muted-foreground ml-2">{title}</span>
        </div>
      )}
      <div className="font-mono text-sm space-y-2 text-zinc-100">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              isClient && index === currentStep 
                ? 'opacity-100 text-foreground translate-x-0' 
                : isClient && index < currentStep 
                  ? 'opacity-50 text-muted-foreground -translate-x-1' 
                  : 'opacity-20 text-muted-foreground translate-x-1'
            }`}
          >
            <span className="text-primary">$</span> {step.text}
            {isClient && index === currentStep && (
              <>
                {step.highlight && (
                  <span className="text-muted-foreground ml-4 text-xs italic transition-opacity duration-300">
                    {step.highlight}
                  </span>
                )}
                <span className="inline-block w-2 h-4 bg-primary ml-1 animate-pulse" style={{ animation: 'blink 1s infinite' }} />
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}