
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import NotFound from "./pages/NotFound";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardRedirect from "./pages/DashboardRedirect";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentApplications from "./pages/student/StudentApplications";
import StudentMeetings from "./pages/student/StudentMeetings";
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import FacultyProjects from "./pages/faculty/FacultyProjects";
import FacultyMeetings from "./pages/faculty/FacultyMeetings";
import NewProject from "./pages/faculty/NewProject";
import NewMeeting from "./pages/faculty/NewMeeting";
import ProtectedRoute from "./components/ProtectedRoute";
import { UserRole } from "./types";
import { useEffect } from "react";
import { initializeDatabase } from "./lib/db";

const queryClient = new QueryClient();

const App = () => {
  // Initialize the mock database with sample data
  useEffect(() => {
    initializeDatabase();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Welcome />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Dashboard Redirect */}
              <Route 
                path="/dashboard/redirect" 
                element={
                  <ProtectedRoute>
                    <DashboardRedirect />
                  </ProtectedRoute>
                } 
              />
              
              {/* Student Routes */}
              <Route 
                path="/dashboard/student" 
                element={
                  <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
                    <StudentDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/student/applications" 
                element={
                  <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
                    <StudentApplications />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/student/meetings" 
                element={
                  <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
                    <StudentMeetings />
                  </ProtectedRoute>
                } 
              />
              
              {/* Faculty Routes */}
              <Route 
                path="/dashboard/faculty" 
                element={
                  <ProtectedRoute allowedRoles={[UserRole.FACULTY]}>
                    <FacultyDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/faculty/projects" 
                element={
                  <ProtectedRoute allowedRoles={[UserRole.FACULTY]}>
                    <FacultyProjects />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/faculty/projects/new" 
                element={
                  <ProtectedRoute allowedRoles={[UserRole.FACULTY]}>
                    <NewProject />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/faculty/meetings" 
                element={
                  <ProtectedRoute allowedRoles={[UserRole.FACULTY]}>
                    <FacultyMeetings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/faculty/meetings/new/:applicationId" 
                element={
                  <ProtectedRoute allowedRoles={[UserRole.FACULTY]}>
                    <NewMeeting />
                  </ProtectedRoute>
                } 
              />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
