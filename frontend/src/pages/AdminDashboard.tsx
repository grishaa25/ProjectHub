
import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import PageTransition from "@/components/layout/PageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui-custom/Button";
import { UserPlus, UserX, Edit, BarChart3, Settings, BrainCircuit, Users, Shield, FileText, AlertCircle } from "lucide-react";
import { DataTable } from "@/components/admin/DataTable";
import { AnalyticsPanel } from "@/components/admin/AnalyticsPanel";
import { SystemSettings } from "@/components/admin/SystemSettings";
import { AiInsightsPanel } from "@/components/admin/AiInsightsPanel";
import { AdminStatsCards } from "@/components/admin/AdminStatsCards";

const AdminDashboard = () => {
  return (
    <PageTransition>
      <Navbar />
      <main className="pt-24 pb-16 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-background dark:to-background">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Manage users, view analytics, and configure system settings
              </p>
            </div>
            <div className="flex gap-2">
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add New User
              </Button>
              <Button variant="outline">
                <Shield className="mr-2 h-4 w-4 text-blue-500" />
                Moderation
              </Button>
            </div>
          </div>

          <AdminStatsCards />

          <Tabs defaultValue="user-management" className="space-y-6 mt-6">
            <TabsList className="grid grid-cols-4 w-full max-w-3xl bg-card/50 backdrop-blur-sm">
              <TabsTrigger value="user-management" className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">User Management</span>
                <span className="sm:hidden">Users</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center">
                <BarChart3 className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Analytics</span>
                <span className="sm:hidden">Stats</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">System Settings</span>
                <span className="sm:hidden">Settings</span>
              </TabsTrigger>
              <TabsTrigger value="ai-insights" className="flex items-center">
                <BrainCircuit className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">AI Insights</span>
                <span className="sm:hidden">AI</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="user-management" className="space-y-6">
              <Card className="border-blue-100 dark:border-blue-900/30 shadow-lg shadow-blue-500/5">
                <CardHeader className="border-b border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-900/5">
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5 text-blue-500" />
                    User Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <DataTable />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <Card className="border-indigo-100 dark:border-indigo-900/30 shadow-lg shadow-indigo-500/5">
                <CardHeader className="border-b border-indigo-100 dark:border-indigo-900/30 bg-indigo-50/50 dark:bg-indigo-900/5">
                  <CardTitle className="flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5 text-indigo-500" />
                    Reports & Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <AnalyticsPanel />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card className="border-purple-100 dark:border-purple-900/30 shadow-lg shadow-purple-500/5">
                <CardHeader className="border-b border-purple-100 dark:border-purple-900/30 bg-purple-50/50 dark:bg-purple-900/5">
                  <CardTitle className="flex items-center">
                    <Settings className="mr-2 h-5 w-5 text-purple-500" />
                    System Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <SystemSettings />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ai-insights" className="space-y-6">
              <Card className="border-cyan-100 dark:border-cyan-900/30 shadow-lg shadow-cyan-500/5">
                <CardHeader className="border-b border-cyan-100 dark:border-cyan-900/30 bg-cyan-50/50 dark:bg-cyan-900/5">
                  <CardTitle className="flex items-center">
                    <BrainCircuit className="mr-2 h-5 w-5 text-cyan-500" />
                    AI Usage Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <AiInsightsPanel />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </PageTransition>
  );
};

export default AdminDashboard;
