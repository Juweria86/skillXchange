"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../hooks/useTypedHooks"
import { loginUser } from "../features/auth/authSlice"
import { Button } from "@/components/ui/button"
import Input from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import SocialAuth from "../components/auth/SocialAuth"
import Logo from "@/components/Logo"
import toast from "react-hot-toast"
import { Eye, EyeOff, Lock, Mail, ArrowRight, GraduationCap, Users, BookOpen } from "lucide-react"

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const result = await dispatch(loginUser(form))

      if (loginUser.fulfilled.match(result)) {
        toast.success("Logged in successfully")

        console.log("Logged in user:", result.payload?.user)
        alert(JSON.stringify(result.payload?.user, null, 2))

        const isAdmin = result.payload?.user?.role === "admin"

        if (isAdmin) {
          navigate("/admin/dashboard", { replace: true })
          return
        }

        const isOnboarded = result.payload?.user?.isOnboarded

        if (!isOnboarded) {
          navigate("/onboarding", { replace: true })
        } else {
          navigate("/home-dashboard", { replace: true })
        }
      } else if (loginUser.rejected.match(result)) {
        const errorMsg = result.payload || result.error?.message

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
    <div className="min-h-screen bg-gradient-to-b from-[#E5EFF9] to-background">
      {/* Header */}
      <header className="bg-white py-4 px-6 shadow-sm">
        <div className="container mx-auto max-w-6xl flex justify-between items-center">
          <Logo size="md" />
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-[#0C4B93]">
              Home
            </Button>
            <Button variant="ghost" className="text-[#0C4B93]">
              About
            </Button>
            <Button variant="ghost" className="text-[#0C4B93]">
              Contact
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Login Form */}
            <div className="w-full">
              <Card className="border-none shadow-xl bg-white">
                <CardHeader className="space-y-4 pb-6">
                  <div className="text-center">
                    <Badge className="mb-4 bg-[#D7E9F7] text-[#0C4B93] hover:bg-[#D7E9F7]">
                      <GraduationCap className="w-4 h-4 mr-2" />
                      Skill Exchange Platform
                    </Badge>
                    <CardTitle className="text-3xl font-bold text-[#0C4B93]">Welcome back</CardTitle>
                    <CardDescription className="text-lg text-gray-600 mt-2">
                      Continue your skill exchange journey
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-[#0C4B93]">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="Enter your university email"
                          required
                          className="pl-10 h-12 border-gray-200 focus:border-[#0C4B93] focus:ring-[#0C4B93]"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium text-[#0C4B93]">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={form.password}
                          onChange={handleChange}
                          placeholder="Enter your password"
                          required
                          className="pl-10 pr-10 h-12 border-gray-200 focus:border-[#0C4B93] focus:ring-[#0C4B93]"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#0C4B93]"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Remember me & Forgot password */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="remember-me"
                          checked={rememberMe}
                          onCheckedChange={() => setRememberMe(!rememberMe)}
                        />
                        <Label htmlFor="remember-me" className="text-sm text-gray-600">
                          Remember me
                        </Label>
                      </div>

                      <Link
                        to="/forgot-password"
                        className="text-sm text-[#0C4B93] hover:text-[#064283] hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 bg-[#0C4B93] hover:bg-[#064283] text-white text-base font-medium"
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
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Signing in...
                        </div>
                      ) : (
                        <>
                          Sign in to platform
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>

                    {error && (
                      <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
                        <p className="text-red-600 text-sm">{error}</p>
                      </div>
                    )}

                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-gray-500">Or continue with</span>
                      </div>
                    </div>

                    <SocialAuth />

                    <div className="text-center pt-4">
                      <p className="text-sm text-gray-600">
                        New to SkillXchange?{" "}
                        <Link to="/signup" className="text-[#0C4B93] hover:text-[#064283] font-medium hover:underline">
                          Join the skill exchange
                        </Link>
                      </p>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Right side - Skill Exchange Information */}
            <div className="hidden lg:block">
              <div className="space-y-8">
                <div className="text-center">
                  <Badge className="mb-4 bg-[#E5EFF9] text-[#0C4B93] hover:bg-[#E5EFF9]">
                    Unlock New Opportunities
                  </Badge>
                  <h1 className="text-4xl font-bold text-[#0C4B93] mb-4">Skill Exchange Platform</h1>
                  <p className="text-lg text-gray-700 max-w-lg mx-auto">
                    Connect, collaborate, and grow your skills with our peer-to-peer learning platform.
                  </p>
                </div>

                {/* Skill Exchange Stats */}
                {/* <div className="grid grid-cols-2 gap-4">
                  <Card className="border-none bg-[#D7E9F7] p-6 text-center">
                    <div className="text-2xl font-bold text-[#0C4B93] mb-2">1000+</div>
                    <p className="text-sm text-gray-600">Skills Shared</p>
                  </Card>
                  <Card className="border-none bg-[#E5EFF9] p-6 text-center">
                    <div className="text-2xl font-bold text-[#0C4B93] mb-2">500+</div>
                    <p className="text-sm text-gray-600">Active Members</p>
                  </Card>
                </div> */}

                {/* Benefits */}
                {/* <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-[#D7E9F7] flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-[#0C4B93]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#0C4B93] mb-1">Connect with Peers</h3>
                      <p className="text-sm text-gray-600">Find and connect with peers who have the skills you need.</p>
                    </div>
                  </div> */}

                  {/* <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-[#E5EFF9] flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-5 h-5 text-[#0C4B93]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#0C4B93] mb-1">Expand Your Knowledge</h3>
                      <p className="text-sm text-gray-600">Learn new skills and share your expertise with others.</p>
                    </div>
                  </div>
                </div> */}

                {/* Image */}
                <Card className="border-none bg-white shadow-lg p-6">
                  <img
                    src="/login.jpg"
                    alt="Collaboration"
                    className="w-full h-auto object-cover rounded-lg"
                  />
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
