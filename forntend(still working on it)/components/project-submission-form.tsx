// Component: Replicates project submission & validation loop
"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Label } from "./ui/label"
import { Select } from "./ui/select"
import { CheckCircle, AlertCircle } from "lucide-react"

interface FormState {
  title: string
  description: string
  category: string
  timeline: string
  resources: string
  goals: string
}

export function ProjectSubmissionForm() {
  const [formData, setFormData] = useState<FormState>({
    title: "",
    description: "",
    category: "",
    timeline: "",
    resources: "",
    goals: "",
  })

  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [submitted, setSubmitted] = useState(false)
  const [isValid, setIsValid] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is edited
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const validateForm = () => {
    const newErrors: Partial<FormState> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Project title is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Project description is required"
    } else if (formData.description.trim().length < 50) {
      newErrors.description = "Description must be at least 50 characters"
    }

    if (!formData.category) {
      newErrors.category = "Please select a category"
    }

    if (!formData.timeline.trim()) {
      newErrors.timeline = "Project timeline is required"
    }

    if (!formData.goals.trim()) {
      newErrors.goals = "Project goals are required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const valid = validateForm()
    setSubmitted(true)
    setIsValid(valid)

    if (valid) {
      // In a real app, this would submit to an API
      console.log("Form submitted:", formData)
    }
  }

  return (
    <div className="border rounded-xl p-6 bg-white shadow-sm">
      <h2 className="text-2xl font-bold mb-6">Project Submission</h2>

      {submitted && (
        <div
          className={`p-4 mb-6 rounded-lg ${isValid ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
        >
          <div className="flex items-center gap-2">
            {isValid ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
                <p className="text-green-700">Project submitted successfully! Your mentor will review it soon.</p>
              </>
            ) : (
              <>
                <AlertCircle className="h-5 w-5 text-red-500" />
                <p className="text-red-700">Please fix the errors in the form and try again.</p>
              </>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Project Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter a descriptive title for your project"
            className={errors.title ? "border-red-300" : ""}
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={errors.category ? "border-red-300" : ""}
          >
            <option value="">Select Category</option>
            <option value="engineering">Engineering & Computer Science</option>
            <option value="business">Business</option>
            <option value="creative">Creative Arts</option>
            <option value="medical">Medical Science</option>
            <option value="communication">Mass Communication</option>
            <option value="physiotherapy">Physiotherapy</option>
          </Select>
          {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Project Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Provide a detailed description of your project"
            rows={4}
            className={errors.description ? "border-red-300" : ""}
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="timeline">Project Timeline</Label>
          <Input
            id="timeline"
            name="timeline"
            value={formData.timeline}
            onChange={handleChange}
            placeholder="e.g., 8 weeks, 3 months"
            className={errors.timeline ? "border-red-300" : ""}
          />
          {errors.timeline && <p className="text-red-500 text-sm">{errors.timeline}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="resources">Required Resources</Label>
          <Textarea
            id="resources"
            name="resources"
            value={formData.resources}
            onChange={handleChange}
            placeholder="List any resources, equipment, or software needed"
            rows={3}
            className={errors.resources ? "border-red-300" : ""}
          />
          {errors.resources && <p className="text-red-500 text-sm">{errors.resources}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="goals">Project Goals</Label>
          <Textarea
            id="goals"
            name="goals"
            value={formData.goals}
            onChange={handleChange}
            placeholder="What are the main objectives and expected outcomes?"
            rows={3}
            className={errors.goals ? "border-red-300" : ""}
          />
          {errors.goals && <p className="text-red-500 text-sm">{errors.goals}</p>}
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline">
            Save Draft
          </Button>
          <Button type="submit" className="bg-[#6b3e7c] hover:bg-[#5a2e6b]">
            Submit Project
          </Button>
        </div>
      </form>
    </div>
  )
}
