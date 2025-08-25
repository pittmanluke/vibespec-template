export type FeedbackMode = 'navigate' | 'annotate' | 'review';
export type FeedbackType = 'style' | 'content' | 'behavior' | 'layout' | 'feature';
export type FeedbackPriority = 'low' | 'medium' | 'high';

export interface ElementData {
  selector: string;
  xpath: string;
  componentName?: string;
  componentPath?: string;
  computedStyles: Record<string, string>;
  boundingBox: DOMRect;
  innerHTML: string;
  tailwindClasses?: string[];
}

export interface FeedbackMetadata {
  viewport: {
    width: number;
    height: number;
  };
  userAgent: string;
  timestamp: string;
}

export interface FeedbackData {
  type: FeedbackType;
  description: string;
  priority: FeedbackPriority;
  suggestedChange?: string;
  screenshots?: string[];
}

export interface FeedbackItem {
  id: string;
  timestamp: number;
  page: string;
  element: ElementData;
  feedback: FeedbackData;
  metadata: FeedbackMetadata;
}

export interface FeedbackState {
  enabled: boolean;
  mode: FeedbackMode;
  feedbackItems: FeedbackItem[];
  currentPage: string;
  sessionId: string;
  isMinimized: boolean;
}

export interface FeedbackConfig {
  theme: 'light' | 'dark' | 'auto';
  position: 'top-right' | 'bottom-right' | 'floating';
  opacity: number;
  autoHighlight: boolean;
  captureScreenshots: boolean;
  includeComputedStyles: boolean;
  shortcuts: {
    toggle: string;
    annotate: string;
    review: string;
    export: string;
    minimize: string;
  };
  exportFormat: 'markdown' | 'json' | 'both';
  includeImplementationHints: boolean;
  groupByComponent: boolean;
}

export interface FeedbackExport {
  version: string;
  session: string;
  timestamp: string;
  pages: string[];
  totalItems: number;
  feedback: FeedbackItem[];
}