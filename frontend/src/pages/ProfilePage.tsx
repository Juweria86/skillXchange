"use client"

import { useEffect } from "react"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../app/store"
import { getUserProfile } from "../features/user/userSlice"
import { MapPin, User, Edit, Calendar, Star, ExternalLink, ChevronLeft } from "lucide-react"
import AppSidebar from "../components/AppSidebar"
import Avatar from "@/components/ui/Avatar"
import { getFullImageUrl } from "@/utils/getFullImageUrl"

// Custom components
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

const CardHeader = ({ children, className = "", ...props }) => (
  <div className={`p-6 pb-4 ${className}`} {...props}>
    {children}
  </div>
)

const CardTitle = ({ children, className = "", ...props }) => (
  <h3 className={`text-lg font-semibold text-[#0C4B93] ${className}`} {...props}>
    {children}
  </h3>
)

const CardDescription = ({ children, className = "", ...props }) => (
  <p className={`text-sm text-gray-600 ${className}`} {...props}>
    {children}
  </p>
)

const Badge = ({ children, className = "", variant = "default", ...props }) => {
  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
  const variantClasses =
    variant === "outline"
      ? "border border-[#0C4B93] text-[#0C4B93]"
      : variant === "secondary"
        ? "bg-white/20 text-white hover:bg-white/30"
        : "bg-[#D7E9F7] text-[#0C4B93]"

  return (
    <span className={`${baseClasses} ${variantClasses} ${className}`} {...props}>
      {children}
    </span>
  )
}

