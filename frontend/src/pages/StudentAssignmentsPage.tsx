
import React, { useState } from "react";
import PageTransition from "@/components/layout/PageTransition";
import { Navbar } from "@/components/layout/Navbar";
import { StudentAssignments } from "@/components/students/StudentAssignments";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui-custom/Button";
import { Bell, Calendar, Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const StudentAssignmentsPage = () => {
  const { toast } = useToast();
  const [unreadNotifications] = useState<number>(3); // Mock data for unread notifications
  
  const handleExportCalendar = () => {
    toast({
      title: "Calendar Export",
      description: "Assignment deadlines have been exported to your calendar.",
    });
  };

  return (
    <PageTransition>
      <Navbar />
      <main className="pt-24 pb-16 min-h-screen bg-gradient-to-br from-secondary/5 to-primary/5">
        <div className="container max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">My Assignments</h1>
              <p className="text-muted-foreground">
                View all your current and past assignments.
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" className="relative" onClick={handleExportCalendar}>
                <Calendar className="mr-2 h-4 w-4" />
                Export to Calendar
              </Button>
              <Button variant="outline" className="relative" onClick={() => toast({
                title: "Notifications",
                description: "You have 3 new assignment notifications.",
              })}>
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
          
          <StudentAssignments />
        </div>
      </main>
    </PageTransition>
  );
};

export default StudentAssignmentsPage;
