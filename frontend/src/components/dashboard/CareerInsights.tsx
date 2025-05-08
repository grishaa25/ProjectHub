
import React from "react";
import { BriefcaseIcon, TrendingUpIcon, LineChartIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const CareerInsights = () => {
  // Mock career data
  const careerInsights = {
    skills: [
      { name: "Machine Learning", rating: 78, trending: true },
      { name: "Algorithms", rating: 85, trending: false },
      { name: "Data Structures", rating: 82, trending: false },
      { name: "Database Design", rating: 70, trending: true },
    ],
    opportunities: [
      { role: "ML Engineer Intern", company: "TechCorp", match: "92% Match" },
      { role: "Software Developer", company: "InnovateSoft", match: "85% Match" },
    ]
  };

  return (
    <Card>
      <CardHeader className="pb-2 space-y-0">
        <CardTitle className="text-lg flex items-center">
          <BriefcaseIcon className="mr-2 h-4 w-4 text-primary" />
          Career Insights
        </CardTitle>
        <CardDescription>AI analysis of your skills & opportunities</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center">
            <LineChartIcon className="h-3.5 w-3.5 mr-1.5 text-primary" />
            Skills Portfolio
          </h4>
          <div className="space-y-2">
            {careerInsights.skills.map((skill, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-xs">{skill.name}</span>
                  {skill.trending && (
                    <TrendingUpIcon className="h-3 w-3 ml-1 text-success" />
                  )}
                </div>
                <div className="flex items-center">
                  <div className="w-16 bg-muted rounded-full h-1.5 mr-2">
                    <div 
                      className="bg-primary rounded-full h-1.5"
                      style={{ width: `${skill.rating}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium">{skill.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">AI-Matched Opportunities</h4>
          <div className="space-y-2">
            {careerInsights.opportunities.map((job, index) => (
              <div key={index} className="border rounded-lg p-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">{job.role}</p>
                    <p className="text-xs text-muted-foreground">{job.company}</p>
                  </div>
                  <Badge className="bg-success text-xs">{job.match}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
