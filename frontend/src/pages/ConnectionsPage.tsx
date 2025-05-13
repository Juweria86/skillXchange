"use client"

import { useState } from "react"
import { useSidebar } from "../context/SidebarContext"
import AppSidebar from "../components/AppSidebar"
import ConnectionCard from "../components/connections/ConnectionCard"
import RequestSessionModal from "../components/connections/RequestSessionModal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/Tabs"
import { Bell, Users, Clock, Search, Filter } from "lucide-react"
import Button from "../components/ui/Button"
import Input from "../components/ui/Input"

// Mock data - replace with actual API calls
const MOCK_CONNECTIONS = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=80&width=80",
    skills: ["Digital Art", "UI Design"],
    learning: ["Python", "Data Science"],
    lastActive: "2 hours ago",
    status: "connected",
  },
  {
    id: "2",
    name: "Michael Chen",
    avatar: "/placeholder.svg?height=80&width=80",
    skills: ["JavaScript", "React"],
    learning: ["Public Speaking", "Leadership"],
    lastActive: "1 day ago",
    status: "connected",
  },
  {
    id: "3",
    name: "Priya Patel",
    avatar: "/placeholder.svg?height=80&width=80",
    skills: ["Content Writing", "SEO"],
    learning: ["Video Editing", "Photography"],
    lastActive: "Just now",
    status: "connected",
  },
]

const MOCK_PENDING_REQUESTS = [
  {
    id: "4",
    name: "David Wilson",
    avatar: "/placeholder.svg?height=80&width=80",
    skills: ["Photography", "Videography"],
    learning: ["Spanish", "French"],
    requestDate: "2 days ago",
    message: "I'd love to learn from your photography skills!",
    status: "pending",
    direction: "incoming",
  },
  {
    id: "5",
    name: "Emma Rodriguez",
    avatar: "/placeholder.svg?height=80&width=80",
    skills: ["Spanish", "Portuguese"],
    learning: ["Web Development", "UX Design"],
    requestDate: "5 days ago",
    message: "I can help you with Spanish while learning web dev!",
    status: "pending",
    direction: "incoming",
  },
]

const MOCK_SENT_REQUESTS = [
  {
    id: "6",
    name: "James Lee",
    avatar: "/placeholder.svg?height=80&width=80",
    skills: ["Machine Learning", "Data Science"],
    learning: ["Guitar", "Music Theory"],
    requestDate: "1 day ago",
    message: "I'd like to learn guitar from you!",
    status: "pending",
    direction: "outgoing",
  },
]

