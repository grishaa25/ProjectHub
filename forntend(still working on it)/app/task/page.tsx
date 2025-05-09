"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Plus, MoreHorizontal, Calendar, Trash2, Edit, CheckCircle } from "lucide-react"

interface Task {
  id: string
  title: string
  dueDate: string
  status: "todo" | "in-progress" | "done"
  project: string
  priority: "low" | "medium" | "high"
}

// Mock data for tasks
const initialTasks: Task[] = [
  {
    id: "1",
    title: "Research neural network architectures",
    dueDate: "2023-05-15",
    status: "todo",
    project: "AI-Powered Healthcare Assistant",
    priority: "high",
  },
  {
    id: "2",
    title: "Create project proposal document",
    dueDate: "2023-05-20",
    status: "todo",
    project: "AI-Powered Healthcare Assistant",
    priority: "medium",
  },
  {
    id: "3",
    title: "Meet with mentor for initial guidance",
    dueDate: "2023-05-10",
    status: "in-progress",
    project: "AI-Powered Healthcare Assistant",
    priority: "high",
  },
  {
    id: "4",
    title: "Develop prototype UI mockups",
    dueDate: "2023-05-25",
    status: "in-progress",
    project: "AI-Powered Healthcare Assistant",
    priority: "medium",
  },
  {
    id: "5",
    title: "Complete literature review",
    dueDate: "2023-05-05",
    status: "done",
    project: "AI-Powered Healthcare Assistant",
    priority: "medium",
  },
  {
    id: "6",
    title: "Set up development environment",
    dueDate: "2023-05-08",
    status: "done",
    project: "AI-Powered Healthcare Assistant",
    priority: "low",
  },
]

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [showCompleted, setShowCompleted] = useState(true)

  const getTasksByStatus = (status: Task["status"]) => {
    return tasks.filter((task) => {
      if (status === "done" && !showCompleted) {
        return false
      }
      return task.status === status
    })
  }

  const priorityColors = {
    low: "bg-blue-100 text-blue-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  }

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
            <h1 className="text-4xl font-bold text-[#1e3a3a]">Task Tracking</h1>

            <div className="flex gap-3">
              <Button className="bg-[#6b3e7c] hover:bg-[#5a2e6b] flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Task
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCompleted(!showCompleted)}
                className={showCompleted ? "" : "bg-gray-100"}
              >
                {showCompleted ? "Hide Completed" : "Show Completed"}
              </Button>
            </div>
          </motion.div>

          <p className="text-gray-600 mb-8">
            Track and manage your project tasks efficiently. Organize your work, set priorities, and meet deadlines to
            ensure project success.
          </p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* To Do Column */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-700">To Do</h3>
                <Badge className="bg-gray-200 text-gray-700">{getTasksByStatus("todo").length}</Badge>
              </div>

              <div className="space-y-3">
                {getTasksByStatus("todo").map((task) => (
                  <motion.div
                    key={task.id}
                    className="bg-white p-4 rounded-lg shadow-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ y: -2, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{task.title}</h4>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{task.project}</p>
                    <div className="flex items-center text-gray-500 text-sm mt-2">
                      <Calendar className="h-3 w-3 mr-1" />
                      {task.dueDate}
                      <Badge className={`ml-2 ${priorityColors[task.priority]}`}>{task.priority}</Badge>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm" className="h-7 px-2">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 text-red-500 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* In Progress Column */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-700">In Progress</h3>
                <Badge className="bg-blue-100 text-blue-700">{getTasksByStatus("in-progress").length}</Badge>
              </div>

              <div className="space-y-3">
                {getTasksByStatus("in-progress").map((task) => (
                  <motion.div
                    key={task.id}
                    className="bg-white p-4 rounded-lg shadow-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ y: -2, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{task.title}</h4>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{task.project}</p>
                    <div className="flex items-center text-gray-500 text-sm mt-2">
                      <Calendar className="h-3 w-3 mr-1" />
                      {task.dueDate}
                      <Badge className={`ml-2 ${priorityColors[task.priority]}`}>{task.priority}</Badge>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm" className="h-7 px-2">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 text-green-500 border-green-200 hover:bg-green-50"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Complete
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Done Column */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-700">Done</h3>
                <Badge className="bg-green-100 text-green-700">{getTasksByStatus("done").length}</Badge>
              </div>

              <div className="space-y-3">
                {getTasksByStatus("done").map((task) => (
                  <motion.div
                    key={task.id}
                    className="bg-white p-4 rounded-lg shadow-sm opacity-80"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 0.8, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium line-through">{task.title}</h4>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{task.project}</p>
                    <div className="flex items-center text-gray-500 text-sm mt-2">
                      <Calendar className="h-3 w-3 mr-1" />
                      {task.dueDate}
                      <Badge className={`ml-2 ${priorityColors[task.priority]}`}>{task.priority}</Badge>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 text-red-500 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </motion.div>
                ))}
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
