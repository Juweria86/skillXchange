"use client"

import { useState, useEffect } from "react"
import MainLayout from "../components/layout/MainLayout"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import { ArrowRight, MessageCircle, Calendar, Users, Star, ArrowUpRight, Sparkles } from "lucide-react"

const features = [
  {
    title: "Skill Matching",
    desc: "Our intelligent algorithm connects you with the perfect learning partners based on complementary skills and interests.",
    icon: Users,
    color: "bg-[#FBEAA0]",
    iconColor: "text-[#4a3630]",
  },
  {
    title: "In-App Messaging",
    desc: "Communicate seamlessly with your matches through our built-in messaging system. Plan sessions and share resources easily.",
    icon: MessageCircle,
    color: "bg-[#F5D0C5]",
    iconColor: "text-[#4a3630]",
  },
  {
    title: "Session Scheduling",
    desc: "Organize your learning journey with our intuitive calendar. Schedule, manage, and track all your skill-swapping sessions.",
    icon: Calendar,
    color: "bg-[#D7E9F7]",
    iconColor: "text-[#4a3630]",
  },
]

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Graphic Designer",
    quote: "SkillSwap helped me learn coding basics while I taught design principles. It's a win-win exchange!",
    avatar: "/images/avatars/sarah.png",
    stars: 5,
  },
  {
    name: "Michael Chen",
    role: "Marketing Student",
    quote: "I've made amazing connections and learned practical skills that my university courses don't cover.",
    avatar: "/images/avatars/michael.png",
    stars: 5,
  },
  {
    name: "Aisha Hassan",
    role: "Software Developer",
    quote: "Teaching others has improved my own skills dramatically. Plus, I learned photography from an amazing pro!",
    avatar: "/images/avatars/aisha.png",
    stars: 4,
  },
]

