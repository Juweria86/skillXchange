"use client"

import { useState, useEffect } from "react"
import { Users, Search, Filter, Plus, Edit, Trash2, X, Check } from "lucide-react"
import {Card} from "../components/ui/Card"
import Button from "../components/ui/Button"
import Input from "../components/ui/Input"
import Modal from "../components/ui/Modal"
import { getUsers, deleteUser, updateUser, getUserById } from "../services/adminService"
import AdminSidebar from "@/components/AdminSidebar"
import PageHeader from "@/components/layout/PageHeader"

type User = {
  id?: string
  _id: string
  name: string
  email: string
  role: string
  status: string
  createdAt: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
    status: "active"
  })

  useEffect(() => {
    fetchUsers()
  }, [searchTerm])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const params = searchTerm ? { search: searchTerm } : {}
      const data = await getUsers(params)
      // Ensure consistent ID field
      const formattedUsers = data.users.map(user => ({
        ...user,
        id: user._id // Map _id to id for frontend consistency
      }))
      setUsers(formattedUsers)
    } catch (err: any) {
      console.error("Error fetching users:", err)
      setError(err.message || "Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleDelete = async (userId: string) => {
    if (!userId) {
      setError('Invalid user ID')
      return
    }

    if (!confirm("Are you sure you want to delete this user?")) {
      return
    }

    try {
      await deleteUser(userId)
      setUsers(users.filter(user => user._id !== userId))
      setError(null)
    } catch (err: any) {
      console.error('Delete error:', err)
      setError(err.message || 'Failed to delete user')
    }
  }

  const handleEdit = async (userId: string) => {
    try {
      const user = await getUserById(userId)
      setCurrentUser(user)
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      })
      setIsModalOpen(true)
    } catch (err: any) {
      console.error("Error fetching user:", err)
      setError(err.message || "Failed to load user data")
    }
  }

  // const handleAddNew = () => {
  //   setCurrentUser(null)
  //   setFormData({
  //     name: "",
  //     email: "",
  //     role: "user",
  //     status: "active"
  //   })
  //   setIsModalOpen(true)
  // }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (currentUser) {
        // Update existing user
        await updateUser(currentUser._id, formData)
        setIsModalOpen(false)
        await fetchUsers() // Refresh the list
      }
    } catch (err: any) {
      console.error("Error saving user:", err)
      setError(err.message || "Failed to save user")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
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
        <Button variant="primary" onClick={fetchUsers}>
          Try Again
        </Button>
      </Card>
    )
  }


return (
  <div className="flex min-h-screen bg-[#FFF7D4]">
    {/* Sidebar */}
    <AdminSidebar />

    {/* Main content area */}
    <div className="flex-1 flex flex-col p-4">
      {/* Page header */}
      <PageHeader title="Users" backTo="admin/dashboard">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearch}
            leftIcon={<Search size={16} />}
            className="w-full sm:w-64"
          />
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg shadow-sm">
            <Filter size={16} />
            <span className="text-sm">Filter</span>
          </button>
        </div>
      </PageHeader>

      {/* Table */}
      <Card className="mt-4">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Joined</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(user.id)}
                        className="p-1 text-gray-500 hover:text-blue-600 rounded-md hover:bg-gray-100"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-1 text-gray-500 hover:text-red-600 rounded-md hover:bg-gray-100"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Edit User</h2>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4a3630] focus:border-[#4a3630]"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="moderator">Moderator</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4a3630] focus:border-[#4a3630]"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Update User
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  </div>
)
}