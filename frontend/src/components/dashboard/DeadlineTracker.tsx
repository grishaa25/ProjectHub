
import React from "react";
import { CalendarClockIcon, BellIcon, CheckCircleIcon, CircleIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export const DeadlineTracker = () => {
  // Mock assignment data
  const assignments = [
    { 
      id: 1, 
      title: "Algorithm Analysis Paper", 
      course: "Advanced Algorithms", 
      dueDate: "2023-10-15T23:59:59", 
      submitted: false,
      progress: 70 
    },
    { 
      id: 2, 
      title: "Database Design Project", 
      course: "Database Systems", 
      dueDate: "2023-10-18T23:59:59", 
      submitted: false,
      progress: 45 
    },
    { 
      id: 3, 
      title: "ML Model Implementation", 
      course: "Machine Learning", 
      dueDate: "2023-10-25T23:59:59", 
      submitted: false,
      progress: 20 
    },
    { 
      id: 4, 
      title: "Programming Quiz", 
      course: "Advanced Algorithms", 
      dueDate: "2023-10-10T23:59:59", 
      submitted: true,
      progress: 100 
    },
  ];

  // Sort assignments by due date (nearest first) and filter out submitted ones
  const sortedAssignments = [...assignments]
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  // Function to format the due date
  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return "Overdue";
    } else if (diffDays === 0) {
      return "Due Today";
    } else if (diffDays === 1) {
      return "Due Tomorrow";
    } else {
      return `Due in ${diffDays} days`;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div>
          <CardTitle className="text-lg flex items-center">
            <CalendarClockIcon className="mr-2 h-4 w-4 text-primary" />
            Deadline Tracker
          </CardTitle>
          <CardDescription>Upcoming assignments</CardDescription>
        </div>
        <BellIcon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedAssignments.map((assignment) => {
          const dueStatus = formatDueDate(assignment.dueDate);
          const isOverdue = dueStatus === "Overdue";
          const isDueToday = dueStatus === "Due Today";
          
          return (
            <div key={assignment.id} className="border rounded-lg p-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-sm">{assignment.title}</h4>
                  <p className="text-xs text-muted-foreground">{assignment.course}</p>
                </div>
                <Badge 
                  className={
                    assignment.submitted ? "bg-success" : 
                    isOverdue ? "bg-destructive" : 
                    isDueToday ? "bg-secondary" : "bg-primary"
                  }
                >
                  {assignment.submitted ? "Submitted" : dueStatus}
                </Badge>
              </div>
              
              {!assignment.submitted && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span>{assignment.progress}%</span>
                  </div>
                  <Progress value={assignment.progress} className="h-1.5" />
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
