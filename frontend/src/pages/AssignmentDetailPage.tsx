
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageTransition from "@/components/layout/PageTransition";
import { Navbar } from "@/components/layout/Navbar";
import { AssignmentDetail } from "@/components/professor/AssignmentDetail";
import { Button } from "@/components/ui-custom/Button";
import { ArrowLeft, FileText, UserCheck } from "lucide-react";

const AssignmentDetailPage = () => {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const navigate = useNavigate();
  const [assignmentTitle, setAssignmentTitle] = useState("Loading...");
  
  // In a real app, we'd fetch the assignment details here
  React.useEffect(() => {
    // Mock data - in a real app this would be a fetch call
    if (assignmentId === "1") {
      setAssignmentTitle("Assignment 1: Introduction to Variables");
    } else if (assignmentId === "2") {
      setAssignmentTitle("Assignment 2: Loops and Conditionals");
    } else if (assignmentId === "3") {
      setAssignmentTitle("Midterm Exam: Fundamentals");
    } else {
      setAssignmentTitle("Assignment " + assignmentId);
    }
  }, [assignmentId]);
  
  return (
    <PageTransition>
      <Navbar />
      <main className="pt-24 pb-16 min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container max-w-7xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigate("/professor/assignments")}
              className="mb-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Assignments
            </Button>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate(`/professor/assignments/edit/${assignmentId}`)}>
                <FileText className="mr-2 h-4 w-4" />
                Edit Assignment
              </Button>
              <Button onClick={() => navigate(`/professor/assignments/${assignmentId}/submissions`)}>
                <UserCheck className="mr-2 h-4 w-4" />
                View Submissions
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col mb-6">
            <h1 className="text-3xl font-bold tracking-tight mb-2">{assignmentTitle}</h1>
            <p className="text-muted-foreground">
              Detailed view and tracking of assignment submissions and performance.
            </p>
          </div>
          
          <AssignmentDetail assignmentId={assignmentId} />
        </div>
      </main>
    </PageTransition>
  );
};

export default AssignmentDetailPage;
