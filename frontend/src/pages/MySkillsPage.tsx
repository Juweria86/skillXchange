/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { PlusCircle, Edit, Trash2, Star, X } from "lucide-react"
import { useState } from "react";
import AppSidebar from "../components/AppSidebar"
import PageHeader from "../components/layout/PageHeader"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import Badge from "../components/ui/Badge"

// Tab component for the skills page
function SkillsTab({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      className={`flex-1 py-3 text-center font-medium rounded-lg transition-colors ${
        active ? "bg-[#FBEAA0] text-[#4a3630]" : "bg-white text-gray-700 hover:bg-gray-100"
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  )
}

// Skill card component
function SkillCard({
  name,
  level,
  experience,
  description,
  rating,
  onEdit,
  onDelete,
}: {
  name: string
  level: string
  experience: string
  description: string
  rating: number
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <Card className="overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold">{name}</h3>
          <Badge variant={level === "Expert" ? "green" : level === "Intermediate" ? "blue" : "yellow"} className="ml-2">
            {level}
          </Badge>
        </div>

        <div className="flex mb-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={16} className={i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"} />
          ))}
        </div>

        <p className="text-sm text-gray-500 mb-2">
          <span className="font-medium">Experience:</span> {experience}
        </p>

        <p className="text-sm text-gray-600 mb-4">{description}</p>

        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            leftIcon={<Edit size={14} />} 
            className="flex-1"
            onClick={onEdit}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Trash2 size={14} />}
            className="flex-1 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
            onClick={onDelete}
          >
            Remove
          </Button>
        </div>
      </div>
    </Card>
  )
}

// Learning skill card component
function LearningSkillCard({
  name,
  level,
  goal,
  reason,
  onEdit,
  onDelete,
}: {
  name: string
  level: string
  goal: string
  reason: string
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <Card className="overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold">{name}</h3>
          <Badge variant="blue">{level}</Badge>
        </div>

        <p className="text-sm text-gray-500 mb-2">
          <span className="font-medium">Goal:</span> {goal}
        </p>

        <p className="text-sm text-gray-600 mb-4">{reason}</p>

        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            leftIcon={<Edit size={14} />} 
            className="flex-1"
            onClick={onEdit}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Trash2 size={14} />}
            className="flex-1 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
            onClick={onDelete}
          >
            Remove
          </Button>
        </div>
      </div>
    </Card>
  )
}

// Add new skill card component
function AddSkillCard({ type, onClick }: { type: "teaching" | "learning"; onClick: () => void }) {
  return (
    <Card className="bg-gray-50 border border-dashed border-gray-300 flex flex-col items-center justify-center p-6 h-full hover:bg-gray-100 cursor-pointer transition-colors">
      <PlusCircle size={40} className="text-gray-400 mb-2" />
      <p className="text-gray-500 text-center">Add a new skill you can {type === "teaching" ? "teach" : "learn"}</p>
      <Button variant="outline" className="mt-4" onClick={onClick}>
        Add Skill
      </Button>
    </Card>
  )
}

// Skill form component
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
    }
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev: any) => ({
      ...prev,
      [name]: name === "rating" ? parseInt(value) : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Card className="overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {initialData ? "Edit" : "Add"} {type === "teaching" ? "Teaching" : "Learning"} Skill
          </h3>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skill Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FBEAA0]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FBEAA0]"
                required
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                {type === "teaching" && <option value="Expert">Expert</option>}
              </select>
            </div>

            {type === "teaching" ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FBEAA0]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FBEAA0]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                  <div className="flex items-center">
                    <input
                      type="range"
                      name="rating"
                      min="1"
                      max="5"
                      value={formData.rating}
                      onChange={handleChange}
                      className="w-full mr-3"
                    />
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} className={i < formData.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"} />
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Goal</label>
                  <input
                    type="text"
                    name="goal"
                    value={formData.goal}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FBEAA0]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Learning</label>
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FBEAA0]"
                    required
                  />
                </div>
              </>
            )}

            <div className="flex space-x-2 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="flex-1">
                {initialData ? "Update" : "Add"} Skill
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Card>
  )
}

export default function MySkillsPage() {
  const [activeTab, setActiveTab] = useState<"teaching" | "learning">("teaching");
  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState<any>(null);
  const [formType, setFormType] = useState<"teaching" | "learning">("teaching");

  // Sample data - in a real app, this would come from an API or state management
  const [teachingSkills, setTeachingSkills] = useState([
    {
      id: 1,
      name: "JavaScript",
      level: "Expert",
      experience: "5 years",
      description: "Modern JavaScript including ES6+, async/await, and functional programming concepts.",
      rating: 5,
    },
    {
      id: 2,
      name: "React",
      level: "Expert",
      experience: "4 years",
      description: "React fundamentals, hooks, context API, and state management with Redux.",
      rating: 5,
    },
    {
      id: 3,
      name: "Node.js",
      level: "Intermediate",
      experience: "3 years",
      description: "Building RESTful APIs, authentication, and database integration.",
      rating: 4,
    },
  ]);

  const [learningSkills, setLearningSkills] = useState([
    {
      id: 1,
      name: "Python",
      level: "Beginner",
      goal: "Build data analysis tools",
      reason: "To expand my backend development skills and explore data science.",
    },
    {
      id: 2,
      name: "UI/UX Design",
      level: "Beginner",
      goal: "Create user-friendly interfaces",
      reason: "To better understand the design process and collaborate with designers.",
    },
  ]);

  const handleAddSkill = (type: "teaching" | "learning") => {
    setFormType(type);
    setEditingSkill(null);
    setShowForm(true);
  };

  const handleEditSkill = (skill: any, type: "teaching" | "learning") => {
    setFormType(type);
    setEditingSkill(skill);
    setShowForm(true);
  };

  const handleDeleteSkill = (id: number, type: "teaching" | "learning") => {
    if (type === "teaching") {
      setTeachingSkills(teachingSkills.filter(skill => skill.id !== id));
    } else {
      setLearningSkills(learningSkills.filter(skill => skill.id !== id));
    }
  };

  const handleSubmitSkill = (data: any) => {
    if (formType === "teaching") {
      if (editingSkill) {
        // Update existing teaching skill
        setTeachingSkills(
          teachingSkills.map(skill =>
            skill.id === editingSkill.id ? { ...skill, ...data, id: editingSkill.id } : skill
          )
        );
      } else {
        // Add new teaching skill
        setTeachingSkills([
          ...teachingSkills,
          {
            ...data,
            id: Math.max(0, ...teachingSkills.map(skill => skill.id)) + 1,
          },
        ]);
      }
    } else {
      if (editingSkill) {
        // Update existing learning skill
        setLearningSkills(
          learningSkills.map(skill =>
            skill.id === editingSkill.id ? { ...skill, ...data, id: editingSkill.id } : skill
          )
        );
      } else {
        // Add new learning skill
        setLearningSkills([
          ...learningSkills,
          {
            ...data,
            id: Math.max(0, ...learningSkills.map(skill => skill.id)) + 1,
          },
        ]);
      }
    }
    setShowForm(false);
    setEditingSkill(null);
  };

  return (
    <div className="flex min-h-screen bg-[#FFF7D4]">
      <AppSidebar />

      <div className="flex-1 flex flex-col">
        <PageHeader title="My Skills" backTo="/home-dashboard">
          <Button 
            variant="primary" 
            leftIcon={<PlusCircle size={16} />}
            onClick={() => handleAddSkill(activeTab)}
          >
            Add New Skill
          </Button>
        </PageHeader>

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm p-1 mb-6">
              <div className="grid grid-cols-2 gap-1">
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
            </div>

            {/* Form Modal Overlay */}
            {showForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="w-full max-w-md">
                  <SkillForm
                    type={formType}
                    initialData={editingSkill}
                    onCancel={() => {
                      setShowForm(false);
                      setEditingSkill(null);
                    }}
                    onSubmit={handleSubmitSkill}
                  />
                </div>
              </div>
            )}

            {/* Teaching Skills */}
            {activeTab === "teaching" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teachingSkills.map(skill => (
                  <SkillCard
                    key={skill.id}
                    name={skill.name}
                    level={skill.level}
                    experience={skill.experience}
                    description={skill.description}
                    rating={skill.rating}
                    onEdit={() => handleEditSkill(skill, "teaching")}
                    onDelete={() => handleDeleteSkill(skill.id, "teaching")}
                  />
                ))}
                <AddSkillCard 
                  type="teaching" 
                  onClick={() => handleAddSkill("teaching")} 
                />
              </div>
            )}

            {/* Learning Skills */}
            {activeTab === "learning" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {learningSkills.map(skill => (
                  <LearningSkillCard
                    key={skill.id}
                    name={skill.name}
                    level={skill.level}
                    goal={skill.goal}
                    reason={skill.reason}
                    onEdit={() => handleEditSkill(skill, "learning")}
                    onDelete={() => handleDeleteSkill(skill.id, "learning")}
                  />
                ))}
                <AddSkillCard 
                  type="learning" 
                  onClick={() => handleAddSkill("learning")} 
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}