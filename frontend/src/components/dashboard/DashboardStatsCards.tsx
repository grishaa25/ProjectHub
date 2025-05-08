import React from "react";
import { Card } from "@/components/ui-custom/Card";
import { BookOpen, Award, Rocket, Users, TrendingUp } from "lucide-react";

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
            <p className="text-sm font-medium text-muted-foreground">
              Active Courses
            </p>
            <h3 className="text-2xl font-bold mt-1 bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              4
            </h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center transition-transform duration-300 hover:scale-110">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <TrendingUp className="h-4 w-4 text-success mr-1" />
          <p className="text-xs">
            <span className="text-success font-medium">86%</span>
            <span className="text-muted-foreground ml-1">avg. completion</span>
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
            <p className="text-sm font-medium text-muted-foreground">
              Achievements
            </p>
            <h3 className="text-2xl font-bold mt-1 bg-gradient-to-r from-secondary to-orange-400 bg-clip-text text-transparent">
              12
            </h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center transition-transform duration-300 hover:scale-110">
            <Award className="h-6 w-6 text-secondary" />
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <TrendingUp className="h-4 w-4 text-success mr-1" />
          <p className="text-xs">
            <span className="text-success font-medium">+3</span>
            <span className="text-muted-foreground ml-1">this month</span>
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
            <p className="text-sm font-medium text-muted-foreground">
              Projects
            </p>
            <h3 className="text-2xl font-bold mt-1 bg-gradient-to-r from-accent to-purple-400 bg-clip-text text-transparent">
              5
            </h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center transition-transform duration-300 hover:scale-110">
            <Rocket className="h-6 w-6 text-accent" />
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <TrendingUp className="h-4 w-4 text-success mr-1" />
          <p className="text-xs">
            <span className="text-success font-medium">2</span>
            <span className="text-muted-foreground ml-1">with professors</span>
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
            <p className="text-sm font-medium text-muted-foreground">
              Collaborators
            </p>
            <h3 className="text-2xl font-bold mt-1 bg-gradient-to-r from-cyan-500 to-blue-400 bg-clip-text text-transparent">
              16
            </h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-cyan-500/10 flex items-center justify-center transition-transform duration-300 hover:scale-110">
            <Users className="h-6 w-6 text-cyan-500" />
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <TrendingUp className="h-4 w-4 text-success mr-1" />
          <p className="text-xs">
            <span className="text-success font-medium">+4</span>
            <span className="text-muted-foreground ml-1">new connections</span>
          </p>
        </div>
      </Card>
    </div>
  );
};
