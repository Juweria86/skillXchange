import { Filter, MapPin, Search } from 'lucide-react'
import { useState } from "react"
import AppSidebar from "../components/AppSidebar"
import PageHeader from "../components/layout/PageHeader"
import Card from "../components/ui/Card"
import Input from "../components/ui/Input"
import Button from "../components/ui/Button"
import Badge from "../components/ui/Badge"
import Avatar from "../components/ui/Avatar"

// Filter sidebar component
function FilterSidebar() {
  return (
    <div className="space-y-6">
      {/* Skills I Want to Learn */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Skills I Want to Learn</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="python"
              className="h-4 w-4 text-[#4a3630] focus:ring-[#4a3630] border-gray-300 rounded"
            />
            <label htmlFor="python" className="ml-2 block text-sm text-gray-700">
              Python
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="machine-learning"
              className="h-4 w-4 text-[#4a3630] focus:ring-[#4a3630] border-gray-300 rounded"
            />
            <label htmlFor="machine-learning" className="ml-2 block text-sm text-gray-700">
              Machine Learning
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="spanish"
              className="h-4 w-4 text-[#4a3630] focus:ring-[#4a3630] border-gray-300 rounded"
            />
            <label htmlFor="spanish" className="ml-2 block text-sm text-gray-700">
              Spanish
            </label>
          </div>
        </div>
      </div>

      {/* Location */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Location</h3>
        <select className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4a3630] bg-[#FBEAA0]">
          <option value="anywhere">Anywhere</option>
          <option value="nearby">Within 25 miles</option>
          <option value="city">Same city</option>
        </select>
      </div>

      {/* Availability */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Availability</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="weekdays"
              className="h-4 w-4 text-[#4a3630] focus:ring-[#4a3630] border-gray-300 rounded"
            />
            <label htmlFor="weekdays" className="ml-2 block text-sm text-gray-700">
              Weekdays
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="evenings"
              className="h-4 w-4 text-[#4a3630] focus:ring-[#4a3630] border-gray-300 rounded"
            />
            <label htmlFor="evenings" className="ml-2 block text-sm text-gray-700">
              Evenings
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="weekends"
              className="h-4 w-4 text-[#4a3630] focus:ring-[#4a3630] border-gray-300 rounded"
            />
            <label htmlFor="weekends" className="ml-2 block text-sm text-gray-700">
              Weekends
            </label>
          </div>
        </div>
      </div>

      {/* Match % Range */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Match Percentage</h3>
        <select className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4a3630] bg-[#FBEAA0]">
          <option value="all">All matches</option>
          <option value="90">90%+</option>
          <option value="80">80%+</option>
          <option value="70">70%+</option>
        </select>
      </div>

      {/* Activity Status */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Activity Status</h3>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="active-only"
            className="h-4 w-4 text-[#4a3630] focus:ring-[#4a3630] border-gray-300 rounded"
          />
          <label htmlFor="active-only" className="ml-2 block text-sm text-gray-700">
            Recently active only
          </label>
        </div>
      </div>

      {/* Apply Filters Button */}
      <Button variant="primary" fullWidth>
        Apply Filters
      </Button>
    </div>
  )
}

// Match card component
function MatchCard({ match }: { match: any }) {
  return (
    <Card className="overflow-hidden">
      <div className="p-5">
        <div className="flex items-start gap-4">
          <Avatar src={match.avatar} size="lg" fallback={match.name} />
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">{match.name}</h3>
                <div className="flex items-center text-gray-500 text-sm mt-1">
                  <MapPin size={14} className="mr-1" />
                  <span>{match.location}</span>
                </div>
              </div>
              <Badge
                variant={match.match >= 90 ? "green" : match.match >= 80 ? "blue" : "yellow"}
                className="ml-2"
              >
                {match.match}%
              </Badge>
            </div>
            <p className="text-gray-700 text-sm mt-2">
              Teaches: {match.teaches.join(", ")}
              <br />
              Learns: {match.learns.join(", ")}
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default function SkillMatchesPage() {
  const [filterOpen, setFilterOpen] = useState(false)

  // Sample data for matches
  const matches = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=80&width=80",
      location: "San Francisco, CA",
      teaches: ["Python", "Digital Art"],
      learns: ["Public Speaking"],
      match: 95,
      active: true,
    },
    {
      id: 2,
      name: "James Wilson",
      avatar: "/placeholder.svg?height=80&width=80",
      location: "New York, NY",
      teaches: ["Project Management", "Excel"],
      learns: ["Web Development", "Public Speaking"],
      match: 87,
      active: true,
    },
    {
      id: 3,
      name: "Emily Chen",
      avatar: "/placeholder.svg?height=80&width=80",
      location: "Chicago, IL",
      teaches: ["Spanish", "Photography"],
      learns: ["UX Design", "JavaScript"],
      match: 82,
      active: false,
    },
    {
      id: 4,
      name: "Michael Brown",
      avatar: "/placeholder.svg?height=80&width=80",
      location: "Austin, TX",
      teaches: ["Web Development", "Guitar"],
      learns: ["Machine Learning"],
      match: 78,
      active: true,
    },
  ]

  return (
    <div className="flex min-h-screen bg-[#FFF7D4]">
      <AppSidebar />

      <div className="flex-1 flex flex-col">
        <PageHeader title="Find Your Skill Matches" backTo="/home-dashboard">
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Search matches..."
              variant="yellow"
              leftIcon={<Search size={16} />}
              className="w-48 md:w-64"
            />
            <Button
              variant="primary"
              leftIcon={<Filter size={16} />}
              className="md:hidden"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              Filters
            </Button>
          </div>
        </PageHeader>

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Filters Sidebar - Mobile */}
              {filterOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden">
                  <div className="absolute right-0 top-0 bottom-0 w-4/5 max-w-sm bg-white p-4 overflow-auto">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-bold">Filters</h2>
                      <button onClick={() => setFilterOpen(false)}>
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
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                    <FilterSidebar />
                  </div>
                </div>
              )}

              {/* Filters Sidebar - Desktop */}
              <div className="hidden md:block w-64 bg-white rounded-xl shadow-md p-4 h-fit sticky top-6">
                <h2 className="text-lg font-bold mb-4">Filters</h2>
                <FilterSidebar />
              </div>

              {/* Matches Grid */}
              <div className="flex-1">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {matches.map((match) => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
