
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";

// Mock data for student performance
const performanceData = [
  { month: "Jan", average: 76, engagement: 65 },
  { month: "Feb", average: 78, engagement: 68 },
  { month: "Mar", average: 82, engagement: 75 },
  { month: "Apr", average: 80, engagement: 78 },
  { month: "May", average: 85, engagement: 82 },
  { month: "Jun", average: 87, engagement: 86 },
];

// Mock data for system usage
const usageData = [
  { day: "Mon", active: 120, sessions: 180 },
  { day: "Tue", active: 132, sessions: 200 },
  { day: "Wed", active: 145, sessions: 230 },
  { day: "Thu", active: 155, sessions: 245 },
  { day: "Fri", active: 140, sessions: 220 },
  { day: "Sat", active: 90, sessions: 110 },
  { day: "Sun", active: 85, sessions: 100 },
];

// Mock data for user distribution
const userDistribution = [
  { name: "Students", value: 1200, color: "#5A88C5" },
  { name: "Professors", value: 150, color: "#FFB74D" },
  { name: "Admins", value: 15, color: "#E57373" },
];

export const AnalyticsPanel = () => {
  return (
    <Tabs defaultValue="performance">
      <TabsList className="mb-4">
        <TabsTrigger value="performance">Student Performance</TabsTrigger>
        <TabsTrigger value="usage">System Usage</TabsTrigger>
        <TabsTrigger value="distribution">User Distribution</TabsTrigger>
      </TabsList>
      
      <TabsContent value="performance" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Grade Average</CardTitle>
              <CardDescription>Monthly average grades across all courses</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="average" stroke="#5A88C5" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Student Engagement</CardTitle>
              <CardDescription>Monthly engagement metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="engagement" fill="#FFB74D" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      
      <TabsContent value="usage" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Daily Active Users</CardTitle>
              <CardDescription>Past week activity</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={usageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="active" stroke="#4CAF50" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Sessions</CardTitle>
              <CardDescription>Daily session count</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={usageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sessions" fill="#5A88C5" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      
      <TabsContent value="distribution">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">User Distribution</CardTitle>
            <CardDescription>Breakdown by role</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {userDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
