// App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StudentDashboard from "./pages/StudentDashboard";
import ProfessorDashboard from "./pages/ProfessorDashboard";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AssignmentCreationPage from "./pages/AssignmentCreationPage";
import AssignmentDashboardPage from "./pages/AssignmentDashboardPage";
import SubmissionManagementPage from "./pages/SubmissionManagementPage";
import AssignmentDetailPage from "./pages/AssignmentDetailPage";
import StudentAssignmentsPage from "./pages/StudentAssignmentsPage";
import StudentAssignmentDetailPage from "./pages/StudentAssignmentDetailPage";
import { StudentProjectDetails } from "./components/students/StudentProjectDetails";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AnimatePresence mode="wait">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Redirect root to login if unauthenticated */}
              <Route path="/" element={<Navigate to="/login" replace />} />

              {/* Protected routes */}
              <Route
                path="/professor"
                element={
                  <ProtectedRoute allowedRoles={["professor"]}>
                    <ProfessorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects/:projectId"
                element={
                  <ProtectedRoute allowedRoles={["professor", "student"]}>
                    <ProjectDetailsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/professor/projects/:projectId"
                element={
                  <ProtectedRoute allowedRoles={["professor"]}>
                    <ProjectDetailsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/projects/:projectId"
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <StudentProjectDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/professor/assignments"
                element={
                  <ProtectedRoute allowedRoles={["professor"]}>
                    <AssignmentDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/professor/assignments/create"
                element={
                  <ProtectedRoute allowedRoles={["professor"]}>
                    <AssignmentCreationPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/professor/assignments/:assignmentId"
                element={
                  <ProtectedRoute allowedRoles={["professor"]}>
                    <AssignmentDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/professor/assignments/:assignmentId/submissions"
                element={
                  <ProtectedRoute allowedRoles={["professor"]}>
                    <SubmissionManagementPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/student"
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/assignments"
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <StudentAssignmentsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/assignments/:assignmentId"
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <StudentAssignmentDetailPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
