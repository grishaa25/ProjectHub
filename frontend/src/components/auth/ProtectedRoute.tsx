import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({
  children,
  allowedRoles = [],
}: ProtectedRouteProps) => {
  const { isAuthenticated, userRole, loading } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has the required role
  if (allowedRoles.length > 0 && userRole && !allowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard based on role
    if (userRole === "student") {
      return <Navigate to="/dashboard" replace />;
    } else if (userRole === "professor") {
      return <Navigate to="/professor" replace />;
    } else if (userRole === "admin") {
      return <Navigate to="/admin" replace />;
    }

    // Fallback to login if role is invalid
    return <Navigate to="/login" replace />;
  }

  // If all checks pass, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;
