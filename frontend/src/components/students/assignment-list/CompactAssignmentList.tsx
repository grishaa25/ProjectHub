
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { Badge } from "@/components/ui/badge";
import { Eye, Clock, Calendar, CheckCheck, AlertCircle, FileText } from "lucide-react";
import { format, isAfter, isBefore } from "date-fns";
import { cn } from "@/lib/utils";

// Assignment type definition
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

interface CompactAssignmentListProps {
  assignments: Assignment[];
  onViewDetails: (assignmentId: number) => void;
}

const CompactAssignmentList: React.FC<CompactAssignmentListProps> = ({ 
  assignments,
  onViewDetails
}) => {
  const navigate = useNavigate();
  const today = new Date();
  
  // Display only the upcoming and recently graded assignments
  const filteredAssignments = assignments
    .filter(a => 
      (a.status === "Pending" && isAfter(a.dueDate, today)) || 
      a.status === "Graded" || 
      (a.status === "Submitted" && a.submittedOn && 
        isAfter(new Date(new Date().setDate(today.getDate() - 7)), a.submittedOn))
    )
    .sort((a, b) => {
      // Sort by due date (ascending) for pending assignments
      if (a.status === "Pending" && b.status === "Pending") {
        return a.dueDate.getTime() - b.dueDate.getTime();
      }
      // Put pending before submitted
      if (a.status === "Pending" && b.status !== "Pending") return -1;
      if (a.status !== "Pending" && b.status === "Pending") return 1;
      
      // Sort by submission date (descending) for submitted assignments
      if (a.submittedOn && b.submittedOn) {
        return b.submittedOn.getTime() - a.submittedOn.getTime();
      }
      return 0;
    })
    .slice(0, 3); // Only show the first 3 assignments

  const getAssignmentBadge = (status: string, dueDate: Date) => {
    if (status === "Pending" && isAfter(dueDate, today)) {
      const daysLeft = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysLeft <= 3) {
        return (
          <Badge className="bg-amber-500 text-white">
            <Clock className="mr-1 h-3 w-3" />
            Due soon
          </Badge>
        );
      }
      
      return (
        <Badge className="bg-blue-500 text-white">
          <Calendar className="mr-1 h-3 w-3" />
          Upcoming
        </Badge>
      );
    } else if (status === "Pending" && isBefore(dueDate, today)) {
      return (
        <Badge className="bg-red-500 text-white">
          <AlertCircle className="mr-1 h-3 w-3" />
          Overdue
        </Badge>
      );
    } else if (status === "Submitted") {
      return (
        <Badge className="bg-purple-500 text-white">
          <FileText className="mr-1 h-3 w-3" />
          Submitted
        </Badge>
      );
    } else if (status === "Graded") {
      return (
        <Badge className="bg-green-500 text-white">
          <CheckCheck className="mr-1 h-3 w-3" />
          Graded
        </Badge>
      );
    }
    
    return <Badge>{status}</Badge>;
  };

  if (filteredAssignments.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">No upcoming assignments</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filteredAssignments.map((assignment) => (
        <Card 
          key={assignment.id}
          variant="outline"
          className={cn("p-4 hover:border-primary/30 transition-all cursor-pointer", 
            assignment.status === "Graded" ? "border-green-200" : 
            assignment.status === "Pending" && isBefore(assignment.dueDate, today) ? "border-red-200" : ""
          )}
          onClick={() => onViewDetails(assignment.id)}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <div className="flex items-center">
                <h4 className="font-medium mr-3">{assignment.title}</h4>
                {getAssignmentBadge(assignment.status, assignment.dueDate)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {assignment.course}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              {assignment.status === "Pending" ? (
                <div className="text-xs text-muted-foreground">
                  Due {format(assignment.dueDate, "MMM d")}
                </div>
              ) : assignment.status === "Graded" ? (
                <div className="flex items-center text-xs text-green-600 font-medium">
                  <CheckCheck className="mr-1 h-3 w-3" />
                  {assignment.grade}/{assignment.maxGrade}
                </div>
              ) : null}
              
              <Button size="sm" onClick={(e) => { e.stopPropagation(); onViewDetails(assignment.id); }}>
                <Eye className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
      
      <div className="text-center mt-4">
        <Button variant="outline" size="sm" onClick={() => navigate('/student/assignments')}>
          View All Assignments
        </Button>
      </div>
    </div>
  );
};

export default CompactAssignmentList;
