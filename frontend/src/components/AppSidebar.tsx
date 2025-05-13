"use client"

import { Link, useLocation } from "react-router-dom"
import { Home, UserCircle, Brain, RefreshCw, Calendar, MessageSquare, Settings, LogOut, Menu, X, Users } from "lucide-react"
import { useSidebar } from "../context/SidebarContext"

export default function AppSidebar() {
  const { sidebarOpen, setSidebarOpen } = useSidebar()
  const location = useLocation()

  // Helper function to check if a path is active
  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <>
      {/* Mobile Sidebar Toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-[#4a3630] text-white"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b">
            <Link to="/home-dashboard" className="flex items-center gap-2">
              <div className="bg-[#4a3630] text-white p-2 rounded-lg shadow-md">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M21 10H3M16 2V6M8 2V6M10.5 14L8 16.5L10.5 19M13.5 14L16 16.5L13.5 19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="font-bold text-xl tracking-tight">SkillXchange</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4 space-y-2">
            <Link
              to="/home-dashboard"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                isActive("/home-dashboard")
                  ? "text-[#4a3630] bg-[#FBEAA0] font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Home size={20} />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/profile"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                isActive("/profile") ? "text-[#4a3630] bg-[#FBEAA0] font-medium" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <UserCircle size={20} />
              <span>My Profile</span>
            </Link>
            <Link
              to="/my-skills"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                isActive("/my-skills") ? "text-[#4a3630] bg-[#FBEAA0] font-medium" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Brain size={20} />
              <span>My Skills</span>
            </Link>
            <Link
              to="/skill-matches"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                isActive("/skill-matches")
                  ? "text-[#4a3630] bg-[#FBEAA0] font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <RefreshCw size={20} />
              <span>Skill Matches</span>
            </Link>
            <Link
              to="/my-sessions"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                isActive("/my-sessions") ? "text-[#4a3630] bg-[#FBEAA0] font-medium" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Calendar size={20} />
              <span>My Sessions</span>
            </Link>
                     <Link
            to="/connections"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
              isActive("/connections") ? "text-[#4a3630] bg-[#FBEAA0] font-medium" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Users size={20} />
            <span>Connections</span>
          </Link>
            <Link
              to="/messages"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                isActive("/messages") ? "text-[#4a3630] bg-[#FBEAA0] font-medium" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <MessageSquare size={20} />
              <span>Messages</span>
            </Link>
            <Link
              to="/community"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                isActive("/community") ? "text-[#4a3630] bg-[#FBEAA0] font-medium" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 7.52 12 2 7 7.52a5 5 0 0 0 0 6.95c.61.63 1.07 1.43 1.33 2.32.26.9.41 1.83.42 2.78.44-.27.85-.62 1.21-1.04" />
                <path d="M15.71 16.69C14.26 18.16 14 21.6 14 21.6s3.44-.27 4.9-1.73a5 5 0 1 0-3.2-3.18Z" />
              </svg>
              <span>Community</span>
            </Link>
            <Link
              to="/settings"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                isActive("/settings") ? "text-[#4a3630] bg-[#FBEAA0] font-medium" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Settings size={20} />
              <span>Settings</span>
            </Link>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t">
            <button className="flex items-center gap-3 px-4 py-3 w-full text-gray-700 hover:bg-gray-100 rounded-lg">
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
