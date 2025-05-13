"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../hooks/useTypedHooks"
import { loginUser } from "../features/auth/authSlice"
import AuthLayout from "../components/auth/AuthLayout"
import Input from "../components/ui/Input"
import Button from "../components/ui/Button"
import SocialAuth from "../components/auth/SocialAuth"
import toast from "react-hot-toast"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"

export default function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading, error } = useAppSelector((state) => state.auth)

  const [form, setForm] = useState({ email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const result = await dispatch(loginUser(form))

      if (loginUser.fulfilled.match(result)) {
        toast.success("Logged in successfully")

        // Check onboarding status from the response
        const isOnboarded = result.payload?.user?.isOnboarded

        if (!isOnboarded) {
          navigate("/onboarding")
        } else {
          navigate("/home-dashboard")
        }
      } else if (loginUser.rejected.match(result)) {
        const errorMsg = result.error?.message

        if (errorMsg?.includes("verify your email")) {
          toast.error("Please verify your email first.")
          navigate("/resend-verification")
        } else {
          toast.error(errorMsg || "Login failed")
        }
      }
    } catch (err) {
      console.error(err)
      toast.error("Unexpected error occurred")
    }
  }

  return (
    <AuthLayout>
      <div className="flex flex-col md:flex-row w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Left side - Form */}
        <div className="w-full md:w-1/2 p-8">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#4a3630]">Welcome back</h1>
              <p className="text-gray-500 mt-2">Log in to your SkillXchange account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  label="Email"
                  placeholder="Enter your email"
                  variant="yellow"
                  required
                  className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-[#4a3630]"
                />
                <div className="absolute left-3 top-9 text-gray-500">
                  <Mail size={18} />
                </div>
              </div>

              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  label="Password"
                  placeholder="Enter your password"
                  variant="yellow"
                  required
                  className="pl-10 pr-10 transition-all duration-200 focus:ring-2 focus:ring-[#4a3630]"
                />
                <div className="absolute left-3 top-9 text-gray-500">
                  <Lock size={18} />
                </div>
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={handleRememberMeChange}
                    className="h-4 w-4 text-[#4a3630] focus:ring-[#4a3630] border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-medium text-[#4a3630] hover:text-[#3a2a24] hover:underline transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={loading}
                className="py-3 text-base font-medium transition-transform active:scale-95"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Logging in...
                  </div>
                ) : (
                  "Log in"
                )}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <SocialAuth />

              <p className="mt-6 text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-[#4a3630] hover:text-[#3a2a24] hover:underline transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </form>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right side - Illustration */}
        <div className="hidden md:block md:w-1/2 bg-[#FFF7D4] p-8">
          <div className="h-full flex flex-col justify-center items-center">
            <div className="relative w-full max-w-md">
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-[#FBEAA0] rounded-full opacity-60"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#FBEAA0] rounded-full opacity-60"></div>

              <img
                src="/images/login-illustration.svg"
                alt="Skill sharing illustration"
                className="w-full relative z-10"
              />

              <div className="mt-12 text-center relative z-10">
                <h2 className="text-2xl font-bold text-[#4a3630] mb-4">Welcome back!</h2>
                <p className="text-gray-600">
                  Continue your learning journey and connect with your skill-sharing community.
                </p>

                <div className="mt-8">
                  <div className="flex justify-center space-x-4">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`w-8 h-8 rounded-full border-2 border-white bg-yellow-${i * 100}`}
                        ></div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">
                      <span className="font-bold">2,000+</span> users already joined
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}
