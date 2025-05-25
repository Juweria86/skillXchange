"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../hooks/useTypedHooks"
import { registerUser } from "../features/auth/authSlice"
import { Button } from "@/components/ui/button"
import Input from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import  Badge  from "@/components/ui/Badge"
import SocialAuth from "../components/auth/SocialAuth"
import Logo from "@/components/Logo"
import toast from "react-hot-toast"
import {
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  ArrowRight,
  GraduationCap,
  User,
  Mail,
  Lock,
  Lightbulb,
  TrendingUp,
  Handshake,
  ArrowLeftRight,
} from "lucide-react"

export default function SignupPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading, error } = useAppSelector((state) => state.auth)

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  })

  useEffect(() => {
    if (error) {
      if (error.toLowerCase().includes("Email already exists")) {
        toast.error("An account with this email already exists.")
      } else {
        toast.error(error)
      }
    }
  }, [error])

  useEffect(() => {
    const checks = {
      length: form.password.length >= 8,
      uppercase: /[A-Z]/.test(form.password),
      lowercase: /[a-z]/.test(form.password),
      number: /[0-9]/.test(form.password),
      special: /[^A-Za-z0-9]/.test(form.password),
    }

    setPasswordChecks(checks)
    const strength = Object.values(checks).filter(Boolean).length
    setPasswordStrength(strength)
  }, [form.password])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) return toast.error("Passwords do not match")

    try {
      const result = await dispatch(
        registerUser({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      )
      if (result.meta.requestStatus === "fulfilled") {
        toast.success("Account created! Please check your email to verify.")
        navigate("/login")
      }
    } catch (err) {
      console.error(err)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E5EFF9] to-background">
      {/* Header */}
      <header className="bg-white py-4 px-6 shadow-sm">
        <div className="container mx-auto max-w-6xl flex justify-between items-center">
          <Logo size="md" />
          <div className="flex items-center gap-4">
            {/* <Button variant="ghost" className="text-[#0C4B93]">
              How it Works
            </Button>
            <Button variant="ghost" className="text-[#0C4B93]">
              Browse Skills
            </Button> */}
            <Button variant="ghost" className="text-[#0C4B93]">
              Login
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left side - Research Information */}
            <div className="hidden lg:block">
              <div className="space-y-8 sticky top-8">
                <div className="text-center">
                  <Badge className="mb-4 bg-[#D7E9F7] text-[#0C4B93] hover:bg-[#D7E9F7]">
                    <ArrowLeftRight className="w-6 h-6" />
                    Join SkillXchange
                  </Badge>
                  <h1 className="text-4xl font-bold text-[#0C4B93] mb-4">Start Exchanging Skills</h1>
                  <p className="text-lg text-gray-700 max-w-lg mx-auto">
                    Unlock new opportunities by trading your skills with others - no money needed!
                  </p>
                </div>

                {/* Research Benefits */}
                <div className="space-y-4">
                  {/* <Card className="border-none bg-[#D7E9F7] p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                        <Lightbulb className="w-5 h-5 text-[#0C4B93]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#0C4B93] mb-2">Expand Your Knowledge</h3>
                        <p className="text-sm text-gray-600">
                          Learn new skills and broaden your horizons by connecting with skilled individuals.
                        </p>
                      </div>
                    </div>
                  </Card> */}

                {/* Image */}
                <Card className="border-none bg-white shadow-lg p-6">
                  <img
                    src="/collab.jpg"
                    alt="Collaboration"
                    className="w-full h-auto object-cover rounded-lg"
                  />
                </Card>
                </div>

                {/* Research Stats
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-[#0C4B93] mb-1">200+</div>
                    <p className="text-xs text-gray-600">Skills Offered</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-[#0C4B93] mb-1">150+</div>
                    <p className="text-xs text-gray-600">Members</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-[#0C4B93] mb-1">4.9</div>
                    <p className="text-xs text-gray-600">Avg. Rating</p>
                  </div>
                </div> */}

                {/* University Badge
                <Card className="border-none bg-white shadow-lg p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-[#D7E9F7] flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-[#0C4B93]" />
                  </div>
                  <h3 className="font-bold text-[#0C4B93] mb-2">SkillXchange</h3>
                  <p className="text-sm text-gray-600">Start Trading Today!</p>
                </Card> */}
              </div>
            </div>

            {/* Right side - Signup Form */}
            <div className="w-full">
              <Card className="border-none shadow-xl bg-white">
                <CardHeader className="space-y-4 pb-6">
                  <div className="text-center">
                    <Badge className="mb-4 bg-[#E5EFF9] text-[#0C4B93] hover:bg-[#E5EFF9]">SkillXchange</Badge>
                    <CardTitle className="text-3xl font-bold text-[#0C4B93]">Join SkillXchange</CardTitle>
                    <CardDescription className="text-lg text-gray-600 mt-2">
                      Create your account and start trading skills today!
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Full Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium text-[#0C4B93]">
                        Full Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                          required
                          className="pl-10 h-12 border-gray-200 focus:border-[#0C4B93] focus:ring-[#0C4B93]"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-[#0C4B93]">
                        Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="your.email@example.com"
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
                          placeholder="Create a secure password"
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

                      {form.password && (
                        <div className="mt-3 space-y-2">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((level) => (
                              <div
                                key={level}
                                className={`h-2 flex-1 rounded-full ${
                                  level <= passwordStrength
                                    ? level <= 2
                                      ? "bg-red-400"
                                      : level <= 4
                                        ? "bg-yellow-400"
                                        : "bg-green-400"
                                    : "bg-gray-200"
                                }`}
                              />
                            ))}
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center gap-1">
                              {passwordChecks.length ? (
                                <CheckCircle className="w-3 h-3 text-green-500" />
                              ) : (
                                <XCircle className="w-3 h-3 text-red-500" />
                              )}
                              <span className="text-gray-600">8+ characters</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {passwordChecks.uppercase ? (
                                <CheckCircle className="w-3 h-3 text-green-500" />
                              ) : (
                                <XCircle className="w-3 h-3 text-red-500" />
                              )}
                              <span className="text-gray-600">Uppercase</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {passwordChecks.number ? (
                                <CheckCircle className="w-3 h-3 text-green-500" />
                              ) : (
                                <XCircle className="w-3 h-3 text-red-500" />
                              )}
                              <span className="text-gray-600">Number</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {passwordChecks.special ? (
                                <CheckCircle className="w-3 h-3 text-green-500" />
                              ) : (
                                <XCircle className="w-3 h-3 text-red-500" />
                              )}
                              <span className="text-gray-600">Special char</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-sm font-medium text-[#0C4B93]">
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={form.confirmPassword}
                          onChange={handleChange}
                          placeholder="Confirm your password"
                          required
                          className="pl-10 pr-10 h-12 border-gray-200 focus:border-[#0C4B93] focus:ring-[#0C4B93]"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#0C4B93]"
                          onClick={toggleConfirmPasswordVisibility}
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>

                      {form.password && form.confirmPassword && (
                        <div className="flex items-center gap-2 mt-2">
                          {form.password === form.confirmPassword ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-sm text-green-600">Passwords match</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-red-500" />
                              <span className="text-sm text-red-600">Passwords don't match</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Terms and Conditions */}
                    <div className="flex items-start gap-3 p-4 bg-[#E5EFF9] rounded-lg">
                      <Checkbox id="terms" required className="mt-0.5" />
                      <Label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed">
                        I agree to the{" "}
                        <Link to="/terms" className="text-[#0C4B93] hover:underline font-medium">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link to="/privacy" className="text-[#0C4B93] hover:underline font-medium">
                          Privacy Policy
                        </Link>
                        .
                      </Label>
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
                          Creating Account...
                        </div>
                      ) : (
                        <>
                          Join SkillXchange
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
                        Already have an account?{" "}
                        <Link to="/login" className="text-[#0C4B93] hover:text-[#064283] font-medium hover:underline">
                          Sign in to platform
                        </Link>
                      </p>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
