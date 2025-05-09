"use client"

import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Database, Code, Brain, Shield, Cloud, Bookmark, Navigation, MessageSquare, Activity, Zap } from "lucide-react"

interface ProjectCardProps {
  id: string
  title: string
  category: string
  mentor: string
  skillLevel: "Beginner" | "Intermediate" | "Advanced"
  status?: "Pending" | "Under Review" | "Approved" | null
  description?: string
}

const categoryColors = {
  // Community Projects Colors
  "Web Development": "bg-orange-500",
  "Mobile Development": "bg-blue-500",
  "Internet of Things": "bg-emerald-500",
  "Campus Navigation": "bg-yellow-500",
  "AI Chatbot": "bg-indigo-600",
  "Data Dashboard": "bg-pink-600",
  
  // Mentor Projects Colors
  "Computer Science": "bg-purple-500",
  "Environmental Engineering": "bg-green-600",
  "Medical Technology": "bg-violet-600",
  "Neural Engineering": "bg-red-500",
  "Climate Science + ML": "bg-sky-500",
  "Smart Prosthetics": "bg-rose-600",
  
  // Default fallback
  default: "bg-slate-600"
}

const categoryIcons = {
  "Web Development": Code,
  "Mobile Development": Navigation,
  "Artificial Intelligence": Brain,
  "Computer Science": Database,
  "Data Science": Database,
  "Internet of Things": Cloud,
  "Environmental Engineering": Shield,
  "Medical Technology": Activity,
  "Neural Engineering": Zap,
  default: Code
}

export function ProjectCard({ id, title, category, mentor, skillLevel, status, description }: ProjectCardProps) {
  const bgColor = categoryColors[category as keyof typeof categoryColors] || categoryColors.default
  const Icon = categoryIcons[category as keyof typeof categoryIcons] || categoryIcons.default
  const router = useRouter()

  // Generate slug from title
  const slug = title.toLowerCase().replace(/\s+/g, "-")
  
  // Determine route base from mentor type
  const routeBase = mentor === "Community Project" ? "community-projects" : "mentor-projects"

  const handleApply = () => {
    router.push(`/${routeBase}/${slug}`)
  }

  return (
    <motion.div
      className={`${bgColor} text-white p-8 rounded-xl shadow-md h-full`}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex justify-between items-start mb-6">
        <Icon className="h-10 w-10" />
        <Badge className="bg-white/20 text-white">{skillLevel}</Badge>
      </div>

      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      {description && (
        <p className="mb-6 text-white/90">{description}</p>
      )}
      <p className="text-sm text-white/80 mb-6">
        Mentor: <span className="font-medium">{mentor}</span>
      </p>

      <div className="flex justify-between items-center">
        <Link href={`/${routeBase}/${slug}`}>
          <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none">
            View Details
          </Button>
        </Link>
        <Button 
          onClick={handleApply}
          className="bg-white text-[#1e3a3a] hover:bg-white/90"
        >
          Apply Now
        </Button>
      </div>
    </motion.div>
  )
}
