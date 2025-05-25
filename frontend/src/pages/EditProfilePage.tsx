"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import {
  Plus,
  Trash2,
  Upload,
  X,
  Instagram,
  Twitter,
  Linkedin,
  Globe,
  Facebook,
  Github,
  Eye,
  ChevronLeft,
} from "lucide-react"
import axios from "axios"
import toast from "react-hot-toast"
import AppSidebar from "../components/AppSidebar"
import Select from "@/components/ui/Select"
import ProfilePreview from "../components/profile/ProfilePreview"

// Custom components
const Card = ({ children, className = "", ...props }) => (
  <div className={`bg-white rounded-lg shadow-md border border-gray-100 ${className}`} {...props}>
    {children}
  </div>
)

const CardHeader = ({ children, className = "", ...props }) => (
  <div className={`p-6 pb-4 ${className}`} {...props}>
    {children}
  </div>
)

const CardContent = ({ children, className = "", ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
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

const Input = ({ className = "", label, error, ...props }) => (
  <div className="space-y-1">
    {label && <label className="block text-sm font-medium text-[#0C4B93]">{label}</label>}
    <input
      className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C4B93] focus:border-[#0C4B93] ${className}`}
      {...props}
    />
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
)

const Textarea = ({ className = "", label, error, ...props }) => (
  <div className="space-y-1">
    {label && <label className="block text-sm font-medium text-[#0C4B93]">{label}</label>}
    <textarea
      className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C4B93] focus:border-[#0C4B93] resize-none ${className}`}
      {...props}
    />
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
)

const Badge = ({ children, className = "", ...props }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#D7E9F7] text-[#0C4B93] ${className}`}
    {...props}
  >
    {children}
  </span>
)

interface Skill {
  _id?: string
  name: string
  proficiency: "Beginner" | "Intermediate" | "Advanced" | "Expert"
}

interface SocialLink {
  platform: string
  url: string
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

interface ProfileFormData {
  name: string
  location: string
  bio: string
  teachingSkills: Skill[]
  learningSkills: Skill[]
  achievements: Achievement[]
  availability: Availability[]
  socialLinks: SocialLink[]
}

export default function EditProfilePage() {
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [showPreview, setShowPreview] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      teachingSkills: [{ name: "", proficiency: "Intermediate" }],
      learningSkills: [{ name: "", proficiency: "Beginner" }],
      achievements: [{ title: "", description: "" }],
      availability: [{ day: "Monday", startTime: "09:00", endTime: "17:00" }],
      socialLinks: [{ platform: "twitter", url: "" }],
    },
  })

  // Watch all form values for preview
  const formValues = watch()

  const {
    fields: teachingSkillFields,
    append: appendTeachingSkill,
    remove: removeTeachingSkill,
  } = useFieldArray({
    control,
    name: "teachingSkills",
  })

  const {
    fields: learningSkillFields,
    append: appendLearningSkill,
    remove: removeLearningSkill,
  } = useFieldArray({
    control,
    name: "learningSkills",
  })

  const {
    fields: achievementFields,
    append: appendAchievement,
    remove: removeAchievement,
  } = useFieldArray({
    control,
    name: "achievements",
  })

  const {
    fields: availabilityFields,
    append: appendAvailability,
    remove: removeAvailability,
  } = useFieldArray({
    control,
    name: "availability",
  })

  const {
    fields: socialLinkFields,
    append: appendSocialLink,
    remove: removeSocialLink,
  } = useFieldArray({
    control,
    name: "socialLinks",
  })

  const navigate = useNavigate()

  useEffect(() => {
    // Fetch current user data and prefill form
    async function fetchProfile() {
      setIsFetching(true)
      try {
        const res = await axios.get("http://localhost:5000/api/users/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        const profile = res.data

        // Set basic fields
        setValue("name", profile.name)
        setValue("location", profile.location || "")
        setValue("bio", profile.bio || "")

        // Set profile image if exists
        if (profile.profileImage) {
          setProfileImage(profile.profileImage)
        }

        // Set teaching skills if they exist
        if (profile.skillsICanTeach && profile.skillsICanTeach.length > 0) {
          const teachingSkills = profile.skillsICanTeach.map((skill: any) => ({
            _id: skill._id,
            name: skill.name,
            proficiency: skill.proficiency || "Intermediate",
          }))
          setValue("teachingSkills", teachingSkills)
        }

        // Set learning skills if they exist
        if (profile.skillsIWantToLearn && profile.skillsIWantToLearn.length > 0) {
          const learningSkills = profile.skillsIWantToLearn.map((skill: any) => ({
            _id: skill._id,
            name: skill.name,
            proficiency: skill.proficiency || "Beginner",
          }))
          setValue("learningSkills", learningSkills)
        }

        // Set achievements if they exist
        if (profile.achievements && profile.achievements.length > 0) {
          setValue("achievements", profile.achievements)
        }

        // Set availability if it exists
        if (profile.availability && profile.availability.length > 0) {
          setValue("availability", profile.availability)
        }

        // Set social links if they exist
        if (profile.socialLinks && profile.socialLinks.length > 0) {
          setValue("socialLinks", profile.socialLinks)
        }
      } catch (error) {
        console.error("Failed to load profile", error)
        toast.error("Failed to load profile data")
      } finally {
        setIsFetching(false)
      }
    }

    fetchProfile()
  }, [setValue])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)

      // Create a preview
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileImage(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "twitter":
        return <Twitter size={18} />
      case "instagram":
        return <Instagram size={18} />
      case "linkedin":
        return <Linkedin size={18} />
      case "facebook":
        return <Facebook size={18} />
      case "github":
        return <Github size={18} />
      default:
        return <Globe size={18} />
    }
  }

  const getProficiencyColor = (proficiency: string) => {
    switch (proficiency) {
      case "Beginner":
        return "bg-green-100 text-green-800"
      case "Intermediate":
        return "bg-blue-100 text-blue-800"
      case "Advanced":
        return "bg-purple-100 text-purple-800"
      case "Expert":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true)
    try {
      // Create FormData for file upload
      const formData = new FormData()

      // Add the file if it exists
      if (imageFile) {
        formData.append("profileImage", imageFile)
      }

      // Add basic fields
      formData.append("bio", data.bio)
      formData.append("location", data.location)

      // Convert arrays to JSON strings as expected by the backend
      formData.append("availability", JSON.stringify(data.availability))
      formData.append("socialLinks", JSON.stringify(data.socialLinks))
      formData.append("achievements", JSON.stringify(data.achievements))

      // Send the data
      const response = await axios.put("http://localhost:5000/api/users", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      toast.success("Profile updated successfully")
      navigate("/profile")
    } catch (error) {
      console.error("Update failed", error)
      toast.error("Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#E5EFF9] to-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#0C4B93] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-[#0C4B93] font-medium">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E5EFF9] to-background flex">
  {/* Sidebar */}
  <div className="fixed top-0 left-0 h-full w-64 z-30">
    <AppSidebar />
  </div>

  {/* Main content wrapper (shifted right by sidebar width) */}
  <div className="flex-1 flex flex-col ml-0 lg:ml-64">
    {/* Header */}
    <header className="bg-white shadow-sm p-4 border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <button
          onClick={() => navigate("/profile")}
          className="inline-flex items-center text-[#0C4B93] hover:text-[#064283] font-medium"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Profile
        </button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowPreview(true)}
          className="flex items-center gap-2"
        >
          <Eye size={18} />
          Preview Profile
        </Button>
      </div>
    </header>

        {showPreview && (
          <ProfilePreview
            name={formValues.name}
            location={formValues.location}
            bio={formValues.bio}
            profileImage={profileImage}
            teachingSkills={formValues.teachingSkills}
            learningSkills={formValues.learningSkills}
            achievements={formValues.achievements}
            availability={formValues.availability}
            socialLinks={formValues.socialLinks}
            onClose={() => setShowPreview(false)}
          />
        )}

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Profile Image Section */}
              <Card className="mb-6">
                <CardHeader className="bg-gradient-to-r from-[#0C4B93] to-[#106CC8] text-white rounded-t-lg">
                  <CardTitle className="text-white">Profile Image</CardTitle>
                  <CardDescription className="text-blue-100">
                    Upload a photo to personalize your profile
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full bg-[#D7E9F7] flex items-center justify-center overflow-hidden border-2 border-[#0C4B93]">
                        {profileImage ? (
                          <img
                            src={profileImage || "/placeholder.svg"}
                            alt="Profile"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.error("Failed to load image:", profileImage)
                              e.currentTarget.onerror = null
                              e.currentTarget.src = "https://via.placeholder.com/300?text=Profile"
                            }}
                          />
                        ) : (
                          <span className="text-[#0C4B93] text-5xl font-bold">?</span>
                        )}
                      </div>
                    </div>

                    <div className="flex-1">
                      <label className="block text-sm font-medium text-[#0C4B93] mb-2">Profile Photo</label>
                      <div className="flex items-center gap-4">
                        <label className="cursor-pointer">
                          <div className="flex items-center gap-2 px-4 py-2 bg-[#D7E9F7] text-[#0C4B93] rounded-lg hover:bg-[#C1DDF5] transition-colors">
                            <Upload size={18} />
                            <span>Upload Image</span>
                          </div>
                          <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                        </label>

                        {profileImage && (
                          <Button type="button" variant="outline" onClick={() => setProfileImage(null)}>
                            Remove
                          </Button>
                        )}
                      </div>
                      <p className="mt-2 text-xs text-gray-500">Recommended: Square image, at least 300x300 pixels</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Basic Information */}
              <Card className="mb-6">
                <CardHeader className="bg-gradient-to-r from-[#0C4B93] to-[#106CC8] text-white rounded-t-lg">
                  <CardTitle className="text-white">Basic Information</CardTitle>
                  <CardDescription className="text-blue-100">Tell others about yourself</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Input
                      label="Name"
                      placeholder="Your Name"
                      {...register("name", { required: "Name is required" })}
                      error={errors.name?.message}
                    />

                    <Input
                      label="Location"
                      placeholder="Your City/Country"
                      {...register("location", { required: "Location is required" })}
                      error={errors.location?.message}
                    />
                  </div>

                  <Textarea
                    label="Bio"
                    rows={4}
                    placeholder="Tell others about yourself, your interests, and what you hope to achieve"
                    {...register("bio", { required: "Bio is required" })}
                    error={errors.bio?.message}
                  />
                </CardContent>
              </Card>

              {/* Skills I Can Teach Section */}
              <Card className="mb-6">
                <CardHeader className="bg-gradient-to-r from-[#0C4B93] to-[#106CC8] text-white rounded-t-lg">
                  <CardTitle className="text-white">Skills I Can Teach</CardTitle>
                  <CardDescription className="text-blue-100">Share what you can teach others</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {teachingSkillFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-4">
                      <div className="flex-1">
                        <Input
                          label={index === 0 ? "Skill Name" : ""}
                          placeholder="e.g. JavaScript, Cooking, Piano"
                          {...register(`teachingSkills.${index}.name` as const, {
                            required: "Skill name is required",
                          })}
                          error={errors.teachingSkills?.[index]?.name?.message}
                        />
                      </div>

                      <div className="w-1/3">
                        <Select
                          value={field.proficiency}
                          onChange={(value) => setValue(`teachingSkills.${index}.proficiency`, value)}
                          options={[
                            { value: "Beginner", label: "Beginner" },
                            { value: "Intermediate", label: "Intermediate" },
                            { value: "Advanced", label: "Advanced" },
                            { value: "Expert", label: "Expert" },
                          ]}
                        />
                      </div>

                      <div className="flex items-end h-full pb-1">
                        <button
                          type="button"
                          onClick={() => removeTeachingSkill(index)}
                          className="text-red-500 hover:text-red-700 p-2"
                          title="Remove skill"
                          disabled={teachingSkillFields.length <= 1}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => appendTeachingSkill({ name: "", proficiency: "Intermediate" })}
                    className="mt-2"
                  >
                    <Plus size={18} className="mr-2" /> Add Teaching Skill
                  </Button>

                  <div className="mt-4 p-4 bg-[#D7E9F7] rounded-lg">
                    <h3 className="font-medium text-[#0C4B93] mb-2">Proficiency Levels Explained:</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800">Beginner</Badge>
                        <span>You have basic knowledge and can teach fundamentals</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge className="bg-blue-100 text-blue-800">Intermediate</Badge>
                        <span>You have practical experience and can teach beyond basics</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge className="bg-purple-100 text-purple-800">Advanced</Badge>
                        <span>You have extensive experience and can teach complex topics</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge className="bg-red-100 text-red-800">Expert</Badge>
                        <span>You have mastery and can teach at professional/advanced levels</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Skills I Want to Learn Section */}
              <Card className="mb-6">
                <CardHeader className="bg-gradient-to-r from-[#0C4B93] to-[#106CC8] text-white rounded-t-lg">
                  <CardTitle className="text-white">Skills I Want to Learn</CardTitle>
                  <CardDescription className="text-blue-100">Share what you're interested in learning</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {learningSkillFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-4">
                      <div className="flex-1">
                        <Input
                          label={index === 0 ? "Skill Name" : ""}
                          placeholder="e.g. Photography, Spanish, Yoga"
                          {...register(`learningSkills.${index}.name` as const, {
                            required: "Skill name is required",
                          })}
                          error={errors.learningSkills?.[index]?.name?.message}
                        />
                      </div>

                      <div className="w-1/3">
                        <Select
                          value={field.proficiency}
                          onChange={(value) => setValue(`learningSkills.${index}.proficiency`, value)}
                          options={[
                            { value: "Beginner", label: "Beginner" },
                            { value: "Intermediate", label: "Intermediate" },
                            { value: "Advanced", label: "Advanced" },
                          ]}
                        />
                      </div>

                      <div className="flex items-end h-full pb-1">
                        <button
                          type="button"
                          onClick={() => removeLearningSkill(index)}
                          className="text-red-500 hover:text-red-700 p-2"
                          title="Remove skill"
                          disabled={learningSkillFields.length <= 1}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => appendLearningSkill({ name: "", proficiency: "Beginner" })}
                    className="mt-2"
                  >
                    <Plus size={18} className="mr-2" /> Add Learning Skill
                  </Button>
                </CardContent>
              </Card>

              {/* Achievements Section */}
              <Card className="mb-6">
                <CardHeader className="bg-gradient-to-r from-[#0C4B93] to-[#106CC8] text-white rounded-t-lg">
                  <CardTitle className="text-white">Achievements</CardTitle>
                  <CardDescription className="text-blue-100">Showcase your accomplishments</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {achievementFields.map((field, index) => (
                    <div key={field.id} className="p-4 bg-[#E5EFF9] rounded-lg border border-[#D7E9F7]">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium text-[#0C4B93]">Achievement #{index + 1}</h3>
                        {achievementFields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeAchievement(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>

                      <div className="space-y-4">
                        <Input
                          label="Title"
                          placeholder="e.g. Certified Web Developer"
                          {...register(`achievements.${index}.title` as const, {
                            required: "Title is required",
                          })}
                          error={errors.achievements?.[index]?.title?.message}
                        />

                        <Textarea
                          label="Description"
                          rows={2}
                          placeholder="Briefly describe this achievement"
                          {...register(`achievements.${index}.description` as const)}
                        />
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => appendAchievement({ title: "", description: "" })}
                    className="mt-2"
                  >
                    <Plus size={18} className="mr-2" /> Add Achievement
                  </Button>
                </CardContent>
              </Card>

              {/* Availability Section */}
              <Card className="mb-6">
                <CardHeader className="bg-gradient-to-r from-[#0C4B93] to-[#106CC8] text-white rounded-t-lg">
                  <CardTitle className="text-white">Availability</CardTitle>
                  <CardDescription className="text-blue-100">
                    Let others know when you're available to teach
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {availabilityFields.map((field, index) => (
                    <div key={field.id} className="p-4 bg-[#E5EFF9] rounded-lg border border-[#D7E9F7]">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium text-[#0C4B93]">Time Slot #{index + 1}</h3>
                        {availabilityFields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeAvailability(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <Select
                          value={field.day}
                          onChange={(value) => setValue(`availability.${index}.day`, value)}
                          options={[
                            { value: "Monday", label: "Monday" },
                            { value: "Tuesday", label: "Tuesday" },
                            { value: "Wednesday", label: "Wednesday" },
                            { value: "Thursday", label: "Thursday" },
                            { value: "Friday", label: "Friday" },
                            { value: "Saturday", label: "Saturday" },
                            { value: "Sunday", label: "Sunday" },
                          ]}
                        />

                        <div>
                          <label className="block text-sm font-medium text-[#0C4B93] mb-1">Start Time</label>
                          <input
                            type="time"
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0C4B93] focus:border-[#0C4B93]"
                            {...register(`availability.${index}.startTime` as const, {
                              required: "Start time is required",
                            })}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[#0C4B93] mb-1">End Time</label>
                          <input
                            type="time"
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0C4B93] focus:border-[#0C4B93]"
                            {...register(`availability.${index}.endTime` as const, {
                              required: "End time is required",
                            })}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => appendAvailability({ day: "Monday", startTime: "09:00", endTime: "17:00" })}
                    className="mt-2"
                  >
                    <Plus size={18} className="mr-2" /> Add Time Slot
                  </Button>
                </CardContent>
              </Card>

              {/* Social Links Section */}
              <Card className="mb-6">
                <CardHeader className="bg-gradient-to-r from-[#0C4B93] to-[#106CC8] text-white rounded-t-lg">
                  <CardTitle className="text-white">Social Links</CardTitle>
                  <CardDescription className="text-blue-100">Connect your social profiles</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {socialLinkFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-4">
                      <Select
                        value={field.platform}
                        onChange={(value) => setValue(`socialLinks.${index}.platform`, value)}
                        options={[
                          { value: "twitter", label: "Twitter" },
                          { value: "instagram", label: "Instagram" },
                          { value: "linkedin", label: "LinkedIn" },
                          { value: "facebook", label: "Facebook" },
                          { value: "github", label: "GitHub" },
                          { value: "website", label: "Website" },
                        ]}
                        className="w-1/3"
                      />

                      <div className="flex-1 relative">
                        <Input
                          placeholder="https://"
                          {...register(`socialLinks.${index}.url` as const, {
                            pattern: {
                              value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                              message: "Please enter a valid URL",
                            },
                          })}
                          error={errors.socialLinks?.[index]?.url?.message}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => removeSocialLink(index)}
                        className="text-red-500 hover:text-red-700 p-2"
                        disabled={socialLinkFields.length <= 1}
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => appendSocialLink({ platform: "twitter", url: "" })}
                    className="mt-2"
                  >
                    <Plus size={18} className="mr-2" /> Add Social Link
                  </Button>
                </CardContent>
              </Card>

              {/* Form Actions */}
              <div className="flex gap-4 justify-end mt-8">
                <Button type="button" variant="outline" onClick={() => navigate("/profile")}>
                  Cancel
                </Button>

                <Button type="submit" variant="default" disabled={isSubmitting || isLoading}>
                  {isSubmitting || isLoading ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
