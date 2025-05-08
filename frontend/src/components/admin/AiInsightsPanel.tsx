
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { BrainCircuit, Lightbulb, BookOpen, MessageSquare } from "lucide-react";

// Mock data for AI activity
const aiActivityData = [
  { day: "Mon", recommendations: 245, mentorChats: 120, searches: 380 },
  { day: "Tue", recommendations: 285, mentorChats: 132, searches: 420 },
  { day: "Wed", recommendations: 310, mentorChats: 145, searches: 450 },
  { day: "Thu", recommendations: 335, mentorChats: 155, searches: 470 },
  { day: "Fri", recommendations: 305, mentorChats: 140, searches: 430 },
  { day: "Sat", recommendations: 180, mentorChats: 90, searches: 210 },
  { day: "Sun", recommendations: 150, mentorChats: 85, searches: 190 },
];

export const AiInsightsPanel = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">AI Recommendations</CardTitle>
            <Lightbulb className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,810</div>
            <p className="text-xs text-muted-foreground">Weekly recommendations provided</p>
            <Progress value={72} className="h-1 mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Virtual Mentor</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">867</div>
            <p className="text-xs text-muted-foreground">Active chat sessions</p>
            <Progress value={65} className="h-1 mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Smart Search</CardTitle>
            <BrainCircuit className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,550</div>
            <p className="text-xs text-muted-foreground">Searches processed</p>
            <Progress value={85} className="h-1 mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Learning Content</CardTitle>
            <BookOpen className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">Relevance rating</p>
            <Progress value={94} className="h-1 mt-2" />
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>AI Feature Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={aiActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="recommendations" name="Recommendations" fill="#FFB74D" />
                <Bar dataKey="mentorChats" name="Mentor Chats" fill="#5A88C5" />
                <Bar dataKey="searches" name="Smart Searches" fill="#4CAF50" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>User Engagement with AI</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={aiActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="recommendations" name="Recommendations" stroke="#FFB74D" strokeWidth={2} />
                <Line type="monotone" dataKey="mentorChats" name="Mentor Chats" stroke="#5A88C5" strokeWidth={2} />
                <Line type="monotone" dataKey="searches" name="Smart Searches" stroke="#4CAF50" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>AI Effectiveness Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Course Recommendation Accuracy</span>
                <span className="text-sm font-medium">87%</span>
              </div>
              <Progress value={87} className="h-2" />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Mentor Response Relevance</span>
                <span className="text-sm font-medium">92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Smart Search Result Quality</span>
                <span className="text-sm font-medium">84%</span>
              </div>
              <Progress value={84} className="h-2" />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Auto-Grading Accuracy</span>
                <span className="text-sm font-medium">79%</span>
              </div>
              <Progress value={79} className="h-2" />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Plagiarism Detection Accuracy</span>
                <span className="text-sm font-medium">96%</span>
              </div>
              <Progress value={96} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
