import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui-custom/Button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Download, 
  FileDown, 
  Check, 
  X, 
  Clock, 
  Info,
  Search,
  CheckCheck,
  FileUp,
  Filter,
  AlertCircle
} from "lucide-react";
import { format, isPast } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface SubmissionManagementProps {
  assignmentId?: string;
}

// Enhanced mock data for student submissions
const mockSubmissions = [
  {
    id: 1,
    studentName: "John Smith",
    studentId: "CS2023001",
    year: "2nd Year",
    department: "Computer Science",
    submissionDate: new Date("2025-10-15T14:30:00"),
    fileName: "john_smith_assignment1.pdf",
    fileSize: "1.2 MB",
    status: "Graded",
    grade: 85,
    maxGrade: 100,
    feedback: "Good work overall, but needs improvement in section 3.",
    lateSubmission: false,
    finalGradeStatus: "Finalized"
  },
  {
    id: 2,
    studentName: "Lisa Johnson",
    studentId: "CS2023002",
    year: "2nd Year",
    department: "Computer Science",
    submissionDate: new Date("2025-10-14T09:15:00"),
    fileName: "lisa_assignment1.pdf",
    fileSize: "987 KB",
    status: "Graded",
    grade: 92,
    maxGrade: 100,
    feedback: "Excellent work! Very thorough analysis.",
    lateSubmission: false,
    finalGradeStatus: "Finalized"
  },
  {
    id: 3,
    studentName: "Ahmed Hassan",
    studentId: "CS2023003",
    year: "2nd Year",
    department: "Computer Science",
    submissionDate: new Date("2025-10-16T23:45:00"),
    fileName: "ahmed_assignment1.zip",
    fileSize: "2.1 MB",
    status: "Pending",
    grade: null,
    maxGrade: 100,
    feedback: "",
    lateSubmission: true,
    finalGradeStatus: "Not Finalized"
  },
  {
    id: 4,
    studentName: "Maria Garcia",
    studentId: "CS2023004",
    year: "2nd Year",
    department: "Computer Science",
    submissionDate: new Date("2025-10-15T18:20:00"),
    fileName: "maria_garcia_hw1.docx",
    fileSize: "845 KB",
    status: "Pending",
    grade: null,
    maxGrade: 100,
    feedback: "",
    lateSubmission: false,
    finalGradeStatus: "Not Finalized"
  },
  {
    id: 5,
    studentName: "James Wilson",
    studentId: "CS2023005",
    year: "2nd Year",
    department: "Computer Science",
    submissionDate: new Date("2025-10-10T11:05:00"),
    fileName: "james_wilson_submission.pdf",
    fileSize: "1.5 MB",
    status: "Graded",
    grade: 78,
    maxGrade: 100,
    feedback: "Good effort, but missing several key components from the requirements.",
    lateSubmission: false,
    finalGradeStatus: "Not Finalized"
  },
  {
    id: 6,
    studentName: "Sarah Johnson",
    studentId: "CS2023006",
    year: "2nd Year",
    department: "Computer Science",
    submissionDate: new Date("2025-10-17T10:25:00"),
    fileName: "sarah_johnson_assignment.pdf",
    fileSize: "1.8 MB",
    status: "Pending",
    grade: null,
    maxGrade: 100,
    feedback: "",
    lateSubmission: true,
    finalGradeStatus: "Not Finalized"
  },
  {
    id: 7,
    studentName: "Rebecca Johnson",
    studentId: "CS2023007",
    year: "2nd Year",
    department: "Computer Science",
    submissionDate: new Date("2025-10-11T16:42:00"),
    fileName: "rebecca_johnson_v2.pdf",
    fileSize: "1.3 MB",
    status: "Graded",
    grade: 88,
    maxGrade: 100,
    feedback: "Well structured and thoughtful analysis.",
    lateSubmission: false,
    finalGradeStatus: "Not Finalized"
  },
];

// Mock assignment data
const mockAssignment = {
  id: "1",
  title: "Assignment 1: Introduction to Variables",
  dueDate: new Date("2025-10-15T23:59:59"),
  maxGrade: 100
};

