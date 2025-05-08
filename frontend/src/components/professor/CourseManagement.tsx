
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui-custom/Button";
import { Input } from "@/components/ui/input";
import { Edit, Trash2, BookPlus, Users, Clock, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock data for courses
const courses = [
  { 
    id: 1, 
    code: "CS101", 
    name: "Introduction to Computer Science", 
    students: 45, 
    status: "Active",
    startDate: "Jan 15, 2023",
    endDate: "May 20, 2023"
  },
  { 
    id: 2, 
    code: "CS201", 
    name: "Data Structures and Algorithms", 
    students: 38, 
    status: "Active",
    startDate: "Jan 15, 2023",
    endDate: "May 20, 2023"
  },
  { 
    id: 3, 
    code: "CS301", 
    name: "Database Systems", 
    students: 32, 
    status: "Active",
    startDate: "Jan 15, 2023",
    endDate: "May 20, 2023"
  },
  { 
    id: 4, 
    code: "CS401", 
    name: "Artificial Intelligence", 
    students: 25, 
    status: "Draft",
    startDate: "Sep 1, 2023",
    endDate: "Dec 20, 2023"
  },
  { 
    id: 5, 
    code: "CS501", 
    name: "Machine Learning", 
    students: 0, 
    status: "Upcoming",
    startDate: "Sep 1, 2023",
    endDate: "Dec 20, 2023"
  },
];

export const CourseManagement = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  
  const filteredCourses = courses.filter(course => 
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    course.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Input
          placeholder="Search courses..."
          className="max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button>
          <BookPlus className="mr-2 h-4 w-4" />
          Create Course
        </Button>
      </div>
      
      <Card className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Code</TableHead>
                <TableHead>Course Name</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.code}</TableCell>
                  <TableCell>{course.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {course.students}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs">{`${course.startDate} - ${course.endDate}`}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        course.status === "Active" ? "default" : 
                        course.status === "Draft" ? "secondary" : 
                        "outline"
                      }
                    >
                      {course.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
      
      <div className="bg-muted/40 p-4 rounded-lg">
        <h3 className="text-sm font-semibold mb-2">Quick Tips</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Create a new course at least 2 weeks before the semester starts
          </li>
          <li className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Invite students using the class code or direct email invitations
          </li>
        </ul>
      </div>
    </div>
  );
};
