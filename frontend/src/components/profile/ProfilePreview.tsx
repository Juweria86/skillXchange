"use client"

import type React from "react"
import { Calendar, MapPin, ExternalLink } from "lucide-react"
import {Card} from "../ui/Card"
import Badge from "../ui/Badge"

interface Skill {
  name: string
  proficiency: "Beginner" | "Intermediate" | "Advanced" | "Expert"
}

interface Achievement {
  title: string
  description: string
}

interface Availability {
  day: string
  startTime: string
  endTime: string
}

interface SocialLink {
  platform: string
  url: string
}

interface ProfilePreviewProps {
  name: string
  location: string
  bio: string
  profileImage: string | null
  teachingSkills: Skill[]
  learningSkills: Skill[]
  achievements: Achievement[]
  availability: Availability[]
  socialLinks: SocialLink[]
  onClose: () => void
}

const ProfilePreview: React.FC<ProfilePreviewProps> = ({
  name,
  location,
  bio,
  profileImage,
  teachingSkills,
  learningSkills,
  achievements,
  availability,
  socialLinks,
  onClose,
}) => {
  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "twitter":
        return <i className="fab fa-twitter"></i>
      case "instagram":
        return <i className="fab fa-instagram"></i>
      case "linkedin":
        return <i className="fab fa-linkedin"></i>
      case "facebook":
        return <i className="fab fa-facebook"></i>
      case "github":
        return <i className="fab fa-github"></i>
      default:
        return <ExternalLink size={16} />
    }
  }

  // Function to get the appropriate badge color based on proficiency
  const getBadgeVariant = (proficiency: string) => {
    switch (proficiency) {
      case "Beginner":
        return "beginner"
      case "Intermediate":
        return "intermediate"
      case "Advanced":
        return "advanced"
      case "Expert":
        return "expert"
      default:
        return "default"
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FFF7D4] w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl">
        <div className="sticky top-0 bg-[#4a3630] text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Profile Preview</h2>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white text-[#4a3630] rounded-lg hover:bg-gray-100 transition-colors"
          >
            Back to Edit
          </button>
        </div>

        <div className="p-4 md:p-6">
          {/* Profile Header */}
          <Card variant="default" className="overflow-hidden mb-6">
            <div className="bg-[#4a3630] text-white p-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-[#FBEAA0] flex items-center justify-center overflow-hidden border-2 border-white">
                    {profileImage ? (
                      <img
                        src={profileImage || "/placeholder.svg"}
                        alt={name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null
                          e.currentTarget.src = "https://via.placeholder.com/300?text=Profile"
                        }}
                      />
                    ) : (
                      <span className="text-[#4a3630] text-5xl font-bold">{name.charAt(0)}</span>
                    )}
                  </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-2xl font-bold">{name}</h1>
                  {location && (
                    <div className="flex items-center justify-center md:justify-start gap-1 mt-1 text-white/80">
                      <MapPin size={16} />
                      <span>{location}</span>
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                    {teachingSkills.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant={getBadgeVariant(skill.proficiency)}>
                        {skill.name}
                      </Badge>
                    ))}
                    {teachingSkills.length > 3 && <Badge variant="secondary">+{teachingSkills.length - 3} more</Badge>}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <h2 className="text-xl font-bold mb-3">About Me</h2>
              <p className="whitespace-pre-line">{bio}</p>

              {socialLinks && socialLinks.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-3">
                  {socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1 bg-[#FBEAA0] text-[#4a3630] rounded-full hover:bg-[#f5e28b] transition-colors"
                    >
                      {getSocialIcon(link.platform)}
                      <span className="capitalize">{link.platform}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Skills Section */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Skills I Can Teach */}
            <Card variant="default" className="overflow-hidden">
              <div className="bg-[#4a3630] text-white p-4">
                <h2 className="text-xl font-bold">Skills I Can Teach</h2>
              </div>
              <div className="p-6">
                {teachingSkills && teachingSkills.length > 0 ? (
                  <ul className="space-y-3">
                    {teachingSkills.map((skill, index) => (
                      <li key={index} className="flex items-center justify-between">
                        <span>{skill.name}</span>
                        <Badge variant={getBadgeVariant(skill.proficiency)}>{skill.proficiency}</Badge>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No teaching skills added yet</p>
                )}
              </div>
            </Card>

            {/* Skills I Want to Learn */}
            <Card variant="default" className="overflow-hidden">
              <div className="bg-[#4a3630] text-white p-4">
                <h2 className="text-xl font-bold">Skills I Want to Learn</h2>
              </div>
              <div className="p-6">
                {learningSkills && learningSkills.length > 0 ? (
                  <ul className="space-y-3">
                    {learningSkills.map((skill, index) => (
                      <li key={index} className="flex items-center justify-between">
                        <span>{skill.name}</span>
                        <Badge variant={getBadgeVariant(skill.proficiency)}>{skill.proficiency}</Badge>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No learning skills added yet</p>
                )}
              </div>
            </Card>
          </div>

          {/* Achievements Section */}
          {achievements && achievements.length > 0 && (
            <Card variant="default" className="overflow-hidden mb-6">
              <div className="bg-[#4a3630] text-white p-4">
                <h2 className="text-xl font-bold">Achievements</h2>
              </div>
              <div className="p-6">
                <ul className="space-y-4">
                  {achievements.map((achievement, index) => (
                    <li key={index} className="border-b border-[#FBEAA0] pb-4 last:border-0 last:pb-0">
                      <h3 className="font-bold text-lg">{achievement.title}</h3>
                      {achievement.description && <p className="mt-1">{achievement.description}</p>}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          )}

          {/* Availability Section */}
          {availability && availability.length > 0 && (
            <Card variant="default" className="overflow-hidden mb-6">
              <div className="bg-[#4a3630] text-white p-4">
                <h2 className="text-xl font-bold">Availability</h2>
              </div>
              <div className="p-6">
                <ul className="space-y-2">
                  {availability.map((slot, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Calendar size={18} className="text-[#4a3630]" />
                      <span>
                        <strong>{slot.day}:</strong> {slot.startTime} - {slot.endTime}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePreview
