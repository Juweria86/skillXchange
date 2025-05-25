"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../hooks/useTypedHooks"
import { getSkills, addSkill, editSkill, removeSkill } from "../features/skill/skillSlice"
import { PlusCircle, Edit, Trash2, Star, X, BookOpen, TrendingUp } from "lucide-react"
import AppSidebar from "../components/AppSidebar"
import PageHeader from "../components/layout/PageHeader"
import Select from "@/components/ui/Select"
import { toast } from "react-hot-toast"

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

const Badge = ({ children, className = "", ...props }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#D7E9F7] text-[#0C4B93] ${className}`}
    {...props}
  >
    {children}
  </span>
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

const Input = ({ className = "", ...props }) => (
  <input
    className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C4B93] focus:border-[#0C4B93] ${className}`}
    {...props}
  />
)

const Label = ({ children, className = "", ...props }) => (
  <label className={`block text-sm font-medium text-[#0C4B93] mb-2 ${className}`} {...props}>
    {children}
  </label>
)

const Textarea = ({ className = "", ...props }) => (
  <textarea
    className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C4B93] focus:border-[#0C4B93] resize-none ${className}`}
    {...props}
  />
)

function SkillsTab({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      className={`flex-1 py-3 text-center font-medium rounded-lg transition-colors ${
        active ? "bg-[#0C4B93] text-white" : "bg-white text-gray-700 hover:bg-[#E5EFF9]"
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  )
}

function SkillCard({
  skill,
  onEdit,
  onDelete,
}: {
  skill: any
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-[#0C4B93]">{skill.name}</h3>
          <Badge
            className={
              skill.level === "Expert"
                ? "bg-green-100 text-green-800 hover:bg-green-100"
                : skill.level === "Intermediate"
                  ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                  : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
            }
          >
            {skill.level}
          </Badge>
        </div>

        {skill.rating && (
          <div className="flex mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={i < skill.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
              />
            ))}
          </div>
        )}

        {skill.experience && (
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-medium text-[#0C4B93]">Experience:</span> {skill.experience}
          </p>
        )}

        {skill.description && <p className="text-sm text-gray-600 mb-4">{skill.description}</p>}

        {skill.goal && (
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-medium text-[#0C4B93]">Goal:</span> {skill.goal}
          </p>
        )}

        {skill.reason && <p className="text-sm text-gray-600 mb-4">{skill.reason}</p>}

        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-[#0C4B93] text-[#0C4B93] hover:bg-[#E5EFF9]"
            onClick={onEdit}
          >
            <Edit size={14} className="mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
            onClick={onDelete}
          >
            <Trash2 size={14} className="mr-2" />
            Remove
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function AddSkillCard({ onClick }: { onClick: () => void }) {
  return (
    <Card
      className="border-2 border-dashed border-[#D7E9F7] hover:border-[#0C4B93] transition-colors cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-6 flex flex-col items-center justify-center h-full text-center">
        <div className="w-16 h-16 bg-[#E5EFF9] rounded-full flex items-center justify-center mb-4">
          <PlusCircle size={32} className="text-[#0C4B93]" />
        </div>
        <h3 className="font-semibold text-[#0C4B93] mb-2">Add a new skill</h3>
        <p className="text-sm text-gray-600 mb-4">Share your expertise or learn something new</p>
        <Button variant="outline" className="border-[#0C4B93] text-[#0C4B93] hover:bg-[#E5EFF9]">
          Add Skill
        </Button>
      </CardContent>
    </Card>
  )
}

function SkillForm({
  type,
  initialData,
  onCancel,
  onSubmit,
}: {
  type: "teaching" | "learning"
  initialData?: any
  onCancel: () => void
  onSubmit: (data: any) => void
}) {
  const [formData, setFormData] = useState(
    initialData || {
      name: "",
      level: "Beginner",
      experience: "",
      description: "",
      rating: 3,
      goal: "",
      reason: "",
    },
  )

  const handleChange = (name: string, value: string | number) => {
    setFormData((prev: any) => ({
      ...prev,
      [name]: name === "rating" ? Number.parseInt(value as string) : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md border-none shadow-xl">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-[#0C4B93]">
              {initialData ? "Edit" : "Add"} {type === "teaching" ? "Teaching" : "Learning"} Skill
            </CardTitle>
            <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-[#0C4B93]">Skill Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="border-gray-200 focus:border-[#0C4B93] focus:ring-[#0C4B93]"
                required
              />
            </div>

            <div>
              <Label className="text-[#0C4B93]">Level</Label>
              <Select
                value={formData.level}
                onChange={(value) => handleChange("level", value)}
                options={[
                  { value: "Beginner", label: "Beginner" },
                  { value: "Intermediate", label: "Intermediate" },
                  ...(type === "teaching" ? [{ value: "Expert", label: "Expert" }] : []),
                ]}
                className="border-gray-200 focus:border-[#0C4B93] focus:ring-[#0C4B93]"
              />
            </div>

            {type === "teaching" ? (
              <>
                <div>
                  <Label className="text-[#0C4B93]">Experience</Label>
                  <Input
                    value={formData.experience}
                    onChange={(e) => handleChange("experience", e.target.value)}
                    className="border-gray-200 focus:border-[#0C4B93] focus:ring-[#0C4B93]"
                    required
                  />
                </div>

                <div>
                  <Label className="text-[#0C4B93]">Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    rows={3}
                    className="border-gray-200 focus:border-[#0C4B93] focus:ring-[#0C4B93]"
                    required
                  />
                </div>

                <div>
                  <Label className="text-[#0C4B93]">Rating</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={formData.rating}
                      onChange={(e) => handleChange("rating", e.target.value)}
                      className="flex-1"
                    />
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < formData.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <Label className="text-[#0C4B93]">Goal</Label>
                  <Input
                    value={formData.goal}
                    onChange={(e) => handleChange("goal", e.target.value)}
                    className="border-gray-200 focus:border-[#0C4B93] focus:ring-[#0C4B93]"
                    required
                  />
                </div>

                <div>
                  <Label className="text-[#0C4B93]">Reason for Learning</Label>
                  <Textarea
                    value={formData.reason}
                    onChange={(e) => handleChange("reason", e.target.value)}
                    rows={3}
                    className="border-gray-200 focus:border-[#0C4B93] focus:ring-[#0C4B93]"
                    required
                  />
                </div>
              </>
            )}

            <div className="flex space-x-2 pt-4">
              <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-[#0C4B93] hover:bg-[#064283]">
                {initialData ? "Update" : "Add"} Skill
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function MySkillsPage() {
  const dispatch = useAppDispatch()
  const { skills = [], loading = false, error = null } = useAppSelector((state) => state.skills || {})
  const { token, user } = useAppSelector((state) => state.auth)

  const [activeTab, setActiveTab] = useState<"teaching" | "learning">("teaching")
  const [showForm, setShowForm] = useState(false)
  const [editingSkill, setEditingSkill] = useState<any>(null)
  const [formType, setFormType] = useState<"teaching" | "learning">("teaching")

  useEffect(() => {
    if (token) {
      dispatch(getSkills(token))
    }
  }, [dispatch, token])

  const teachingSkills = skills.filter((skill) => skill.type === "teaching")
  const learningSkills = skills.filter((skill) => skill.type === "learning")

  const handleAddSkillClick = (type: "teaching" | "learning") => {
    setFormType(type)
    setEditingSkill(null)
    setShowForm(true)
  }

  const handleEditSkillClick = (skill: any, type: "teaching" | "learning") => {
    setFormType(type)
    setEditingSkill(skill)
    setShowForm(true)
  }

  const handleDeleteSkillClick = async (id: string) => {
    try {
      await dispatch(removeSkill({ token, id })).unwrap()
      toast.success("Skill deleted successfully")
    } catch (error) {
      toast.error("Failed to delete skill")
      console.error("Delete skill error:", error)
    }
  }

  const handleSubmitSkill = async (formData: any) => {
    try {
      if (editingSkill) {
        await dispatch(
          editSkill({
            token,
            id: editingSkill._id,
            skillData: {
              ...formData,
              type: formType,
              user: user?._id,
            },
          }),
        ).unwrap()
        toast.success("Skill updated successfully")
      } else {
        await dispatch(
          addSkill({
            token,
            skillData: {
              ...formData,
              type: formType,
              user: user?._id,
            },
          }),
        ).unwrap()
        toast.success("Skill added successfully")
      }
      setShowForm(false)
      setEditingSkill(null)
    } catch (error) {
      toast.error("Failed to save skill")
      console.error("Save skill error:", error)
    }
  }

  if (loading && skills.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#E5EFF9] to-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0C4B93] mx-auto"></div>
          <p className="mt-4 text-[#0C4B93] font-medium">Loading your skills...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#E5EFF9] to-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <div className="text-red-500 mb-4">Error loading skills</div>
            <p className="text-gray-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
<div className="min-h-screen bg-gradient-to-b from-[#E5EFF9] to-background flex">
  {/* Sidebar fixed to the left */}
  <div className="fixed top-0 left-0 h-full w-64 z-30">
    <AppSidebar />
  </div>

  {/* Main content shifted to the right of the sidebar */}
  <div className="flex-1 flex flex-col ml-0 lg:ml-64">
    <PageHeader title="My Skills" backTo="/home-dashboard">
      <Button
        className="bg-[#0C4B93] hover:bg-[#064283]"
        onClick={() => handleAddSkillClick(activeTab)}
      >
        <PlusCircle size={16} className="mr-2" />
        Add New Skill
      </Button>
    </PageHeader>

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="border-none shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#D7E9F7] rounded-full flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-[#0C4B93]" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#0C4B93]">{teachingSkills.length}</h3>
                      <p className="text-gray-600">Skills I Can Teach</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#E5EFF9] rounded-full flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-[#0C4B93]" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#0C4B93]">{learningSkills.length}</h3>
                      <p className="text-gray-600">Skills I Want to Learn</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tab Navigation */}
            <Card className="border-none shadow-md mb-6">
              <CardContent className="p-2">
                <div className="grid grid-cols-2 gap-2">
                  <SkillsTab
                    active={activeTab === "teaching"}
                    label="Skills I Can Teach"
                    onClick={() => setActiveTab("teaching")}
                  />
                  <SkillsTab
                    active={activeTab === "learning"}
                    label="Skills I Want to Learn"
                    onClick={() => setActiveTab("learning")}
                  />
                </div>
              </CardContent>
            </Card>

            {showForm && (
              <SkillForm
                type={formType}
                initialData={editingSkill}
                onCancel={() => {
                  setShowForm(false)
                  setEditingSkill(null)
                }}
                onSubmit={handleSubmitSkill}
              />
            )}

            {/* Skills Grid */}
            {activeTab === "teaching" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teachingSkills.map((skill) => (
                  <SkillCard
                    key={skill._id}
                    skill={skill}
                    onEdit={() => handleEditSkillClick(skill, "teaching")}
                    onDelete={() => handleDeleteSkillClick(skill._id)}
                  />
                ))}
                <AddSkillCard onClick={() => handleAddSkillClick("teaching")} />
              </div>
            )}

            {activeTab === "learning" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {learningSkills.map((skill) => (
                  <SkillCard
                    key={skill._id}
                    skill={skill}
                    onEdit={() => handleEditSkillClick(skill, "learning")}
                    onDelete={() => handleDeleteSkillClick(skill._id)}
                  />
                ))}
                <AddSkillCard onClick={() => handleAddSkillClick("learning")} />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
