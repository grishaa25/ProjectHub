
import React from "react";
import { BookOpenIcon, BrainCircuitIcon, BarChart3Icon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const LearningHub = () => {
  // Mock learning data
  const courses = [
    { id: 1, name: "Advanced Algorithms", progress: 78, weakAreas: ["Dynamic Programming", "Graph Theory"] },
    { id: 2, name: "Database Systems", progress: 65, weakAreas: ["Normalization", "Indexing"] },
    { id: 3, name: "Machine Learning", progress: 42, weakAreas: ["Neural Networks", "Ensemble Methods"] },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div>
          <CardTitle className="text-xl flex items-center">
            <BookOpenIcon className="mr-2 h-5 w-5 text-primary" />
            Smart Learning Hub
          </CardTitle>
          <CardDescription>Track your progress and focus areas</CardDescription>
        </div>
        <BrainCircuitIcon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {courses.map((course) => (
          <div key={course.id} className="mb-6 last:mb-0">
            <div className="flex justify-between mb-1">
              <h3 className="font-medium">{course.name}</h3>
              <span className="text-sm text-muted-foreground">{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="h-2 mb-2" />
            
            {course.weakAreas.length > 0 && (
              <div className="mt-2">
                <div className="flex items-start gap-1.5">
                  <BarChart3Icon className="h-4 w-4 text-destructive mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Focus areas:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {course.weakAreas.map((area, index) => (
                        <span 
                          key={index} 
                          className="text-xs bg-muted px-2 py-0.5 rounded-full"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
