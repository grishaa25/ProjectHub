export interface ForumMessage {
  id: string
  sender: {
    name: string
    avatar: string
    role: "student" | "mentor"
  }
  content: string
  timestamp: string
}

export interface Forum {
  id: string
  slug: string
  projectTitle: string
  category: string
  lastActive: string
  participants: Array<{
    name: string
    avatar: string
    role: "student" | "mentor"
    online?: boolean
  }>
  messages: ForumMessage[]
  unreadCount?: number
}

// Mock data for forums
export const forums: Forum[] = [
  {
    id: "1",
    slug: "ai-healthcare",
    projectTitle: "Healthcare AI Diagnostics",
    category: "Medical Technology",
    lastActive: "2 minutes ago",
    participants: [
      {
        name: "Dr. Emily Rodriguez",
        avatar: "/placeholder.svg",
        role: "mentor",
        online: true
      },
      {
        name: "David Kim",
        avatar: "/placeholder.svg",
        role: "student",
        online: true
      },
      {
        name: "Sarah Lee",
        avatar: "/placeholder.svg",
        role: "student"
      }
    ],
    messages: [
      {
        id: "1",
        sender: {
          name: "Dr. Emily Rodriguez",
          avatar: "/placeholder.svg",
          role: "mentor"
        },
        content: "Welcome to the Healthcare AI project forum! Let's discuss our progress on the diagnostic algorithms.",
        timestamp: "2 days ago"
      }
    ],
    unreadCount: 2
  },
  {
    id: "2",
    slug: "open-data-dashboard",
    projectTitle: "Open Data Dashboard",
    category: "Data Dashboard",
    lastActive: "1 hour ago",
    participants: [
      {
        name: "Alex Turner",
        avatar: "/placeholder.svg",
        role: "student",
        online: true
      },
      {
        name: "Nina Patel",
        avatar: "/placeholder.svg",
        role: "student"
      }
    ],
    messages: [
      {
        id: "1",
        sender: {
          name: "Alex Turner",
          avatar: "/placeholder.svg",
          role: "student"
        },
        content: "I've pushed the initial dashboard layout to our repository. Would love some feedback!",
        timestamp: "1 hour ago"
      }
    ],
    unreadCount: 1
  }
]