export default function HomePage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)

    // Auto-rotate testimonials
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <MainLayout showHeader={true} showFooter={true}>
      {/* Hero Section */}
      <section
        className={`relative bg-[#FFF7D4] py-16 md:py-24 px-4 transition-all duration-700 ${isVisible ? "opacity-100" : "opacity-0"}`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Content */}
            <div className="w-full lg:w-1/2 space-y-8">
              <div className="inline-block bg-[#FBEAA0] px-4 py-2 rounded-full">
                <p className="text-[#4a3630] font-medium flex items-center">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Share skills, grow together
                </p>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#4a3630] leading-tight">
                Learn anything by <span className="text-[#e67e22]">teaching</span> what you know
              </h1>

              <p className="text-lg text-gray-700 max-w-xl">
                SkillSwap connects you with others for mutual skill exchange. Teach what you're good at, learn what you
                want to know - all for free.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="primary" size="lg" asLink to="/signup" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Get Started
                </Button>

                <Button variant="outline" size="lg" asLink to="/login">
                  I Already Have an Account
                </Button>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-3">
                  {[
                    "/images/avatars/user1.png",
                    "/images/avatars/user2.png",
                    "/images/avatars/user3.png",
                    "/images/avatars/user4.png",
                  ].map((src, i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                      <img
                        src={src || "/placeholder.svg"}
                        alt={`User ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-bold">500+</span> users already joined
                </p>
              </div>
            </div>

            {/* Right Image/Illustration */}
            <div className="w-full lg:w-1/2 relative">
              <div className="relative h-[400px] md:h-[500px]">
                {/* Decorative elements */}
                <div className="absolute w-full h-full">
                  <div className="absolute w-64 h-64 bg-[#FBEAA0] rounded-full -top-10 -right-10 opacity-50"></div>
                  <div className="absolute w-32 h-32 bg-[#F5D0C5] rounded-full bottom-20 left-10 opacity-50"></div>
                </div>

                {/* Avatar images */}
                <div className="absolute left-[10%] top-[15%] transform -rotate-6 transition-all duration-500 hover:scale-105">
                  <div className="bg-[#F5D0C5] rounded-3xl p-2 shadow-lg">
                    <div className="relative">
                      <img
                        src="/images/avatars/designer.png"
                        alt="Designer"
                        width={120}
                        height={120}
                        className="rounded-2xl"
                      />
                      <div className="absolute -right-4 -bottom-4 bg-white rounded-full p-2 shadow-md">
                        <div className="bg-[#FBEAA0] rounded-full p-1">
                          <span className="block">🎨</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute right-[20%] top-[10%] transform rotate-3 transition-all duration-500 hover:scale-105 z-10">
                  <div className="bg-[#D7E9F7] rounded-2xl p-2 shadow-lg">
                    <div className="relative">
                      <img
                        src="/images/avatars/developer.png"
                        alt="Developer"
                        width={100}
                        height={100}
                        className="rounded-xl"
                      />
                      <div className="absolute -right-4 -bottom-4 bg-white rounded-full p-2 shadow-md">
                        <div className="bg-[#FBEAA0] rounded-full p-1">
                          <span className="block">💻</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute left-[25%] top-[50%] transform rotate-6 transition-all duration-500 hover:scale-105 z-20">
                  <div className="bg-white rounded-3xl p-2 shadow-lg">
                    <div className="relative">
                      <img src="/images/avatars/chef.png" alt="Chef" width={130} height={130} className="rounded-2xl" />
                      <div className="absolute -right-4 -bottom-4 bg-white rounded-full p-2 shadow-md">
                        <div className="bg-[#FBEAA0] rounded-full p-1">
                          <span className="block">🍳</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute right-[15%] bottom-[20%] transform -rotate-6 transition-all duration-500 hover:scale-105">
                  <div className="bg-[#FBEAA0] rounded-3xl p-2 shadow-lg">
                    <div className="relative">
                      <img
                        src="/images/avatars/teacher.png"
                        alt="Teacher"
                        width={110}
                        height={110}
                        className="rounded-2xl"
                      />
                      <div className="absolute -right-4 -bottom-4 bg-white rounded-full p-2 shadow-md">
                        <div className="bg-[#FBEAA0] rounded-full p-1">
                          <span className="block">📚</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="w-full h-16 text-white"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.11,130.83,141.14,214.86,141.14c67.64,0,133.76-18.59,190.91-39.94Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#4a3630] mb-4">Why Choose SkillSwap?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform makes skill exchange simple, effective, and enjoyable.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <Card key={idx} className="border-none overflow-hidden transition-all duration-300 hover:shadow-xl">
                <div className="h-full flex flex-col">
                  <div className={`${feature.color} p-6 flex justify-center`}>
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-md">
                      <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
                    </div>
                  </div>

                  <div className="p-6 flex-grow">
                    <h3 className="text-xl font-bold text-[#4a3630] mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.desc}</p>
                  </div>

                  <div className="px-6 pb-6">
                    <Button
                      variant="ghost"
                      className="text-[#4a3630] hover:bg-[#FFF7D4] w-full justify-between"
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      Learn more
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-[#FFF7D4] py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#4a3630] mb-4">How SkillSwap Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Three simple steps to start your skill-swapping journey
            </p>
          </div>

          <div className="relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-[#FBEAA0] -translate-y-1/2 z-0"></div>

            <div className="grid md:grid-cols-3 gap-8 relative z-10">
              {/* Step 1 */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg mb-6 border-4 border-[#FBEAA0]">
                  <span className="text-2xl font-bold text-[#4a3630]">1</span>
                </div>

                <Card className="w-full text-center border-none h-full">
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#4a3630] mb-3">Create Your Profile</h3>
                    <p className="text-gray-600">
                      Sign up and list the skills you can teach and those you want to learn. Add your availability and
                      preferences.
                    </p>
                  </div>
                </Card>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg mb-6 border-4 border-[#FBEAA0]">
                  <span className="text-2xl font-bold text-[#4a3630]">2</span>
                </div>

                <Card className="w-full text-center border-none h-full">
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#4a3630] mb-3">Get Matched</h3>
                    <p className="text-gray-600">
                      Our algorithm finds your ideal skill-swapping partners based on complementary skills and mutual
                      interests.
                    </p>
                  </div>
                </Card>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg mb-6 border-4 border-[#FBEAA0]">
                  <span className="text-2xl font-bold text-[#4a3630]">3</span>
                </div>

                <Card className="w-full text-center border-none h-full">
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#4a3630] mb-3">Learn & Teach</h3>
                    <p className="text-gray-600">
                      Connect with your matches, schedule sessions, and start exchanging knowledge and skills!
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Button variant="primary" size="lg" asLink to="/signup" rightIcon={<ArrowRight className="w-5 h-5" />}>
              Start Your Journey
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#4a3630] mb-4">What Our Users Say</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join hundreds of satisfied users who are already exchanging skills
            </p>
          </div>

          <div className="relative overflow-hidden">
            <div
              className="flex transition-all duration-500"
              style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}
            >
              {testimonials.map((testimonial, idx) => (
                <div key={idx} className="min-w-full px-4">
                  <Card className="max-w-3xl mx-auto border-none shadow-lg p-8">
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                      <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 border-4 border-[#FBEAA0]">
                        <img
                          src={testimonial.avatar || "/placeholder.svg"}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-grow">
                        <div className="flex mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${i < testimonial.stars ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>

                        <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>

                        <div>
                          <h4 className="font-bold text-[#4a3630]">{testimonial.name}</h4>
                          <p className="text-sm text-gray-500">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>

            {/* Testimonial navigation dots */}
            <div className="flex justify-center mt-8 gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTestimonial(idx)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    activeTestimonial === idx ? "bg-[#4a3630] w-6" : "bg-gray-300"
                  }`}
                  aria-label={`View testimonial ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-[#FFF7D4] py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-[#FBEAA0] px-4 py-2 rounded-full mb-6">
                <p className="text-[#4a3630] font-medium">Our Story</p>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-[#4a3630] mb-6">About SkillSwap</h2>

              <p className="text-lg text-gray-700 mb-6">
                SkillSwap was born from a simple idea: everyone has something to teach and something to learn. Developed
                as a final year project at Mogadishu University, our platform connects students and young professionals
                for mutual skill exchange.
              </p>

              <p className="text-lg text-gray-700 mb-8">
                We believe in the power of peer-to-peer learning and the value of practical skills. Our mission is to
                create a community where knowledge flows freely and everyone has the opportunity to grow through
                teaching and learning.
              </p>

              <Button variant="outline" size="lg" rightIcon={<ArrowUpRight className="w-5 h-5" />}>
                Learn More About Us
              </Button>
            </div>

            <div className="relative">
              <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
                <img src="/images/team-photo.png" alt="SkillSwap Team" className="w-full h-full object-cover" />

                {/* Decorative elements */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#FBEAA0] rounded-2xl -z-10"></div>
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#F5D0C5] rounded-2xl -z-10"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#4a3630] py-20 px-4 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Skill-Swapping Journey?</h2>

          <p className="text-lg text-gray-200 mb-10 max-w-2xl mx-auto">
            Join our community today and discover the joy of learning through teaching. It's completely free and only
            takes a minute to get started.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" asLink to="/signup" rightIcon={<ArrowRight className="w-5 h-5" />}>
              Create Your Account
            </Button>

            <Button
              variant="outline"
              size="lg"
              asLink
              to="/login"
              className="border-white text-white hover:bg-white/10"
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
