import { Link } from "react-router-dom"

export default function CustomizeProfilePage() {
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
          <h1 className="text-2xl font-bold text-center text-[#4a3630] mb-6">Customize Your Profile</h1>
          <p className="text-center text-gray-700 mb-8">This page is under construction. Please check back soon!</p>
          <div className="flex justify-center">
            <Link
              to="/dashboard"
              className="px-4 py-2 bg-[#4a3630] text-white rounded-lg hover:bg-[#3a2a24] transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
