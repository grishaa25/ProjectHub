
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageTransition from "@/components/layout/PageTransition";
import { Navbar } from "@/components/layout/Navbar";
import { StudentAssignmentDetail } from "@/components/students/StudentAssignmentDetail";
import { Button } from "@/components/ui-custom/Button";
import { ArrowLeft, FileText, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const StudentAssignmentDetailPage = () => {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const navigate = useNavigate();
  const [assignmentTitle, setAssignmentTitle] = useState("Loading...");
  const [unreadNotifications, setUnreadNotifications] = useState(1);
  
  // In a real app, we'd fetch the assignment details here
  useEffect(() => {
    // Mock data - in a real app this would be a fetch call
    setAssignmentTitle("Assignment " + assignmentId + ": Introduction to Variables");
    
    // Simulate checking for notifications
    setUnreadNotifications(Math.floor(Math.random() * 3)); // 0-2 notifications
  }, [assignmentId]);
  
  return (
    <PageTransition>
      <Navbar />
      <main className="pt-24 pb-16 min-h-screen bg-gradient-to-br from-secondary/5 to-primary/5">
        <div className="container max-w-5xl">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <Button 
              variant="outline" 
              onClick={() => navigate("/student/assignments")}
              className="mb-4 sm:mb-0"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Assignments
            </Button>
            
            <div className="flex gap-2">
              <Button variant="outline" className="relative">
                <FileText className="mr-2 h-4 w-4" />
                Download Materials
              </Button>
              <Button variant="outline" className="relative">
                <Bell className="mr-2 h-4 w-4" />
                Notifications
                {unreadNotifications > 0 && (
                  <Badge className="ml-2 bg-red-500 text-white">
                    {unreadNotifications}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col mb-6">
            <h1 className="text-3xl font-bold tracking-tight mb-2">{assignmentTitle}</h1>
            <p className="text-muted-foreground">
              View assignment details and submit your work.
            </p>
          </div>
          
          <StudentAssignmentDetail assignmentId={assignmentId} />
        </div>
      </main>
    </PageTransition>
  );
};

export default StudentAssignmentDetailPage;
