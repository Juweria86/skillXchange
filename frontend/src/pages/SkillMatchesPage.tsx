"use client"

import { useState } from "react"
import {
  ChevronLeft,
  Menu,
  X,
  Filter,
  Search,
  AlertCircle,
  Loader2,
  MapPin,
  MessageCircle,
  UserPlus,
} from "lucide-react"
import { useSkillMatches } from "../hooks/useSkillMatches"
import { Link } from "react-router-dom"
import { toast } from "react-hot-toast"
import AppSidebar from "../components/AppSidebar"
import { useConnectionStatus } from "../hooks/useConnectionStatus"
import  Avatar  from "@/components/ui/Avatar"
import Select from "@/components/ui/Select"

interface Match {
  id: string
  name: string
  avatar: string
  location: string
  teaches: string[]
  learns: string[]
  match: number
  active: boolean
}

interface Filters {
  location: string
  matchPercentage: string
  activeOnly: boolean
  skills: string[]
}

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

const Button = ({
  children,
  className = "",
  variant = "default",
  size = "default",
  asChild = false,
  disabled = false,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#0C4B93] focus:ring-offset-2"
  const variantClasses =
    variant === "outline"
      ? "border border-[#0C4B93] text-[#0C4B93] hover:bg-[#E5EFF9]"
      : "bg-[#0C4B93] text-white hover:bg-[#064283]"
  const sizeClasses = size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2"
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : ""

  const Component = asChild ? "div" : "button"

  return (
    <Component
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${disabledClasses} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </Component>
  )
}

const Input = ({ className = "", ...props }) => (
  <input
    className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C4B93] focus:border-[#0C4B93] ${className}`}
    {...props}
  />
)

const Badge = ({ children, className = "", variant = "default", ...props }) => {
  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
  const variantClasses =
    variant === "outline"
      ? "border border-[#0C4B93] text-[#0C4B93]"
      : variant === "secondary"
        ? "bg-[#D7E9F7] text-[#0C4B93]"
        : "bg-green-100 text-green-800"

  return (
    <span className={`${baseClasses} ${variantClasses} ${className}`} {...props}>
      {children}
    </span>
  )
}

const Checkbox = ({ checked, onCheckedChange, className = "", ...props }) => (
  <input
    type="checkbox"
    checked={checked}
    onChange={(e) => onCheckedChange?.(e.target.checked)}
    className={`h-4 w-4 text-[#0C4B93] focus:ring-[#0C4B93] border-gray-300 rounded ${className}`}
    {...props}
  />
)

const Label = ({ children, className = "", ...props }) => (
  <label className={`block text-sm font-medium text-gray-700 ${className}`} {...props}>
    {children}
  </label>
)

function SkillMatchesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const { matches, loading, error, refetch } = useSkillMatches()
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<Filters>({
    location: "anywhere",
    matchPercentage: "all",
    activeOnly: false,
    skills: [],
  })

  const {
    checkConnectionStatus,
    sendConnectionRequest,
    acceptConnectionRequest,
    declineConnectionRequest,
    loading: connectionLoading,
  } = useConnectionStatus()

  const filteredMatches = matches.filter((match: Match) => {
    const matchesSearch =
      match.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.teaches.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      match.learns.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesLocation =
      filters.location === "anywhere" ||
      (filters.location === "nearby" && match.location.includes("Near")) ||
      (filters.location === "city" && match.location.includes("City"))

    const matchesPercentage =
      filters.matchPercentage === "all" ||
      (filters.matchPercentage === "90" && match.match >= 90) ||
      (filters.matchPercentage === "80" && match.match >= 80) ||
      (filters.matchPercentage === "70" && match.match >= 70)

    const matchesActive = !filters.activeOnly || match.active

    const matchesSkills =
      filters.skills.length === 0 ||
      filters.skills.some((skill) => match.teaches.includes(skill) || match.learns.includes(skill))

    return matchesSearch && matchesLocation && matchesPercentage && matchesActive && matchesSkills
  })

  const handleFilterChange = (name: string, value: string | boolean) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSkillToggle = (skill: string) => {
    setFilters((prev) => {
      if (prev.skills.includes(skill)) {
        return {
          ...prev,
          skills: prev.skills.filter((s) => s !== skill),
        }
      } else {
        return {
          ...prev,
          skills: [...prev.skills, skill],
        }
      }
    })
  }

  if (loading && matches.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#E5EFF9] to-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#0C4B93] mx-auto" />
          <p className="mt-4 text-lg text-[#0C4B93] font-medium">Finding your skill matches...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#E5EFF9] to-background flex items-center justify-center">
        <Card className="max-w-md border-none shadow-lg">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-[#0C4B93] mb-2">Error loading matches</CardTitle>
            <CardDescription className="mb-4">{error}</CardDescription>
            <Button onClick={refetch} className="bg-[#0C4B93] hover:bg-[#064283]">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E5EFF9] to-background">
      {/* Mobile Sidebar Toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-[#0C4B93] text-white shadow-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <AppSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 border-b border-gray-100">
          <div className="max-w-7xl mx-auto">
            <Link
              to="/dashboard"
              className="inline-flex items-center text-[#0C4B93] hover:text-[#064283] font-medium mb-4"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back to Dashboard
            </Link>
          </div>
        </header>

        {/* Matches Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#0C4B93] mb-2">Find Your Skill Matches</h1>
              <p className="text-gray-600">Connect with people who can help you learn new skills</p>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Search by name, skills, or location..."
                  className="pl-10 border-gray-200 focus:border-[#0C4B93] focus:ring-[#0C4B93]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                className="md:hidden border-[#0C4B93] text-[#0C4B93] hover:bg-[#E5EFF9]"
                onClick={() => setFilterOpen(!filterOpen)}
              >
                <Filter size={16} className="mr-2" />
                Filters
              </Button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filters Sidebar - Mobile */}
              {filterOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden">
                  <div className="absolute right-0 top-0 bottom-0 w-4/5 max-w-sm bg-white p-6 overflow-auto">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-lg font-bold text-[#0C4B93]">Filters</h2>
                      <button onClick={() => setFilterOpen(false)}>
                        <X size={20} />
                      </button>
                    </div>
                    <FilterContent
                      filters={filters}
                      onFilterChange={handleFilterChange}
                      onSkillToggle={handleSkillToggle}
                    />
                  </div>
                </div>
              )}

              {/* Filters Sidebar - Desktop */}
              <div className="hidden lg:block w-80">
                <Card className="border-none shadow-md sticky top-6">
                  <CardHeader>
                    <CardTitle className="text-[#0C4B93]">Filters</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FilterContent
                      filters={filters}
                      onFilterChange={handleFilterChange}
                      onSkillToggle={handleSkillToggle}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Matches Grid */}
              <div className="flex-1">
                {filteredMatches.length > 0 ? (
                  <>
                    <div className="mb-6">
                      <p className="text-gray-600">
                        Found {filteredMatches.length} match{filteredMatches.length !== 1 ? "es" : ""}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                      {filteredMatches.map((match: Match) => (
                        <MatchCard
                          key={match.id}
                          match={match}
                          checkConnectionStatus={checkConnectionStatus}
                          sendConnectionRequest={sendConnectionRequest}
                          acceptConnectionRequest={acceptConnectionRequest}
                          declineConnectionRequest={declineConnectionRequest}
                          connectionLoading={connectionLoading}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <Card className="border-none shadow-md">
                    <CardContent className="p-12 text-center">
                      <Search className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                      <CardTitle className="text-[#0C4B93] mb-2">No matches found</CardTitle>
                      <CardDescription className="mb-6">
                        Try adjusting your search or filter criteria to find more skill partners
                      </CardDescription>
                      <Button
                        onClick={() => {
                          setSearchTerm("")
                          setFilters({
                            location: "anywhere",
                            matchPercentage: "all",
                            activeOnly: false,
                            skills: [],
                          })
                        }}
                        className="bg-[#0C4B93] hover:bg-[#064283]"
                      >
                        Reset filters
                      </Button>
                    </CardContent>
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

interface FilterContentProps {
  filters: Filters
  onFilterChange: (name: string, value: string | boolean) => void
  onSkillToggle: (skill: string) => void
}

function FilterContent({ filters, onFilterChange, onSkillToggle }: FilterContentProps) {
  const skillsList = [
    "Python",
    "Machine Learning",
    "Spanish",
    "Web Development",
    "Public Speaking",
    "UX Design",
    "Data Analysis",
    "Project Management",
  ]

  return (
    <div className="space-y-6">
      {/* Skills Filter */}
      <div>
        <Label className="text-sm font-medium text-[#0C4B93] mb-3 block">Skills</Label>
        <div className="space-y-3">
          {skillsList.map((skill) => (
            <div key={skill} className="flex items-center space-x-2">
              <Checkbox
                id={`skill-${skill}`}
                checked={filters.skills.includes(skill)}
                onCheckedChange={() => onSkillToggle(skill)}
              />
              <Label htmlFor={`skill-${skill}`} className="text-sm text-gray-700">
                {skill}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Location */}
      <div>
        <Label className="text-sm font-medium text-[#0C4B93] mb-3 block">Location</Label>
        <Select
          value={filters.location}
          onChange={(value) => onFilterChange("location", value)}
          options={[
            { value: "anywhere", label: "Anywhere" },
            { value: "nearby", label: "Within 25 miles" },
            { value: "city", label: "Same city" },
          ]}
          className="border-gray-200 focus:border-[#0C4B93] focus:ring-[#0C4B93]"
        />
      </div>

      {/* Match Percentage */}
      <div>
        <Label className="text-sm font-medium text-[#0C4B93] mb-3 block">Match Percentage</Label>
        <Select
          value={filters.matchPercentage}
          onChange={(value) => onFilterChange("matchPercentage", value)}
          options={[
            { value: "all", label: "All matches" },
            { value: "90", label: "90%+" },
            { value: "80", label: "80%+" },
            { value: "70", label: "70%+" },
          ]}
          className="border-gray-200 focus:border-[#0C4B93] focus:ring-[#0C4B93]"
        />
      </div>

      {/* Activity Status */}
      <div>
        <Label className="text-sm font-medium text-[#0C4B93] mb-3 block">Activity Status</Label>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="active-only"
            checked={filters.activeOnly}
            onCheckedChange={(checked) => onFilterChange("activeOnly", checked)}
          />
          <Label htmlFor="active-only" className="text-sm text-gray-700">
            Recently active only
          </Label>
        </div>
      </div>
    </div>
  )
}

interface MatchCardProps {
  match: Match
  checkConnectionStatus: (userId: string) => {
    isConnected: boolean
    isPending: boolean
    isReceived: boolean
    connectionId: string | null
  }
  sendConnectionRequest: (userId: string) => Promise<void>
  acceptConnectionRequest: (requestId: string) => Promise<void>
  declineConnectionRequest: (requestId: string) => Promise<void>
  connectionLoading: boolean
}

function MatchCard({
  match,
  checkConnectionStatus,
  sendConnectionRequest,
  acceptConnectionRequest,
  declineConnectionRequest,
  connectionLoading,
}: MatchCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const connectionStatus = checkConnectionStatus(match.id)

  const handleConnect = async () => {
    try {
      setIsLoading(true)
      await sendConnectionRequest(match.id)
      toast.success(`Connection request sent to ${match.name}`)
    } catch (error) {
      toast.error("Failed to send connection request")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAccept = async () => {
    if (!connectionStatus.connectionId) return

    try {
      setIsLoading(true)
      await acceptConnectionRequest(connectionStatus.connectionId)
      toast.success(`You are now connected with ${match.name}`)
    } catch (error) {
      toast.error("Failed to accept connection request")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDecline = async () => {
    if (!connectionStatus.connectionId) return

    try {
      setIsLoading(true)
      await declineConnectionRequest(connectionStatus.connectionId)
      toast.success(`Connection request declined`)
    } catch (error) {
      toast.error("Failed to decline connection request")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar src={match.avatar || "/placeholder.svg"} fallback={match.name.charAt(0)} className="w-16 h-16" />

          <div className="flex-1">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-[#0C4B93] text-lg">{match.name}</h3>
                <div className="flex items-center text-gray-500 text-sm mt-1">
                  <MapPin size={14} className="mr-1" />
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
                {match.match}% Match
              </Badge>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <span className="text-xs font-medium text-[#0C4B93] block mb-2">Teaches:</span>
                <div className="flex flex-wrap gap-1">
                  {match.teaches.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="text-xs bg-[#D7E9F7] text-[#0C4B93] hover:bg-[#D7E9F7]"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {match.learns.length > 0 && (
                <div>
                  <span className="text-xs font-medium text-[#0C4B93] block mb-2">Wants to learn:</span>
                  <div className="flex flex-wrap gap-1">
                    {match.learns.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs border-[#0C4B93] text-[#0C4B93]">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {connectionStatus.isConnected ? (
                <Button asChild size="sm" className="bg-[#0C4B93] hover:bg-[#064283]">
                  <Link to={`/messages?userId=${match.id}`}>
                    <MessageCircle size={14} className="mr-2" />
                    Message
                  </Link>
                </Button>
              ) : connectionStatus.isPending ? (
                <Button size="sm" disabled className="bg-gray-300 text-gray-600">
                  Request Sent
                </Button>
              ) : connectionStatus.isReceived ? (
                <>
                  <Button
                    size="sm"
                    className="bg-[#0C4B93] hover:bg-[#064283]"
                    onClick={handleAccept}
                    disabled={isLoading || connectionLoading}
                  >
                    {isLoading ? "Accepting..." : "Accept"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleDecline} disabled={isLoading || connectionLoading}>
                    Decline
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  className="bg-[#0C4B93] hover:bg-[#064283]"
                  onClick={handleConnect}
                  disabled={isLoading || connectionLoading}
                >
                  <UserPlus size={14} className="mr-2" />
                  {isLoading ? "Connecting..." : "Connect"}
                </Button>
              )}

              <Button
                asChild
                size="sm"
                variant="outline"
                className="border-[#0C4B93] text-[#0C4B93] hover:bg-[#E5EFF9]"
              >
                <Link to={`/profile/${match.id}`}>View Profile</Link>
              </Button>

              {connectionStatus.isConnected && (
                <Button size="sm" variant="outline" className="border-[#0C4B93] text-[#0C4B93] hover:bg-[#E5EFF9]">
                  Request Session
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default SkillMatchesPage
