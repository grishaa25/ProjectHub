import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui-custom/Card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui-custom/Button";
import { Search, Filter, User, Users, Briefcase, MessageSquare, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import {useAuth} from "@/contexts/AuthContext"

// Team and student interfaces
interface Team {
  id: number;
  name: string;
  members: number;
  max_members: number;
  open_positions: string[];
  tags: string[];
  projects: string[];
  is_open: boolean;
  leader_id: number;
  leader_name: string;
}

interface Student {
  id: number;
  name: string;
  year: string;
  department: string;
  skills: string[];
  interests: string[];
  availability: string;
  avatar: string | null;
  initials: string;
  teams: number[];
}

interface TeamApplication {
  id: number;
  team_id: number;
  team_name: string;
  student_id: number;
  status: string;
  message: string | null;
  created_at: string;
}

export const CollaboratorFinder = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [myTeams, setMyTeams] = useState<Team[]>([]);
  const [applications, setApplications] = useState<TeamApplication[]>([]);
  const [loading, setLoading] = useState({
    teams: true,
    students: true,
    myTeams: true,
    applications: true
  });
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState("");
  const [createTeamDialogOpen, setCreateTeamDialogOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const { toast } = useToast();
  const { userId } = useAuth();

  // Fetch all teams
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/projects/teams/all', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTeams(response.data);
        setLoading(prev => ({ ...prev, teams: false }));
      } catch (error) {
        console.error('Error fetching teams:', error);
        toast({
          title: "Error",
          description: "Failed to load teams. Please try again later.",
          variant: "destructive"
        });
        setLoading(prev => ({ ...prev, teams: false }));
      }
    };

    fetchTeams();
  }, [toast]);

  // Fetch all students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/projects/students/all', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setStudents(response.data);
        setLoading(prev => ({ ...prev, students: false }));
      } catch (error) {
        console.error('Error fetching students:', error);
        toast({
          title: "Error",
          description: "Failed to load students. Please try again later.",
          variant: "destructive"
        });
        setLoading(prev => ({ ...prev, students: false }));
      }
    };

    fetchStudents();
  }, [toast]);

  // Fetch my teams
  useEffect(() => {
    const fetchMyTeams = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/projects/teams/student', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setMyTeams(response.data);
        setLoading(prev => ({ ...prev, myTeams: false }));
      } catch (error) {
        console.error('Error fetching my teams:', error);
        toast({
          title: "Error",
          description: "Failed to load your teams. Please try again later.",
          variant: "destructive"
        });
        setLoading(prev => ({ ...prev, myTeams: false }));
      }
    };

    fetchMyTeams();
  }, [toast]);

  // Fetch my applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
          const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/projects/teams/applications', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setApplications(response.data);
        setLoading(prev => ({ ...prev, applications: false }));
      } catch (error) {
        console.error('Error fetching applications:', error);
        toast({
          title: "Error",
          description: "Failed to load your applications. Please try again later.",
          variant: "destructive"
        });
        setLoading(prev => ({ ...prev, applications: false }));
      }
    };

    fetchApplications();
  }, [toast]);

  // Handle team application
  const handleApplyToTeam = async (team: Team) => {
    setSelectedTeam(team);
    setIsDialogOpen(true);
  };

  const submitApplication = async () => {
    if (!selectedTeam) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8000/api/projects/student/teams/apply', {
        team_id: selectedTeam.id,
        student_id: userId,
        message: applicationMessage
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      toast({
        title: "Application Submitted",
        description: `You have successfully applied to join ${selectedTeam.name}.`,
      });

      // Refresh applications
      const response = await axios.get('http://localhost:8000/api/projects/teams/applications');
      setApplications(response.data);

      setIsDialogOpen(false);
      setApplicationMessage("");
      setSelectedTeam(null);
    } catch (error: unknown) {
      console.error('Error applying to team:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to submit application. Please try again.";
      
      toast({
        title: "Application Failed",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  // Handle team creation
  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) {
      toast({
        title: "Error",
        description: "Team name cannot be empty",
        variant: "destructive"
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8000/api/projects/teams', {
        name: newTeamName,
        member_ids: [] // Will be populated with the current student by the backend
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      toast({
        title: "Team Created",
        description: `Team "${newTeamName}" has been created successfully.`,
      });

      // Refresh my teams
      const myTeamsResponse = await axios.get('http://localhost:8000/api/projects/teams/student'  , {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMyTeams(myTeamsResponse.data);

      // Refresh all teams
      const allTeamsResponse = await axios.get('http://localhost:8000/api/projects/teams/all', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTeams(allTeamsResponse.data);

      setCreateTeamDialogOpen(false);
      setNewTeamName("");
    } catch (error: unknown) {
      console.error('Error creating team:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to create team. Please try again.";
      
      toast({
        title: "Team Creation Failed",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  // Filter teams and students based on search query
  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
    team.open_positions.some(pos => pos.toLowerCase().includes(searchQuery.toLowerCase())) ||
    team.projects.some(proj => proj.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
    student.interests.some(interest => interest.toLowerCase().includes(searchQuery.toLowerCase())) ||
    student.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Check if a student has already applied to a team
  const hasAppliedToTeam = (teamId: number) => {
    return applications.some(app => app.team_id === teamId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Find Collaborators</h2>
        <Button onClick={() => setCreateTeamDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Team
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by skills, names, or teams..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="sm" className="p-2 h-10 w-10">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      
      <Tabs defaultValue="teams" className="space-y-4">
        <TabsList>
          <TabsTrigger value="teams">
            <Users className="mr-2 h-4 w-4" />
            Teams
          </TabsTrigger>
          <TabsTrigger value="students">
            <User className="mr-2 h-4 w-4" />
            Students
          </TabsTrigger>
          <TabsTrigger value="my-teams">
            <Briefcase className="mr-2 h-4 w-4" />
            My Teams
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="teams" className="space-y-4">
          {loading.teams ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p>Loading teams...</p>
              </CardContent>
            </Card>
          ) : teams.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p>No teams found matching your search criteria.</p>
              </CardContent>
            </Card>
          ) : (
            teams.map(team => (
              <Card key={team.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{team.name}</h3>
                        <Badge variant={team.is_open ? "default" : "secondary"}>
                          {team.is_open ? "Open" : "Closed"}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mt-1">
                        Led by {team.leader_name} • {team.members}/{team.max_members} members
                      </p>
                      
                      {team.open_positions.length > 0 && (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium">Looking for:</h4>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {team.open_positions.map((position, index) => (
                              <Badge key={index} variant="outline">
                                {position}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {team.tags.length > 0 && (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium">Interests:</h4>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {team.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {team.projects.length > 0 && (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium">Working on:</h4>
                          <ul className="list-disc list-inside text-sm mt-1">
                            {team.projects.map((project, index) => (
                              <li key={index}>{project}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2 md:min-w-[180px]">
                      <Button 
                        disabled={!team.is_open || hasAppliedToTeam(team.id)}
                        onClick={() => handleApplyToTeam(team)}
                      >
                        {hasAppliedToTeam(team.id) 
                          ? "Applied" 
                          : team.is_open 
                            ? "Request to Join" 
                            : "Team is Full"}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Contact Team
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
        
        <TabsContent value="students" className="space-y-4">
          {loading.students ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p>Loading students...</p>
              </CardContent>
            </Card>
          ) : filteredStudents.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p>No students found matching your search criteria.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredStudents.map(student => (
                <Card key={student.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start">
                      <Avatar className="h-12 w-12 mr-4">
                        <AvatarImage src={student.avatar || ""} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {student.initials}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold">{student.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {student.year} • {student.department}
                        </p>
                        
                        <Separator className="my-3" />
                        
                        <div className="space-y-2">
                          <div>
                            <div className="text-xs font-medium">Skills:</div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {student.skills.map((skill, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-xs font-medium">Interests:</div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {student.interests.map((interest, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {interest}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center mt-3 pt-2">
                            <span className="text-xs text-muted-foreground">
                              Availability: {student.availability}
                            </span>
                            <Button size="sm">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              Connect
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="my-teams" className="space-y-4">
          {loading.myTeams ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p>Loading your teams...</p>
              </CardContent>
            </Card>
          ) : myTeams.length === 0 ? (
            <Card>
              <CardContent className="p-10 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">You're not in any teams yet</h3>
                <p className="text-muted-foreground mb-4">Create a team or join an existing one to collaborate on projects.</p>
                <div className="flex justify-center gap-2">
                  <Button onClick={() => setCreateTeamDialogOpen(true)}>Create a Team</Button>
                  <Button variant="outline" onClick={() => document.querySelector('[value="teams"]')?.dispatchEvent(new Event('click'))}>
                    Browse Teams
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            myTeams.map(team => (
              <Card key={team.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{team.name}</h3>
                        <Badge variant={team.is_open ? "default" : "secondary"}>
                          {team.is_open ? "Open" : "Closed"}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mt-1">
                        Led by {team.leader_name} • {team.members}/{team.max_members} members
                      </p>
                      
                      {team.projects.length > 0 && (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium">Working on:</h4>
                          <ul className="list-disc list-inside text-sm mt-1">
                            {team.projects.map((project, index) => (
                              <li key={index}>{project}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2 md:min-w-[180px]">
                      <Button>
                        View Team
                      </Button>
                      {team.leader_id === students.find(s => s.teams.includes(team.id))?.id && (
                        <Button variant="outline">
                          Manage Applications
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Team Application Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply to Join Team</DialogTitle>
            <DialogDescription>
              Send a request to join {selectedTeam?.name}. The team leader will review your application.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Introduce yourself and explain why you want to join this team..."
                value={applicationMessage}
                onChange={(e) => setApplicationMessage(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={submitApplication}>Submit Application</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Team Dialog */}
      <Dialog open={createTeamDialogOpen} onOpenChange={setCreateTeamDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a New Team</DialogTitle>
            <DialogDescription>
              Start a new team and invite other students to collaborate on projects.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="teamName">Team Name</Label>
              <Input
                id="teamName"
                placeholder="Enter a name for your team"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateTeamDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateTeam}>Create Team</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
