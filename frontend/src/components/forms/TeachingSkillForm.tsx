/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Star, X } from "lucide-react"
import { useState } from "react"
import Button from "../ui/Button"
import Card from "../ui/Card"

export default function TeachingSkillForm({
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
      experience: "",
      description: "",
      rating: 3,
    }
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev: any) => ({
      ...prev,
      [name]: name === "rating" ? parseInt(value) : value,
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
            {initialData ? "Edit" : "Add"} Teaching Skill
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
                <option value="Expert">Expert</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FBEAA0]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FBEAA0]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <div className="flex items-center">
                <input
                  type="range"
                  name="rating"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={handleChange}
                  className="w-full mr-3"
                />
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className={i < formData.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"} />
                  ))}
                </div>
              </div>
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