
import React from "react";
import { BookOpenIcon, FileTextIcon, BookmarkIcon, DownloadIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const StudyMaterials = () => {
  // Mock study materials data
  const materials = {
    recommended: [
      {
        id: 1,
        title: "Machine Learning Fundamentals",
        type: "PDF",
        course: "Machine Learning",
        size: "2.4 MB",
        aiRecommendation: "Covers your weak areas in Neural Networks"
      },
      {
        id: 2,
        title: "Advanced Algorithms Lecture Notes",
        type: "PDF",
        course: "Advanced Algorithms",
        size: "1.8 MB",
        aiRecommendation: "Helpful for your upcoming assignment"
      },
      {
        id: 3,
        title: "Database Design Principles",
        type: "PDF",
        course: "Database Systems",
        size: "3.2 MB",
        aiRecommendation: "Addresses your weak areas in Normalization"
      }
    ],
    recent: [
      {
        id: 4,
        title: "Graph Theory Explained",
        type: "PDF",
        course: "Advanced Algorithms",
        size: "1.5 MB"
      },
      {
        id: 5,
        title: "SQL Query Optimization",
        type: "PDF",
        course: "Database Systems",
        size: "2.1 MB"
      },
      {
        id: 6,
        title: "Introduction to Deep Learning",
        type: "PDF",
        course: "Machine Learning",
        size: "4.2 MB"
      }
    ],
    bookmarked: [
      {
        id: 7,
        title: "Dynamic Programming Problems",
        type: "PDF",
        course: "Advanced Algorithms",
        size: "1.3 MB"
      },
      {
        id: 8,
        title: "Neural Networks Architecture",
        type: "PDF",
        course: "Machine Learning",
        size: "2.8 MB"
      }
    ]
  };

  const renderMaterialList = (materialList: any[]) => (
    <div className="space-y-3">
      {materialList.map((material) => (
        <div key={material.id} className="flex items-start border rounded-lg p-3 hover:bg-muted/50 transition-colors">
          <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
            <FileTextIcon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between">
              <h4 className="font-medium text-sm truncate">{material.title}</h4>
              <Badge variant="outline" className="ml-2 flex-shrink-0">
                {material.type}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{material.course} • {material.size}</p>
            
            {material.aiRecommendation && (
              <p className="text-xs text-primary mt-1">
                <span className="font-medium">AI:</span> {material.aiRecommendation}
              </p>
            )}
          </div>
          <Button variant="ghost" size="icon" className="ml-2 flex-shrink-0 h-8 w-8">
            <DownloadIcon className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );

  return (
    <Card>
      <CardHeader className="pb-2 space-y-0">
        <CardTitle className="text-xl flex items-center">
          <BookOpenIcon className="mr-2 h-5 w-5 text-primary" />
          Smart Study Materials
        </CardTitle>
        <CardDescription>
          Personalized study materials based on your learning needs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="recommended">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="bookmarked">
              <BookmarkIcon className="h-4 w-4 mr-1" />
              Bookmarked
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="recommended">
            {renderMaterialList(materials.recommended)}
          </TabsContent>
          
          <TabsContent value="recent">
            {renderMaterialList(materials.recent)}
          </TabsContent>
          
          <TabsContent value="bookmarked">
            {renderMaterialList(materials.bookmarked)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