export default function ConnectionsPage() {
  const { sidebarOpen } = useSidebar()
  const [activeTab, setActiveTab] = useState("connections")
  const [searchQuery, setSearchQuery] = useState("")
  const [connections, setConnections] = useState(MOCK_CONNECTIONS)
  const [pendingRequests, setPendingRequests] = useState(MOCK_PENDING_REQUESTS)
  const [sentRequests, setSentRequests] = useState(MOCK_SENT_REQUESTS)
  const [isRequestSessionModalOpen, setIsRequestSessionModalOpen] = useState(false)
  const [selectedConnection, setSelectedConnection] = useState<any>(null)

  // Filter connections based on search query
  const filteredConnections = connections.filter((connection) =>
    connection.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredPendingRequests = pendingRequests.filter((request) =>
    request.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredSentRequests = sentRequests.filter((request) =>
    request.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Handle accepting a connection request
  const handleAcceptRequest = (requestId: string) => {
    // Find the request
    const request = pendingRequests.find((req) => req.id === requestId)
    if (!request) return

    // Move from pending to connections
    setConnections([...connections, {
      ...request, status: "connected",
      lastActive: ""
    }])

    // Remove from pending
    setPendingRequests(pendingRequests.filter((req) => req.id !== requestId))

    // In a real app, you would make an API call here
  }

  // Handle declining a connection request
  const handleDeclineRequest = (requestId: string) => {
    // Remove from pending
    setPendingRequests(pendingRequests.filter((req) => req.id !== requestId))

    // In a real app, you would make an API call here
  }

  // Handle canceling a sent request
  const handleCancelRequest = (requestId: string) => {
    // Remove from sent requests
    setSentRequests(sentRequests.filter((req) => req.id !== requestId))

    // In a real app, you would make an API call here
  }

  // Handle requesting a session
  const handleRequestSession = (connection: any) => {
    setSelectedConnection(connection)
    setIsRequestSessionModalOpen(true)
  }

  // Handle submitting a session request
  const handleSubmitSessionRequest = (sessionDetails: any) => {
    console.log("Session requested:", { connection: selectedConnection, details: sessionDetails })
    // In a real app, you would make an API call here
    setIsRequestSessionModalOpen(false)
    setSelectedConnection(null)
  }

  return (
    <div className="flex h-screen bg-[#FFF7D4]">
      <AppSidebar />

      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : ""}`}
      >
        {/* Header */}
        <header className="bg-white border-b sticky top-0 z-10 px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-[#4a3630]">My Connections</h1>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="text"
                  placeholder="Search connections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full sm:w-64 rounded-lg border border-gray-300 focus:border-[#4a3630] focus:ring-1 focus:ring-[#4a3630]"
                />
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="hidden sm:flex items-center gap-1"
                leftIcon={<Filter size={16} />}
              >
                Filter
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <Tabs defaultValue="connections" onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger
                value="connections"
                className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                  activeTab === "connections"
                    ? "bg-white shadow-sm text-[#4a3630] font-medium"
                    : "text-gray-600 hover:text-[#4a3630]"
                }`}
              >
                <Users size={18} />
                <span>Connections</span>
                <span className="bg-[#4a3630] text-white text-xs rounded-full px-2 py-0.5 ml-1">
                  {connections.length}
                </span>
              </TabsTrigger>

              <TabsTrigger
                value="requests"
                className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                  activeTab === "requests"
                    ? "bg-white shadow-sm text-[#4a3630] font-medium"
                    : "text-gray-600 hover:text-[#4a3630]"
                }`}
              >
                <Bell size={18} />
                <span>Requests</span>
                <span className="bg-[#4a3630] text-white text-xs rounded-full px-2 py-0.5 ml-1">
                  {pendingRequests.length}
                </span>
              </TabsTrigger>

              <TabsTrigger
                value="sent"
                className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                  activeTab === "sent"
                    ? "bg-white shadow-sm text-[#4a3630] font-medium"
                    : "text-gray-600 hover:text-[#4a3630]"
                }`}
              >
                <Clock size={18} />
                <span>Sent</span>
                <span className="bg-[#4a3630] text-white text-xs rounded-full px-2 py-0.5 ml-1">
                  {sentRequests.length}
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="connections" className="space-y-6">
              {filteredConnections.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredConnections.map((connection) => (
                    <ConnectionCard
                      key={connection.id}
                      connection={connection}
                      onRequestSession={() => handleRequestSession(connection)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Users size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No connections found</h3>
                  <p className="text-gray-500 mb-6">
                    {searchQuery ? "No connections match your search criteria." : "You don't have any connections yet."}
                  </p>
                  {!searchQuery && <Button variant="primary">Find People to Connect</Button>}
                </div>
              )}
            </TabsContent>

            <TabsContent value="requests" className="space-y-6">
              {filteredPendingRequests.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPendingRequests.map((request) => (
                    <ConnectionCard
                      key={request.id}
                      connection={request}
                      isPending={true}
                      onAccept={() => handleAcceptRequest(request.id)}
                      onDecline={() => handleDeclineRequest(request.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Bell size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No pending requests</h3>
                  <p className="text-gray-500 mb-6">
                    {searchQuery
                      ? "No requests match your search criteria."
                      : "You don't have any pending connection requests."}
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="sent" className="space-y-6">
              {filteredSentRequests.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredSentRequests.map((request) => (
                    <ConnectionCard
                      key={request.id}
                      connection={request}
                      isSent={true}
                      onCancel={() => handleCancelRequest(request.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Clock size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No sent requests</h3>
                  <p className="text-gray-500 mb-6">
                    {searchQuery
                      ? "No sent requests match your search criteria."
                      : "You haven't sent any connection requests yet."}
                  </p>
                  {!searchQuery && <Button variant="primary">Find People to Connect</Button>}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Request Session Modal */}
      {isRequestSessionModalOpen && selectedConnection && (
        <RequestSessionModal
          connection={selectedConnection}
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
