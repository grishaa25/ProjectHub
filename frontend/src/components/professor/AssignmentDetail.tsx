
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui-custom/Button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { format, isPast } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { 
  Calendar as CalendarIcon, 
  Download, 
  Clock, 
  FileSpreadsheet, 
  Users, 
  UserCheck, 
  UserX, 
  CheckCheck,
  Edit,
  AlertCircle,
  XCircle
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface AssignmentDetailProps {
  assignmentId?: string;
}

// Mock data for an assignment
const mockAssignment = {
  id: "1",
  title: "Assignment 1: Introduction to Variables",
  description: "In this assignment, you will learn about variables, their types, and how to use them effectively in programming.",
  dueDate: new Date("2025-10-20T23:59:59"),
  department: "Computer Science",
  year: "2nd Year",
  course: "CS101",
  maxGrade: 100,
  status: "Open",
  totalStudents: 45,
  submissionsReceived: 28,
  submissionsPending: 17,
  submissionsGraded: 15,
  averageGrade: 84,
  highestGrade: 95,
  lowestGrade: 65,
  gradeDistribution: [
    { name: "90-100", value: 3, color: "#22c55e" },
    { name: "80-89", value: 7, color: "#84cc16" },
    { name: "70-79", value: 4, color: "#eab308" },
    { name: "60-69", value: 1, color: "#f97316" },
    { name: "< 60", value: 0, color: "#ef4444" },
  ],
  multipleSubmissions: [
    { studentId: "CS2023007", studentName: "Rebecca Johnson", count: 2 },
    { studentId: "CS2023012", studentName: "Thomas Wright", count: 3 },
  ],
  nonSubmitters: [
    { studentId: "CS2023015", studentName: "Sophia Martinez" },
    { studentId: "CS2023022", studentName: "David Chen" },
    { studentId: "CS2023030", studentName: "Emma Wilson" },
    { studentId: "CS2023037", studentName: "Noah Brown" },
    { studentId: "CS2023042", studentName: "Olivia Taylor" },
  ],
  recentSubmissions: [
    { studentId: "CS2023005", studentName: "James Wilson", submissionDate: new Date("2025-10-15T14:30:00"), status: "Graded", grade: 85 },
    { studentId: "CS2023008", studentName: "Emily Davis", submissionDate: new Date("2025-10-16T10:45:00"), status: "Pending", grade: null },
    { studentId: "CS2023019", studentName: "Alexander Lee", submissionDate: new Date("2025-10-15T21:15:00"), status: "Graded", grade: 92 },
    { studentId: "CS2023031", studentName: "Isabella Rodriguez", submissionDate: new Date("2025-10-17T09:30:00"), status: "Pending", grade: null },
    { studentId: "CS2023044", studentName: "William Thomas", submissionDate: new Date("2025-10-16T16:20:00"), status: "Graded", grade: 78 },
  ]
};

export const AssignmentDetail: React.FC<AssignmentDetailProps> = ({ assignmentId }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [assignment, setAssignment] = useState(mockAssignment);
  const [extendDeadlineDialog, setExtendDeadlineDialog] = useState(false);
  const [newDeadline, setNewDeadline] = useState<Date | undefined>(assignment.dueDate);
  const [reopenDialog, setReopenDialog] = useState(false);
  const [closeDialog, setCloseDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("overview");
  
  const submissionPercentage = Math.round((assignment.submissionsReceived / assignment.totalStudents) * 100);
  const gradingPercentage = assignment.submissionsReceived > 0 
    ? Math.round((assignment.submissionsGraded / assignment.submissionsReceived) * 100) 
    : 0;
  
  const handleExtendDeadline = () => {
    if (!newDeadline) return;
    
    setAssignment({
      ...assignment,
      dueDate: newDeadline
    });
    
    toast({
      title: "Deadline Extended",
      description: `The deadline has been extended to ${format(newDeadline, "PPP")}`,
    });
    
    setExtendDeadlineDialog(false);
  };
  
  const handleReopenAssignment = () => {
    setAssignment({
      ...assignment,
      status: "Open"
    });
    
    toast({
      title: "Assignment Reopened",
      description: "Students can now submit their work to this assignment.",
    });
    
    setReopenDialog(false);
  };

  const handleCloseAssignment = () => {
    setAssignment({
      ...assignment,
      status: "Closed"
    });
    
    toast({
      title: "Assignment Closed",
      description: "No more submissions will be accepted for this assignment.",
    });
    
    setCloseDialog(false);
  };
  
  const exportReport = () => {
    toast({
      title: "Report Exported",
      description: "The submission report has been downloaded as a CSV file.",
    });
  };
  
  const viewSubmissions = () => {
    navigate(`/professor/assignments/${assignmentId}/submissions`);
  };

  const editAssignment = () => {
    if (isPast(assignment.dueDate)) {
      toast({
        title: "Cannot Edit Assignment",
        description: "The deadline has already passed.",
        variant: "destructive"
      });
      return;
    }
    
    navigate(`/professor/assignments/edit/${assignmentId}`);
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overview Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-primary/10 shadow-sm">
            <CardHeader className="pb-3 border-b">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">Assignment Overview</CardTitle>
                <Badge variant={assignment.status === "Open" ? "default" : "secondary"}>
                  {assignment.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="prose prose-sm max-w-none">
                <p>{assignment.description}</p>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">
                    Due: <span className="font-medium">{format(assignment.dueDate, "PPP")}</span>
                  </span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">
                    For: <span className="font-medium">{assignment.year}, {assignment.department}</span>
                  </span>
                </div>
                <div className="flex items-center">
                  <CheckCheck className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">
                    Max Grade: <span className="font-medium">{assignment.maxGrade}</span>
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">
                    Course: <span className="font-medium">{assignment.course}</span>
                  </span>
                </div>
              </div>
              
              <div className="mt-6 flex flex-wrap gap-2">
                <Button onClick={viewSubmissions}>
                  <UserCheck className="mr-2 h-4 w-4" />
                  View Submissions
                </Button>
                <Button variant="outline" onClick={editAssignment} disabled={isPast(assignment.dueDate)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Assignment
                </Button>
                <Button variant="outline" onClick={() => setExtendDeadlineDialog(true)}>
                  <Clock className="mr-2 h-4 w-4" />
                  Extend Deadline
                </Button>
                {assignment.status === "Open" ? (
                  <Button variant="outline" onClick={() => setCloseDialog(true)}>
                    <XCircle className="mr-2 h-4 w-4" />
                    Close Assignment
                  </Button>
                ) : (
                  <Button variant="outline" onClick={() => setReopenDialog(true)}>
                    <Users className="mr-2 h-4 w-4" />
                    Reopen Assignment
                  </Button>
                )}
                <Button variant="outline" onClick={exportReport}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Export Report
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground">Submissions</div>
                <div className="text-2xl font-bold mt-1">{assignment.submissionsReceived}/{assignment.totalStudents}</div>
                <Progress value={submissionPercentage} className="h-1 mt-2" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{submissionPercentage}% submitted</span>
                  <span>{assignment.submissionsPending} pending</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground">Grading Progress</div>
                <div className="text-2xl font-bold mt-1">{assignment.submissionsGraded}/{assignment.submissionsReceived}</div>
                <Progress value={gradingPercentage} className="h-1 mt-2" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{gradingPercentage}% graded</span>
                  <span>{assignment.submissionsReceived - assignment.submissionsGraded} to grade</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground">Grade Statistics</div>
                <div className="text-2xl font-bold mt-1">{assignment.averageGrade || "N/A"}%</div>
                {assignment.averageGrade && (
                  <div className="flex justify-between text-xs mt-2">
                    <span className="text-muted-foreground">Range:</span>
                    <span className="font-medium">
                      {assignment.lowestGrade}% - {assignment.highestGrade}%
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Recent Submissions Table */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Recent Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Submission Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Grade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignment.recentSubmissions.map((submission, index) => (
                    <TableRow key={index} className="cursor-pointer hover:bg-muted/50" onClick={viewSubmissions}>
                      <TableCell>
                        <div className="font-medium">{submission.studentName}</div>
                        <div className="text-xs text-muted-foreground">{submission.studentId}</div>
                      </TableCell>
                      <TableCell>
                        {format(submission.submissionDate, "MMM d, yyyy")}
                        <div className="text-xs text-muted-foreground">
                          {format(submission.submissionDate, "h:mm a")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn(
                          submission.status === "Graded" ? "bg-green-500 text-white" : "bg-amber-500 text-white"
                        )}>
                          {submission.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {submission.grade !== null ? (
                          <span className="font-medium">{submission.grade}%</span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-end mt-4">
                <Button variant="outline" size="sm" onClick={viewSubmissions}>
                  View All Submissions
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Multiple Submissions and Non-Submitters */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Multiple Submissions */}
            <Card className="border-amber-200">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-sm flex items-center">
                  <Download className="mr-2 h-4 w-4 text-amber-600" />
                  Multiple Submissions
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {assignment.multipleSubmissions.length > 0 ? (
                  <ul className="space-y-2 text-sm">
                    {assignment.multipleSubmissions.map((student) => (
                      <li key={student.studentId} className="flex justify-between items-center">
                        <span>{student.studentName} ({student.studentId})</span>
                        <Badge variant="outline" className="bg-amber-50">
                          {student.count} submissions
                        </Badge>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No students have submitted multiple times.
                  </p>
                )}
              </CardContent>
            </Card>
            
            {/* Non Submitters */}
            <Card className="border-red-200">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-sm flex items-center">
                  <UserX className="mr-2 h-4 w-4 text-red-600" />
                  Students Without Submissions
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {assignment.nonSubmitters.length > 0 ? (
                  <ul className="space-y-2 text-sm">
                    {assignment.nonSubmitters.slice(0, 3).map((student) => (
                      <li key={student.studentId}>
                        {student.studentName} ({student.studentId})
                      </li>
                    ))}
                    {assignment.nonSubmitters.length > 3 && (
                      <li className="text-muted-foreground pt-1 text-xs">
                        + {assignment.nonSubmitters.length - 3} more students without submissions
                      </li>
                    )}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    All students have submitted their work.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Grade Distribution Chart */}
        <div className="lg:col-span-1">
          <Card className="border-primary/10 shadow-sm h-full">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-xl">Grade Distribution</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 flex items-center justify-center h-[300px]">
              {assignment.submissionsGraded > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={assignment.gradeDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {assignment.gradeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-muted-foreground">
                  <p>No grades available yet.</p>
                  <p className="text-sm mt-2">Grade some submissions to see the distribution.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Extend Deadline Dialog */}
      <Dialog open={extendDeadlineDialog} onOpenChange={setExtendDeadlineDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Extend Assignment Deadline</DialogTitle>
            <DialogDescription>
              Select a new deadline for this assignment. Students will be notified of the extension.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 flex flex-col items-center">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !newDeadline && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {newDeadline ? format(newDeadline, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={newDeadline}
                  onSelect={setNewDeadline}
                  disabled={(date) =>
                    date < new Date() || date < assignment.dueDate
                  }
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            
            <p className="text-xs text-muted-foreground mt-2">
              Current deadline: {format(assignment.dueDate, "PPP")}
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setExtendDeadlineDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleExtendDeadline} disabled={!newDeadline || newDeadline <= assignment.dueDate}>
              Extend Deadline
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Reopen Assignment Dialog */}
      <Dialog open={reopenDialog} onOpenChange={setReopenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reopen Assignment</DialogTitle>
            <DialogDescription>
              This will allow students to submit their work again. Are you sure you want to reopen this assignment?
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setReopenDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleReopenAssignment}>
              Reopen Assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Close Assignment Dialog */}
      <Dialog open={closeDialog} onOpenChange={setCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Close Assignment</DialogTitle>
            <DialogDescription>
              This will prevent students from submitting any further work. Are you sure you want to close this assignment?
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCloseDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCloseAssignment}>
              Close Assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
