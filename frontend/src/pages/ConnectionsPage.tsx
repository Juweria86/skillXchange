"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useMessages } from "../context/MessageContext"
import AppSidebar from "../components/AppSidebar"
import ConnectionCard from "../components/connections/ConnectionCard"
import RequestSessionModal from "../components/connections/RequestSessionModal"
import { Bell, Users, Clock, Search, Filter, AlertCircle, Loader2, ChevronLeft } from "lucide-react"
import axios from "axios"

const API_URL = "http://localhost:5000/api"

// Custom components
const Card = ({ children, className = "", ...props }) => (
  <div className={`bg-white rounded-lg shadow-md border border-gray-100 ${className}`} {...props}>
    {children}
  </div>
)

const Button = ({ children, className = "", variant = "default", size = "default", ...props }) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#0C4B93] focus:ring-offset-2"
  const variantClasses =
    variant === "outline"
      ? "border border-[#0C4B93] text-[#0C4B93] hover:bg-[#E5EFF9]"
      : "bg-[#0C4B93] text-white hover:bg-[#064283]"
  const sizeClasses = size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2"

  return (
    <button className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`} {...props}>
      {children}
    </button>
  )
}

const Input = ({ className = "", ...props }) => (
  <input
    className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C4B93] focus:border-[#0C4B93] ${className}`}
    {...props}
  />
)

const Badge = ({ children, className = "", ...props }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#0C4B93] text-white ${className}`}
    {...props}
  >
    {children}
  </span>
)

// Types for our connections
interface ConnectionUser {
  _id: string
  name: string
  profileImage?: string
  email?: string
}

interface Connection {
  _id: string
  user: ConnectionUser
  createdAt: string
  message?: string
}

interface ConnectionsData {
  accepted: Connection[]
  pending: {
    sent: Connection[]
    received: Connection[]
  }
}

