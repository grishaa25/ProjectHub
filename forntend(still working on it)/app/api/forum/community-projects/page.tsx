"use client"

import { Navbar } from "@/components/navbar"
import { ProjectCard } from "@/components/project-card"
import { motion } from "framer-motion"

const communityProjects = [
  {
    id: "c1",
    title: "Open Source Web Framework",
    category: "Web Development",  // bg-orange-500
    mentor: "Community Project",
    skillLevel: "Intermediate" as const,
    description: "Collaborative project to build a modern web framework for developers."
  },
  {
    id: "c2",
    title: "Mobile Learning App",
    category: "Mobile Development",  // bg-blue-500
    mentor: "Community Project",
    skillLevel: "Beginner" as const,
    description: "Student-led initiative to create an educational mobile application."
  },
  {
    id: "c3",
    title: "Smart Campus IoT",
    category: "Internet of Things",  // bg-emerald-500
    mentor: "Community Project",
    skillLevel: "Intermediate" as const,
    description: "Collaborative IoT project to enhance campus facilities and services."
  },
  {
    id: "c4",
    title: "Campus Navigation App",
    category: "Campus Navigation",  // bg-yellow-500
    mentor: "Community Project",
    skillLevel: "Intermediate" as const,
    description: "Build an indoor navigation system for campus buildings."
  },
  {
    id: "c5",
    title: "AI Chatbot for University Services",
    category: "AI Chatbot",  // bg-indigo-600
    mentor: "Community Project",
    skillLevel: "Beginner" as const,
    description: "Student-built chatbot to answer campus FAQs and connect services."
  },
  {
    id: "c6",
    title: "Open Data Dashboard",
    category: "Data Dashboard",  // bg-pink-600
    mentor: "Community Project",
    skillLevel: "Intermediate" as const,
    description: "Build a dashboard to display public and student-generated data."
  }
]

export default function CommunityProjectsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 bg-gray-50 mt-8">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-4">Community-Based Projects</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join exciting student-led projects and collaborate with peers on innovative solutions.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {communityProjects.map((project, index) => (
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
        </div>
      </main>
    </div>
  )
}