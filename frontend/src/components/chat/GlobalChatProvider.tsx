"use client";

import { useState, useEffect, Suspense } from "react";
import GlobalChatBox from "../shared/GlobalChatBox";
import { useSearchParams } from "next/navigation";

// Create a client component that uses useSearchParams
function ChatParamsHandler({ onOpenChat }: { onOpenChat: (open: boolean) => void }) {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const openChat = searchParams.get('openChat');
    if (openChat === 'true') {
      onOpenChat(true);
    }
  }, [searchParams, onOpenChat]);
  
  return null;
}

interface GlobalChatProviderProps {
  children: React.ReactNode;
}

// Create a custom event for auth changes
const AUTH_CHANGE_EVENT = 'authChange';

// Function to emit auth change event
export const emitAuthChange = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  }
};

export function GlobalChatProvider({ children }: GlobalChatProviderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const checkAuthStatus = () => {
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem("userId");
      const userType = localStorage.getItem("role");
      setIsLoggedIn(!!userId && !!userType);
    }
  };

  // Check authentication status when component mounts and when auth changes
  useEffect(() => {
    // Initial check
    checkAuthStatus();

    // Listen for storage events (cross-tab)
    window.addEventListener('storage', checkAuthStatus);
    
    // Listen for auth changes within the same tab
    window.addEventListener(AUTH_CHANGE_EVENT, checkAuthStatus);
    
    // Check auth status on route changes
    const handleRouteChange = () => {
      checkAuthStatus();
    };

    // Add route change listener
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('storage', checkAuthStatus);
      window.removeEventListener(AUTH_CHANGE_EVENT, checkAuthStatus);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return (
    <>
      {children}
      {isLoggedIn && <GlobalChatBox isChatOpen={isChatOpen} />}
      <Suspense fallback={null}>
        <ChatParamsHandler onOpenChat={setIsChatOpen} />
      </Suspense>
    </>
  );
}