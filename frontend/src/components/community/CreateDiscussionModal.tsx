"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import {Card} from "../ui/Card"
import Button from "../ui/Button"
import Input from "../ui/Input"

interface Tag {
  name: string
  variant: string
}

interface CreateDiscussionModalProps {
  onClose: () => void
  onSubmit: (data: any) => void
}

export default function CreateDiscussionModal({ onClose, onSubmit }: CreateDiscussionModalProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("general")
  const [tags, setTags] = useState<Tag[]>([])
  const [tagInput, setTagInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Tag variants
  const tagVariants = ["blue", "green", "purple", "yellow", "red"]

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const newErrors: { [key: string]: string } = {}
    if (!title.trim()) newErrors.title = "Title is required"
    if (!content.trim()) newErrors.content = "Content is required"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)

    try {
      await onSubmit({
        title,
        content,
        category,
        tags,
      })
    } catch (error) {
      console.error("Error creating discussion:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Add a tag
  const addTag = () => {
    if (tagInput.trim() && tags.length < 5) {
      const randomVariant = tagVariants[Math.floor(Math.random() * tagVariants.length)]
      setTags([...tags, { name: tagInput.trim(), variant: randomVariant }])
      setTagInput("")
    }
  }

  // Remove a tag
  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Start a Discussion</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Enter a descriptive title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  error={errors.title}
                />
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  id="content"
                  placeholder="Share your thoughts, questions, or ideas..."
                  className={`w-full px-3 py-2 rounded-lg border ${
                    errors.content ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-[#4a3630] bg-[#FBEAA0] min-h-[150px]`}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                ></textarea>
                {errors.content && <p className="mt-1 text-sm text-red-500">{errors.content}</p>}
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4a3630] bg-[#FBEAA0]"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="general">General</option>
                  <option value="tech">Tech</option>
                  <option value="design">Design</option>
                  <option value="language">Language</option>
                  <option value="soft-skills">Soft Skills</option>
                </select>
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (up to 5)
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    id="tags"
                    type="text"
                    placeholder="Add a tag"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addTag()
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addTag}
                    disabled={!tagInput.trim() || tags.length >= 5}
                  >
                    Add
                  </Button>
                </div>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag, index) => (
                      <div
                        key={index}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-${tag.variant}-100 text-${tag.variant}-800`}
                      >
                        {tag.name}
                        <button
                          type="button"
                          onClick={() => removeTag(index)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? "Posting..." : "Post Discussion"}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}
