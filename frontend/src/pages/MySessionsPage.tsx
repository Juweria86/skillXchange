"use client"

import { Calendar, Plus } from "lucide-react"
import { useEffect } from "react"
import { toast } from 'react-toastify'
import AppSidebar from "../components/AppSidebar"
import PageHeader from "../components/layout/PageHeader"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import SessionForm from '../components/sessions/SessionForm'
import SessionCalendar from '../components/sessions/SessionCalendar'
import SessionCard from "@/components/sessions/SessionCard"
import { 
  useGetSessionsQuery, 
  useCreateSessionMutation, 
  useUpdateSessionMutation, 
  useDeleteSessionMutation 
} from "@/features/sessions/sessionApi"
import { 
  setView, 
  setShowForm, 
  setEditingSession, 
  resetSessionForm 
} from "@/features/sessions/sessionSlice"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "@/app/store"

export default function MySessionsPage() {
  const dispatch = useDispatch();
  const { view, showForm, editingSession } = useSelector((state: RootState) => state.sessions);
  const { 
    data: sessions = [], 
    isLoading, 
    isError,
    error: fetchError 
  } = useGetSessionsQuery();
  const [createSession] = useCreateSessionMutation();
  const [updateSession] = useUpdateSessionMutation();
  const [deleteSession] = useDeleteSessionMutation();

  useEffect(() => {
    if (isError) {
      toast.error('Failed to load sessions', {
        position: "top-right",
        autoClose: 5000,
      });
      console.error('Fetch sessions error:', fetchError);
    }
  }, [isError, fetchError]);

  const handleSubmit = async (data: SessionFormValues) => {
    const toastId = toast.loading(editingSession ? "Updating session..." : "Creating session...");
    
    try {
      if (editingSession) {
        await updateSession({ 
          id: editingSession.id!, 
          ...data 
        }).unwrap();
        toast.update(toastId, {
          render: "Session updated successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      } else {
        await createSession(data).unwrap();
        toast.update(toastId, {
          render: "Session created successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      }
      dispatch(resetSessionForm());
    } catch (err) {
      toast.update(toastId, {
        render: "Failed to save session",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
      console.error('Failed to save session:', err);
    }
  };

  const handleDelete = async (id: string) => {
    const toastId = toast.loading("Deleting session...");
    try {
      await deleteSession(id).unwrap();
      toast.update(toastId, {
        render: "Session deleted successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err) {
      toast.update(toastId, {
        render: "Failed to delete session",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
      console.error('Failed to delete session:', err);
    }
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4a3630]"></div>
    </div>
  );

  if (isError) return (
    <div className="p-4 bg-red-50 text-red-700 rounded-lg">
      <h3 className="font-medium">Error loading sessions</h3>
      <p className="text-sm mt-1">Please try again later</p>
      <button 
        onClick={() => window.location.reload()}
        className="mt-2 px-4 py-2 bg-red-100 rounded hover:bg-red-200"
      >
        Retry
      </button>
    </div>
  );

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
                  onClick={() => dispatch(setView("calendar"))}
                >
                  <Calendar size={16} />
                </button>
                <button
                  className={`px-3 py-1 rounded-lg ${
                    view === "list" ? "bg-[#FBEAA0] text-[#4a3630]" : "text-gray-700"
                  }`}
                  onClick={() => dispatch(setView("list"))}
                >
                  {/* List icon SVG */}
                </button>
              </div>
            </div>
            <Button 
              variant="primary" 
              leftIcon={<Plus size={16} />}
              onClick={() => {
                dispatch(setEditingSession(null));
                dispatch(setShowForm(true));
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
                onCancel={() => dispatch(resetSessionForm())}
                onSubmit={handleSubmit}
              />
            )}

            {view === "calendar" ? (
              <SessionCalendar 
                sessions={sessions} 
                onEdit={(session) => {
                  dispatch(setEditingSession(session));
                  dispatch(setShowForm(true));
                }}
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
                    onEdit={() => {
                      dispatch(setEditingSession(session));
                      dispatch(setShowForm(true));
                    }}
                    onDelete={() => handleDelete(session.id)}
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