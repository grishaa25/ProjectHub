"use client"

import { ChatProvider } from "@/contexts/ChatContext"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChatProvider>
      {children}
    </ChatProvider>
  )
}