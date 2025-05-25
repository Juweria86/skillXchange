"use client"

import { Link, useLocation } from "react-router-dom"
import {
  Home,
  UserCircle,
  Brain,
  RefreshCw,
  Calendar,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
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
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#0C4B93] text-white shadow-lg hover:bg-[#106CC8] transition-colors duration-200"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Desktop Sidebar Toggle - Only show when sidebar is closed */}
      {!sidebarOpen && (
        <button
          className="hidden lg:block fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#0C4B93] text-white shadow-lg hover:bg-[#106CC8] transition-colors duration-200"
          onClick={() => setSidebarOpen(true)}
        >
          <ChevronRight size={20} />
        </button>
      )}

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white shadow-xl transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:-translate-x-full"
        } transition-transform duration-300 ease-in-out border-r border-[#B8D4F0]`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section with Close Button */}
          <div className="p-6 border-b border-[#B8D4F0] bg-white">
            <div className="flex items-center justify-between">
              <Link to="/home-dashboard" className="flex items-center gap-3 group">
                <div className="bg-gradient-to-br from-[#0C4B93] to-[#106CC8] text-white p-3 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-200">
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
                <div>
                  <span className="font-bold text-xl text-gray-900 tracking-tight">SkillXchange</span>
                  <p className="text-xs text-gray-600 opacity-80">Learn & Teach Together</p>
                </div>
              </Link>

              {/* Desktop Close Button */}
              <button
                className="hidden lg:flex p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                onClick={() => setSidebarOpen(false)}
                title="Close sidebar"
              >
                <ChevronLeft size={20} />
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider px-3 mb-2">Main Menu</p>
            </div>

            <Link
              to="/home-dashboard"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive("/home-dashboard")
                  ? "text-gray-900 bg-white shadow-md font-semibold border border-[#B8D4F0]"
                  : "text-gray-700 hover:bg-white/60 hover:text-gray-900 hover:shadow-sm"
              }`}
            >
              <Home size={20} />
              <span>Dashboard</span>
              {isActive("/home-dashboard") && <div className="ml-auto w-2 h-2 bg-[#0C4B93] rounded-full"></div>}
            </Link>

            <Link
              to="/profile"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive("/profile")
                  ? "text-gray-900 bg-white shadow-md font-semibold border border-[#B8D4F0]"
                  : "text-gray-700 hover:bg-white/60 hover:text-gray-900 hover:shadow-sm"
              }`}
            >
              <UserCircle size={20} />
              <span>My Profile</span>
              {isActive("/profile") && <div className="ml-auto w-2 h-2 bg-[#0C4B93] rounded-full"></div>}
            </Link>

            <Link
              to="/my-skills"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive("/my-skills")
                  ? "text-gray-900 bg-white shadow-md font-semibold border border-[#B8D4F0]"
                  : "text-gray-700 hover:bg-white/60 hover:text-gray-900 hover:shadow-sm"
              }`}
            >
              <Brain size={20} />
              <span>My Skills</span>
              {isActive("/my-skills") && <div className="ml-auto w-2 h-2 bg-[#0C4B93] rounded-full"></div>}
            </Link>

            <Link
              to="/skill-matches"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive("/skill-matches")
                  ? "text-gray-900 bg-white shadow-md font-semibold border border-[#B8D4F0]"
                  : "text-gray-700 hover:bg-white/60 hover:text-gray-900 hover:shadow-sm"
              }`}
            >
              <RefreshCw size={20} />
              <span>Skill Matches</span>
              {isActive("/skill-matches") && <div className="ml-auto w-2 h-2 bg-[#0C4B93] rounded-full"></div>}
            </Link>

            <Link
              to="/my-sessions"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive("/my-sessions")
                  ? "text-gray-900 bg-white shadow-md font-semibold border border-[#B8D4F0]"
                  : "text-gray-700 hover:bg-white/60 hover:text-gray-900 hover:shadow-sm"
              }`}
            >
              <Calendar size={20} />
              <span>My Sessions</span>
              {isActive("/my-sessions") && <div className="ml-auto w-2 h-2 bg-[#0C4B93] rounded-full"></div>}
            </Link>

            <div className="my-4">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider px-3 mb-2">Social</p>
            </div>

            <Link
              to="/connections"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive("/connections")
                  ? "text-gray-900 bg-white shadow-md font-semibold border border-[#B8D4F0]"
                  : "text-gray-700 hover:bg-white/60 hover:text-gray-900 hover:shadow-sm"
              }`}
            >
              <Users size={20} />
              <span>Connections</span>
              {isActive("/connections") && <div className="ml-auto w-2 h-2 bg-[#0C4B93] rounded-full"></div>}
            </Link>

            <Link
              to="/messages"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive("/messages")
                  ? "text-gray-900 bg-white shadow-md font-semibold border border-[#B8D4F0]"
                  : "text-gray-700 hover:bg-white/60 hover:text-gray-900 hover:shadow-sm"
              }`}
            >
              <MessageSquare size={20} />
              <span>Messages</span>
              {isActive("/messages") && <div className="ml-auto w-2 h-2 bg-[#0C4B93] rounded-full"></div>}
            </Link>

            <Link
              to="/community"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive("/community")
                  ? "text-gray-900 bg-white shadow-md font-semibold border border-[#B8D4F0]"
                  : "text-gray-700 hover:bg-white/60 hover:text-gray-900 hover:shadow-sm"
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
              {isActive("/community") && <div className="ml-auto w-2 h-2 bg-[#0C4B93] rounded-full"></div>}
            </Link>

            <div className="my-4">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider px-3 mb-2">Account</p>
            </div>

            <Link
              to="/settings"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive("/settings")
                  ? "text-gray-900 bg-white shadow-md font-semibold border border-[#B8D4F0]"
                  : "text-gray-700 hover:bg-white/60 hover:text-gray-900 hover:shadow-sm"
              }`}
            >
              <Settings size={20} />
              <span>Settings</span>
              {isActive("/settings") && <div className="ml-auto w-2 h-2 bg-[#0C4B93] rounded-full"></div>}
            </Link>
          </nav>

          {/* Logout Section */}
          <div className="p-4 border-t border-[#B8D4F0] bg-white">
            <button className="flex items-center gap-3 px-4 py-3 w-full text-gray-700 hover:bg-white/60 hover:text-gray-900 rounded-xl transition-all duration-200 hover:shadow-sm">
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
