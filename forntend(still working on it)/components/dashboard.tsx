// Component: Replicates dashboard view with AI-recommended projects
import { ProjectCard } from "./project-card"
import { CategoryGrid } from "./category-grid"
import { Button } from "./ui/button"
import { Filter } from "lucide-react"

// Mock data for projects
const recommendedProjects = [
  {
    id: "1",
    title: "AI-Powered Healthcare Assistant",
    category: "Engineering & Computer Science",
    mentor: "Dr. Sarah Johnson",
    skillLevel: "Intermediate" as const,
  },
  {
    id: "2",
    title: "Sustainable Business Model Canvas",
    category: "Business",
    mentor: "Prof. Michael Chen",
    skillLevel: "Beginner" as const,
  },
  {
    id: "3",
    title: "Interactive Media Installation",
    category: "Creative Arts",
    mentor: "Dr. Emily Rodriguez",
    skillLevel: "Advanced" as const,
  },
  {
    id: "4",
    title: "Medical Data Visualization",
    category: "Medical Science",
    mentor: "Dr. James Wilson",
    skillLevel: "Intermediate" as const,
  },
  {
    id: "5",
    title: "Digital Marketing Campaign",
    category: "Mass Communication",
    mentor: "Prof. Lisa Thompson",
    skillLevel: "Beginner" as const,
  },
  {
    id: "6",
    title: "Rehabilitation Exercise App",
    category: "Physiotherapy",
    mentor: "Dr. Robert Brown",
    skillLevel: "Intermediate" as const,
  },
]

export function Dashboard() {
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">AI-Recommended Projects</h2>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filter Projects
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {recommendedProjects.map((project) => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </div>

      <h2 className="text-3xl font-bold mb-6">Browse by Category</h2>
      <CategoryGrid />
    </div>
  )
}
