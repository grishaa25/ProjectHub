"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { TeamFormation } from "@/components/team-formation"
import { MentorPanel } from "@/components/mentor-panel"
import { ProjectChat } from "@/components/ProjectChat"
import { ArrowLeft, Calendar, Users, BookOpen } from "lucide-react"
import { motion } from "framer-motion"
import { communityProjects } from "@/lib/data/communityProjects"

export default function CommunityProjectPage() {
  const params = useParams()
  const slug = params?.slug as string
  const project = communityProjects.find(p => p.slug === slug)

  if (!project) {
    return <div>Project not found</div>
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Link
            href="/community-projects"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Community Projects
          </Link>

          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <div className="mb-6">
              <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
              <div className="flex items-center gap-4">
                <Badge>{project.category}</Badge>
                <Badge variant="outline">{project.status}</Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Timeline</p>
                  <p className="font-medium">{project.timeline}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Team Size</p>
                  <p className="font-medium">{project.teamSize}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Skill Level</p>
                  <p className="font-medium">{project.skillLevel}</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">Project Description</h2>
              <p className="text-gray-700">{project.description}</p>
            </div>

            <div className="flex gap-4">
              <Button className="bg-[#6b3e7c] hover:bg-[#5a2e6b]">Apply Now</Button>
              <Button variant="outline">Save Project</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <TeamFormation team={project.teamMembers} />
            </div>
            <div>
              <MentorPanel
                mentor={{
                  name: project.mentor,
                  title: "Community Lead",
                  department: project.category,
                  avatar: "/placeholder.svg",
                  status: "Approved"
                }}
              />
            </div>
          </div>

          {/* Project Chat Section */}
          <section className="mt-8">
            <h2 className="text-2xl font-bold text-[#1e3a3a] mb-6">Project Discussion</h2>
            <ProjectChat slug={slug} />
          </section>
        </div>
      </main>
    </div>
  )
}
