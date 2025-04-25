"use client"

import type React from "react"

import { useState } from "react"
import { User, Mail, Lock, Bell, Shield, Upload, Eye, EyeOff } from "lucide-react"
import AppSidebar from "../components/AppSidebar"
import PageHeader from "../components/layout/PageHeader"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import Input from "../components/ui/Input"
import Avatar from "../components/ui/Avatar"

// Settings tab component
function SettingsTab({
  active,
  icon,
  label,
  onClick,
}: { active: boolean; icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${
        active ? "bg-[#FBEAA0] text-[#4a3630] font-medium" : "text-gray-700 hover:bg-gray-100"
      }`}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex min-h-screen bg-[#FFF7D4]">
      <AppSidebar />

      <div className="flex-1 flex flex-col">
        <PageHeader title="Settings" backTo="/home-dashboard" />

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Settings Tabs */}
              <div className="w-full md:w-64 bg-white rounded-xl shadow-md p-4 h-fit">
                <div className="space-y-1">
                  <SettingsTab
                    active={activeTab === "profile"}
                    icon={<User size={20} />}
                    label="Profile Settings"
                    onClick={() => setActiveTab("profile")}
                  />
                  <SettingsTab
                    active={activeTab === "account"}
                    icon={<Mail size={20} />}
                    label="Account Settings"
                    onClick={() => setActiveTab("account")}
                  />
                  <SettingsTab
                    active={activeTab === "notifications"}
                    icon={<Bell size={20} />}
                    label="Notifications"
                    onClick={() => setActiveTab("notifications")}
                  />
                  <SettingsTab
                    active={activeTab === "privacy"}
                    icon={<Shield size={20} />}
                    label="Privacy & Visibility"
                    onClick={() => setActiveTab("privacy")}
                  />
                  <SettingsTab
                    active={activeTab === "security"}
                    icon={<Lock size={20} />}
                    label="Security"
                    onClick={() => setActiveTab("security")}
                  />
                </div>
              </div>

              {/* Settings Content */}
              <div className="flex-1">
                {activeTab === "profile" && (
                  <Card>
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Profile Settings</h2>
                      <p className="text-gray-600">Update your personal information and profile details.</p>
                    </div>

                    <div className="p-6 space-y-6">
                      {/* Profile Picture */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Profile Picture</label>
                        <div className="flex items-center gap-4">
                          <Avatar size="xl" fallback="AJ" />
                          <div>
                            <Button variant="primary" leftIcon={<Upload size={16} />} className="mb-2">
                              Upload New Picture
                            </Button>
                            <p className="text-xs text-gray-500">JPG, PNG or GIF. Max size 2MB.</p>
                          </div>
                        </div>
                      </div>

                      {/* Name */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input id="first-name" type="text" label="First Name" defaultValue="Alex" variant="yellow" />
                        <Input id="last-name" type="text" label="Last Name" defaultValue="Johnson" variant="yellow" />
                      </div>

                      {/* Bio */}
                      <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                          Bio
                        </label>
                        <textarea
                          id="bio"
                          rows={4}
                          defaultValue="Full-stack developer passionate about teaching and learning new skills."
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4a3630] focus:border-transparent bg-[#FBEAA0]"
                        ></textarea>
                      </div>

                      {/* Location */}
                      <Input
                        id="location"
                        type="text"
                        label="Location"
                        defaultValue="San Francisco, CA"
                        variant="yellow"
                      />

                      <div className="flex justify-end">
                        <Button variant="primary">Save Changes</Button>
                      </div>
                    </div>
                  </Card>
                )}

                {activeTab === "account" && (
                  <Card>
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Account Settings</h2>
                      <p className="text-gray-600">Manage your account details and connected services.</p>
                    </div>

                    <div className="p-6 space-y-6">
                      {/* Email */}
                      <Input
                        id="email"
                        type="email"
                        label="Email Address"
                        defaultValue="alex.johnson@example.com"
                        variant="yellow"
                      />

                      {/* Password */}
                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                          Change Password
                        </label>
                        <div className="space-y-3">
                          <div className="relative">
                            <input
                              id="current-password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Current Password"
                              className="w-full pl-4 pr-10 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4a3630] focus:border-transparent bg-[#FBEAA0]"
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-2.5 text-gray-500"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                          <input
                            id="new-password"
                            type="password"
                            placeholder="New Password"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4a3630] focus:border-transparent bg-[#FBEAA0]"
                          />
                          <input
                            id="confirm-password"
                            type="password"
                            placeholder="Confirm New Password"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4a3630] focus:border-transparent bg-[#FBEAA0]"
                          />
                        </div>
                      </div>

                      {/* Connected Accounts */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Connected Accounts</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#4285F4] flex items-center justify-center text-white">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                                </svg>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">Google</h4>
                                <p className="text-xs text-gray-500">Connected</p>
                              </div>
                            </div>
                            <button className="text-sm text-red-500 hover:text-red-700">Disconnect</button>
                          </div>

                          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#1877F2] flex items-center justify-center text-white">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                                </svg>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">Facebook</h4>
                                <p className="text-xs text-gray-500">Not connected</p>
                              </div>
                            </div>
                            <button className="text-sm text-[#4a3630] hover:text-[#3a2a24]">Connect</button>
                          </div>
                        </div>
                      </div>

                      {/* Delete Account */}
                      <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Delete Account</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Once you delete your account, there is no going back. Please be certain.
                        </p>
                        <Button variant="outline" className="text-red-500 border-red-500 hover:bg-red-50">
                          Delete Account
                        </Button>
                      </div>

                      <div className="flex justify-end">
                        <Button variant="primary">Save Changes</Button>
                      </div>
                    </div>
                  </Card>
                )}

                {activeTab === "notifications" && (
                  <Card>
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Notification Settings</h2>
                      <p className="text-gray-600">Control how and when you receive notifications.</p>
                    </div>

                    <div className="p-6 space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium text-gray-700">Email Notifications</h3>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">New Messages</h4>
                            <p className="text-sm text-gray-500">Get notified when you receive a new message</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#4a3630]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4a3630]"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">Session Requests</h4>
                            <p className="text-sm text-gray-500">Get notified when someone requests a session</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#4a3630]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4a3630]"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">Session Reminders</h4>
                            <p className="text-sm text-gray-500">Get reminded about upcoming sessions</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#4a3630]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4a3630]"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">New Matches</h4>
                            <p className="text-sm text-gray-500">Get notified when you have new skill matches</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#4a3630]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4a3630]"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">Platform Announcements</h4>
                            <p className="text-sm text-gray-500">Get notified about new features and updates</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#4a3630]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4a3630]"></div>
                          </label>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button variant="primary">Save Changes</Button>
                      </div>
                    </div>
                  </Card>
                )}

                {activeTab === "privacy" && (
                  <Card>
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Privacy & Visibility</h2>
                      <p className="text-gray-600">Control who can see your profile and information.</p>
                    </div>

                    <div className="p-6 space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium text-gray-700">Profile Visibility</h3>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">Profile Visibility</h4>
                            <p className="text-sm text-gray-500">Control who can view your profile</p>
                          </div>
                          <select className="px-3 py-1.5 bg-[#FBEAA0] rounded-lg shadow-sm text-sm border-none focus:ring-2 focus:ring-[#4a3630]">
                            <option value="public">Public</option>
                            <option value="matches">Matches Only</option>
                            <option value="private">Private</option>
                          </select>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">Allow Search by Location</h4>
                            <p className="text-sm text-gray-500">Allow others to find you based on your location</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#4a3630]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4a3630]"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">Show Online Status</h4>
                            <p className="text-sm text-gray-500">Show when you're active on the platform</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#4a3630]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4a3630]"></div>
                          </label>
                        </div>
                      </div>

                      {/* Blocked Users */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Blocked Users</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-gray-500">You haven't blocked any users yet.</p>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button variant="primary">Save Changes</Button>
                      </div>
                    </div>
                  </Card>
                )}

                {activeTab === "security" && (
                  <Card>
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Security Settings</h2>
                      <p className="text-gray-600">Manage your account security and login sessions.</p>
                    </div>

                    <div className="p-6 space-y-6">
                      {/* Two-Factor Authentication */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-medium text-gray-700">Two-Factor Authentication</h3>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#4a3630]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4a3630]"></div>
                          </label>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          Add an extra layer of security to your account by requiring a verification code in addition to
                          your password when you sign in.
                        </p>
                        <Button variant="primary">Set Up Two-Factor Authentication</Button>
                      </div>

                      {/* Session Activity */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Session Activity</h3>
                        <div className="space-y-3">
                          <div className="p-3 border border-gray-200 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-gray-900">Current Session</h4>
                                <p className="text-xs text-gray-500">
                                  Chrome on macOS • San Francisco, CA • Started 2 hours ago
                                </p>
                              </div>
                              <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">
                                Current
                              </span>
                            </div>
                          </div>

                          <div className="p-3 border border-gray-200 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-gray-900">Safari on iPhone</h4>
                                <p className="text-xs text-gray-500">San Francisco, CA • Last active 2 days ago</p>
                              </div>
                              <button className="text-xs text-red-500 hover:text-red-700">Sign Out</button>
                            </div>
                          </div>

                          <div className="p-3 border border-gray-200 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-gray-900">Firefox on Windows</h4>
                                <p className="text-xs text-gray-500">New York, NY • Last active 5 days ago</p>
                              </div>
                              <button className="text-xs text-red-500 hover:text-red-700">Sign Out</button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button variant="outline">Sign Out All Other Sessions</Button>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
