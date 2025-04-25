"use client"

import { useState } from "react"
import { Search, MessageCircle, ThumbsUp, Share2, Plus, Upload, Award, TrendingUp, Filter } from "lucide-react"
import AppSidebar from "../components/AppSidebar"
import PageHeader from "../components/layout/PageHeader"
import Card from "../components/ui/Card"
import Input from "../components/ui/Input"
import Button from "../components/ui/Button"
import Badge from "../components/ui/Badge"
import Avatar from "../components/ui/Avatar"

// Tab component for the community page
function CommunityTab({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      className={`py-3 rounded-lg font-medium text-center transition-colors ${
        active ? "bg-[#FBEAA0] text-[#4a3630]" : "bg-white text-gray-700 hover:bg-gray-100"
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  )
}

// Discussion card component
function DiscussionCard({ discussion }: { discussion: any }) {
  return (
    <Card className="mb-4">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start gap-3">
          <Avatar src={discussion.author.avatar} size="md" fallback={discussion.author.name} />
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-gray-900">{discussion.title}</h3>
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
              <button className="flex items-center gap-1 text-gray-500 hover:text-[#4a3630]">
                <ThumbsUp size={16} />
                <span className="text-sm">{discussion.likes}</span>
              </button>
              <button className="flex items-center gap-1 text-gray-500 hover:text-[#4a3630]">
                <MessageCircle size={16} />
                <span className="text-sm">{discussion.replies} replies</span>
              </button>
              <button className="flex items-center gap-1 text-gray-500 hover:text-[#4a3630]">
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
function ResourceCard({ resource }: { resource: any }) {
  return (
    <Card className="overflow-hidden">
      <div className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <div
            className={`w-10 h-10 rounded-lg ${resource.iconBg} flex items-center justify-center ${resource.iconColor}`}
          >
            {resource.icon}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{resource.title}</h3>
            <p className="text-xs text-gray-500">{resource.type}</p>
          </div>
        </div>
        <p className="text-sm text-gray-700 mb-3">{resource.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar src={resource.author.avatar} size="xs" fallback={resource.author.name} />
            <span className="text-xs text-gray-500">{resource.author.name}</span>
          </div>
          <Button variant="primary" size="sm">
            {resource.buttonText}
          </Button>
        </div>
      </div>
    </Card>
  )
}

// Challenge card component
function ChallengeCard() {
  return (
    <Card variant="yellow" className="mb-6">
      <div className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#4a3630] flex items-center justify-center text-white">
            <Award size={32} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-2">April Skill Challenge</h2>
            <p className="text-gray-700 mb-3">
              Learn a new creative skill this month! Complete at least 3 sessions to earn a special badge and enter the
              prize drawing.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="blue">15 days remaining</Badge>
              <Badge variant="green">126 participants</Badge>
            </div>
          </div>
          <Button variant="primary">Join Challenge</Button>
        </div>
      </div>
    </Card>
  )
}

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("discussions")

  // Sample discussions data
  const discussions = [
    {
      id: 1,
      title: "Best resources for learning Python in 2023",
      author: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      time: "2 days ago",
      content:
        "I'm looking for recommendations on the best resources for learning Python as a beginner. I've tried a few online courses but I'm wondering if there are any hidden gems I'm missing...",
      tags: [
        { name: "Python", variant: "blue" },
        { name: "Learning", variant: "purple" },
      ],
      likes: 24,
      replies: 18,
    },
    {
      id: 2,
      title: "How to structure your first teaching session",
      author: {
        name: "James Wilson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      time: "3 days ago",
      content:
        "I'm about to teach my first session on web development and I'm a bit nervous. Does anyone have advice on how to structure the session to make it engaging and effective?",
      tags: [
        { name: "Teaching", variant: "green" },
        { name: "Tips", variant: "yellow" },
      ],
      likes: 32,
      replies: 24,
    },
  ]

  // Sample resources data
  const resources = [
    {
      id: 1,
      title: "Python Cheat Sheet for Beginners",
      type: "PDF · 2.3 MB",
      description: "A comprehensive cheat sheet covering Python basics, data structures, and common functions.",
      icon: (
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
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      ),
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      author: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=24&width=24",
      },
      buttonText: "Download",
    },
    {
      id: 2,
      title: "UX Design Principles Presentation",
      type: "Slides · 5.1 MB",
      description: "A slide deck covering essential UX design principles and best practices for beginners.",
      icon: (
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
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.29 7 12 12 20.71 7" />
          <line x1="12" y1="22" x2="12" y2="12" />
        </svg>
      ),
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      author: {
        name: "Emily Chen",
        avatar: "/placeholder.svg?height=24&width=24",
      },
      buttonText: "Download",
    },
    {
      id: 3,
      title: "Public Speaking Guide",
      type: "Link · Course",
      description: "A free online course covering the fundamentals of public speaking and presentation skills.",
      icon: (
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
          <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
        </svg>
      ),
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      author: {
        name: "James Wilson",
        avatar: "/placeholder.svg?height=24&width=24",
      },
      buttonText: "Visit Link",
    },
  ]

  return (
    <div className="flex min-h-screen bg-[#FFF7D4]">
      <AppSidebar />

      <div className="flex-1 flex flex-col">
        <PageHeader title="Community Hub" backTo="/home-dashboard">
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Search community..."
              variant="yellow"
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

            {/* Tab Content */}
            {activeTab === "announcements" && (
              <div className="space-y-4">
                <Card className="mb-4">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-[#4a3630] flex items-center justify-center text-white">
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
                        <h3 className="font-bold text-gray-900">SkillSwap Team</h3>
                        <p className="text-sm text-gray-500">2 days ago</p>
                      </div>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">New Feature: Group Sessions Now Available!</h2>
                    <p className="text-gray-700 mb-4">
                      We're excited to announce that you can now create group learning sessions with up to 5
                      participants! This is perfect for study groups, team learning, or teaching multiple people at
                      once.
                    </p>
                    <p className="text-gray-700 mb-4">
                      To create a group session, simply go to your dashboard and click on "Create Session" and select
                      "Group Session" from the options.
                    </p>
                    <div className="flex items-center gap-4 mt-6">
                      <Button variant="primary">Learn More</Button>
                      <Button variant="outline">Try It Now</Button>
                    </div>
                  </div>
                </Card>

                <Card className="mb-4">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-[#4a3630] flex items-center justify-center text-white">
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
                        <h3 className="font-bold text-gray-900">SkillSwap Team</h3>
                        <p className="text-sm text-gray-500">1 week ago</p>
                      </div>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">
                      April Skill Challenge: Learn a Creative Skill
                    </h2>
                    <p className="text-gray-700 mb-4">
                      Join our monthly challenge and learn a new creative skill to win prizes! This month's challenge is
                      all about creativity - whether it's drawing, writing, photography, or any other creative pursuit.
                    </p>
                    <p className="text-gray-700 mb-4">
                      Complete at least 3 sessions learning a creative skill by April 30th to earn a special badge and
                      enter the prize drawing for a $50 gift card.
                    </p>
                    <div className="flex items-center gap-4 mt-6">
                      <Button variant="primary">Join Challenge</Button>
                    </div>
                  </div>
                </Card>
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
                    <select className="px-3 py-1.5 bg-white rounded-lg shadow-sm text-sm border-none focus:ring-2 focus:ring-[#4a3630]">
                      <option value="all">All Categories</option>
                      <option value="tech">Tech</option>
                      <option value="design">Design</option>
                      <option value="language">Language</option>
                      <option value="soft-skills">Soft Skills</option>
                    </select>
                  </div>
                  <Button variant="primary" leftIcon={<Plus size={16} />}>
                    Start Discussion
                  </Button>
                </div>

                {discussions.map((discussion) => (
                  <DiscussionCard key={discussion.id} discussion={discussion} />
                ))}
              </div>
            )}

            {activeTab === "resources" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <select className="px-3 py-1.5 bg-white rounded-lg shadow-sm text-sm border-none focus:ring-2 focus:ring-[#4a3630]">
                      <option value="recent">Most Recent</option>
                      <option value="popular">Most Popular</option>
                    </select>
                    <select className="px-3 py-1.5 bg-white rounded-lg shadow-sm text-sm border-none focus:ring-2 focus:ring-[#4a3630]">
                      <option value="all">All Topics</option>
                      <option value="programming">Programming</option>
                      <option value="design">Design</option>
                      <option value="business">Business</option>
                    </select>
                  </div>
                  <Button variant="primary" leftIcon={<Upload size={16} />}>
                    Share Resource
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {resources.map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === "challenges" && (
              <div className="space-y-6">
                <ChallengeCard />

                <Card>
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Current Leaderboard</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 font-bold">
                          1
                        </div>
                        <Avatar src="/placeholder.svg?height=40&width=40" size="md" fallback="EC" />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">Emily Chen</h4>
                          <p className="text-xs text-gray-500">5 sessions completed</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp size={16} className="text-green-500" />
                          <span className="text-sm font-medium text-green-500">+2</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold">
                          2
                        </div>
                        <Avatar src="/placeholder.svg?height=40&width=40" size="md" fallback="JW" />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">James Wilson</h4>
                          <p className="text-xs text-gray-500">4 sessions completed</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp size={16} className="text-green-500" />
                          <span className="text-sm font-medium text-green-500">+1</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold">
                          3
                        </div>
                        <Avatar src="/placeholder.svg?height=40&width=40" size="md" fallback="MB" />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">Michael Brown</h4>
                          <p className="text-xs text-gray-500">3 sessions completed</p>
                        </div>
                        <div className="flex items-center gap-1">
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
                            className="text-gray-400"
                          >
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                          <span className="text-sm font-medium text-gray-400">0</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Your Progress</h3>
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Sessions Completed</span>
                        <span className="text-sm font-medium text-gray-900">1/3</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-[#4a3630] h-2.5 rounded-full" style={{ width: "33%" }}></div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-4">
                      Complete 2 more sessions to earn the April Creative Challenge badge and enter the prize drawing!
                    </p>
                    <Button variant="primary" fullWidth>
                      Find a Session
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
