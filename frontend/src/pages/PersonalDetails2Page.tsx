import { Link } from "react-router-dom"

export default function PersonalDetails2Page() {
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
              3
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-[#4a3630]">Tell us about yourself</h1>
              <p className="text-gray-600 text-sm">This helps us personalize your experience (2/2).</p>
            </div>
          </div>

          <form className="space-y-6">
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                Short Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4a3630] focus:border-transparent bg-[#FBEAA0]"
                placeholder="Tell us a bit about yourself..."
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skills You Can Teach</label>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center">
                  JavaScript
                  <button className="ml-1 text-green-600 hover:text-green-800">×</button>
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center">
                  React
                  <button className="ml-1 text-green-600 hover:text-green-800">×</button>
                </span>
              </div>
              <div className="flex">
                <input
                  type="text"
                  className="flex-1 px-4 py-2 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4a3630] focus:border-transparent bg-[#FBEAA0]"
                  placeholder="Add a skill..."
                />
                <button className="px-4 py-2 bg-[#4a3630] text-white rounded-r-lg hover:bg-[#3a2a24]">Add</button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skills You Want to Learn</label>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center">
                  Python
                  <button className="ml-1 text-blue-600 hover:text-blue-800">×</button>
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center">
                  UX Design
                  <button className="ml-1 text-blue-600 hover:text-blue-800">×</button>
                </span>
              </div>
              <div className="flex">
                <input
                  type="text"
                  className="flex-1 px-4 py-2 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4a3630] focus:border-transparent bg-[#FBEAA0]"
                  placeholder="Add a skill..."
                />
                <button className="px-4 py-2 bg-[#4a3630] text-white rounded-r-lg hover:bg-[#3a2a24]">Add</button>
              </div>
            </div>
          </form>

          <div className="flex justify-between mt-6">
            <Link
              to="/personal-details-1"
              className="px-4 py-2 border border-[#4a3630] text-[#4a3630] rounded-lg hover:bg-white transition-colors"
            >
              Back
            </Link>
            <Link
              to="/upload-pictures"
              className="px-4 py-2 bg-[#4a3630] text-white rounded-lg hover:bg-[#3a2a24] transition-colors"
            >
              Next
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
