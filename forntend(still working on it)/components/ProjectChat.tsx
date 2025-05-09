"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "@/contexts/ChatContext"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send } from "lucide-react"

// Helper function to generate unique IDs
const generateUniqueId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export function ProjectChat({ slug }: { slug: string }) {
  const { getChat, addMessage } = useChat()
  const [newMessage, setNewMessage] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const chatMessages = getChat(slug)

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current
      scrollArea.scrollTop = scrollArea.scrollHeight
    }
  }, [chatMessages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message = {
      id: generateUniqueId(),
      sender: {
        name: "You",
        avatar: "/placeholder.svg",
        role: "student" as const
      },
      content: newMessage.trim(),
      timestamp: new Date().toISOString()
    }

    addMessage(slug, message)
    setNewMessage("")
  }

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] bg-white rounded-lg shadow-sm">
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {chatMessages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${
                message.sender.name === "You" ? "flex-row-reverse" : ""
              }`}
            >
              <Avatar>
                <img src={message.sender.avatar} alt={message.sender.name} />
              </Avatar>
              <div className={`flex flex-col ${
                message.sender.name === "You" ? "items-end" : ""
              }`}>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{message.sender.name}</span>
                  <Badge variant="secondary" className="capitalize">
                    {message.sender.role}
                  </Badge>
                </div>
                <div className={`mt-1 p-3 rounded-lg ${
                  message.sender.name === "You"
                    ? "bg-[#6b3e7c] text-white"
                    : "bg-gray-100"
                }`}>
                  {message.content}
                </div>
                <span className="text-xs text-gray-500 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSendMessage()
          }}
          className="flex gap-2"
        >
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit" className="bg-[#6b3e7c] hover:bg-[#5a2e6b]">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}