const Button = ({ children, className = "", asChild = false, ...props }) => {
  const Component = asChild ? "div" : "button"
  return (
    <Component
      className={`inline-flex items-center justify-center px-4 py-2 bg-[#0C4B93] text-white rounded-lg hover:bg-[#064283] transition-colors ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}

export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>()
  const { profile, loading } = useSelector((state: RootState) => state.user)
  const token = localStorage.getItem("token")

  useEffect(() => {
    if (token) {
      dispatch(getUserProfile(token))
    }
  }, [dispatch, token])

  const formatTime = (timeStr: string) => {
    if (!timeStr) return ""
    const [hour, minute] = timeStr.split(":")
    const hourNum = Number.parseInt(hour)
    const ampm = hourNum >= 12 ? "PM" : "AM"
    const formattedHour = ((hourNum + 11) % 12) + 1
    return `${formattedHour}:${minute} ${ampm}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#E5EFF9] to-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#0C4B93] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-[#0C4B93] font-medium">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#E5EFF9] to-background flex items-center justify-center">
        <Card className="max-w-md w-full border-none shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-[#D7E9F7] rounded-full flex items-center justify-center mx-auto mb-4">
              <User size={40} className="text-[#0C4B93]" />
            </div>
            <CardTitle className="text-xl text-[#0C4B93] mb-2">Profile Not Found</CardTitle>
            <CardDescription className="mb-6">We couldn't find your profile information.</CardDescription>
            <Button asChild className="bg-[#0C4B93] hover:bg-[#064283]">
              <Link to="/edit-profile">Create Your Profile</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E5EFF9] to-background flex">
    {/* Sidebar */}
    <div className="fixed top-0 left-0 h-full w-64 z-30">
      <AppSidebar />
    </div>

    {/* Main content wrapper */}
    <div className="flex-1 flex flex-col ml-0 lg:ml-64">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            to="/home-dashboard"
            className="inline-flex items-center text-[#0C4B93] hover:text-[#064283] font-medium"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Dashboard
          </Link>
          <Button asChild className="bg-[#0C4B93] hover:bg-[#064283]">
            <Link to="/edit-profile">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Link>
          </Button>
        </div>
      </header>



        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Hero Section */}
            <Card className="border-none shadow-lg bg-gradient-to-r from-[#0C4B93] to-[#106CC8] text-white overflow-hidden">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <Avatar
                    src={getFullImageUrl(profile.profileImage) || "/placeholder.svg"}
                    fallback={profile.name?.charAt(0) || "U"}
                    className="w-32 h-32 border-4 border-white/20"
                  />

                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-4 text-blue-100">
                      <MapPin size={16} />
                      <span>{profile.location || "Location not specified"}</span>
                    </div>

                    {profile.skillsICanTeach?.length > 0 && (
                      <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                        {profile.skillsICanTeach.slice(0, 4).map((skill: any) => (
                          <Badge
                            key={skill._id}
                            variant="secondary"
                            className="bg-white/20 text-white hover:bg-white/30"
                          >
                            {skill.name}
                          </Badge>
                        ))}
                        {profile.skillsICanTeach.length > 4 && (
                          <Badge variant="secondary" className="bg-white/20 text-white">
                            +{profile.skillsICanTeach.length - 4} more
                          </Badge>
                        )}
                      </div>
                    )}

                    <p className="text-blue-100 leading-relaxed">{profile.bio || "No bio provided yet."}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Teaching Skills */}
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-[#0C4B93] flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#D7E9F7] rounded-full flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    Skills I Can Teach
                  </CardTitle>
                  <CardDescription>
                    {profile.skillsICanTeach?.length || 0} skills available for teaching
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {profile.skillsICanTeach?.length ? (
                    <div className="space-y-4">
                      {profile.skillsICanTeach.map((skill: any) => (
                        <div key={skill._id} className="flex items-center justify-between p-3 bg-[#E5EFF9] rounded-lg">
                          <div>
                            <h4 className="font-medium text-[#0C4B93]">{skill.name}</h4>
                            {skill.experience && <p className="text-sm text-gray-600">{skill.experience}</p>}
                          </div>
                          <Badge className="bg-[#D7E9F7] text-[#0C4B93] hover:bg-[#D7E9F7]">
                            {skill.level || "N/A"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No teaching skills added yet.</p>
                  )}
                </CardContent>
              </Card>

              {/* Learning Skills */}
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-[#0C4B93] flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#E5EFF9] rounded-full flex items-center justify-center">
                      <Star className="w-4 h-4" />
                    </div>
                    Skills I Want to Learn
                  </CardTitle>
                  <CardDescription>
                    {profile.skillsIWantToLearn?.length || 0} skills on learning wishlist
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {profile.skillsIWantToLearn?.length ? (
                    <div className="space-y-4">
                      {profile.skillsIWantToLearn.map((skill: any) => (
                        <div key={skill._id} className="flex items-center justify-between p-3 bg-[#D7E9F7] rounded-lg">
                          <div>
                            <h4 className="font-medium text-[#0C4B93]">{skill.name}</h4>
                            {skill.goal && <p className="text-sm text-gray-600">{skill.goal}</p>}
                          </div>
                          <Badge variant="outline" className="border-[#0C4B93] text-[#0C4B93]">
                            {skill.level || "N/A"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No learning goals added yet.</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* About & Achievements */}
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="text-[#0C4B93]">About & Achievements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-[#0C4B93] mb-3">About Me</h3>
                  <p className="text-gray-700 leading-relaxed">{profile.bio || "No bio provided yet."}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-[#0C4B93] mb-3">Achievements</h3>
                  {profile.achievements?.length ? (
                    <div className="space-y-3">
                      {profile.achievements.map((achievement: { title: string; description?: string }, i: number) => (
                        <div key={i} className="p-4 bg-[#E5EFF9] rounded-lg">
                          <h4 className="font-medium text-[#0C4B93] mb-1">{achievement.title}</h4>
                          {achievement.description && (
                            <p className="text-sm text-gray-600">{achievement.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No achievements listed yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Availability & Social Links */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Availability */}
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-[#0C4B93] flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Availability
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {profile.availability?.length ? (
                    <div className="space-y-3">
                      {profile.availability.map((slot: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-[#E5EFF9] rounded-lg">
                          <span className="font-medium text-[#0C4B93]">{slot.day}</span>
                          <span className="text-sm text-gray-600">
                            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No availability set.</p>
                  )}
                </CardContent>
              </Card>

              {/* Social Links */}
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-[#0C4B93] flex items-center gap-2">
                    <ExternalLink className="w-5 h-5" />
                    Social Links
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {profile.socialLinks && Object.keys(profile.socialLinks).length > 0 ? (
                    <div className="space-y-3">
                      {Object.entries(profile.socialLinks).map(([platform, url]) => (
                        <a
                          key={platform}
                          href={url as string}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 bg-[#E5EFF9] rounded-lg hover:bg-[#D7E9F7] transition-colors"
                        >
                          <span className="font-medium text-[#0C4B93] capitalize">{platform}</span>
                          <ExternalLink className="w-4 h-4 text-gray-500" />
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No social links added.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
