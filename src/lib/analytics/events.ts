export const ANALYTICS_EVENTS = {
  // Navigation
  NAVIGATION_CLICK: 'navigation_click',
  PAGE_VIEW: 'page_view',
  
  // User Actions
  CTA_CLICK: 'cta_click',
  FORM_SUBMIT: 'form_submit',
  THEME_CHANGE: 'theme_change',
  
  // Engagement
  SCROLL_DEPTH: 'scroll_depth',
  TIME_ON_PAGE: 'time_on_page',
  LINK_CLICK: 'link_click',
  
  // Conversion
  SIGNUP_START: 'signup_start',
  SIGNUP_COMPLETE: 'signup_complete',
  LOGIN_START: 'login_start',
  LOGIN_COMPLETE: 'login_complete',
  DEMO_REQUEST: 'demo_request',
  
  // Documentation
  DOCS_VIEW: 'docs_view',
  DOCS_SEARCH: 'docs_search',
  CODE_COPY: 'code_copy',
  
  // Errors
  ERROR_BOUNDARY: 'error_boundary',
  FORM_ERROR: 'form_error',
  API_ERROR: 'api_error',
} as const;

export type AnalyticsEvent = typeof ANALYTICS_EVENTS[keyof typeof ANALYTICS_EVENTS];

// Event property types for type safety
export interface BaseEventProperties {
  timestamp?: string;
  page_path?: string;
  page_title?: string;
}

export interface CTAClickProperties extends BaseEventProperties {
  label: string;
  destination?: string;
  section?: string;
}

export interface FormSubmitProperties extends BaseEventProperties {
  form_name: string;
  success: boolean;
  error_message?: string;
}

export interface NavigationClickProperties extends BaseEventProperties {
  from: string;
  to: string;
  method: 'link' | 'button' | 'menu';
}

export interface ThemeChangeProperties extends BaseEventProperties {
  from_theme: string;
  to_theme: string;
}