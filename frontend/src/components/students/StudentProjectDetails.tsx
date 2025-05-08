import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Calendar, Clock, FileText, Tag, Users } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";

// Project status colors
const statusColors = {
  "Open": "bg-blue-500",
  "In Progress": "bg-yellow-500",
  "Completed": "bg-green-500",
  "Cancelled": "bg-red-500",
};

interface ProjectTeamMember {
  id: number;
  name: string;
  email: string;
  year: string;
}

interface ProjectTeam {
  id: number;
  name: string;
  members: ProjectTeamMember[];
  status: string;
}

interface MilestoneSubmission {
  id?: number;
  submitted_at?: string;
  grade: number | null;
  feedback: string | null;
}

interface Milestone {
  id: number;
  title: string;
  description: string | null;
  due_date: string;
  weightage: number;
  team_submission?: MilestoneSubmission;
}

interface Resource {
  id: number;
  filename: string;
  file_path: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  status: string;
  year: string;
  created_at: string;
  tags: string[];
  teams: ProjectTeam[];
  milestones: Milestone[];
  resources: Resource[];
}

export const StudentProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [myTeam, setMyTeam] = useState<ProjectTeam | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8000/api/projects/get/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch project");
        }

        const data = await response.json();
        console.log("Project data received:", data);
        setProject(data);
        
        // Find the student's team in this project if any
        if (data.teams) {
          const studentTeam = data.teams.find((team: ProjectTeam) => team.status === "Approved");
          setMyTeam(studentTeam || null);
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        toast({
          title: "Error",
          description: "Failed to load project details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId, navigate]);

  // Handle back button click
  const handleBackClick = () => {
    navigate("/student/projects");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h3 className="text-xl font-semibold mb-2">Project Not Found</h3>
        <p className="text-muted-foreground mb-4">
          The project you're looking for doesn't exist or you don't have access to it.
        </p>
        <Button onClick={handleBackClick}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
        </Button>
      </div>
    );
  }

  // Calculate project progress based on milestones
  const calculateProgress = () => {
    if (!project.milestones || project.milestones.length === 0) return 0;
    
    const completedMilestones = project.milestones.filter(
      (m) => m.team_submission && m.team_submission.grade
    ).length;
    
    return Math.round((completedMilestones / project.milestones.length) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackClick}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
          </Button>
          <h2 className="text-2xl font-bold">{project.title}</h2>
        </div>
        <Badge
          className={`${
            statusColors[project.status as keyof typeof statusColors] || "bg-gray-500"
          } text-white`}
        >
          {project.status}
        </Badge>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground whitespace-pre-line">
                  {project.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {project.tags &&
                  project.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
              </div>
            </div>

            <div className="space-y-4">
              <Card className="bg-muted/40">
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Progress</span>
                    <span className="text-sm font-medium">{calculateProgress()}%</span>
                  </div>
                  <Progress value={calculateProgress()} className="h-2" />
                  
                  <Separator className="my-2" />
                  
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Academic Year: {project.year}</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Created: {new Date(project.created_at).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      {myTeam 
                        ? `Your Team: ${myTeam.name}` 
                        : "Not assigned to a team yet"}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {project.resources && project.resources.length > 0 && (
                <Card className="bg-muted/40">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Resources</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <ul className="space-y-2">
                      {project.resources.map((resource) => (
                        <li key={resource.id} className="flex items-center text-sm">
                          <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                          <a
                            href={`http://localhost:8000/api/files/${resource.file_path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {resource.filename}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="milestones" className="space-y-4">
        <TabsList>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
        </TabsList>

        <TabsContent value="milestones" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Project Milestones</h3>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Milestone</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Weightage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Feedback</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {project.milestones &&
                  project.milestones.map((milestone) => {
                    const submission = milestone.team_submission;
                    const isSubmitted = !!submission;
                    const isGraded = isSubmitted && submission.grade !== null;
                    
                    return (
                      <TableRow key={milestone.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div>{milestone.title}</div>
                            {milestone.description && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {milestone.description}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {format(new Date(milestone.due_date), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>{milestone.weightage}%</TableCell>
                        <TableCell>
                          {isGraded ? (
                            <Badge variant="default" className="bg-green-500 hover:bg-green-600">Graded</Badge>
                          ) : isSubmitted ? (
                            <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600">Submitted</Badge>
                          ) : new Date(milestone.due_date) < new Date() ? (
                            <Badge variant="destructive">Overdue</Badge>
                          ) : (
                            <Badge variant="outline">Pending</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {isGraded && submission ? (
                            <div>
                              <div className="font-medium">
                                Grade: {submission.grade}/100
                              </div>
                              {submission.feedback && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  {submission.feedback}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              No feedback yet
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentProjectDetails;
