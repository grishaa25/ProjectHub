
import React from "react";
import { Bell, FileTextIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui-custom/Button";
import { CreateProject } from "@/components/professor/CreateProject";
import { useNavigate } from "react-router-dom";


const DashboardHeader = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">Project Hub</h1>
        <p className="text-muted-foreground mt-1">
          Manage projects, track progress, and collaborate with students
        </p>
      </div>
      <div className="flex gap-3">
      </div>
    </div>
  );
};

export default DashboardHeader;
