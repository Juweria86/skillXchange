"use client"

import { Calendar, Plus, Clock, Users, Video, MapPin } from "lucide-react"
import { useEffect } from "react"
import { toast } from "react-toastify"
import AppSidebar from "../components/AppSidebar"
import PageHeader from "../components/layout/PageHeader"
import Avatar from "@/components/ui/Avatar"
import SessionForm from "../components/sessions/SessionForm"
import SessionCalendar from "../components/sessions/SessionCalendar"
import {
  useGetSessionsQuery,
  useCreateSessionMutation,
  useUpdateSessionMutation,
  useDeleteSessionMutation,
} from "@/features/sessions/sessionApi"
import { setView, setShowForm, setEditingSession, resetSessionForm } from "@/features/sessions/sessionSlice"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/app/store"

// Custom components
const Card = ({ children, className = "", ...props }) => (
  <div className={`bg-white rounded-lg shadow-md border border-gray-100 ${className}`} {...props}>
    {children}
  </div>
)

const CardContent = ({ children, className = "", ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
)

const CardHeader = ({ children, className = "", ...props }) => (
  <div className={`p-6 pb-4 ${className}`} {...props}>
    {children}
  </div>
)

const CardTitle = ({ children, className = "", ...props }) => (
  <h3 className={`text-lg font-semibold text-[#0C4B93] ${className}`} {...props}>
    {children}
  </h3>
)

const CardDescription = ({ children, className = "", ...props }) => (
  <p className={`text-sm text-gray-600 ${className}`} {...props}>
    {children}
  </p>
)

const Button = ({ children, className = "", variant = "default", size = "default", ...props }) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#0C4B93] focus:ring-offset-2"
  const variantClasses =
    variant === "outline"
      ? "border border-gray-300 text-gray-700 hover:bg-gray-100"
      : "bg-[#0C4B93] text-white hover:bg-[#064283]"
  const sizeClasses = size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2"

  return (
    <button className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`} {...props}>
      {children}
    </button>
  )
}

const Badge = ({ children, className = "", variant = "default", ...props }) => {
  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
  const variantClasses = variant === "outline" ? "border border-gray-300 text-gray-700" : "bg-[#E5EFF9] text-[#0C4B93]"

  return (
    <span className={`${baseClasses} ${variantClasses} ${className}`} {...props}>
      {children}
    </span>
  )
}

export default function MySessionsPage() {
  const dispatch = useDispatch()
  const { view, showForm, editingSession } = useSelector((state: RootState) => state.sessions)
  const { data: sessions = [], isLoading, isError, error: fetchError } = useGetSessionsQuery()
  const [createSession] = useCreateSessionMutation()
  const [updateSession] = useUpdateSessionMutation()
  const [deleteSession] = useDeleteSessionMutation()

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load sessions", {
        position: "top-right",
        autoClose: 5000,
      })
      console.error("Fetch sessions error:", fetchError)
    }
  }, [isError, fetchError])

  const handleSubmit = async (data: any) => {
    const toastId = toast.loading(editingSession ? "Updating session..." : "Creating session...")

    try {
      if (editingSession) {
        await updateSession({
          id: editingSession.id!,
          ...data,
        }).unwrap()
        toast.update(toastId, {
          render: "Session updated successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        })
      } else {
        await createSession(data).unwrap()
        toast.update(toastId, {
          render: "Session created successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        })
      }
      dispatch(resetSessionForm())
    } catch (err) {
      toast.update(toastId, {
        render: "Failed to save session",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      })
      console.error("Failed to save session:", err)
    }
  }

  const handleDelete = async (id: string) => {
    const toastId = toast.loading("Deleting session...")
    try {
      await deleteSession(id).unwrap()
      toast.update(toastId, {
        render: "Session deleted successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      })
    } catch (err) {
      toast.update(toastId, {
        render: "Failed to delete session",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      })
      console.error("Failed to delete session:", err)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#E5EFF9] to-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0C4B93] mx-auto"></div>
          <p className="mt-4 text-[#0C4B93] font-medium">Loading your sessions...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#E5EFF9] to-background flex items-center justify-center">
        <Card className="max-w-md border-none shadow-lg">
          <CardContent className="p-6 text-center">
            <h3 className="font-medium text-red-600 mb-2">Error loading sessions</h3>
            <p className="text-sm text-gray-600 mb-4">Please try again later</p>
            <Button onClick={() => window.location.reload()} className="bg-[#0C4B93] hover:bg-[#064283]">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const upcomingSessions = sessions.filter((session: any) => new Date(session.date) >= new Date())
  const pastSessions = sessions.filter((session: any) => new Date(session.date) < new Date())

return (
  <div className="min-h-screen flex bg-gradient-to-b from-[#E5EFF9] to-background">
    {/* Sidebar */}
    <AppSidebar />

    {/* Main Content */}
    <div className="flex-1 flex flex-col">
      <PageHeader title="My Sessions" backTo="/home-dashboard">
        <div className="flex items-center gap-3">
          <div className="bg-white rounded-lg p-1 shadow-sm border border-gray-200">
            <div className="flex">
              <button
                className={`px-3 py-2 rounded-lg transition-colors ${
                  view === "calendar" ? "bg-[#0C4B93] text-white" : "text-gray-700 hover:bg-[#E5EFF9]"
                }`}
                onClick={() => dispatch(setView("calendar"))}
              >
                <Calendar size={16} />
              </button>
              <button
                className={`px-3 py-2 rounded-lg transition-colors ${
                  view === "list" ? "bg-[#0C4B93] text-white" : "text-gray-700 hover:bg-[#E5EFF9]"
                }`}
                onClick={() => dispatch(setView("list"))}
              >
                <Users size={16} />
              </button>
            </div>
          </div>
          <Button
            className="bg-[#0C4B93] hover:bg-[#064283]"
            onClick={() => {
              dispatch(setEditingSession(null))
              dispatch(setShowForm(true))
            }}
          >
            <Plus size={16} className="mr-2" />
            New Session
          </Button>
        </div>
      </PageHeader>

      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-none shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#D7E9F7] rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-[#0C4B93]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#0C4B93]">{upcomingSessions.length}</h3>
                    <p className="text-gray-600">Upcoming Sessions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#E5EFF9] rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-[#0C4B93]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#0C4B93]">{pastSessions.length}</h3>
                    <p className="text-gray-600">Completed Sessions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#D7E9F7] rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-[#0C4B93]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#0C4B93]">{sessions.length}</h3>
                    <p className="text-gray-600">Total Sessions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form */}
          {showForm && (
            <SessionForm
              initialData={editingSession}
              onCancel={() => dispatch(resetSessionForm())}
              onSubmit={handleSubmit}
            />
          )}

          {/* Calendar View */}
          {view === "calendar" && (
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="text-[#0C4B93]">Session Calendar</CardTitle>
                <CardDescription>View and manage your sessions in calendar format</CardDescription>
              </CardHeader>
              <CardContent>
                <SessionCalendar sessions={sessions} />
              </CardContent>
            </Card>
          )}

          {/* List View - You can add your list view component here */}
        </div>
      </main>
    </div>
  </div>
)

}
