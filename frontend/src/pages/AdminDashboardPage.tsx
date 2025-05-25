"use client"

import { useState, useEffect } from "react"
import { BarChart2, Users, MessageSquare, FileText, Award, Bell, Flag, RefreshCw } from "lucide-react"
import { Card } from "../components/ui/Card"
import Button from "../components/ui/Button"
import { getAdminStats } from "../services/adminService"
import AdminSidebar from "@/components/AdminSidebar"

type Author = {
  _id: string
  name: string
  avatar?: string
}

type ActivityItem = {
  type: string
  id: string
  title: string
  author: Author  // Changed from string to Author object
  createdAt: string
}

type AdminStats = {
  users: {
    total: number
    active: number
  }
  discussions: {
    total: number
    pending: number
  }
  resources: {
    total: number
    pending: number
  }
  challenges: {
    total: number
    participants: number
  }
  recentActivity: ActivityItem[]
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getAdminStats()
      setStats(data)
    } catch (err) {
      console.error("Error fetching stats:", err)
      setError("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

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
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Dashboard</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button variant="primary" onClick={fetchStats}>
          Retry
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

    {/* Main Content */}
    <div className="flex-1 p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <Button
          variant="secondary"
          onClick={fetchStats}
          leftIcon={<RefreshCw size={16} />}
        >
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Users Card */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
              <Users size={20} />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats?.users?.total || 0}</p>
            <p className="text-sm text-blue-600">{stats?.users?.active || 0} active</p>
          </div>
        </Card>

        {/* Discussions Card */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Discussions</h3>
            <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
              <MessageSquare size={20} />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats?.discussions?.total || 0}</p>
            <p className="text-sm text-green-600">{stats?.discussions?.pending || 0} pending</p>
          </div>
        </Card>

        {/* Resources Card */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Resources</h3>
            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
              <FileText size={20} />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats?.resources?.total || 0}</p>
            <p className="text-sm text-purple-600">{stats?.resources?.pending || 0} pending</p>
          </div>
        </Card>

        {/* Challenges Card */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Challenges</h3>
            <div className="w-10 h-10 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center">
              <Award size={20} />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats?.challenges?.total || 0}</p>
            <p className="text-sm text-yellow-600">{stats?.challenges?.participants || 0} participants</p>
          </div>
        </Card>
      </div>

      {/* Recent Activity and Pending Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity Card */}
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {stats?.recentActivity?.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.type === 'discussion' ? 'bg-blue-100 text-blue-600' :
                  activity.type === 'resource' ? 'bg-green-100 text-green-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {activity.type === 'discussion' ? (
                    <MessageSquare size={16} />
                  ) : (
                    <FileText size={16} />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-xs text-gray-500">
                    {typeof activity.author === 'object'
                      ? activity.author.name
                      : activity.author} • {new Date(activity.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
            {stats?.recentActivity?.length === 0 && (
              <p className="text-gray-500 text-sm">No recent activity</p>
            )}
          </div>
        </Card>

        {/* Pending Approvals Card */}
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Pending Approvals</h3>
          <div className="space-y-3">
            {/* Discussion */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center">
                  <MessageSquare size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium">Discussions</p>
                  <p className="text-xs text-gray-500">{stats?.discussions?.pending || 0} pending</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Review</Button>
            </div>

            {/* Resources */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center">
                  <FileText size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium">Resources</p>
                  <p className="text-xs text-gray-500">{stats?.resources?.pending || 0} pending</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Review</Button>
            </div>

            {/* Reports */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center">
                  <Flag size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium">Reports</p>
                  <p className="text-xs text-gray-500">{stats?.reports?.pending || 0} pending</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Review</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>
);

}