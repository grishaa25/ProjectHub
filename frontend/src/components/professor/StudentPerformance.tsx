
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { ArrowUp, ArrowDown, AlertCircle } from "lucide-react";

// Mock data for student performance
const performanceData = [
  { assignment: "Assignment 1", classAverage: 82, topScore: 98 },
  { assignment: "Assignment 2", classAverage: 78, topScore: 95 },
  { assignment: "Quiz 1", classAverage: 76, topScore: 100 },
  { assignment: "Midterm", classAverage: 72, topScore: 96 },
  { assignment: "Assignment 3", classAverage: 80, topScore: 98 },
  { assignment: "Assignment 4", classAverage: 84, topScore: 100 },
  { assignment: "Final Project", classAverage: 86, topScore: 98 },
];

// Mock data for topic mastery
const topicMasteryData = [
  { topic: "Topic 1", mastery: 80 },
  { topic: "Topic 2", mastery: 65 },
  { topic: "Topic 3", mastery: 90 },
  { topic: "Topic 4", mastery: 75 },
  { topic: "Topic 5", mastery: 50 },
  { topic: "Topic 6", mastery: 85 },
];

// Mock data for assignment completion
const assignmentCompletionData = [
  { name: "On Time", value: 65, color: "#4CAF50" },
  { name: "Late", value: 25, color: "#FFB74D" },
  { name: "Missing", value: 10, color: "#E57373" },
];

// Mock data for struggling students
const strugglingStudentsData = [
  { 
    id: 1, 
    name: "Alex Johnson", 
    weakTopics: ["Algorithms", "Data Structures"], 
    avgScore: 65,
    trend: "down" 
  },
  { 
    id: 2, 
    name: "Jamie Smith", 
    weakTopics: ["Database Design"], 
    avgScore: 68,
    trend: "down" 
  },
  { 
    id: 3, 
    name: "Taylor Brown", 
    weakTopics: ["Object-Oriented Programming", "Memory Management"], 
    avgScore: 72,
    trend: "up" 
  },
];

export const StudentPerformance = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h3 className="text-lg font-medium">Performance Insights</h3>
        <Select defaultValue="cs101">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cs101">CS101: Intro to CS</SelectItem>
            <SelectItem value="cs201">CS201: Data Structures</SelectItem>
            <SelectItem value="cs301">CS301: Database Systems</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Class Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">78%</div>
            <div className="flex items-center mt-1 text-sm">
              <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 font-medium">3.2%</span>
              <span className="text-muted-foreground ml-1">from last assignment</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">92%</div>
            <div className="flex items-center mt-1 text-sm">
              <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-red-500 font-medium">1.5%</span>
              <span className="text-muted-foreground ml-1">from previous week</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">At-Risk Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">7</div>
            <div className="flex items-center mt-1 text-sm">
              <AlertCircle className="h-4 w-4 text-amber-500 mr-1" />
              <span className="text-muted-foreground">Performing below 70%</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Assignment Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="assignment" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="classAverage" name="Class Average" fill="#5A88C5" />
                <Bar dataKey="topScore" name="Top Score" fill="#4CAF50" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Topic Mastery</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={topicMasteryData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="topic" />
                <PolarRadiusAxis domain={[0, 100]} />
                <Radar name="Class Mastery" dataKey="mastery" stroke="#5A88C5" fill="#5A88C5" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Students Needing Attention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {strugglingStudentsData.map((student) => (
                <div key={student.id} className="flex items-start justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{student.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Weak areas: {student.weakTopics.join(", ")}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{student.avgScore}%</div>
                    <div className="flex items-center justify-end">
                      {student.trend === "up" ? (
                        <ArrowUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-red-500" />
                      )}
                      <span className={`text-xs ${student.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                        {student.trend === "up" ? "Improving" : "Declining"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Assignment Submission</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={assignmentCompletionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {assignmentCompletionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {assignmentCompletionData.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm">{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
