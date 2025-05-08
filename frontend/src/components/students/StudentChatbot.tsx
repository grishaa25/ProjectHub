
import React, { useState, useRef, useEffect } from "react";
import { 
  MessageSquare, 
  Send, 
  ThumbsUp, 
  ThumbsDown,
  Search,
  BookOpen
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Mock knowledge repository entries
const knowledgeEntries = [
  { id: 1, title: "Introduction to Neural Networks", category: "AI", tags: ["ML", "Neural Networks"] },
  { id: 2, title: "Data Structures Basics", category: "Programming", tags: ["Algorithms", "CS Fundamentals"] },
  { id: 3, title: "Web Development Fundamentals", category: "Web", tags: ["HTML", "CSS", "JavaScript"] },
  { id: 4, title: "Database Design Principles", category: "Databases", tags: ["SQL", "Schema Design"] }
];

// Message type definition
interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  sourceDocs?: { id: number; title: string }[];
  isLoading?: boolean;
}

// Suggested query interface
interface SuggestedQuery {
  id: string;
  text: string;
}

export const StudentChatbot = () => {
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { 
      id: "welcome", 
      content: "Hello! I'm your AI study assistant. How can I help you today?", 
      role: "assistant", 
      timestamp: new Date(),
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestedQueries, setSuggestedQueries] = useState<SuggestedQuery[]>([]);
  const [showRelatedDocs, setShowRelatedDocs] = useState(false);
  const [feedbackMessageId, setFeedbackMessageId] = useState<string | null>(null);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Generate suggested queries based on input
  useEffect(() => {
    if (input.length > 2) {
      // In a real app, this would call an API to get real suggestions
      const mockSuggestions = [
        { id: "s1", text: `${input} examples` },
        { id: "s2", text: `How to learn ${input}` },
        { id: "s3", text: `${input} best practices` },
      ];
      setSuggestedQueries(mockSuggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [input]);

  const handleSendMessage = (e: React.FormEvent | null, overrideMessage?: string) => {
    if (e) e.preventDefault();
    
    const messageContent = overrideMessage || input;
    if (!messageContent.trim()) return;
    
    // Add user message to chat
    const userMessageId = `msg-${Date.now()}-user`;
    setChatHistory(prev => [...prev, { 
      id: userMessageId,
      content: messageContent, 
      role: "user", 
      timestamp: new Date() 
    }]);
    
    // Clear input and reset UI states
    setInput("");
    setShowSuggestions(false);
    setShowRelatedDocs(false);

    // Add loading message
    const assistantMessageId = `msg-${Date.now()}-assistant`;
    setChatHistory(prev => [...prev, { 
      id: assistantMessageId,
      content: "...", 
      role: "assistant", 
      timestamp: new Date(),
      isLoading: true,
    }]);
    
    // Set loading state
    setIsLoading(true);

    // Simulate AI response and RAG retrieval
    setTimeout(() => {
      // Remove loading message
      setChatHistory(prev => prev.filter(msg => msg.id !== assistantMessageId));

      // In a real app, we'd make an API call to a backend service that handles RAG
      const isAboutNeuralNetworks = messageContent.toLowerCase().includes("neural") || 
        messageContent.toLowerCase().includes("network") || 
        messageContent.toLowerCase().includes("ai");
        
      const isAboutWeb = messageContent.toLowerCase().includes("web") || 
        messageContent.toLowerCase().includes("html") || 
        messageContent.toLowerCase().includes("javascript");

      const isUncertain = messageContent.toLowerCase().includes("quantum") || 
        messageContent.toLowerCase().includes("theory of relativity");

      let response: Partial<ChatMessage>;
      
      if (isUncertain) {
        // Fallback message for uncertain questions
        response = {
          content: "I'm not sure about this topic yet, but I'm continuously learning! Maybe try asking about neural networks, web development, or data structures?",
          role: "assistant",
        };
      } else if (isAboutNeuralNetworks) {
        // Response with source documents for neural networks
        response = {
          content: "Neural networks are computing systems vaguely inspired by the biological neural networks that constitute animal brains. They consist of artificial neurons that process and transmit information. The most common types are convolutional neural networks (CNNs) and recurrent neural networks (RNNs).",
          role: "assistant",
          sourceDocs: [{ id: 1, title: "Introduction to Neural Networks" }],
        };
        setShowRelatedDocs(true);
      } else if (isAboutWeb) {
        // Response with source documents for web development
        response = {
          content: "Web development involves building and maintaining websites. It includes aspects like web design, web publishing, web programming, and database management. The three core technologies for web development are HTML, CSS, and JavaScript.",
          role: "assistant",
          sourceDocs: [{ id: 3, title: "Web Development Fundamentals" }],
        };
        setShowRelatedDocs(true);
      } else {
        // Generic response for other questions
        response = {
          content: `Based on your question about "${messageContent}", I'd recommend checking out our learning resources on programming fundamentals. Would you like me to suggest some specific tutorials?`,
          role: "assistant",
        };
      }
      
      // Add AI response to chat
      setChatHistory(prev => [...prev, {
        id: `msg-${Date.now()}-assistant`,
        timestamp: new Date(),
        ...response,
      } as ChatMessage]);
      
      // Reset loading state
      setIsLoading(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    handleSendMessage(null, suggestion);
  };

  const handleFeedback = (messageId: string, isPositive: boolean) => {
    // In a real app, this would send feedback to the backend
    toast.success(isPositive ? "Thanks for the positive feedback!" : "Thanks for your feedback. We'll work on improving!");
    setFeedbackMessageId(messageId);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2 space-y-0">
        <CardTitle className="text-lg flex items-center">
          <MessageSquare className="mr-2 h-4 w-4 text-primary" />
          AI Study Assistant
        </CardTitle>
        <CardDescription>Ask me anything about your studies</CardDescription>
      </CardHeader>
      
      {/* Chat Container */}
      <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
        {/* Chat Messages */}
        <div 
          className="flex-1 overflow-y-auto p-4 space-y-4" 
          ref={chatContainerRef}
        >
          {chatHistory.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} relative`}>
              {message.role === "assistant" && (
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                </Avatar>
              )}
              
              <div className="space-y-1 max-w-[80%]">
                <div 
                  className={`px-3 py-2 rounded-lg ${
                    message.role === "user" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted"
                  } ${message.isLoading ? "animate-pulse" : ""}`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatTime(message.timestamp)}</span>
                  
                  {message.role === "assistant" && !message.isLoading && (
                    <div className="flex gap-1 ml-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0" 
                        onClick={() => handleFeedback(message.id, true)}
                        disabled={feedbackMessageId === message.id}
                      >
                        <ThumbsUp className={`h-3 w-3 ${feedbackMessageId === message.id ? 'text-green-500' : ''}`} />
                        <span className="sr-only">Helpful</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0" 
                        onClick={() => handleFeedback(message.id, false)}
                        disabled={feedbackMessageId === message.id}
                      >
                        <ThumbsDown className="h-3 w-3" />
                        <span className="sr-only">Not Helpful</span>
                      </Button>
                    </div>
                  )}
                </div>
                
                {/* Source Documents */}
                {message.sourceDocs && message.sourceDocs.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="text-xs text-muted-foreground">Sources:</span>
                    {message.sourceDocs.map(doc => (
                      <Badge key={doc.id} variant="outline" className="text-xs flex items-center">
                        <BookOpen className="mr-1 h-3 w-3 text-primary" />
                        {doc.title}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              {message.role === "user" && (
                <Avatar className="h-8 w-8 ml-2">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>ST</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>

        {/* Related Documents */}
        {showRelatedDocs && (
          <div className="px-4 py-2 border-t border-border bg-muted/50">
            <h4 className="text-sm font-medium">Related Documents</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {knowledgeEntries.slice(0, 3).map(doc => (
                <Badge key={doc.id} variant="secondary" className="cursor-pointer flex items-center">
                  <BookOpen className="mr-1 h-3 w-3" />
                  {doc.title}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* Query Suggestions */}
        {showSuggestions && (
          <div className="px-4 py-2 border-t border-border bg-muted/50">
            <h4 className="text-sm font-medium">Suggestions</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {suggestedQueries.map(suggestion => (
                <Badge 
                  key={suggestion.id} 
                  variant="outline" 
                  className="cursor-pointer hover:bg-accent"
                  onClick={() => handleSuggestionClick(suggestion.text)}
                >
                  <Search className="mr-1 h-3 w-3" />
                  {suggestion.text}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* Input Form */}
        <div className="border-t p-3 mt-auto">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              placeholder="Ask me anything about your studies..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <div className="text-xs text-center mt-2 text-muted-foreground">
            Try asking about neural networks, web development, or programming concepts
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
