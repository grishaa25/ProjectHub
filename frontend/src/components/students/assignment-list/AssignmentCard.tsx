
import React from "react";
import { Card } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { Badge } from "@/components/ui/badge";
import { Eye, Clock, Calendar, CheckCheck, AlertCircle, FileText, Download, Bell } from "lucide-react";
import { format, isAfter, isBefore } from "date-fns";
import { cn } from "@/lib/utils";

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

interface AssignmentCardProps {
  assignment: Assignment;
  onViewDetails: (assignmentId: number) => void;
  onViewNotifications: (assignment: Assignment, e: React.MouseEvent) => void;
  onDownloadMaterials: (assignmentId: number, e: React.MouseEvent) => void;
  today: Date;
}

const AssignmentCard: React.FC<AssignmentCardProps> = ({
  assignment,
  onViewDetails,
  onViewNotifications,
  onDownloadMaterials,
  today
}) => {
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

  return (
    <Card 
      key={assignment.id}
      variant="outline"
      className={cn("p-5 hover:border-primary/30 transition-all cursor-pointer", 
        assignment.status === "Graded" ? "border-green-200" : 
        assignment.status === "Pending" && isBefore(assignment.dueDate, today) ? "border-red-200" : ""
      )}
      onClick={() => onViewDetails(assignment.id)}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center">
            <h4 className="font-medium mr-3">{assignment.title}</h4>
            {getAssignmentBadge(assignment.status, assignment.dueDate)}
            {assignment.hasUnreadNotifications && (
              <Badge variant="outline" className="ml-2 bg-primary/10 hover:bg-primary/20 cursor-pointer" onClick={(e) => onViewNotifications(assignment, e)}>
                <Bell className="mr-1 h-3 w-3" />
                {assignment.notificationCount}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {assignment.course}
          </p>
          {assignment.status === "Pending" ? (
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-2 h-4 w-4" />
              Due {format(assignment.dueDate, "PPP")}
            </div>
          ) : (
            <div className="flex items-center text-sm text-muted-foreground">
              <FileText className="mr-2 h-4 w-4" />
              Submitted on {format(assignment.submittedOn!, "PPP")}
            </div>
          )}
          
          {assignment.status === "Graded" && (
            <div className="flex items-center text-sm text-green-600 font-medium">
              <CheckCheck className="mr-2 h-4 w-4" />
              Grade: {assignment.grade}/{assignment.maxGrade}
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          {assignment.status === "Pending" && (
            <Button variant="outline" size="sm" onClick={(e) => onDownloadMaterials(assignment.id, e)}>
              <Download className="mr-2 h-4 w-4" />
              Materials
            </Button>
          )}
          <Button onClick={(e) => { e.stopPropagation(); onViewDetails(assignment.id); }}>
            <Eye className="mr-2 h-4 w-4" />
            View {assignment.status === "Graded" ? "Feedback" : "Details"}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AssignmentCard;
