import React from "react";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Download, FileText } from "lucide-react";

interface AssignmentPreviewProps {
  assignment: {
    title: string;
    description: string;
    dueDate: Date;
    maxGrade: number;
    department: string;
    year: string;
    files?: any[];
  };
}

export const AssignmentPreview = ({ assignment }: AssignmentPreviewProps) => {
  const getDepartmentName = (code: string) => {
    const departments: Record<string, string> = {
      computer_science: "Computer Science",
      electrical_engineering: "Electrical Engineering",
      mechanical_engineering: "Mechanical Engineering",
      civil_engineering: "Civil Engineering",
      business: "Business",
    };
    
    return departments[code] || code;
  };
  
  const getYearName = (year: string) => {
    const years: Record<string, string> = {
      "1": "1st Year",
      "2": "2nd Year",
      "3": "3rd Year",
      "4": "4th Year",
    };
    
    return years[year] || `Year ${year}`;
  };

  return (
    <Card className="sticky top-24">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{assignment.title}</CardTitle>
            <CardDescription>Preview</CardDescription>
          </div>
          <Badge variant="outline" className="ml-2">
            {assignment.department ? getDepartmentName(assignment.department) : "Department"} • {assignment.year ? getYearName(assignment.year) : "Year"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="prose prose-sm max-w-none">
          {assignment.description ? (
            <p>{assignment.description}</p>
          ) : (
            <p className="text-muted-foreground italic">No description provided</p>
          )}
        </div>
        
        {assignment.files && assignment.files.length > 0 && (
          <div className="border rounded-md p-3 space-y-2">
            <h4 className="text-sm font-medium flex items-center">
              <Download className="mr-2 h-4 w-4" />
              Supporting Materials
            </h4>
            <ul className="text-sm space-y-1">
              {Array.from(assignment.files).map((file: any, index) => (
                <li key={index} className="flex items-center text-primary hover:underline">
                  <FileText className="mr-2 h-4 w-4" />
                  {file.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <CalendarIcon className="mr-1 h-4 w-4" />
          Due {format(assignment.dueDate, "PPP")}
        </div>
        <div className="text-sm font-medium">
          Max Grade: {assignment.maxGrade}
        </div>
      </CardFooter>
    </Card>
  );
};
