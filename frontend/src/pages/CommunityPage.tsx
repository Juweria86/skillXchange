"use client"

import { useState, useEffect } from "react"
import { Search, MessageCircle, ThumbsUp, Share2, Plus, Upload, Award, TrendingUp, Filter } from "lucide-react"
import AppSidebar from "../components/AppSidebar"
import PageHeader from "../components/layout/PageHeader"
import Avatar from "@/components/ui/Avatar"
import { discussionService, resourceService, challengeService } from "../services/api"
import CreateDiscussionModal from "../components/community/CreateDiscussionModal"
import ShareResourceModal from "../components/community/ShareResourceModal"

// Custom components
const Card = ({ children, className = "", variant = "default", ...props }) => {
  const variantClasses = variant === "yellow" ? "bg-gradient-to-r from-[#D7E9F7] to-[#E5EFF9]" : "bg-white"
  return (
    <div className={`rounded-lg shadow-md border border-gray-100 ${variantClasses} ${className}`} {...props}>
      {children}
    </div>
  )
}

const Button = ({ children, className = "", variant = "default", size = "default", fullWidth = false, ...props }) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#0C4B93] focus:ring-offset-2"
  const variantClasses =
    variant === "outline"
      ? "border border-[#0C4B93] text-[#0C4B93] hover:bg-[#E5EFF9]"
      : "bg-[#0C4B93] text-white hover:bg-[#064283]"
  const sizeClasses = size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2"
  const widthClasses = fullWidth ? "w-full" : ""

  return (
    <button className={`${baseClasses} ${variantClasses} ${sizeClasses} ${widthClasses} ${className}`} {...props}>
      {children}
    </button>
  )
}

