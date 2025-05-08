
import React, { useState } from "react";
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Filter, 
  FileText,
  BookOpen,
  Eye,
  Save,
  X,
  Bell,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui-custom/Button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

// Mock knowledge entry structure
interface KnowledgeEntry {
  id: number;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  accessCount: number;
}

// Mock data
const mockKnowledgeEntries: KnowledgeEntry[] = [
  {
    id: 1,
    title: "Introduction to Neural Networks",
    content: "Neural networks are computing systems vaguely inspired by the biological neural networks that constitute animal brains...",
    category: "Artificial Intelligence",
    tags: ["Neural Networks", "Machine Learning", "AI"],
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-03-20"),
    accessCount: 145,
  },
  {
    id: 2,
    title: "Data Structures Fundamentals",
    content: "Data structures are specialized formats for organizing, processing, retrieving and storing data...",
    category: "Computer Science",
    tags: ["Algorithms", "Data Structures", "Programming"],
    createdAt: new Date("2023-02-10"),
    updatedAt: new Date("2023-02-10"),
    accessCount: 98,
  },
  {
    id: 3,
    title: "Web Development Best Practices",
    content: "This guide covers the essential best practices for modern web development...",
    category: "Web Development",
    tags: ["HTML", "CSS", "JavaScript", "Web"],
    createdAt: new Date("2023-03-05"),
    updatedAt: new Date("2023-04-12"),
    accessCount: 210,
  },
  {
    id: 4,
    title: "Database Design Principles",
    content: "Effective database design is crucial for building applications with good performance...",
    category: "Databases",
    tags: ["SQL", "Database", "Schema Design"],
    createdAt: new Date("2023-02-28"),
    updatedAt: new Date("2023-03-15"),
    accessCount: 87,
  },
  {
    id: 5,
    title: "Software Testing Methodologies",
    content: "Comprehensive guide to different testing strategies and methodologies...",
    category: "Software Engineering",
    tags: ["Testing", "QA", "Software Development"],
    createdAt: new Date("2023-04-10"),
    updatedAt: new Date("2023-04-10"),
    accessCount: 63,
  },
];

// Categories for filtering and selection
const categories = [
  "All Categories",
  "Artificial Intelligence",
  "Computer Science",
  "Web Development",
  "Databases",
  "Software Engineering",
];

