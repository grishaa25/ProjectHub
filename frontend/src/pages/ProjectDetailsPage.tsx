import React from "react";
import { useParams } from "react-router-dom"; // ← import this
import { Navbar } from "@/components/layout/Navbar";
import PageTransition from "@/components/layout/PageTransition";
import ProjectDetails from "@/components/professor/ProjectDetails";

const ProjectDetailsPage = () => {
  const { projectId } = useParams<{ projectId: string }>(); // ← get projectId from the route

  return (
    <PageTransition>
      <Navbar />
      <main className="pt-24 pb-16 min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container">
          {/* Pass projectId down as a prop */}
          {projectId && <ProjectDetails projectId={parseInt(projectId)} />}
        </div>
      </main>
    </PageTransition>
  );
};

export default ProjectDetailsPage;
