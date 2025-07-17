"use client";

import { useState, useEffect } from "react";

export type ToastVariant = "default" | "destructive" | "success";

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  open?: boolean;
  action?: React.ReactNode;
}

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

// Global toast state using event system
let globalToasts: Toast[] = [];
const toastListeners: Set<(toasts: Toast[]) => void> = new Set();
let notificationScheduled = false;

// Event system to notify all toast consumers (debounced to avoid excessive updates)
function notifyToastListeners() {
  if (notificationScheduled) return;
  
  notificationScheduled = true;
  // Use microtask to ensure synchronous updates without visual lag
  queueMicrotask(() => {
    toastListeners.forEach(listener => listener([...globalToasts]));
    notificationScheduled = false;
  });
}

function addToastListener(listener: (toasts: Toast[]) => void) {
  toastListeners.add(listener);
  return () => {
    toastListeners.delete(listener);
  };
}

// Global toast functions
export const toastApi = {
  add: (props: Omit<Toast, "id" | "open">) => {
    const id = genId();
    const newToast = { ...props, id, open: true };
    
    // Check for duplicate toasts with same title/description
    const isDuplicate = globalToasts.some(toast => 
      toast.open && 
      toast.title === props.title && 
      toast.description === props.description
    );
    
    if (isDuplicate) {
      return {
        id,
        dismiss: () => {},
        update: () => {},
      };
    }
    
    globalToasts = [newToast, ...globalToasts].slice(0, 5);
    notifyToastListeners();

    // Auto-dismiss after 5 seconds
    const dismissTimer = setTimeout(() => {
      toastApi.dismiss(id);
    }, 5000);

    return {
      id,
      dismiss: () => {
        clearTimeout(dismissTimer);
        toastApi.dismiss(id);
      },
      update: (updateProps: Partial<Toast>) => toastApi.update(id, updateProps),
    };
  },

  dismiss: (id?: string) => {
    if (id === undefined) {
      // Dismiss all toasts
      globalToasts = globalToasts.map((toast) => ({ ...toast, open: false }));
      notifyToastListeners();
      
      // Remove after animation completes
      setTimeout(() => {
        globalToasts = globalToasts.filter((toast) => toast.open !== false);
        notifyToastListeners();
      }, 200);
    } else {
      // Check if toast exists and is not already dismissing
      const toastExists = globalToasts.find(t => t.id === id);
      if (!toastExists || toastExists.open === false) {
        return; // Already dismissing or doesn't exist
      }
      
      // Dismiss a specific toast
      globalToasts = globalToasts.map((toast) =>
        toast.id === id ? { ...toast, open: false } : toast
      );
      notifyToastListeners();
      
      // Remove after animation completes
      setTimeout(() => {
        globalToasts = globalToasts.filter((toast) => toast.id !== id);
        notifyToastListeners();
      }, 200);
    }
  },

  update: (id: string, props: Partial<Toast>) => {
    globalToasts = globalToasts.map((toast) => 
      toast.id === id ? { ...toast, ...props } : toast
    );
    notifyToastListeners();
  }
};

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>(globalToasts);

  useEffect(() => {
    // Subscribe to toast updates
    const unsubscribe = addToastListener(setToasts);
    
    // Set initial state
    setToasts([...globalToasts]);
    
    return unsubscribe;
  }, []);

  const toast = (props: Omit<Toast, "id" | "open">) => {
    return toastApi.add(props);
  };

  return {
    toasts,
    toast,
    dismiss: toastApi.dismiss,
    update: toastApi.update,
  };
}

export default useToast; 