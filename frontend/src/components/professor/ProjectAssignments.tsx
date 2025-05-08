
import React, { useState } from "react";
import { Card } from "@/components/ui-custom/Card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui-custom/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Check, 
  Clock, 
  AlertCircle, 
  FileText, 
  Plus, 
  Download,
  Upload,
  UserCheck,
  BarChart
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Mock data for assignments
const assignmentsData = [
  {
    id: 1,
    title: "Project Proposal",
    project: "Web Application Development",
    dueDate: "2023-10-20",
    status: "Graded",
    submissionsReceived: 8,
    totalStudents: 8,
    averageScore: 92,
  },
  {
    id: 2,
    title: "UI Wireframes",
    project: "Mobile App Design",
    dueDate: "2023-10-25",
    status: "Pending Review",
    submissionsReceived: 4,
    totalStudents: 5,
    averageScore: null,
  },
  {
    id: 3,
    title: "Database Schema",
    project: "Web Application Development",
    dueDate: "2023-11-05",
    status: "Open",
    submissionsReceived: 3,
    totalStudents: 8,
    averageScore: null,
  },
  {
    id: 4,
    title: "Data Analysis Report",
    project: "Data Visualization Dashboard",
    dueDate: "2023-10-15",
    status: "Graded",
    submissionsReceived: 6,
    totalStudents: 6,
    averageScore: 86,
  },
  {
    id: 5,
    title: "Model Training Documentation",
    project: "Machine Learning Models",
    dueDate: "2023-11-10",
    status: "Open",
    submissionsReceived: 1,
    totalStudents: 4,
    averageScore: null,
  },
];

export const ProjectAssignments = () => {
  const [assignments, setAssignments] = useState(assignmentsData);
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Graded":
        return (
          <Badge className="bg-green-500 text-white">
            <Check className="mr-1 h-3 w-3" /> Graded
          </Badge>
        );
      case "Pending Review":
        return (
          <Badge className="bg-amber-500 text-white">
            <Clock className="mr-1 h-3 w-3" /> Pending Review
          </Badge>
        );
      case "Open":
        return (
          <Badge className="bg-blue-500 text-white">
            <FileText className="mr-1 h-3 w-3" /> Open
          </Badge>
        );
      case "Overdue":
        return (
          <Badge className="bg-red-500 text-white">
            <AlertCircle className="mr-1 h-3 w-3" /> Overdue
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Project Assignments</h3>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Assignment
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="pending">Pending Review</TabsTrigger>
          <TabsTrigger value="graded">Graded</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {assignments.map((assignment) => (
            <Card 
              key={assignment.id} 
              variant="outline" 
              className="p-5 hover:border-primary/50 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center">
                    <h4 className="font-medium mr-3">{assignment.title}</h4>
                    {getStatusBadge(assignment.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Project: {assignment.project}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Due: {new Date(assignment.dueDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <UserCheck className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      Submissions: {assignment.submissionsReceived}/{assignment.totalStudents}
                    </span>
                  </div>

                  <Progress 
                    value={(assignment.submissionsReceived / assignment.totalStudents) * 100} 
                    className="h-2 w-32"
                  />
                  
                  {assignment.averageScore && (
                    <div className="flex items-center text-sm">
                      <BarChart className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Average Score: {assignment.averageScore}%</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-3 w-3" />
                    Download
                  </Button>
                  {assignment.status === "Pending Review" && (
                    <Button size="sm">
                      <Check className="mr-2 h-3 w-3" />
                      Grade
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="open" className="space-y-4">
          {assignments
            .filter(a => a.status === "Open")
            .map((assignment) => (
              <Card 
                key={assignment.id} 
                variant="outline" 
                className="p-5 hover:border-primary/50 transition-colors"
              >
                {/* Same structure as above */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <h4 className="font-medium mr-3">{assignment.title}</h4>
                      {getStatusBadge(assignment.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Project: {assignment.project}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <UserCheck className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>
                        Submissions: {assignment.submissionsReceived}/{assignment.totalStudents}
                      </span>
                    </div>

                    <Progress 
                      value={(assignment.submissionsReceived / assignment.totalStudents) * 100} 
                      className="h-2 w-32"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-3 w-3" />
                      Download
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {assignments
            .filter(a => a.status === "Pending Review")
            .map((assignment) => (
              <Card 
                key={assignment.id} 
                variant="outline" 
                className="p-5 hover:border-primary/50 transition-colors"
              >
                {/* Same structure as above */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <h4 className="font-medium mr-3">{assignment.title}</h4>
                      {getStatusBadge(assignment.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Project: {assignment.project}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <UserCheck className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>
                        Submissions: {assignment.submissionsReceived}/{assignment.totalStudents}
                      </span>
                    </div>

                    <Progress 
                      value={(assignment.submissionsReceived / assignment.totalStudents) * 100} 
                      className="h-2 w-32"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-3 w-3" />
                      Download
                    </Button>
                    <Button size="sm">
                      <Check className="mr-2 h-3 w-3" />
                      Grade
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="graded" className="space-y-4">
          {assignments
            .filter(a => a.status === "Graded")
            .map((assignment) => (
              <Card 
                key={assignment.id} 
                variant="outline" 
                className="p-5 hover:border-primary/50 transition-colors"
              >
                {/* Same structure as above */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <h4 className="font-medium mr-3">{assignment.title}</h4>
                      {getStatusBadge(assignment.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Project: {assignment.project}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <UserCheck className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>
                        Submissions: {assignment.submissionsReceived}/{assignment.totalStudents}
                      </span>
                    </div>

                    <Progress 
                      value={(assignment.submissionsReceived / assignment.totalStudents) * 100} 
                      className="h-2 w-32"
                    />
                    
                    {assignment.averageScore && (
                      <div className="flex items-center text-sm">
                        <BarChart className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Average Score: {assignment.averageScore}%</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-3 w-3" />
                      Download
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};
