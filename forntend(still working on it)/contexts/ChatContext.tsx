"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ChatMessage } from '@/lib/data/chatMessages';
import { chatData as initialChatData } from '@/lib/data/chatMessages';

interface ChatContextType {
  getChat: (slug: string) => ChatMessage[];
  addMessage: (slug: string, message: ChatMessage) => void;
  clearChat: (slug: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [chatData, setChatData] = useState<Record<string, ChatMessage[]>>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('chatData');
      return stored ? JSON.parse(stored) : initialChatData;
    }
    return initialChatData;
  });

  const broadcastChannel = typeof window !== 'undefined' ? new BroadcastChannel('chat_sync') : null;

  useEffect(() => {
    if (!broadcastChannel) return;

    const handleMessage = (event: MessageEvent) => {
      const { type, slug, data } = event.data;
      if (type === 'ADD_MESSAGE') {
        setChatData(prev => ({
          ...prev,
          [slug]: [...(prev[slug] || []), data]
        }));
      } else if (type === 'CLEAR_CHAT') {
        setChatData(prev => ({
          ...prev,
          [slug]: []
        }));
      }
    };

    broadcastChannel.addEventListener('message', handleMessage);
    return () => {
      broadcastChannel.removeEventListener('message', handleMessage);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('chatData', JSON.stringify(chatData));
  }, [chatData]);

  const getChat = (slug: string) => chatData[slug] || [];

  const addMessage = (slug: string, message: ChatMessage) => {
    setChatData(prev => ({
      ...prev,
      [slug]: [...(prev[slug] || []), message]
    }));

    broadcastChannel?.postMessage({
      type: 'ADD_MESSAGE',
      slug,
      data: message
    });
  };

  const clearChat = (slug: string) => {
    setChatData(prev => ({
      ...prev,
      [slug]: []
    }));

    broadcastChannel?.postMessage({
      type: 'CLEAR_CHAT',
      slug
    });
  };

  return (
    <ChatContext.Provider value={{ getChat, addMessage, clearChat }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}