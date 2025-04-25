import { Link } from "react-router-dom"
import AuthLayout from "../components/auth/AuthLayout"
import AuthCard from "../components/auth/AuthCard"
import Input from "../components/ui/Input"
import Button from "../components/ui/Button"
import SocialAuth from "../components/auth/SocialAuth"

export default function SignupPage() {
  return (
    <AuthLayout>
      <AuthCard title="Create your account">
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
            placeholder="Create a password"
            variant="yellow"
            required
            autoComplete="new-password"
          />

          <Input
            id="password-confirm"
            name="password-confirm"
            type="password"
            label="Confirm Password"
            placeholder="Confirm your password"
            variant="yellow"
            required
            autoComplete="new-password"
          />

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-[#4a3630] focus:ring-[#4a3630] border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
              I agree to the{" "}
              <a href="#" className="font-medium text-[#4a3630] hover:text-[#3a2a24]">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="font-medium text-[#4a3630] hover:text-[#3a2a24]">
                Privacy Policy
              </a>
            </label>
          </div>

          <Button variant="primary" fullWidth asLink to="/date-of-birth">
            Sign up
          </Button>
        </form>

        <SocialAuth />

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-[#4a3630] hover:text-[#3a2a24]">
            Log in
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  )
}
