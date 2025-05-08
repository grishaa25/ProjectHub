
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui-custom/Button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Video, FileText, PlayCircle, Download, Calendar, Clock, Share2, ListChecks, Mic, MicOff } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Mock data for recorded lectures
const recordings = [
  { 
    id: 1, 
    title: "Introduction to Computer Science", 
    course: "CS101", 
    date: "Jan 20, 2023",
    duration: "01:15:32",
    status: "Processed",
    views: 42,
    hasNotes: true,
    size: "245 MB"
  },
  { 
    id: 2, 
    title: "Variables & Data Types", 
    course: "CS101", 
    date: "Jan 27, 2023",
    duration: "01:05:18",
    status: "Processed",
    views: 39,
    hasNotes: true,
    size: "218 MB"
  },
  { 
    id: 3, 
    title: "Control Structures", 
    course: "CS101", 
    date: "Feb 3, 2023",
    duration: "01:20:45",
    status: "Processed",
    views: 41,
    hasNotes: true,
    size: "267 MB"
  },
  { 
    id: 4, 
    title: "Functions & Methods", 
    course: "CS101", 
    date: "Feb 10, 2023",
    duration: "01:10:22",
    status: "Processing",
    views: 12,
    hasNotes: false,
    size: "230 MB"
  },
  { 
    id: 5, 
    title: "Object-Oriented Programming", 
    course: "CS101", 
    date: "Feb 17, 2023",
    duration: "01:25:10",
    status: "Scheduled",
    views: 0,
    hasNotes: false,
    size: "-"
  },
];

// Mock auto-generated notes
const sampleNotes = `
# Introduction to Computer Science

## Key Topics Covered
- History of Computing
- Basic Computer Architecture
- Introduction to Programming
- The Software Development Lifecycle

## Summary
This lecture introduced the fundamental concepts of computer science, starting with the historical development of computing machines. We discussed how early mechanical calculators evolved into the electronic computers we use today.

The lecture covered basic computer architecture, including the components of a computer system: CPU, memory, input/output devices, and storage. We explored how these components work together to execute programs.

## Important Terminology
- **Algorithm**: A step-by-step procedure for calculations
- **Binary**: The base-2 number system used by computers
- **Compiler**: A program that converts high-level code to machine code
- **Interpreter**: A program that executes high-level code directly

## Student Questions
1. "How do computers store and represent data?" - We discussed binary representation and introduced the concept of bits and bytes.
2. "What's the difference between software and hardware?" - Hardware is the physical components, while software is the programs and instructions.

## Resources for Further Study
- Chapter 1-2 in the textbook
- Optional reading: "The Annotated Turing" by Charles Petzold
- Tutorial series on basic programming concepts (link shared in course portal)
`;

