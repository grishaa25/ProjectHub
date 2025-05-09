// Profile page showing user information and settings
import { Navbar } from "@/components/navbar"
import { ProfileForm } from "@/components/profile-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProfilePage() {
  // Mock user data
  const userData = {
    name: "John Doe",
    email: "john.doe@university.edu",
    role: "student",
    department: "engineering",
    skills: ["React", "JavaScript", "UI/UX Design"],
    bio: "Computer Science student with a passion for web development and AI. Looking to collaborate on innovative projects.",
    github: "https://github.com/johndoe",
    linkedin: "https://linkedin.com/in/johndoe",
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="container">
          <h1 className="text-4xl font-bold mb-8">Your Profile</h1>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <Tabs defaultValue="profile">
              <TabsList className="bg-gray-100 p-0 h-14">
                <TabsTrigger value="profile" className="h-14 px-8 data-[state=active]:bg-white rounded-none">
                  Profile Information
                </TabsTrigger>
                <TabsTrigger value="account" className="h-14 px-8 data-[state=active]:bg-white rounded-none">
                  Account Settings
                </TabsTrigger>
                <TabsTrigger value="notifications" className="h-14 px-8 data-[state=active]:bg-white rounded-none">
                  Notifications
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="p-6">
                <ProfileForm initialData={userData} />
              </TabsContent>

              <TabsContent value="account" className="p-6">
                <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
                <p className="text-gray-500">Manage your account settings and preferences.</p>
              </TabsContent>

              <TabsContent value="notifications" className="p-6">
                <h2 className="text-2xl font-bold mb-6">Notification Preferences</h2>
                <p className="text-gray-500">Manage your notification settings.</p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
