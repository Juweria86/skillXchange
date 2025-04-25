import { Link } from "react-router-dom"
import { MapPin, Star, Edit, X } from "lucide-react"
import { useState } from "react"
import AppSidebar from "../components/AppSidebar"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "Alex Johnson",
    location: "San Francisco, CA",
    bio: "Full-stack developer passionate about teaching and learning new skills.",
    about: [
      "I'm a full-stack developer with 5 years of experience building web applications. I specialize in React, Node.js, and modern JavaScript frameworks. I'm passionate about clean code, user experience, and teaching others.",
      "When I'm not coding, I enjoy hiking, photography, and improving my public speaking skills. I believe in lifelong learning and the power of skill exchange to build stronger communities."
    ],
    achievements: [
      "Certified Web Developer (Frontend Masters)",
      "Speaker at ReactConf 2022",
      "Mentored 15+ junior developers",
      "Built 3 open-source projects with 500+ stars on GitHub"
    ],
    tags: ["#WebDev", "#UXDesign", "#PublicSpeaking"]
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleArrayChange = (field: string, index: number, value: string) => {
    setProfileData(prev => {
      const newArray = [...prev[field]]
      newArray[index] = value
      return {
        ...prev,
        [field]: newArray
      }
    })
  }

  const addArrayItem = (field: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: [...prev[field], ""]
    }))
  }

  const removeArrayItem = (field: string, index: number) => {
    setProfileData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="flex min-h-screen bg-[#FFF7D4]">
      <AppSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Back Button */}
        <div className="p-4 bg-white shadow-sm flex justify-between items-center">
          <Link
            to="/home-dashboard"
            className="inline-flex items-center text-[#4a3630] hover:text-[#3a2a24] font-medium"
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
              className="w-5 h-5 mr-1"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Back to Dashboard
          </Link>
          <Button 
            variant="primary" 
            leftIcon={<Edit size={16} />}
            onClick={() => setIsEditing(true)}
          >
            Customize Profile
          </Button>
        </div>

        {/* Profile Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            {/* Edit Profile Modal */}
            {isEditing && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Edit Profile</h2>
                    <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-700">
                      <X size={24} />
                    </button>
                  </div>

                  <form className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FBEAA0]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={profileData.location}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FBEAA0]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                      <textarea
                        name="bio"
                        value={profileData.bio}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FBEAA0]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                      <div className="space-y-2">
                        {profileData.tags.map((tag, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={tag}
                              onChange={(e) => handleArrayChange("tags", index, e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FBEAA0]"
                            />
                            <button
                              type="button"
                              onClick={() => removeArrayItem("tags", index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addArrayItem("tags")}
                          className="text-sm text-[#4a3630] hover:text-[#3a2a24] font-medium"
                        >
                          + Add Tag
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">About Me</label>
                      <div className="space-y-2">
                        {profileData.about.map((paragraph, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <textarea
                              value={paragraph}
                              onChange={(e) => handleArrayChange("about", index, e.target.value)}
                              rows={3}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FBEAA0]"
                            />
                            <button
                              type="button"
                              onClick={() => removeArrayItem("about", index)}
                              className="text-red-500 hover:text-red-700 mt-2"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addArrayItem("about")}
                          className="text-sm text-[#4a3630] hover:text-[#3a2a24] font-medium"
                        >
                          + Add Paragraph
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Achievements</label>
                      <div className="space-y-2">
                        {profileData.achievements.map((achievement, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={achievement}
                              onChange={(e) => handleArrayChange("achievements", index, e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FBEAA0]"
                            />
                            <button
                              type="button"
                              onClick={() => removeArrayItem("achievements", index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addArrayItem("achievements")}
                          className="text-sm text-[#4a3630] hover:text-[#3a2a24] font-medium"
                        >
                          + Add Achievement
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 bg-[#4a3630] text-white rounded-md hover:bg-[#3a2a24]"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Hero Section */}
            <div className="bg-[#FBEAA0] rounded-xl p-6 shadow-md mb-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="relative w-32 h-32 rounded-full overflow-hidden bg-white border-4 border-white shadow-md">
                  <img
                    src="/placeholder.svg?height=128&width=128"
                    width={128}
                    height={128}
                    alt={profileData.name}
                    className="w-full h-full object-cover"
                  />
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 bg-[#4a3630] text-white p-2 rounded-full">
                      <Edit size={16} />
                    </button>
                  )}
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold text-gray-900">{profileData.name}</h1>
                  <div className="flex items-center justify-center md:justify-start gap-2 mt-1 text-gray-600">
                    <MapPin size={16} />
                    <span>{profileData.location}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                    {profileData.tags.map((tag, index) => (
                      <span key={index} className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 text-gray-700">{profileData.bio}</p>
                </div>
              </div>
            </div>

            {/* About Me Section */}
            <div className="bg-white rounded-xl p-6 shadow-md mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About Me</h2>
              <div className="text-gray-700 space-y-4">
                {profileData.about.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">Achievements</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                {profileData.achievements.map((achievement, index) => (
                  <li key={index}>{achievement}</li>
                ))}
              </ul>
            </div>

            {/* Rest of your existing profile sections... */}
            {/* Skills Sections, Availability Section, Social Links, Reviews Section */}
            {/* ... (keep all your existing sections as they were) ... */}
            
          </div>
        </main>
      </div>
    </div>
  )
}

// Simple Button component (add this if not already in your components)
function Button({ variant = 'primary', leftIcon, children, onClick }: { 
  variant?: 'primary' | 'outline', 
  leftIcon?: React.ReactNode,
  children: React.ReactNode,
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md flex items-center gap-2 ${
        variant === 'primary' 
          ? 'bg-[#4a3630] text-white hover:bg-[#3a2a24]' 
          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
      }`}
    >
      {leftIcon && leftIcon}
      {children}
    </button>
  )
}