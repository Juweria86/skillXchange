"use client"

import type React from "react"

import { useState } from "react"
import { X, Upload, Link } from "lucide-react"
import {Card} from "../ui/Card"
import Button from "../ui/Button"
import Input from "../ui/Input"

interface ShareResourceModalProps {
  onClose: () => void
  onSubmit: (data: any) => void
}

export default function ShareResourceModal({ onClose, onSubmit }: ShareResourceModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [resourceType, setResourceType] = useState("file") // "file" or "link"
  const [file, setFile] = useState<File | null>(null)
  const [fileType, setFileType] = useState("")
  const [externalLink, setExternalLink] = useState("")
  const [topic, setTopic] = useState("other")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)

      // Set file type
      if (selectedFile.type.includes("pdf")) {
        setFileType("PDF · " + formatFileSize(selectedFile.size))
      } else if (selectedFile.type.includes("presentation") || selectedFile.type.includes("powerpoint")) {
        setFileType("Slides · " + formatFileSize(selectedFile.size))
      } else if (selectedFile.type.includes("word") || selectedFile.type.includes("document")) {
        setFileType("Document · " + formatFileSize(selectedFile.size))
      } else if (selectedFile.type.includes("image")) {
        setFileType("Image · " + formatFileSize(selectedFile.size))
      } else {
        setFileType("File · " + formatFileSize(selectedFile.size))
      }
    }
  }

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const newErrors: { [key: string]: string } = {}
    if (!title.trim()) newErrors.title = "Title is required"
    if (!description.trim()) newErrors.description = "Description is required"

    if (resourceType === "file" && !file) {
      newErrors.file = "Please select a file to upload"
    } else if (resourceType === "link" && !externalLink.trim()) {
      newErrors.link = "Please enter a valid URL"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)

    try {
      const resourceData: any = {
        title,
        description,
        topic,
        type: fileType || "Link · Course",
      }

      if (resourceType === "file") {
        resourceData.file = file
      } else {
        resourceData.externalLink = externalLink
      }

      await onSubmit(resourceData)
    } catch (error) {
      console.error("Error sharing resource:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Share a Resource</h2>
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
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  placeholder="Briefly describe this resource..."
                  className={`w-full px-3 py-2 rounded-lg border ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-[#4a3630] bg-[#FBEAA0] min-h-[100px]`}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resource Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="resourceType"
                      checked={resourceType === "file"}
                      onChange={() => setResourceType("file")}
                      className="h-4 w-4 text-[#4a3630] focus:ring-[#4a3630] border-gray-300"
                    />
                    <span>Upload File</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="resourceType"
                      checked={resourceType === "link"}
                      onChange={() => setResourceType("link")}
                      className="h-4 w-4 text-[#4a3630] focus:ring-[#4a3630] border-gray-300"
                    />
                    <span>External Link</span>
                  </label>
                </div>
              </div>

              {resourceType === "file" ? (
                <div>
                  <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
                    Upload File
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {file ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-center">
                          <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                            <Upload size={24} />
                          </div>
                        </div>
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">{fileType}</p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setFile(null)
                            setFileType("")
                          }}
                        >
                          Change File
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center">
                            <Upload size={24} />
                          </div>
                        </div>
                        <p className="text-sm text-gray-700">
                          Drag and drop a file here, or{" "}
                          <label className="text-[#4a3630] font-medium cursor-pointer hover:underline">
                            browse
                            <input
                              type="file"
                              id="file"
                              className="hidden"
                              onChange={handleFileChange}
                              accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.zip"
                            />
                          </label>
                        </p>
                        <p className="text-xs text-gray-500">
                          Supported formats: PDF, Word, PowerPoint, Excel, Images, ZIP (Max 10MB)
                        </p>
                      </div>
                    )}
                  </div>
                  {errors.file && <p className="mt-1 text-sm text-red-500">{errors.file}</p>}
                </div>
              ) : (
                <div>
                  <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">
                    External Link
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Link size={16} className="text-gray-500" />
                    </div>
                    <input
                      type="url"
                      id="link"
                      placeholder="https://example.com/resource"
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                        errors.link ? "border-red-500" : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-[#4a3630] bg-[#FBEAA0]`}
                      value={externalLink}
                      onChange={(e) => setExternalLink(e.target.value)}
                    />
                  </div>
                  {errors.link && <p className="mt-1 text-sm text-red-500">{errors.link}</p>}
                </div>
              )}

              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
                  Topic
                </label>
                <select
                  id="topic"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4a3630] bg-[#FBEAA0]"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                >
                  <option value="programming">Programming</option>
                  <option value="design">Design</option>
                  <option value="business">Business</option>
                  <option value="language">Language</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? "Sharing..." : "Share Resource"}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}
