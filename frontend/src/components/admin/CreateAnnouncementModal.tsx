"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import {Card} from "../ui/Card"
import Button from "../ui/Button"
import Input from "../ui/Input"

interface CreateAnnouncementModalProps {
  announcement?: any
  onClose: () => void
  onSubmit: (data: any) => void
}

export default function CreateAnnouncementModal({ announcement, onClose, onSubmit }: CreateAnnouncementModalProps) {
  const isEditing = !!announcement

  const [title, setTitle] = useState(announcement?.title || "")
  const [content, setContent] = useState(announcement?.content || "")
  const [buttonText, setButtonText] = useState(announcement?.buttonText || "Learn More")
  const [buttonLink, setButtonLink] = useState(announcement?.buttonLink || "")
  const [showSecondaryButton, setShowSecondaryButton] = useState(!!announcement?.secondaryButtonText)
  const [secondaryButtonText, setSecondaryButtonText] = useState(announcement?.secondaryButtonText || "Try It Now")
  const [secondaryButtonLink, setSecondaryButtonLink] = useState(announcement?.secondaryButtonLink || "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const newErrors: { [key: string]: string } = {}
    if (!title.trim()) newErrors.title = "Title is required"
    if (!content.trim()) newErrors.content = "Content is required"
    if (!buttonText.trim()) newErrors.buttonText = "Button text is required"
    if (!buttonLink.trim()) newErrors.buttonLink = "Button link is required"

    if (showSecondaryButton) {
      if (!secondaryButtonText.trim()) newErrors.secondaryButtonText = "Secondary button text is required"
      if (!secondaryButtonLink.trim()) newErrors.secondaryButtonLink = "Secondary button link is required"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)

    try {
      const announcementData = {
        title,
        content,
        buttonText,
        buttonLink,
        ...(showSecondaryButton && {
          secondaryButtonText,
          secondaryButtonLink,
        }),
        isAnnouncement: true,
      }

      await onSubmit(announcementData)
    } catch (error) {
      console.error("Error creating announcement:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {isEditing ? "Edit Announcement" : "Create Announcement"}
            </h2>
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
                  placeholder="Enter announcement title"
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
                  placeholder="Enter announcement content..."
                  className={`w-full px-3 py-2 rounded-lg border ${
                    errors.content ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-[#4a3630] bg-[#FBEAA0] min-h-[150px]`}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                ></textarea>
                {errors.content && <p className="mt-1 text-sm text-red-500">{errors.content}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="buttonText" className="block text-sm font-medium text-gray-700 mb-1">
                    Primary Button Text
                  </label>
                  <Input
                    id="buttonText"
                    type="text"
                    placeholder="e.g., Learn More"
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                    error={errors.buttonText}
                  />
                </div>

                <div>
                  <label htmlFor="buttonLink" className="block text-sm font-medium text-gray-700 mb-1">
                    Primary Button Link
                  </label>
                  <Input
                    id="buttonLink"
                    type="text"
                    placeholder="e.g., /features/new-feature"
                    value={buttonLink}
                    onChange={(e) => setButtonLink(e.target.value)}
                    error={errors.buttonLink}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showSecondaryButton"
                  checked={showSecondaryButton}
                  onChange={(e) => setShowSecondaryButton(e.target.checked)}
                  className="h-4 w-4 text-[#4a3630] focus:ring-[#4a3630] border-gray-300 rounded"
                />
                <label htmlFor="showSecondaryButton" className="text-sm text-gray-700">
                  Add secondary button
                </label>
              </div>

              {showSecondaryButton && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="secondaryButtonText" className="block text-sm font-medium text-gray-700 mb-1">
                      Secondary Button Text
                    </label>
                    <Input
                      id="secondaryButtonText"
                      type="text"
                      placeholder="e.g., Try It Now"
                      value={secondaryButtonText}
                      onChange={(e) => setSecondaryButtonText(e.target.value)}
                      error={errors.secondaryButtonText}
                    />
                  </div>

                  <div>
                    <label htmlFor="secondaryButtonLink" className="block text-sm font-medium text-gray-700 mb-1">
                      Secondary Button Link
                    </label>
                    <Input
                      id="secondaryButtonLink"
                      type="text"
                      placeholder="e.g., /try-now"
                      value={secondaryButtonLink}
                      onChange={(e) => setSecondaryButtonLink(e.target.value)}
                      error={errors.secondaryButtonLink}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : isEditing ? "Update Announcement" : "Publish Announcement"}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}
