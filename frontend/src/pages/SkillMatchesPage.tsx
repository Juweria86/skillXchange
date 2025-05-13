import React, { useState } from "react";
import {
  ChevronLeft,
  Menu,
  X,
  Home,
  UserCircle,
  Brain,
  RefreshCw,
  Calendar,
  MessageSquare,
  Settings,
  LogOut,
  MapPin,
  Filter,
  Search,
  AlertCircle,
  Loader2
} from "lucide-react";
import { useSkillMatches } from "../hooks/useSkillMatches";
import { Link } from "react-router-dom";

interface Match {
  id: string;
  name: string;
  avatar: string;
  location: string;
  teaches: string[];
  learns: string[];
  match: number;
  active: boolean;
}

interface Filters {
  location: string;
  matchPercentage: string;
  activeOnly: boolean;
  skills: string[];
}

function SkillMatchesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const { matches, loading, error, refetch } = useSkillMatches();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Filters>({
    location: "anywhere",
    matchPercentage: "all",
    activeOnly: false,
    skills: []
  });

  const filteredMatches = matches.filter((match: Match) => {
    // Search term filter
    const matchesSearch = match.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.teaches.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      match.learns.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));

    // Location filter
    const matchesLocation = filters.location === "anywhere" || 
      (filters.location === "nearby" && match.location.includes("Near")) || // Simplified for demo
      (filters.location === "city" && match.location.includes("City")); // Simplified for demo

    // Match percentage filter
    const matchesPercentage = filters.matchPercentage === "all" ||
      (filters.matchPercentage === "90" && match.match >= 90) ||
      (filters.matchPercentage === "80" && match.match >= 80) ||
      (filters.matchPercentage === "70" && match.match >= 70);

    // Active status filter
    const matchesActive = !filters.activeOnly || match.active;

    // Skills filter
    const matchesSkills = filters.skills.length === 0 ||
      filters.skills.some(skill => 
        match.teaches.includes(skill) || match.learns.includes(skill)
      );

    return matchesSearch && matchesLocation && matchesPercentage && matchesActive && matchesSkills;
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSkillToggle = (skill: string) => {
    setFilters(prev => {
      if (prev.skills.includes(skill)) {
        return {
          ...prev,
          skills: prev.skills.filter(s => s !== skill)
        };
      } else {
        return {
          ...prev,
          skills: [...prev.skills, skill]
        };
      }
    });
  };

  if (loading && matches.length === 0) {
    return (
      <div className="flex min-h-screen bg-[#FFF7D4] items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#4a3630] mx-auto" />
          <p className="mt-4 text-lg text-gray-700">Finding your skill matches...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-[#FFF7D4] items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
          <div className="text-red-500 mb-4">
            <AlertCircle className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading matches</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-[#4a3630] text-white rounded-lg hover:bg-[#3a2a24]"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#FFF7D4]">
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
        {/* Sidebar content remains the same */}
        {/* ... */}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Back Button */}
        <div className="p-4 bg-white shadow-sm">
          <a
            href="/home-dashboard"
            className="inline-flex items-center text-[#4a3630] hover:text-[#3a2a24] font-medium"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Dashboard
          </a>
        </div>

        {/* Matches Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h1 className="text-2xl font-bold text-gray-900">Find Your Skill Matches</h1>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search matches..."
                    className="pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4a3630] bg-[#FBEAA0]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
                </div>
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-[#4a3630] text-white rounded-lg hover:bg-[#3a2a24] md:hidden"
                  onClick={() => setFilterOpen(!filterOpen)}
                >
                  <Filter size={16} />
                  <span>Filters</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Filters Sidebar - Mobile */}
              {filterOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden">
                  <div className="absolute right-0 top-0 bottom-0 w-4/5 max-w-sm bg-white p-4 overflow-auto">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-bold">Filters</h2>
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
              <div className="hidden md:block w-64 bg-white rounded-xl shadow-md p-4 h-fit sticky top-6">
                <h2 className="text-lg font-bold mb-4">Filters</h2>
                <FilterContent 
                  filters={filters} 
                  onFilterChange={handleFilterChange}
                  onSkillToggle={handleSkillToggle}
                />
              </div>

              {/* Matches Grid */}
              <div className="flex-1">
                {filteredMatches.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filteredMatches.map((match: Match) => (
                      <MatchCard key={match.id} match={match} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-md p-8 text-center">
                    <Search className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No matches found</h3>
                    <p className="mt-1 text-gray-500">
                      Try adjusting your search or filter criteria
                    </p>
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setFilters({
                          location: "anywhere",
                          matchPercentage: "all",
                          activeOnly: false,
                          skills: []
                        });
                      }}
                      className="mt-4 px-4 py-2 bg-[#4a3630] text-white rounded-lg hover:bg-[#3a2a24]"
                    >
                      Reset filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

interface FilterContentProps {
  filters: Filters;
  onFilterChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSkillToggle: (skill: string) => void;
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
    "Project Management"
  ];

  return (
    <div className="space-y-6">
      {/* Skills Filter */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Skills</h3>
        <div className="space-y-2">
          {skillsList.map((skill) => (
            <div key={skill} className="flex items-center">
              <input
                type="checkbox"
                id={`skill-${skill}`}
                checked={filters.skills.includes(skill)}
                onChange={() => onSkillToggle(skill)}
                className="h-4 w-4 text-[#4a3630] focus:ring-[#4a3630] border-gray-300 rounded"
              />
              <label htmlFor={`skill-${skill}`} className="ml-2 block text-sm text-gray-700">
                {skill}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Location */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Location</h3>
        <select
          name="location"
          value={filters.location}
          onChange={onFilterChange}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4a3630] bg-[#FBEAA0]"
        >
          <option value="anywhere">Anywhere</option>
          <option value="nearby">Within 25 miles</option>
          <option value="city">Same city</option>
        </select>
      </div>

      {/* Match % Range */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Match Percentage</h3>
        <select
          name="matchPercentage"
          value={filters.matchPercentage}
          onChange={onFilterChange}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4a3630] bg-[#FBEAA0]"
        >
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
            name="activeOnly"
            checked={filters.activeOnly}
            onChange={onFilterChange}
            className="h-4 w-4 text-[#4a3630] focus:ring-[#4a3630] border-gray-300 rounded"
          />
          <label htmlFor="active-only" className="ml-2 block text-sm text-gray-700">
            Recently active only
          </label>
        </div>
      </div>

      {/* Apply Filters Button */}
      <button className="w-full py-2 bg-[#4a3630] text-white rounded-lg hover:bg-[#3a2a24] transition-colors">
        Apply Filters
      </button>
    </div>
  );
}

interface MatchCardProps {
  match: Match;
}

function MatchCard({ match }: MatchCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
            <img
              src={match.avatar || "/placeholder.svg"}
              width={64}
              height={64}
              alt={match.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">{match.name}</h3>
                <div className="flex items-center text-gray-500 text-sm mt-1">
                  <MapPin size={14} className="mr-1" />
                  <span>{match.location}</span>
                </div>
              </div>
              <div
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  match.match >= 90
                    ? "bg-green-100 text-green-800"
                    : match.match >= 80
                    ? "bg-blue-100 text-blue-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {match.match}% Match
              </div>
            </div>

            <div className="mt-3 space-y-2">
              <div>
                <span className="text-xs font-medium text-gray-500">Teaches:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {match.teaches.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              {match.learns.length > 0 && (
                <div>
                  <span className="text-xs font-medium text-gray-500">Wants to learn:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {match.learns.map((skill) => (
                      <span
                        key={skill}
                        className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Link to={`/messages?user=${match.id}`}>
              <button className="px-3 py-1.5 bg-[#4a3630] text-white text-sm rounded-lg hover:bg-[#3a2a24] transition-colors">
                Message
              </button>
              </Link>


              
              <button className="px-3 py-1.5 border border-[#4a3630] text-[#4a3630] text-sm rounded-lg hover:bg-[#FBEAA0] transition-colors">
                View Profile
              </button>
              <button className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors">
                Request Session
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SkillMatchesPage;