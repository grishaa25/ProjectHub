import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui-custom/Card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  Users,
  MoreVertical,
  Edit,
  Trash,
  Share,
  Search,
  Eye,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui-custom/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { CreateProject } from "./CreateProject";

interface ProjectManagementProps {
  onViewDetails?: (projectId: number) => void;
}

export const ProjectManagement = ({
  onViewDetails,
}: ProjectManagementProps) => {
  const [projects, setProjects] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await fetch(
          "http://localhost:8000/api/projects/list",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }

        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  // Handle adding a new project
  const handleAddProject = async (newProject: any) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8000/api/projects/create",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newProject),
        }
      );

      if (response.ok) {
        const createdProject = await response.json();
        setProjects([...projects, createdProject]);
        toast.success("Project added successfully!");
      } else {
        toast.error("Failed to create project.");
      }
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("An error occurred while creating the project.");
    }
  };

  // Handle deleting a project
  const handleDeleteProject = (projectId: number) => {
    setProjects(projects.filter((project) => project.id !== projectId));
    toast.success("Project deleted successfully");
  };

  // Filter projects by status and search query
  const filteredProjects = projects
    .filter((project) => {
      switch (filter) {
        case "open":
          return project.status === "Open";
        case "in-progress":
          return project.status === "In Progress";
        case "completed":
          return project.status === "Completed";
        case "cancelled":
          return project.status === "Cancelled";
        default:
          return true; // "all" filter
      }
    })
    .filter(
      (project) =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.academicYear
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        project.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-amber-500";
      case "In Progress":
        return "bg-blue-500";
      case "Completed":
        return "bg-green-500";
      case "Cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filter === "all" ? "primary" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All Projects
          </Button>
          <Button
            variant={filter === "open" ? "primary" : "outline"}
            size="sm"
            onClick={() => setFilter("open")}
          >
            Open
          </Button>
          <Button
            variant={filter === "in-progress" ? "primary" : "outline"}
            size="sm"
            onClick={() => setFilter("in-progress")}
          >
            In Progress
          </Button>
          <Button
            variant={filter === "completed" ? "primary" : "outline"}
            size="sm"
            onClick={() => setFilter("completed")}
          >
            Completed
          </Button>
          <Button
            variant={filter === "cancelled" ? "primary" : "outline"}
            size="sm"
            onClick={() => setFilter("cancelled")}
          >
            Cancelled
          </Button>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <CreateProject onProjectCreated={handleAddProject} />
        </div>
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">No projects found</div>
          <CreateProject onProjectCreated={handleAddProject} />
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <Card
            key={project.id}
            variant="glass"
            animation="fade"
            className="hover:shadow-md transition-all"
          >
            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <Badge
                  className={`${getStatusColor(project.status)} text-white`}
                >
                  {project.status}
                </Badge>
                <div className="flex items-center">
                  {project.hasNewTeamRequest && (
                    <Badge variant="secondary" className="mr-2">
                      New Team Request
                    </Badge>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          onViewDetails && onViewDetails(project.id)
                        }
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Project
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share className="mr-2 h-4 w-4" />
                        Share Project
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDeleteProject(project.id)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete Project
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {project.description}
              </p>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{project.academicYear}</span>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Users className="h-3 w-3 mr-1" />
                    <span>{project.students} teams</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mt-2">
                  {project.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => onViewDetails && onViewDetails(project.id)}
                >
                  <Eye className="h-3 w-3 mr-2" /> View Details
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
