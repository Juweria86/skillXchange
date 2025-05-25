"use client"

import type React from "react"

import { useState } from "react"
import { X, Plus, Calendar } from "lucide-react"
import {Card} from "../ui/Card"
import Button from "../ui/Button"
import Input from "../ui/Input"

interface ChallengeFormProps {
  challenge?: any
  onClose: () => void
  onSubmit: (data: any) => void
}

export default function ChallengeForm({ challenge, onClose, onSubmit }: ChallengeFormProps) {
  const isEditing = !!challenge

  const [title, setTitle] = useState(challenge?.title || "")
  const [description, setDescription] = useState(challenge?.description || "")
  const [startDate, setStartDate] = useState(
    challenge?.startDate ? new Date(challenge.startDate).toISOString().split("T")[0] : "",
  )
  const [endDate, setEndDate] = useState(
    challenge?.endDate ? new Date(challenge.endDate).toISOString().split("T")[0] : "",
  )
  const [requirements, setRequirements] = useState(challenge?.requirements || "")
  const [requiredSessions, setRequiredSessions] = useState(challenge?.requiredSessions || 3)
  const [prizes, setPrizes] = useState(challenge?.prizes || [{ name: "", description: "" }])
  const [badges, setBadges] = useState(challenge?.badges || [{ name: "", image: "" }])
  const [isActive, setIsActive] = useState(challenge?.isActive !== undefined ? challenge.isActive : true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Add prize
  const addPrize = () => {
    setPrizes([...prizes, { name: "", description: "" }])
  }

  // Remove prize
  const removePrize = (index: number) => {
    setPrizes(prizes.filter((_, i) => i !== index))
  }

  // Update prize
  const updatePrize = (index: number, field: string, value: string) => {
    const updatedPrizes = [...prizes]
    updatedPrizes[index] = { ...updatedPrizes[index], [field]: value }
    setPrizes(updatedPrizes)
  }

  // Add badge
  const addBadge = () => {
    setBadges([...badges, { name: "", image: "" }])
  }

  // Remove badge
  const removeBadge = (index: number) => {
    setBadges(badges.filter((_, i) => i !== index))
  }

  // Update badge
  const updateBadge = (index: number, field: string, value: string) => {
    const updatedBadges = [...badges]
    updatedBadges[index] = { ...updatedBadges[index], [field]: value }
    setBadges(updatedBadges)
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const newErrors: { [key: string]: string } = {}
    if (!title.trim()) newErrors.title = "Title is required"
    if (!description.trim()) newErrors.description = "Description is required"
    if (!startDate) newErrors.startDate = "Start date is required"
    if (!endDate) newErrors.endDate = "End date is required"
    if (!requirements.trim()) newErrors.requirements = "Requirements are required"

    // Validate dates
    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      if (end <= start) {
        newErrors.endDate = "End date must be after start date"
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)

    try {
      // Filter out empty prizes and badges
      const filteredPrizes = prizes.filter((prize) => prize.name.trim())
      const filteredBadges = badges.filter((badge) => badge.name.trim())

      const challengeData = {
        title,
        description,
        startDate,
        endDate,
        requirements,
        requiredSessions,
        prizes: filteredPrizes,
        badges: filteredBadges,
        isActive,
      }

      await onSubmit(challengeData)
    } catch (error) {
      console.error("Error saving challenge:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">{isEditing ? "Edit Challenge" : "Create Challenge"}</h2>
          {onClose && (
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
              <X size={24} />
            </button>
          )}
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
                placeholder="Enter challenge title"
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
                placeholder="Enter challenge description..."
                className={`w-full px-3 py-2 rounded-lg border ${
                  errors.description ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-[#4a3630] bg-[#FBEAA0] min-h-[100px]`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
              {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar size={16} className="text-gray-500" />
                  </div>
                  <input
                    type="date"
                    id="startDate"
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                      errors.startDate ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-[#4a3630] bg-[#FBEAA0]`}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                {errors.startDate && <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>}
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar size={16} className="text-gray-500" />
                  </div>
                  <input
                    type="date"
                    id="endDate"
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                      errors.endDate ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-[#4a3630] bg-[#FBEAA0]`}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
                {errors.endDate && <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">
                Requirements
              </label>
              <textarea
                id="requirements"
                placeholder="Enter challenge requirements..."
                className={`w-full px-3 py-2 rounded-lg border ${
                  errors.requirements ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-[#4a3630] bg-[#FBEAA0] min-h-[80px]`}
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
              ></textarea>
              {errors.requirements && <p className="mt-1 text-sm text-red-500">{errors.requirements}</p>}
            </div>

            <div>
              <label htmlFor="requiredSessions" className="block text-sm font-medium text-gray-700 mb-1">
                Required Sessions
              </label>
              <input
                type="number"
                id="requiredSessions"
                min="1"
                max="10"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4a3630] bg-[#FBEAA0]"
                value={requiredSessions}
                onChange={(e) => setRequiredSessions(Number.parseInt(e.target.value))}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Prizes</label>
                <Button type="button" variant="outline" size="sm" onClick={addPrize} leftIcon={<Plus size={14} />}>
                  Add Prize
                </Button>
              </div>

              {prizes.map((prize, index) => (
                <div key={index} className="flex items-start gap-2 mb-2">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                    <Input
                      type="text"
                      placeholder="Prize name"
                      value={prize.name}
                      onChange={(e) => updatePrize(index, "name", e.target.value)}
                    />
                    <Input
                      type="text"
                      placeholder="Prize description"
                      value={prize.description}
                      onChange={(e) => updatePrize(index, "description", e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removePrize(index)}
                    className="p-2 text-gray-500 hover:text-red-600 rounded-md hover:bg-gray-100"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Badges</label>
                <Button type="button" variant="outline" size="sm" onClick={addBadge} leftIcon={<Plus size={14} />}>
                  Add Badge
                </Button>
              </div>

              {badges.map((badge, index) => (
                <div key={index} className="flex items-start gap-2 mb-2">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                    <Input
                      type="text"
                      placeholder="Badge name"
                      value={badge.name}
                      onChange={(e) => updateBadge(index, "name", e.target.value)}
                    />
                    <Input
                      type="text"
                      placeholder="Badge image URL"
                      value={badge.image}
                      onChange={(e) => updateBadge(index, "image", e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeBadge(index)}
                    className="p-2 text-gray-500 hover:text-red-600 rounded-md hover:bg-gray-100"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 text-[#4a3630] focus:ring-[#4a3630] border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="text-sm text-gray-700">
                Challenge is active
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            {onClose && (
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            )}
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : isEditing ? "Update Challenge" : "Create Challenge"}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  )
}
