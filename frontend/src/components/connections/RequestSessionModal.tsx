"use client"

import type React from "react"

import { useState } from "react"
import { X, Calendar, Clock, Info } from "lucide-react"
import Button from "../ui/Button"
import Input from "../ui/Input"
import Textarea from "../ui/Textarea"
import Select from "../ui/Select"

interface RequestSessionModalProps {
  connection: {
    id: string
    name: string
    avatar: string
    skills: string[]
  }
  isOpen: boolean
  onClose: () => void
  onSubmit: (sessionDetails: any) => void
}

export default function RequestSessionModal({ connection, isOpen, onClose, onSubmit }: RequestSessionModalProps) {
  const [sessionDetails, setSessionDetails] = useState({
    date: "",
    time: "",
    duration: "60",
    topic: "",
    message: "",
    skillToLearn: connection.skills[0] || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setSessionDetails((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(sessionDetails)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-[#4a3630]">Request Session</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 focus:outline-none">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-6">
            <p className="text-gray-700 mb-2">
              Request a learning session with <span className="font-medium">{connection.name}</span>
            </p>
            <div className="bg-[#FFF7D4] p-3 rounded-md flex items-start gap-2">
              <Info size={18} className="text-[#4a3630] mt-0.5 flex-shrink-0" />
              <p className="text-sm text-[#4a3630]">
                This will send a request to {connection.name}. They'll need to accept before the session is scheduled.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="skillToLearn" className="block text-sm font-medium text-gray-700 mb-1">
                Skill you want to learn
              </label>
              <Select
                id="skillToLearn"
                name="skillToLearn"
                value={sessionDetails.skillToLearn}
                onChange={handleChange}
                required
                className="w-full"
              >
                {connection.skills.map((skill) => (
                  <option key={skill} value={skill}>
                    {skill}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
                Session Topic
              </label>
              <Input
                id="topic"
                name="topic"
                type="text"
                placeholder="e.g., Introduction to JavaScript"
                value={sessionDetails.topic}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={sessionDetails.date}
                    onChange={handleChange}
                    required
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <div className="relative">
                  <Clock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    id="time"
                    name="time"
                    type="time"
                    value={sessionDetails.time}
                    onChange={handleChange}
                    required
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                Duration
              </label>
              <Select id="duration" name="duration" value={sessionDetails.duration} onChange={handleChange} required>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
              </Select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message (optional)
              </label>
              <Textarea
                id="message"
                name="message"
                placeholder="Let them know what you'd like to learn or discuss"
                value={sessionDetails.message}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button type="submit" variant="primary" fullWidth>
              Send Request
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
