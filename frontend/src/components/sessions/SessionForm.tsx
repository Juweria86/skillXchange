// components/sessions/SessionForm.tsx
"use client"

import { useState } from "react"
import { X } from "lucide-react"
import {Card} from "../ui/Card"
import Button from "../ui/Button"

interface SessionFormData {
  id?: string;
  title: string;
  date: Date;
  time: string; // Format: "HH:MM AM/PM - HH:MM AM/PM" or "HH:MM"
  skill: string;
  type: "learning" | "teaching";
}

interface SessionFormProps {
  initialData?: SessionFormData;
  onCancel: () => void;
  onSubmit: (data: SessionFormData) => void;
}

export default function SessionForm({
  initialData,
  onCancel,
  onSubmit,
}: SessionFormProps) {
  const [formData, setFormData] = useState<SessionFormData>(
    initialData || {
      title: "",
      date: new Date(),
      time: "",
      skill: "",
      type: "learning",
    }
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value)
    if (!isNaN(date.getTime())) {
      setFormData(prev => ({
        ...prev,
        date,
      }))
    }
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value
    // Convert 24h format to 12h format if needed
    setFormData(prev => ({
      ...prev,
      time,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Combine date and time into a single string if needed
    const timeString = formData.time.includes('-') 
      ? formData.time 
      : `${formData.time} - ${formData.time}` // Simple fallback
    
    onSubmit({
      ...formData,
      time: timeString
    })
  }

  // Format date for input[type="date"]
  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <div className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {initialData ? "Edit" : "Add New"} Session
            </h3>
            <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Session Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FBEAA0]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={formatDateForInput(formData.date)}
                    onChange={handleDateChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FBEAA0]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time.split(' - ')[0]} // Just show start time
                    onChange={handleTimeChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FBEAA0]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skill</label>
                <input
                  type="text"
                  name="skill"
                  value={formData.skill}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FBEAA0]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Session Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FBEAA0]"
                  required
                >
                  <option value="learning">Learning</option>
                  <option value="teaching">Teaching</option>
                </select>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                >
                  {initialData ? "Update" : "Create"} Session
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}