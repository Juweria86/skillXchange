"use client"

import { useQuery } from "@tanstack/react-query"
import { getUserStats, getUserSessions, getSkillMatches, getAnnouncements } from "../services/dashboardService"
import { Skeleton } from "@/components/ui/Skeleton"
import {
  Search,
  Bell,
  ChevronRight,
  TrendingUp,
  Users,
  Calendar,
  BookOpen,
  MapPin,
  UserPlus,
  Video,
} from "lucide-react"
import Avatar from "@/components/ui/Avatar"
import React from "react"

// Custom components to replace shadcn ones
const Card = ({ children, className = "", ...props }) => (
  <div className={`bg-white rounded-lg shadow-md border border-gray-100 ${className}`} {...props}>
    {children}
  </div>
)

const CardContent = ({ children, className = "", ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
)

const Badge = ({ children, className = "", variant = "default", ...props }) => {
  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
  const variantClasses = variant === "outline" ? "border border-gray-300 text-gray-700" : "bg-[#D7E9F7] text-[#0C4B93]"

  return (
    <span className={`${baseClasses} ${variantClasses} ${className}`} {...props}>
      {children}
    </span>
  )
}

const Input = ({ className = "", ...props }) => (
  <input
    className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C4B93] focus:border-[#0C4B93] ${className}`}
    {...props}
  />
)

const Button = ({ children, className = "", variant = "default", size = "default", ...props }) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#0C4B93] focus:ring-offset-2"
  const variantClasses =
    variant === "outline"
      ? "border border-[#0C4B93] text-[#0C4B93] hover:bg-[#E5EFF9]"
      : "bg-[#0C4B93] text-white hover:bg-[#064283]"
  const sizeClasses = size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2"

  return (
    <button className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`} {...props}>
      {children}
    </button>
  )
}

// Skill Card Component
function SkillCard({ skill, type }) {
  return (
    <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-sm font-semibold text-[#0C4B93]">{skill}</h3>
          <Badge className="bg-[#D7E9F7] text-[#0C4B93] hover:bg-[#D7E9F7]">
            {type === "teaching" ? "Teaching" : "Learning"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

// Match Card Component
function MatchCard({ match }) {
  return (
    <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar src={match.avatar || "/placeholder.svg"} fallback={match.name.charAt(0)} className="w-10 h-10" />

          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-[#0C4B93] text-sm">{match.name}</h3>
                <div className="flex items-center text-gray-500 text-xs mt-1">
                  <MapPin size={10} className="mr-1" />
                  <span>{match.location}</span>
                </div>
              </div>
              <Badge
                className={
                  match.match >= 90
                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                    : match.match >= 80
                      ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                      : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                }
              >
                {match.match}%
              </Badge>
            </div>

            <div className="space-y-2 mb-3">
              <div>
                <span className="text-xs font-medium text-[#0C4B93] block mb-1">Teaches:</span>
                <div className="flex flex-wrap gap-1">
                  {match.teaches.slice(0, 2).map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="text-xs bg-[#D7E9F7] text-[#0C4B93] hover:bg-[#D7E9F7]"
                    >
                      {skill}
                    </Badge>
                  ))}
                  {match.teaches.length > 2 && (
                    <span className="text-xs text-gray-500">+{match.teaches.length - 2} more</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-1">
              <Button size="sm" className="bg-[#0C4B93] hover:bg-[#064283] text-xs px-2 py-1">
                <UserPlus size={10} className="mr-1" />
                Connect
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-[#0C4B93] text-[#0C4B93] hover:bg-[#E5EFF9] text-xs px-2 py-1"
              >
                View
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Session Card Component
function SessionCard({ session }) {
  const sessionDate = session.date ? new Date(session.date) : new Date(session.startTime)

  return (
    <Card className="border-none shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="text-center">
            <div className="w-10 h-10 bg-[#D7E9F7] rounded-lg flex flex-col items-center justify-center">
              <span className="text-xs font-medium text-[#0C4B93]">
                {sessionDate.toLocaleString("default", { month: "short" }).toUpperCase()}
              </span>
              <span className="text-sm font-bold text-[#0C4B93]">{sessionDate.getDate()}</span>
            </div>
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-[#0C4B93] text-sm mb-1">
              {session.title || session.skill?.name || "Session"}
            </h3>
            <p className="text-xs text-gray-600 mb-2">
              {session.startTime} - {session.endTime}
            </p>

            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <Video size={10} />
              <span>{session.type || "Online"}</span>
            </div>

            <Badge variant="outline" className="text-xs">
              {session.status || "Scheduled"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Announcement Card Component
function AnnouncementCard({ announcement }) {
  return (
    <Card className="border-none shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-[#E5EFF9] rounded-full flex items-center justify-center flex-shrink-0">
            <Bell className="w-4 h-4 text-[#0C4B93]" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-sm mb-1">{announcement.title}</h3>
            <p className="text-gray-600 text-xs mb-2 line-clamp-2">{announcement.content}</p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>By {announcement.author?.name}</span>
              <span>{announcement.time}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function HomeDashboardPage() {
  // Fetch dashboard stats
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ["userStats"],
    queryFn: getUserStats,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  })

  // Fetch sessions
  const { data: sessions = [], isLoading: sessionsLoading } = useQuery({
    queryKey: ["userSessions"],
    queryFn: getUserSessions,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  })

  // Fetch matches
  const { data: matches = [], isLoading: matchesLoading } = useQuery({
    queryKey: ["skillMatches"],
    queryFn: getSkillMatches,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  })

  // Fetch announcements
  const { data: announcements = [], isLoading: announcementsLoading } = useQuery({
    queryKey: ["announcements"],
    queryFn: getAnnouncements,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  })

  const isLoading = statsLoading || sessionsLoading || matchesLoading || announcementsLoading

  // Get data from API response
  const userData = stats?.data
  const teachingSkills = userData?.skills?.teaching || []
  const learningSkills = userData?.skills?.learning || []
  const topMatches = matches.slice(0, 3)
  const upcomingSessions = sessions
    .filter((session) => {
      const sessionDate = new Date(session.date || session.startTime)
      return sessionDate > new Date()
    })
    .slice(0, 2)
  const recentAnnouncements = announcements.slice(0, 2)

  React.useEffect(() => {
    if (userData) {
      console.log("Dashboard data loaded:", {
        user: userData.user,
        general: userData.general,
        skills: userData.skills,
        sessions: sessions.length,
        matches: matches.length,
        announcements: announcements.length,
      })
    }
  }, [userData, sessions, matches, announcements])

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 bg-gradient-to-b from-[#E5EFF9] to-background min-h-screen">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <div className="flex gap-4">
            <Skeleton className="h-20 flex-1" />
            <Skeleton className="h-20 flex-1" />
            <Skeleton className="h-20 flex-1" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    )
  }

  if (statsError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#E5EFF9] to-background flex items-center justify-center p-8">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold text-red-600 mb-2">Failed to load dashboard data</h2>
            <p className="text-gray-600 mb-4">{statsError.message || "Please try again later"}</p>
            <Button onClick={() => refetchStats()} className="mr-2">
              Retry
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E5EFF9] to-background">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 border-b border-gray-100">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search skills, people, or sessions..."
                className="pl-10 border-gray-200 focus:border-[#0C4B93] focus:ring-[#0C4B93]"
              />
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-700 hover:bg-[#E5EFF9] rounded-full transition-colors">
                <Bell size={20} />
                {userData?.general?.announcementsCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {userData.general.announcementsCount}
                  </span>
                )}
              </button>
              <Avatar src={userData?.user?.avatar} fallback={userData?.user?.name?.charAt(0) || "U"} size="sm" />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Welcome Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="border-none shadow-lg bg-gradient-to-r from-[#0C4B93] to-[#106CC8] text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h1 className="text-2xl font-bold mb-2">Welcome back, {userData?.user?.name || "User"}!</h1>
                        <p className="text-blue-100 mb-4">Ready to exchange some skills today?</p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            <span>{teachingSkills.length} skills to teach</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            <span>{learningSkills.length} skills to learn</span>
                          </div>
                        </div>
                      </div>
                      <div className="hidden md:block">
                        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                          <Users className="w-12 h-12 text-white" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card className="border-none shadow-md">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-[#0C4B93] mb-1">{userData?.general?.matchCount || 0}</div>
                    <p className="text-sm text-gray-600">Available Matches</p>
                  </CardContent>
                </Card>
                <Card className="border-none shadow-md">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-[#0C4B93] mb-1">
                      {userData?.general?.upcomingSessions || 0}
                    </div>
                    <p className="text-sm text-gray-600">Upcoming Sessions</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border-none shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-[#D7E9F7] rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-[#0C4B93]" />
                  </div>
                  <h3 className="font-semibold text-[#0C4B93] mb-1">Find Matches</h3>
                  <p className="text-xs text-gray-600">Discover skill partners</p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-[#E5EFF9] rounded-full flex items-center justify-center mx-auto mb-3">
                    <Calendar className="w-6 h-6 text-[#0C4B93]" />
                  </div>
                  <h3 className="font-semibold text-[#0C4B93] mb-1">Schedule Session</h3>
                  <p className="text-xs text-gray-600">Book a learning session</p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-[#D7E9F7] rounded-full flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="w-6 h-6 text-[#0C4B93]" />
                  </div>
                  <h3 className="font-semibold text-[#0C4B93] mb-1">My Skills</h3>
                  <p className="text-xs text-gray-600">Manage your skills</p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-[#E5EFF9] rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-6 h-6 text-[#0C4B93]" />
                  </div>
                  <h3 className="font-semibold text-[#0C4B93] mb-1">Progress</h3>
                  <p className="text-xs text-gray-600">Track your growth</p>
                </CardContent>
              </Card>
            </div>

            {/* Skills I Can Teach */}
            {teachingSkills.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-[#0C4B93]">Skills I Can Teach</h2>
                    <p className="text-gray-600">Share your expertise with others</p>
                  </div>
                  <button className="text-[#0C4B93] hover:text-[#064283] font-medium flex items-center gap-1 hover:underline">
                    View all <ChevronRight size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {teachingSkills.slice(0, 3).map((skill, index) => (
                    <SkillCard key={index} skill={skill} type="teaching" />
                  ))}
                </div>
              </div>
            )}

            {/* Skills I Want to Learn */}
            {learningSkills.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-[#0C4B93]">Skills I Want to Learn</h2>
                    <p className="text-gray-600">Expand your knowledge</p>
                  </div>
                  <button className="text-[#0C4B93] hover:text-[#064283] font-medium flex items-center gap-1 hover:underline">
                    View all <ChevronRight size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {learningSkills.slice(0, 3).map((skill, index) => (
                    <SkillCard key={index} skill={skill} type="learning" />
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Matches */}
            {topMatches.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-[#0C4B93]">Recommended Matches</h2>
                    <p className="text-gray-600">People who can help you learn new skills</p>
                  </div>
                  <button className="text-[#0C4B93] hover:text-[#064283] font-medium flex items-center gap-1 hover:underline">
                    View all <ChevronRight size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {topMatches.map((match) => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming Sessions */}
            {upcomingSessions.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-[#0C4B93]">Upcoming Sessions</h2>
                    <p className="text-gray-600">Your scheduled learning and teaching sessions</p>
                  </div>
                  <button className="text-[#0C4B93] hover:text-[#064283] font-medium flex items-center gap-1 hover:underline">
                    View calendar <ChevronRight size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {upcomingSessions.map((session) => (
                    <SessionCard key={session._id} session={session} />
                  ))}
                </div>
              </div>
            )}

            {/* Community Updates */}
            {recentAnnouncements.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-[#0C4B93]">Community Updates</h2>
                    <p className="text-gray-600">Latest news and announcements</p>
                  </div>
                  <button className="text-[#0C4B93] hover:text-[#064283] font-medium flex items-center gap-1 hover:underline">
                    View all <ChevronRight size={16} />
                  </button>
                </div>
                <div className="space-y-4">
                  {recentAnnouncements.map((announcement) => (
                    <AnnouncementCard key={announcement.id} announcement={announcement} />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!userData && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-[#E5EFF9] rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-12 h-12 text-[#0C4B93]" />
                </div>
                <h3 className="text-xl font-bold text-[#0C4B93] mb-2">Get Started with SkillSwap</h3>
                <p className="text-gray-600 mb-6">Add your skills and start connecting with other learners</p>
                <div className="flex justify-center gap-4">
                  <Button className="bg-[#0C4B93] hover:bg-[#064283]">Add Skills</Button>
                  <Button variant="outline" className="border-[#0C4B93] text-[#0C4B93] hover:bg-[#E5EFF9]">
                    Find Matches
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
