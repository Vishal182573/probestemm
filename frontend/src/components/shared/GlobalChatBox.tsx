/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, Send, X, Search, Loader2, CheckCheck, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_URL } from '@/constants';
import { cn } from "@/lib/utils";
import { Socket, io } from 'socket.io-client';
import { SOCKET_URL } from '@/constants';
import { Badge } from '../ui/badge';

// Interface definitions for type safety
interface User {
  // Defines the structure of a user object with optional fields
  // id: Unique identifier for the user
  // fullName, companyName: Optional user details
  // email: Required email field
  // imageUrl, photoUrl, profileImageUrl: Optional image URLs
  // role: Optional user role
  id: string;
  fullName?: string;
  companyName?: string;
  email: string;
  imageUrl?: string;
  photoUrl?:string;
  profileImageUrl?:string;
  role?: string;
}

interface ChatRoom {
  // Defines the structure of a chat room between two users
  // Contains IDs for both users, their types, timestamps
  // otherUser: Complete user object for the other participant
  // messages: Optional array of chat messages
  // unreadCount: Number of unread messages
  id: string;
  userOneId: string;
  userTwoId: string;
  userOneType: string;
  userTwoType: string;
  createdAt: string;
  updatedAt: string;
  otherUser: User;
  otherUserType: string;
  messages?: ChatMessage[];
  unreadCount:number;
}

