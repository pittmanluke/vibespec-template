'use client';

import React, { useState } from 'react';
import { useFeedback } from '@/providers/feedback-provider';
import { 
  MessageSquare, 
  MousePointer, 
  List, 
  X, 
  Minimize2, 
  Maximize2,
  Download,
  Trash2,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function FeedbackOverlay() {
  const {
    enabled,
    mode,
    feedbackItems,
    isMinimized,
    setMode,
    toggleEnabled,
    toggleMinimized,
    exportFeedback,
    clearFeedback,
    config,
  } = useFeedback();

  const [showTooltip, setShowTooltip] = useState(false);
  const [exporting, setExporting] = useState(false);

  if (!enabled) return null;

  const handleExport = async () => {
    if (feedbackItems.length === 0) {
      alert('No feedback to export');
      return;
    }

    setExporting(true);
    try {
      await exportFeedback(config.exportFormat);
      // Show success toast
      const message = `Feedback exported to clipboard (${config.exportFormat} format)`;
      showNotification(message);
    } catch (error) {
      console.error('Export failed:', error);
      showNotification('Export failed. Check console for details.', 'error');
    } finally {
      setExporting(false);
    }
  };

  const handleClear = () => {
    if (feedbackItems.length === 0) return;
    
    const confirmed = window.confirm(
      `Are you sure you want to clear all ${feedbackItems.length} feedback items?`
    );
    if (confirmed) {
      clearFeedback();
      showNotification('All feedback cleared');
    }
  };

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    // We'll implement a proper toast system later
    // For now, using a simple approach
    const toast = document.createElement('div');
    toast.className = cn(
      'fixed bottom-4 left-1/2 transform -translate-x-1/2',
      'px-4 py-2 rounded-lg shadow-lg text-white z-[10001]',
      'animate-in slide-in-from-bottom-2 fade-in duration-300',
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    );
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('animate-out', 'slide-out-to-bottom-2', 'fade-out');
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  };

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'bottom-right': 'bottom-4 right-4',
    'floating': 'bottom-4 left-1/2 transform -translate-x-1/2',
  };

  const modeButtons = [
    {
      mode: 'navigate' as const,
      icon: MousePointer,
      label: 'Navigate',
      tooltip: 'Normal browsing mode',
    },
    {
      mode: 'annotate' as const,
      icon: MessageSquare,
      label: 'Annotate',
      tooltip: 'Click elements to add feedback',
    },
    {
      mode: 'review' as const,
      icon: List,
      label: 'Review',
      tooltip: 'Review collected feedback',
    },
  ];

  if (isMinimized) {
    return (
      <div
        className={cn(
          'fixed z-[10000]',
          positionClasses[config.position],
          'bg-white dark:bg-gray-900 rounded-full shadow-2xl',
          'border border-gray-200 dark:border-gray-700',
          'p-2 cursor-pointer hover:scale-110 transition-transform'
        )}
        style={{ opacity: config.opacity }}
        onClick={toggleMinimized}
      >
        <Maximize2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      </div>
    );
  }

  return (
    <>
      <div
        className={cn(
          'fixed z-[10000]',
          positionClasses[config.position],
          'bg-white dark:bg-gray-900 rounded-lg shadow-2xl',
          'border border-gray-200 dark:border-gray-700',
          'p-3 space-y-3 min-w-[280px]'
        )}
        style={{ opacity: config.opacity }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Feedback Mode
            </span>
            {feedbackItems.length > 0 && (
              <span className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full">
                {feedbackItems.length}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setShowTooltip(!showTooltip)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
              title="Help"
            >
              <HelpCircle className="w-4 h-4 text-gray-500" />
            </button>
            <button
              onClick={toggleMinimized}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
              title="Minimize"
            >
              <Minimize2 className="w-4 h-4 text-gray-500" />
            </button>
            <button
              onClick={toggleEnabled}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
              title="Close"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {modeButtons.map(({ mode: buttonMode, icon: Icon, label, tooltip }) => (
            <button
              key={buttonMode}
              onClick={() => setMode(buttonMode)}
              className={cn(
                'flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md transition-all',
                mode === buttonMode
                  ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              )}
              title={tooltip}
            >
              <Icon className="w-4 h-4" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <button
            onClick={handleExport}
            disabled={feedbackItems.length === 0 || exporting}
            className={cn(
              'flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md transition-all',
              'bg-blue-500 hover:bg-blue-600 text-white',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            title={`Export feedback (${config.shortcuts.export})`}
          >
            <Download className="w-4 h-4" />
            <span className="text-xs font-medium">
              {exporting ? 'Exporting...' : 'Export'}
            </span>
          </button>
          <button
            onClick={handleClear}
            disabled={feedbackItems.length === 0}
            className={cn(
              'px-3 py-2 rounded-md transition-all',
              'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700',
              'text-gray-600 dark:text-gray-400',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            title="Clear all feedback"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Status */}
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <div>Mode: {mode}</div>
          <div>Page: {window.location.pathname}</div>
          {showTooltip && (
            <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded text-xs space-y-1">
              <div><kbd>⌘⇧V</kbd> Toggle overlay</div>
              <div><kbd>A</kbd> Annotate mode</div>
              <div><kbd>R</kbd> Review mode</div>
              <div><kbd>M</kbd> Minimize</div>
              <div><kbd>⌘⇧E</kbd> Export</div>
            </div>
          )}
        </div>
      </div>

      {/* Mode Indicator */}
      {mode === 'annotate' && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999]">
          <div className="bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2">
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm font-medium">Click any element to add feedback</span>
          </div>
        </div>
      )}
    </>
  );
}