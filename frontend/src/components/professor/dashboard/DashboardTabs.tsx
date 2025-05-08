import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FolderIcon,
  BarChart2Icon,
  FileTextIcon,
  UsersIcon,
  BookOpen,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectManagement } from "@/components/professor/ProjectManagement";
import { ProjectAnalytics } from "@/components/professor/ProjectAnalytics";
import { AssignmentManagement } from "@/components/professor/AssignmentManagement";
import { CollaborationHub } from "@/components/professor/CollaborationHub";
import { KnowledgeRepository } from "@/components/professor/KnowledgeRepository";

interface DashboardTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onViewDetails: (projectId: number) => void;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({
  activeTab,
  setActiveTab,
  onViewDetails,
}) => {
  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="space-y-6 mt-6"
    >
      <TabsList className="grid grid-cols-5 w-full max-w-4xl bg-card/50 backdrop-blur-sm">
        <TabsTrigger value="projects" className="flex items-center">
          <FolderIcon className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Projects</span>
        </TabsTrigger>
        <TabsTrigger value="analytics" className="flex items-center">
          <BarChart2Icon className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Analytics</span>
          <span className="sm:hidden">Stats</span>
        </TabsTrigger>
        <TabsTrigger value="assignments" className="flex items-center">
          <FileTextIcon className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Assignments</span>
          <span className="sm:hidden">Tasks</span>
        </TabsTrigger>
        <TabsTrigger value="collaboration" className="flex items-center">
          <UsersIcon className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Collaboration</span>
          <span className="sm:hidden">Team</span>
        </TabsTrigger>
        <TabsTrigger value="knowledge" className="flex items-center">
          <BookOpen className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Knowledge</span>
          <span className="sm:hidden">KB</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="projects" className="space-y-6">
        <Card className="border-primary/10 shadow-lg shadow-primary/5">
          <CardHeader className="border-b border-primary/10 bg-primary/5">
            <CardTitle className="flex items-center">
              <FolderIcon className="mr-2 h-5 w-5 text-primary" />
              Project Management
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ProjectManagement onViewDetails={onViewDetails} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="analytics" className="space-y-6">
        <Card className="border-primary/10 shadow-lg shadow-primary/5">
          <CardHeader className="border-b border-primary/10 bg-primary/5">
            <CardTitle className="flex items-center">
              <BarChart2Icon className="mr-2 h-5 w-5 text-primary" />
              Project Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ProjectAnalytics />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="assignments" className="space-y-6">
        <Card className="border-primary/10 shadow-lg shadow-primary/5">
          <CardHeader className="border-b border-primary/10 bg-primary/5">
            <CardTitle className="flex items-center">
              <FileTextIcon className="mr-2 h-5 w-5 text-primary" />
              Assignment Management
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <AssignmentManagement />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="collaboration" className="space-y-6">
        <Card className="border-primary/10 shadow-lg shadow-primary/5">
          <CardHeader className="border-b border-primary/10 bg-primary/5">
            <CardTitle className="flex items-center">
              <UsersIcon className="mr-2 h-5 w-5 text-primary" />
              Collaboration Hub
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <CollaborationHub />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="knowledge" className="space-y-6">
        <Card className="border-primary/10 shadow-lg shadow-primary/5">
          <CardHeader className="border-b border-primary/10 bg-primary/5">
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5 text-primary" />
              Knowledge Repository
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <KnowledgeRepository />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