const Input = ({ className = "", variant = "default", leftIcon, ...props }) => (
  <div className="relative">
    {leftIcon && <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">{leftIcon}</div>}
    <input
      className={`w-full ${leftIcon ? "pl-10" : "pl-3"} pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C4B93] focus:border-[#0C4B93] ${className}`}
      {...props}
    />
  </div>
)

const Badge = ({ children, className = "", variant = "default", ...props }) => {
  const variantClasses =
    {
      default: "bg-[#D7E9F7] text-[#0C4B93]",
      blue: "bg-blue-100 text-blue-800",
      green: "bg-green-100 text-green-800",
      yellow: "bg-yellow-100 text-yellow-800",
    }[variant] || "bg-[#D7E9F7] text-[#0C4B93]"

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}

// Tab component for the community page
function CommunityTab({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      className={`py-3 rounded-lg font-medium text-center transition-colors ${
        active ? "bg-[#0C4B93] text-white" : "bg-white text-gray-700 hover:bg-[#E5EFF9] hover:text-[#0C4B93]"
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  )
}

// Discussion card component
function DiscussionCard({ discussion, onLike }: { discussion: any; onLike: (id: string) => void }) {
  return (
    <Card className="mb-4">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start gap-3">
          <Avatar src={discussion.author.avatar} fallback={discussion.author.name} className="w-12 h-12" />
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-[#0C4B93]">{discussion.title}</h3>
                <p className="text-sm text-gray-500">
                  Started by <span className="font-medium">{discussion.author.name}</span> · {discussion.time}
                </p>
              </div>
              <div className="flex items-center gap-1">
                {discussion.tags.map((tag, index) => (
                  <Badge key={index} variant={tag.variant}>
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
            <p className="text-gray-700 mt-3">{discussion.content}</p>
            <div className="flex items-center gap-4 mt-4">
              <button
                className="flex items-center gap-1 text-gray-500 hover:text-[#0C4B93]"
                onClick={() => onLike(discussion.id)}
              >
                <ThumbsUp size={16} />
                <span className="text-sm">{discussion.likes}</span>
              </button>
              <button className="flex items-center gap-1 text-gray-500 hover:text-[#0C4B93]">
                <MessageCircle size={16} />
                <span className="text-sm">{discussion.replies} replies</span>
              </button>
              <button className="flex items-center gap-1 text-gray-500 hover:text-[#0C4B93]">
                <Share2 size={16} />
                <span className="text-sm">Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

// Resource card component
function ResourceCard({ resource, onDownload }: { resource: any; onDownload: (id: string) => void }) {
  const handleAction = () => {
    if (resource.fileUrl) {
      onDownload(resource.id)
    } else if (resource.externalLink) {
      window.open(resource.externalLink, "_blank")
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <div
            className={`w-10 h-10 rounded-lg ${resource.iconBg} flex items-center justify-center ${resource.iconColor}`}
            dangerouslySetInnerHTML={{ __html: resource.icon }}
          ></div>
          <div>
            <h3 className="font-medium text-[#0C4B93]">{resource.title}</h3>
            <p className="text-xs text-gray-500">{resource.type}</p>
          </div>
        </div>
        <p className="text-sm text-gray-700 mb-3">{resource.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar src={resource.author.avatar} fallback={resource.author.name} className="w-6 h-6" />
            <span className="text-xs text-gray-500">{resource.author.name}</span>
          </div>
          <Button size="sm" onClick={handleAction}>
            {resource.buttonText}
          </Button>
        </div>
      </div>
    </Card>
  )
}

// Challenge card component
function ChallengeCard({ challenge, onJoin }: { challenge: any; onJoin: () => void }) {
  return (
    <Card variant="yellow" className="mb-6">
      <div className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#0C4B93] flex items-center justify-center text-white">
            <Award size={32} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-[#0C4B93] mb-2">{challenge.title}</h2>
            <p className="text-gray-700 mb-3">{challenge.description}</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="blue">{challenge.daysRemaining} days remaining</Badge>
              <Badge variant="green">{challenge.participants} participants</Badge>
            </div>
          </div>
          <Button onClick={onJoin}>Join Challenge</Button>
        </div>
      </div>
    </Card>
  )
}

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("discussions")
  const [discussions, setDiscussions] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [resources, setResources] = useState([])
  const [challenges, setChallenges] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [userProgress, setUserProgress] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [category, setCategory] = useState("all")
  const [topic, setTopic] = useState("all")
  const [sort, setSort] = useState("recent")
  const [showDiscussionModal, setShowDiscussionModal] = useState(false)
  const [showResourceModal, setShowResourceModal] = useState(false)

  // Fetch data based on active tab
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        switch (activeTab) {
          case "announcements":
            const announcementsData = await discussionService.getAnnouncements()
            setAnnouncements(announcementsData)
            break

          case "discussions":
            const discussionsData = await discussionService.getDiscussions({ category, sort })
            setDiscussions(discussionsData)
            break

          case "resources":
            const resourcesData = await resourceService.getResources({ topic, sort })
            setResources(resourcesData)
            break

          case "challenges":
            const challengesData = await challengeService.getChallenges()
            setChallenges(challengesData)

            if (challengesData.length > 0) {
              // Get leaderboard for the first challenge
              const leaderboardData = await challengeService.getChallengeLeaderboard(challengesData[0].id)
              setLeaderboard(leaderboardData)

              // Get user's progress for the first challenge
              try {
                const progressData = await challengeService.getChallengeProgress(challengesData[0].id)
                setUserProgress(progressData)
              } catch (err) {
                console.error("Error fetching user progress:", err)
                // Don't set error state here, as the user might not be logged in
              }
            }
            break
        }
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [activeTab, category, topic, sort])

  // Handle like discussion
  const handleLikeDiscussion = async (discussionId) => {
    try {
      const result = await discussionService.likeDiscussion(discussionId)

      // Update discussions state with new like count
      setDiscussions(
        discussions.map((discussion) =>
          discussion.id === discussionId ? { ...discussion, likes: result.likes } : discussion,
        ),
      )
    } catch (err) {
      console.error("Error liking discussion:", err)
    }
  }

  // Handle download resource
  const handleDownloadResource = (resourceId) => {
    resourceService.downloadResource(resourceId)
  }

  // Handle join challenge
  const handleJoinChallenge = async (challengeId) => {
    try {
      await challengeService.joinChallenge(challengeId)

      // Refresh user progress
      const progressData = await challengeService.getChallengeProgress(challengeId)
      setUserProgress(progressData)

      // Update challenges to reflect new participant count
      const challengesData = await challengeService.getChallenges()
      setChallenges(challengesData)
    } catch (err) {
      console.error("Error joining challenge:", err)
    }
  }

  // Handle create discussion
  const handleCreateDiscussion = async (discussionData) => {
    try {
      const newDiscussion = await discussionService.createDiscussion(discussionData)
      setDiscussions([newDiscussion, ...discussions])
      setShowDiscussionModal(false)
    } catch (err) {
      console.error("Error creating discussion:", err)
    }
  }

  // Handle share resource
  const handleShareResource = async (resourceData) => {
    try {
      const newResource = await resourceService.createResource(resourceData)
      setResources([newResource, ...resources])
      setShowResourceModal(false)
    } catch (err) {
      console.error("Error sharing resource:", err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E5EFF9] to-background">
      <div className="flex">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-h-screen">
          <PageHeader title="Community Hub" backTo="/home-dashboard">
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Search community..."
                leftIcon={<Search size={16} />}
                className="w-48 md:w-64"
              />
            </div>
          </PageHeader>

          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <div className="max-w-5xl mx-auto">
              {/* Tabs */}
              <Card className="mb-6 p-1">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
                  <CommunityTab
                    active={activeTab === "announcements"}
                    label="Announcements"
                    onClick={() => setActiveTab("announcements")}
                  />
                  <CommunityTab
                    active={activeTab === "discussions"}
                    label="Discussions"
                    onClick={() => setActiveTab("discussions")}
                  />
                  <CommunityTab
                    active={activeTab === "resources"}
                    label="Resources"
                    onClick={() => setActiveTab("resources")}
                  />
                  <CommunityTab
                    active={activeTab === "challenges"}
                    label="Challenges"
                    onClick={() => setActiveTab("challenges")}
                  />
                </div>
              </Card>

              {/* Loading state */}
              {loading && (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0C4B93]"></div>
                </div>
              )}

              {/* Error state */}
              {error && (
                <Card className="p-6 text-center">
                  <div className="text-red-500 mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mx-auto"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-[#0C4B93] mb-2">Error Loading Data</h3>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <Button onClick={() => window.location.reload()}>Try Again</Button>
                </Card>
              )}

              {/* Tab Content */}
              {!loading && !error && (
                <>
                  {activeTab === "announcements" && (
                    <div className="space-y-4">
                      {announcements.length > 0 ? (
                        announcements.map((announcement) => (
                          <Card key={announcement.id} className="mb-4">
                            <div className="p-6 border-b border-gray-100">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-[#0C4B93] flex items-center justify-center text-white">
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
                                </div>
                                <div>
                                  <h3 className="font-bold text-[#0C4B93]">{announcement.author.name}</h3>
                                  <p className="text-sm text-gray-500">{announcement.time}</p>
                                </div>
                              </div>
                              <h2 className="text-xl font-bold text-[#0C4B93] mb-3">{announcement.title}</h2>
                              <p className="text-gray-700 mb-4">{announcement.content}</p>
                              <div className="flex items-center gap-4 mt-6">
                                <Button>Learn More</Button>
                                <Button variant="outline">Try It Now</Button>
                              </div>
                            </div>
                          </Card>
                        ))
                      ) : (
                        <Card className="p-6 text-center">
                          <p className="text-gray-600">No announcements available at this time.</p>
                        </Card>
                      )}
                    </div>
                  )}

                  {activeTab === "discussions" && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                          <button className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg shadow-sm">
                            <Filter size={16} />
                            <span className="text-sm">Filter</span>
                          </button>
                          <select
                            className="px-3 py-1.5 bg-white rounded-lg shadow-sm text-sm border-none focus:ring-2 focus:ring-[#0C4B93]"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                          >
                            <option value="all">All Categories</option>
                            <option value="tech">Tech</option>
                            <option value="design">Design</option>
                            <option value="language">Language</option>
                            <option value="soft-skills">Soft Skills</option>
                          </select>
                        </div>
                        <Button onClick={() => setShowDiscussionModal(true)}>
                          <Plus size={16} className="mr-2" />
                          Start Discussion
                        </Button>
                      </div>

                      {discussions.length > 0 ? (
                        discussions.map((discussion) => (
                          <DiscussionCard key={discussion.id} discussion={discussion} onLike={handleLikeDiscussion} />
                        ))
                      ) : (
                        <Card className="p-6 text-center">
                          <p className="text-gray-600">No discussions found. Start a new discussion!</p>
                        </Card>
                      )}
                    </div>
                  )}

                  {activeTab === "resources" && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                          <select
                            className="px-3 py-1.5 bg-white rounded-lg shadow-sm text-sm border-none focus:ring-2 focus:ring-[#0C4B93]"
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                          >
                            <option value="recent">Most Recent</option>
                            <option value="popular">Most Popular</option>
                          </select>
                          <select
                            className="px-3 py-1.5 bg-white rounded-lg shadow-sm text-sm border-none focus:ring-2 focus:ring-[#0C4B93]"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                          >
                            <option value="all">All Topics</option>
                            <option value="programming">Programming</option>
                            <option value="design">Design</option>
                            <option value="business">Business</option>
                          </select>
                        </div>
                        <Button onClick={() => setShowResourceModal(true)}>
                          <Upload size={16} className="mr-2" />
                          Share Resource
                        </Button>
                      </div>

                      {resources.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {resources.map((resource) => (
                            <ResourceCard key={resource.id} resource={resource} onDownload={handleDownloadResource} />
                          ))}
                        </div>
                      ) : (
                        <Card className="p-6 text-center">
                          <p className="text-gray-600">No resources found. Share a resource to get started!</p>
                        </Card>
                      )}
                    </div>
                  )}

                  {activeTab === "challenges" && (
                    <div className="space-y-6">
                      {challenges.length > 0 ? (
                        <>
                          <ChallengeCard
                            challenge={challenges[0]}
                            onJoin={() => handleJoinChallenge(challenges[0].id)}
                          />

                          <Card>
                            <div className="p-6 border-b border-gray-200">
                              <h3 className="text-lg font-bold text-[#0C4B93] mb-4">Current Leaderboard</h3>
                              <div className="space-y-4">
                                {leaderboard.map((entry, index) => (
                                  <div key={entry.user.id} className="flex items-center gap-3">
                                    <div
                                      className={`w-8 h-8 rounded-full ${index === 0 ? "bg-yellow-100 text-yellow-600" : "bg-gray-100 text-gray-600"} flex items-center justify-center font-bold`}
                                    >
                                      {entry.rank}
                                    </div>
                                    <Avatar
                                      src={entry.user.avatar}
                                      fallback={entry.user.name.charAt(0)}
                                      className="w-12 h-12"
                                    />
                                    <div className="flex-1">
                                      <h4 className="font-medium text-[#0C4B93]">{entry.user.name}</h4>
                                      <p className="text-xs text-gray-500">
                                        {entry.sessionsCompleted} sessions completed
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <TrendingUp size={16} className="text-green-500" />
                                      <span className="text-sm font-medium text-green-500">
                                        +{Math.floor(Math.random() * 3)}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </Card>

                          {userProgress && (
                            <Card>
                              <div className="p-6">
                                <h3 className="text-lg font-bold text-[#0C4B93] mb-4">Your Progress</h3>
                                <div className="mb-4">
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-gray-700">Sessions Completed</span>
                                    <span className="text-sm font-medium text-[#0C4B93]">
                                      {userProgress.sessionsCompleted}/{userProgress.requiredSessions}
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                      className="bg-[#0C4B93] h-2.5 rounded-full"
                                      style={{ width: `${userProgress.progress}%` }}
                                    ></div>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-700 mb-4">
                                  {userProgress.sessionsCompleted >= userProgress.requiredSessions
                                    ? "Congratulations! You've completed the challenge requirements."
                                    : `Complete ${userProgress.requiredSessions - userProgress.sessionsCompleted} more sessions to earn the challenge badge and enter the prize drawing!`}
                                </p>
                                <Button fullWidth>Find a Session</Button>
                              </div>
                            </Card>
                          )}
                        </>
                      ) : (
                        <Card className="p-6 text-center">
                          <p className="text-gray-600">No active challenges at this time. Check back soon!</p>
                        </Card>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Create Discussion Modal */}
      {showDiscussionModal && (
        <CreateDiscussionModal onClose={() => setShowDiscussionModal(false)} onSubmit={handleCreateDiscussion} />
      )}

      {/* Share Resource Modal */}
      {showResourceModal && (
        <ShareResourceModal onClose={() => setShowResourceModal(false)} onSubmit={handleShareResource} />
      )}
    </div>
  )
}
