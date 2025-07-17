"use client";

import { useState, useEffect } from "react";

/**
 * Custom hook to track online/offline status
 * 
 * @returns An object containing online status and reconnection attempts
 * 
 * @example
 * ```tsx
 * const { isOnline, reconnectAttempts } = useOnlineStatus();
 * 
 * if (!isOnline) {
 *   return <OfflineNotification reconnectAttempts={reconnectAttempts} />;
 * }
 * ```
 */
export function useOnlineStatus() {
  // Always start as true to avoid SSR mismatches
  const [isOnline, setIsOnline] = useState(true);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [lastOnlineTime, setLastOnlineTime] = useState<Date | null>(new Date());

  useEffect(() => {
    // Set the actual online status after mount
    if (typeof navigator !== "undefined") {
      setIsOnline(navigator.onLine);
      if (!navigator.onLine) {
        setLastOnlineTime(null);
      }
    }
    // Handler for online status
    const handleOnline = () => {
      setIsOnline(true);
      setLastOnlineTime(new Date());
      setReconnectAttempts(0);
    };

    // Handler for offline status
    const handleOffline = () => {
      setIsOnline(false);
      // Start reconnection attempts
      if (reconnectAttempts === 0) {
        attemptReconnection();
      }
    };

    // Function to attempt reconnection
    const attemptReconnection = () => {
      if (!navigator.onLine) {
        setReconnectAttempts(prev => prev + 1);
        
        // Exponential backoff for reconnection attempts
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
        
        setTimeout(() => {
          if (!navigator.onLine) {
            attemptReconnection();
          } else {
            handleOnline();
          }
        }, delay);
      } else {
        handleOnline();
      }
    };

    // Listen for online/offline events
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Clean up event listeners
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [reconnectAttempts]);

  return {
    isOnline,
    reconnectAttempts,
    lastOnlineTime,
    timeSinceOnline: lastOnlineTime 
      ? Math.floor((new Date().getTime() - lastOnlineTime.getTime()) / 1000)
      : null
  };
}

export default useOnlineStatus; 