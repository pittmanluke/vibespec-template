'use client';

import React, { useState } from 'react';
import { useFeedback } from '@/providers/feedback-provider';
import { FeedbackItem, FeedbackType, FeedbackPriority } from '@/types/feedback';
import { 
  X, 
  Trash2, 
  ChevronDown, 
  ChevronUp,
  Filter,
  AlertCircle,
  MessageSquare,
  Layout,
  Palette,
  Code,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function FeedbackSidebar() {
  const { feedbackItems, deleteFeedback, setMode } = useFeedback();
  const [filterPage, setFilterPage] = useState<string>('all');
  const [filterType, setFilterType] = useState<FeedbackType | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<FeedbackPriority | 'all'>('all');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Get unique pages
  const pages = Array.from(new Set(feedbackItems.map(item => item.page)));

  // Filter items
  const filteredItems = feedbackItems.filter(item => {
    if (filterPage !== 'all' && item.page !== filterPage) return false;
    if (filterType !== 'all' && item.feedback.type !== filterType) return false;
    if (filterPriority !== 'all' && item.feedback.priority !== filterPriority) return false;
    return true;
  });

  // Group by page
  const groupedByPage = filteredItems.reduce((acc, item) => {
    if (!acc[item.page]) acc[item.page] = [];
    acc[item.page].push(item);
    return acc;
  }, {} as Record<string, FeedbackItem[]>);

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const getTypeIcon = (type: FeedbackType) => {
    switch (type) {
      case 'style': return Palette;
      case 'content': return MessageSquare;
      case 'layout': return Layout;
      case 'behavior': return Code;
      case 'feature': return Sparkles;
    }
  };

  const getPriorityColor = (priority: FeedbackPriority) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-50 dark:bg-red-900/20';
      case 'medium': return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low': return 'text-green-500 bg-green-50 dark:bg-green-900/20';
    }
  };

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-900 shadow-2xl z-[9999] flex flex-col">
      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Feedback Review ({filteredItems.length})
          </h2>
          <button
            onClick={() => setMode('navigate')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 space-y-2">
        <div className="flex items-center space-x-2 text-sm">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={filterPage}
            onChange={e => setFilterPage(e.target.value)}
            className="flex-1 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
          >
            <option value="all">All Pages</option>
            {pages.map(page => (
              <option key={page} value={page}>{page}</option>
            ))}
          </select>
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value as FeedbackType | 'all')}
            className="flex-1 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
          >
            <option value="all">All Types</option>
            {(['style', 'content', 'behavior', 'layout', 'feature'] as FeedbackType[]).map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <select
          value={filterPriority}
          onChange={e => setFilterPriority(e.target.value as FeedbackPriority | 'all')}
          className="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
        >
          <option value="all">All Priorities</option>
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>
      </div>

      {/* Feedback List */}
      <div className="flex-1 overflow-y-auto">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-600">
            <AlertCircle className="w-12 h-12 mb-3" />
            <p className="text-sm">No feedback items</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {Object.entries(groupedByPage).map(([page, items]) => (
              <div key={page}>
                <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/50 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {page} ({items.length})
                </div>
                {items.map(item => {
                  const isExpanded = expandedItems.has(item.id);
                  const TypeIcon = getTypeIcon(item.feedback.type);
                  
                  return (
                    <div
                      key={item.id}
                      className="border-b border-gray-100 dark:border-gray-800 last:border-0"
                    >
                      <div
                        className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                        onClick={() => toggleExpanded(item.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <TypeIcon className="w-4 h-4 text-gray-400" />
                              <span className={cn(
                                'px-2 py-0.5 rounded-full text-xs font-medium',
                                getPriorityColor(item.feedback.priority)
                              )}>
                                {item.feedback.priority}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(item.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                            
                            {item.element.componentName && (
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                                {item.element.componentName}
                              </div>
                            )}
                            
                            <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                              {item.feedback.description}
                            </div>
                            
                            <div className="mt-1">
                              <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
                                {item.element.selector.length > 40 
                                  ? item.element.selector.substring(0, 40) + '...'
                                  : item.element.selector}
                              </code>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-1 ml-2">
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                deleteFeedback(item.id);
                              }}
                              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                            >
                              <Trash2 className="w-3 h-3 text-gray-400" />
                            </button>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-gray-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {isExpanded && (
                        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/30 border-t border-gray-200 dark:border-gray-700">
                          <div className="space-y-3 text-sm">
                            <div>
                              <div className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Description
                              </div>
                              <div className="text-gray-600 dark:text-gray-400">
                                {item.feedback.description}
                              </div>
                            </div>
                            
                            {item.feedback.suggestedChange && (
                              <div>
                                <div className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Suggested Change
                                </div>
                                <div className="text-gray-600 dark:text-gray-400 font-mono text-xs bg-white dark:bg-gray-900 p-2 rounded">
                                  {item.feedback.suggestedChange}
                                </div>
                              </div>
                            )}
                            
                            {item.element.componentPath && (
                              <div>
                                <div className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Component Path
                                </div>
                                <div className="text-gray-600 dark:text-gray-400 font-mono text-xs">
                                  {item.element.componentPath}
                                </div>
                              </div>
                            )}
                            
                            {item.element.tailwindClasses && item.element.tailwindClasses.length > 0 && (
                              <div>
                                <div className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Current Classes
                                </div>
                                <div className="text-gray-600 dark:text-gray-400 font-mono text-xs">
                                  {item.element.tailwindClasses.join(' ')}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}