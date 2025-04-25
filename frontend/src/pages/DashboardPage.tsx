import { Link } from "react-router-dom"
import { Search, Home, Settings, CheckCircle } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FFF7D4]">
      <div className="flex-grow flex justify-center items-center p-4">
        <div className="w-full max-w-md p-8 bg-[#FBEAA0] rounded-2xl shadow-md">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 bg-[#4a3630] rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Account Created Successfully!</h1>
            <p className="text-gray-700 mb-2">
              Your SkillXchange account has been created and you're ready to start connecting with others.
            </p>
            <p className="text-[#4a3630] font-medium">Welcome to SkillXchange!</p>
          </div>

          <div className="space-y-4">
            <Link
              to="/find-match"
              className="w-full py-3 px-4 bg-[#4a3630] text-white rounded-lg text-lg font-medium hover:bg-[#3a2a24] transition-colors flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              Find a Match
            </Link>

            <Link
              to="/home-dashboard"
              className="w-full py-3 px-4 bg-[#4a3630] text-white rounded-lg text-lg font-medium hover:bg-[#3a2a24] transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Go to Dashboard
            </Link>

            <Link
              to="/customize-profile"
              className="w-full py-3 px-4 bg-[#4a3630] text-white rounded-lg text-lg font-medium hover:bg-[#3a2a24] transition-colors flex items-center justify-center gap-2"
            >
              <Settings className="w-5 h-5" />
              Customize My Profile Further
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
