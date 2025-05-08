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

interface ProfessorFormProps {
  formData: {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    department: string;
    title: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setProfessorForm: React.Dispatch<React.SetStateAction<any>>;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
}

const ProfessorForm: React.FC<ProfessorFormProps> = ({
  formData,
  handleChange,
  setProfessorForm,
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
          placeholder="profsmith"
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
            placeholder="Jane"
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
            placeholder="Smith"
            required
            className="h-11"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Institutional Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="jsmith@university.edu"
          required
          className="h-11"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="department">Department</Label>
        <Select
          defaultValue="CSE"
          onValueChange={(value) =>
            setProfessorForm((prev) => ({ ...prev, department: value }))
          }
        >
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Select a department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CSE">Computer Science</SelectItem>
            <SelectItem value="EEE">Electrical and Electronics Engineering</SelectItem>
            <SelectItem value="ME">Mechanical Engineering</SelectItem>
            <SelectItem value="AI">Artificial Intelligence</SelectItem>
            <SelectItem value="ECE">Electronics and Communication Engineering</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Select
          defaultValue="ASST_PROF"
          onValueChange={(value) =>
            setProfessorForm((prev) => ({ ...prev, title: value }))
          }
        >
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Select a title" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Asst. Prof">Asst. Prof</SelectItem>
            <SelectItem value="Assoc. Prof">Assoc. Prof</SelectItem>
            <SelectItem value="Prof">Prof</SelectItem>
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

export default ProfessorForm;