export const KnowledgeRepository = () => {
  // State for knowledge entries
  const [entries, setEntries] = useState<KnowledgeEntry[]>(mockKnowledgeEntries);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  
  // State for entry manipulation
  const [currentEntry, setCurrentEntry] = useState<KnowledgeEntry | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  // Form state
  const [entryForm, setEntryForm] = useState({
    title: "",
    content: "",
    category: "",
    tags: "",
  });
  
  // Filter entries based on search and category
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = 
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesCategory = 
      selectedCategory === "All Categories" || 
      entry.category === selectedCategory;
      
    return matchesSearch && matchesCategory;
  });
  
  // Handle adding new entry
  const handleAddEntry = () => {
    if (!entryForm.title || !entryForm.content || !entryForm.category) {
      toast.error("Please fill all required fields");
      return;
    }
    
    const newEntry: KnowledgeEntry = {
      id: entries.length + 1,
      title: entryForm.title,
      content: entryForm.content,
      category: entryForm.category,
      tags: entryForm.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
      createdAt: new Date(),
      updatedAt: new Date(),
      accessCount: 0,
    };
    
    setEntries([...entries, newEntry]);
    resetForm();
    setIsAddDialogOpen(false);
    toast.success("Knowledge entry added successfully");
  };
  
  // Handle editing entry
  const handleEditEntry = () => {
    if (!currentEntry) return;
    
    if (!entryForm.title || !entryForm.content || !entryForm.category) {
      toast.error("Please fill all required fields");
      return;
    }
    
    const updatedEntries = entries.map(entry => 
      entry.id === currentEntry.id 
        ? {
            ...entry,
            title: entryForm.title,
            content: entryForm.content,
            category: entryForm.category,
            tags: entryForm.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
            updatedAt: new Date(),
          }
        : entry
    );
    
    setEntries(updatedEntries);
    resetForm();
    setIsEditDialogOpen(false);
    toast.success("Knowledge entry updated successfully");
  };
  
  // Handle deleting entry
  const handleDeleteEntry = () => {
    if (!currentEntry) return;
    
    const updatedEntries = entries.filter(entry => entry.id !== currentEntry.id);
    setEntries(updatedEntries);
    setCurrentEntry(null);
    setIsDeleteDialogOpen(false);
    toast.success("Knowledge entry deleted successfully");
  };
  
  // Reset form fields
  const resetForm = () => {
    setEntryForm({
      title: "",
      content: "",
      category: "",
      tags: "",
    });
    setCurrentEntry(null);
  };
  
  // Open edit dialog with entry data
  const openEditDialog = (entry: KnowledgeEntry) => {
    setCurrentEntry(entry);
    setEntryForm({
      title: entry.title,
      content: entry.content,
      category: entry.category,
      tags: entry.tags.join(", "),
    });
    setIsEditDialogOpen(true);
  };
  
  // Open preview dialog
  const openPreview = () => {
    setIsPreviewOpen(true);
  };
  
  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-1 w-full max-w-md gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search knowledge entries..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button onClick={() => setIsAddDialogOpen(true)} className="whitespace-nowrap">
          <Plus className="mr-2 h-4 w-4" />
          Add Knowledge Entry
        </Button>
      </div>
      
      {/* Knowledge Entries Table */}
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Knowledge Repository</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead>Access Count</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    No knowledge entries found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{entry.title}</TableCell>
                    <TableCell>{entry.category}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {entry.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(entry.createdAt)}</TableCell>
                    <TableCell>{formatDate(entry.updatedAt)}</TableCell>
                    <TableCell>{entry.accessCount}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <Filter className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(entry)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => {
                              setCurrentEntry(entry);
                              setEntryForm({
                                title: entry.title,
                                content: entry.content,
                                category: entry.category,
                                tags: entry.tags.join(", "),
                              });
                              setIsPreviewOpen(true);
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => {
                              setCurrentEntry(entry);
                              setIsDeleteDialogOpen(true);
                            }}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Add Knowledge Entry Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Knowledge Entry</DialogTitle>
            <DialogDescription>
              Create a new knowledge entry that students can access.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={entryForm.title}
                  onChange={(e) => setEntryForm({...entryForm, title: e.target.value})}
                  placeholder="Enter a descriptive title"
                />
              </div>
              
              <div>
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={entryForm.content}
                  onChange={(e) => setEntryForm({...entryForm, content: e.target.value})}
                  placeholder="Enter the knowledge content"
                  className="min-h-[200px]"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select 
                    value={entryForm.category} 
                    onValueChange={(value) => setEntryForm({...entryForm, category: value})}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.slice(1).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    value={entryForm.tags}
                    onChange={(e) => setEntryForm({...entryForm, tags: e.target.value})}
                    placeholder="AI, Neural Networks, etc."
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="file">Attach Files (optional)</Label>
                <Input
                  id="file"
                  type="file"
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Supported formats: PDF, DOC, DOCX, PPT, PPTX, ZIP (max 10MB)
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              resetForm();
              setIsAddDialogOpen(false);
            }}>
              Cancel
            </Button>
            <Button onClick={handleAddEntry}>
              <Save className="mr-2 h-4 w-4" />
              Save Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Knowledge Entry Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Knowledge Entry</DialogTitle>
            <DialogDescription>
              Update this knowledge entry. This will regenerate vector embeddings.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="edit-title">Title *</Label>
                <Input
                  id="edit-title"
                  value={entryForm.title}
                  onChange={(e) => setEntryForm({...entryForm, title: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-content">Content *</Label>
                <Textarea
                  id="edit-content"
                  value={entryForm.content}
                  onChange={(e) => setEntryForm({...entryForm, content: e.target.value})}
                  className="min-h-[200px]"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-category">Category *</Label>
                  <Select 
                    value={entryForm.category} 
                    onValueChange={(value) => setEntryForm({...entryForm, category: value})}
                  >
                    <SelectTrigger id="edit-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.slice(1).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="edit-tags">Tags (comma separated)</Label>
                  <Input
                    id="edit-tags"
                    value={entryForm.tags}
                    onChange={(e) => setEntryForm({...entryForm, tags: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              resetForm();
              setIsEditDialogOpen(false);
            }}>
              Cancel
            </Button>
            <Button variant="secondary" onClick={openPreview}>
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button onClick={handleEditEntry}>
              <Save className="mr-2 h-4 w-4" />
              Update Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{entryForm.title || "Entry Preview"}</DialogTitle>
            <DialogDescription>
              Preview how this knowledge entry will appear to students.
            </DialogDescription>
          </DialogHeader>
          
          <div className="border rounded-md p-4 bg-card">
            <h3 className="text-xl font-semibold mb-2">{entryForm.title}</h3>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge>{entryForm.category}</Badge>
              {entryForm.tags.split(",").map((tag) => (
                tag.trim() && <Badge key={tag} variant="outline">{tag.trim()}</Badge>
              ))}
            </div>
            
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap">{entryForm.content}</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsPreviewOpen(false)}>
              Close Preview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the knowledge entry "{currentEntry?.title}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCurrentEntry(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteEntry} className="bg-destructive text-destructive-foreground">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
