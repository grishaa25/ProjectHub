import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { SignupForm } from "@/components/auth/AuthForms";
import PageTransition from "@/components/layout/PageTransition";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const Signup = () => {
  const { isAuthenticated, userRole } = useAuth();

  // If already logged in, redirect to appropriate dashboard
  if (isAuthenticated && userRole) {
    if (userRole === "student") return <Navigate to="/dashboard" replace />;
    if (userRole === "professor") return <Navigate to="/professor" replace />;
    if (userRole === "admin") return <Navigate to="/admin" replace />;
  }

  return (
    <PageTransition>
      <Navbar />
      <main className="pt-28 pb-16 md:pt-36 md:pb-24 min-h-screen flex items-center">
        <div className="container max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">Join ProjectHub</h1>
            <p className="text-muted-foreground">
              Collaborate, Contribute, Create
            </p>
          </div>
          <SignupForm />
        </div>
      </main>
    </PageTransition>
  );
};

export default Signup;
