/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { X } from "lucide-react"
import { useState } from "react"
import Button from "../ui/Button"
import Card from "../ui/Card"

export default function LearningSkillForm({
  initialData,
  onCancel,
  onSubmit,
}: {
  initialData?: any
  onCancel: () => void
  onSubmit: (data: any) => void
}) {
  const [formData, setFormData] = useState(
    initialData || {
      name: "",
      level: "Beginner",
      goal: "",
      reason: "",
    }
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Card className="overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {initialData ? "Edit" : "Add"} Learning Skill
          </h3>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skill Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FBEAA0]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FBEAA0]"
                required
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Goal</label>
              <input
                type="text"
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FBEAA0]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Learning</label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FBEAA0]"
                required
              />
            </div>

            <div className="flex space-x-2 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="flex-1">
                {initialData ? "Update" : "Add"} Skill
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Card>
  )
}