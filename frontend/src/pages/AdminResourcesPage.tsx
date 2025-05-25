"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Eye, Edit, Trash2, CheckCircle, XCircle } from "lucide-react"
import {Card} from "../components/ui/Card"
import Button from "../components/ui/Button"
import Input from "../components/ui/Input"
import Badge from "../components/ui/Badge"
import Avatar from "../components/ui/Avatar"
import AdminSidebar from "../components/AdminSidebar"
import { getResources, approveResource, deleteResource } from "../services/adminService"

// Resource row component
function ResourceRow({ resource, onView, onEdit, onApprove, onReject, onDelete }) {
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg ${resource.iconBg} flex items-center justify-center ${resource.iconColor}`}
            dangerouslySetInnerHTML={{ __html: resource.icon }}
          ></div>
          <div>
            <p className="font-medium text-gray-900">{resource.title}</p>
            <p className="text-xs text-gray-500">{resource.type}</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <Avatar src={resource.author.avatar} size="xs" fallback={resource.author.name.charAt(0)} />
          <span className="text-sm text-gray-700">{resource.author.name}</span>
        </div>
      </td>
      <td className="py-3 px-4">
        <Badge variant="blue">{resource.topic}</Badge>
      </td>
      <td className="py-3 px-4 text-sm text-gray-500">{resource.downloads}</td>
      <td className="py-3 px-4">
        <Badge variant={resource.status === "approved" ? "green" : resource.status === "pending" ? "yellow" : "red"}>
          {resource.status}
        </Badge>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={() => onView(resource.id)}
            className="p-1 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
            title="View Resource"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => onEdit(resource.id)}
            className="p-1 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
            title="Edit Resource"
          >
            <Edit size={16} />
          </button>
          {resource.status === "pending" && (
            <>
              <button
                onClick={() => onApprove(resource.id)}
                className="p-1 text-gray-500 hover:text-green-600 rounded-md hover:bg-gray-100"
                title="Approve"
              >
                <CheckCircle size={16} />
              </button>
              <button
                onClick={() => onReject(resource.id)}
                className="p-1 text-gray-500 hover:text-red-600 rounded-md hover:bg-gray-100"
                title="Reject"
              >
                <XCircle size={16} />
              </button>
            </>
          )}
          <button
            onClick={() => onDelete(resource.id)}
            className="p-1 text-gray-500 hover:text-red-600 rounded-md hover:bg-gray-100"
            title="Delete Resource"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  )
}

export default function AdminResourcesPage() {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState("all")
  const [topic, setTopic] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  // Fetch resources
  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true)
      setError(null)

      try {
        const params = {
          isApproved: filter !== "all" ? filter === "approved" : undefined,
          topic: topic !== "all" ? topic : undefined,
          search: searchTerm || undefined,
        }

        const response = await getResources(params)
        setResources(response.resources)
      } catch (err) {
        console.error("Error fetching resources:", err)
        setError("Failed to load resources. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchResources()
  }, [filter, topic, searchTerm])

  // Filter resources
  const filteredResources = resources.filter((resource) => {
    // Filter by status
    if (filter !== "all" && resource.status !== filter) {
      return false
    }

    // Filter by topic
    if (topic !== "all" && resource.topic !== topic) {
      return false
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      return (
        resource.title.toLowerCase().includes(term) ||
        resource.type.toLowerCase().includes(term) ||
        resource.author.name.toLowerCase().includes(term)
      )
    }

    return true
  })

  // Handle view resource
  const handleViewResource = (resourceId) => {
    console.log("View resource:", resourceId)
    // Navigate to resource details or show modal
    const resource = resources.find((r) => r.id === resourceId)
    if (resource) {
      if (resource.fileUrl) {
        window.open(resource.fileUrl, "_blank")
      } else if (resource.externalLink) {
        window.open(resource.externalLink, "_blank")
      } else {
        alert(`Viewing resource: ${resource.title}`)
      }
    }
  }

  // Handle edit resource
  const handleEditResource = (resourceId) => {
    console.log("Edit resource:", resourceId)
    // Show edit resource modal
    alert(`Editing resource: ${resourceId}`)
  }

  // Handle approve resource
  const handleApproveResource = async (resourceId) => {
    try {
      await approveResource(resourceId, true)
      // Update the local state
      setResources(resources.map((r) => (r.id === resourceId ? { ...r, status: "approved" } : r)))
    } catch (error) {
      console.error("Error approving resource:", error)
    }
  }

  // Handle reject resource
  const handleRejectResource = async (resourceId) => {
    try {
      await approveResource(resourceId, false)
      // Update the local state
      setResources(resources.map((r) => (r.id === resourceId ? { ...r, status: "rejected" } : r)))
    } catch (error) {
      console.error("Error rejecting resource:", error)
    }
  }

  // Handle delete resource
  const handleDeleteResource = async (resourceId) => {
    try {
      if (confirm("Are you sure you want to delete this resource?")) {
        await deleteResource(resourceId)
        // Update the local state
        setResources(resources.filter((r) => r.id !== resourceId))
      }
    } catch (error) {
      console.error("Error deleting resource:", error)
    }
  }

  return (
    <div className="flex min-h-screen bg-[#FFF7D4]">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Resources Management</h1>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder="Search resources..."
                    variant="yellow"
                    leftIcon={<Search size={16} />}
                    className="w-full sm:w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <select
                    className="px-3 py-1.5 bg-white rounded-lg shadow-sm text-sm border-none focus:ring-2 focus:ring-[#4a3630]"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <select
                    className="px-3 py-1.5 bg-white rounded-lg shadow-sm text-sm border-none focus:ring-2 focus:ring-[#4a3630]"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  >
                    <option value="all">All Topics</option>
                    <option value="programming">Programming</option>
                    <option value="design">Design</option>
                    <option value="business">Business</option>
                    <option value="language">Language</option>
                  </select>
                </div>
                <Button variant="primary" leftIcon={<Plus size={16} />}>
                  Add Resource
                </Button>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4a3630]"></div>
                </div>
              ) : error ? (
                <Card className="p-6 text-center">
                  <div className="text-red-500 mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mx-auto"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Resources</h3>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <Button variant="primary" onClick={() => window.location.reload()}>
                    Try Again
                  </Button>
                </Card>
              ) : (
                <Card>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <th className="py-3 px-4">Resource</th>
                          <th className="py-3 px-4">Author</th>
                          <th className="py-3 px-4">Topic</th>
                          <th className="py-3 px-4">Downloads</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredResources.length > 0 ? (
                          filteredResources.map((resource) => (
                            <ResourceRow
                              key={resource.id}
                              resource={resource}
                              onView={handleViewResource}
                              onEdit={handleEditResource}
                              onApprove={handleApproveResource}
                              onReject={handleRejectResource}
                              onDelete={handleDeleteResource}
                            />
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="py-6 text-center text-gray-500">
                              No resources found matching your criteria.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {filteredResources.length > 0 && (
                    <div className="p-4 border-t border-gray-200 flex items-center justify-between">
                      <p className="text-sm text-gray-500">
                        Showing <span className="font-medium">{filteredResources.length}</span> of{" "}
                        <span className="font-medium">{resources.length}</span> resources
                      </p>
                      <div className="flex items-center gap-2">
                        <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                          Previous
                        </button>
                        <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
