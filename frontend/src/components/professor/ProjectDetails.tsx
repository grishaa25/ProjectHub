import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui-custom/Button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  FileText,
  Edit,
  Trash2,
  Users,
  CheckCircle,
  XCircle,
  Download,
  Calendar,
  PlusCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

// Team status color mapping
const teamStatusColors = {
  Pending: "bg-amber-500 text-white",
  Approved: "bg-green-500 text-white",
  Rejected: "bg-red-500 text-white",
};

// Project status color mapping
const projectStatusColors = {
  Open: "bg-amber-500 text-white",
  "In Progress": "bg-blue-500 text-white",
  Completed: "bg-green-500 text-white",
  Cancelled: "bg-red-500 text-white",
};

interface ProjectDetailsProps {
  projectId: number;
}

interface Project {
  id: number;
  title: string;
  description: string;
  status: string;
  professor: string;
  milestones: Milestone[];
  teams: TeamInfo[];
  academicYear: string;
  students: number;
  dueDate: string;
  tags: string[];
  documents: string[];
}

interface Milestone {
  id: number;
  title: string;
  description: string;
  due_date: string;
  weightage: number;
  files?: string[];
}

interface MilestoneSubmission {
  submission_id: number;
  milestone_id: number;
  milestone_title: string;
  project_id: number;
  team_id: number;
  team_name: string;
  team_members: {
    id: number;
    student_id: number;
    name: string;
    email: string;
  }[];
  submitted_at: string;
  grade: number | null;
  feedback: string | null;
  documents: {
    id: number;
    filename: string;
    file_path: string;
    uploaded_at: string;
  }[];
  is_graded: boolean;
}

interface TeamInfo {
  id: number;
  name: string;
  members: {
    id: number;
    student_id: number;
    student: {
      id: number;
      name: string;
      email: string;
      year?: string;
    };
  }[];
  status: string;
  leader_id: number;
  is_locked: boolean;
  submittedMilestones?: {
    milestoneId: number;
    submitted: boolean;
    submissionDate?: string;
    files?: string[];
    feedback?: string;
    grade?: number;
  }[];
}

