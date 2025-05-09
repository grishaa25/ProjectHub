"use client"

import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Avatar } from "./ui/avatar"
import { Card, CardHeader, CardContent } from "./ui/card"
import { CheckCircle, XCircle, Clock } from "lucide-react"

interface MentorPanelProps {
  mentor: {
    name: string
    title?: string
    department: string
    avatar: string
    status: "Pending" | "Under Review" | "Approved"
  }
}

export function MentorPanel({ mentor }: MentorPanelProps) {
  const statusConfig = {
    "Pending": {
      icon: Clock,
      text: "Pending Approval",
      color: "bg-yellow-100 text-yellow-800",
    },
    "Approved": {
      icon: CheckCircle,
      text: "Approved",
      color: "bg-green-100 text-green-800",
    },
    "Under Review": {
      icon: Clock,
      text: "Under Review",
      color: "bg-blue-100 text-blue-800",
    }
  }

  // Default to Pending if status is not recognized
  const status = mentor.status || "Pending";
  const currentStatus = statusConfig[status] || statusConfig["Pending"];
  const StatusIcon = currentStatus.icon;

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold">Mentor Assignment</h2>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="h-16 w-16">
            <img src={mentor.avatar || "/placeholder.svg"} alt={mentor.name} />
          </Avatar>
          <div>
            <h3 className="text-lg font-bold">{mentor.name}</h3>
            {mentor.title && <p className="text-gray-600">{mentor.title}</p>}
            <p className="text-gray-500">{mentor.department}</p>
            <Badge className={`${currentStatus.color} mt-2 flex items-center gap-1 w-fit`}>
              <StatusIcon className="h-3 w-3" />
              {currentStatus.text}
            </Badge>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1">
            Contact Mentor
          </Button>
          {status === "Under Review" && (
            <Button className="flex-1 bg-[#6b3e7c] hover:bg-[#5a2e6b]">Request Update</Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
