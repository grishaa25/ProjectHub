import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui-custom/Card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui-custom/Button";
import { Clock, AlertTriangle, Check, Calendar, Users, Upload, X, FileText } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const StudentProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submissionModalOpen, setSubmissionModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [submissionText, setSubmissionText] = useState("");
  const [submissionLinks, setSubmissionLinks] = useState("");
  const [submissionFiles, setSubmissionFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await fetch(
        "http://localhost:8000/api/projects/student/active",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      const data = await response.json();
      console.log("Projects:", data);
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const openSubmissionModal = (project) => {
    // Find the current milestone that needs to be submitted
    console.log("Project Details: ", project);
    console.log("Project milestones:", project.milestones);
    
    // Check if milestones exist and are properly structured
    if (!project.milestones || !Array.isArray(project.milestones)) {
      toast.error("No milestones found for this project");
      return;
    }

    // Find the next milestone that is not submitted
    const currentMilestone = project.milestones.find(
      (m) => !m.submitted && new Date(m.dueDate) > new Date()
    );

    console.log("Current milestone for submission:", currentMilestone);

    if (!currentMilestone) {
      toast.error("No active milestones available for submission");
      return;
    }

    setSelectedProject(project);
    setSelectedMilestone(currentMilestone);
    setSubmissionModalOpen(true);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSubmissionFiles([...submissionFiles, ...files]);
  };

  const removeFile = (index) => {
    const newFiles = [...submissionFiles];
    newFiles.splice(index, 1);
    setSubmissionFiles(newFiles);
  };

  const handleSubmit = async () => {
    if (!selectedProject || !selectedMilestone) {
      toast.error("Missing project or milestone information");
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("milestone_id", selectedMilestone.id);
      formData.append("team_id", selectedProject.team.id);
      formData.append("submission_text", submissionText);

      // Add links if provided
      if (submissionLinks.trim()) {
        const links = submissionLinks
          .split("\n")
          .filter((link) => link.trim())
          .map((link) => link.trim());
        
        links.forEach(link => {
          formData.append("links", link);
        });
      }

      // Add files if provided
      submissionFiles.forEach((file) => {
        formData.append("files", file);
      });

      // Submit milestone
      const response = await fetch(
        "http://localhost:8000/api/projects/milestones/submit",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to submit milestone");
      }

      toast.success("Milestone submitted successfully!");
      setSubmissionModalOpen(false);
      resetSubmissionForm();
      fetchProjects(); // Refresh projects to update milestone status
    } catch (error) {
      console.error("Error submitting milestone:", error);
      toast.error(error.message || "Failed to submit milestone");
    } finally {
      setSubmitting(false);
    }
  };

  const resetSubmissionForm = () => {
    setSelectedProject(null);
    setSelectedMilestone(null);
    setSubmissionText("");
    setSubmissionLinks("");
    setSubmissionFiles([]);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Projects</h2>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12 bg-muted/20 rounded-lg">
          <p className="text-muted-foreground mb-4">
            You don't have any active projects yet.
          </p>
          <Button onClick={() => navigate("/student")}>
            Browse Available Projects
          </Button>
        </div>
      ) : (
        projects.map((project) => (
          <Card
            key={project.id}
            className={`overflow-hidden border-l-4 ${
              project.isCompleted
                ? "border-l-primary"
                : project.isNearDeadline
                ? "border-l-secondary"
                : "border-l-primary"
            }`}
          >
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-semibold">{project.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      Professor: {project.professor}
                    </p>
                  </div>
                  <Badge
                    variant={
                      project.status === "Completed"
                        ? "secondary"
                        : project.status === "In Progress"
                        ? "default"
                        : "outline"
                    }
                  >
                    {project.status}
                  </Badge>
                </div>

                {/* Team Members */}
                <div className="flex items-center gap-2 mb-4">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium mr-2">
                    Team: {project.team?.name}
                  </span>
                  <div className="flex -space-x-2">
                    {project.teamMembers.map((member) => (
                      <TooltipProvider key={member.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Avatar className="h-7 w-7 border-2 border-background">
                              <AvatarImage
                                src={member.avatar}
                                alt={member.name}
                              />
                              <AvatarFallback
                                className={
                                  member.isLeader
                                    ? "bg-primary text-primary-foreground"
                                    : ""
                                }
                              >
                                {member.initials}
                              </AvatarFallback>
                            </Avatar>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">
                              {member.name}
                              {member.isLeader ? " (Leader)" : ""}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </div>

                {/* Progress Section */}
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">
                      Current Milestone: {project.currentMilestone}
                    </span>
                    <span className="text-sm font-medium">
                      {project.progress}% Complete
                    </span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>

                {/* Due Dates */}
                {project.dueDates && project.dueDates.length > 0 && (
                  <div className="text-sm space-y-1 mb-4">
                    <div className="font-medium mb-1">Upcoming Deadlines:</div>
                    {project.dueDates.slice(0, 2).map((deadline, index) => (
                      <div
                        key={index}
                        className="flex items-center text-muted-foreground"
                      >
                        <Calendar className="h-3 w-3 mr-2" />
                        <span>{deadline.milestone}: </span>
                        <span className="ml-1 font-medium">
                          {new Date(deadline.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Warning for Near Deadline */}
                {project.isNearDeadline && !project.isCompleted && (
                  <div className="bg-warning/10 border-l-4 border-warning px-4 py-2 mb-4 text-sm flex items-center">
                    <AlertTriangle className="h-4 w-4 text-warning mr-2" />
                    <span>
                      Milestone due soon! Submit your work before the deadline.
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    {!project.isCompleted &&
                      project.dueDates &&
                      project.dueDates[0] && (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>
                            Next deadline:{" "}
                            {new Date(
                              project.dueDates[0].date
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      )}
                    {project.isCompleted && (
                      <div className="flex items-center text-primary">
                        <Check className="h-4 w-4 mr-1" />
                        <span>Completed</span>
                      </div>
                    )}
                  </div>

                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/projects/${project.id}`)}
                    >
                      View Details
                    </Button>

                    {!project.isCompleted && (
                      <Button
                        size="sm"
                        disabled={project.status === "Submitted"}
                        onClick={() => {openSubmissionModal(project); console.log(project)}}
                      >
                        {project.status === "Submitted"
                          ? "Submitted"
                          : "Submit Milestone"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}

      {/* Milestone Submission Modal */}
      <Dialog open={submissionModalOpen} onOpenChange={setSubmissionModalOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Submit Milestone</DialogTitle>
            <DialogDescription>
              {selectedMilestone && (
                <div className="mt-2">
                  <p className="font-medium text-foreground">{selectedMilestone.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Due: {new Date(selectedMilestone.due_date).toLocaleDateString()}
                  </p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="submission-text">Submission Details</Label>
              <Textarea
                id="submission-text"
                placeholder="Describe your milestone submission..."
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="submission-links">Links (One per line)</Label>
              <Textarea
                id="submission-links"
                placeholder="https://github.com/your-repo
https://docs.google.com/your-document"
                value={submissionLinks}
                onChange={(e) => setSubmissionLinks(e.target.value)}
                className="min-h-[80px]"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="file-upload">Attachments</Label>
              <div className="border rounded-md p-2">
                <Input
                  id="file-upload"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="mb-2"
                />
                
                {submissionFiles.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {submissionFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-muted/50 p-2 rounded-md"
                      >
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm truncate max-w-[300px]">
                            {file.name}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSubmissionModalOpen(false);
                resetSubmissionForm();
              }}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-background border-t-transparent rounded-full" />
                  Submitting...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Submit Milestone
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
