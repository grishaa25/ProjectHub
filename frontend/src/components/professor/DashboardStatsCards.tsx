
import React from "react";
import { Card } from "@/components/ui-custom/Card";
import { Users, FolderIcon, GraduationCap, CheckCircle, TrendingUp } from "lucide-react";

export const DashboardStatsCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card 
        variant="glass"
        animation="scale" 
        className="p-4 border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
            <h3 className="text-2xl font-bold mt-1 bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">12</h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center transition-transform duration-300 hover:scale-110">
            <FolderIcon className="h-6 w-6 text-primary" />
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <TrendingUp className="h-4 w-4 text-success mr-1" />
          <p className="text-xs">
            <span className="text-success font-medium">+2</span>
            <span className="text-muted-foreground ml-1">new this month</span>
          </p>
        </div>
      </Card>
      
      <Card 
        variant="glass"
        animation="scale" 
        className="p-4 border-secondary/10 hover:border-secondary/30 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/10"
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Student Collaborators</p>
            <h3 className="text-2xl font-bold mt-1 bg-gradient-to-r from-secondary to-orange-400 bg-clip-text text-transparent">47</h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center transition-transform duration-300 hover:scale-110">
            <Users className="h-6 w-6 text-secondary" />
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <TrendingUp className="h-4 w-4 text-success mr-1" />
          <p className="text-xs">
            <span className="text-success font-medium">+8</span>
            <span className="text-muted-foreground ml-1">this semester</span>
          </p>
        </div>
      </Card>
      
      <Card 
        variant="glass"
        animation="scale" 
        className="p-4 border-success/10 hover:border-success/30 transition-all duration-300 hover:shadow-lg hover:shadow-success/10"
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Completed Projects</p>
            <h3 className="text-2xl font-bold mt-1 bg-gradient-to-r from-success to-green-400 bg-clip-text text-transparent">8</h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center transition-transform duration-300 hover:scale-110">
            <CheckCircle className="h-6 w-6 text-success" />
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <TrendingUp className="h-4 w-4 text-success mr-1" />
          <p className="text-xs">
            <span className="text-success font-medium">+3</span>
            <span className="text-muted-foreground ml-1">since last semester</span>
          </p>
        </div>
      </Card>
      
      <Card 
        variant="glass"
        animation="scale" 
        className="p-4 border-accent/10 hover:border-accent/30 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10"
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Students Mentored</p>
            <h3 className="text-2xl font-bold mt-1 bg-gradient-to-r from-accent to-purple-400 bg-clip-text text-transparent">32</h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center transition-transform duration-300 hover:scale-110">
            <GraduationCap className="h-6 w-6 text-accent" />
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <TrendingUp className="h-4 w-4 text-success mr-1" />
          <p className="text-xs">
            <span className="text-success font-medium">+5</span>
            <span className="text-muted-foreground ml-1">new mentorships</span>
          </p>
        </div>
      </Card>
    </div>
  );
};
