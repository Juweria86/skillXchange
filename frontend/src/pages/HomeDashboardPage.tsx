import { Link } from "react-router-dom"
import { Search, Bell, ChevronRight, TrendingUp, Megaphone } from "lucide-react"
import AppSidebar from "../components/AppSidebar"
import WelcomePanel from "../components/dashboard/WelcomePanel"
import MatchCard from "../components/dashboard/MatchCard"
import SessionCard from "../components/sessions/SessionCard"
import CommunityCard from "../components/dashboard/CommunityCard"
import Card from "../components/ui/Card"
import Input from "../components/ui/Input"
import Avatar from "../components/ui/Avatar"
import Badge from "../components/ui/Badge"
import Footer from "@/components/layout/Footer"

export default function HomeDashboardPage() {
  return (
    <div className="flex min-h-screen bg-[#FFF7D4]">
      <AppSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div className="relative w-full max-w-md lg:max-w-xs">
              <Input
                type="text"
                placeholder="Search people, skills, or topics..."
                variant="yellow"
                leftIcon={<Search size={18} />}
              />
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-700 hover:bg-gray-100 rounded-full">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                  3
                </span>
              </button>

              <div className="relative group">
                <button className="flex items-center gap-2">
                  <Avatar size="sm" fallback="A" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Profile
                  </Link>
                  <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Settings
                  </Link>
                  <Link to="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Logout
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Welcome Panel */}
            <WelcomePanel userName="Alex" stats={{ teaching: 3, learning: 2, matches: 4, sessions: 2 }} />

            {/* Recommended Skill Matches */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Recommended Skill Matches</h2>
                <Link
                  to="/skill-matches"
                  className="text-[#4a3630] hover:underline text-sm font-medium flex items-center"
                >
                  View all <ChevronRight size={16} />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <MatchCard name="Sarah" matchPercentage={95} wantsToLearn="Python" teaches="Digital Art" />
                <MatchCard
                  name="James"
                  matchPercentage={87}
                  wantsToLearn="Public Speaking"
                  teaches="Project Management"
                />
                <MatchCard name="Michael" isNewMatch wantsToLearn="Guitar" teaches="Web Development" />
              </div>
            </div>

            {/* Two Column Layout for Upcoming Sessions and Community */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Upcoming Sessions */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Upcoming Sessions</h2>
                  <Link
                    to="/my-sessions"
                    className="text-[#4a3630] hover:underline text-sm font-medium flex items-center"
                  >
                    View calendar <ChevronRight size={16} />
                  </Link>
                </div>

                <Card>
                  <SessionCard
                    title="Python Basics with Sarah"
                    date={{ month: "APR", day: 15 }}
                    time="10:00 AM - 11:30 AM"
                    skillName="Python"
                    sessionType="learning"
                  />
                  <SessionCard
                    title="Teaching Web Design to James"
                    date={{ month: "APR", day: 18 }}
                    time="2:00 PM - 3:30 PM"
                    skillName="Web Design"
                    sessionType="teaching"
                  />
                </Card>
              </div>

              {/* Community Highlights & Announcements */}
              <div className="space-y-6">
                {/* Community Highlights */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Community Highlights</h2>
                  </div>

                  <Card>
                    <CommunityCard title="Trending Skills" icon={<TrendingUp size={16} className="text-green-500" />}>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="blue">Machine Learning</Badge>
                        <Badge variant="blue">UX Design</Badge>
                        <Badge variant="blue">Content Creation</Badge>
                      </div>
                    </CommunityCard>

                    <CommunityCard
                      title="Active Discussions"
                      icon={
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
                          className="text-blue-500"
                        >
                          <path d="M17 7.52 12 2 7 7.52a5 5 0 0 0 0 6.95c.61.63 1.07 1.43 1.33 2.32.26.9.41 1.83.42 2.78.44-.27.85-.62 1.21-1.04" />
                          <path d="M15.71 16.69C14.26 18.16 14 21.6 14 21.6s3.44-.27 4.9-1.73a5 5 0 1 0-3.2-3.18Z" />
                        </svg>
                      }
                    >
                      <ul className="space-y-2 text-sm">
                        <li className="hover:text-[#4a3630]">
                          <Link to="/community">Best resources for learning Python in 2023</Link>
                        </li>
                        <li className="hover:text-[#4a3630]">
                          <Link to="/community">How to structure your first teaching session</Link>
                        </li>
                      </ul>
                    </CommunityCard>
                  </Card>
                </div>

                {/* Announcements */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Announcements</h2>
                  </div>

                  <Card>
                    <CommunityCard
                      title="New Feature: Group Sessions"
                      icon={<Megaphone size={16} className="text-[#4a3630]" />}
                    >
                      <p className="text-sm text-gray-600">
                        You can now create group learning sessions with up to 5 participants!
                      </p>
                    </CommunityCard>

                    <CommunityCard
                      title="April Skill Challenge"
                      icon={<Megaphone size={16} className="text-[#4a3630]" />}
                    >
                      <p className="text-sm text-gray-600">
                        Join our monthly challenge and learn a new creative skill to win prizes!
                      </p>
                    </CommunityCard>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  
  )
}
