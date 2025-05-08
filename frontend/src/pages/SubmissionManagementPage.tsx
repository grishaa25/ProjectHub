
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageTransition from "@/components/layout/PageTransition";
import { Navbar } from "@/components/layout/Navbar";
import { SubmissionManagement } from "@/components/professor/SubmissionManagement";
import { Button } from "@/components/ui-custom/Button";
import { ArrowLeft, FileText } from "lucide-react";

const SubmissionManagementPage = () => {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const navigate = useNavigate();
  const [assignmentTitle, setAssignmentTitle] = useState("Loading...");
  const [assignmentDetails, setAssignmentDetails] = useState({
    totalSubmissions: 0,
    gradedSubmissions: 0,
    pendingSubmissions: 0
  });
  
  // In a real app, we'd fetch the assignment details here
  React.useEffect(() => {
    // Mock data - in a real app this would be a fetch call
    if (assignmentId === "1") {
      setAssignmentTitle("Assignment 1: Introduction to Variables");
      setAssignmentDetails({
        totalSubmissions: 28,
        gradedSubmissions: 15,
        pendingSubmissions: 13
      });
    } else if (assignmentId === "2") {
      setAssignmentTitle("Assignment 2: Loops and Conditionals");
      setAssignmentDetails({
        totalSubmissions: 40,
        gradedSubmissions: 35,
        pendingSubmissions: 5
      });
    } else if (assignmentId === "3") {
      setAssignmentTitle("Midterm Exam: Fundamentals");
      setAssignmentDetails({
        totalSubmissions: 45,
        gradedSubmissions: 40,
        pendingSubmissions: 5
      });
    } else {
      setAssignmentTitle("Assignment " + assignmentId);
      setAssignmentDetails({
        totalSubmissions: 25,
        gradedSubmissions: 10,
        pendingSubmissions: 15
      });
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
              onClick={() => navigate(`/professor/assignments/${assignmentId}`)}
              className="mb-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Assignment Details
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => navigate("/professor/assignments")}
            >
              <FileText className="mr-2 h-4 w-4" />
              All Assignments
            </Button>
          </div>
          
          <div className="flex flex-col mb-6">
            <h1 className="text-3xl font-bold tracking-tight mb-2">{assignmentTitle}</h1>
            <p className="text-muted-foreground">
              Review and grade student submissions for this assignment.
            </p>
          </div>
          
          {/* Quick stats for submissions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4 border">
              <div className="text-sm text-muted-foreground mb-1">Total Submissions</div>
              <div className="text-2xl font-bold">{assignmentDetails.totalSubmissions}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border">
              <div className="text-sm text-muted-foreground mb-1">Graded</div>
              <div className="text-2xl font-bold text-green-600">{assignmentDetails.gradedSubmissions}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border">
              <div className="text-sm text-muted-foreground mb-1">Pending</div>
              <div className="text-2xl font-bold text-amber-500">{assignmentDetails.pendingSubmissions}</div>
            </div>
          </div>
          
          <SubmissionManagement assignmentId={assignmentId} />
        </div>
      </main>
    </PageTransition>
  );
};

export default SubmissionManagementPage;
