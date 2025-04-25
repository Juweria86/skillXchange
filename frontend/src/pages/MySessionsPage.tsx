"use client"

import { Calendar, ChevronLeft, ChevronRight, Clock, Plus, X, Edit } from "lucide-react"
import { useState } from "react"
import AppSidebar from "../components/AppSidebar"
import PageHeader from "../components/layout/PageHeader"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import Badge from "../components/ui/Badge"
import SessionForm from '../components/sessions/SessionForm'
import SessionCalendar from '../components/sessions/SessionCalendar'
import SessionCard from "@/components/sessions/SessionCard"


export default function MySessionsPage() {
  const [view, setView] = useState<"calendar" | "list">("calendar")
  const [showForm, setShowForm] = useState(false)
  const [editingSession, setEditingSession] = useState<any>(null)
  const [sessions, setSessions] = useState([
    {
      id: 1,
      title: "Python Basics with Sarah",
      date: new Date(new Date().setDate(15)),
      time: "10:00 AM - 11:30 AM",
      skill: "Python",
      type: "learning",
    },
    {
      id: 2,
      title: "Teaching Web Design to James",
      date: new Date(new Date().setDate(18)),
      time: "2:00 PM - 3:30 PM",
      skill: "Web Design",
      type: "teaching",
    },
    {
      id: 3,
      title: "Spanish Conversation Practice",
      date: new Date(new Date().setDate(20)),
      time: "6:00 PM - 7:00 PM",
      skill: "Spanish",
      type: "learning",
    },
  ])

  const handleSubmit = (data: any) => {
    if (editingSession) {
      setSessions(sessions.map(session => 
        session.id === editingSession.id ? { ...data, id: editingSession.id } : session
      ))
    } else {
      setSessions([...sessions, {
        ...data,
        id: Math.max(0, ...sessions.map(s => s.id)) + 1
      }])
    }
    setShowForm(false)
    setEditingSession(null)
  }

  const handleEdit = (session: any) => {
    setEditingSession(session)
    setShowForm(true)
  }

  const handleDelete = (id: number) => {
    setSessions(sessions.filter(session => session.id !== id))
  }

  return (
    <div className="flex min-h-screen bg-[#FFF7D4]">
      <AppSidebar />

      <div className="flex-1 flex flex-col">
        <PageHeader title="My Sessions" backTo="/home-dashboard">
          <div className="flex items-center gap-2">
            <div className="bg-white rounded-lg p-1 shadow-sm">
              <div className="flex">
                <button
                  className={`px-3 py-1 rounded-lg ${
                    view === "calendar" ? "bg-[#FBEAA0] text-[#4a3630]" : "text-gray-700"
                  }`}
                  onClick={() => setView("calendar")}
                >
                  <Calendar size={16} />
                </button>
                <button
                  className={`px-3 py-1 rounded-lg ${
                    view === "list" ? "bg-[#FBEAA0] text-[#4a3630]" : "text-gray-700"
                  }`}
                  onClick={() => setView("list")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="8" y1="6" x2="21" y2="6"></line>
                    <line x1="8" y1="12" x2="21" y2="12"></line>
                    <line x1="8" y1="18" x2="21" y2="18"></line>
                    <line x1="3" y1="6" x2="3.01" y2="6"></line>
                    <line x1="3" y1="12" x2="3.01" y2="12"></line>
                    <line x1="3" y1="18" x2="3.01" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>
            <Button 
              variant="primary" 
              leftIcon={<Plus size={16} />}
              onClick={() => {
                setEditingSession(null)
                setShowForm(true)
              }}
            >
              New Session
            </Button>
          </div>
        </PageHeader>

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
            {showForm && (
              <SessionForm
                initialData={editingSession}
                onCancel={() => {
                  setShowForm(false)
                  setEditingSession(null)
                }}
                onSubmit={handleSubmit}
              />
            )}

            {view === "calendar" ? (
              <SessionCalendar 
                sessions={sessions} 
                onEdit={handleEdit}
              />
            ) : (
              <Card>
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium">Upcoming Sessions</h2>
                </div>
                {sessions.map((session) => (
                  <SessionCard 
                  key={session.id}
                  title={session.title}
                  date={{
                    month: session.date.toLocaleString('default', { month: 'short' }).toUpperCase(),
                    day: session.date.getDate(),
                  }}
                  time={session.time}
                  skillName={session.skill}
                  sessionType={session.type}
                  />

                ))}
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}