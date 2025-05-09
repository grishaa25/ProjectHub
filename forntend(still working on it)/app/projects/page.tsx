"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { motion } from "framer-motion"
import { Search, SlidersHorizontal } from "lucide-react"

// Mock data for projects
const allProjects = [
  {
    id: "1",
    title: "AI-Powered Healthcare Assistant",
    category: "Artificial Intelligence",
    mentor: "Dr. Sarah Johnson",
    skillLevel: "Intermediate" as const,
  },
  {
    id: "2",
    title: "Predictive Analytics Dashboard",
    category: "Data Science",
    mentor: "Prof. Michael Chen",
    skillLevel: "Beginner" as const,
  },
  {
    id: "3",
    title: "AR/VR Educational Platform",
    category: "Mobile App Development",
    mentor: "Dr. Emily Rodriguez",
    skillLevel: "Advanced" as const,
  },
  {
    id: "4",
    title: "Medical Image Classification",
    category: "Machine Learning",
    mentor: "Dr. James Wilson",
    skillLevel: "Intermediate" as const,
  },
  {
    id: "5",
    title: "Blockchain-based Supply Chain",
    category: "Blockchain",
    mentor: "Prof. Lisa Thompson",
    skillLevel: "Beginner" as const,
  },
  {
    id: "6",
    title: "Smart Home IoT System",
    category: "Internet of Things",
    mentor: "Dr. Robert Brown",
    skillLevel: "Intermediate" as const,
  },
  {
    id: "7",
    title: "Cybersecurity Threat Detection",
    category: "Cybersecurity",
    mentor: "Dr. Michael Lee",
    skillLevel: "Advanced" as const,
  },
  {
    id: "8",
    title: "Cloud-based ML Pipeline",
    category: "Cloud Computing",
    mentor: "Prof. Jennifer Adams",
    skillLevel: "Intermediate" as const,
  },
  {
    id: "9",
    title: "Full-Stack E-commerce Platform",
    category: "Web Development",
    mentor: "Dr. David Kim",
    skillLevel: "Advanced" as const,
  },
]

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [skillLevelFilter, setSkillLevelFilter] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  const filteredProjects = allProjects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.mentor.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "" || project.category === categoryFilter

    const matchesSkillLevel = skillLevelFilter === "" || project.skillLevel === skillLevelFilter

    return matchesSearch && matchesCategory && matchesSkillLevel
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 bg-gray-50 mt-8">
        <div className="container mx-auto px-4">
          <motion.div
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-[#1e3a3a]">Explore Projects</h1>

            <div className="flex gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search projects..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2" onClick={toggleFilters}>
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </motion.div>

          {showFilters && (
            <motion.div
              className="bg-white p-6 rounded-xl shadow-sm mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="w-full">
                  <option value="">All Categories</option>
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile App Development">Mobile App Development</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Cloud Computing">Cloud Computing</option>
                  <option value="Blockchain">Blockchain</option>
                  <option value="Internet of Things">Internet of Things</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skill Level</label>
                <Select
                  value={skillLevelFilter}
                  onChange={(e) => setSkillLevelFilter(e.target.value)}
                  className="w-full"
                >
                  <option value="">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </Select>
              </div>
            </motion.div>
          )}

          {filteredProjects.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                >
                  <ProjectCard {...project} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-xl font-medium text-gray-600 mb-2">No projects found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </motion.div>
          )}
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
