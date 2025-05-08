import React from "react";
import { BellIcon, BookOpenIcon, GraduationCapIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

export const DashboardHeader = () => {
  const { userName } = useAuth();

  // Mock student data (we'd fetch this from an API in a real implementation)
  const student = {
    name: userName || "Student",
    level: 8,
    xp: 2450,
    nextLevel: 3000,
    course: "Computer Science",
    year: 3,
    notifications: 5,
  };

  const progressPercentage = (student.xp / student.nextLevel) * 100;

  return (
    <div className="glass-card p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {student.name}</h1>
          <p className="text-muted-foreground mt-1">
            Let's continue your learning journey
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div className="glass-card p-4 flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
            <GraduationCapIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Program</p>
            <p className="font-medium">{student.course}</p>
          </div>
        </div>

        <div className="glass-card p-4 flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center">
            <BookOpenIcon className="h-5 w-5 text-secondary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Year</p>
            <p className="font-medium">{student.year}rd Year</p>
          </div>
        </div>

        {/* <div className="glass-card p-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Level {student.level}
            </span>
            <span className="text-sm font-medium">
              {student.xp}/{student.nextLevel} XP
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary rounded-full h-2 transition-all duration-500 ease-in-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div> */}
      </div>
    </div>
  );
};