interface ChatMessage {
  // Defines the structure of individual chat messages
  // Contains message content, media details, sender info
  // Tracks read status and timestamps
  id: string;
  content: string;
  mediaUrls: string[];
  mediaType: string | null;
  senderId: string;
  senderType: string;
  chatRoomId: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

interface GlobalChatBoxProps {
  isChatOpen: boolean;
}

const GlobalChatBox: React.FC<GlobalChatBoxProps> = ({isChatOpen}) => {
  // State Management
  // Core UI States
  const [isOpen, setIsOpen] = useState(isChatOpen);          // Controls main chat dialog visibility
  const [message, setMessage] = useState('');           // Current message input
  const [selectedChat, setSelectedChat] = useState<ChatRoom | null>(null);  // Currently selected chat
  const [searchQuery, setSearchQuery] = useState('');   // Search input for filtering chats
  
  // Data States
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]); // List of all chat rooms
  const [unreadCounts, setUnreadCounts] = useState<number>(0); // Total unread messages
  const [chatRoomUnreadCounts, setChatRoomUnreadCounts] = useState<{[key: string]: number}>({}); // Unread counts per room
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]); // List of blocked users
  
  // UI Control States
  const [loading, setLoading] = useState(false);        // Loading state for operations
  const [sending, setSending] = useState(false);        // Message sending state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Mobile sidebar visibility
  const [isClient, setIsClient] = useState(false);      // Client-side rendering check
  
  // Real-time Features States
  const [socket, setSocket] = useState<Socket | null>(null);  // WebSocket connection
  const [typingUsers, setTypingUsers] = useState<{[key: string]: boolean}>({}); // Users currently typing
  const [onlineUsers, setOnlineUsers] = useState<{[key: string]: boolean}>({}); // Online status tracking
  
  // Refs
  const messageEndRef = useRef<HTMLDivElement>(null);   // For auto-scrolling to latest message
  const typingTimeoutRef = useRef<NodeJS.Timeout>();    // For debouncing typing indicator

  // User Context
  const [currentUser, setCurrentUser] = useState<{ id: string | null; type: string | null }>({ 
    id: null, 
    type: null 
  });

  // Effects for Data Fetching and Real-time Updates
  useEffect(() => {
    // Fetches chat rooms and sets up polling for unread counts
    if (currentUser.id) {
      fetchChatRooms();
      fetchBlockedUsers();
      // Set up intervals for both total and individual unread counts
      const totalUnreadInterval = setInterval(fetchUnreadCounts, 2000);
      const roomUnreadInterval = setInterval(fetchChatRoomUnreadCounts, 2000);
      
      return () => {
        clearInterval(totalUnreadInterval);
        clearInterval(roomUnreadInterval);
      };
    }
  }, [currentUser.id]);

  // Add function to refresh selected chat
  const refreshSelectedChat = useCallback(async () => {
    if (!selectedChat?.id) return;
    
    try {
      const messages = await fetchChatMessages(selectedChat.id);
      messages.reverse();
      setSelectedChat(prev => prev ? { ...prev, messages } : null);
    } catch (error) {
      console.error('Failed to refresh chat:', error);
    }
  }, [selectedChat?.id]);

  // Add effect for periodic chat refresh
  useEffect(() => {
    const intervalId = setInterval(refreshSelectedChat, 3000);
    return () => clearInterval(intervalId);
  }, [refreshSelectedChat]);

   // Add new function to fetch unread counts for each chat room
   const fetchChatRoomUnreadCounts = async () => {
    if (!currentUser.id) return;

    try {
      const response = await fetch(`${API_URL}/chat/rooms/${currentUser.id}`);
      if (!response.ok) throw new Error('Failed to fetch chat room unread counts');
      const data = await response.json();
      
      const counts: {[key: string]: number} = {};
      data.forEach((room: ChatRoom) => {
        counts[room.id] = room.unreadCount;
      });
      
      setChatRoomUnreadCounts(counts);
    } catch (error) {
      console.error('Failed to fetch chat room unread counts:', error);
    }
  };

  // Set isClient to true once the component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize currentUser after component mounts and only if we're on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem("userId");
      const userType = localStorage.getItem("role");
      
      if (userId && userType) {
        setCurrentUser({
          id: userId,
          type: userType
        });
      }
    }
  }, [isClient]);

  const scrollToBottom = useCallback(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (currentUser.id) {
      fetchChatRooms();
      const interval = setInterval(fetchUnreadCounts, 10000);
      return () => clearInterval(interval);
    }
  }, [currentUser.id]);

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat?.messages, scrollToBottom]);

  useEffect(() => {
    if (!currentUser.id) return;

    const newSocket = io(SOCKET_URL, {
      auth: {
        userId: currentUser.id,
        userType: currentUser.type
      },
      path: '/api/socket.io',
      transports: ['websocket', 'polling'],
      upgrade: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    newSocket.on('connect', () => {
      console.log('Connected to socket server with ID:', newSocket.id);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    newSocket.on('receiveMessage', (message: ChatMessage) => {
      setSelectedChat(prev => {
        if (!prev || prev.id !== message.chatRoomId) return prev;
        return {
          ...prev,
          messages: [...(prev.messages || []), message]
        };
      });
      
      if (selectedChat?.id === message.chatRoomId) {
        markMessagesAsRead(message.chatRoomId);
      }
      fetchUnreadCounts();
    });

    newSocket.on('userTyping', ({ userId, chatRoomId, isTyping }) => {
      if (selectedChat?.id === chatRoomId && userId !== currentUser.id) {
        setTypingUsers(prev => {
          const newState = { ...prev };
          if (isTyping) {
            newState[userId] = true;
          } else {
            delete newState[userId];
          }
          return newState;
        });
      }
    });

    
    // Add online status events
    newSocket.emit('userOnline', { userId: currentUser.id });
    
    newSocket.on('userStatusUpdate', ({ userId, isOnline }) => {
      setOnlineUsers(prev => ({
        ...prev,
        [userId]: isOnline
      }));
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.emit('userOffline', { userId: currentUser.id });
        newSocket.disconnect();
      }
    };
  }, [currentUser.id, currentUser.type]);

  const fetchChatRooms = async () => {
    // Fetches all chat rooms for the current user
    if (!currentUser.id) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/chat/rooms/${currentUser.id}`);
      if (!response.ok) throw new Error('Failed to fetch chat rooms');
      const data = await response.json();
      setChatRooms(data);
    } catch (error) {
      console.error('Failed to fetch chat rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add this function with the other API functions
  const deleteChat = async (chatId: string) => {
    try {
      const response = await fetch(`${API_URL}/chat/rooms/${chatId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to delete chat');
      return true;
    } catch (error) {
      console.error('Failed to delete chat:', error);
      return false;
    }
  };

  const toggleBlockUser = async (userId: string, action: 'block' | 'unblock') => {
    try {
      const response = await fetch(`${API_URL}/chat/users/${userId}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blockerId: currentUser.id })
      });
      if (!response.ok) throw new Error(`Failed to ${action} user`);
      return true;
    } catch (error) {
      console.error(`Failed to ${action} user:`, error);
      return false;
    }
  };

  const fetchBlockedUsers = async () => {
    if (!currentUser.id) return;
    try {
      const response = await fetch(`${API_URL}/chat/users/blocked/${currentUser.id}`);
      if (!response.ok) throw new Error('Failed to fetch blocked users');
      const data = await response.json();
      setBlockedUsers(data.blockedUsers || []);
    } catch (error) {
      console.error('Failed to fetch blocked users:', error);
    }
  };

  const fetchUnreadCounts = async () => {
    if (!currentUser.id) return;

    try {
      const response = await fetch(`${API_URL}/chat/messages/unread/${currentUser.id}`);
      if (!response.ok) throw new Error('Failed to fetch unread counts');
      const data = await response.json();
      setUnreadCounts(data.unreadCount);
    } catch (error) {
      console.error('Failed to fetch unread counts:', error);
    }
  };

  const markMessagesAsRead = async (chatId: string) => {
    if (!currentUser.id) return;

    try {
      const response = await fetch(`${API_URL}/chat/messages/read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatRoomId: chatId, userId: currentUser.id })
      });
      if (!response.ok) throw new Error('Failed to mark messages as read');
      await fetchUnreadCounts();
    } catch (error) {
      console.error('Failed to mark messages as read:', error);
    }
  };

  const fetchChatMessages = async (chatId: string, page = 1, limit = 50) => {
    try {
      const response = await fetch(
        `${API_URL}/chat/messages?chatId=${chatId}&page=${page}&limit=${limit}`
      );
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      return data.messages ?? [];
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      return [];
    }
  };

  const sendNewMessage = async () => {
    // Handles message sending through both WebSocket and REST API
    if (!message.trim() || !selectedChat || sending || !socket || !currentUser.id) {
      console.log('Cannot send message:', { 
        hasMessage: !!message.trim(), 
        hasSelectedChat: !!selectedChat, 
        sending, 
        hasSocket: !!socket,
        hasCurrentUser: !!currentUser.id
      });
      return;
    }

    try {
      setSending(true);
      const messageData = {
        chatRoomId: selectedChat.id,
        senderId: currentUser.id,
        senderType: currentUser.type,
        receiverId: selectedChat.otherUser.id,
        content: message.trim(),
      };

      socket.emit('sendMessage', messageData, (error: any) => {
        if (error) {
          console.error('Socket message error:', error);
        }
      });

      const response = await fetch(`${API_URL}/chat/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData)
      });

      setMessage('');
      handleTyping(false);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleTyping = useCallback((typing: boolean) => {
    // Manages typing indicator emission through WebSocket
    if (!socket || !selectedChat || !currentUser.id) return;

    socket.emit('typing', {
      userId: currentUser.id,
      chatRoomId: selectedChat.id,
      isTyping: typing
    }, (error: any) => {
      if (error) {
        console.error('Error emitting typing status:', error);
      }
    });
  }, [socket, selectedChat, currentUser.id]);

  const debouncedTyping = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    handleTyping(true);
    typingTimeoutRef.current = setTimeout(() => {
      handleTyping(false);
    }, 1000);
  }, [handleTyping]);

  const handleMessageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setMessage(newValue);
    
    if (newValue.length > 0) {
      debouncedTyping();
    } else {
      handleTyping(false);
    }
  };

  const handleChatSelect = async (chat: ChatRoom) => {
    // Manages chat selection and message loading
    setSelectedChat(chat);
    setIsSidebarOpen(window.innerWidth > 768);
    const messages = await fetchChatMessages(chat.id);
    messages.reverse();
    setSelectedChat(prev => prev ? { ...chat, messages } : null);
    await markMessagesAsRead(chat.id);
  };

  const filteredChatRooms = chatRooms.filter(chat =>
    chat.otherUser?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.otherUser?.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.otherUser?.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const MessageView = ({ msg }: { msg: ChatMessage }) => {
    // Renders individual message bubbles with read receipts
    const isCurrentUser = msg.senderId === currentUser.id;
    const messageDateTime = new Date(msg.createdAt).toLocaleString([], {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
    

    
    const getInitial = () => {
      if (!isClient) return '';
      if (isCurrentUser) {
        return localStorage.getItem("fullName")?.toUpperCase()[0] ||
          localStorage.getItem("companyName")?.toUpperCase()[0] || '?';
      }
      return selectedChat?.otherUser.fullName?.toUpperCase()[0] ||
        selectedChat?.otherUser.companyName?.toUpperCase()[0] || '?';
    };
  
    const user = JSON.parse(localStorage.getItem("user") || "{}");
  
    return (
      <div
        className={cn(
          "flex mb-4",
          isCurrentUser ? "justify-end" : "justify-start"
        )}
      >
        <div className={cn(
          "flex items-start gap-2 max-w-[80%] group",
          isCurrentUser ? "flex-row-reverse" : "flex-row"
        )}>
          <Avatar className="w-8 h-8 shrink-0 transition-transform group-hover:scale-105">
            <AvatarImage src={isCurrentUser
      ? user.photoUrl || user.photoImageUrl || user.imageUrl
      : selectedChat?.otherUser?.imageUrl || 
        selectedChat?.otherUser?.photoUrl || 
        selectedChat?.otherUser?.profileImageUrl} />
            <AvatarFallback className={cn(
              "text-white transition-colors",
              isCurrentUser ? 'bg-[#eb5e17]' : 'bg-gray-400'
            )}>
              {getInitial()}
            </AvatarFallback>
          </Avatar>
          <div className={cn(
            "flex flex-col",
            isCurrentUser ? "items-end" : "items-start"
          )}>
            <div className={cn(
              "p-3 rounded-lg break-words shadow-sm transition-all duration-200",
              isCurrentUser
                ? "bg-[#eb5e17] text-white hover:bg-[#eb5e17]/90"
                : "bg-white hover:bg-gray-50"
            )}>
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
              <span>{messageDateTime}</span>
              {isCurrentUser && (
                <div className="flex items-center gap-1">
                  <CheckCheck className={cn(
                    "h-4 w-4",
                    msg.isRead ? "text-blue-600" : "text-gray-400"
                  )} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const TypingIndicator: React.FC = () => {
    // Renders typing indicator animation
    const typingCount = Object.values(typingUsers).filter(Boolean).length;
    if (!typingCount) return null;

    return (
      <div className="flex items-center gap-2 text-gray-500 text-sm bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-sm transition-all duration-200 animate-fade-in">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-[#eb5e17] rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2 h-2 bg-[#eb5e17] rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 bg-[#eb5e17] rounded-full animate-bounce" />
        </div>
        <span className="text-black font-medium">
          {typingCount === 1 ? 'Someone is typing...' : `${typingCount} people are typing...`}
        </span>
      </div>
    );
  };

  // Update ChatRoomItem to show online status
  const ChatRoomItem = ({ chat }: { chat: ChatRoom }) => (
    <div
      className={cn(
        "flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200 relative",
        selectedChat?.id === chat.id ? 'bg-gray-100 hover:bg-gray-100' : ''
      )}
      onClick={() => handleChatSelect(chat)}
    >
      <div className="relative">
        <Avatar className="h-12 w-12 shrink-0">
          <AvatarImage src={chat.otherUser?.imageUrl} />
          <AvatarFallback className="bg-[#eb5e17]/90 text-white">
            {chat.otherUser?.fullName?.[0]?.toUpperCase() ||
              chat.otherUser?.companyName?.[0]?.toUpperCase() || '?'}
          </AvatarFallback>
        </Avatar>
        <div className={cn(
          "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white",
          onlineUsers[chat.otherUser.id] ? "bg-green-500" : "bg-red-400"
        )} />
      </div>
      <div className="ml-3 flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <p className="text-sm font-medium truncate">
            {chat.otherUser?.fullName || chat.otherUser?.companyName}
          </p>
          {chatRoomUnreadCounts[chat.id] > 0 && (
            <Badge className="bg-[#eb5e17] hover:bg-[#eb5e17]/90 ml-2">
              {chatRoomUnreadCounts[chat.id]}
            </Badge>
          )}
        </div>
        <p className="text-xs text-gray-500 capitalize truncate">
          {chat.otherUser?.role || chat.otherUserType}
        </p>
      </div>
    </div>
  );

  if (!isClient) {
    return null;
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 h-14 w-14 rounded-full bg-[#eb5e17] hover:bg-[#eb5e17]/90 text-white p-0 z-50 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
      >
        <MessageCircle className="h-7 w-7" />
        <span className="absolute -top-2 -right-2 bg-white text-[#eb5e17] rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold shadow-md border-2 border-[#eb5e17]">
          {unreadCounts}
        </span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[900px] h-[80vh] max-h-[800px] flex flex-col p-0 focus:ring-0 focus:ring-offset-0 focus:outline-none gap-0 text-black">
          <DialogHeader className="p-4 border-b bg-white ">
          <DialogTitle className="flex gap-2 items-center text-lg font-semibold">
            <Avatar className="h-10 w-10">
              <AvatarImage src={JSON.parse(localStorage.getItem("user") || "{}")?.photoUrl || 
                              JSON.parse(localStorage.getItem("user") || "{}")?.photoImageUrl || 
                              JSON.parse(localStorage.getItem("user") || "{}")?.imageUrl} />
              <AvatarFallback className="bg-[#eb5e17] text-white">
                {localStorage.getItem("fullName")?.[0]?.toUpperCase() || 
                localStorage.getItem("companyName")?.[0]?.toUpperCase() || '?'}
              </AvatarFallback>
            </Avatar>
            <span>Messages</span>
          </DialogTitle>
          </DialogHeader>

          <div className="flex flex-1 overflow-hidden text-black">
            {/* Sidebar */}
            <div className={cn(
              "w-full md:w-80 border-r flex flex-col absolute md:relative inset-0 bg-white z-10 transition-transform duration-200",
              isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            )}>
              <div className="p-4 border-b">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search chats..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-gray-50 border-gray-200 focus:ring-[#eb5e17]/20"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSidebarOpen(false)}
                  className="ml-2 md:hidden absolute right-4 top-4"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-[#eb5e17]" />
                    </div>
                  ) : filteredChatRooms.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Search className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No chats found</p>
                    </div>
                  ) : (
                    filteredChatRooms.map(chat => (
                      <ChatRoomItem key={chat.id} chat={chat} />
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-gray-50">
              {!selectedChat ? (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                    <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">Start a Conversation</p>
                    <p className="text-sm text-gray-400">Select a chat from the sidebar to start messaging</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="px-6 py-4 border-b bg-white flex items-center justify-between shadow-sm">
                    <div className="flex items-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden mr-2"
                        onClick={() => setIsSidebarOpen(true)}
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={selectedChat.otherUser?.imageUrl} />
                        <AvatarFallback className="bg-[#eb5e17] text-white">
                          {selectedChat.otherUser?.fullName?.[0]?.toUpperCase() ||
                            selectedChat.otherUser?.companyName?.[0]?.toUpperCase() || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-3 cursor-pointer">
                        <p className="font-medium hover:text-[#eb5e17] transition-colors" 
                           onClick={() => {
                             window.location.href = `/${selectedChat.userOneId === currentUser.id ? selectedChat.userTwoType : selectedChat.userOneType}-profile/${selectedChat.otherUser.id}`;
                           }}>
                          {selectedChat.otherUser?.fullName || selectedChat.otherUser?.companyName}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {selectedChat.otherUser?.role || selectedChat.otherUserType}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "text-sm",
                          blockedUsers.includes(selectedChat.otherUser.id)
                            ? "text-green-600 hover:text-green-700 hover:bg-green-50"
                            : "text-red-500 hover:text-red-600 hover:bg-red-50"
                        )}
                        onClick={async () => {
                          const action = blockedUsers.includes(selectedChat.otherUser.id)
                            ? 'unblock'
                            : 'block';
                          const message = action === 'block'
                            ? 'Are you sure you want to block this user? They won\'t be able to send you messages.'
                            : 'Unblock this user?';
                            
                          if (window.confirm(message)) {
                            const success = await toggleBlockUser(
                              selectedChat.otherUser.id,
                              action
                            );
                            if (success) {
                              fetchBlockedUsers();
                              if (action === 'block') {
                                setSelectedChat(null);
                              }
                            }
                          }
                        }}
                      >
                        {blockedUsers.includes(selectedChat.otherUser.id)
                          ? "Unblock User"
                          : "Block User"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={async () => {
                          if (window.confirm('Are you sure you want to delete this chat? This action cannot be undone.')) {
                            const success = await deleteChat(selectedChat.id);
                            if (success) {
                              setSelectedChat(null);
                              fetchChatRooms();
                            }
                          }
                        }}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  <ScrollArea className="flex-1 px-6 py-4">
                    <div className="space-y-4 min-h-full">
                      <TypingIndicator/>
                      {selectedChat.messages?.map((msg) => (
                        <MessageView key={msg.id} msg={msg} />
                      ))}
                      <div ref={messageEndRef} />
                    </div>
                  </ScrollArea>

                  <div className="p-4 border-t bg-white shadow-lg">
                    <div className="flex items-center gap-2 max-w-4xl mx-auto">
                      {blockedUsers.includes(selectedChat.otherUser.id) ? (
                        <div className="flex-1 text-center text-sm text-gray-500 py-2 bg-gray-50 rounded-lg">
                          You have blocked this user. Unblock to send messages.
                        </div>
                      ) : (
                        <>
                          <Input
                            placeholder="Type a message..."
                            value={message}
                            onChange={handleMessageInput}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                sendNewMessage();
                              }
                            }}
                            className="flex-1 text-gray-900 bg-white focus:ring-[#eb5e17]/20 border-gray-200"
                            disabled={sending}
                            autoComplete="off"
                          />
                          <Button
                            onClick={sendNewMessage}
                            className="bg-[#eb5e17] hover:bg-[#eb5e17]/90 text-white px-4 h-10"
                            disabled={sending}
                          >
                            {sending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Send className="h-4 w-4" />
                            )}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GlobalChatBox;