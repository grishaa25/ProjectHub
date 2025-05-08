
import React from "react";
import { Card } from "@/components/ui-custom/Card";
import { Users, FileText, AlertCircle, BrainCircuit, TrendingUp, TrendingDown } from "lucide-react";

export const AdminStatsCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card 
        variant="glass" 
        animation="scale"
        className="p-4 border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Users</p>
            <h3 className="text-2xl font-bold mt-1 text-gradient-primary">1,245</h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center transition-transform duration-300 hover:scale-110">
            <Users className="h-6 w-6 text-primary" />
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <TrendingUp className="h-4 w-4 text-success mr-1" />
          <p className="text-xs">
            <span className="text-success font-medium">+28</span> 
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
            <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
            <h3 className="text-2xl font-bold mt-1 bg-gradient-to-r from-secondary to-orange-400 bg-clip-text text-transparent">324</h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center transition-transform duration-300 hover:scale-110">
            <FileText className="h-6 w-6 text-secondary" />
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <TrendingUp className="h-4 w-4 text-success mr-1" />
          <p className="text-xs">
            <span className="text-success font-medium">+42</span>
            <span className="text-muted-foreground ml-1">this month</span>
          </p>
        </div>
      </Card>
      
      <Card 
        variant="glass" 
        animation="scale"
        className="p-4 border-destructive/10 hover:border-destructive/30 transition-all duration-300 hover:shadow-lg hover:shadow-destructive/10"
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Reports</p>
            <h3 className="text-2xl font-bold mt-1 bg-gradient-to-r from-destructive to-red-400 bg-clip-text text-transparent">18</h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center transition-transform duration-300 hover:scale-110">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <TrendingDown className="h-4 w-4 text-destructive mr-1" />
          <p className="text-xs">
            <span className="text-destructive font-medium">7</span>
            <span className="text-muted-foreground ml-1">need urgent review</span>
          </p>
        </div>
      </Card>
      
      <Card 
        variant="glass" 
        animation="scale"
        className="p-4 border-cyan-500/10 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-muted-foreground">AI Usage</p>
            <h3 className="text-2xl font-bold mt-1 bg-gradient-to-r from-cyan-500 to-blue-400 bg-clip-text text-transparent">586</h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-cyan-500/10 flex items-center justify-center transition-transform duration-300 hover:scale-110">
            <BrainCircuit className="h-6 w-6 text-cyan-500" />
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <TrendingUp className="h-4 w-4 text-success mr-1" />
          <p className="text-xs">
            <span className="text-success font-medium">+124</span>
            <span className="text-muted-foreground ml-1">queries today</span>
          </p>
        </div>
      </Card>
    </div>
  );
};
