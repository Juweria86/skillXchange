import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { getUserProfile } from "../features/user/userSlice";
import { MapPin } from "lucide-react";
import AppSidebar from "../components/AppSidebar";

export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { profile, loading } = useSelector((state: RootState) => state.user);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      dispatch(getUserProfile(token));
    }
  }, [dispatch, token]);

  if (loading || !profile) return <div className="p-6">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-[#FFF7D4]">
      <AppSidebar />

      <div className="flex-1 flex flex-col">
        {/* Back Button */}
        <div className="p-4 bg-white shadow-sm">
          <Link
            to="/home-dashboard"
            className="inline-flex items-center text-[#4a3630] hover:text-[#3a2a24] font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
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
        </div>

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="w-full flex justify-end mb-2">
  <Link
    to="/edit-profile"
    className="inline-block px-4 py-2 bg-[#4a3630] text-white text-sm rounded-lg shadow hover:bg-[#3a2a24] transition"
  >
    Edit Profile
  </Link>
</div>

            <div className="bg-[#FBEAA0] rounded-xl p-6 shadow-md mb-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-white border-4 border-white shadow-md">
                  <img
                    src={profile.profileImage || "/placeholder.svg"}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                  <div className="flex items-center justify-center md:justify-start gap-2 mt-1 text-gray-600">
                    <MapPin size={16} />
                    <span>{profile.location || "Not specified"}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                    {profile.skillsICanTeach?.map((skill: any) => (
                      <span
                        key={skill._id}
                        className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full"
                      >
                        #{skill.name}
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 text-gray-700">{profile.bio || "No bio provided."}</p>
                </div>
              </div>
            </div>

            {/* About Me + Achievements */}
            <div className="bg-white rounded-xl p-6 shadow-md mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About Me</h2>
              <p className="text-gray-700 mb-4">{profile.bio || "No bio provided."}</p>

              <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">Achievements</h3>
              {profile.achievements?.length ? (
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  {profile.achievements.map((a: string, i: number) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">No achievements listed.</p>
              )}
            </div>

            {/* Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Skills I Can Teach</h2>
                {profile.skillsICanTeach?.length ? (
                  <ul className="space-y-3">
                    {profile.skillsICanTeach.map((skill: any) => (
                      <li key={skill._id} className="flex items-center gap-2">
                        <span className="text-sm font-medium">{skill.name}</span>
                        <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">
                          {skill.level || "N/A"}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">No teaching skills added.</p>
                )}
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Skills I Want to Learn</h2>
                {profile.skillsIWantToLearn?.length ? (
                  <ul className="space-y-3">
                    {profile.skillsIWantToLearn.map((skill: any) => (
                      <li key={skill._id} className="flex items-center gap-2">
                        <span className="text-sm font-medium">{skill.name}</span>
                        <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                          {skill.level || "N/A"}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">No learning skills added.</p>
                )}
              </div>
            </div>

            {/* Availability */}
            <div className="bg-white rounded-xl p-6 shadow-md mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Availability</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-[#FBEAA0] text-gray-800">
                  <span className="font-semibold">Weekdays:</span> {profile.availability?.weekdays || "N/A"}
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-[#FBEAA0] text-gray-800">
                  <span className="font-semibold">Weekends:</span> {profile.availability?.weekends || "N/A"}
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-xl p-6 shadow-md mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Social Links</h2>
              <ul className="space-y-2 text-blue-600 underline">
                {profile.socialLinks?.linkedIn && (
                  <li><a href={profile.socialLinks.linkedIn}>LinkedIn</a></li>
                )}
                {profile.socialLinks?.github && (
                  <li><a href={profile.socialLinks.github}>GitHub</a></li>
                )}
                {profile.socialLinks?.portfolio && (
                  <li><a href={profile.socialLinks.portfolio}>Portfolio</a></li>
                )}
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
