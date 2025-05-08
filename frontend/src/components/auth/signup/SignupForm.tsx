import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui-custom/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import StudentForm from "./StudentForm";
import ProfessorForm from "./ProfessorForm";
import AdminForm from "./AdminForm";

export const SignupForm = () => {
  const [activeTab, setActiveTab] = useState("student");
  const { register, loading } = useAuth();

  // Student form states
  const [studentForm, setStudentForm] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    studentId: "",
    course: "",
    department: "",
    year: "",
  });

  // Professor form states
  const [professorForm, setProfessorForm] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    department: "",
    title: "",
  });

  // Admin form states
  const [adminForm, setAdminForm] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    adminCode: "",
  });

  const handleStudentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setStudentForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleProfessorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProfessorForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleAdminChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setAdminForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let userData;

      if (activeTab === "student") {
        userData = {
          username: studentForm.username,
          fullname: `${studentForm.firstName} ${studentForm.lastName}`,
          email: studentForm.email,
          password: studentForm.password,
          role: "student",
          department: studentForm.department,
          year: studentForm.year,
        };
      } else if (activeTab === "professor") {
        userData = {
          username: professorForm.username,
          fullname: `${professorForm.firstName} ${professorForm.lastName}`,
          email: professorForm.email,
          password: professorForm.password,
          role: "professor",
          department: professorForm.department,
          title: professorForm.title,
        };
      } else {
        userData = {
          username: adminForm.username,
          fullname: adminForm.fullName,
          email: adminForm.email,
          password: adminForm.password,
          role: "admin",
          adminCode: adminForm.adminCode,
        };
      }

      await register(userData);
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <Card variant="glass" className="w-full max-w-md mx-auto" animation="scale">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-bold text-center">
          Create an account
        </CardTitle>
        <CardDescription className="text-center">
          Choose your role and enter your details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="student"
          className="w-full"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="student">Student</TabsTrigger>
            <TabsTrigger value="professor">Professor</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </TabsList>

          <TabsContent value="student">
            <StudentForm
              formData={studentForm}
              handleChange={handleStudentChange}
              setStudentForm={setStudentForm}
              handleSubmit={handleSubmit}
              loading={loading}
            />
          </TabsContent>

          <TabsContent value="professor">
            <ProfessorForm
              formData={professorForm}
              handleChange={handleProfessorChange}
              setProfessorForm={setProfessorForm}
              handleSubmit={handleSubmit}
              loading={loading}
            />
          </TabsContent>

          <TabsContent value="admin">
            <AdminForm
              formData={adminForm}
              handleChange={handleAdminChange}
              handleSubmit={handleSubmit}
              loading={loading}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-medium text-primary hover:underline underline-offset-4"
          >
            Sign in
          </a>
        </p>
      </CardFooter>
    </Card>
  );
};

export default SignupForm;
