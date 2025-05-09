"use client"

import { Avatar } from "./ui/avatar"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import Link from "next/link"
import { Plus, Users } from "lucide-react"

interface TeamMember {
  name: string
  role: string
  avatar: string
  profile: string
}

interface TeamFormationProps {
  team?: TeamMember[]
}

export function TeamFormation({ team = [] }: TeamFormationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Team Formation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Current Team Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Current Team</h3>
            <div className="space-y-4">
              {team.map((member, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <img src={member.avatar} alt={member.name} />
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-gray-600">{member.role}</p>
                    </div>
                  </div>
                  <Link href={member.profile}>
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Team Actions */}
          <div className="flex gap-4">
            <Button className="flex-1 bg-[#6b3e7c] hover:bg-[#5a2e6b]">
              <Plus className="h-4 w-4 mr-2" />
              Create New Team
            </Button>
            <Button variant="outline" className="flex-1">
              Invite Members
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
