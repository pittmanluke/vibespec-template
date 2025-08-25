'use client';

import React from 'react';
import { useFeedback } from '@/providers/feedback-provider';
import { MessageSquare } from 'lucide-react';

export function FeedbackDebugButton() {
  const { enabled, toggleEnabled } = useFeedback();
  
  // Only show in development
  if (process.env.NODE_ENV !== 'development') return null;
  
  return (
    <button
      onClick={toggleEnabled}
      className="fixed bottom-4 left-4 z-[9997] bg-purple-500 hover:bg-purple-600 text-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
      title="Toggle Feedback System (Debug)"
    >
      <MessageSquare className={`w-5 h-5 ${enabled ? 'fill-current' : ''}`} />
    </button>
  );
}