export const SubmissionManagement: React.FC<SubmissionManagementProps> = ({ assignmentId }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [submissions, setSubmissions] = useState(mockSubmissions);
  const [selectedSubmissions, setSelectedSubmissions] = useState<number[]>([]);
  const [bulkGradeDialog, setBulkGradeDialog] = useState(false);
  const [bulkGrade, setBulkGrade] = useState<number>(0);
  const [bulkFeedback, setBulkFeedback] = useState<string>("");
  const [finalizeDialog, setFinalizeDialog] = useState(false);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [assignment] = useState(mockAssignment);
  
  const filteredSubmissions = submissions.filter(sub => {
    // Apply search filter
    const matchesSearch = 
      sub.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply status filter
    let matchesStatus = true;
    if (statusFilter === "graded") {
      matchesStatus = sub.status === "Graded";
    } else if (statusFilter === "pending") {
      matchesStatus = sub.status === "Pending";
    } else if (statusFilter === "late") {
      matchesStatus = sub.lateSubmission;
    }

    // Apply department filter
    const matchesDepartment = departmentFilter === "all" || sub.department === departmentFilter;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });
  
  const handleSelectSubmission = (submissionId: number) => {
    if (selectedSubmissions.includes(submissionId)) {
      setSelectedSubmissions(selectedSubmissions.filter(id => id !== submissionId));
    } else {
      setSelectedSubmissions([...selectedSubmissions, submissionId]);
    }
  };
  
  const handleSelectAll = () => {
    if (selectedSubmissions.length === filteredSubmissions.length) {
      setSelectedSubmissions([]);
    } else {
      setSelectedSubmissions(filteredSubmissions.map(sub => sub.id));
    }
  };
  
  const handleGradeChange = (submissionId: number, grade: number) => {
    const submission = submissions.find(s => s.id === submissionId);
    if (!submission) return;
    
    // Validate grade against maxGrade
    if (grade < 0) {
      grade = 0;
    } else if (grade > submission.maxGrade) {
      toast({
        title: "Invalid Grade",
        description: `Grade cannot exceed maximum of ${submission.maxGrade}`,
        variant: "destructive",
      });
      grade = submission.maxGrade;
    }
    
    // Check if submission is finalized
    if (submission.finalGradeStatus === "Finalized") {
      toast({
        title: "Cannot Modify Grade",
        description: "This submission has been finalized and cannot be modified.",
        variant: "destructive",
      });
      return;
    }
    
    // Update the grade
    setSubmissions(submissions.map(sub => 
      sub.id === submissionId 
        ? { ...sub, grade, status: grade !== null ? "Graded" : "Pending" } 
        : sub
    ));
  };
  
  const handleFeedbackChange = (submissionId: number, feedback: string) => {
    const submission = submissions.find(s => s.id === submissionId);
    if (!submission) return;
    
    // Check if submission is finalized
    if (submission.finalGradeStatus === "Finalized") {
      toast({
        title: "Cannot Modify Feedback",
        description: "This submission has been finalized and cannot be modified.",
        variant: "destructive",
      });
      return;
    }
    
    // Update the feedback
    setSubmissions(submissions.map(sub => 
      sub.id === submissionId ? { ...sub, feedback } : sub
    ));
  };
  
  const handleBulkGrade = () => {
    if (bulkGrade < 0 || bulkGrade > assignment.maxGrade) {
      toast({
        title: "Invalid Grade",
        description: `Grade must be between 0 and ${assignment.maxGrade}`,
        variant: "destructive",
      });
      return;
    }
    
    // Filter out finalized submissions
    const finalizedIds = submissions
      .filter(sub => selectedSubmissions.includes(sub.id) && sub.finalGradeStatus === "Finalized")
      .map(sub => sub.id);
    
    if (finalizedIds.length > 0) {
      toast({
        title: "Some Grades Cannot Be Modified",
        description: `${finalizedIds.length} submission(s) have been finalized and will not be updated.`,
        variant: "default",
      });
    }
    
    // Only update non-finalized submissions
    setSubmissions(submissions.map(sub => 
      selectedSubmissions.includes(sub.id) && sub.finalGradeStatus !== "Finalized"
        ? { ...sub, grade: bulkGrade, feedback: bulkFeedback || sub.feedback, status: "Graded" } 
        : sub
    ));
    
    setBulkGradeDialog(false);
    setBulkGrade(0);
    setBulkFeedback("");
    setSelectedSubmissions([]);
    
    const updatedCount = selectedSubmissions.length - finalizedIds.length;
    toast({
      title: "Grades Applied",
      description: `Applied grade of ${bulkGrade} to ${updatedCount} submissions`,
    });
  };
  
  const handleFinalizeGrade = () => {
    if (selectedSubmissionId) {
      const submission = submissions.find(s => s.id === selectedSubmissionId);
      if (!submission) return;
      
      // Check if the submission has a grade
      if (submission.grade === null) {
        toast({
          title: "Cannot Finalize",
          description: "You must assign a grade before finalizing.",
          variant: "destructive",
        });
        return;
      }
      
      // Update the submission's finalized status
      setSubmissions(submissions.map(sub => 
        sub.id === selectedSubmissionId 
          ? { ...sub, finalGradeStatus: "Finalized" } 
          : sub
      ));
      
      toast({
        title: "Grade Finalized",
        description: "The grade has been finalized and can no longer be modified.",
      });
      
      setFinalizeDialog(false);
      setSelectedSubmissionId(null);
    }
  };
  
  const downloadAllSubmissions = () => {
    toast({
      title: "Downloading Submissions",
      description: "All submissions are being downloaded as a ZIP file.",
    });
  };

  const downloadSelectedSubmissions = () => {
    if (selectedSubmissions.length === 0) {
      toast({
        title: "No Submissions Selected",
        description: "Please select at least one submission to download.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Downloading Selected Submissions",
      description: `Downloading ${selectedSubmissions.length} submissions as a ZIP file.`,
    });
  };
  
  const getStatusBadge = (status: string, isLate: boolean) => {
    if (isLate && status === "Pending") {
      return (
        <Badge className="bg-amber-500 text-white">
          <Clock className="mr-1 h-3 w-3" /> Late Submission
        </Badge>
      );
    }
    
    switch (status) {
      case "Graded":
        return (
          <Badge className="bg-green-500 text-white">
            <Check className="mr-1 h-3 w-3" /> Graded
          </Badge>
        );
      case "Pending":
        return (
          <Badge className="bg-blue-500 text-white">
            <Clock className="mr-1 h-3 w-3" /> Pending
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                className="pl-10 w-full sm:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="graded">Graded</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="late">Late</SelectItem>
              </SelectContent>
            </Select>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Computer Science">Computer Science</SelectItem>
                <SelectItem value="Information Systems">Information Systems</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              onClick={downloadAllSubmissions}
              disabled={submissions.length === 0}
            >
              <FileDown className="mr-2 h-4 w-4" />
              Download All
            </Button>
            
            <Button 
              variant="outline"
              onClick={downloadSelectedSubmissions}
              disabled={selectedSubmissions.length === 0}
            >
              <FileDown className="mr-2 h-4 w-4" />
              Download Selected
            </Button>
            
            <Button 
              onClick={() => setBulkGradeDialog(true)}
              disabled={selectedSubmissions.length === 0}
            >
              <CheckCheck className="mr-2 h-4 w-4" />
              Grade Selected
            </Button>
          </div>
        </div>
        
        <div className="bg-muted/30 p-4 rounded-lg mb-6">
          <div className="flex items-center mb-2">
            <Info className="h-4 w-4 mr-2 text-blue-500" />
            <h3 className="text-sm font-semibold">Assignment Information</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Title:</span>
              <div>{assignment.title}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Due Date:</span>
              <div>{format(assignment.dueDate, "MMM d, yyyy 'at' h:mm a")}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Max Grade:</span>
              <div>{assignment.maxGrade}</div>
            </div>
          </div>
        </div>
        
        <Card className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox 
                      checked={selectedSubmissions.length === filteredSubmissions.length && filteredSubmissions.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Submission Date</TableHead>
                  <TableHead>File</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Feedback</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.length > 0 ? (
                  filteredSubmissions.map((submission) => (
                    <TableRow 
                      key={submission.id} 
                      className={cn(
                        submission.lateSubmission ? "bg-amber-50" : "",
                        submission.finalGradeStatus === "Finalized" ? "bg-green-50/30" : ""
                      )}
                    >
                      <TableCell>
                        <Checkbox 
                          checked={selectedSubmissions.includes(submission.id)}
                          onCheckedChange={() => handleSelectSubmission(submission.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{submission.studentName}</div>
                        <div className="text-sm text-muted-foreground">{submission.studentId}</div>
                        <div className="text-xs text-muted-foreground">{submission.department}, {submission.year}</div>
                      </TableCell>
                      <TableCell>
                        <div className="whitespace-nowrap">
                          {format(submission.submissionDate, "MMM d, yyyy")}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(submission.submissionDate, "h:mm a")}
                        </div>
                        {submission.lateSubmission && isPast(assignment.dueDate) && (
                          <div className="text-xs text-amber-500 font-medium mt-1 flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Late submission
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" className="text-xs">
                          <Download className="mr-1 h-3 w-3" />
                          {submission.fileName}
                          <span className="ml-1 opacity-70">{submission.fileSize}</span>
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {getStatusBadge(submission.status, submission.lateSubmission)}
                          {submission.finalGradeStatus === "Finalized" && (
                            <Badge variant="outline" className="bg-green-50 border-green-100 text-green-700 text-xs">
                              <Check className="mr-1 h-3 w-3" />
                              Finalized
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min={0}
                          max={submission.maxGrade}
                          value={submission.grade || ""}
                          onChange={(e) => handleGradeChange(submission.id, parseInt(e.target.value) || 0)}
                          className={cn(
                            "w-16 h-8 text-sm",
                            submission.finalGradeStatus === "Finalized" && "bg-muted cursor-not-allowed"
                          )}
                          disabled={submission.finalGradeStatus === "Finalized"}
                        />
                        <div className="text-xs text-muted-foreground mt-1">
                          Max: {submission.maxGrade}
                        </div>
                      </TableCell>
                      <TableCell className="min-w-[200px]">
                        <Textarea
                          value={submission.feedback || ""}
                          onChange={(e) => handleFeedbackChange(submission.id, e.target.value)}
                          className={cn(
                            "text-sm min-h-[80px] resize-none",
                            submission.finalGradeStatus === "Finalized" && "bg-muted cursor-not-allowed"
                          )}
                          placeholder="Add feedback..."
                          disabled={submission.finalGradeStatus === "Finalized"}
                        />
                      </TableCell>
                      <TableCell>
                        {submission.finalGradeStatus !== "Finalized" && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="w-full"
                            onClick={() => {
                              setSelectedSubmissionId(submission.id);
                              setFinalizeDialog(true);
                            }}
                            disabled={submission.grade === null}
                          >
                            <Check className="mr-2 h-3 w-3" />
                            Finalize
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                      No submissions match your search
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
        
        {submissions.length === 0 && (
          <div className="text-center py-8">
            <div className="flex justify-center mb-4">
              <FileUp className="h-12 w-12 text-muted-foreground opacity-50" />
            </div>
            <h3 className="text-lg font-medium">No submissions yet</h3>
            <p className="text-muted-foreground mt-1">
              Students have not submitted any work for this assignment.
            </p>
          </div>
        )}

        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={() => navigate(`/professor/assignments/${assignmentId}`)}>
            <Check className="mr-2 h-4 w-4" />
            Back to Assignment Details
          </Button>
        </div>
      </div>
      
      {/* Bulk Grade Dialog */}
      <Dialog open={bulkGradeDialog} onOpenChange={setBulkGradeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply Grade to Multiple Submissions</DialogTitle>
            <DialogDescription>
              This will apply the same grade and feedback to {selectedSubmissions.length} selected submissions.
              {submissions.filter(sub => 
                selectedSubmissions.includes(sub.id) && 
                sub.finalGradeStatus === "Finalized"
              ).length > 0 && (
                <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-sm">
                  <AlertCircle className="inline-block mr-1 h-4 w-4" />
                  {submissions.filter(sub => 
                    selectedSubmissions.includes(sub.id) && 
                    sub.finalGradeStatus === "Finalized"
                  ).length} submission(s) have been finalized and will not be updated.
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="bulk-grade" className="text-sm font-medium">
                Grade
              </label>
              <Input
                id="bulk-grade"
                type="number"
                min={0}
                max={assignment.maxGrade}
                value={bulkGrade}
                onChange={(e) => setBulkGrade(parseInt(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground">
                Enter a grade between 0 and {assignment.maxGrade}
              </p>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="bulk-feedback" className="text-sm font-medium">
                Feedback (Optional)
              </label>
              <Textarea
                id="bulk-feedback"
                value={bulkFeedback}
                onChange={(e) => setBulkFeedback(e.target.value)}
                placeholder="Add feedback for all selected submissions..."
                className="min-h-[100px]"
              />
              <p className="text-xs text-muted-foreground">
                Leave blank to keep existing individual feedback
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkGradeDialog(false)}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleBulkGrade}>
              <Check className="mr-2 h-4 w-4" />
              Apply Grades
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Finalize Grade Dialog */}
      <Dialog open={finalizeDialog} onOpenChange={setFinalizeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Finalize Grade</DialogTitle>
            <DialogDescription>
              Are you sure you want to finalize this grade? Once finalized, the grade and feedback cannot be modified.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="p-3 bg-muted rounded-md">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Student:</span>
                <span className="text-sm">
                  {submissions.find(s => s.id === selectedSubmissionId)?.studentName}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Grade:</span>
                <span className="text-sm">
                  {submissions.find(s => s.id === selectedSubmissionId)?.grade} / {assignment.maxGrade}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Feedback:</span>
                <span className="text-sm max-w-[300px] truncate">
                  {submissions.find(s => s.id === selectedSubmissionId)?.feedback || "No feedback provided"}
                </span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setFinalizeDialog(false)}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleFinalizeGrade}>
              <Check className="mr-2 h-4 w-4" />
              Finalize Grade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
