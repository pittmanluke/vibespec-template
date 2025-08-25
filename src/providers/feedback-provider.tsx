'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { FeedbackState, FeedbackItem, FeedbackMode, FeedbackConfig } from '@/types/feedback';
import { FeedbackExporter } from '@/lib/feedback/feedback-exporter';
import { v4 as uuidv4 } from 'uuid';

interface FeedbackContextType extends FeedbackState {
  setMode: (mode: FeedbackMode) => void;
  addFeedback: (item: Omit<FeedbackItem, 'id' | 'timestamp'>) => void;
  updateFeedback: (id: string, updates: Partial<FeedbackItem>) => void;
  deleteFeedback: (id: string) => void;
  clearFeedback: () => void;
  toggleEnabled: () => void;
  toggleMinimized: () => void;
  exportFeedback: (format: 'markdown' | 'json' | 'both') => Promise<string>;
  config: FeedbackConfig;
  updateConfig: (updates: Partial<FeedbackConfig>) => void;
}

const defaultConfig: FeedbackConfig = {
  theme: 'auto',
  position: 'bottom-right',
  opacity: 1,
  autoHighlight: true,
  captureScreenshots: false,
  includeComputedStyles: true,
  shortcuts: {
    toggle: 'cmd+shift+v',  // Changed from 'f' to 'v' to avoid fullscreen conflict
    annotate: 'a',
    review: 'r',
    export: 'cmd+shift+e',
    minimize: 'm',
  },
  exportFormat: 'markdown',
  includeImplementationHints: true,
  groupByComponent: true,
};

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

