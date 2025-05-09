// Component: Replicates task tracking kanban board
"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Plus, MoreHorizontal, Calendar, Trash2, Edit } from "lucide-react"
import { Badge } from "./ui/badge"

interface Task {
  id: string
  title: string
  dueDate: string
  status: "todo" | "in-progress" | "done"
}

// Mock data for tasks
const initialTasks: Task[] = [
  { id: "1", title: "Research project requirements", dueDate: "2023-05-15", status: "todo" },
  { id: "2", title: "Create project proposal", dueDate: "2023-05-20", status: "todo" },
  { id: "3", title: "Meet with mentor", dueDate: "2023-05-10", status: "in-progress" },
  { id: "4", title: "Develop prototype", dueDate: "2023-05-25", status: "in-progress" },
  { id: "5", title: "Submit initial documentation", dueDate: "2023-05-05", status: "done" },
  { id: "6", title: "Complete literature review", dueDate: "2023-05-08", status: "done" },
]

export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)

  const getTasksByStatus = (status: Task["status"]) => {
    return tasks.filter((task) => task.status === status)
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Task Tracking</h2>
        <Button className="bg-[#6b3e7c] hover:bg-[#5a2e6b] flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* To Do Column */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-700">To Do</h3>
            <Badge className="bg-gray-200 text-gray-700">{getTasksByStatus("todo").length}</Badge>
          </div>

          <div className="space-y-3">
            {getTasksByStatus("todo").map((task) => (
              <div key={task.id} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">{task.title}</h4>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center text-gray-500 text-sm mt-2">
                  <Calendar className="h-3 w-3 mr-1" />
                  {task.dueDate}
                </div>
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" className="h-7 px-2">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 px-2 text-red-500 border-red-200 hover:bg-red-50">
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* In Progress Column */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-700">In Progress</h3>
            <Badge className="bg-blue-100 text-blue-700">{getTasksByStatus("in-progress").length}</Badge>
          </div>

          <div className="space-y-3">
            {getTasksByStatus("in-progress").map((task) => (
              <div key={task.id} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">{task.title}</h4>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center text-gray-500 text-sm mt-2">
                  <Calendar className="h-3 w-3 mr-1" />
                  {task.dueDate}
                </div>
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" className="h-7 px-2">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 px-2 text-red-500 border-red-200 hover:bg-red-50">
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Done Column */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-700">Done</h3>
            <Badge className="bg-green-100 text-green-700">{getTasksByStatus("done").length}</Badge>
          </div>

          <div className="space-y-3">
            {getTasksByStatus("done").map((task) => (
              <div key={task.id} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">{task.title}</h4>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center text-gray-500 text-sm mt-2">
                  <Calendar className="h-3 w-3 mr-1" />
                  {task.dueDate}
                </div>
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" className="h-7 px-2">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 px-2 text-red-500 border-red-200 hover:bg-red-50">
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
