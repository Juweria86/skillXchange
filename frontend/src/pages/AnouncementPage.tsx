"use client"

import React, { useState, useEffect } from "react"
import { Plus, Search, ChevronLeft, ChevronRight } from "lucide-react"
import toast from "react-hot-toast"
import CreateAnnouncementModal from "../components/admin/CreateAnnouncementModal"
import Modal from "../components/ui/Modal"
import { Card } from "../components/ui/Card"
import Button from "../components/ui/Button"
import Input from "../components/ui/Input"
import { 
  createAnnouncement, 
  updateAnnouncement, 
  deleteAnnouncement, 
  getAnnouncements,
} from "../services/adminService"
import AdminSidebar from "@/components/AdminSidebar"

interface Announcement {
  _id: string
  title: string
  content: string
  buttonText: string
  buttonLink: string
  secondaryButtonText?: string
  secondaryButtonLink?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  isAnnouncement?: boolean // Added this field
}

interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  })
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  // Fetch announcements with proper filtering
const fetchAnnouncements = async () => {
  try {
    setLoading(true);
    const params = {
      page: pagination.page,
      limit: pagination.limit,
      search
    };

    const data = await getAnnouncements(params);
    
    console.log("API Response:", data);
    
    setAnnouncements(data.announcements || data); // Handle different response structures
    setPagination(data.pagination || { 
      page: 1,
      limit: data.announcements?.length || data.length,
      total: data.announcements?.length || data.length,
      pages: 1
    });
  } catch (err) {
    console.error("Fetch announcements error:", err);
    setError("Failed to fetch announcements");
    toast.error("Failed to load announcements");
  } finally {
    setLoading(false);
  }
}

  useEffect(() => {
    fetchAnnouncements()
  }, [pagination.page, search])


const handleCreate = () => {
    setEditingAnnouncement(null)
    setShowCreateModal(true)
    toast.success("Ready to create new announcement!")
  }

  // Handle form submission with proper data structure
  const handleSubmit = async (formData: any) => {
    try {
      let response
      if (editingAnnouncement) {
        toast.loading("Updating announcement...")
        response = await updateAnnouncement(editingAnnouncement._id, {
          ...formData,
          isAnnouncement: true // Ensure this flag is set
        })
        toast.success("Announcement updated successfully!")
      } else {
        toast.loading("Creating announcement...")
        response = await createAnnouncement({
          ...formData,
          isAnnouncement: true // Ensure this flag is set
        })
        toast.success("Announcement created successfully!")
      }
      
      // Debugging: Log the creation response
      console.log("Creation Response:", response)
      
      setShowCreateModal(false)
      // Force refresh with page 1 to see the new announcement
      setPagination(prev => ({ ...prev, page: 1 }))
      await fetchAnnouncements()
    } catch (err) {
      console.error("Form submission error:", err)
      toast.error(`Failed to ${editingAnnouncement ? 'update' : 'create'} announcement`)
    } finally {
      toast.dismiss()
    }
  }

  // ... rest of your component remains the same ...

  // Handle delete announcement
  const handleDelete = async (id: string) => {
    try {
      toast.loading("Deleting announcement...")
      await deleteAnnouncement(id)
      toast.success("Announcement deleted successfully!")
      fetchAnnouncements()
      setConfirmDelete(null)
    } catch (err) {
      console.error("Delete error:", err)
      toast.error("Failed to delete announcement")
    } finally {
      toast.dismiss()
    }
  }

    function handleEdit(announcement: Announcement): void {
        setEditingAnnouncement(announcement)
        setShowCreateModal(true)
    }
return (
  <div className="flex min-h-screen bg-[#FFF7D4]">
    {/* Sidebar */}
    <div className="w-64 flex-shrink-0">
      <AdminSidebar />
    </div>

    {/* Main Content */}
    <div className="flex-1 px-6 py-8 space-y-6">
      {/* Header and Create Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
        <Button variant="primary" onClick={handleCreate} leftIcon={<Plus size={16} />}>
          New Announcement
        </Button>
      </div>

      {/* Search */}
      <Card className="p-4">
        <form onSubmit={(e) => { e.preventDefault(); fetchAnnouncements() }}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-500" />
            </div>
            <Input
              type="text"
              placeholder="Search announcements..."
              className="pl-10 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </form>
      </Card>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#4a3630]"></div>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <Card className="p-4 bg-red-50 border-red-200">
          <p className="text-red-600">{error}</p>
          <Button variant="outline" onClick={fetchAnnouncements} className="mt-2">
            Retry
          </Button>
        </Card>
      )}

      {/* Empty */}
      {!loading && !error && announcements.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-500">No announcements found</p>
          <Button variant="primary" onClick={handleCreate} className="mt-4" leftIcon={<Plus size={16} />}>
            Create New Announcement
          </Button>
        </Card>
      )}

      {/* List */}
      {!loading && !error && announcements.length > 0 && (
        <div className="grid gap-4">
          {announcements.map((announcement) => (
            <Card key={announcement._id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{announcement.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      announcement.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {announcement.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1 line-clamp-2">{announcement.content}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span>Primary: {announcement.buttonText} → {announcement.buttonLink}</span>
                    {announcement.secondaryButtonText && (
                      <span>Secondary: {announcement.secondaryButtonText} → {announcement.secondaryButtonLink}</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    Created: {new Date(announcement.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(announcement)}>
                    Edit
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => setConfirmDelete(announcement._id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                disabled={pagination.page === 1}
                leftIcon={<ChevronLeft size={16} />}
              >
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, pagination.pages) }).map((_, i) => {
                  let pageNum
                  if (pagination.pages <= 5) {
                    pageNum = i + 1
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1
                  } else if (pagination.page >= pagination.pages - 2) {
                    pageNum = pagination.pages - 4 + i
                  } else {
                    pageNum = pagination.page - 2 + i
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPagination({ ...pagination, page: pageNum })}
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        pagination.page === pageNum
                          ? "bg-[#4a3630] text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>

              <Button
                variant="outline"
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                disabled={pagination.page === pagination.pages}
                rightIcon={<ChevronRight size={16} />}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateAnnouncementModal
          announcement={editingAnnouncement}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleSubmit}
        />
      )}

      <Modal isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} size="sm">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Announcement</h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete this announcement? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => confirmDelete && handleDelete(confirmDelete)}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  </div>
)

}