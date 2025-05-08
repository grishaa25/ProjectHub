import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui-custom/Button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Calendar, Users, Tag, File, X, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";

interface Milestone {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  weightage: number;
}

interface ProjectFormData {
  title: string;
  description: string;
  academicYear: string;
  status: string;
  tags: string[];
  documents: File[];
  milestones: Milestone[];
}

interface CreateProjectProps {
  onProjectCreated: (project: any) => void;
}

export const CreateProject: React.FC<CreateProjectProps> = ({
  onProjectCreated,
}) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    description: "",
    academicYear: "3rd Year",
    status: "Open",
    tags: [],
    documents: [],
    milestones: [],
  });
  const [tag, setTag] = useState("");
  const [activeTab, setActiveTab] = useState("details");
  const [newMilestone, setNewMilestone] = useState<{
    title: string;
    description: string;
    dueDate: string;
    weightage: number;
  }>({
    title: "",
    description: "",
    dueDate: "",
    weightage: 0,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
      setTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFormData((prev) => ({
        ...prev,
        documents: [...prev.documents, ...newFiles],
      }));
    }
  };

  const handleRemoveFile = (fileToRemove: File) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((file) => file !== fileToRemove),
    }));
  };

  const handleMilestoneChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setNewMilestone((prev) => ({
      ...prev,
      [id.replace("milestone-", "")]: value,
    }));
  };

  const handleAddMilestone = () => {
    if (newMilestone.title && newMilestone.dueDate) {
      const milestone = {
        id: Date.now(),
        ...newMilestone,
      };

      setFormData((prev) => ({
        ...prev,
        milestones: [...prev.milestones, milestone],
      }));

      setNewMilestone({
        title: "",
        description: "",
        dueDate: "",
        weightage: 0,
      });
    } else {
      toast.error("Milestone title and due date are required");
    }
  };

  const handleRemoveMilestone = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      milestones: prev.milestones.filter((m) => m.id !== id),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.academicYear) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newProject = {
      title: formData.title,
      description: formData.description,
      year: formData.academicYear.trim(), // "3rd Year" -> "3"
      tags: formData.tags.length > 0 ? formData.tags : ["Uncategorized"],
      milestones: formData.milestones.map((milestone) => ({
        title: milestone.title,
        description: milestone.description,
        due_date: milestone.dueDate,
        weightage: milestone.weightage,
      })),
    };

    try {
      await onProjectCreated(newProject);
      toast.success("Project created successfully!");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to create project");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Create New Project
          </DialogTitle>
          <DialogDescription>
            Fill in the project details below. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="pt-2">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="details">Project Details</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="details" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter project title"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter project description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Academic Year *</Label>
                  <Select
                    value={formData.academicYear}
                    onValueChange={(value) =>
                      handleSelectChange("academicYear", value)
                    }
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1st Year">1st Year</SelectItem>
                      <SelectItem value="2nd Year">2nd Year</SelectItem>
                      <SelectItem value="3rd Year">3rd Year</SelectItem>
                      <SelectItem value="4th Year">4th Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Project Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      handleSelectChange("status", value)
                    }
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OPEN">Open</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Project Tags</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={tag}
                      onChange={(e) => setTag(e.target.value)}
                      placeholder="Add tag"
                      className="pl-10 h-11"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddTag}
                  >
                    Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((t, i) => (
                    <div
                      key={i}
                      className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      {t}
                      <button
                        type="button"
                        className="ml-2 h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/30"
                        onClick={() => handleRemoveTag(t)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="button" onClick={() => setActiveTab("documents")}>
                  Next: Documents
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="documents" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="documents">
                  Upload Supporting Documents (Optional)
                </Label>
                <div className="border-2 border-dashed border-primary/20 rounded-lg p-6 text-center cursor-pointer hover:bg-primary/5 transition-colors">
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <File className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground mb-1">
                      Drag and drop files here, or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF, Word, ZIP files (Max: 10MB)
                    </p>
                  </label>
                </div>

                {formData.documents.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <Label>Uploaded Files</Label>
                    <div className="space-y-2">
                      {formData.documents.map((file, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between bg-secondary/10 p-2 rounded-lg"
                        >
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-primary" />
                            <span className="text-sm truncate max-w-[200px]">
                              {file.name}
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFile(file)}
                          >
                            <X className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-2">
                <Button type="button" onClick={() => setActiveTab("details")}>
                  Back: Details
                </Button>
                <Button
                  type="button"
                  onClick={() => setActiveTab("milestones")}
                >
                  Next: Milestones
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="milestones" className="space-y-4 pt-4">
              <div className="space-y-4">
                <Label>Initial Milestones (Optional)</Label>
                <div className="p-4 border rounded-lg">
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <Label htmlFor="milestone-title">Milestone Title</Label>
                      <Input
                        id="milestone-title"
                        value={newMilestone.title}
                        onChange={handleMilestoneChange}
                        placeholder="E.g., Project Plan Submission"
                      />
                    </div>
                    <div>
                      <Label htmlFor="milestone-dueDate">
                        Expected Submission Date
                      </Label>
                      <Input
                        id="milestone-dueDate"
                        type="date"
                        value={newMilestone.dueDate}
                        onChange={handleMilestoneChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="milestone-description">Description</Label>
                      <Textarea
                        id="milestone-description"
                        value={newMilestone.description}
                        onChange={handleMilestoneChange}
                        placeholder="Describe what's expected for this milestone"
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label htmlFor="milestone-weightage">Weightage</Label>
                      <Input
                        id="milestone-weightage"
                        type="number"
                        value={newMilestone.weightage}
                        onChange={handleMilestoneChange}
                        placeholder="E.g., 25"
                        min={0}
                        max={100}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddMilestone}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add Milestone
                    </Button>
                  </div>
                </div>

                {formData.milestones.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium">Added Milestones</h4>
                    <div className="space-y-3">
                      {formData.milestones.map((milestone) => (
                        <div
                          key={milestone.id}
                          className="bg-secondary/10 p-3 rounded-lg"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-semibold">
                                {milestone.title}
                              </h5>
                              <div className="text-sm text-muted-foreground flex items-center mt-1">
                                <Calendar className="h-3 w-3 mr-1" />
                                {new Date(
                                  milestone.dueDate
                                ).toLocaleDateString()}
                              </div>
                              <div className="text-sm text-muted-foreground mt-1">
                                Weightage: {milestone.weightage}%
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleRemoveMilestone(milestone.id)
                              }
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          {milestone.description && (
                            <p className="text-sm mt-2 text-muted-foreground">
                              {milestone.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-2">
                <Button type="button" onClick={() => setActiveTab("documents")}>
                  Back: Documents
                </Button>
                <Button type="submit">Create Project</Button>
              </div>
            </TabsContent>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProject;
