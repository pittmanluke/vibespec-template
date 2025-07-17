"use client";

import React from "react";
import { AlertCircle, WifiOff, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface OfflineNotificationProps {
  /**
   * Number of reconnection attempts
   */
  reconnectAttempts?: number;
  /**
   * Time since last online in seconds
   */
  timeSinceOnline?: number | null;
  /**
   * Whether to show a detailed view with reconnection attempts
   */
  showDetailed?: boolean;
  /**
   * Whether to show as a toast instead of a banner
   */
  asToast?: boolean;
  /**
   * Function to manually trigger a reconnection attempt
   */
  onManualReconnect?: () => void;
}

/**
 * Displays a notification when the user is offline
 */
export function OfflineNotification({
  reconnectAttempts = 0,
  timeSinceOnline = null,
  showDetailed = false,
  asToast = false,
  onManualReconnect
}: OfflineNotificationProps) {
  // Format the offline duration
  const formatOfflineTime = (seconds: number | null) => {
    if (seconds === null) return "Unknown";
    
    if (seconds < 60) {
      return `${seconds} seconds`;
    } else if (seconds < 3600) {
      return `${Math.floor(seconds / 60)} minutes`;
    } else {
      return `${Math.floor(seconds / 3600)} hours, ${Math.floor((seconds % 3600) / 60)} minutes`;
    }
  };

  // Calculate the progress for the next reconnection attempt
  const reconnectDelay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
  const reconnectProgress = reconnectAttempts > 0 ? 
    Math.min(reconnectAttempts * 10, 100) : 0;

  // Simplified version for toast notifications
  if (asToast) {
    return (
      <div className="flex items-center space-x-2 p-2">
        <WifiOff className="h-5 w-5 text-destructive" />
        <span className="text-sm font-medium">You&apos;re offline</span>
        {onManualReconnect && (
          <Button variant="ghost" size="sm" onClick={onManualReconnect} className="h-7 px-2">
            <RefreshCw className="h-3.5 w-3.5 mr-1" />
            Retry
          </Button>
        )}
      </div>
    );
  }

  // Standard banner notification
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4 mr-2" />
      <AlertTitle className="flex items-center">
        <WifiOff className="h-4 w-4 mr-2" />
        You&apos;re currently offline
      </AlertTitle>
      <AlertDescription className="mt-2">
        <div className="space-y-2">
          <p>
            Your internet connection appears to be offline. Some features may be unavailable.
            {timeSinceOnline !== null && (
              <> You&apos;ve been offline for {formatOfflineTime(timeSinceOnline)}.</>
            )}
          </p>

          {showDetailed && reconnectAttempts > 0 && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Reconnection attempt: {reconnectAttempts}</span>
                <span>Next attempt in {Math.round(reconnectDelay / 1000)}s</span>
              </div>
              <Progress value={reconnectProgress} className="h-1" />
            </div>
          )}

          {onManualReconnect && (
            <Button variant="outline" size="sm" onClick={onManualReconnect}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Try to reconnect now
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}

export default OfflineNotification; 