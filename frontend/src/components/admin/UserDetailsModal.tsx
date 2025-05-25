"use client"

import { useState } from "react"
import { X, Mail, MapPin, Calendar, Award, MessageSquare, FileText } from "lucide-react"
import {Card} from "../ui/Card"
import Button from "../ui/Button"
import Badge from "../ui/Badge"
import Avatar from "../ui/Avatar"

interface UserDetailsModalProps {
  user: any
  onClose: () => void
  onSave: (userData: any) => void
}

export default function UserDetailsModal({ user, onClose, onSave }: UserDetailsModalProps) {
  const [activeTab, setActiveTab] = useState("profile")
  const [status, setStatus] = useState(user.status)
  const [role, setRole] = useState(user.role)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle save changes
  const handleSave = async () => {
    setIsSubmitting(true)

    try {
      await onSave({
        ...user,
        status,
        role,
      })
    } catch (error) {
      console.error("Error saving user:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">User Details</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* User Info */}
              <div className="md:w-1/3">
                <div className="flex flex-col items-center text-center mb-6">
                  <Avatar src={user.avatar} size="xl" fallback={user.name.charAt(0)} />
                  <h3 className="mt-4 text-xl font-bold text-gray-900">{user.name}</h3>
                  <p className="text-gray-500 flex items-center gap-1 mt-1">
                    <Mail size={14} />
                    <span>{user.email}</span>
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant={user.role === "admin" ? "purple" : "blue"}>{user.role}</Badge>
                    <Badge variant={user.status === "active" ? "green" : "yellow"}>{user.status}</Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="font-medium flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium flex items-center gap-1">
                      <MapPin size={14} />
                      <span>{user.location || "Not specified"}</span>
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Skills</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {user.skills ? (
                        user.skills.map((skill, index) => (
                          <Badge key={index} variant="blue" small>
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No skills listed</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      id="status"
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4a3630] bg-[#FBEAA0]"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <select
                      id="role"
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4a3630] bg-[#FBEAA0]"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="moderator">Moderator</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="md:w-2/3">
                <div className="border-b border-gray-200 mb-6">
                  <nav className="flex space-x-4">
                    <button
                      className={`py-2 px-1 text-sm font-medium border-b-2 ${
                        activeTab === "profile"
                          ? "border-[#4a3630] text-[#4a3630]"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                      onClick={() => setActiveTab("profile")}
                    >
                      Profile
                    </button>
                    <button
                      className={`py-2 px-1 text-sm font-medium border-b-2 ${
                        activeTab === "activity"
                          ? "border-[#4a3630] text-[#4a3630]"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                      onClick={() => setActiveTab("activity")}
                    >
                      Activity
                    </button>
                    <button
                      className={`py-2 px-1 text-sm font-medium border-b-2 ${
                        activeTab === "connections"
                          ? "border-[#4a3630] text-[#4a3630]"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                      onClick={() => setActiveTab("connections")}
                    >
                      Connections
                    </button>
                  </nav>
                </div>

                {/* Tab Content */}
                {activeTab === "profile" && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">About</h4>
                      <p className="text-gray-700">
                        {user.bio ||
                          "This user has not added a bio yet. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">Skills Teaching</h4>
                      <div className="flex flex-wrap gap-2">
                        {user.teachingSkills ? (
                          user.teachingSkills.map((skill, index) => (
                            <Badge key={index} variant="purple">
                              {skill}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-gray-500">No teaching skills listed</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">Skills Learning</h4>
                      <div className="flex flex-wrap gap-2">
                        {user.learningSkills ? (
                          user.learningSkills.map((skill, index) => (
                            <Badge key={index} variant="blue">
                              {skill}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-gray-500">No learning skills listed</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">Badges Earned</h4>
                      <div className="flex flex-wrap gap-4">
                        {user.badges ? (
                          user.badges.map((badge, index) => (
                            <div key={index} className="flex flex-col items-center">
                              <div className="w-12 h-12 rounded-full bg-[#FBEAA0] flex items-center justify-center text-[#4a3630]">
                                <Award size={24} />
                              </div>
                              <p className="text-xs font-medium mt-1">{badge.name}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500">No badges earned yet</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "activity" && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">Recent Activity</h4>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <MessageSquare size={16} />
                          </div>
                          <div>
                            <p className="text-sm text-gray-900">
                              <span className="font-medium">Posted a discussion</span>: "Best resources for learning
                              Python in 2023"
                            </p>
                            <p className="text-xs text-gray-500">2 days ago</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                            <FileText size={16} />
                          </div>
                          <div>
                            <p className="text-sm text-gray-900">
                              <span className="font-medium">Shared a resource</span>: "Beginner's Guide to JavaScript"
                            </p>
                            <p className="text-xs text-gray-500">5 days ago</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                            <Award size={16} />
                          </div>
                          <div>
                            <p className="text-sm text-gray-900">
                              <span className="font-medium">Joined a challenge</span>: "30 Days of Coding"
                            </p>
                            <p className="text-xs text-gray-500">1 week ago</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">Statistics</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-500">Discussions</p>
                          <p className="text-2xl font-bold text-gray-900">12</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-500">Resources</p>
                          <p className="text-2xl font-bold text-gray-900">5</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-500">Connections</p>
                          <p className="text-2xl font-bold text-gray-900">24</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-500">Sessions</p>
                          <p className="text-2xl font-bold text-gray-900">8</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "connections" && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">Connections</h4>
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Avatar src={`/placeholder.svg?height=40&width=40`} size="sm" fallback={`User ${i}`} />
                              <div>
                                <p className="font-medium text-gray-900">Connection User {i}</p>
                                <p className="text-xs text-gray-500">Connected 2 weeks ago</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              View Profile
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </Card>
    </div>
  )
}
