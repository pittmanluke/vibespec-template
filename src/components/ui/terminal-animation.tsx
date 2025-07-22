'use client';

import { useState, useEffect, useRef } from "react";

interface TerminalStep {
  text: string;
  highlight?: string;
}

interface TerminalAnimationProps {
  steps: TerminalStep[];
  intervalMs?: number;
  typingSpeed?: number;
  className?: string;
  showWindowControls?: boolean;
  title?: string;
}

export function TerminalAnimation({ 
  steps, 
  intervalMs = 2500,
  typingSpeed = 50,
  className = "",
  showWindowControls = true,
  title = "terminal"
}: TerminalAnimationProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [phase, setPhase] = useState<'typing' | 'showing' | 'waiting'>('typing');
  
  const currentStep = steps[currentStepIndex];
  const displayedText = currentStep.text.slice(0, currentCharIndex);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (phase === 'typing') {
      if (currentCharIndex < currentStep.text.length) {
        timer = setTimeout(() => {
          setCurrentCharIndex(prev => prev + 1);
        }, typingSpeed);
      } else {
        // Finished typing, show highlight
        setPhase('showing');
      }
    } else if (phase === 'showing') {
      // Wait with highlight visible
      timer = setTimeout(() => {
        setPhase('waiting');
      }, intervalMs);
    } else if (phase === 'waiting') {
      // Move to next step
      const nextIndex = (currentStepIndex + 1) % steps.length;
      setCurrentStepIndex(nextIndex);
      setCurrentCharIndex(0);
      setPhase('typing');
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [currentCharIndex, currentStepIndex, phase, currentStep.text.length, steps.length, typingSpeed, intervalMs]);

  return (
    <div className={`bg-zinc-900 dark:bg-zinc-950 border border-zinc-800 rounded-xl p-6 text-left shadow-lg ${className}`}>
      {showWindowControls && (
        <div className="flex items-center gap-2 mb-4">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-xs text-zinc-400 ml-2">{title}</span>
        </div>
      )}
      <div className="font-mono text-sm text-zinc-100">
        <div className="min-h-[1.5rem]">
          <span className="text-emerald-400">$</span>
          <span className="ml-2">{displayedText}</span>
          {phase === 'typing' && (
            <span className="inline-block w-2 h-4 bg-emerald-400 ml-0.5 animate-[blink_1s_ease-in-out_infinite]" />
          )}
          {phase === 'showing' && currentStep.highlight && (
            <span className="text-zinc-500 ml-4 text-xs">
              {currentStep.highlight}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}