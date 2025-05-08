import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import PageTransition from "@/components/layout/PageTransition";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StudentChatbot } from "@/components/students/StudentChatbot";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, MessageSquare, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui-custom/Button";
import { Card } from "@/components/ui-custom/Card";
import { StudentProjects } from "@/components/students/StudentProjects";
import { ProfessorProjects } from "@/components/students/ProfessorProjects";
import { CollaboratorFinder } from "@/components/students/CollaboratorFinder";

const StudentDashboard = () => {
  const [showChatbot, setShowChatbot] = useState(true);

  return (
    <PageTransition>
      <Navbar />
      <main className="pt-24 pb-16 min-h-screen bg-gradient-to-br from-secondary/5 to-primary/5">
        <div className="container">
          <DashboardHeader />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-16">
            <div className="lg:col-span-3">
              <Tabs defaultValue="my-projects" className="space-y-4">
                <TabsList className="bg-card/50 backdrop-blur-sm w-full">
                  <TabsTrigger value="my-projects">
                    <FolderOpen className="mr-2 h-4 w-4" />
                    My Projects
                  </TabsTrigger>
                  <TabsTrigger value="professor-projects">
                    <Users className="mr-2 h-4 w-4" />
                    Professor Projects
                  </TabsTrigger>
                  <TabsTrigger value="teams">
                    <Users className="mr-2 h-4 w-4" />
                    Teams
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="my-projects" className="space-y-4">
                  <StudentProjects />
                </TabsContent>

                <TabsContent value="professor-projects" className="space-y-4">
                  <ProfessorProjects />
                </TabsContent>

                <TabsContent value="teams" className="space-y-4">
                  <CollaboratorFinder />
                </TabsContent>
              </Tabs>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium">AI Assistant</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowChatbot(!showChatbot)}
                  >
                    {showChatbot ? "Hide" : "Show"}
                  </Button>
                </div>

                {showChatbot && (
                  <Card
                    variant="glass"
                    animation="slide"
                    className="border-secondary/10 shadow-md overflow-visible h-[500px]"
                  >
                    <div className="absolute -top-4 left-4 bg-secondary text-secondary-foreground px-3 py-1 rounded-md text-sm font-medium shadow-lg">
                      <MessageSquare className="inline-block mr-2 h-4 w-4" />
                      AI Assistant
                    </div>
                    <div className="p-6 pt-8 h-full">
                      <StudentChatbot />
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </PageTransition>
  );
};

export default StudentDashboard;
