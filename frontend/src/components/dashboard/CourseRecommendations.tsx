
import React from "react";
import { Compass, Star, TrendingUp, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export const CourseRecommendations = () => {
  // Mock recommended courses data
  const recommendedCourses = [
    {
      id: 1,
      title: "Advanced Data Structures",
      instructor: "Dr. Michael Chen",
      rationale: "Based on your progress in Algorithms",
      difficulty: "Advanced",
      duration: "12 weeks",
      rating: 4.8,
      tags: ["Computer Science", "Programming"],
      trending: true
    },
    {
      id: 2,
      title: "Natural Language Processing",
      instructor: "Prof. Emily Rodriguez",
      rationale: "Complements your Machine Learning course",
      difficulty: "Intermediate",
      duration: "10 weeks",
      rating: 4.6,
      tags: ["AI", "Data Science"],
      trending: true
    },
    {
      id: 3,
      title: "Cloud Computing Architecture",
      instructor: "Dr. James Wilson",
      rationale: "Aligns with your career interests",
      difficulty: "Intermediate",
      duration: "8 weeks",
      rating: 4.7,
      tags: ["Cloud", "Systems"],
      trending: false
    },
    {
      id: 4,
      title: "Web Application Security",
      instructor: "Dr. Sarah Kim",
      rationale: "Builds upon your programming skills",
      difficulty: "Intermediate",
      duration: "6 weeks",
      rating: 4.5,
      tags: ["Security", "Web Development"],
      trending: false
    }
  ];

  return (
    <Card>
      <CardHeader className="pb-2 space-y-0">
        <CardTitle className="text-xl flex items-center">
          <Compass className="mr-2 h-5 w-5 text-primary" />
          AI Course Recommendations
        </CardTitle>
        <CardDescription>
          Personalized course suggestions based on your progress and goals
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[280px] pr-4">
          <div className="space-y-4">
            {recommendedCourses.map((course) => (
              <div key={course.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{course.title}</h3>
                    <p className="text-sm text-muted-foreground">{course.instructor}</p>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-3.5 w-3.5 text-secondary fill-secondary mr-1" />
                    <span className="text-sm font-medium">{course.rating}</span>
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground mt-2">
                  <span className="font-medium text-primary">AI Logic:</span> {course.rationale}
                </p>
                
                <div className="flex flex-wrap gap-2 mt-3">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {course.duration}
                  </div>
                  
                  {course.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  
                  {course.trending && (
                    <Badge className="bg-secondary text-secondary-foreground text-xs">
                      <TrendingUp className="h-3 w-3 mr-1" /> Trending
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
