"use client"

import { useState } from "react"
import { Avatar } from "./ui/avatar"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { MessageSquare, Send } from "lucide-react"

interface Message {
  id: string
  sender: {
    name: string
    avatar: string
    role: "mentor" | "student"
  }
  content: string
  timestamp: string
}

const dummyMessages: Message[] = [
  {
    id: "1",
    sender: {
      name: "Dr. Sarah Johnson",
      avatar: "/placeholder.svg",
      role: "mentor"
    },
    content: "Welcome to the project! Let me know if you have any questions about the research objectives.",
    timestamp: "2 days ago"
  },
  {
    id: "2",
    sender: {
      name: "Alex Chen",
      avatar: "/placeholder.svg",
      role: "student"
    },
    content: "Thanks Dr. Johnson! I've reviewed the project description and I'm particularly interested in the machine learning aspects.",
    timestamp: "1 day ago"
  },
  {
    id: "3",
    sender: {
      name: "Dr. Sarah Johnson",
      avatar: "/placeholder.svg",
      role: "mentor"
    },
    content: "Great to hear that, Alex! I'll share some relevant papers that might help you get started.",
    timestamp: "1 day ago"
  }
]

export function ChatBox() {
  const [messages, setMessages] = useState<Message[]>(dummyMessages)
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      sender: {
        name: "You",
        avatar: "/placeholder.svg",
        role: "student"
      },
      content: newMessage,
      timestamp: "Just now"
    }

    setMessages([...messages, message])
    setNewMessage("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Project Discussion
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Messages */}
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${message.sender.role === "mentor" ? "" : "flex-row-reverse"}`}
              >
                <Avatar>
                  <img src={message.sender.avatar} alt={message.sender.name} />
                </Avatar>
                <div className={`flex-1 space-y-1 ${message.sender.role === "mentor" ? "" : "items-end"}`}>
                  <div className={`flex items-center gap-2 ${message.sender.role === "mentor" ? "" : "flex-row-reverse"}`}>
                    <p className="font-medium">{message.sender.name}</p>
                    <p className="text-xs text-gray-500">{message.timestamp}</p>
                  </div>
                  <div className={`rounded-lg p-3 ${
                    message.sender.role === "mentor" 
                      ? "bg-gray-100 text-gray-800" 
                      : "bg-[#6b3e7c] text-white"
                  }`}>
                    <p>{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage()
                }
              }}
            />
            <Button
              onClick={handleSendMessage}
              className="bg-[#6b3e7c] hover:bg-[#5a2e6b]"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