const STORAGE_KEY = 'vibespec-feedback';
const CONFIG_KEY = 'vibespec-feedback-config';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  // Only enable in development
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isEnabled = isDevelopment && process.env.NEXT_PUBLIC_ENABLE_FEEDBACK_OVERLAY === 'true';
  
  // Debug logging (disabled for cleaner console)
  // if (typeof window !== 'undefined') {
  //   console.log('🔍 Feedback System Debug:', {
  //     isDevelopment,
  //     envVar: process.env.NEXT_PUBLIC_ENABLE_FEEDBACK_OVERLAY,
  //     isEnabled,
  //   });
  // }

  // Initialize with default state to avoid hydration mismatch
  const [state, setState] = useState<FeedbackState>({
    enabled: false,
    mode: 'navigate',
    feedbackItems: [],
    currentPage: '',
    sessionId: '',
    isMinimized: false,
  });

  const [config, setConfig] = useState<FeedbackConfig>(defaultConfig);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage after hydration
  useEffect(() => {
    if (!isEnabled) return;
    
    // Load saved state
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const sessionAge = Date.now() - parsed.timestamp;
        if (sessionAge < SESSION_DURATION) {
          setState({
            ...parsed.state,
            currentPage: window.location.pathname,
          });
        }
      } catch (e) {
        console.error('Failed to parse feedback state:', e);
      }
    } else {
      // Set initial session ID and page
      setState(prev => ({
        ...prev,
        currentPage: window.location.pathname,
        sessionId: uuidv4(),
      }));
    }

    // Load saved config
    const storedConfig = localStorage.getItem(CONFIG_KEY);
    if (storedConfig) {
      try {
        setConfig({ ...defaultConfig, ...JSON.parse(storedConfig) });
      } catch (e) {
        console.error('Failed to parse feedback config:', e);
      }
    }
    
    setIsHydrated(true);
  }, []); // Only run once on mount

  // Auto-save to localStorage
  useEffect(() => {
    if (!isEnabled || !isHydrated || typeof window === 'undefined') return;

    const saveState = () => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          state,
          timestamp: Date.now(),
        })
      );
    };

    const debounced = setTimeout(saveState, 500);
    return () => clearTimeout(debounced);
  }, [state, isEnabled, isHydrated]);

  // Save config changes
  useEffect(() => {
    if (!isEnabled || !isHydrated || typeof window === 'undefined') return;
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  }, [config, isEnabled, isHydrated]);

  // Update current page on navigation
  useEffect(() => {
    if (!isEnabled || typeof window === 'undefined') return;

    const updatePage = () => {
      setState(prev => ({ ...prev, currentPage: window.location.pathname }));
    };

    window.addEventListener('popstate', updatePage);
    return () => window.removeEventListener('popstate', updatePage);
  }, [isEnabled]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isEnabled || typeof window === 'undefined') return;

    const handleKeydown = (e: KeyboardEvent) => {
      const { shortcuts } = config;
      const key = `${e.metaKey ? 'cmd+' : ''}${e.shiftKey ? 'shift+' : ''}${e.key.toLowerCase()}`;
      
      if (key === shortcuts.toggle) {
        e.preventDefault();
        toggleEnabled();
      } else if (state.enabled && !state.isMinimized) {
        if (key === shortcuts.annotate) {
          e.preventDefault();
          setMode('annotate');
        } else if (key === shortcuts.review) {
          e.preventDefault();
          setMode('review');
        } else if (key === shortcuts.export) {
          e.preventDefault();
          exportFeedback(config.exportFormat);
        } else if (key === shortcuts.minimize) {
          e.preventDefault();
          toggleMinimized();
        }
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, state.enabled, state.isMinimized, isEnabled]);

  const setMode = useCallback((mode: FeedbackMode) => {
    setState(prev => ({ ...prev, mode }));
  }, []);

  const addFeedback = useCallback((item: Omit<FeedbackItem, 'id' | 'timestamp'>) => {
    const newItem: FeedbackItem = {
      ...item,
      id: uuidv4(),
      timestamp: Date.now(),
    };
    setState(prev => ({
      ...prev,
      feedbackItems: [...prev.feedbackItems, newItem],
    }));
  }, []);

  const updateFeedback = useCallback((id: string, updates: Partial<FeedbackItem>) => {
    setState(prev => ({
      ...prev,
      feedbackItems: prev.feedbackItems.map(item =>
        item.id === id ? { ...item, ...updates } : item
      ),
    }));
  }, []);

  const deleteFeedback = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      feedbackItems: prev.feedbackItems.filter(item => item.id !== id),
    }));
  }, []);

  const clearFeedback = useCallback(() => {
    setState(prev => ({
      ...prev,
      feedbackItems: [],
      sessionId: uuidv4(),
    }));
  }, []);

  const toggleEnabled = useCallback(() => {
    setState(prev => ({
      ...prev,
      enabled: !prev.enabled,
      mode: !prev.enabled ? 'navigate' : prev.mode,
    }));
  }, []);

  const toggleMinimized = useCallback(() => {
    setState(prev => ({
      ...prev,
      isMinimized: !prev.isMinimized,
    }));
  }, []);

  const exportFeedback = useCallback(async (format: 'markdown' | 'json' | 'both'): Promise<string> => {
    const { feedbackItems, sessionId } = state;
    
    if (feedbackItems.length === 0) {
      console.warn('No feedback to export');
      return '';
    }

    const exporter = new FeedbackExporter();
    let exportContent: string;

    switch (format) {
      case 'json':
        exportContent = exporter.exportToJSON(feedbackItems, sessionId);
        break;
      case 'both':
        exportContent = exporter.exportCombined(feedbackItems, sessionId);
        break;
      case 'markdown':
      default:
        exportContent = exporter.exportToMarkdown(feedbackItems, sessionId);
        break;
    }

    await navigator.clipboard.writeText(exportContent);
    return exportContent;
  }, [state]);

  const updateConfig = useCallback((updates: Partial<FeedbackConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  if (!isEnabled) {
    return <>{children}</>;
  }

  const value: FeedbackContextType = {
    ...state,
    setMode,
    addFeedback,
    updateFeedback,
    deleteFeedback,
    clearFeedback,
    toggleEnabled,
    toggleMinimized,
    exportFeedback,
    config,
    updateConfig,
  };

  return (
    <FeedbackContext.Provider value={value}>
      {children}
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const context = useContext(FeedbackContext);
  if (!context) {
    // Return a no-op implementation for production
    return {
      enabled: false,
      mode: 'navigate' as FeedbackMode,
      feedbackItems: [],
      currentPage: '',
      sessionId: '',
      isMinimized: false,
      setMode: () => {},
      addFeedback: () => {},
      updateFeedback: () => {},
      deleteFeedback: () => {},
      clearFeedback: () => {},
      toggleEnabled: () => {},
      toggleMinimized: () => {},
      exportFeedback: async () => '',
      config: defaultConfig,
      updateConfig: () => {},
    };
  }
  return context;
}