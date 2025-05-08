
import React, { useState } from "react";
import { BrainCircuitIcon, SendIcon, PlusCircleIcon, RefreshCwIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const VirtualMentor = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { 
      role: "assistant", 
      content: "Hello! I'm your AI study assistant. How can I help you today? You can ask me questions about your courses or request explanations of difficult concepts."
    }
  ]);

  // Mock send message functionality
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message to chat
    setChatHistory(prev => [...prev, { role: "user", content: message }]);
    
    // Mock AI response based on user input
    setTimeout(() => {
      let aiResponse = "I'm processing your request...";
      
      if (message.toLowerCase().includes("neural network")) {
        aiResponse = "Neural networks are computing systems vaguely inspired by the biological neural networks that constitute animal brains. The neural network itself consists of interconnected neurons that can compute values from inputs by feeding information through the network.";
      } else if (message.toLowerCase().includes("algorithm")) {
        aiResponse = "An algorithm is a step-by-step procedure or set of rules for solving a specific problem. In computer science, algorithms are essential for processing data, automating tasks, and making decisions.";
      } else if (message.toLowerCase().includes("explain") || message.toLowerCase().includes("help")) {
        aiResponse = "I'd be happy to explain that concept! Could you provide more specific details about what you're struggling with?";
      } else {
        aiResponse = "That's an interesting question. Let me provide some insights on this topic. If you need more specific information, feel free to ask for clarification.";
      }
      
      setChatHistory(prev => [...prev, { role: "assistant", content: aiResponse }]);
    }, 1000);
    
    setMessage("");
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2 space-y-0">
        <CardTitle className="text-lg flex items-center">
          <BrainCircuitIcon className="mr-2 h-4 w-4 text-primary" />
          Virtual Mentor
        </CardTitle>
        <CardDescription>Your AI study assistant</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[240px] overflow-y-auto p-4">
          {chatHistory.map((chat, index) => (
            <div 
              key={index} 
              className={`flex ${chat.role === "user" ? "justify-end" : "justify-start"} mb-3`}
            >
              {chat.role === "assistant" && (
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                </Avatar>
              )}
              <div 
                className={`px-3 py-2 rounded-lg max-w-[85%] ${
                  chat.role === "user" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted"
                }`}
              >
                <p className="text-sm">{chat.content}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="border-t p-3">
          <form onSubmit={sendMessage} className="flex gap-2">
            <Input
              placeholder="Ask anything about your studies..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <SendIcon className="h-4 w-4" />
            </Button>
          </form>
          <div className="flex justify-center gap-2 mt-2">
            <Button variant="ghost" size="sm" className="text-xs h-7">
              <PlusCircleIcon className="h-3 w-3 mr-1" />
              New Chat
            </Button>
            <Button variant="ghost" size="sm" className="text-xs h-7">
              <RefreshCwIcon className="h-3 w-3 mr-1" />
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
