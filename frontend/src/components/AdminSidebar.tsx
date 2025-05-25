"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  BarChart2,
  Users,
  MessageSquare,
  FileText,
  Award,
  Bell,
  Flag,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react"
import Avatar from "./ui/Avatar"

interface AdminSidebarProps {
  isOpen?: boolean
  setIsOpen?: (isOpen: boolean) => void
}

export default function AdminSidebar({ isOpen = true, setIsOpen }: AdminSidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(isOpen)
  const location = useLocation()

  // Update internal state when prop changes
  useEffect(() => {
    setSidebarOpen(isOpen)
  }, [isOpen])

  // Handle toggle sidebar
  const toggleSidebar = () => {
    const newState = !sidebarOpen
    setSidebarOpen(newState)
    if (setIsOpen) {
      setIsOpen(newState)
    }
  }

  // Navigation items
  const navItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: <BarChart2 size={20} /> },
    { path: "/admin/users", label: "Users", icon: <Users size={20} /> },
    { path: "/admin/discussions", label: "Discussions", icon: <MessageSquare size={20} /> },
    { path: "/admin/resources", label: "Resources", icon: <FileText size={20} /> },
    { path: "/admin/challenges", label: "Challenges", icon: <Award size={20} /> },
    { path: "/admin/announcements", label: "Announcements", icon: <Bell size={20} /> },
    { path: "/admin/reports", label: "Reports", icon: <Flag size={20} /> },
    { path: "/admin/settings", label: "Settings", icon: <Settings size={20} /> },
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`h-screen bg-white shadow-lg transition-all duration-300 ease-in-out lg:w-64 lg:sticky lg:top-0 lg:left-0 ${
          sidebarOpen ? "w-64 fixed top-0 left-0 z-30" : "w-0 fixed"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#4a3630] flex items-center justify-center text-white font-bold">
              A
            </div>
            <div>
              <h2 className="font-bold text-[#4a3630]">SkillSwap</h2>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>
          <button onClick={toggleSidebar} className="lg:hidden text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {/* Admin Profile */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Avatar src="/placeholder.svg?height=40&width=40" size="md" fallback="A" />
            <div>
              <p className="font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">admin@skillswap.com</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 overflow-y-auto h-[calc(100vh-160px)]">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive ? "bg-[#FBEAA0] text-[#4a3630] font-medium" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {isActive && <ChevronRight size={16} className="ml-auto" />}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Logout */}
          <div className="mt-8 pt-4 border-t border-gray-200">
            <Link
              to="/logout"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </Link>
          </div>
        </nav>
      </aside>

      {/* Mobile Toggle Button */}
      <button
        className="fixed bottom-4 left-4 z-40 lg:hidden p-3 rounded-full bg-[#4a3630] text-white shadow-lg"
        onClick={toggleSidebar}
      >
        <Menu size={20} />
      </button>
    </>
  )
}
