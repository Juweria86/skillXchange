"use client"

import React, { useState, useEffect } from "react"
import { Plus, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react"
import toast from "react-hot-toast"
import ChallengeForm from "../components/admin/ChallengeForm"
import Modal from "../components/ui/Modal"
import { Card } from "../components/ui/Card"
import Button from "../components/ui/Button"
import Input from "../components/ui/Input"
import { getChallenges, deleteChallenge, createChallenge, updateChallenge } from "../services/adminService"
import AdminSidebar from "@/components/AdminSidebar"

interface Challenge {
  _id: string
  title: string
  description: string
  startDate: string
  endDate: string
  requirements: string
  requiredSessions: number
  prizes: Array<{ name: string; description: string }>
  badges: Array<{ name: string; image: string }>
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  })
  const [search, setSearch] = useState("")
  const [isActiveFilter, setIsActiveFilter] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  // Fetch challenges with error handling
  const fetchChallenges = async () => {
    try {
      setLoading(true)
      const params: any = {
        page: pagination.page,
        limit: pagination.limit,
      }
      if (search) params.search = search
      if (isActiveFilter !== null) params.isActive = isActiveFilter

      const data = await getChallenges(params)
      setChallenges(data.challenges)
      setPagination(data.pagination)
    } catch (err) {
      console.error("Fetch challenges error:", err)
      setError("Failed to fetch challenges")
      toast.error("Failed to load challenges")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchChallenges()
  }, [pagination.page, search, isActiveFilter])

  // Handle create new challenge - THIS WAS MISSING
  const handleCreate = () => {
    setEditingChallenge(null)
    setShowForm(true)
    toast.success("Ready to create new challenge!")
  }

  // Handle form submission
  const handleFormSubmit = async (formData: any) => {
    try {
      let response
      if (editingChallenge) {
        toast.loading("Updating challenge...")
        response = await updateChallenge(editingChallenge._id, formData)
        toast.success("Challenge updated successfully!")
      } else {
        toast.loading("Creating challenge...")
        response = await createChallenge(formData)
        toast.success("Challenge created successfully!")
      }
      
      console.log("API Response:", response)
      setShowForm(false)
      fetchChallenges()
    } catch (err) {
      console.error("Form submission error:", err)
      toast.error(`Failed to ${editingChallenge ? 'update' : 'create'} challenge`)
    } finally {
      toast.dismiss()
    }
  }

  // Handle delete challenge
  const handleDelete = async (id: string) => {
    try {
      toast.loading("Deleting challenge...")
      await deleteChallenge(id)
      toast.success("Challenge deleted successfully!")
      fetchChallenges()
      setConfirmDelete(null)
    } catch (err) {
      console.error("Delete error:", err)
      toast.error("Failed to delete challenge")
    } finally {
      toast.dismiss()
    }
  }

  return (
     <div className="flex min-h-screen bg-[#FFF7D4]">
    {/* Sidebar */}
    <div className="w-64 flex-shrink-0">
      <AdminSidebar />
    </div>
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        {/* Header and Create Button */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Challenges</h1>
          <Button 
            variant="primary" 
            onClick={handleCreate} 
            leftIcon={<Plus size={16} />}
            data-testid="create-challenge-button"
          >
            New Challenge
          </Button>
        </div>

        {/* Filters and Search */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <form onSubmit={(e) => { e.preventDefault(); fetchChallenges() }} className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-gray-500" />
                </div>
                <Input
                  type="text"
                  placeholder="Search challenges..."
                  className="pl-10 w-full"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </form>

            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-500" />
              <select
                className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4a3630] bg-[#FBEAA0]"
                value={isActiveFilter === null ? "" : String(isActiveFilter)}
                onChange={(e) =>
                  setIsActiveFilter(e.target.value === "" ? null : e.target.value === "true")
                }
              >
                <option value="">All Statuses</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#4a3630]"></div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <Card className="p-4 bg-red-50 border-red-200">
            <p className="text-red-600">{error}</p>
            <Button variant="outline" onClick={fetchChallenges} className="mt-2">
              Retry
            </Button>
          </Card>
        )}

        {/* Empty State */}
        {!loading && !error && challenges.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-gray-500">No challenges found</p>
            <Button variant="primary" onClick={handleCreate} className="mt-4" leftIcon={<Plus size={16} />}>
              Create New Challenge
            </Button>
          </Card>
        )}

        {/* Challenges List */}
        {!loading && !error && challenges.length > 0 && (
          <div className="grid gap-4">
            {challenges.map((challenge) => (
              <Card key={challenge._id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{challenge.title}</h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          challenge.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {challenge.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-1 line-clamp-2">{challenge.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>
                        {new Date(challenge.startDate).toLocaleDateString()} -{" "}
                        {new Date(challenge.endDate).toLocaleDateString()}
                      </span>
                      <span>{challenge.requiredSessions} required sessions</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingChallenge(challenge)
                        setShowForm(true)
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setConfirmDelete(challenge._id)}
                    >
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
                  onClick={() => handlePageChange(pagination.page - 1)}
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
                        onClick={() => setPagination({...pagination, page: pageNum})}
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
                  onClick={() => setPagination({...pagination, page: pagination.page + 1})}
                  disabled={pagination.page === pagination.pages}
                  rightIcon={<ChevronRight size={16} />}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Challenge Form Modal */}
        <Modal isOpen={showForm} onClose={() => setShowForm(false)}>
          <ChallengeForm
            challenge={editingChallenge}
            onClose={() => setShowForm(false)}
            onSubmit={handleFormSubmit}
          />
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} size="sm">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Challenge</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this challenge? This action cannot be undone.
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
    </div>
  )
}