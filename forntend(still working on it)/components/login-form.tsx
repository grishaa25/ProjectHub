// Component: Replicates user authentication login form
"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Checkbox } from "./ui/checkbox"
import Link from "next/link"
import { Github } from "lucide-react"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would authenticate with an API
    console.log("Login submitted:", { email, password, rememberMe })

    // Redirect to dashboard (simulated)
    window.location.href = "/dashboard"
  }

  return (
    <div className="mx-auto max-w-md space-y-6 p-6 bg-white rounded-xl shadow-sm">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Login to ProjectHub</h1>
        <p className="text-gray-500">Enter your university email to access your projects</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">University Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="your.name@university.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/forgot-password" className="text-sm text-[#6b3e7c] hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
          />
          <Label htmlFor="remember" className="text-sm font-normal">
            Remember me for 30 days
          </Label>
        </div>

        <Button type="submit" className="w-full bg-[#6b3e7c] hover:bg-[#5a2e6b]">
          Sign In
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Or continue with</span>
        </div>
      </div>

      <Button variant="outline" className="w-full" type="button">
        <Github className="mr-2 h-4 w-4" />
        GitHub
      </Button>

      <p className="text-center text-sm text-gray-500">
        Don't have an account?{" "}
        <Link href="/signup" className="text-[#6b3e7c] hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  )
}
