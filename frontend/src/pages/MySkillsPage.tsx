import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/useTypedHooks";
import { getSkills, addSkill, editSkill, removeSkill } from "../features/skill/skillSlice";
import { PlusCircle, Edit, Trash2, Star, X } from "lucide-react";
import AppSidebar from "../components/AppSidebar";
import PageHeader from "../components/layout/PageHeader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { toast } from "react-hot-toast";

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
  );
}

function SkillCard({
  skill,
  onEdit,
  onDelete,
}: {
  skill: any;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Card className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold">{skill.name}</h3>
          <Badge variant={skill.level === "Expert" ? "green" : skill.level === "Intermediate" ? "blue" : "yellow"}>
            {skill.level}
          </Badge>
        </div>

        {skill.rating && (
          <div className="flex mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} className={i < skill.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"} />
            ))}
          </div>
        )}

        {skill.experience && (
          <p className="text-sm text-gray-500 mb-2">
            <span className="font-medium">Experience:</span> {skill.experience}
          </p>
        )}

        {skill.description && (
          <p className="text-sm text-gray-600 mb-4">{skill.description}</p>
        )}

        {skill.goal && (
          <p className="text-sm text-gray-500 mb-2">
            <span className="font-medium">Goal:</span> {skill.goal}
          </p>
        )}

        {skill.reason && (
          <p className="text-sm text-gray-600 mb-4">{skill.reason}</p>
        )}

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
  );
}

function AddSkillCard({ onClick }: { onClick: () => void }) {
  return (
    <div className="bg-gray-50 rounded-lg border border-dashed border-gray-300 flex flex-col items-center justify-center p-6 h-full hover:bg-gray-100 cursor-pointer transition-colors">
      <PlusCircle size={40} className="text-gray-400 mb-2" />
      <p className="text-gray-500 text-center">Add a new skill</p>
      <Button variant="outline" className="mt-4" onClick={onClick}>
        Add Skill
      </Button>
    </div>
  );
}

function SkillForm({
  type,
  initialData,
  onCancel,
  onSubmit,
}: {
  type: "teaching" | "learning";
  initialData?: any;
  onCancel: () => void;
  onSubmit: (data: any) => void;
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
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: name === "rating" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
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
      </div>
    </div>
  );
}

export default function MySkillsPage() {
  const dispatch = useAppDispatch();
  const { skills = [], loading = false, error = null } = useAppSelector((state) => state.skills || {});
  const { token, user } = useAppSelector((state) => state.auth);
  
  const [activeTab, setActiveTab] = useState<"teaching" | "learning">("teaching");
  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState<any>(null);
  const [formType, setFormType] = useState<"teaching" | "learning">("teaching");

  useEffect(() => {
    if (token) {
      dispatch(getSkills(token));
    }
  }, [dispatch, token]);

  const teachingSkills = skills.filter(skill => skill.type === "teaching");
  const learningSkills = skills.filter(skill => skill.type === "learning");

  const handleAddSkillClick = (type: "teaching" | "learning") => {
    setFormType(type);
    setEditingSkill(null);
    setShowForm(true);
  };

  const handleEditSkillClick = (skill: any, type: "teaching" | "learning") => {
    setFormType(type);
    setEditingSkill(skill);
    setShowForm(true);
  };

  const handleDeleteSkillClick = async (id: string) => {
    try {
      await dispatch(removeSkill({ token, id })).unwrap();
      toast.success("Skill deleted successfully");
    } catch (error) {
      toast.error("Failed to delete skill");
      console.error("Delete skill error:", error);
    }
  };

  const handleSubmitSkill = async (formData: any) => {
    try {
      if (editingSkill) {
        await dispatch(editSkill({
          token,
          id: editingSkill._id,
          skillData: {
            ...formData,
            type: formType,
            user: user?._id
          }
        })).unwrap();
        toast.success("Skill updated successfully");
      } else {
        await dispatch(addSkill({
          token,
          skillData: {
            ...formData,
            type: formType,
            user: user?._id
          }
        })).unwrap();
        toast.success("Skill added successfully");
      }
      setShowForm(false);
      setEditingSkill(null);
    } catch (error) {
      toast.error("Failed to save skill");
      console.error("Save skill error:", error);
    }
  };

  if (loading && skills.length === 0) {
    return (
      <div className="flex min-h-screen bg-[#FFF7D4]">
        <AppSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4a3630]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-[#FFF7D4]">
        <AppSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#FFF7D4]">
      <AppSidebar />

      <div className="flex-1 flex flex-col">
        <PageHeader title="My Skills" backTo="/home-dashboard">
          <Button 
            variant="primary" 
            leftIcon={<PlusCircle size={16} />}
            onClick={() => handleAddSkillClick(activeTab)}
          >
            Add New Skill
          </Button>
        </PageHeader>

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
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

            {showForm && (
              <SkillForm
                type={formType}
                initialData={editingSkill}
                onCancel={() => {
                  setShowForm(false);
                  setEditingSkill(null);
                }}
                onSubmit={handleSubmitSkill}
              />
            )}

            {activeTab === "teaching" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teachingSkills.map(skill => (
                  <SkillCard
                    key={skill._id}
                    skill={skill}
                    onEdit={() => handleEditSkillClick(skill, "teaching")}
                    onDelete={() => handleDeleteSkillClick(skill._id)}
                  />
                ))}
                <AddSkillCard 
                  onClick={() => handleAddSkillClick("teaching")} 
                />
              </div>
            )}

            {activeTab === "learning" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {learningSkills.map(skill => (
                  <SkillCard
                    key={skill._id}
                    skill={skill}
                    onEdit={() => handleEditSkillClick(skill, "learning")}
                    onDelete={() => handleDeleteSkillClick(skill._id)}
                  />
                ))}
                <AddSkillCard 
                  onClick={() => handleAddSkillClick("learning")} 
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}