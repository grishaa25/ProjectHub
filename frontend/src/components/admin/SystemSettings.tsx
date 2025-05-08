
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui-custom/Button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export const SystemSettings = () => {
  return (
    <Tabs defaultValue="permissions">
      <TabsList className="mb-6">
        <TabsTrigger value="permissions">Role Permissions</TabsTrigger>
        <TabsTrigger value="features">Feature Toggle</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      
      <TabsContent value="permissions">
        <div className="space-y-6">
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4">Admin Role Permissions</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Full System Access</Label>
                  <p className="text-sm text-muted-foreground">Can access all system features and settings</p>
                </div>
                <Switch checked={true} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">User Management</Label>
                  <p className="text-sm text-muted-foreground">Can add, edit, and remove all users</p>
                </div>
                <Switch checked={true} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Analytics Access</Label>
                  <p className="text-sm text-muted-foreground">Can view all system analytics and reports</p>
                </div>
                <Switch checked={true} />
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4">Professor Role Permissions</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Course Management</Label>
                  <p className="text-sm text-muted-foreground">Can create and manage courses</p>
                </div>
                <Switch checked={true} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Student Performance Access</Label>
                  <p className="text-sm text-muted-foreground">Can view detailed student performance</p>
                </div>
                <Switch checked={true} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">AI Tools Access</Label>
                  <p className="text-sm text-muted-foreground">Can use AI tools for grading and feedback</p>
                </div>
                <Switch checked={true} />
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4">Student Role Permissions</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Course Enrollment</Label>
                  <p className="text-sm text-muted-foreground">Can enroll in available courses</p>
                </div>
                <Switch checked={true} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Assignment Submission</Label>
                  <p className="text-sm text-muted-foreground">Can submit assignments to courses</p>
                </div>
                <Switch checked={true} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Forum Participation</Label>
                  <p className="text-sm text-muted-foreground">Can participate in course forums</p>
                </div>
                <Switch checked={true} />
              </div>
            </div>
          </Card>
          
          <div className="flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="features">
        <div className="space-y-6">
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4">AI Features</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Virtual Mentor</Label>
                  <p className="text-sm text-muted-foreground">AI assistant for students</p>
                </div>
                <Switch checked={true} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Smart Search</Label>
                  <p className="text-sm text-muted-foreground">Natural language search capabilities</p>
                </div>
                <Switch checked={true} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Auto-Grading</Label>
                  <p className="text-sm text-muted-foreground">AI-powered assignment grading</p>
                </div>
                <Switch checked={true} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Plagiarism Detection</Label>
                  <p className="text-sm text-muted-foreground">AI-based plagiarism checking</p>
                </div>
                <Switch checked={true} />
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4">Core Features</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Course Management</Label>
                  <p className="text-sm text-muted-foreground">Course creation and management</p>
                </div>
                <Switch checked={true} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Assignment System</Label>
                  <p className="text-sm text-muted-foreground">Assignment creation and submission</p>
                </div>
                <Switch checked={true} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Analytics Dashboard</Label>
                  <p className="text-sm text-muted-foreground">Student performance tracking</p>
                </div>
                <Switch checked={true} />
              </div>
            </div>
          </Card>
          
          <div className="flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="notifications">
        <div className="space-y-6">
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email From Name</Label>
                  <Input defaultValue="Learner Platform" />
                </div>
                <div className="space-y-2">
                  <Label>Reply-To Email</Label>
                  <Input defaultValue="noreply@learnerplatform.com" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Notification Template</Label>
                <Select defaultValue="default">
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default Template</SelectItem>
                    <SelectItem value="minimal">Minimal Template</SelectItem>
                    <SelectItem value="branded">Branded Template</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Notification Events</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="new-user" checked />
                    <Label htmlFor="new-user">New User Registration</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="course-update" checked />
                    <Label htmlFor="course-update">Course Updates</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="assignment" checked />
                    <Label htmlFor="assignment">New Assignment</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="grade" checked />
                    <Label htmlFor="grade">Grade Posted</Label>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          <div className="flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};
