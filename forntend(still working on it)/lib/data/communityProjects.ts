export interface CommunityProject {
  id: string
  title: string
  slug: string
  category: string
  mentor: string
  skillLevel: "Beginner" | "Intermediate" | "Advanced"
  status: "Pending" | "Under Review" | "Approved"
  description: string
  timeline: string
  teamSize: string
  teamMembers: Array<{
    name: string
    role: string
    avatar: string
    profile: string
  }>
}

export const communityProjects: CommunityProject[] = [
  {
    id: "c1",
    title: "Open Source Web Framework",
    slug: "open-source-web-framework",
    category: "Web Development",
    mentor: "Community Project",
    skillLevel: "Intermediate",
    status: "Approved",
    description: "Collaborative project to build a modern web framework for developers with features like server-side rendering, static site generation, and API route handling.",
    timeline: "12 weeks",
    teamSize: "3-5 students",
    teamMembers: [
      { name: "Alex Chen", role: "Lead Developer", avatar: "/placeholder.svg", profile: "/profile/alex" },
      { name: "Sarah Kim", role: "Frontend Developer", avatar: "/placeholder.svg", profile: "/profile/sarah" }
    ]
  },
  {
    id: "c2",
    title: "Mobile Learning App",
    slug: "mobile-learning-app",
    category: "Mobile Development",
    mentor: "Community Project",
    skillLevel: "Beginner",
    status: "Approved",
    description: "Student-led initiative to create an educational mobile application that helps students track their learning progress and connect with peers.",
    timeline: "10 weeks",
    teamSize: "4-6 students",
    teamMembers: [
      { name: "Mike Johnson", role: "Mobile Developer", avatar: "/placeholder.svg", profile: "/profile/mike" },
      { name: "Emma Davis", role: "UI/UX Designer", avatar: "/placeholder.svg", profile: "/profile/emma" }
    ]
  },
  {
    id: "c3",
    title: "Smart Campus IoT",
    slug: "smart-campus-iot",
    category: "Internet of Things",
    mentor: "Community Project",
    skillLevel: "Intermediate",
    status: "Approved",
    description: "Collaborative IoT project to enhance campus facilities and services through connected devices and smart sensors.",
    timeline: "16 weeks",
    teamSize: "4-6 students",
    teamMembers: [
      { name: "David Lee", role: "IoT Engineer", avatar: "/placeholder.svg", profile: "/profile/david" },
      { name: "Lisa Wang", role: "Backend Developer", avatar: "/placeholder.svg", profile: "/profile/lisa" }
    ]
  },
  {
    id: "c4",
    title: "Campus Navigation App",
    slug: "campus-navigation-app",
    category: "Campus Navigation",
    mentor: "Community Project",
    skillLevel: "Intermediate",
    status: "Approved",
    description: "Build an indoor navigation system for campus buildings using augmented reality and beacon technology.",
    timeline: "14 weeks",
    teamSize: "3-5 students",
    teamMembers: [
      { name: "Ryan Patel", role: "AR Developer", avatar: "/placeholder.svg", profile: "/profile/ryan" },
      { name: "Julia Smith", role: "Mobile Developer", avatar: "/placeholder.svg", profile: "/profile/julia" }
    ]
  },
  {
    id: "c5",
    title: "AI Chatbot for University Services",
    slug: "ai-chatbot-university-services",
    category: "AI Chatbot",
    mentor: "Community Project",
    skillLevel: "Beginner",
    status: "Approved",
    description: "Student-built chatbot to answer campus FAQs and connect services using natural language processing.",
    timeline: "8 weeks",
    teamSize: "2-4 students",
    teamMembers: [
      { name: "Tom Wilson", role: "ML Engineer", avatar: "/placeholder.svg", profile: "/profile/tom" },
      { name: "Ana Martinez", role: "NLP Developer", avatar: "/placeholder.svg", profile: "/profile/ana" }
    ]
  },
  {
    id: "c6",
    title: "Open Data Dashboard",
    slug: "open-data-dashboard",
    category: "Data Dashboard",
    mentor: "Community Project",
    skillLevel: "Intermediate",
    status: "Approved",
    description: "Build a dashboard to display public and student-generated data with interactive visualizations.",
    timeline: "10 weeks",
    teamSize: "3-4 students",
    teamMembers: [
      { name: "Chris Taylor", role: "Data Scientist", avatar: "/placeholder.svg", profile: "/profile/chris" },
      { name: "Maya Patel", role: "Frontend Developer", avatar: "/placeholder.svg", profile: "/profile/maya" }
    ]
  }
]