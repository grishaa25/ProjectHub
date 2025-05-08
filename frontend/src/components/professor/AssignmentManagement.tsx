import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui-custom/Button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Edit, Trash2, FileSpreadsheet, FileCheck, Eye, AlertCircle, CheckCircle, Clock, Search, Filter, XCircle, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, isPast, isFuture } from "date-fns";
import { toast } from "sonner";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// Enhanced mock data for assignments with more detailed information
const assignments = [
  { 
    id: 1, 
    title: "Assignment 1: Introduction to Variables", 
    course: "CS101", 
    department: "Computer Science",
    year: "1st Year",
    dueDate: new Date("2025-06-15"),
    publishDate: new Date("2025-05-01"),
    published: true,
    submitted: 42,
    totalStudents: 45,
    gradedCount: 42,
    averageGrade: 85,
    autoGrade: true,
    status: "Graded",
    maxGrade: 100,
    description: "In this assignment, students will learn about variable types and their uses in programming."
  },
  { 
    id: 2, 
    title: "Assignment 2: Loops and Conditionals", 
    course: "CS101", 
    department: "Computer Science",
    year: "1st Year",
    dueDate: new Date("2025-07-01"),
    publishDate: new Date("2025-05-15"),
    published: true,
    submitted: 40,
    totalStudents: 45,
    gradedCount: 35,
    averageGrade: 78,
    autoGrade: true,
    status: "Grading in Progress",
    maxGrade: 100,
    description: "This assignment covers loops and conditional statements in programming."
  },
  { 
    id: 3, 
    title: "Midterm Exam: Fundamentals", 
    course: "CS101", 
    department: "Computer Science",
    year: "1st Year",
    dueDate: new Date("2025-07-15"),
    publishDate: new Date("2025-06-01"),
    published: true,
    submitted: 45,
    totalStudents: 45,
    gradedCount: 40,
    averageGrade: 72,
    autoGrade: false,
    status: "Grading in Progress",
    maxGrade: 100,
    description: "A comprehensive exam covering all fundamental concepts taught in the course so far."
  },
  { 
    id: 4, 
    title: "Assignment 3: Object-Oriented Programming", 
    course: "CS201", 
    department: "Computer Science",
    year: "2nd Year",
    dueDate: new Date("2025-08-05"),
    publishDate: new Date("2025-07-01"),
    published: true,
    submitted: 0,
    totalStudents: 38,
    gradedCount: 0,
    averageGrade: null,
    autoGrade: true,
    status: "Open",
    maxGrade: 100,
    description: "An introduction to object-oriented programming concepts and implementation."
  },
  { 
    id: 5, 
    title: "Final Project: Building a Simple App", 
    course: "CS201",
    department: "Computer Science",
    year: "2nd Year", 
    dueDate: new Date("2025-09-10"),
    publishDate: new Date("2025-07-15"),
    published: false,
    submitted: 0,
    totalStudents: 38,
    gradedCount: 0,
    averageGrade: null,
    autoGrade: false,
    status: "Draft",
    maxGrade: 100,
    description: "Students will build a complete application demonstrating all concepts learned during the course."
  },
  { 
    id: 6, 
    title: "Database Design Assignment", 
    course: "IS301", 
    department: "Information Systems",
    year: "3rd Year",
    dueDate: new Date("2025-06-20"),
    publishDate: new Date("2025-05-10"),
    published: true,
    submitted: 25,
    totalStudents: 30,
    gradedCount: 0,
    averageGrade: null,
    autoGrade: false,
    status: "Closed",
    maxGrade: 100,
    description: "Students will design a comprehensive database system for a given business case."
  },
  { 
    id: 7, 
    title: "Ethics in Computing", 
    course: "CS401",
    department: "Computer Science", 
    year: "4th Year",
    dueDate: new Date("2025-06-01"),
    publishDate: new Date("2025-05-01"),
    published: true,
    submitted: 22,
    totalStudents: 25,
    gradedCount: 22,
    averageGrade: 90,
    autoGrade: false,
    status: "Graded",
    maxGrade: 100,
    description: "A research assignment on ethical considerations in modern computing."
  },
];

