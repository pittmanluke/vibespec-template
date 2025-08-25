'use client';

import React, { useState, useCallback } from 'react';
import { useFeedback } from '@/providers/feedback-provider';
import { HighlightOverlay } from './highlight-overlay';
import { FeedbackAnnotator } from './feedback-annotator';
import { FeedbackSidebar } from './feedback-sidebar';

export function FeedbackController() {
  const { enabled, mode, addFeedback, currentPage } = useFeedback();
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cooldownActive, setCooldownActive] = useState(false);

  const handleElementClick = useCallback((element: Element) => {
    if (mode === 'annotate' && !cooldownActive) {
      setSelectedElement(element);
      setIsModalOpen(true);
    }
  }, [mode, cooldownActive]);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setSelectedElement(null);
    
    // Add cooldown to prevent immediate re-selection
    setCooldownActive(true);
    setTimeout(() => {
      setCooldownActive(false);
    }, 300);
  }, []);

  const handleSaveFeedback = useCallback((data: {
    element: import('@/types/feedback').ElementData;
    feedback: {
      type: import('@/types/feedback').FeedbackType;
      description: string;
      priority: import('@/types/feedback').FeedbackPriority;
      suggestedChange?: string;
    };
  }) => {
    addFeedback({
      page: currentPage,
      element: data.element,
      feedback: data.feedback,
      metadata: {
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      },
    });
    handleModalClose();
  }, [addFeedback, currentPage, handleModalClose]);

  // Early return MUST come after all hooks
  if (!enabled) return null;

  return (
    <>
      {/* Highlight overlay for annotate mode - disabled when modal is open */}
      <HighlightOverlay 
        onElementClick={handleElementClick} 
        isDisabled={isModalOpen || cooldownActive}
      />

      {/* Annotation modal */}
      {selectedElement && (
        <FeedbackAnnotator
          element={selectedElement}
          onClose={handleModalClose}
          onSave={handleSaveFeedback}
        />
      )}

      {/* Review sidebar */}
      {mode === 'review' && <FeedbackSidebar />}
    </>
  );
}