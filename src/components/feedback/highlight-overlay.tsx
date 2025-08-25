'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useFeedback } from '@/providers/feedback-provider';
import { ElementInspector } from '@/lib/feedback/element-inspector';
import { cn } from '@/lib/utils';

interface HighlightState {
  element: Element | null;
  rect: DOMRect | null;
  componentName: string | null;
}

interface HighlightOverlayProps {
  onElementClick: (element: Element) => void;
  isDisabled?: boolean;
}

export function HighlightOverlay({ onElementClick, isDisabled = false }: HighlightOverlayProps) {
  const { mode, config } = useFeedback();
  const [highlight, setHighlight] = useState<HighlightState>({
    element: null,
    rect: null,
    componentName: null,
  });
  const inspector = useRef(new ElementInspector());
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable highlighting if modal is open, disabled, or not in annotate mode
    if (mode !== 'annotate' || !config.autoHighlight || isDisabled) {
      setHighlight({ element: null, rect: null, componentName: null });
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      // Ignore if hovering over our own overlay
      if (overlayRef.current?.contains(e.target as Node)) {
        return;
      }

      const element = document.elementFromPoint(e.clientX, e.clientY);
      
      if (element && element !== highlight.element) {
        const rect = element.getBoundingClientRect();
        const componentName = inspector.current.getComponentName(element);
        
        setHighlight({
          element,
          rect,
          componentName,
        });
      }
    };

    const handleClick = (e: MouseEvent) => {
      // Ignore clicks on our overlay
      if (overlayRef.current?.contains(e.target as Node)) {
        return;
      }

      if (highlight.element) {
        e.preventDefault();
        e.stopPropagation();
        onElementClick(highlight.element);
      }
    };

    const handleScroll = () => {
      if (highlight.element) {
        const rect = highlight.element.getBoundingClientRect();
        setHighlight(prev => ({ ...prev, rect }));
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    // Changed from capture (true) to bubble phase for better modal interaction
    document.addEventListener('click', handleClick, false);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick, false);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [mode, highlight.element, config.autoHighlight, onElementClick, isDisabled]);

  // Don't render overlay if not in annotate mode, disabled, or no element highlighted
  if (mode !== 'annotate' || !highlight.rect || isDisabled) {
    return null;
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 pointer-events-none z-[9998]"
      style={{ isolation: 'isolate' }}
    >
      {/* Highlight border */}
      <div
        className={cn(
          'absolute border-2 border-blue-500 bg-blue-500/10',
          'transition-all duration-75 ease-out'
        )}
        style={{
          left: `${highlight.rect.left}px`,
          top: `${highlight.rect.top}px`,
          width: `${highlight.rect.width}px`,
          height: `${highlight.rect.height}px`,
        }}
      >
        {/* Component label */}
        {highlight.componentName && (
          <div
            className={cn(
              'absolute -top-7 left-0',
              'px-2 py-1 text-xs font-medium',
              'bg-blue-500 text-white rounded-t-md',
              'whitespace-nowrap'
            )}
          >
            {highlight.componentName}
          </div>
        )}
        
        {/* Dimensions label */}
        <div
          className={cn(
            'absolute -bottom-6 right-0',
            'px-2 py-0.5 text-xs',
            'bg-gray-900 text-gray-100 rounded-b-md',
            'font-mono'
          )}
        >
          {Math.round(highlight.rect.width)} × {Math.round(highlight.rect.height)}
        </div>
      </div>

      {/* Click indicator */}
      <div
        className={cn(
          'absolute',
          'w-6 h-6 -ml-3 -mt-3',
          'bg-blue-500 rounded-full',
          'flex items-center justify-center',
          'animate-pulse'
        )}
        style={{
          left: `${highlight.rect.left + highlight.rect.width / 2}px`,
          top: `${highlight.rect.top + highlight.rect.height / 2}px`,
        }}
      >
        <div className="w-2 h-2 bg-white rounded-full" />
      </div>
    </div>
  );
}