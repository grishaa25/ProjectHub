import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui-custom/Button";

interface StudentFormProps {
  formData: {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    studentId: string;
    course: string;
    department: string;
    year: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setStudentForm: React.Dispatch<React.SetStateAction<any>>;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
}

const StudentForm: React.FC<StudentFormProps> = ({
  formData,
  handleChange,
  setStudentForm,
  handleSubmit,
  loading,
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="johndoe"
          required
          className="h-11"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First name</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="John"
            required
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last name</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Doe"
            required
            className="h-11"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="name@example.com"
          required
          className="h-11"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="studentId">Student ID</Label>
        <Input
          id="studentId"
          value={formData.studentId}
          onChange={handleChange}
          placeholder="S12345"
          required
          className="h-11"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="department">Department</Label>
        <Select
          value={formData.department}
          onValueChange={(value) =>
            setStudentForm((prev) => ({ ...prev, department: value }))
          }
        >
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Select department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CSE">CSE</SelectItem>
            <SelectItem value="EEE">EEE</SelectItem>
            <SelectItem value="ME">ME</SelectItem>
            <SelectItem value="AI">AI</SelectItem>
            <SelectItem value="ECE">ECE</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="year">Year</Label>
        <Select
          value={formData.year}
          onValueChange={(value) =>
            setStudentForm((prev) => ({ ...prev, year: value }))
          }
        >
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1st Year">1st Year</SelectItem>
            <SelectItem value="2nd Year">2nd Year</SelectItem>
            <SelectItem value="3rd Year">3rd Year</SelectItem>
            <SelectItem value="4th Year">4th Year</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="course">Select Course</Label>
        <Select
          defaultValue="cs101"
          onValueChange={(value) =>
            setStudentForm((prev) => ({ ...prev, course: value }))
          }
        >
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Select a course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cs101">
              CS 101: Introduction to Programming
            </SelectItem>
            <SelectItem value="math201">MATH 201: Calculus</SelectItem>
            <SelectItem value="eng110">ENG 110: English Composition</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          required
          className="h-11"
        />
      </div>
      <Button type="submit" className="w-full h-11" loading={loading}>
        Create account
      </Button>
    </form>
  );
};

export default StudentForm;
