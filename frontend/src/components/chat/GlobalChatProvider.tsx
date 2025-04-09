"use client";

import { useState, useEffect } from "react";
import GlobalChatBox from "../shared/GlobalChatBox";

interface GlobalChatProviderProps {
  children: React.ReactNode;
}

export function GlobalChatProvider({ children }: GlobalChatProviderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Check authentication status when component mounts
  useEffect(() => {
    // Replace this with your actual authentication check
    const checkAuthStatus = async () => {
      try {
        // Example: fetch user data from API or check local storage
        // const response = await fetch('/api/auth/status');
        // const data = await response.json();
        // setIsLoggedIn(data.isLoggedIn);
        
        // For testing, you can set this to true
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsLoggedIn(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Toggle chat open/closed
  const toggleChat = () => {
    setIsChatOpen(prev => !prev);
  };

  return (
    <>
      {children}
      {isLoggedIn && <GlobalChatBox isChatOpen={isChatOpen} />}
    </>
  );
}