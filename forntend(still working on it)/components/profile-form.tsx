// Component: Replicates profile & settings form
"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Label } from "./ui/label"
import { Select } from "./ui/select"

interface ProfileFormProps {
  initialData?: {
    name: string
    email: string
    role: string
    department: string
    skills: string[]
    bio: string
    github: string
    linkedin: string
  }
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const [formData, setFormData] = useState(
    initialData || {
      name: "",
      email: "",
      role: "student",
      department: "",
      skills: [],
      bio: "",
      github: "",
      linkedin: "",
    },
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would submit to an API
    console.log("Form submitted:", formData)
    alert("Profile updated successfully!")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john.doe@university.edu"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select id="role" name="role" value={formData.role} onChange={handleChange} required>
            <option value="student">Student</option>
            <option value="mentor">Mentor</option>
            <option value="admin">Administrator</option>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Select id="department" name="department" value={formData.department} onChange={handleChange} required>
            <option value="">Select Department</option>
            <option value="engineering">Engineering & Computer Science</option>
            <option value="business">Business</option>
            <option value="creative">Creative Arts</option>
            <option value="medical">Medical Science</option>
            <option value="communication">Mass Communication</option>
            <option value="physiotherapy">Physiotherapy</option>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="skills">Skills (comma separated)</Label>
        <Input
          id="skills"
          name="skills"
          value={formData.skills.join(", ")}
          onChange={(e) => setFormData((prev) => ({ ...prev, skills: e.target.value.split(",").map((s) => s.trim()) }))}
          placeholder="React, JavaScript, UI/UX Design"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Tell us about yourself..."
          rows={4}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="github">GitHub Profile</Label>
          <Input
            id="github"
            name="github"
            value={formData.github}
            onChange={handleChange}
            placeholder="https://github.com/username"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedin">LinkedIn Profile</Label>
          <Input
            id="linkedin"
            name="linkedin"
            value={formData.linkedin}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/username"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Change Password</Label>
        <Input id="password" name="password" type="password" placeholder="Leave blank to keep current password" />
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" className="bg-[#6b3e7c] hover:bg-[#5a2e6b]">
          Save Changes
        </Button>
      </div>
    </form>
  )
}
