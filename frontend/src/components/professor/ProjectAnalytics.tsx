
import React from "react";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line
} from "recharts";
import { Card } from "@/components/ui-custom/Card";

// Mock data for analytics
const projectProgressData = [
  { name: "Web App", completed: 65, remaining: 35 },
  { name: "Mobile App", completed: 25, remaining: 75 },
  { name: "Data Viz", completed: 100, remaining: 0 },
  { name: "ML Models", completed: 45, remaining: 55 },
  { name: "API Design", completed: 80, remaining: 20 },
];

const projectStatusData = [
  { name: "Completed", value: 8 },
  { name: "In Progress", value: 12 },
  { name: "Planning", value: 5 },
  { name: "On Hold", value: 2 },
];

const studentEngagementData = [
  { day: "Mon", interactions: 45 },
  { day: "Tue", interactions: 52 },
  { day: "Wed", interactions: 38 },
  { day: "Thu", interactions: 62 },
  { day: "Fri", interactions: 55 },
  { day: "Sat", interactions: 20 },
  { day: "Sun", interactions: 15 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export const ProjectAnalytics = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card variant="glass" className="p-4">
          <h3 className="font-semibold mb-4">Project Completion Progress</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={projectProgressData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                barSize={20}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" stackId="a" fill="#8884d8" name="Completed %" />
                <Bar dataKey="remaining" stackId="a" fill="#82ca9d" name="Remaining %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card variant="glass" className="p-4">
          <h3 className="font-semibold mb-4">Project Status Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card variant="glass" className="p-4">
        <h3 className="font-semibold mb-4">Weekly Student Engagement</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={studentEngagementData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="interactions" 
                stroke="#8884d8" 
                activeDot={{ r: 8 }} 
                name="Student Interactions"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card variant="glass" className="p-5 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold text-blue-500">27</div>
          <div className="text-sm text-muted-foreground">Total Projects</div>
        </Card>
        
        <Card variant="glass" className="p-5 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold text-green-500">68%</div>
          <div className="text-sm text-muted-foreground">Average Completion</div>
        </Card>
        
        <Card variant="glass" className="p-5 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold text-amber-500">42</div>
          <div className="text-sm text-muted-foreground">Active Students</div>
        </Card>
      </div>
    </div>
  );
};
