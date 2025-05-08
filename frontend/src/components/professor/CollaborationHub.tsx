
import React from "react";
import { Card } from "@/components/ui-custom/Card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui-custom/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  Video, 
  Calendar, 
  Clock,
  Users,
  Send,
  PlusCircle
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

// Mock data for messages
const messagesData = [
  {
    id: 1,
    sender: {
      name: "Emma Wilson",
      avatar: null,
      initials: "EW",
    },
    message: "I've completed the wireframes for the mobile app. Could you review them when you have time?",
    timestamp: "10:45 AM",
    project: "Mobile App Design",
    unread: true,
  },
  {
    id: 2,
    sender: {
      name: "Michael Johnson",
      avatar: null,
      initials: "MJ",
    },
    message: "Quick question about the database schema - should we include timestamp fields for all tables?",
    timestamp: "Yesterday",
    project: "Web Application Development",
    unread: false,
  },
  {
    id: 3,
    sender: {
      name: "Sophia Chen",
      avatar: null,
      initials: "SC",
    },
    message: "The team is stuck on implementing the authentication system. Can we schedule a quick meeting?",
    timestamp: "Yesterday",
    project: "Web Application Development",
    unread: true,
  },
  {
    id: 4,
    sender: {
      name: "James Rodriguez",
      avatar: null,
      initials: "JR",
    },
    message: "Just pushed the initial data visualization components to the repo. Let me know what you think!",
    timestamp: "Oct 12",
    project: "Data Visualization Dashboard",
    unread: false,
  },
];

// Mock data for meetings
const meetingsData = [
  {
    id: 1,
    title: "Project Status Review",
    project: "Web Application Development",
    date: "Oct 18, 2023",
    time: "10:00 AM - 11:00 AM",
    participants: 8,
    status: "Upcoming",
  },
  {
    id: 2,
    title: "UI/UX Feedback Session",
    project: "Mobile App Design",
    date: "Oct 20, 2023",
    time: "2:00 PM - 3:30 PM",
    participants: 5,
    status: "Upcoming",
  },
  {
    id: 3,
    title: "Database Design Workshop",
    project: "Web Application Development",
    date: "Oct 15, 2023",
    time: "9:00 AM - 12:00 PM",
    participants: 8,
    status: "Completed",
  },
  {
    id: 4,
    title: "ML Model Review",
    project: "Machine Learning Models",
    date: "Oct 25, 2023",
    time: "11:00 AM - 12:30 PM",
    participants: 4,
    status: "Upcoming",
  },
];

// Mock data for team members
const teamMembersData = [
  {
    id: 1,
    name: "Emma Wilson",
    role: "UI/UX Designer",
    projects: ["Mobile App Design", "Web Application Development"],
    status: "Online",
    lastActive: "Now",
  },
  {
    id: 2,
    name: "Michael Johnson",
    role: "Backend Developer",
    projects: ["Web Application Development"],
    status: "Offline",
    lastActive: "3 hours ago",
  },
  {
    id: 3,
    name: "Sophia Chen",
    role: "Frontend Developer",
    projects: ["Web Application Development", "Mobile App Design"],
    status: "Online",
    lastActive: "Now",
  },
  {
    id: 4,
    name: "James Rodriguez",
    role: "Data Scientist",
    projects: ["Data Visualization Dashboard", "Machine Learning Models"],
    status: "Busy",
    lastActive: "5 mins ago",
  },
  {
    id: 5,
    name: "Alex Turner",
    role: "Full Stack Developer",
    projects: ["Web Application Development"],
    status: "Offline",
    lastActive: "Yesterday",
  },
];

export const CollaborationHub = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Online":
        return "bg-green-500";
      case "Busy":
        return "bg-amber-500";
      case "Offline":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="messages">
        <TabsList className="mb-4">
          <TabsTrigger value="messages">
            <MessageSquare className="mr-2 h-4 w-4" />
            Messages
          </TabsTrigger>
          <TabsTrigger value="meetings">
            <Video className="mr-2 h-4 w-4" />
            Meetings
          </TabsTrigger>
          <TabsTrigger value="team">
            <Users className="mr-2 h-4 w-4" />
            Team
          </TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Recent Messages</h3>
            <Button>
              <MessageSquare className="mr-2 h-4 w-4" />
              New Message
            </Button>
          </div>

          {messagesData.map((message) => (
            <Card 
              key={message.id} 
              variant={message.unread ? "glass" : "outline"} 
              className={`p-4 ${message.unread ? "border-primary/30" : ""}`}
            >
              <div className="flex gap-3">
                <Avatar>
                  <AvatarImage src={message.sender.avatar || undefined} />
                  <AvatarFallback>{message.sender.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium flex items-center">
                        {message.sender.name}
                        {message.unread && (
                          <Badge className="ml-2 bg-primary h-2 w-2 p-0 rounded-full" />
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Project: {message.project}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                  </div>
                  <p className="mt-1 text-sm">{message.message}</p>
                  <div className="mt-2 flex justify-end">
                    <Button size="sm" variant="ghost">
                      <Send className="mr-2 h-3 w-3" />
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="meetings" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Scheduled Meetings</h3>
            <Button>
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Meeting
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {meetingsData.map((meeting) => (
              <Card 
                key={meeting.id} 
                variant={meeting.status === "Upcoming" ? "glass" : "outline"} 
                className="p-4"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">{meeting.title}</h4>
                    <Badge 
                      className={meeting.status === "Upcoming" ? "bg-blue-500" : "bg-gray-500"}
                    >
                      {meeting.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Project: {meeting.project}
                  </p>
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                      {meeting.date}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      {meeting.time}
                    </div>
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                    {meeting.participants} Participants
                  </div>
                  {meeting.status === "Upcoming" && (
                    <div className="flex gap-2 pt-2">
                      <Button size="sm">Join Meeting</Button>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Team Members</h3>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamMembersData.map((member) => (
              <Card key={member.id} variant="outline" className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <div className="font-medium flex items-center">
                          {member.name}
                          <div 
                            className={`ml-2 h-2 w-2 rounded-full ${getStatusColor(member.status)}`}
                          />
                        </div>
                        <div className="text-sm text-muted-foreground">{member.role}</div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <span className="h-1 w-1 rounded-full bg-foreground"></span>
                            <span className="h-1 w-1 rounded-full bg-foreground"></span>
                            <span className="h-1 w-1 rounded-full bg-foreground"></span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Message
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Video className="mr-2 h-4 w-4" />
                            Call
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      Last active: {member.lastActive}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {member.projects.map((project, idx) => (
                        <span 
                          key={idx}
                          className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full"
                        >
                          {project}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
