import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui-custom/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Clock,
  FileUp,
  Eye,
  Save,
  X,
} from "lucide-react";
import { AssignmentPreview } from "./AssignmentPreview";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileUploader } from "./FileUploader";

// Define the form schema
const assignmentFormSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title must be at least 5 characters" })
    .max(100, { message: "Title must not exceed 100 characters" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),
  maxGrade: z
    .number()
    .min(1, { message: "Maximum grade must be at least 1" })
    .max(100, { message: "Maximum grade must not exceed 100" }),
  dueDate: z
    .date()
    .refine((date) => date > new Date(), {
      message: "Due date must be in the future",
    }),
  department: z.string().min(1, { message: "Please select a department" }),
  year: z.string().min(1, { message: "Please select a year" }),
  files: z.array(z.any()).optional(),
});

type AssignmentFormValues = z.infer<typeof assignmentFormSchema>;

export const AssignmentCreationForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  
  // Initialize form with default values
  const form = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentFormSchema),
    defaultValues: {
      title: "",
      description: "",
      maxGrade: 100,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      department: "",
      year: "",
      files: [],
    },
  });
  
  // Auto-save functionality
  React.useEffect(() => {
    const formValues = form.getValues();
    const autoSaveTimer = setTimeout(() => {
      localStorage.setItem("assignmentDraft", JSON.stringify(formValues));
      toast({
        title: "Draft saved",
        description: "Your assignment draft has been auto-saved",
        variant: "default",
      });
    }, 30000); // Auto-save after 30 seconds of inactivity
    
    return () => clearTimeout(autoSaveTimer);
  }, [form, toast]);
  
  // Load draft if available
  React.useEffect(() => {
    const savedDraft = localStorage.getItem("assignmentDraft");
    if (savedDraft) {
      const parsedDraft = JSON.parse(savedDraft);
      // Convert the string date back to a Date object
      if (parsedDraft.dueDate) {
        parsedDraft.dueDate = new Date(parsedDraft.dueDate);
      }
      form.reset(parsedDraft);
      toast({
        title: "Draft loaded",
        description: "Your previous draft has been loaded",
        variant: "default",
      });
    }
  }, []);
  
  const onSubmit = async (data: AssignmentFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      console.log("Submitting assignment:", data);
      console.log("Uploaded files:", uploadedFiles);
      
      // Simulate checking if the assignment title already exists
      // This would be an actual API call in a real application
      const titleExists = false;
      
      if (titleExists) {
        toast({
          title: "Error",
          description: "An assignment with this title already exists for this year and department",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      // Simulate successful creation
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Clear the draft from local storage
      localStorage.removeItem("assignmentDraft");
      
      setIsSubmitting(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error creating assignment:", error);
      toast({
        title: "Error",
        description: "Failed to create assignment. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };
  
  const handleFileUpload = (files: File[]) => {
    setUploadedFiles(files);
    form.setValue("files", files);
  };
  
  // Create a preview-safe version of the form values
  const getPreviewValues = () => {
    const values = form.getValues();
    return {
      title: values.title || "Assignment Title",
      description: values.description || "Assignment description will appear here",
      dueDate: values.dueDate || new Date(),
      maxGrade: values.maxGrade || 100,
      department: values.department || "",
      year: values.year || "",
      files: values.files || []
    };
  };
  
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Title field */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignment Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter assignment title" {...field} />
                    </FormControl>
                    <FormDescription>
                      Provide a clear and descriptive title for your assignment
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Description field */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter assignment description, instructions, and requirements"
                        className="min-h-[200px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Provide detailed instructions for students
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* File upload */}
              <div className="border rounded-lg p-4">
                <FormLabel className="block mb-2">Supporting Materials</FormLabel>
                <FileUploader onFilesUploaded={handleFileUpload} />
                <FormDescription className="mt-2">
                  Upload PDFs, documents, or ZIP files (max 10MB per file)
                </FormDescription>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Due date field */}
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Due Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date() || date > new Date("2100-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Select the deadline for submission
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Max grade field */}
                <FormField
                  control={form.control}
                  name="maxGrade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Grade</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={1} 
                          max={100} 
                          placeholder="100" 
                          {...field}
                          onChange={event => field.onChange(+event.target.value)}
                        />
                      </FormControl>
                      <FormDescription>
                        Set the maximum possible grade
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Department field */}
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="computer_science">Computer Science</SelectItem>
                          <SelectItem value="electrical_engineering">Electrical Engineering</SelectItem>
                          <SelectItem value="mechanical_engineering">Mechanical Engineering</SelectItem>
                          <SelectItem value="civil_engineering">Civil Engineering</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select the department for this assignment
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Year field */}
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">1st Year</SelectItem>
                          <SelectItem value="2">2nd Year</SelectItem>
                          <SelectItem value="3">3rd Year</SelectItem>
                          <SelectItem value="4">4th Year</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select which year students this assignment is for
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  {showPreview ? (
                    <>
                      <X className="mr-2 h-4 w-4" />
                      Hide Preview
                    </>
                  ) : (
                    <>
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </>
                  )}
                </Button>
                
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const formValues = form.getValues();
                      localStorage.setItem("assignmentDraft", JSON.stringify(formValues));
                      toast({
                        title: "Draft saved",
                        description: "Your assignment draft has been saved",
                        variant: "default",
                      });
                    }}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Draft
                  </Button>
                  
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Assignment"}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
        
        {/* Preview panel */}
        {showPreview && (
          <div className="lg:col-span-1">
            <AssignmentPreview assignment={getPreviewValues()} />
          </div>
        )}
      </div>
      
      {/* Success modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assignment Created Successfully</DialogTitle>
            <DialogDescription>
              Your assignment has been created and is now available to students.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="font-medium">{form.getValues().title}</p>
            <p className="text-sm text-muted-foreground">
              Due on {format(form.getValues().dueDate, "PPP")}
            </p>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                setShowSuccessModal(false);
                navigate("/professor/assignments");
              }}
            >
              View All Assignments
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
