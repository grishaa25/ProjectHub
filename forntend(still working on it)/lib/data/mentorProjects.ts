export interface MentorProject {
  id: string
  title: string
  slug: string
  category: string
  mentor: {
    name: string
    title: string
    department: string
    avatar: string
    status: "Pending" | "Under Review" | "Approved"
  }
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

export const mentorProjects: MentorProject[] = [
  {
    id: "m1",
    title: "Quantum Computing Research",
    slug: "quantum-computing-research",
    category: "Computer Science",
    mentor: {
      name: "Dr. Sarah Johnson",
      title: "Associate Professor",
      department: "Computer Science",
      avatar: "/placeholder.svg",
      status: "Approved"
    },
    skillLevel: "Advanced",
    status: "Approved",
    description: "Research on quantum algorithms and their applications in cryptography, focusing on post-quantum security and optimization problems.",
    timeline: "16 weeks",
    teamSize: "2-3 students",
    teamMembers: [
      { name: "James Wilson", role: "Quantum Researcher", avatar: "/placeholder.svg", profile: "/profile/james" },
      { name: "Lucy Chen", role: "Algorithm Developer", avatar: "/placeholder.svg", profile: "/profile/lucy" }
    ]
  },
  {
    id: "m2",
    title: "Sustainable Energy Systems",
    slug: "sustainable-energy-systems",
    category: "Environmental Engineering",
    mentor: {
      name: "Prof. Michael Chen",
      title: "Professor",
      department: "Environmental Engineering",
      avatar: "/placeholder.svg",
      status: "Approved"
    },
    skillLevel: "Intermediate",
    status: "Approved",
    description: "Research project on innovative renewable energy storage solutions and smart grid integration technologies.",
    timeline: "20 weeks",
    teamSize: "4-5 students",
    teamMembers: [
      { name: "Emma Roberts", role: "Energy Systems Engineer", avatar: "/placeholder.svg", profile: "/profile/emma" },
      { name: "Alex Turner", role: "Data Analyst", avatar: "/placeholder.svg", profile: "/profile/alex" }
    ]
  },
  {
    id: "m3",
    title: "Healthcare AI Diagnostics",
    slug: "healthcare-ai-diagnostics",
    category: "Medical Technology",
    mentor: {
      name: "Dr. Emily Rodriguez",
      title: "Research Director",
      department: "Medical Technology",
      avatar: "/placeholder.svg",
      status: "Approved"
    },
    skillLevel: "Advanced",
    status: "Approved",
    description: "Research on AI-powered diagnostic tools for early disease detection using machine learning and medical imaging.",
    timeline: "24 weeks",
    teamSize: "3-4 students",
    teamMembers: [
      { name: "David Kim", role: "ML Engineer", avatar: "/placeholder.svg", profile: "/profile/david" },
      { name: "Sarah Lee", role: "Medical Data Scientist", avatar: "/placeholder.svg", profile: "/profile/sarah" }
    ]
  },
  {
    id: "m4",
    title: "Brain-Computer Interfaces",
    slug: "brain-computer-interfaces",
    category: "Neural Engineering",
    mentor: {
      name: "Dr. A. Mehta",
      title: "Principal Investigator",
      department: "Neural Engineering",
      avatar: "/placeholder.svg",
      status: "Approved"
    },
    skillLevel: "Advanced",
    status: "Approved",
    description: "Research on neural signal processing and hands-free tech interfaces for assistive technologies.",
    timeline: "20 weeks",
    teamSize: "3-4 students",
    teamMembers: [
      { name: "Mark Thompson", role: "Neural Engineer", avatar: "/placeholder.svg", profile: "/profile/mark" },
      { name: "Nina Patel", role: "Signal Processing Specialist", avatar: "/placeholder.svg", profile: "/profile/nina" }
    ]
  },
  {
    id: "m5",
    title: "Climate Modeling with AI",
    slug: "climate-modeling-with-ai",
    category: "Climate Science + ML",
    mentor: {
      name: "Prof. Rina Das",
      title: "Associate Professor",
      department: "Climate Science",
      avatar: "/placeholder.svg",
      status: "Approved"
    },
    skillLevel: "Intermediate",
    status: "Approved",
    description: "Use ML to simulate and analyze climate change patterns for improved environmental predictions.",
    timeline: "16 weeks",
    teamSize: "3-5 students",
    teamMembers: [
      { name: "Tom Anderson", role: "Climate Scientist", avatar: "/placeholder.svg", profile: "/profile/tom" },
      { name: "Maya Singh", role: "ML Researcher", avatar: "/placeholder.svg", profile: "/profile/maya" }
    ]
  },
  {
    id: "m6",
    title: "Smart Prosthetics Research",
    slug: "smart-prosthetics-research",
    category: "Smart Prosthetics",
    mentor: {
      name: "Dr. Mohan Iyer",
      title: "Research Lead",
      department: "Biomedical Engineering",
      avatar: "/placeholder.svg",
      status: "Approved"
    },
    skillLevel: "Advanced",
    status: "Approved",
    description: "Research project on intelligent prosthetic limb movement prediction using advanced sensors and ML.",
    timeline: "24 weeks",
    teamSize: "3-4 students",
    teamMembers: [
      { name: "Rachel Cooper", role: "Biomedical Engineer", avatar: "/placeholder.svg", profile: "/profile/rachel" },
      { name: "John Lee", role: "Robotics Specialist", avatar: "/placeholder.svg", profile: "/profile/john" }
    ]
  }
]