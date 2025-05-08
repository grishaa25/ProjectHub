
import React from "react";
import PageTransition from "@/components/layout/PageTransition";
import { Navbar } from "@/components/layout/Navbar";
import { AssignmentManagement } from "@/components/professor/AssignmentManagement";
import { Button } from "@/components/ui-custom/Button";
import { FileText, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AssignmentDashboardPage = () => {
  const navigate = useNavigate();
  
  return (
    <PageTransition>
      <Navbar />
      <main className="pt-24 pb-16 min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">Assignments</h1>
              <p className="text-muted-foreground">
                Manage all your assignments and track student submissions.
              </p>
            </div>
            <Button onClick={() => navigate("/professor/assignments/create")}>
              <Plus className="mr-2 h-4 w-4" />
              Create Assignment
            </Button>
          </div>
          
          <AssignmentManagement />
          
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
                <CardDescription>Access important assignment management tools</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Button variant="outline" className="h-auto py-4 justify-start" onClick={() => navigate("/professor/assignments/create")}>
                  <Plus className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">New Assignment</div>
                    <div className="text-xs text-muted-foreground mt-1">Create a new assignment</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="h-auto py-4 justify-start" onClick={() => navigate("/professor/assignments")}>
                  <FileText className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Assignment Library</div>
                    <div className="text-xs text-muted-foreground mt-1">View all assignments</div>
                  </div>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </PageTransition>
  );
};

export default AssignmentDashboardPage;
