import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import PageTransition from "@/components/layout/PageTransition";
import { DashboardStatsCards } from "@/components/professor/DashboardStatsCards";
import { useNavigate } from "react-router-dom";
import DashboardTabs from "@/components/professor/dashboard/DashboardTabs";
import DashboardHeader from "@/components/professor/dashboard/DashboardHeader";

const ProfessorDashboard = () => {
  const navigate = useNavigate();
  const [notifications] = useState<number>(3);
  const [projects, setProjects] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("projects");
  const [pendingAssignmentGrading] = useState<number>(3); // Mock data for pending assignments to grade

  const handleAddProject = (newProject: any) => {
    setProjects([...projects, newProject]);
  };

  const handleViewDetails = (projectId: number) => {
    navigate(`/professor/projects/${projectId}`);
  };

  return (
    <PageTransition>
      <Navbar />
      <main className="pt-24 pb-16 min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container">
          <DashboardHeader />

          <DashboardStatsCards />

          <DashboardTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onViewDetails={handleViewDetails}
          />
        </div>
      </main>
    </PageTransition>
  );
};

export default ProfessorDashboard;
