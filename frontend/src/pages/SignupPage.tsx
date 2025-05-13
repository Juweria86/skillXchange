"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../hooks/useTypedHooks"
import { registerUser } from "../features/auth/authSlice"
import AuthLayout from "../components/auth/AuthLayout"
import Input from "../components/ui/Input"
import Button from "../components/ui/Button"
import SocialAuth from "../components/auth/SocialAuth"
import toast from "react-hot-toast"
import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react"

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
        toast.error(error) // fallback for other error messages
      }
    }
  }, [error])

  useEffect(() => {
    // Check password strength
    const checks = {
      length: form.password.length >= 8,
      uppercase: /[A-Z]/.test(form.password),
      lowercase: /[a-z]/.test(form.password),
      number: /[0-9]/.test(form.password),
      special: /[^A-Za-z0-9]/.test(form.password),
    }

    setPasswordChecks(checks)

    // Calculate strength (0-5)
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
      const result = await dispatch(registerUser({ name: form.name, email: form.email, password: form.password }))
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
    <AuthLayout>
      <div className="flex flex-col md:flex-row w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Left side - Illustration */}
        <div className="hidden md:block md:w-1/2 bg-[#FFF7D4] p-8">
          <div className="h-full flex flex-col justify-center items-center">
            <div className="relative w-full max-w-md">
              <div className="absolute -top-6 -left-6 w-20 h-20 bg-[#FBEAA0] rounded-full opacity-60"></div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#FBEAA0] rounded-full opacity-60"></div>

              <img
                src="/images/signup-illustration.svg"
                alt="Skill sharing illustration"
                className="w-full relative z-10"
              />

              <div className="mt-12 text-center relative z-10">
                <h2 className="text-2xl font-bold text-[#4a3630] mb-4">Join our community</h2>
                <p className="text-gray-600">
                  Connect with others, share your skills, and learn something new every day.
                </p>

                <div className="mt-8 flex justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-[#4a3630] opacity-60"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full md:w-1/2 p-8">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#4a3630]">Create your account</h1>
              <p className="text-gray-500 mt-2">Join SkillXchange and start your learning journey</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  label="Full Name"
                  placeholder="Enter your full name"
                  variant="yellow"
                  required
                  className="transition-all duration-200 focus:ring-2 focus:ring-[#4a3630]"
                />
              </div>

              <div>
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
                  className="transition-all duration-200 focus:ring-2 focus:ring-[#4a3630]"
                />
              </div>

              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  label="Password"
                  placeholder="Create a password"
                  variant="yellow"
                  required
                  className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-[#4a3630]"
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>

                {form.password && (
                  <div className="mt-2">
                    <div className="flex mb-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-1.5 w-full mx-0.5 rounded-full ${
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

                    <div className="text-xs text-gray-500 grid grid-cols-2 gap-1 mt-2">
                      <div className="flex items-center">
                        {passwordChecks.length ? (
                          <CheckCircle size={12} className="text-green-500 mr-1" />
                        ) : (
                          <XCircle size={12} className="text-red-500 mr-1" />
                        )}
                        <span>At least 8 characters</span>
                      </div>
                      <div className="flex items-center">
                        {passwordChecks.uppercase ? (
                          <CheckCircle size={12} className="text-green-500 mr-1" />
                        ) : (
                          <XCircle size={12} className="text-red-500 mr-1" />
                        )}
                        <span>Uppercase letter</span>
                      </div>
                      <div className="flex items-center">
                        {passwordChecks.lowercase ? (
                          <CheckCircle size={12} className="text-green-500 mr-1" />
                        ) : (
                          <XCircle size={12} className="text-red-500 mr-1" />
                        )}
                        <span>Lowercase letter</span>
                      </div>
                      <div className="flex items-center">
                        {passwordChecks.number ? (
                          <CheckCircle size={12} className="text-green-500 mr-1" />
                        ) : (
                          <XCircle size={12} className="text-red-500 mr-1" />
                        )}
                        <span>Number</span>
                      </div>
                      <div className="flex items-center">
                        {passwordChecks.special ? (
                          <CheckCircle size={12} className="text-green-500 mr-1" />
                        ) : (
                          <XCircle size={12} className="text-red-500 mr-1" />
                        )}
                        <span>Special character</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  variant="yellow"
                  required
                  className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-[#4a3630]"
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>

                {form.password && form.confirmPassword && (
                  <div className="mt-1 flex items-center">
                    {form.password === form.confirmPassword ? (
                      <>
                        <CheckCircle size={14} className="text-green-500 mr-1" />
                        <span className="text-xs text-green-500">Passwords match</span>
                      </>
                    ) : (
                      <>
                        <XCircle size={14} className="text-red-500 mr-1" />
                        <span className="text-xs text-red-500">Passwords don't match</span>
                      </>
                    )}
                  </div>
                )}
              </div>

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
                    Creating Account...
                  </div>
                ) : (
                  "Create Account"
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
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-[#4a3630] hover:text-[#3a2a24] hover:underline transition-colors"
                >
                  Log in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}
