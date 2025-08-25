'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useFeedback } from '@/providers/feedback-provider';
import { ElementInspector } from '@/lib/feedback/element-inspector';
import { FeedbackType, FeedbackPriority, ElementData } from '@/types/feedback';
import { X, Save, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeedbackAnnotatorProps {
  element: Element;
  onClose: () => void;
  onSave: (feedback: {
    element: ElementData;
    feedback: {
      type: FeedbackType;
      description: string;
      priority: FeedbackPriority;
      suggestedChange?: string;
    };
  }) => void;
}

export function FeedbackAnnotator({ element, onClose, onSave }: FeedbackAnnotatorProps) {
  const { currentPage } = useFeedback();
  const inspector = useRef(new ElementInspector());
  const modalRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  
  const [type, setType] = useState<FeedbackType>('style');
  const [priority, setPriority] = useState<FeedbackPriority>('medium');
  const [description, setDescription] = useState('');
  const [suggestedChange, setSuggestedChange] = useState('');
  const [elementData, setElementData] = useState<ElementData | null>(null);

  useEffect(() => {
    // Gather element data
    const rect = inspector.current.getBoundingBox(element);
    const data: ElementData = {
      selector: inspector.current.generateSelector(element),
      xpath: inspector.current.generateXPath(element),
      componentName: inspector.current.getComponentName(element) || undefined,
      componentPath: inspector.current.getComponentPath(element) || undefined,
      computedStyles: inspector.current.getComputedStyles(element),
      boundingBox: rect,
      innerHTML: inspector.current.getSanitizedInnerHTML(element),
      tailwindClasses: inspector.current.getTailwindClasses(element),
    };
    setElementData(data);
  }, [element]);

  // Focus management
  useEffect(() => {
    // Save current focus
    previousFocus.current = document.activeElement as HTMLElement;
    
    // Focus the description field after a short delay
    const focusTimer = setTimeout(() => {
      descriptionRef.current?.focus();
      descriptionRef.current?.select();
    }, 100);

    // Cleanup
    return () => {
      clearTimeout(focusTimer);
      // Restore focus on unmount
      if (previousFocus.current && previousFocus.current.focus) {
        previousFocus.current.focus();
      }
    };
  }, []);

  // Focus trap
  useEffect(() => {
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !modalRef.current) return;
      
      const focusableElements = modalRef.current.querySelectorAll(
        'button, textarea, input, select, a[href], [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length === 0) return;
      
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
      
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };
    
    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, []);

  const handleSave = useCallback(() => {
    if (!description.trim() || !elementData) {
      alert('Please provide a description');
      return;
    }

    onSave({
      element: elementData,
      feedback: {
        type,
        description: description.trim(),
        priority,
        suggestedChange: suggestedChange.trim() || undefined,
      },
    });
  }, [description, elementData, type, priority, suggestedChange, onSave]);

  const handleClose = useCallback(() => {
    // Small delay to prevent immediate re-selection
    setTimeout(() => {
      onClose();
    }, 50);
  }, [onClose]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSave();
    }
  };

  if (!elementData) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10002]"
      onClick={handleClose}
    >
      <div
        ref={modalRef}
        className={cn(
          'bg-white dark:bg-gray-900 rounded-lg shadow-2xl',
          'w-full max-w-2xl max-h-[90vh] overflow-hidden',
          'flex flex-col'
        )}
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Add Feedback
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {elementData.componentName && (
                  <span className="font-medium">{elementData.componentName} • </span>
                )}
                <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
                  {elementData.selector}
                </code>
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Element Preview */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Element Preview
            </label>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-start space-x-4">
                <div className="flex-1">
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <div>Page: <span className="font-mono text-xs">{currentPage}</span></div>
                    {elementData.componentPath && (
                      <div>File: <span className="font-mono text-xs">{elementData.componentPath}</span></div>
                    )}
                    {elementData.tailwindClasses && elementData.tailwindClasses.length > 0 && (
                      <div>
                        Classes: 
                        <span className="font-mono text-xs ml-1">
                          {elementData.tailwindClasses.slice(0, 5).join(' ')}
                          {elementData.tailwindClasses.length > 5 && ' ...'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Feedback Type
            </label>
            <div className="grid grid-cols-5 gap-2">
              {(['style', 'content', 'behavior', 'layout', 'feature'] as FeedbackType[]).map(t => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors',
                    type === t
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Priority
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['low', 'medium', 'high'] as FeedbackPriority[]).map(p => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors',
                    priority === p
                      ? p === 'high'
                        ? 'bg-red-500 text-white'
                        : p === 'medium'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-green-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              ref={descriptionRef}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe what needs to be changed..."
              className={cn(
                'w-full px-3 py-2 rounded-lg',
                'border border-gray-300 dark:border-gray-600',
                'bg-white dark:bg-gray-800',
                'text-gray-900 dark:text-gray-100',
                'placeholder-gray-400 dark:placeholder-gray-500',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                'resize-none'
              )}
              rows={3}
            />
          </div>

          {/* Suggested Change */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Suggested Implementation (optional)
            </label>
            <textarea
              value={suggestedChange}
              onChange={e => setSuggestedChange(e.target.value)}
              placeholder="e.g., Change bg-white to bg-blue-500, increase padding to p-4..."
              className={cn(
                'w-full px-3 py-2 rounded-lg',
                'border border-gray-300 dark:border-gray-600',
                'bg-white dark:bg-gray-800',
                'text-gray-900 dark:text-gray-100',
                'placeholder-gray-400 dark:placeholder-gray-500',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                'resize-none font-mono text-sm'
              )}
              rows={2}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
              <AlertCircle className="w-3 h-3" />
              <span>Press <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">⌘+Enter</kbd> to save</span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleClose}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium',
                  'text-gray-700 dark:text-gray-300',
                  'hover:bg-gray-100 dark:hover:bg-gray-800',
                  'transition-colors'
                )}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!description.trim()}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium',
                  'bg-blue-500 hover:bg-blue-600 text-white',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'transition-colors flex items-center space-x-2'
                )}
              >
                <Save className="w-4 h-4" />
                <span>Save Feedback</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}