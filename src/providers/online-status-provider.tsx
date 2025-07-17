"use client";

import React, { createContext, useContext, ReactNode } from "react";
import useOnlineStatus from "@/hooks/use-online-status";
import OfflineNotification from "@/components/ui/offline-notification";

// Define the context shape
interface OnlineStatusContextType {
  isOnline: boolean;
  reconnectAttempts: number;
  lastOnlineTime: Date | null;
  timeSinceOnline: number | null;
}

// Create the context with a default value
const OnlineStatusContext = createContext<OnlineStatusContextType>({
  isOnline: true,
  reconnectAttempts: 0,
  lastOnlineTime: null,
  timeSinceOnline: null
});

// Export a hook to use the online status context
export const useOnlineStatusContext = () => useContext(OnlineStatusContext);

interface OnlineStatusProviderProps {
  children: ReactNode;
  /**
   * Whether to show an offline notification when offline
   */
  showOfflineNotification?: boolean;
  /**
   * Whether to show detailed reconnection information
   */
  showDetailedReconnect?: boolean;
}

/**
 * Provider component that makes online status available throughout the app
 */
export function OnlineStatusProvider({
  children,
  showOfflineNotification = true,
  showDetailedReconnect = false
}: OnlineStatusProviderProps) {
  const onlineStatus = useOnlineStatus();
  
  // Manual reconnection handler
  const handleManualReconnect = () => {
    // This simulates a manual check by refreshing the page
    // In a real app, you might want to implement a more sophisticated approach
    // such as retrying pending requests or checking connectivity via a fetch
    window.location.reload();
  };

  return (
    <OnlineStatusContext.Provider value={onlineStatus}>
      {/* Show offline notification if enabled and user is offline */}
      {showOfflineNotification && !onlineStatus.isOnline && (
        <OfflineNotification
          reconnectAttempts={onlineStatus.reconnectAttempts}
          timeSinceOnline={onlineStatus.timeSinceOnline}
          showDetailed={showDetailedReconnect}
          onManualReconnect={handleManualReconnect}
        />
      )}
      {children}
    </OnlineStatusContext.Provider>
  );
}

export default OnlineStatusProvider; 