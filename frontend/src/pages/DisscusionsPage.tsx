"use client"

import { useState, useEffect } from "react"
import { MessageSquare, Search, Filter, Plus, Eye, CheckCircle, XCircle, Trash2 } from "lucide-react"
import {Card} from "../components/ui/Card"
import Button from "../components/ui/Button"
import Input from "../components/ui/Input"
import Modal from "../components/ui/Modal"
import { DiscussionsTable } from "../components/admin/DiscussionsTable"
import { getDiscussions, updateDiscussionStatus, deleteDiscussion } from "../services/adminService"
import AdminSidebar from "@/components/AdminSidebar"

type Discussion = {
  id: string
  _id: string
  title: string
  author: {
    name: string
    avatar?: string
  }
  tags: {
    name: string
    variant: string
  }[]
  replies: number
  status: "approved" | "pending" | "rejected"
  createdAt: string
  time?: string
}

export default function DiscussionsPage() {
  const [discussions, setDiscussions] = useState<Discussion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedDiscussion, setSelectedDiscussion] = useState<Discussion | null>(null)

  useEffect(() => {
    fetchDiscussions()
  }, [searchTerm, statusFilter])

  const fetchDiscussions = async () => {
    try {
      setLoading(true)
      setError(null)
      const params: any = {}
      if (searchTerm) params.search = searchTerm
      if (statusFilter !== "all") params.status = statusFilter
      
      const data = await getDiscussions(params)
      const formattedDiscussions = data.discussions.map(d => ({
        ...d,
        id: d._id,
        time: new Date(d.createdAt).toLocaleDateString()
      }))
      setDiscussions(formattedDiscussions)
    } catch (err) {
      console.error("Error fetching discussions:", err)
      setError("Failed to load discussions")
    } finally {
      setLoading(false)
    }
  }

  const handleView = (id: string) => {
    const discussion = discussions.find(d => d.id === id)
    if (discussion) {
      setSelectedDiscussion(discussion)
      // Alternatively, navigate to discussion detail page
      // navigate(`/discussions/${id}`)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      await updateDiscussionStatus(id, "approved")
      setDiscussions(discussions.map(d => 
        d.id === id ? { ...d, status: "approved" } : d
      ))
    } catch (err) {
      console.error("Error approving discussion:", err)
      setError("Failed to approve discussion")
    }
  }

  const handleReject = async (id: string) => {
    try {
      await updateDiscussionStatus(id, "rejected")
      setDiscussions(discussions.map(d => 
        d.id === id ? { ...d, status: "rejected" } : d
      ))
    } catch (err) {
      console.error("Error rejecting discussion:", err)
      setError("Failed to reject discussion")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this discussion?")) return
    
    try {
      await deleteDiscussion(id)
      setDiscussions(discussions.filter(d => d.id !== id))
    } catch (err) {
      console.error("Error deleting discussion:", err)
      setError("Failed to delete discussion")
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4a3630]"></div>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="p-6 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button variant="primary" onClick={fetchDiscussions}>
          Try Again
        </Button>
      </Card>
    )
  }

return (
  <div className="flex min-h-screen bg-[#FFF7D4]">
    {/* Sidebar */}
    <div className="w-64 flex-shrink-0">
      <AdminSidebar />
    </div>

    <div className="flex-1 p-6 space-y-4">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Search discussions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search size={16} />}
            className="w-full sm:w-64"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-white rounded-lg shadow-sm text-sm border-none focus:ring-2 focus:ring-[#4a3630]"
          >
            <option value="all">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <Button variant="primary" leftIcon={<Plus size={16} />}>
          Create Discussion
        </Button>
      </div>

      {/* Discussions Table */}
      <DiscussionsTable
        discussions={discussions}
        onView={handleView}
        onApprove={handleApprove}
        onReject={handleReject}
        onDelete={handleDelete}
      />

      {/* Discussion Detail Modal */}
      {selectedDiscussion && (
        <Modal isOpen={!!selectedDiscussion} onClose={() => setSelectedDiscussion(null)}>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">{selectedDiscussion.title}</h2>

            <div className="flex items-center gap-3 mb-4">
              {selectedDiscussion.author.avatar ? (
                <img
                  src={selectedDiscussion.author.avatar}
                  alt={selectedDiscussion.author.name}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  {selectedDiscussion.author.name.charAt(0)}
                </div>
              )}
              <div>
                <p className="font-medium">{selectedDiscussion.author.name}</p>
                <p className="text-sm text-gray-500">{selectedDiscussion.time}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-4">
              {selectedDiscussion.tags.map((tag, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 rounded-full text-xs ${
                    tag.variant === 'blue'
                      ? 'bg-blue-100 text-blue-800'
                      : tag.variant === 'green'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {tag.name}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1 text-gray-500">
                <MessageSquare size={16} />
                <span>{selectedDiscussion.replies} replies</span>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  selectedDiscussion.status === 'approved'
                    ? 'bg-green-100 text-green-800'
                    : selectedDiscussion.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {selectedDiscussion.status}
              </span>
            </div>

            <div className="mt-6 flex justify-end">
              <Button variant="secondary" onClick={() => setSelectedDiscussion(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  </div>
)

}