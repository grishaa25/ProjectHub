import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui-custom/Card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui-custom/Button";
import { Search, Users, Calendar, Tag, Filter, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

export const ProfessorProjects = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentTeams, setStudentTeams] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [newTeamName, setNewTeamName] = useState("");
  const [createTeamDialogOpen, setCreateTeamDialogOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [motivation, setMotivation] = useState("");
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [applicationTab, setApplicationTab] = useState("existing");
  const navigate = useNavigate();
  
  // Fetch projects, teams, and applications on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        // Fetch available projects
        const projectsResponse = await fetch(
          "http://localhost:8000/api/projects/available",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!projectsResponse.ok) {
          throw new Error("Failed to fetch projects");
        }

        const projectsData = await projectsResponse.json();
        setProjects(projectsData);

        // Fetch student teams
        const teamsResponse = await fetch(
          "http://localhost:8000/api/projects/student/teams",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (teamsResponse.ok) {
          const teamsData = await teamsResponse.json();
          setStudentTeams(teamsData);
        }

        // Fetch applications
        const applicationsResponse = await fetch(
          "http://localhost:8000/api/projects/applications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (applicationsResponse.ok) {
          const applicationsData = await applicationsResponse.json();
          setApplications(applicationsData);
        }

        // Fetch available students for team creation
        const studentsResponse = await fetch(
          "http://localhost:8000/api/projects/students/all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (studentsResponse.ok) {
          const studentsData = await studentsResponse.json();
          setAvailableStudents(studentsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Filter projects based on search query
  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    project.professor.toLowerCase().includes(searchQuery.toLowerCase()) || 
    project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Handle creating a new team
  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) {
      toast.error("Please enter a team name");
      return;
    }

    if (selectedStudents.length === 0) {
      toast.error("Please select at least one team member");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      // Find the current student in the selected students
      const currentStudentId = selectedStudents.find(s => s.email === localStorage.getItem("email"))?.id;
      
      if (!currentStudentId) {
        // Add the current student to the team if not already included
        toast.error("You must include yourself in the team");
        return;
      }

      const response = await fetch(
        "http://localhost:8000/api/projects/teams/create",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newTeamName,
            member_ids: selectedStudents.map(student => student.id),
            leader_id: currentStudentId, // Current student is the leader
            project_id: null // No project assigned yet
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create team");
      }

      const newTeam = await response.json();
      setStudentTeams([...studentTeams, newTeam]);
      setSelectedTeam(newTeam.id);
      setCreateTeamDialogOpen(false);
      setNewTeamName("");
      setSelectedStudents([]);
      toast.success("Team created successfully");
    } catch (error) {
      console.error("Error creating team:", error);
      toast.error(error.message || "Failed to create team");
    }
  };

  // Handle applying to a project
  const handleApplyToProject = async () => {
    if (applicationTab === "existing" && !selectedTeam) {
      toast.error("Please select a team");
      return;
    }

    if (applicationTab === "new") {
      if (!newTeamName.trim()) {
        toast.error("Please enter a team name");
        return;
      }

      if (selectedStudents.length === 0) {
        toast.error("Please select at least one team member");
        return;
      }

      // First create the team, then apply
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        // Create the team
        const createTeamResponse = await fetch(
          "http://localhost:8000/api/projects/teams/create",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: newTeamName,
              member_ids: selectedStudents.map(student => student.id),
              leader_id: selectedStudents[0].id, // First selected student is the leader
            }),
          }
        );

        if (!createTeamResponse.ok) {
          throw new Error("Failed to create team");
        }

        const newTeam = await createTeamResponse.json();
        setStudentTeams([...studentTeams, newTeam]);
        
        // Now apply with the new team
        const applyResponse = await fetch(
          "http://localhost:8000/api/projects/teams/apply",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              project_id: selectedProject.id,
              team_id: newTeam.id,
              motivation: motivation,
            }),
          }
        );

        if (!applyResponse.ok) {
          throw new Error("Failed to apply to project");
        }

        const newApplication = await applyResponse.json();
        setApplications([...applications, newApplication]);
        
        // Update the project's hasApplied status
        setProjects(
          projects.map(project => 
            project.id === selectedProject.id 
              ? { ...project, hasApplied: true } 
              : project
          )
        );
        
        setApplyDialogOpen(false);
        setNewTeamName("");
        setSelectedStudents([]);
        setMotivation("");
        toast.success("Team created and application submitted successfully");
      } catch (error) {
        console.error("Error creating team and applying:", error);
        toast.error("Failed to create team and apply to project");
      }
    } else {
      // Apply with existing team
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await fetch(
          "http://localhost:8000/api/projects/teams/apply",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              project_id: selectedProject.id,
              team_id: selectedTeam,
              motivation: motivation,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to apply to project");
        }

        const newApplication = await response.json();
        setApplications([...applications, newApplication]);
        
        // Update the project's hasApplied status
        setProjects(
          projects.map(project => 
            project.id === selectedProject.id 
              ? { ...project, hasApplied: true } 
              : project
          )
        );
        
        setApplyDialogOpen(false);
        setSelectedTeam(null);
        setMotivation("");
        toast.success("Application submitted successfully");
      } catch (error) {
        console.error("Error applying to project:", error);
        toast.error("Failed to apply to project");
      }
    }
  };

  // Handle withdrawing an application
  const handleWithdrawApplication = async (applicationId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await fetch(
        `http://localhost:8000/api/projects/applications/withdraw/${applicationId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to withdraw application");
      }

      // Remove the application from the list
      setApplications(applications.filter(app => app.id !== applicationId));
      
      // Update the project's hasApplied status
      const projectId = applications.find(app => app.id === applicationId)?.project_id;
      if (projectId) {
        setProjects(
          projects.map(project => 
            project.id === projectId 
              ? { ...project, hasApplied: false } 
              : project
          )
        );
      }
      
      toast.success("Application withdrawn successfully");
    } catch (error) {
      console.error("Error withdrawing application:", error);
      toast.error("Failed to withdraw application");
    }
  };

  // Handle adding/removing students from the team creation form
  const handleStudentSelect = (student) => {
    if (selectedStudents.some(s => s.id === student.id)) {
      setSelectedStudents(selectedStudents.filter(s => s.id !== student.id));
    } else {
      if (selectedStudents.length < 4) { // Maximum 4 students per team
        setSelectedStudents([...selectedStudents, student]);
      } else {
        toast.error("Maximum 4 students per team");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold">Available Projects</h2>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search projects..." 
              className="pl-10"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No projects found matching your criteria.</p>
            </div>
          ) : (
            filteredProjects.map((project) => (
              <Card key={project.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold">{project.title}</h3>
                          <Badge variant={project.status === "Open" ? "default" : "secondary"}>
                            {project.status}
                          </Badge>
                        </div>
                        
                        <p className="text-muted-foreground mb-4">{project.summary}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 text-sm mb-4">
                          <div className="flex items-center">
                            <span className="font-medium mr-2">Professor:</span> {project.professor}
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium mr-2">Department:</span> {project.department}
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium mr-2">Year Eligibility:</span> {project.yearEligibility.join(", ")}
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium mr-2">Team Size:</span> {project.teamSize}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span className="font-medium mr-2">Deadline:</span> 
                            {project.deadline ? new Date(project.deadline).toLocaleDateString() : "No deadline set"}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 items-center">
                          <div className="flex items-center text-xs text-muted-foreground mr-2">
                            <Tag className="h-3 w-3 mr-1" />
                          </div>
                          {project.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-4 md:mt-0 md:ml-4 flex flex-col items-start md:items-end">
                        <Dialog 
                          open={applyDialogOpen && selectedProject?.id === project.id} 
                          onOpenChange={(open) => {
                            if (!open) setApplyDialogOpen(false);
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button 
                              disabled={!project.isEligible || project.deadlinePassed || project.hasApplied}
                              onClick={() => {
                                setSelectedProject(project);
                                setApplyDialogOpen(true);
                              }}
                            >
                              {project.hasApplied ? "Applied" : "Apply Now"}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                              <DialogTitle>Apply to Project</DialogTitle>
                              <DialogDescription>
                                Apply to "{selectedProject?.title}" with an existing team or create a new one.
                              </DialogDescription>
                            </DialogHeader>
                            
                            <Tabs defaultValue="existing" value={applicationTab} onValueChange={setApplicationTab}>
                              <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="existing">Existing Team</TabsTrigger>
                                <TabsTrigger value="new">Create New Team</TabsTrigger>
                              </TabsList>
                              
                              <TabsContent value="existing" className="space-y-4 mt-4">
                                {studentTeams.length === 0 ? (
                                  <div className="text-center py-4">
                                    <p className="text-muted-foreground mb-2">You don't have any teams yet.</p>
                                    <Button 
                                      variant="outline" 
                                      onClick={() => setApplicationTab("new")}
                                    >
                                      Create a New Team
                                    </Button>
                                  </div>
                                ) : (
                                  <>
                                    <div className="space-y-2">
                                      <Label htmlFor="team-select">Select Team</Label>
                                      <Select 
                                        value={selectedTeam} 
                                        onValueChange={setSelectedTeam}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select a team" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {studentTeams.map(team => (
                                            <SelectItem key={team.id} value={team.id}>
                                              {team.name} ({team.members.length} members)
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <Label htmlFor="motivation">Motivation (Optional)</Label>
                                      <Textarea
                                        id="motivation"
                                        placeholder="Why is your team interested in this project?"
                                        value={motivation}
                                        onChange={(e) => setMotivation(e.target.value)}
                                      />
                                    </div>
                                  </>
                                )}
                              </TabsContent>
                              
                              <TabsContent value="new" className="space-y-4 mt-4">
                                <div className="space-y-2">
                                  <Label htmlFor="team-name">Team Name</Label>
                                  <Input
                                    id="team-name"
                                    placeholder="Enter team name"
                                    value={newTeamName}
                                    onChange={(e) => setNewTeamName(e.target.value)}
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label>Select Team Members (Max 4)</Label>
                                  <div className="border rounded-md p-2 max-h-40 overflow-y-auto">
                                    {availableStudents.map(student => (
                                      <div 
                                        key={student.id}
                                        className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
                                          selectedStudents.some(s => s.id === student.id) 
                                            ? 'bg-primary/10' 
                                            : 'hover:bg-muted'
                                        }`}
                                        onClick={() => handleStudentSelect(student)}
                                      >
                                        <div>
                                          <p className="font-medium">{student.name}</p>
                                          <p className="text-xs text-muted-foreground">{student.email}</p>
                                        </div>
                                        {selectedStudents.some(s => s.id === student.id) && (
                                          <Badge variant="outline">Selected</Badge>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {selectedStudents.map(student => (
                                      <Badge key={student.id} variant="secondary" className="flex items-center gap-1">
                                        {student.name}
                                        <X 
                                          className="h-3 w-3 cursor-pointer" 
                                          onClick={() => handleStudentSelect(student)}
                                        />
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor="new-motivation">Motivation (Optional)</Label>
                                  <Textarea
                                    id="new-motivation"
                                    placeholder="Why is your team interested in this project?"
                                    value={motivation}
                                    onChange={(e) => setMotivation(e.target.value)}
                                  />
                                </div>
                              </TabsContent>
                            </Tabs>
                            
                            <DialogFooter className="mt-4">
                              <Button variant="outline" onClick={() => setApplyDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button 
                                onClick={handleApplyToProject}
                              >
                                {applicationTab === "new" ? "Create Team & Apply" : "Apply to Project"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        
                        <div className="mt-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => navigate(`/projects/${project.id}`)}
                          >
                            View Details
                          </Button>
                        </div>
                        
                        {!project.isEligible && (
                          <p className="text-xs text-muted-foreground mt-2">
                            You don't meet eligibility requirements for this project
                          </p>
                        )}
                        {project.deadlinePassed && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Application deadline has passed
                          </p>
                        )}
                        {project.hasApplied && (
                          <p className="text-xs text-green-600 mt-2">
                            You have already applied to this project
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
      
      {/* Create Team Dialog */}
      <Dialog open={createTeamDialogOpen} onOpenChange={setCreateTeamDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a New Team</DialogTitle>
            <DialogDescription>
              Form a team to apply for projects together.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="create-team-name">Team Name</Label>
              <Input
                id="create-team-name"
                placeholder="Enter team name"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Select Team Members (Max 4)</Label>
              <div className="border rounded-md p-2 max-h-40 overflow-y-auto">
                {availableStudents.map(student => (
                  <div 
                    key={student.id}
                    className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
                      selectedStudents.some(s => s.id === student.id) 
                        ? 'bg-primary/10' 
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => handleStudentSelect(student)}
                  >
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-xs text-muted-foreground">{student.email}</p>
                    </div>
                    {selectedStudents.some(s => s.id === student.id) && (
                      <Badge variant="outline">Selected</Badge>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedStudents.map(student => (
                  <Badge key={student.id} variant="secondary" className="flex items-center gap-1">
                    {student.name}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleStudentSelect(student)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateTeamDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTeam}>
              Create Team
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Floating Action Button for Create Team */}
      <div className="fixed bottom-6 right-6">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="icon" 
                className="rounded-full h-12 w-12 shadow-lg"
                onClick={() => setCreateTeamDialogOpen(true)}
              >
                <Plus className="h-6 w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Create a New Team</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
