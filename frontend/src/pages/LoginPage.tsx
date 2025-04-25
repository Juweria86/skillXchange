import { Link } from "react-router-dom"
import AuthLayout from "../components/auth/AuthLayout"
import AuthCard from "../components/auth/AuthCard"
import Input from "../components/ui/Input"
import Button from "../components/ui/Button"
import SocialAuth from "../components/auth/SocialAuth"

export default function LoginPage() {
  return (
    <AuthLayout>
      <AuthCard title="Log in to SkillXchange">
        <form className="space-y-6">
          <Input
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="Enter your email"
            variant="yellow"
            required
            autoComplete="email"
          />

          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            variant="yellow"
            required
            autoComplete="current-password"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-[#4a3630] focus:ring-[#4a3630] border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-[#4a3630] hover:text-[#3a2a24]">
                Forgot your password?
              </a>
            </div>
          </div>

          <Button variant="primary" fullWidth asLink to="/home-dashboard">
            Log in
          </Button>
        </form>

        <SocialAuth />

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="font-medium text-[#4a3630] hover:text-[#3a2a24]">
            Sign up
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  )
}
