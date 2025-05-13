import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch } from "../hooks/useTypedHooks";
import { setUser } from "@/features/auth/authSlice";

const OnboardingForm = () => {
    const dispatch = useAppDispatch();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    bio: "",
    location: "",
    skillsToTeach: "",
    skillsToLearn: "",
    interests: "",
    profileImage: null as File | null,
    previewImage: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        profileImage: file,
        previewImage: URL.createObjectURL(file)
      }));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

 

// OnboardingForm.tsx
const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();
      
      // Append all fields
      formDataToSend.append("bio", formData.bio);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("skillsToTeach", formData.skillsToTeach);
      formDataToSend.append("skillsToLearn", formData.skillsToLearn);
      formDataToSend.append("interests", formData.interests);
      
      if (formData.profileImage) {
        formDataToSend.append("profileImage", formData.profileImage);
      }
  
      const res = await fetch("http://localhost:5000/api/users/onboarding", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formDataToSend,
      });
  
      if (!res.ok) {
        throw new Error("Failed to complete onboarding");
      }
  
      // Update local user state
      const updatedUser = await res.json();
      dispatch(setUser(updatedUser.user));
      
      toast.success("Onboarding completed");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message || "Something went wrong");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF7D4] flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-[#4a3630] text-white p-2 rounded-lg shadow-md">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M21 10H3M16 2V6M8 2V6M10.5 14L8 16.5L10.5 19M13.5 14L16 16.5L13.5 19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="font-bold text-xl tracking-tight">SkillSwap</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#FBEAA0] rounded-2xl shadow-lg p-8">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 rounded-full bg-[#4a3630] text-white flex items-center justify-center font-bold">
              {step}
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-[#4a3630]">
                {step === 1 ? "Basic Information" : step === 2 ? "Skills & Interests" : "Profile Image"}
              </h1>
              <p className="text-gray-600 text-sm">
                {step === 1 ? "Tell us about yourself (1/3)" : 
                 step === 2 ? "What skills do you want to share? (2/3)" : 
                 "Add a profile picture (3/3)"}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {step === 1 && (
              <>
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    placeholder="Tell us about yourself"
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4a3630] focus:border-transparent bg-[#FBEAA0]"
                    rows={4}
                  />
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4a3630] focus:border-transparent bg-[#FBEAA0]"
                    placeholder="City, Country"
                  />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label htmlFor="skillsToTeach" className="block text-sm font-medium text-gray-700 mb-1">
                    Skills I Can Teach
                  </label>
                  <input
                    id="skillsToTeach"
                    name="skillsToTeach"
                    type="text"
                    value={formData.skillsToTeach}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4a3630] focus:border-transparent bg-[#FBEAA0]"
                    placeholder="e.g., Photography, Cooking, Coding"
                  />
                  <p className="text-xs text-gray-500 mt-1">What skills are you comfortable teaching others?</p>
                </div>
                <div>
                  <label htmlFor="skillsToLearn" className="block text-sm font-medium text-gray-700 mb-1">
                    Skills I Want to Learn
                  </label>
                  <input
                    id="skillsToLearn"
                    name="skillsToLearn"
                    type="text"
                    value={formData.skillsToLearn}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4a3630] focus:border-transparent bg-[#FBEAA0]"
                    placeholder="e.g., Guitar, Spanish, Woodworking"
                  />
                  <p className="text-xs text-gray-500 mt-1">What skills would you like to learn from others?</p>
                </div>
                <div>
                  <label htmlFor="interests" className="block text-sm font-medium text-gray-700 mb-1">
                    Interests
                  </label>
                  <input
                    id="interests"
                    name="interests"
                    type="text"
                    value={formData.interests}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4a3630] focus:border-transparent bg-[#FBEAA0]"
                    placeholder="e.g., Hiking, Reading, Music"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate interests with commas</p>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32 mb-4">
                    <img
                      src={formData.previewImage || "https://via.placeholder.com/150"}
                      alt="Preview"
                      className="w-full h-full rounded-full object-cover border-4 border-[#4a3630]"
                    />
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className="absolute bottom-0 right-0 bg-[#4a3630] text-white rounded-full p-2 hover:bg-[#3a2a24] transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="px-4 py-2 bg-[#4a3630] text-white rounded-lg hover:bg-[#3a2a24] transition-colors"
                  >
                    {formData.previewImage ? "Change Photo" : "Upload Photo"}
                  </button>
                  {formData.profileImage && (
                    <p className="text-sm text-gray-600 mt-2">
                      {formData.profileImage.name}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="flex justify-between mt-6">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 border border-[#4a3630] text-[#4a3630] rounded-lg hover:bg-white transition-colors"
              >
                Back
              </button>
            ) : (
              <div></div>
            )}
            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-4 py-2 bg-[#4a3630] text-white rounded-lg hover:bg-[#3a2a24] transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-[#4a3630] text-white rounded-lg hover:bg-[#3a2a24] transition-colors"
              >
                Finish
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default OnboardingForm;