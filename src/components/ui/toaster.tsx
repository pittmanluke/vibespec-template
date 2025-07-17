"use client";

import React from "react";
import { X } from "lucide-react";
import { useToast, type Toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

function ToastItem({ 
  toast: { id, title, description, variant = "default", open, action }, 
  onDismiss 
}: { 
  toast: Toast;
  onDismiss: (id: string) => void;
}) {
  return (
    <div
      className={cn(
        "pointer-events-auto relative flex w-full items-center justify-between gap-4 overflow-hidden rounded-md border p-4 pr-7 shadow-lg transform-gpu transition-all",
        open ? "animate-in fade-in slide-in-from-right-full duration-200" : "animate-out fade-out slide-out-to-right-full duration-200",
        variant === "destructive" 
          ? "border-destructive bg-destructive text-destructive-foreground" 
          : variant === "success"
          ? "border-green-600 bg-green-50 text-green-800"
          : "border-border bg-background"
      )}
    >
      <div className="grid gap-1">
        {title && <h3 className="font-semibold">{title}</h3>}
        {description && <p className="text-sm opacity-90">{description}</p>}
      </div>
      {action}
      <button
        onClick={() => onDismiss(id)}
        className={cn(
          "absolute right-1 top-1 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100",
          variant === "destructive" 
            ? "text-destructive-foreground"
            : "text-foreground"
        )}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </button>
    </div>
  );
}

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px] pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
      ))}
    </div>
  );
}

export default Toaster; 