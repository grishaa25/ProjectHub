// Component: Replicates user authentication signup form
"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select } from "./ui/select"
import Link from "next/link"
import { Github } from "lucide-react"

export function SignupForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!formData.email.endsWith(".edu")) {
      newErrors.email = "Please use a university email (.edu)"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      // In a real app, this would register with an API
      console.log("Signup submitted:", formData)

      // Redirect to dashboard (simulated)
      window.location.href = "/dashboard"
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6 p-6 bg-white rounded-xl shadow-sm">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Create an Account</h1>
        <p className="text-gray-500">Join ProjectHub to discover and collaborate on university projects</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={errors.firstName ? "border-red-300" : ""}
            />
            {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={errors.lastName ? "border-red-300" : ""}
            />
            {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">University Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your.name@university.edu"
            className={errors.email ? "border-red-300" : ""}
          />
          {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">I am a</Label>
          <Select id="role" name="role" value={formData.role} onChange={handleChange}>
            <option value="student">Student</option>
            <option value="mentor">Mentor</option>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? "border-red-300" : ""}
          />
          {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={errors.confirmPassword ? "border-red-300" : ""}
          />
          {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
        </div>

        <Button type="submit" className="w-full bg-[#6b3e7c] hover:bg-[#5a2e6b]">
          Create Account
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
        Already have an account?{" "}
        <Link href="/login" className="text-[#6b3e7c] hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
