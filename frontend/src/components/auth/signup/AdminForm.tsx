
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui-custom/Button";

interface AdminFormProps {
  formData: {
    username: string;
    fullName: string;
    email: string;
    password: string;
    adminCode: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
}

const AdminForm: React.FC<AdminFormProps> = ({ 
  formData, 
  handleChange, 
  handleSubmit, 
  loading 
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input 
          id="username" 
          value={formData.username}
          onChange={handleChange}
          placeholder="admin" 
          required 
          className="h-11" 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input 
          id="fullName" 
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Admin Full Name" 
          required 
          className="h-11" 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          type="email" 
          value={formData.email}
          onChange={handleChange}
          placeholder="admin@example.com" 
          required 
          className="h-11" 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="adminCode">Admin Invite Code</Label>
        <Input 
          id="adminCode" 
          value={formData.adminCode}
          onChange={handleChange}
          placeholder="Enter invite code" 
          required 
          className="h-11" 
        />
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
        Create admin account
      </Button>
    </form>
  );
};

export default AdminForm;