const ProjectDetails = ({ projectId }: ProjectDetailsProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [milestoneDialogOpen, setMilestoneDialogOpen] = useState(false);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [currentMilestone, setCurrentMilestone] = useState<MilestoneSubmission | null>(null);
  const [currentTeam, setCurrentTeam] = useState<TeamInfo | null>(null);
  const [feedback, setFeedback] = useState("");
  const [grade, setGrade] = useState("");
  const [projectStatus, setProjectStatus] = useState("");
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [newMilestone, setNewMilestone] = useState({
    title: "",
    description: "",
    dueDate: "",
    weightage: "",
  });
  const [milestoneSubmissions, setMilestoneSubmissions] = useState<MilestoneSubmission[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [submissionFilter, setSubmissionFilter] = useState("all"); // all, pending, graded

  // Fetch milestone submissions for the project
  const fetchMilestoneSubmissions = useCallback(async (pid: number) => {
    try {
      setLoadingSubmissions(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `http://localhost:8000/api/projects/professor/submissions?project_id=${pid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch submissions: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Milestone submissions received:", data);
      setMilestoneSubmissions(data);
    } catch (error) {
      console.error("Error fetching milestone submissions:", error);
      toast.error("Failed to load milestone submissions");
    } finally {
      setLoadingSubmissions(false);
    }
  }, [navigate]);

  const fetchProject = useCallback(async () => {
    try {
      console.log("Fetching project with ID:", projectId);
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `http://localhost:8000/api/projects/get/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch project: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Project data received:", data);
      setProject(data);
      setProjectStatus(data.status);
      
      // Fetch milestone submissions for this project
      fetchMilestoneSubmissions(projectId);
    } catch (error) {
      console.error("Error fetching project:", error);
      toast.error("Failed to load project details");
    } finally {
      setLoading(false);
    }
  }, [projectId, navigate, fetchMilestoneSubmissions]);

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId, fetchProject]);

  // Handle back button click
  const handleBackClick = () => {
    navigate("/professor");
  };

  // Handle team status update
  const handleTeamStatusChange = async (teamId: number, status: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:8000/api/projects/teams/status/${teamId}?status=${encodeURIComponent(
          status
        )}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update team status");
      }

      // Update the team status in the UI
      setProject({
        ...project,
        teams: project.teams.map((team) =>
          team.id === teamId ? { ...team, status: status } : team
        ),
      });

      toast.success(`Team status updated to ${status}`);
    } catch (error) {
      console.error("Error updating team status:", error);
      toast.error("Failed to update team status");
    }
  };

  // Handle project status change
  const handleProjectStatusChange = async (status: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:8000/api/projects/update/${projectId}/status?status=${encodeURIComponent(
          status
        )}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update project status");
      }

      setProjectStatus(status);
      setProject({ ...project, status });
      toast.success(`Project status updated to ${status}`);
    } catch (error) {
      console.error("Error updating project status:", error);
      toast.error("Failed to update project status");
    }
  };

  // Handle project delete
  const handleDeleteProject = () => {
    toast.success("Project deleted successfully");
    navigate("/professor");
  };

  // Handle team selection for milestone tracking
  const handleTeamSelect = (teamId: number) => {
    setSelectedTeamId(teamId);
  };

  // Open milestone feedback dialog
  const openFeedbackDialog = (milestone: any, team: any) => {
    setCurrentMilestone(milestone);
    setCurrentTeam(team);
    setFeedback(milestone.feedback || "");
    setGrade(milestone.grade?.toString() || "");
    setFeedbackDialogOpen(true);
  };

  // Save feedback and grade
  const handleSaveFeedback = async () => {
    if (!currentMilestone || !currentTeam) {
      toast.error("Missing milestone or team information");
      return;
    }

    const gradeValue = parseFloat(grade);
    if (isNaN(gradeValue) || gradeValue < 0 || gradeValue > 100) {
      toast.error("Grade must be a number between 0 and 100");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `http://localhost:8000/api/projects/submissions/${currentMilestone.submission_id}/grade`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            grade: gradeValue,
            feedback: feedback,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData)
        throw new Error("Failed to save feedback and grade");
      }

      toast.success("Feedback and grade saved successfully");
      setFeedbackDialogOpen(false);
      
      // Refresh milestone submissions
      fetchMilestoneSubmissions(projectId);
      
      // If we're in the milestone tab, refresh the project to update milestone status
      if (activeTab === "milestones") {
        fetchProject();
      }
    } catch (error) {
      console.error("Error saving feedback:", error);
      toast.error("Failed to save feedback and grade");
    }
  };

  // Submit new milestone
  const handleAddMilestone = async () => {
    try {
      if (!newMilestone.title.trim()) {
        toast.error("Milestone title is required");
        return;
      }

      if (!newMilestone.dueDate) {
        toast.error("Due date is required");
        return;
      }

      if (!newMilestone.weightage || isNaN(parseFloat(newMilestone.weightage))) {
        toast.error("Weightage must be a valid number");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const milestoneData = {
        title: newMilestone.title,
        description: newMilestone.description,
        due_date: newMilestone.dueDate,
        weightage: parseFloat(newMilestone.weightage),
      };

      const response = await fetch(
        `http://localhost:8000/api/projects/${projectId}/milestones`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(milestoneData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add milestone");
      }

      // Reset form
      setNewMilestone({
        title: "",
        description: "",
        dueDate: "",
        weightage: "",
      });

      // Close dialog
      setMilestoneDialogOpen(false);

      // Refresh project data
      fetchProject();

      toast.success("Milestone added successfully");
    } catch (error) {
      console.error("Error adding milestone:", error);
      toast.error("Failed to add milestone");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">Project Not Found</h3>
          <p className="text-muted-foreground mb-4">
            The project you're looking for doesn't exist or you don't have
            access.
          </p>
          <Button onClick={handleBackClick}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={handleBackClick}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Button>

        <div className="flex gap-2">
          <Select
            value={project.status}
            onValueChange={handleProjectStatusChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="text-destructive"
            onClick={handleDeleteProject}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="bg-primary/5 border-b border-primary/10">
          <div className="flex items-center justify-between">
            <CardTitle>{project.title}</CardTitle>
            <Badge
              className={
                projectStatusColors[
                  project.status as keyof typeof projectStatusColors
                ] || "bg-gray-500"
              }
            >
              {project.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="teams">Team Assignment</TabsTrigger>
              <TabsTrigger value="milestones">Milestone Tracking</TabsTrigger>
              <TabsTrigger value="submissions">Submissions</TabsTrigger>
            </TabsList>

            {/* Project Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div>
                <div className="text-sm leading-6 text-muted-foreground">
                  {project.description}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Details</h3>
                  <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                      <span className="text-sm">
                        Academic Year: {project.academicYear}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-muted-foreground mr-2" />
                      <span className="text-sm">
                        {project.students} Teams Assigned
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                      <span className="text-sm">
                        Due:{" "}
                        {project.dueDate &&
                          new Date(project.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Tags</h3>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <div className="flex flex-wrap gap-1">
                      {project.tags &&
                        project.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Documents</h3>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <div className="space-y-2">
                      {project.documents &&
                        project.documents.map((doc, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between text-sm"
                          >
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 text-primary mr-2" />
                              <span>{doc}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Milestones</h3>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="space-y-4">
                    {project.milestones &&
                      project.milestones.map((milestone) => (
                        <div
                          key={milestone.id}
                          className="flex items-center justify-between border-b border-muted last:border-0 pb-3 last:pb-0"
                        >
                          <div>
                            <h4 className="font-medium">{milestone.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {milestone.description}
                            </p>
                            <div className="text-xs text-muted-foreground mt-1">
                              Due:{" "}
                              {new Date(milestone.due_date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Team Assignment Tab */}
            <TabsContent value="teams" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Team Assignment</h3>
              </div>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Team Name</TableHead>
                      <TableHead>Members</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {project.teams &&
                      project.teams.map((team) => (
                        <TableRow key={team.id}>
                          <TableCell className="font-medium">
                            {team.name}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span className="text-sm">
                                {team.members.length} students
                              </span>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="ml-2 h-7 text-xs px-2"
                                  >
                                    View Details
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>
                                      Team {team.name} Members
                                    </DialogTitle>
                                    <DialogDescription>
                                      List of students in this team
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-3 mt-4">
                                    {team.members.map((member) => (
                                      <div
                                        key={member.id}
                                        className="flex items-center justify-between p-3 bg-muted/20 rounded-lg"
                                      >
                                        <div>
                                          <div className="font-medium">
                                            {member.student?.name || "Unknown Student"}
                                          </div>
                                          <div className="text-sm text-muted-foreground">
                                            {member.student?.email || "No email"}
                                          </div>
                                        </div>
                                        <Badge variant="outline">
                                          {member.student?.year || "N/A"}
                                        </Badge>
                                      </div>
                                    ))}
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                teamStatusColors[
                                  team.status as keyof typeof teamStatusColors
                                ] || "bg-gray-500"
                              }
                            >
                              {team.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {team.status === "Pending" ? (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="bg-green-500/10 hover:bg-green-500/20 text-green-600"
                                  onClick={() =>
                                    handleTeamStatusChange(team.id, "Approved")
                                  }
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />{" "}
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="bg-red-500/10 hover:bg-red-500/20 text-red-600"
                                  onClick={() =>
                                    handleTeamStatusChange(team.id, "Rejected")
                                  }
                                >
                                  <XCircle className="h-4 w-4 mr-1" /> Reject
                                </Button>
                              </>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleTeamSelect(team.id)}
                              >
                                Track Milestones
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            {/* Milestone Tracking Tab */}
            <TabsContent value="milestones" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Milestone Progress Tracking
                </h3>
                <Dialog
                  open={milestoneDialogOpen}
                  onOpenChange={setMilestoneDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Milestone
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Milestone</DialogTitle>
                      <DialogDescription>
                        Create a new milestone for this project
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="milestone-title">Milestone Title</Label>
                        <Input
                          id="milestone-title"
                          value={newMilestone.title}
                          onChange={(e) =>
                            setNewMilestone({
                              ...newMilestone,
                              title: e.target.value,
                            })
                          }
                          placeholder="Enter milestone title"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="milestone-date">Due Date</Label>
                        <Input
                          id="milestone-date"
                          type="date"
                          value={newMilestone.dueDate}
                          onChange={(e) =>
                            setNewMilestone({
                              ...newMilestone,
                              dueDate: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="milestone-description">
                          Description
                        </Label>
                        <Textarea
                          id="milestone-description"
                          value={newMilestone.description}
                          onChange={(e) =>
                            setNewMilestone({
                              ...newMilestone,
                              description: e.target.value,
                            })
                          }
                          placeholder="Describe this milestone"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="milestone-weightage">
                          Weightage (0-100)
                        </Label>
                        <Input
                          id="milestone-weightage"
                          type="number"
                          min="0"
                          max="100"
                          value={newMilestone.weightage}
                          onChange={(e) =>
                            setNewMilestone({
                              ...newMilestone,
                              weightage: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setMilestoneDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleAddMilestone}>
                          Add Milestone
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="col-span-1">
                  <CardHeader className="bg-primary/5 border-b border-primary/10">
                    <CardTitle className="text-sm font-medium">
                      Approved Teams
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {project.teams &&
                        project.teams
                          .filter((team) => team.status === "Approved")
                          .map((team) => (
                            <Button
                              key={team.id}
                              variant="ghost"
                              className={`w-full justify-start rounded-none px-4 py-2 ${
                                selectedTeamId === team.id
                                  ? "bg-primary/10"
                                  : ""
                              }`}
                              onClick={() => handleTeamSelect(team.id)}
                            >
                              {team.name}
                            </Button>
                          ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="col-span-1 md:col-span-3">
                  {selectedTeamId ? (
                    <>
                      {(() => {
                        const selectedTeam = project.teams.find(
                          (t) => t.id === selectedTeamId
                        );
                        if (!selectedTeam) return null;

                        return (
                          <>
                            <CardHeader className="bg-primary/5 border-b border-primary/10">
                              <CardTitle className="text-sm font-medium flex items-center justify-between">
                                <span>{selectedTeam.name} Milestones</span>
                                <Badge variant="outline">
                                  {selectedTeam.members.length} Students
                                </Badge>
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Milestone</TableHead>
                                    <TableHead>Due Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Submission Date</TableHead>
                                    <TableHead>Grade</TableHead>
                                    <TableHead className="text-right">
                                      Actions
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {project.milestones.map((milestone) => {
                                    const submission =
                                      selectedTeam.submittedMilestones.find(
                                        (s) => s.milestoneId === milestone.id
                                      );

                                    return (
                                      <TableRow key={milestone.id}>
                                        <TableCell className="font-medium">
                                          {milestone.title}
                                        </TableCell>
                                        <TableCell>
                                          {new Date(
                                            milestone.due_date
                                          ).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                          {submission?.submitted ? (
                                            <Badge className="bg-green-500">
                                              Submitted
                                            </Badge>
                                          ) : (
                                            <Badge
                                              variant="outline"
                                              className="border-amber-500 text-amber-600"
                                            >
                                              Pending
                                            </Badge>
                                          )}
                                        </TableCell>
                                        <TableCell>
                                          {submission?.submissionDate
                                            ? new Date(
                                                submission.submissionDate
                                              ).toLocaleDateString()
                                            : "-"}
                                        </TableCell>
                                        <TableCell>
                                          {submission?.grade
                                            ? `${submission.grade}/100`
                                            : "-"}
                                        </TableCell>
                                        <TableCell className="text-right">
                                          {submission?.submitted ? (
                                            <div className="flex justify-end">
                                              <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                  openFeedbackDialog(
                                                    submission,
                                                    selectedTeam
                                                  )
                                                }
                                              >
                                                {submission.feedback
                                                  ? "Edit Feedback"
                                                  : "Add Feedback"}
                                              </Button>
                                            </div>
                                          ) : (
                                            <Badge
                                              variant="outline"
                                              className="border-muted text-muted-foreground"
                                            >
                                              Awaiting Submission
                                            </Badge>
                                          )}
                                        </TableCell>
                                      </TableRow>
                                    );
                                  })}
                                </TableBody>
                              </Table>
                            </CardContent>
                          </>
                        );
                      })()}
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-64 text-center">
                      <div className="max-w-md">
                        <h3 className="text-lg font-medium mb-2">
                          Select a Team
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Choose a team from the left panel to view their
                          milestone progress and provide feedback.
                        </p>
                      </div>
                    </div>
                  )}
                </Card>
              </div>

              <Dialog
                open={feedbackDialogOpen}
                onOpenChange={setFeedbackDialogOpen}
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Provide Feedback & Grade</DialogTitle>
                    <DialogDescription>
                      Review submission and provide feedback for{" "}
                      {currentTeam?.name}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    {currentMilestone?.documents && currentMilestone.documents.length > 0 && (
                      <div className="space-y-2">
                        <Label>Submitted Files</Label>
                        <div className="space-y-2">
                          {currentMilestone.documents.map(
                            (doc, i) => (
                              <div
                                key={i}
                                className="flex items-center justify-between bg-secondary/10 p-2 rounded-lg"
                              >
                                <div className="flex items-center">
                                  <FileText className="h-4 w-4 text-primary mr-2" />
                                  <span className="text-sm">{doc.filename}</span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => window.open(`http://localhost:8000/${doc.file_path}`, '_blank')}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="feedback">Professor Feedback</Label>
                      <Textarea
                        id="feedback"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Provide feedback on this submission"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="grade">Grade (0-100)</Label>
                      <Input
                        id="grade"
                        type="number"
                        min="0"
                        max="100"
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setFeedbackDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleSaveFeedback}>
                        Save Feedback & Grade
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </TabsContent>

            {/* New Submissions Tab */}
            <TabsContent value="submissions" className="p-6">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Milestone Submissions</h2>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="filter-submissions" className="text-sm">Filter:</Label>
                    <Select 
                      value={submissionFilter} 
                      onValueChange={setSubmissionFilter}
                    >
                      <SelectTrigger id="filter-submissions" className="w-[180px]">
                        <SelectValue placeholder="Filter submissions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Submissions</SelectItem>
                        <SelectItem value="pending">Pending Review</SelectItem>
                        <SelectItem value="graded">Graded</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => fetchMilestoneSubmissions(projectId)}
                    >
                      Refresh
                    </Button>
                  </div>
                </div>

                {loadingSubmissions ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : milestoneSubmissions.length === 0 ? (
                  <div className="bg-muted/20 rounded-lg p-8 text-center">
                    <div className="mx-auto w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center mb-4">
                      <FileText className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No Submissions Yet</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      When students submit their milestones, they will appear here for review.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {milestoneSubmissions
                      .filter(submission => {
                        if (submissionFilter === "all") return true;
                        if (submissionFilter === "pending") return !submission.is_graded;
                        if (submissionFilter === "graded") return submission.is_graded;
                        return true;
                      })
                      .map((submission) => (
                        <Card key={submission.submission_id} className="overflow-hidden">
                          <CardContent className="p-0">
                            <div className="p-6">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h3 className="text-lg font-semibold">
                                    {submission.milestone_title}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    Team: {submission.team_name}
                                  </p>
                                </div>
                                <Badge 
                                  variant={submission.is_graded ? "default" : "outline"}
                                  className={submission.is_graded ? "bg-green-500 hover:bg-green-500/90" : ""}
                                >
                                  {submission.is_graded ? "Graded" : "Pending Review"}
                                </Badge>
                              </div>

                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="space-y-1">
                                  <p className="text-sm font-medium">Submitted by:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {submission.team_members.map((member) => (
                                      <Badge key={member.id} variant="outline" className="bg-muted/30">
                                        {member.name}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm font-medium">Submitted on:</p>
                                  <p className="text-sm">
                                    {new Date(submission.submitted_at).toLocaleString()}
                                  </p>
                                </div>
                              </div>

                              {submission.documents && submission.documents.length > 0 && (
                                <div className="mb-4">
                                  <p className="text-sm font-medium mb-2">Attachments:</p>
                                  <div className="space-y-2">
                                    {submission.documents.map((doc) => (
                                      <div
                                        key={doc.id}
                                        className="flex items-center justify-between bg-muted/20 p-2 rounded-md"
                                      >
                                        <div className="flex items-center">
                                          <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                                          <span className="text-sm truncate max-w-[300px]">
                                            {doc.filename}
                                          </span>
                                        </div>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => window.open(`http://localhost:8000/${doc.file_path}`, '_blank')}
                                        >
                                          <Download className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {submission.is_graded && (
                                <div className="mb-4 p-4 bg-muted/20 rounded-md">
                                  <div className="flex justify-between items-center mb-2">
                                    <p className="text-sm font-medium">Feedback:</p>
                                    <Badge className="bg-blue-500 hover:bg-blue-500/90">
                                      Grade: {submission.grade}/100
                                    </Badge>
                                  </div>
                                  <p className="text-sm whitespace-pre-wrap">
                                    {submission.feedback || "No feedback provided."}
                                  </p>
                                </div>
                              )}

                              <div className="flex justify-end space-x-2 mt-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setCurrentMilestone(submission);
                                    setCurrentTeam({
                                      id: submission.team_id,
                                      name: submission.team_name,
                                      members: [],
                                      status: "Approved",
                                      leader_id: 0,
                                      is_locked: true
                                    });
                                    setFeedback(submission.feedback || "");
                                    setGrade(submission.grade?.toString() || "");
                                    setFeedbackDialogOpen(true);
                                  }}
                                >
                                  {submission.is_graded ? "Edit Feedback" : "Provide Feedback"}
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectDetails;
