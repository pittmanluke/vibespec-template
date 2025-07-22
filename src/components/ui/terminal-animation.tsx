'use client';

import { useState, useEffect } from "react";

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
  
  // Find the longest text to reserve space
  const longestText = steps.reduce((longest, step) => 
    step.text.length > longest.length ? step.text : longest, ""
  );

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
    <div className={`bg-zinc-900 dark:bg-zinc-950 border border-zinc-800 rounded-xl p-4 sm:p-6 text-left shadow-lg transform-gpu ${className}`} 
         style={{ contain: 'layout', willChange: 'contents' }}>
      {showWindowControls && (
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-xs text-zinc-400 ml-2">{title}</span>
        </div>
      )}
      <div className="font-mono text-xs sm:text-sm text-zinc-100">
        {/* Fixed height container to prevent layout shifts */}
        <div className="h-[3rem] sm:h-[2.5rem] flex items-center">
          {/* Command line with fixed grid layout */}
          <div className="grid grid-cols-[auto,1fr,auto] gap-2 items-center w-full">
            <span className="text-emerald-400 self-start">$</span>
            <div className="relative h-[1.5em] flex items-center">
              {/* Invisible text to reserve space */}
              <span className="invisible whitespace-pre-wrap">{longestText}</span>
              {/* Actual typing text */}
              <span className="absolute left-0 whitespace-pre-wrap">
                {displayedText}
                {phase === 'typing' && (
                  <span className="inline-block w-2 h-[1.2em] bg-emerald-400 ml-0.5 align-middle animate-[blink_1s_ease-in-out_infinite]" 
                        style={{ transform: 'translateZ(0)' }} />
                )}
              </span>
            </div>
            <div className="self-start">
              {/* Reserved space for highlight */}
              <span className={`text-zinc-500 text-[10px] sm:text-xs whitespace-nowrap transition-opacity duration-300 block ${
                phase === 'showing' && currentStep.highlight ? 'opacity-100' : 'opacity-0'
              }`}>
                {currentStep.highlight || '\u00A0'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}