export const LectureRecording = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isRecording, setIsRecording] = React.useState(false);
  
  const filteredRecordings = recordings.filter(recording => 
    recording.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    recording.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Tabs defaultValue="recordings">
      <TabsList className="mb-4">
        <TabsTrigger value="recordings">Recordings</TabsTrigger>
        <TabsTrigger value="record-new">Record New</TabsTrigger>
        <TabsTrigger value="notes">AI Notes</TabsTrigger>
      </TabsList>
      
      <TabsContent value="recordings" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search recordings..."
              className="max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                <SelectItem value="cs101">CS101</SelectItem>
                <SelectItem value="cs201">CS201</SelectItem>
                <SelectItem value="cs301">CS301</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button>
            <Video className="mr-2 h-4 w-4" />
            Record New Lecture
          </Button>
        </div>
        
        <Card className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>AI Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecordings.map((recording) => (
                  <TableRow key={recording.id}>
                    <TableCell className="font-medium">{recording.title}</TableCell>
                    <TableCell>{recording.course}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                        {recording.date}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                        {recording.duration}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          recording.status === "Processed" ? "default" : 
                          recording.status === "Processing" ? "secondary" : 
                          "outline"
                        }
                      >
                        {recording.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{recording.views}</TableCell>
                    <TableCell>
                      {recording.hasNotes ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Available
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" disabled={recording.status !== "Processed"}>
                          <PlayCircle className="h-4 w-4" />
                          <span className="sr-only">Play</span>
                        </Button>
                        <Button variant="ghost" size="sm" disabled={recording.status !== "Processed"}>
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download</span>
                        </Button>
                        <Button variant="ghost" size="sm" disabled={recording.status !== "Processed"}>
                          <Share2 className="h-4 w-4" />
                          <span className="sr-only">Share</span>
                        </Button>
                        <Button variant="ghost" size="sm" disabled={!recording.hasNotes}>
                          <FileText className="h-4 w-4" />
                          <span className="sr-only">Notes</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </TabsContent>
      
      <TabsContent value="record-new" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>New Lecture Recording</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Lecture Title</label>
                <Input placeholder="Enter lecture title" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Course</label>
                <Select defaultValue="cs101">
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cs101">CS101: Intro to CS</SelectItem>
                    <SelectItem value="cs201">CS201: Data Structures</SelectItem>
                    <SelectItem value="cs301">CS301: Database Systems</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Description (Optional)</label>
              <textarea 
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Brief description of the lecture content"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">AI Features</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="auto-notes" className="rounded border-gray-300" defaultChecked />
                  <label htmlFor="auto-notes" className="text-sm">Generate AI Notes</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="auto-transcript" className="rounded border-gray-300" defaultChecked />
                  <label htmlFor="auto-transcript" className="text-sm">Create Transcript</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="key-points" className="rounded border-gray-300" defaultChecked />
                  <label htmlFor="key-points" className="text-sm">Extract Key Points</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="student-questions" className="rounded border-gray-300" defaultChecked />
                  <label htmlFor="student-questions" className="text-sm">Track Student Questions</label>
                </div>
              </div>
            </div>
            
            <div className="bg-muted p-4 rounded-lg flex flex-col items-center justify-center text-center" style={{ minHeight: "200px" }}>
              {isRecording ? (
                <>
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="inline-block h-3 w-3 rounded-full bg-red-500 animate-pulse"></span>
                    <span className="font-medium">Recording in Progress</span>
                  </div>
                  <div className="text-3xl font-mono mb-6">00:05:32</div>
                  <div className="flex space-x-3">
                    <Button variant="outline" size="sm" onClick={() => setIsRecording(false)}>
                      <MicOff className="mr-2 h-4 w-4" />
                      Stop Recording
                    </Button>
                    <Button variant="outline" size="sm">
                      Pause
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Video className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Ready to Record</h3>
                  <p className="text-sm text-muted-foreground mb-4">Click the button below to start recording your lecture</p>
                  <Button onClick={() => setIsRecording(true)}>
                    <Mic className="mr-2 h-4 w-4" />
                    Start Recording
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="bg-muted/40 p-4 rounded-lg">
          <h3 className="text-sm font-semibold mb-2 flex items-center">
            <ListChecks className="h-4 w-4 mr-2" />
            Recording Tips
          </h3>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Ensure you have a stable internet connection</li>
            <li>Use a high-quality microphone for better audio</li>
            <li>Speak clearly and at a moderate pace</li>
            <li>Recordings are automatically saved to the cloud</li>
            <li>AI-generated notes will be available shortly after processing</li>
          </ul>
        </div>
      </TabsContent>
      
      <TabsContent value="notes">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>AI-Generated Lecture Notes</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-4">
              <Select defaultValue="recording-1">
                <SelectTrigger className="w-full sm:w-64">
                  <SelectValue placeholder="Select recording" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recording-1">Introduction to Computer Science</SelectItem>
                  <SelectItem value="recording-2">Variables & Data Types</SelectItem>
                  <SelectItem value="recording-3">Control Structures</SelectItem>
                </SelectContent>
              </Select>
              <div className="text-sm text-muted-foreground flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                Jan 20, 2023
                <span className="mx-2">•</span>
                <Clock className="mr-1 h-4 w-4" />
                01:15:32
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/30 rounded-lg p-6 prose prose-sm max-w-none">
              {/* Display the markdown-formatted notes */}
              <div dangerouslySetInnerHTML={{ __html: sampleNotes.split('\n').map(line => {
                if (line.startsWith('# ')) return `<h1>${line.substring(2)}</h1>`;
                if (line.startsWith('## ')) return `<h2>${line.substring(3)}</h2>`;
                if (line.startsWith('- ')) return `<li>${line.substring(2)}</li>`;
                if (line.startsWith('1. ')) return `<ol start="1"><li>${line.substring(3)}</li></ol>`;
                if (line.startsWith('2. ')) return `<ol start="2"><li>${line.substring(3)}</li></ol>`;
                if (line.includes('**')) {
                  return line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                }
                if (line.trim() === '') return '<br/>';
                return `<p>${line}</p>`;
              }).join('') }} />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