export default function ConnectionsPage() {
  const navigate = useNavigate()
  const { setCurrentChat } = useMessages()
  const [activeTab, setActiveTab] = useState("connections")
  const [searchQuery, setSearchQuery] = useState("")
  const [connections, setConnections] = useState<Connection[]>([])
  const [pendingRequests, setPendingRequests] = useState<Connection[]>([])
  const [sentRequests, setSentRequests] = useState<Connection[]>([])
  const [isRequestSessionModalOpen, setIsRequestSessionModalOpen] = useState(false)
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const token = localStorage.getItem("token")

  // Fetch connections from the backend
  useEffect(() => {
    const fetchConnections = async () => {
      if (!token) {
        navigate("/login")
        return
      }

      setLoading(true)
      setError(null)

      try {
        const response = await axios.get(`${API_URL}/connections`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data: ConnectionsData = response.data

        setConnections(data.accepted || [])
        setPendingRequests(data.pending.received || [])
        setSentRequests(data.pending.sent || [])
      } catch (err: any) {
        console.error("Error fetching connections:", err)
        setError(err.response?.data?.message || "Failed to load connections")
      } finally {
        setLoading(false)
      }
    }

    fetchConnections()
  }, [token, navigate])

  // Filter connections based on search query
  const filteredConnections = connections.filter((connection) =>
    connection.user.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredPendingRequests = pendingRequests.filter((request) =>
    request.user.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredSentRequests = sentRequests.filter((request) =>
    request.user.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Handle accepting a connection request
  const handleAcceptRequest = async (requestId: string) => {
    if (!token) return

    try {
      await axios.post(
        `${API_URL}/connections/accept/${requestId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      // Find the request
      const request = pendingRequests.find((req) => req._id === requestId)
      if (!request) return

      // Move from pending to connections
      setConnections((prev) => [...prev, request])

      // Remove from pending
      setPendingRequests((prev) => prev.filter((req) => req._id !== requestId))
    } catch (err: any) {
      console.error("Error accepting request:", err)
      alert(err.response?.data?.message || "Failed to accept request")
    }
  }

  // Handle declining a connection request
  const handleDeclineRequest = async (requestId: string) => {
    if (!token) return

    try {
      await axios.post(
        `${API_URL}/connections/decline/${requestId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      // Remove from pending
      setPendingRequests((prev) => prev.filter((req) => req._id !== requestId))
    } catch (err: any) {
      console.error("Error declining request:", err)
      alert(err.response?.data?.message || "Failed to decline request")
    }
  }

  // Handle canceling a sent request
  const handleCancelRequest = async (requestId: string) => {
    if (!token) return

    try {
      await axios.delete(`${API_URL}/connections/${requestId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      // Remove from sent requests
      setSentRequests((prev) => prev.filter((req) => req._id !== requestId))
    } catch (err: any) {
      console.error("Error canceling request:", err)
      alert(err.response?.data?.message || "Failed to cancel request")
    }
  }

  // Handle messaging a connection
  const handleMessage = async (connection: Connection) => {
    try {
      // Set the current chat to this connection's user
      setCurrentChat({
        id: connection.user._id,
        user: {
          _id: connection.user._id,
          name: connection.user.name,
          avatar: connection.user.profileImage,
          online: false, // We don't know the online status yet
        },
        lastMessage: {
          text: "",
          time: "",
          isRead: true,
          sender: "you",
        },
        unread: 0,
      })

      // Navigate to messages page
      navigate("/messages")
    } catch (err) {
      console.error("Error navigating to messages:", err)
    }
  }

  // Handle requesting a session
  const handleRequestSession = (connection: Connection) => {
    setSelectedConnection(connection)
    setIsRequestSessionModalOpen(true)
  }

  // Handle submitting a session request
  const handleSubmitSessionRequest = async (sessionDetails: any) => {
    if (!selectedConnection || !token) return

    try {
      console.log("Session requested:", { connection: selectedConnection, details: sessionDetails })

      // Close the modal
      setIsRequestSessionModalOpen(false)
      setSelectedConnection(null)

      // Show success message
      alert("Session request sent successfully!")
    } catch (err: any) {
      console.error("Error requesting session:", err)
      alert(err.response?.data?.message || "Failed to request session")
    }
  }

  // Show loading state
  if (loading && connections.length === 0 && pendingRequests.length === 0 && sentRequests.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#E5EFF9] to-background flex">
        <AppSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-[#0C4B93] mx-auto" />
            <p className="mt-4 text-[#0C4B93] font-medium">Loading connections...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#E5EFF9] to-background flex">
        <AppSidebar />
        <div className="flex-1 flex items-center justify-center">
          <Card className="max-w-md p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading connections</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E5EFF9] to-background">
      <div className="flex">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-h-screen">
          {/* Header */}
          <header className="bg-white shadow-sm p-4 border-b border-gray-100">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigate("/home-dashboard")}
                    className="inline-flex items-center text-[#0C4B93] hover:text-[#064283] font-medium lg:hidden"
                  >
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    Back
                  </button>
                  <h1 className="text-2xl font-bold text-[#0C4B93]">My Connections</h1>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      type="text"
                      placeholder="Search connections..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full sm:w-64"
                    />
                  </div>
                  <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-1">
                    <Filter size={16} />
                    Filter
                  </Button>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <div className="max-w-7xl mx-auto">
              {/* Tabs */}
              <Card className="mb-6 p-2">
                <div className="grid grid-cols-3 gap-2">
                  <button
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                      activeTab === "connections"
                        ? "bg-[#0C4B93] text-white"
                        : "text-gray-600 hover:bg-[#E5EFF9] hover:text-[#0C4B93]"
                    }`}
                    onClick={() => setActiveTab("connections")}
                  >
                    <Users size={18} />
                    <span className="hidden sm:inline">Connections</span>
                    <Badge className="bg-white text-[#0C4B93]">{connections.length}</Badge>
                  </button>

                  <button
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                      activeTab === "requests"
                        ? "bg-[#0C4B93] text-white"
                        : "text-gray-600 hover:bg-[#E5EFF9] hover:text-[#0C4B93]"
                    }`}
                    onClick={() => setActiveTab("requests")}
                  >
                    <Bell size={18} />
                    <span className="hidden sm:inline">Requests</span>
                    <Badge className="bg-white text-[#0C4B93]">{pendingRequests.length}</Badge>
                  </button>

                  <button
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                      activeTab === "sent"
                        ? "bg-[#0C4B93] text-white"
                        : "text-gray-600 hover:bg-[#E5EFF9] hover:text-[#0C4B93]"
                    }`}
                    onClick={() => setActiveTab("sent")}
                  >
                    <Clock size={18} />
                    <span className="hidden sm:inline">Sent</span>
                    <Badge className="bg-white text-[#0C4B93]">{sentRequests.length}</Badge>
                  </button>
                </div>
              </Card>

              {/* Tab Content */}
              {activeTab === "connections" && (
                <div className="space-y-6">
                  {filteredConnections.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredConnections.map((connection) => (
                        <ConnectionCard
                          key={connection._id}
                          connection={{
                            id: connection._id,
                            name: connection.user.name,
                            avatar: connection.user.profileImage || "/placeholder.svg?height=80&width=80",
                            skills: [], // You'll need to add skills to your connection model
                            learning: [], // You'll need to add learning to your connection model
                            lastActive: "Recently", // You'll need to track this
                            status: "connected",
                          }}
                          onRequestSession={() => handleRequestSession(connection)}
                          onMessage={() => handleMessage(connection)}
                        />
                      ))}
                    </div>
                  ) : (
                    <Card className="p-12 text-center">
                      <Users size={48} className="mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-[#0C4B93] mb-2">No connections found</h3>
                      <p className="text-gray-500 mb-6">
                        {searchQuery
                          ? "No connections match your search criteria."
                          : "You don't have any connections yet."}
                      </p>
                      {!searchQuery && (
                        <Button onClick={() => navigate("/skill-matches")}>Find People to Connect</Button>
                      )}
                    </Card>
                  )}
                </div>
              )}

              {activeTab === "requests" && (
                <div className="space-y-6">
                  {filteredPendingRequests.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredPendingRequests.map((request) => (
                        <ConnectionCard
                          key={request._id}
                          connection={{
                            id: request._id,
                            name: request.user.name,
                            avatar: request.user.profileImage || "/placeholder.svg?height=80&width=80",
                            skills: [], // You'll need to add skills to your connection model
                            learning: [], // You'll need to add learning to your connection model
                            requestDate: new Date(request.createdAt).toLocaleDateString(),
                            message: request.message,
                            status: "pending",
                            direction: "incoming",
                          }}
                          isPending={true}
                          onAccept={() => handleAcceptRequest(request._id)}
                          onDecline={() => handleDeclineRequest(request._id)}
                        />
                      ))}
                    </div>
                  ) : (
                    <Card className="p-12 text-center">
                      <Bell size={48} className="mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-[#0C4B93] mb-2">No pending requests</h3>
                      <p className="text-gray-500 mb-6">
                        {searchQuery
                          ? "No requests match your search criteria."
                          : "You don't have any pending connection requests."}
                      </p>
                    </Card>
                  )}
                </div>
              )}

              {activeTab === "sent" && (
                <div className="space-y-6">
                  {filteredSentRequests.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredSentRequests.map((request) => (
                        <ConnectionCard
                          key={request._id}
                          connection={{
                            id: request._id,
                            name: request.user.name,
                            avatar: request.user.profileImage || "/placeholder.svg?height=80&width=80",
                            skills: [], // You'll need to add skills to your connection model
                            learning: [], // You'll need to add learning to your connection model
                            requestDate: new Date(request.createdAt).toLocaleDateString(),
                            status: "pending",
                            direction: "outgoing",
                          }}
                          isSent={true}
                          onCancel={() => handleCancelRequest(request._id)}
                        />
                      ))}
                    </div>
                  ) : (
                    <Card className="p-12 text-center">
                      <Clock size={48} className="mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-[#0C4B93] mb-2">No sent requests</h3>
                      <p className="text-gray-500 mb-6">
                        {searchQuery
                          ? "No sent requests match your search criteria."
                          : "You haven't sent any connection requests yet."}
                      </p>
                      {!searchQuery && (
                        <Button onClick={() => navigate("/skill-matches")}>Find People to Connect</Button>
                      )}
                    </Card>
                  )}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Request Session Modal */}
      {isRequestSessionModalOpen && selectedConnection && (
        <RequestSessionModal
          connection={{
            id: selectedConnection.user._id,
            name: selectedConnection.user.name,
            avatar: selectedConnection.user.profileImage || "/placeholder.svg?height=80&width=80",
            skills: [], // You'll need to add skills to your connection model
          }}
          isOpen={isRequestSessionModalOpen}
          onClose={() => {
            setIsRequestSessionModalOpen(false)
            setSelectedConnection(null)
          }}
          onSubmit={handleSubmitSessionRequest}
        />
      )}
    </div>
  )
}
