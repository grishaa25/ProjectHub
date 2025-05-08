
import React from "react";
import PageTransition from "@/components/layout/PageTransition";
import { Navbar } from "@/components/layout/Navbar";
import { AssignmentCreationForm } from "@/components/professor/AssignmentCreationForm";

const AssignmentCreationPage = () => {
  return (
    <PageTransition>
      <Navbar />
      <main className="pt-24 pb-16 min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container max-w-5xl">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Create Assignment</h1>
          <p className="text-muted-foreground mb-6">
            Fill in the details below to create a new assignment for your students.
          </p>
          
          <AssignmentCreationForm />
        </div>
      </main>
    </PageTransition>
  );
};

export default AssignmentCreationPage;
