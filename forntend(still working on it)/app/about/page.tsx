"use client"

import { Navbar } from "@/components/navbar"
import { motion } from "framer-motion"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 mt-8">
        <div className="container mx-auto px-4">
          <motion.h1
            className="text-4xl font-bold mb-8 text-[#1e3a3a]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            About ProjectHub
          </motion.h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold mb-4 text-[#6b3e7c]">Our Mission</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                ProjectHub is a comprehensive platform designed to connect students with innovative projects in computer
                science, artificial intelligence, and related fields. Our mission is to empower students through
                transformative project-based learning experiences that prepare them for real-world challenges in the
                tech industry.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We believe that collaborative projects are the cornerstone of effective education in technology fields,
                allowing students to apply theoretical knowledge to practical problems while developing essential
                teamwork and communication skills that are highly valued in the industry.
              </p>
            </motion.div>

            <motion.div
              className="rounded-xl overflow-hidden shadow-lg"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <img
                src="/placeholder.svg?height=400&width=600&text=About+ProjectHub"
                alt="Students collaborating"
                className="w-full h-auto"
              />
            </motion.div>
          </div>

          <motion.h2
            className="text-3xl font-bold mb-6 text-[#1e3a3a]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Key Features
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                title: "AI-Powered Project Discovery",
                description:
                  "Our intelligent recommendation system matches students with projects that align with their skills, interests, and academic goals in computer science and AI.",
              },
              {
                title: "Expert Mentorship",
                description:
                  "Connect with experienced mentors from academia and industry who provide guidance, feedback, and insights throughout your project journey.",
              },
              {
                title: "Comprehensive Task Tracking",
                description:
                  "Stay organized with our intuitive task management system, ensuring your team meets deadlines and project milestones efficiently.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              >
                <h3 className="text-xl font-bold mb-3 text-[#6b3e7c]">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="bg-[#1e3a3a] text-white p-8 rounded-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
            <p className="text-lg mb-6">
              To create a vibrant ecosystem where students, mentors, and industry partners collaborate on innovative
              projects in computer science and AI that address real-world challenges and prepare the next generation of
              tech leaders.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">For Students</h3>
                <p>
                  Access to cutting-edge projects in AI and computer science, expert mentorship, and a supportive
                  community to develop practical skills and build an impressive technical portfolio.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">For Mentors</h3>
                <p>
                  Opportunities to guide and inspire the next generation of tech talent, share expertise, and contribute
                  to innovative solutions in computer science and artificial intelligence.
                </p>
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
