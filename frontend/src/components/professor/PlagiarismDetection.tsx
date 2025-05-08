
import React from "react";
import { Card } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  Clock,
  File,
  FileText,
  Search,
  Upload,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

// Mock data for plagiarism reports
const plagiarismReports = [
  {
    id: 1,
    projectName: "Web Application Development",
    studentName: "Alex Johnson",
    submissionDate: "Oct 15, 2023",
    score: 82,
    matchPercentage: 12,
    status: "High Risk",
  },
  {
    id: 2,
    projectName: "Data Visualization Project",
    studentName: "Maria Garcia",
    submissionDate: "Oct 14, 2023",
    score: 95,
    matchPercentage: 5,
    status: "Low Risk",
  },
  {
    id: 3,
    projectName: "Machine Learning Model",
    studentName: "David Smith",
    submissionDate: "Oct 13, 2023",
    score: 78,
    matchPercentage: 18,
    status: "High Risk",
  },
  {
    id: 4,
    projectName: "Mobile App Development",
    studentName: "Emma Wilson",
    submissionDate: "Oct 12, 2023",
    score: 91,
    matchPercentage: 3,
    status: "Low Risk",
  },
  {
    id: 5,
    projectName: "Database Design Project",
    studentName: "James Lee",
    submissionDate: "Oct 10, 2023",
    score: 85,
    matchPercentage: 9,
    status: "Medium Risk",
  },
];

// Mock data for recent scans
const recentScans = [
  {
    id: 1,
    title: "CS101 - Final Projects Batch",
    date: "Oct 15, 2023",
    files: 45,
    status: "Completed",
    flagged: 8,
  },
  {
    id: 2,
    title: "CS201 - Midterm Projects",
    date: "Oct 12, 2023",
    files: 32,
    status: "Completed",
    flagged: 4,
  },
  {
    id: 3,
    title: "CS301 - Weekly Assignments",
    date: "Oct 8, 2023",
    files: 28,
    status: "Completed",
    flagged: 2,
  },
];

export const PlagiarismDetection = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="reports">
        <TabsList className="mb-4">
          <TabsTrigger value="reports">Plagiarism Reports</TabsTrigger>
          <TabsTrigger value="scan">New Scan</TabsTrigger>
          <TabsTrigger value="history">Scan History</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
                className="w-full bg-background pl-8"
              />
            </div>
            <Button>Export Reports</Button>
          </div>

          <Card variant="glass" className="overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Submission Date</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Match %</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plagiarismReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">
                        {report.projectName}
                      </TableCell>
                      <TableCell>{report.studentName}</TableCell>
                      <TableCell>{report.submissionDate}</TableCell>
                      <TableCell>{report.score}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={report.matchPercentage}
                            className={`h-2 w-20 ${
                              report.matchPercentage > 15
                                ? "bg-red-200"
                                : report.matchPercentage > 8
                                ? "bg-amber-200"
                                : "bg-green-200"
                            }`}
                          />
                          <span
                            className={
                              report.matchPercentage > 15
                                ? "text-red-500"
                                : report.matchPercentage > 8
                                ? "text-amber-500"
                                : "text-green-500"
                            }
                          >
                            {report.matchPercentage}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            report.status === "High Risk"
                              ? "border-red-500 text-red-500"
                              : report.status === "Medium Risk"
                              ? "border-amber-500 text-amber-500"
                              : "border-green-500 text-green-500"
                          }
                        >
                          {report.status === "High Risk" ? (
                            <AlertTriangle className="mr-1 h-3 w-3" />
                          ) : report.status === "Medium Risk" ? (
                            <Clock className="mr-1 h-3 w-3" />
                          ) : (
                            <CheckCircle className="mr-1 h-3 w-3" />
                          )}
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <span className="sr-only">Details</span>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card variant="glass" className="p-4">
              <div className="flex flex-col items-center justify-center h-full space-y-2">
                <div className="text-4xl font-bold text-red-500">8</div>
                <div className="text-sm text-center">High-Risk Submissions</div>
              </div>
            </Card>
            <Card variant="glass" className="p-4">
              <div className="flex flex-col items-center justify-center h-full space-y-2">
                <div className="text-4xl font-bold text-amber-500">13</div>
                <div className="text-sm text-center">Medium-Risk Submissions</div>
              </div>
            </Card>
            <Card variant="glass" className="p-4">
              <div className="flex flex-col items-center justify-center h-full space-y-2">
                <div className="text-4xl font-bold text-green-500">65</div>
                <div className="text-sm text-center">Low-Risk Submissions</div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scan" className="space-y-4">
          <Card variant="glass" className="p-6">
            <div className="text-center space-y-4 py-8">
              <div className="bg-primary/10 inline-flex h-20 w-20 items-center justify-center rounded-full">
                <Upload className="h-10 w-10 text-primary" />
              </div>
              <h3 className="font-medium text-xl">Upload Files for Plagiarism Check</h3>
              <p className="text-muted-foreground">
                Drag and drop files here or click to browse
              </p>
              <div className="flex justify-center gap-4 mt-4">
                <Button>Upload Files</Button>
                <Button variant="outline">Create Batch Scan</Button>
              </div>
            </div>
          </Card>

          <div className="bg-muted/40 p-4 rounded-lg">
            <h3 className="text-sm font-semibold mb-2">Plagiarism Detection Settings</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Configure how the system should analyze submissions and flag potential plagiarism.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Detection Sensitivity</label>
                <select className="w-full bg-background border border-input rounded-md h-10 px-3">
                  <option>Standard</option>
                  <option>High</option>
                  <option>Very High</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">External Sources Check</label>
                <select className="w-full bg-background border border-input rounded-md h-10 px-3">
                  <option>Enabled</option>
                  <option>Disabled</option>
                </select>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card variant="glass" className="overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Scan Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Files Scanned</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Flagged</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentScans.map((scan) => (
                    <TableRow key={scan.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                          {scan.title}
                        </div>
                      </TableCell>
                      <TableCell>{scan.date}</TableCell>
                      <TableCell>{scan.files} files</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-green-500 text-green-500">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          {scan.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{scan.flagged} files</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          View Report
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          <div className="bg-muted/40 p-4 rounded-lg">
            <h3 className="text-sm font-semibold mb-2 flex items-center">
              <File className="mr-2 h-4 w-4" />
              Detection Database
            </h3>
            <p className="text-sm text-muted-foreground mb-2">
              Your detection database contains 1,450 student submissions and is connected to external academic sources.
            </p>
            <Button variant="outline" size="sm">
              Manage Database
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
