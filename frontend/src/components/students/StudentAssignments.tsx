import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, CheckCheck, AlertCircle, Search, Bell, Download, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui-custom/Button";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import AssignmentCard from "./assignment-list/AssignmentCard";
import CompactAssignmentList from "./assignment-list/CompactAssignmentList";

// Import mock data
import { mockAssignments } from "./assignment-list/mockAssignmentData";

interface Assignment {
  id: number;
  title: string;
  course: string;
  department: string;
  dueDate: Date;
  maxGrade: number;
  status: "Submitted" | "Pending" | "Graded";
  submittedOn: Date | null;
  grade: number | null;
  feedback?: string;
  files: string[];
  hasUnreadNotifications: boolean;
  notificationCount: number;
}

export const StudentAssignments = ({ compact = false }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [showNotificationsDialog, setShowNotificationsDialog] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [showJustGradedDialog, setShowJustGradedDialog] = useState(false);
  const today = new Date();
  
  // If compact mode is enabled, render simplified view
  if (compact) {
    return (
      <CompactAssignmentList
        assignments={assignments}
        onViewDetails={(assignmentId) => navigate(`/student/assignments/${assignmentId}`)}
      />
    );
  }
  
  const filteredAssignments = assignments.filter(assignment => 
    (searchTerm === "" || assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) || assignment.course.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (departmentFilter === "all" || assignment.department.toLowerCase() === departmentFilter.toLowerCase())
  );
  
  const upcomingAssignments = filteredAssignments.filter(a => 
    (a.status === "Pending" && a.dueDate > today)
  ).sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  
  const overdueAssignments = filteredAssignments.filter(a => 
    (a.status === "Pending" && a.dueDate < today)
  );
  
  const submittedAssignments = filteredAssignments.filter(a => 
    a.status === "Submitted"
  );
  
  const gradedAssignments = filteredAssignments.filter(a => 
    a.status === "Graded"
  );

  // This would fetch notifications from an API in a real app
  const totalNotifications = assignments.reduce((total, assignment) => total + assignment.notificationCount, 0);
  
  const markNotificationsAsRead = (assignmentId: number) => {
    setAssignments(assignments.map(assignment => 
      assignment.id === assignmentId 
        ? { ...assignment, hasUnreadNotifications: false, notificationCount: 0 } 
        : assignment
    ));
    
    if (selectedAssignment) {
      toast({
        title: "Notifications marked as read",
        description: `Notifications for ${selectedAssignment.title} marked as read.`,
      });
    }
    setShowNotificationsDialog(false);
  };
  
  const viewAssignmentDetails = (assignmentId: number) => {
    // Check if this is a newly graded assignment that the student hasn't seen
    const assignment = assignments.find(a => a.id === assignmentId);
    if (assignment && assignment.status === "Graded" && assignment.hasUnreadNotifications) {
      setSelectedAssignment(assignment);
      setShowJustGradedDialog(true);
    } else {
      navigate(`/student/assignments/${assignmentId}`);
    }
  };

  const viewNotifications = (assignment: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedAssignment(assignment);
    setShowNotificationsDialog(true);
  };

  const downloadAllMaterials = (assignmentId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const assignment = assignments.find(a => a.id === assignmentId);
    if (assignment) {
      toast({
        title: "Downloading materials",
        description: `All materials for ${assignment.title} are being downloaded.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search assignments..."
              className="pl-10 w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="computer science">Computer Science</SelectItem>
              <SelectItem value="electrical engineering">Electrical Engineering</SelectItem>
              <SelectItem value="mechanical engineering">Mechanical Engineering</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" className="relative" onClick={() => toast({
          title: "Calendar synced",
          description: "Assignment deadlines have been synced with your calendar.",
        })}>
          <Calendar className="mr-2 h-4 w-4" />
          Sync with Calendar
        </Button>
      </div>
      
      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Upcoming
            {upcomingAssignments.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                {upcomingAssignments.length}
              </Badge>
            )}
          </TabsTrigger>
          
          <TabsTrigger value="overdue" className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Overdue
            {overdueAssignments.length > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                {overdueAssignments.length}
              </Badge>
            )}
          </TabsTrigger>
          
          <TabsTrigger value="submitted" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Submitted
            {submittedAssignments.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                {submittedAssignments.length}
              </Badge>
            )}
          </TabsTrigger>
          
          <TabsTrigger value="graded" className="flex items-center gap-2">
            <CheckCheck className="h-4 w-4" />
            Graded
            {gradedAssignments.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                {gradedAssignments.length}
              </Badge>
            )}
          </TabsTrigger>
          
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4 mt-6">
          {upcomingAssignments.length > 0 ? (
            upcomingAssignments.map((assignment) => (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                onViewDetails={viewAssignmentDetails}
                onViewNotifications={viewNotifications}
                onDownloadMaterials={downloadAllMaterials}
                today={today}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium">No upcoming assignments</h3>
              <p className="text-muted-foreground mt-2">
                You don't have any pending assignments due soon.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="overdue" className="space-y-4 mt-6">
          {overdueAssignments.length > 0 ? (
            overdueAssignments.map((assignment) => (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                onViewDetails={viewAssignmentDetails}
                onViewNotifications={viewNotifications}
                onDownloadMaterials={downloadAllMaterials}
                today={today}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium">No overdue assignments</h3>
              <p className="text-muted-foreground mt-2">
                You're all caught up!
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="submitted" className="space-y-4 mt-6">
          {submittedAssignments.length > 0 ? (
            submittedAssignments.map((assignment) => (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                onViewDetails={viewAssignmentDetails}
                onViewNotifications={viewNotifications}
                onDownloadMaterials={downloadAllMaterials}
                today={today}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium">No submitted assignments</h3>
              <p className="text-muted-foreground mt-2">
                You haven't submitted any assignments yet.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="graded" className="space-y-4 mt-6">
          {gradedAssignments.length > 0 ? (
            gradedAssignments.map((assignment) => (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                onViewDetails={viewAssignmentDetails}
                onViewNotifications={viewNotifications}
                onDownloadMaterials={downloadAllMaterials}
                today={today}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium">No graded assignments</h3>
              <p className="text-muted-foreground mt-2">
                None of your assignments have been graded yet.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="all" className="space-y-4 mt-6">
          {filteredAssignments.length > 0 ? (
            filteredAssignments.map((assignment) => (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                onViewDetails={viewAssignmentDetails}
                onViewNotifications={viewNotifications}
                onDownloadMaterials={downloadAllMaterials}
                today={today}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium">No assignments found</h3>
              <p className="text-muted-foreground mt-2">
                Try adjusting your filters or search term.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Notifications Dialog */}
      <Dialog open={showNotificationsDialog} onOpenChange={setShowNotificationsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notifications for {selectedAssignment?.title}</DialogTitle>
            <DialogDescription>
              Stay updated with the latest information about this assignment.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-2 my-4">
            {selectedAssignment?.id === 1 && (
              <Alert className="bg-blue-50 border-blue-200">
                <Bell className="h-4 w-4 text-blue-500" />
                <AlertTitle>Reminder</AlertTitle>
                <AlertDescription className="text-sm">
                  This assignment is due in 3 days. Make sure to submit your work on time.
                </AlertDescription>
              </Alert>
            )}
            
            {selectedAssignment?.id === 3 && (
              <>
                <Alert className="bg-green-50 border-green-200">
                  <CheckCheck className="h-4 w-4 text-green-500" />
                  <AlertTitle>Assignment Graded</AlertTitle>
                  <AlertDescription className="text-sm">
                    Your submission has been graded. You received 47/50 points.
                  </AlertDescription>
                </Alert>
                <Alert className="bg-blue-50 border-blue-200">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <AlertTitle>Feedback Available</AlertTitle>
                  <AlertDescription className="text-sm">
                    Professor has left detailed feedback on your submission.
                  </AlertDescription>
                </Alert>
              </>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNotificationsDialog(false)}>
              Close
            </Button>
            <Button onClick={() => markNotificationsAsRead(selectedAssignment?.id)}>
              Mark as Read
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Just Graded Dialog */}
      <Dialog open={showJustGradedDialog} onOpenChange={setShowJustGradedDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-green-600 flex items-center">
              <CheckCheck className="mr-2 h-5 w-5" />
              Assignment Graded!
            </DialogTitle>
            <DialogDescription>
              Your submission for {selectedAssignment?.title} has been graded.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="bg-green-50 border border-green-100 rounded-md p-4">
              <div className="font-medium mb-2">Your Grade:</div>
              <div className="text-3xl font-bold text-green-600">
                {selectedAssignment?.grade}/{selectedAssignment?.maxGrade}
                <span className="text-base ml-2">
                  ({Math.round((selectedAssignment?.grade / selectedAssignment?.maxGrade) * 100)}%)
                </span>
              </div>
              <div className="mt-4 text-sm">{selectedAssignment?.feedback}</div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowJustGradedDialog(false)}>
              Later
            </Button>
            <Button onClick={() => {
              markNotificationsAsRead(selectedAssignment?.id);
              navigate(`/student/assignments/${selectedAssignment?.id}`);
            }}>
              View Details
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