export const AssignmentManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<number | null>(null);
  const [assignmentsData, setAssignmentsData] = useState(assignments);
  
  // Filtered assignments based on search term and filters
  const filteredAssignments = assignmentsData.filter(assignment => {
    const matchesSearch = 
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      assignment.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCourse = courseFilter === "all" || assignment.course === courseFilter;
    const matchesYear = yearFilter === "all" || assignment.year === yearFilter;
    const matchesStatus = statusFilter === "all" || assignment.status === statusFilter;
    
    return matchesSearch && matchesCourse && matchesYear && matchesStatus;
  });

  const handleViewAssignment = (id: number) => {
    navigate(`/professor/assignments/${id}`);
  };

  const handleViewSubmissions = (id: number) => {
    navigate(`/professor/assignments/${id}/submissions`);
  };

  const handleEditAssignment = (id: number) => {
    // Check if deadline has passed
    const assignment = assignmentsData.find(a => a.id === id);
    if (assignment && isPast(assignment.dueDate)) {
      toast.error("Cannot edit assignment after deadline has passed");
      return;
    }
    
    navigate(`/professor/assignments/edit/${id}`);
  };

  const handleCloseAssignment = () => {
    if (selectedAssignmentId) {
      setAssignmentsData(assignmentsData.map(assignment => 
        assignment.id === selectedAssignmentId 
          ? { ...assignment, status: "Closed" } 
          : assignment
      ));
      
      toast.success("Assignment has been closed. No more submissions will be accepted.");
      setCloseDialogOpen(false);
      setSelectedAssignmentId(null);
    }
  };

  const handleDeleteAssignment = () => {
    if (selectedAssignmentId) {
      const assignment = assignmentsData.find(a => a.id === selectedAssignmentId);
      
      // Check if students have already submitted
      if (assignment && assignment.submitted > 0) {
        toast.error("Cannot delete assignment because students have already submitted work");
        setDeleteDialogOpen(false);
        setSelectedAssignmentId(null);
        return;
      }
      
      setAssignmentsData(assignmentsData.filter(a => a.id !== selectedAssignmentId));
      toast.success("Assignment deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedAssignmentId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "Open":
        return <Badge className="bg-blue-500 text-white">Open</Badge>;
      case "Closed":
        return <Badge className="bg-orange-500 text-white">Closed</Badge>;
      case "Grading in Progress":
        return <Badge className="bg-amber-500 text-white">Grading in Progress</Badge>;
      case "Graded":
        return <Badge className="bg-green-500 text-white">Graded</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="assignments">
        <TabsList className="mb-4">
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="grading">Grading</TabsTrigger>
        </TabsList>
        
        <TabsContent value="assignments">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search assignments..."
                  className="pl-10 w-full sm:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={courseFilter} onValueChange={setCourseFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Courses</SelectItem>
                    <SelectItem value="CS101">CS101</SelectItem>
                    <SelectItem value="CS201">CS201</SelectItem>
                    <SelectItem value="IS301">IS301</SelectItem>
                    <SelectItem value="CS401">CS401</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={yearFilter} onValueChange={setYearFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    <SelectItem value="1st Year">1st Year</SelectItem>
                    <SelectItem value="2nd Year">2nd Year</SelectItem>
                    <SelectItem value="3rd Year">3rd Year</SelectItem>
                    <SelectItem value="4th Year">4th Year</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                    <SelectItem value="Grading in Progress">Grading in Progress</SelectItem>
                    <SelectItem value="Graded">Graded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={() => navigate("/professor/assignments/create")}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Create Assignment
            </Button>
          </div>
          
          <Card className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Assignment</TableHead>
                    <TableHead>Year & Department</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Submissions</TableHead>
                    <TableHead>Average Grade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssignments.length > 0 ? (
                    filteredAssignments.map((assignment) => (
                      <TableRow 
                        key={assignment.id}
                        className={cn(
                          "cursor-pointer hover:bg-muted/50",
                          isPast(assignment.dueDate) && assignment.status === "Open" && "bg-amber-50"
                        )}
                        onClick={() => handleViewAssignment(assignment.id)}
                      >
                        <TableCell className="font-medium">
                          {assignment.title}
                          <div className="text-xs text-muted-foreground mt-1">
                            {assignment.course}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>{assignment.year}</div>
                          <div className="text-xs text-muted-foreground">{assignment.department}</div>
                        </TableCell>
                        <TableCell>
                          <div>{format(assignment.dueDate, "MMM d, yyyy")}</div>
                          {isPast(assignment.dueDate) && assignment.status === "Open" && (
                            <div className="text-xs text-amber-600 font-medium mt-1">Deadline passed</div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs">{assignment.submitted}/{assignment.totalStudents}</span>
                              <span className="text-xs text-muted-foreground">
                                {Math.round((assignment.submitted / assignment.totalStudents) * 100)}%
                              </span>
                            </div>
                            <Progress value={(assignment.submitted / assignment.totalStudents) * 100} className="h-1" />
                          </div>
                        </TableCell>
                        <TableCell>
                          {assignment.averageGrade !== null ? (
                            <span className="font-medium">{assignment.averageGrade}%</span>
                          ) : (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(assignment.status)}
                        </TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewAssignment(assignment.id)}>
                                <Eye className="mr-2 h-4 w-4" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleViewSubmissions(assignment.id)}>
                                <FileCheck className="mr-2 h-4 w-4" /> View Submissions
                              </DropdownMenuItem>
                              
                              <DropdownMenuItem 
                                onClick={() => handleEditAssignment(assignment.id)}
                                disabled={isPast(assignment.dueDate)}
                                className={isPast(assignment.dueDate) ? "opacity-50 cursor-not-allowed" : ""}
                              >
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              
                              {assignment.status === "Open" && (
                                <DropdownMenuItem 
                                  onClick={() => {
                                    setSelectedAssignmentId(assignment.id);
                                    setCloseDialogOpen(true);
                                  }}
                                >
                                  <XCircle className="mr-2 h-4 w-4" /> Close Assignment
                                </DropdownMenuItem>
                              )}
                              
                              <DropdownMenuSeparator />
                              
                              <DropdownMenuItem 
                                className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
                                disabled={assignment.submitted > 0}
                                onClick={() => {
                                  setSelectedAssignmentId(assignment.id);
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                        No assignments match your search criteria
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="grading">
          <Card className="border rounded-lg overflow-hidden mb-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Assignment</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Grading Progress</TableHead>
                    <TableHead>Average Score</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignmentsData
                    .filter(item => item.submitted > 0)
                    .map((item) => (
                      <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleViewAssignment(item.id)}>
                        <TableCell className="font-medium">{item.title}</TableCell>
                        <TableCell>{item.course}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs">{item.gradedCount}/{item.submitted}</span>
                              <span className="text-xs text-muted-foreground">
                                {item.submitted > 0 ? Math.round((item.gradedCount / item.submitted) * 100) : 0}%
                              </span>
                            </div>
                            <Progress 
                              value={item.submitted > 0 ? (item.gradedCount / item.submitted) * 100 : 0} 
                              className="h-1" 
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          {item.averageGrade !== null ? (
                            <span className="font-medium">{item.averageGrade}%</span>
                          ) : (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleViewSubmissions(item.id)}>
                              <FileCheck className="mr-2 h-4 w-4" />
                              Grade
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleViewAssignment(item.id)}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </Card>
          
          <div className="bg-muted/40 p-4 rounded-lg">
            <h3 className="text-sm font-semibold mb-2 flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Auto-Grading Status
            </h3>
            <p className="text-sm text-muted-foreground mb-2">
              AI auto-grading is enabled for applicable assignments. The system automatically grades objective questions and provides feedback.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div className="bg-background p-3 rounded-lg border">
                <div className="text-xs text-muted-foreground">Processing</div>
                <div className="text-xl font-bold">0</div>
              </div>
              <div className="bg-background p-3 rounded-lg border">
                <div className="text-xs text-muted-foreground">Completed Today</div>
                <div className="text-xl font-bold">42</div>
              </div>
              <div className="bg-background p-3 rounded-lg border">
                <div className="text-xs text-muted-foreground">Accuracy Rate</div>
                <div className="text-xl font-bold">94%</div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Delete Assignment Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Assignment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this assignment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="outline" onClick={handleDeleteAssignment} className="bg-red-500 hover:bg-red-600 text-white">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Close Assignment Confirmation Dialog */}
      <Dialog open={closeDialogOpen} onOpenChange={setCloseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Close Assignment</DialogTitle>
            <DialogDescription>
              Are you sure you want to close this assignment? Students will no longer be able to submit their work.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCloseDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCloseAssignment}>
              Close Assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
