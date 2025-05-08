
import React, { useState } from "react";
import { SearchIcon, BookOpenIcon, UsersIcon, FileTextIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const SmartSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);

  // Mock search functionality
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  // Mock search results
  const searchResults = [
    { type: 'course', name: 'Machine Learning Fundamentals', icon: BookOpenIcon },
    { type: 'professor', name: 'Dr. Sarah Johnson', icon: UsersIcon },
    { type: 'material', name: 'Neural Networks PDF Guide', icon: FileTextIcon },
  ];

  return (
    <Card>
      <CardHeader className="pb-2 space-y-0">
        <CardTitle className="text-lg flex items-center">
          <SearchIcon className="mr-2 h-4 w-4 text-primary" />
          AI-Powered Search
        </CardTitle>
        <CardDescription>Find courses, materials & more</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch}>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Try 'ML courses about neural networks'"
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => searchTerm.trim() && setShowResults(true)}
            />
          </div>
        </form>

        {showResults && (
          <div className="mt-4 space-y-2">
            {searchResults.map((result, index) => {
              const Icon = result.icon;
              return (
                <div 
                  key={index} 
                  className="flex items-center p-2 rounded-md hover:bg-muted transition-colors cursor-pointer"
                >
                  <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center mr-3">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{result.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{result.type}</p>
                  </div>
                </div>
              );
            })}
            
            <p className="text-xs text-muted-foreground text-center mt-2">
              Try natural language queries like "Show me all AI papers from 2023"
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
