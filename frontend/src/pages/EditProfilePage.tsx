"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import Input from "../components/ui/Input"
import Button from "../components/ui/Button"
import Textarea from "../components/ui/Textarea"
import Select from "../components/ui/Select"
import Card from "../components/ui/Card"
import PageHeader from "../components/layout/PageHeader"
import { Plus, Trash2, Upload, X, Instagram, Twitter, Linkedin, Globe, Facebook, Github } from "lucide-react"
import axios from "axios"

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
  skillsICanTeach: string
  skillsToLearn: string
  achievements: Achievement[]
  availability: Availability[]
  socialLinks: SocialLink[]
}

export default function EditProfilePage() {
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { isSubmitting, errors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      achievements: [{ title: "", description: "" }],
      availability: [{ day: "Monday", startTime: "09:00", endTime: "17:00" }],
      socialLinks: [{ platform: "twitter", url: "" }],
    },
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
    async function fetchProfile() {
      const res = await axios.get("http://localhost:5000/api/users/profile");
      const profile = res.data;
  
      setValue("name", profile.name);
      setValue("location", profile.location);
      setValue("bio", profile.bio);
      setValue("skillsICanTeach", profile.skillsICanTeach.join(", "));
      setValue("skillsToLearn", profile.skillsToLearn?.join(", ") || "");
  
      if (profile.profileImage) {
        setProfileImage(profile.profileImage);
      }
  
      if (profile.achievements?.length > 0) {
        setValue("achievements", profile.achievements);
      }
  
      if (profile.availability?.length > 0) {
        setValue("availability", profile.availability);
      }
  
      if (profile.socialLinks?.length > 0) {
        setValue("socialLinks", profile.socialLinks);
      }
    }
  
    fetchProfile();
  }, [setValue]);
  

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

  const onSubmit = async (data: ProfileFormData) => {
    try {
      // Create FormData for file upload
      const formData = new FormData()

      if (imageFile) {
        formData.append("profileImage", imageFile)
      }

      // Process skills arrays
      const payload = {
        ...data,
        skillsICanTeach: data.skillsICanTeach
          .split(",")
          .map((skill: string) => skill.trim())
          .filter(Boolean),
        skillsToLearn: data.skillsToLearn
          .split(",")
          .map((skill: string) => skill.trim())
          .filter(Boolean),
      }

      // Append JSON data
      formData.append("data", JSON.stringify(payload))

      // Send the data
      await axios.put("/api/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      navigate("/profile")
    } catch (error) {
      console.error("Update failed", error)
    }
  }

  return (
    <div className="bg-[#FFF7D4] min-h-screen pb-20">
      <PageHeader title="Edit Your Profile" backTo="/profile" backLabel="Back to Profile" />

      <div className="max-w-3xl mx-auto p-4 md:p-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Profile Image Section */}
          <Card variant="default" className="overflow-hidden mb-6">
            <div className="bg-[#4a3630] text-white p-4">
              <h2 className="text-xl font-bold">Profile Image</h2>
              <p className="text-sm opacity-80">Upload a photo to personalize your profile</p>
            </div>

            <div className="p-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-[#FBEAA0] flex items-center justify-center overflow-hidden border-2 border-[#4a3630]">
                    {profileImage ? (
                      <img
                        src={profileImage || "/placeholder.svg"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[#4a3630] text-5xl font-bold">
                        {/* Display first letter of name if available */}?
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2">Profile Photo</label>
                  <div className="flex items-center gap-4">
                    <label className="cursor-pointer">
                      <div className="flex items-center gap-2 px-4 py-2 bg-[#FBEAA0] text-[#4a3630] rounded-lg hover:bg-[#f5e28b] transition-colors">
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
            </div>
          </Card>

          {/* Basic Information */}
          <Card variant="default" className="overflow-hidden mb-6">
            <div className="bg-[#4a3630] text-white p-4">
              <h2 className="text-xl font-bold">Basic Information</h2>
              <p className="text-sm opacity-80">Tell others about yourself</p>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Input
                    label="Name"
                    variant="yellow"
                    placeholder="Your Name"
                    {...register("name", { required: "Name is required" })}
                    error={errors.name?.message}
                  />
                </div>

                <div>
                  <Input
                    label="Location"
                    variant="yellow"
                    placeholder="Your City/Country"
                    {...register("location", { required: "Location is required" })}
                    error={errors.location?.message}
                  />
                </div>
              </div>

              <div>
                <Textarea
                  label="Bio"
                  variant="yellow"
                  rows={4}
                  placeholder="Tell others about yourself, your interests, and what you hope to achieve"
                  {...register("bio", { required: "Bio is required" })}
                  error={errors.bio?.message}
                />
              </div>
            </div>
          </Card>

          {/* Skills Section */}
          <Card variant="default" className="overflow-hidden mb-6">
            <div className="bg-[#4a3630] text-white p-4">
              <h2 className="text-xl font-bold">Skills</h2>
              <p className="text-sm opacity-80">Share what you can teach and what you want to learn</p>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <Input
                  label="Skills You Can Teach (comma separated)"
                  variant="yellow"
                  placeholder="e.g. JavaScript, Cooking, Piano"
                  {...register("skillsICanTeach", { required: "Please enter at least one skill you can teach" })}
                  error={errors.skillsICanTeach?.message}
                />
                <p className="mt-1 text-xs text-gray-500">
                  List skills you're proficient in and willing to teach others
                </p>
              </div>

              <div>
                <Input
                  label="Skills You Want to Learn (comma separated)"
                  variant="yellow"
                  placeholder="e.g. Photography, Spanish, Yoga"
                  {...register("skillsToLearn", { required: "Please enter at least one skill you want to learn" })}
                  error={errors.skillsToLearn?.message}
                />
                <p className="mt-1 text-xs text-gray-500">List skills you're interested in learning from others</p>
              </div>
            </div>
          </Card>

          {/* Achievements Section */}
          <Card variant="default" className="overflow-hidden mb-6">
            <div className="bg-[#4a3630] text-white p-4">
              <h2 className="text-xl font-bold">Achievements</h2>
              <p className="text-sm opacity-80">Showcase your accomplishments</p>
            </div>

            <div className="p-6 space-y-4">
              {achievementFields.map((field, index) => (
                <div key={field.id} className="p-4 bg-[#FFF7D4] rounded-lg border border-[#FBEAA0]">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium">Achievement #{index + 1}</h3>
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
                      variant="yellow"
                      placeholder="e.g. Certified Web Developer"
                      {...register(`achievements.${index}.title` as const, {
                        required: "Title is required",
                      })}
                      error={errors.achievements?.[index]?.title?.message}
                    />

                    <Textarea
                      label="Description"
                      variant="yellow"
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
            </div>
          </Card>

          {/* Availability Section */}
          <Card variant="default" className="overflow-hidden mb-6">
            <div className="bg-[#4a3630] text-white p-4">
              <h2 className="text-xl font-bold">Availability</h2>
              <p className="text-sm opacity-80">Let others know when you're available to teach</p>
            </div>

            <div className="p-6 space-y-4">
              {availabilityFields.map((field, index) => (
                <div key={field.id} className="p-4 bg-[#FFF7D4] rounded-lg border border-[#FBEAA0]">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium">Time Slot #{index + 1}</h3>
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
                      label="Day"
                      options={[
                        { value: "Monday", label: "Monday" },
                        { value: "Tuesday", label: "Tuesday" },
                        { value: "Wednesday", label: "Wednesday" },
                        { value: "Thursday", label: "Thursday" },
                        { value: "Friday", label: "Friday" },
                        { value: "Saturday", label: "Saturday" },
                        { value: "Sunday", label: "Sunday" },
                      ]}
                      {...register(`availability.${index}.day` as const, {
                        required: "Day is required",
                      })}
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                      <input
                        type="time"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4a3630] focus:border-transparent bg-[#FBEAA0]"
                        {...register(`availability.${index}.startTime` as const, {
                          required: "Start time is required",
                        })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                      <input
                        type="time"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4a3630] focus:border-transparent bg-[#FBEAA0]"
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
            </div>
          </Card>

          {/* Social Links Section */}
          <Card variant="default" className="overflow-hidden mb-6">
            <div className="bg-[#4a3630] text-white p-4">
              <h2 className="text-xl font-bold">Social Links</h2>
              <p className="text-sm opacity-80">Connect your social profiles</p>
            </div>

            <div className="p-6 space-y-4">
              {socialLinkFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-4">
                  <Select
                    options={[
                      { value: "twitter", label: "Twitter" },
                      { value: "instagram", label: "Instagram" },
                      { value: "linkedin", label: "LinkedIn" },
                      { value: "facebook", label: "Facebook" },
                      { value: "github", label: "GitHub" },
                      { value: "website", label: "Website" },
                    ]}
                    className="w-1/3"
                    {...register(`socialLinks.${index}.platform` as const)}
                  />

                  <div className="flex-1 relative">
                    <Input
                      placeholder="https://"
                      variant="yellow"
                      leftIcon={getSocialIcon(field.platform)}
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
            </div>
          </Card>

          {/* Form Actions */}
          <div className="flex gap-4 justify-end mt-8">
            <Button type="button" variant="outline" onClick={() => navigate("/profile")}>
              Cancel
            </Button>

            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
