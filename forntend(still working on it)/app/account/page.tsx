"use client"

import type React from "react"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function AccountPage() {
  // Mock user data
  const userData = {
    name: "John Doe",
    email: "john.doe@university.edu",
    role: "student",
    department: "Computer Science",
    skills: ["React", "JavaScript", "Machine Learning", "Python"],
    bio: "Computer Science student with a passion for AI and web development. Looking to collaborate on innovative projects.",
    github: "https://github.com/johndoe",
    linkedin: "https://linkedin.com/in/johndoe",
    projects: [
      {
        id: "1",
        title: "AI-Powered Healthcare Assistant",
        status: "In Progress",
        role: "Team Lead",
      },
      {
        id: "2",
        title: "Machine Learning for Stock Prediction",
        status: "Completed",
        role: "Developer",
      },
    ],
    certificates: [
      {
        id: "1",
        title: "Machine Learning Specialization",
        issuer: "Coursera",
        date: "2023-01-15",
      },
      {
        id: "2",
        title: "Full Stack Web Development",
        issuer: "Udemy",
        date: "2022-08-10",
      },
    ],
  }

  const [formData, setFormData] = useState(userData)

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
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 bg-gray-50 mt-8">
        <div className="container mx-auto px-4">
          <motion.div
            className="flex flex-col md:flex-row items-start gap-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-xl shadow-sm p-6 w-full md:w-64 flex flex-col items-center">
              <Avatar className="h-32 w-32 mb-4">
                <img src="/placeholder.svg?height=128&width=128&text=JD" alt={userData.name} />
              </Avatar>
              <h2 className="text-xl font-bold text-center">{userData.name}</h2>
              <p className="text-gray-500 text-center mb-4">{userData.department}</p>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {userData.skills.slice(0, 3).map((skill) => (
                  <Badge key={skill} className="bg-[#f0e5ff] text-[#6b3e7c]">
                    {skill}
                  </Badge>
                ))}
                {userData.skills.length > 3 && (
                  <Badge className="bg-gray-100 text-gray-700">+{userData.skills.length - 3}</Badge>
                )}
              </div>
              <Button className="w-full bg-[#6b3e7c] hover:bg-[#5a2e6b]">Edit Profile</Button>
            </div>

            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-6 text-[#1e3a3a]">Your Account</h1>
              <p className="text-gray-600 mb-6">
                Manage your profile, view your projects, and track your progress on ProjectHub.
              </p>

              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <Tabs defaultValue="profile">
                  <TabsList className="bg-gray-100 p-0 h-14">
                    <TabsTrigger value="profile" className="h-14 px-8 data-[state=active]:bg-white rounded-none">
                      Profile Information
                    </TabsTrigger>
                    <TabsTrigger value="projects" className="h-14 px-8 data-[state=active]:bg-white rounded-none">
                      My Projects
                    </TabsTrigger>
                    <TabsTrigger value="certificates" className="h-14 px-8 data-[state=active]:bg-white rounded-none">
                      Certificates
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="h-14 px-8 data-[state=active]:bg-white rounded-none">
                      Settings
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="profile" className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
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
                          <Select
                            id="department"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select Department</option>
                            <option value="Computer Science">Computer Science</option>
                            <option value="Artificial Intelligence">Artificial Intelligence</option>
                            <option value="Data Science">Data Science</option>
                            <option value="Cybersecurity">Cybersecurity</option>
                            <option value="Software Engineering">Software Engineering</option>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="skills">Skills (comma separated)</Label>
                        <Input
                          id="skills"
                          name="skills"
                          value={formData.skills.join(", ")}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, skills: e.target.value.split(",").map((s) => s.trim()) }))
                          }
                          placeholder="React, JavaScript, Machine Learning, Python"
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

                      <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline">
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-[#6b3e7c] hover:bg-[#5a2e6b]">
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  </TabsContent>

                  <TabsContent value="projects" className="p-6">
                    <h2 className="text-2xl font-bold mb-6">My Projects</h2>

                    <div className="space-y-4">
                      {userData.projects.map((project) => (
                        <motion.div
                          key={project.id}
                          className="border rounded-lg p-4 hover:border-[#6b3e7c] transition-colors"
                          whileHover={{ y: -2 }}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-bold">{project.title}</h3>
                              <p className="text-gray-500">Role: {project.role}</p>
                            </div>
                            <Badge
                              className={
                                project.status === "Completed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-blue-100 text-blue-800"
                              }
                            >
                              {project.status}
                            </Badge>
                          </div>
                          <div className="flex gap-3 mt-4">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                            <Button variant="outline" size="sm">
                              View Tasks
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-6">
                      <Button className="bg-[#6b3e7c] hover:bg-[#5a2e6b]">Browse New Projects</Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="certificates" className="p-6">
                    <h2 className="text-2xl font-bold mb-6">My Certificates</h2>

                    <div className="space-y-4">
                      {userData.certificates.map((certificate) => (
                        <motion.div
                          key={certificate.id}
                          className="border rounded-lg p-4 hover:border-[#6b3e7c] transition-colors"
                          whileHover={{ y: -2 }}
                        >
                          <h3 className="text-lg font-bold">{certificate.title}</h3>
                          <p className="text-gray-500">Issuer: {certificate.issuer}</p>
                          <p className="text-gray-500">Date: {certificate.date}</p>
                          <div className="flex gap-3 mt-4">
                            <Button variant="outline" size="sm">
                              View Certificate
                            </Button>
                            <Button variant="outline" size="sm">
                              Share
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-6">
                      <Button className="bg-[#6b3e7c] hover:bg-[#5a2e6b]">Upload New Certificate</Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="settings" className="p-6">
                    <h2 className="text-2xl font-bold mb-6">Account Settings</h2>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="password">Change Password</Label>
                        <Input id="password" name="password" type="password" placeholder="Enter new password" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          placeholder="Confirm new password"
                        />
                      </div>

                      <div className="pt-4 border-t">
                        <h3 className="text-lg font-bold mb-2">Notification Settings</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="emailNotifications">Email Notifications</Label>
                            <input type="checkbox" id="emailNotifications" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="projectUpdates">Project Updates</Label>
                            <input type="checkbox" id="projectUpdates" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="mentorMessages">Mentor Messages</Label>
                            <input type="checkbox" id="mentorMessages" defaultChecked />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline">
                          Cancel
                        </Button>
                        <Button type="button" className="bg-[#6b3e7c] hover:bg-[#5a2e6b]">
                          Save Settings
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <footer className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} ProjectHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
