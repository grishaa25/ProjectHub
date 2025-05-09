"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Search, Users, MessageSquare, Plus, ChevronDown, Trash2 } from "lucide-react"
import { motion } from "framer-motion"
import { forums as initialForums, type Forum } from "@/lib/data/forums"
import { communityProjects } from "@/lib/data/communityProjects"
import { useToast } from "@/components/ui/use-toast"
import { useChat } from "@/contexts/ChatContext"

export default function ForumPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [forums, setForums] = useState<Forum[]>([])
  const { toast } = useToast()
  const { clearChat } = useChat()

  // Load forums from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('activeForums')
    if (stored) {
      setForums(JSON.parse(stored))
    } else {
      setForums(initialForums)
    }
  }, [])

  // Save forums to localStorage when updated
  useEffect(() => {
    localStorage.setItem('activeForums', JSON.stringify(forums))
  }, [forums])
  
  const filteredForums = forums.filter(forum => 
    forum.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    forum.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateForum = async (projectTitle: string, slug: string, category: string) => {
    // Check if forum already exists
    if (forums.some(f => f.slug === slug)) {
      toast({
        title: "Forum Already Exists",
        description: `A forum for "${projectTitle}" already exists.`,
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    // Create new forum
    const newForum: Forum = {
      id: Date.now().toString(),
      slug,
      projectTitle,
      category,
      lastActive: new Date().toISOString(),
      participants: [
        {
          name: "You",
          avatar: "/placeholder.svg",
          role: "student",
          online: true
        }
      ],
      messages: [],
      unreadCount: 0
    }

    // Add to forums list and localStorage
    setForums(prev => [newForum, ...prev])

    // Prepare for future database integration
    try {
      // await fetch('/api/forum/create', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newForum)
      // })

      toast({
        title: "Success",
        description: `Forum created for: ${projectTitle}`,
        duration: 3000,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create forum. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  const handleDeleteForum = async (slug: string, projectTitle: string) => {
    try {
      // Remove from local state
      setForums(prev => prev.filter(f => f.slug !== slug))
      
      // Clear chat messages
      clearChat(slug)

      // Prepare for future database integration
      // await fetch(`/api/forum/${slug}`, {
      //   method: 'DELETE'
      // })

      toast({
        title: "Forum Deleted",
        description: `Forum "${projectTitle}" has been removed.`,
        duration: 3000,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete forum. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-[#1e3a3a]">Project Forums</h1>
                <p className="text-gray-600">Join discussions and collaborate with your project team</p>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-[#6b3e7c] hover:bg-[#5a2e6b] whitespace-nowrap">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Forum
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel>Select a Project</DropdownMenuLabel>
                  {communityProjects.map((project) => {
                    const hasExistingForum = forums.some(f => f.slug === project.slug)
                    
                    return (
                      <TooltipProvider key={project.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <DropdownMenuItem
                                className={`px-4 py-2 cursor-pointer ${
                                  hasExistingForum ? 'opacity-50 pointer-events-none' : 'hover:bg-gray-100'
                                }`}
                                onClick={() => handleCreateForum(project.title, project.slug, project.category)}
                              >
                                <div className="flex flex-col">
                                  <span className="font-medium">{project.title}</span>
                                  <span className="text-sm text-gray-500">{project.category}</span>
                                </div>
                              </DropdownMenuItem>
                            </div>
                          </TooltipTrigger>
                          {hasExistingForum && (
                            <TooltipContent>
                              <p>Forum already created</p>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    )
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Search Section */}
            <div className="mb-8">
              <div className="relative max-w-md">
                <Input
                  type="text"
                  placeholder="Search forums..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </div>

            {/* Forums Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredForums.map((forum, index) => (
                <motion.div
                  key={forum.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="relative flex flex-col h-full min-h-[260px] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Forum?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the forum and all its messages. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteForum(forum.slug, forum.projectTitle)}
                            className="bg-red-500 hover:bg-red-600 text-white"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <div className="flex flex-col space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <h3 className="text-xl font-semibold text-[#1e3a3a] line-clamp-2">{forum.projectTitle}</h3>
                          <Badge variant="secondary" className="bg-[#f0e5ff] text-[#6b3e7c]">
                            {forum.category}
                          </Badge>
                        </div>
                        {forum.unreadCount ? (
                          <Badge className="bg-[#6b3e7c] text-white shrink-0">
                            {forum.unreadCount} new
                          </Badge>
                        ) : null}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {forum.participants.length}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          {forum.messages.length}
                        </div>
                      </div>

                      <p className="text-sm text-gray-500">
                        Last active: {new Date(forum.lastActive).toLocaleString()}
                      </p>
                    </div>

                    <div className="mt-auto pt-4">
                      <Button
                        asChild
                        className="w-full bg-[#213635] hover:bg-[#1a2b2b] text-white"
                      >
                        <Link href={`/forum/${forum.slug}`}>
                          Join Discussion
                        </Link>
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Empty State */}
            {filteredForums.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <p className="text-gray-500">No forums match your search.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
