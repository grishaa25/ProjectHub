
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui-custom/Button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format, isAfter, isBefore } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { 
  Calendar, 
  CheckCheck, 
  Clock, 
  Download, 
  FileText, 
  FileUp, 
  AlertCircle, 
  Check,
  Bell,
  BookOpen,
  File
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// Mock assignment data for a student's view
const getMockAssignment = (assignmentId: string) => {
  return {
    id: assignmentId,
    title: `Assignment ${assignmentId}: Introduction to Variables`,
    description: "In this assignment, you will learn about variables, their types, and how to use them effectively in programming. Please submit a PDF or Word document with your solutions to the exercises.",
    course: "CS101: Programming Fundamentals",
    dueDate: new Date("2023-10-25T23:59:59"),
    maxGrade: 100,
    status: "Pending", // Pending, Submitted, Graded
    submittedOn: null,
    grade: null,
    feedback: "",
    files: [
      { name: "assignment_instructions.pdf", size: "245 KB" },
      { name: "starter_code.zip", size: "120 KB" }
    ],
    submissionFile: null,
    supportingMaterials: [
      { name: "lecture_notes.pdf", size: "1.2 MB" },
      { name: "reference_guide.pdf", size: "450 KB" }
    ],
    rubric: [
      { criteria: "Understanding of variables", points: 30 },
      { criteria: "Proper usage of data types", points: 30 },
      { criteria: "Code quality and documentation", points: 20 },
      { criteria: "Additional exercises", points: 20 }
    ],
    notifications: [
      {
        id: 1, 
        type: "reminder", 
        message: "Assignment due in 3 days", 
        date: new Date("2023-10-22T09:00:00"),
        read: false
      },
      { 
        id: 2, 
        type: "update", 
        message: "Assignment deadline extended by 2 days", 
        date: new Date("2023-10-18T15:30:00"),
        read: true
      }
    ]
  };
};

interface StudentAssignmentDetailProps {
  assignmentId?: string;
}

export const StudentAssignmentDetail: React.FC<StudentAssignmentDetailProps> = ({ assignmentId = "1" }) => {
  const { toast } = useToast();
  const [assignment, setAssignment] = useState(getMockAssignment(assignmentId));
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [submittingFile, setSubmittingFile] = useState<File | null>(null);
  const [submitConfirmDialog, setSubmitConfirmDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  
  const today = new Date();
  const isPastDue = isBefore(assignment.dueDate, today);
  const isNearDue = !isPastDue && isAfter(assignment.dueDate, today) && 
                     ((assignment.dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) < 2;
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 10MB",
          variant: "destructive"
        });
        return;
      }
      
      setSubmittingFile(file);
    }
  };
  
  const handleSubmitAssignment = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setAssignment({
        ...assignment,
        status: "Submitted",
        submittedOn: new Date(),
        submissionFile: submittingFile
      });
      
      setShowSubmitDialog(false);
      setSubmitConfirmDialog(false);
      setIsSubmitting(false);
      
      toast({
        title: "Assignment Submitted",
        description: "Your work has been submitted successfully.",
      });
    }, 1500);
  };

  const handleMarkAllRead = () => {
    setAssignment({
      ...assignment,
      notifications: assignment.notifications.map(notif => ({...notif, read: true}))
    });
    setShowNotificationDialog(false);
    toast({
      title: "Notifications marked as read",
      description: "All notifications have been marked as read.",
    });
  };
  
  const getStatusBadge = () => {
    if (assignment.status === "Pending") {
      if (isPastDue) {
        return (
          <Badge className="bg-red-500 text-white">
            <AlertCircle className="mr-1 h-3 w-3" />
            Overdue
          </Badge>
        );
      } else if (isNearDue) {
        return (
          <Badge className="bg-amber-500 text-white">
            <Clock className="mr-1 h-3 w-3" />
            Due Soon
          </Badge>
        );
      } else {
        return (
          <Badge className="bg-blue-500 text-white">
            <Calendar className="mr-1 h-3 w-3" />
            Upcoming
          </Badge>
        );
      }
    } else if (assignment.status === "Submitted") {
      return (
        <Badge className="bg-purple-500 text-white">
          <FileText className="mr-1 h-3 w-3" />
          Submitted
        </Badge>
      );
    } else if (assignment.status === "Graded") {
      return (
        <Badge className="bg-green-500 text-white">
          <CheckCheck className="mr-1 h-3 w-3" />
          Graded
        </Badge>
      );
    }
    
    return <Badge>{assignment.status}</Badge>;
  };

  const unreadNotifications = assignment.notifications.filter(n => !n.read).length;

  return (
    <>
      <div className="space-y-6">
        {/* Assignment Details Card */}
        <Card className="border-primary/10 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{assignment.title}</CardTitle>
                <CardDescription>{assignment.course}</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusBadge()}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="relative" 
                  onClick={() => setShowNotificationDialog(true)}
                >
                  <Bell className="h-4 w-4" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white">
                      {unreadNotifications}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>

          <div className="px-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="rubric">Rubric</TabsTrigger>
              </TabsList>
          
              <CardContent className="space-y-4 pt-4">
                <TabsContent value="details" className="space-y-4 mt-0">
                  <div className="prose prose-sm max-w-none">
                    <p>{assignment.description}</p>
                  </div>
                  
                  {/* Supporting Files */}
                  <div className="border rounded-md p-3">
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <Download className="mr-2 h-4 w-4" />
                      Supporting Materials
                    </h4>
                    <ul className="text-sm space-y-2">
                      {assignment.files.map((file, index) => (
                        <li key={index} className="flex items-center justify-between">
                          <div className="flex items-center text-primary hover:underline cursor-pointer">
                            <FileText className="mr-2 h-4 w-4" />
                            {file.name}
                          </div>
                          <span className="text-xs text-muted-foreground">{file.size}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Submission Status */}
                  {assignment.status === "Submitted" && (
                    <Alert className="bg-purple-50 border-purple-200">
                      <FileUp className="h-4 w-4 text-purple-500" />
                      <AlertTitle>Submitted</AlertTitle>
                      <AlertDescription>
                        You submitted your work on {assignment.submittedOn && format(assignment.submittedOn, "PPP 'at' h:mm a")}
                        {assignment.submissionFile && (
                          <div className="mt-2 text-sm flex items-center">
                            <FileText className="mr-1 h-3 w-3 text-muted-foreground" />
                            {assignment.submissionFile.name} 
                            <span className="text-xs text-muted-foreground ml-1">
                              ({(assignment.submissionFile.size / 1024).toFixed(0)} KB)
                            </span>
                          </div>
                        )}
                        {!isPastDue && (
                          <div className="mt-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setShowSubmitDialog(true)}
                            >
                              <FileUp className="mr-1 h-3 w-3" />
                              Update Submission
                            </Button>
                          </div>
                        )}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {/* Graded Feedback */}
                  {assignment.status === "Graded" && (
                    <Alert className="bg-green-50 border-green-200">
                      <CheckCheck className="h-4 w-4 text-green-500" />
                      <AlertTitle>Graded</AlertTitle>
                      <AlertDescription>
                        <div className="font-medium">
                          Grade: {assignment.grade}/{assignment.maxGrade} 
                          ({Math.round((assignment.grade! / assignment.maxGrade) * 100)}%)
                        </div>
                        <div className="mt-2">{assignment.feedback}</div>
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {/* Warning for late submission */}
                  {assignment.status === "Pending" && isPastDue && (
                    <Alert className="bg-red-50 border-red-200">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <AlertTitle>Assignment Overdue</AlertTitle>
                      <AlertDescription>
                        This assignment was due on {format(assignment.dueDate, "PPP")}. 
                        {assignment.submittedOn && "Your submission will be marked as late."}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {/* Warning for approaching deadline */}
                  {assignment.status === "Pending" && isNearDue && (
                    <Alert className="bg-amber-50 border-amber-200">
                      <Clock className="h-4 w-4 text-amber-500" />
                      <AlertTitle>Deadline Approaching</AlertTitle>
                      <AlertDescription>
                        This assignment is due on {format(assignment.dueDate, "PPP 'at' h:mm a")}.
                        Make sure to submit your work before the deadline.
                      </AlertDescription>
                    </Alert>
                  )}
                </TabsContent>

                <TabsContent value="resources" className="mt-0 space-y-4">
                  <h3 className="text-sm font-medium">Additional Resources</h3>
                  <div className="border rounded-md p-3">
                    <ul className="text-sm space-y-2">
                      {assignment.supportingMaterials.map((material, index) => (
                        <li key={index} className="flex items-center justify-between">
                          <div className="flex items-center text-primary hover:underline cursor-pointer">
                            <BookOpen className="mr-2 h-4 w-4" />
                            {material.name}
                          </div>
                          <span className="text-xs text-muted-foreground">{material.size}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="rubric" className="mt-0 space-y-4">
                  <h3 className="text-sm font-medium">Grading Rubric</h3>
                  <div className="border rounded-md p-3">
                    <table className="w-full text-sm">
                      <thead className="text-xs text-muted-foreground">
                        <tr>
                          <th className="text-left">Criteria</th>
                          <th className="text-right">Points</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assignment.rubric.map((item, index) => (
                          <tr key={index} className={cn("border-b", index === assignment.rubric.length - 1 && "border-b-0")}>
                            <td className="py-2">{item.criteria}</td>
                            <td className="py-2 text-right">{item.points}</td>
                          </tr>
                        ))}
                        <tr className="font-medium">
                          <td className="py-2">Total</td>
                          <td className="py-2 text-right">{assignment.rubric.reduce((total, item) => total + item.points, 0)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
          </div>

          <CardFooter className="flex flex-col sm:flex-row justify-between border-t pt-4 gap-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-1 h-4 w-4" />
              Due {format(assignment.dueDate, "PPP 'at' h:mm a")}
            </div>
            {assignment.status === "Pending" && (
              <Button onClick={() => setShowSubmitDialog(true)}>
                <FileUp className="mr-2 h-4 w-4" />
                Submit Assignment
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
      
      {/* Submit Assignment Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Assignment</DialogTitle>
            <DialogDescription>
              Upload your work for {assignment.title}. 
              {isPastDue && " Note: This submission will be marked as late."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <label htmlFor="file-upload" className="text-sm font-medium">
                Upload File
              </label>
              <div className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="flex flex-col items-center gap-2">
                  <FileUp className="h-8 w-8 text-muted-foreground" />
                  <label htmlFor="file-upload" className="text-sm font-medium cursor-pointer">
                    Click to upload
                  </label>
                  <p className="text-xs text-muted-foreground">
                    PDF, DOCX, ZIP (max 10MB)
                  </p>
                </div>
              </div>
              {submittingFile && (
                <div className="mt-2 flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-primary" />
                    {submittingFile.name}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {(submittingFile.size / 1024).toFixed(0)} KB
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => setSubmitConfirmDialog(true)}
              disabled={!submittingFile}
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Confirm Submit Dialog */}
      <Dialog open={submitConfirmDialog} onOpenChange={setSubmitConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Submission</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit this file? 
              {isPastDue ? " This submission will be marked as late." : ""}
              {assignment.status === "Submitted" ? " This will replace your previous submission." : ""}
            </DialogDescription>
          </DialogHeader>
          
          {submittingFile && (
            <div className="py-4">
              <Alert>
                <FileText className="h-4 w-4" />
                <AlertTitle>File to submit</AlertTitle>
                <AlertDescription className="flex justify-between items-center">
                  <span>{submittingFile.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {(submittingFile.size / 1024).toFixed(0)} KB
                  </span>
                </AlertDescription>
              </Alert>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubmitConfirmDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitAssignment}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>Submitting...</>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Confirm Submission
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notifications Dialog */}
      <Dialog open={showNotificationDialog} onOpenChange={setShowNotificationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              Notifications
              <Badge variant="outline" className="ml-2">
                {unreadNotifications} unread
              </Badge>
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-2 max-h-[300px] overflow-y-auto">
            {assignment.notifications.length > 0 ? (
              <div className="space-y-2">
                {assignment.notifications.map(notification => (
                  <div key={notification.id} className={cn(
                    "p-3 rounded-md",
                    notification.read ? "bg-background" : "bg-primary/5"
                  )}>
                    <div className="flex justify-between">
                      <span className="font-medium text-sm">
                        {notification.type === "reminder" && "Reminder"}
                        {notification.type === "update" && "Update"}
                        {notification.type === "grade" && "Grade Posted"}
                      </span>
                      <span className="text-xs text-muted-foreground">{format(notification.date, "MMM d")}</span>
                    </div>
                    <p className="text-sm mt-1">{notification.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground text-sm py-8">No notifications</p>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNotificationDialog(false)}>
              Close
            </Button>
            {unreadNotifications > 0 && (
              <Button onClick={handleMarkAllRead}>
                Mark All Read
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
