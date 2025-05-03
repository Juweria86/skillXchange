import MainLayout from "../components/layout/MainLayout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight, Lightbulb, Rocket, Users } from "lucide-react";


import WatermarkedSection from "../components/ui/WatermarkedSection";


const features = [
  {
    title: "Skill Matching",
    desc: "Get connected with peers based on skills you want to learn and skills you can teach.",
    icon: Users,
  },
  {
    title: "In-App Messaging",
    desc: "Communicate and collaborate with your match directly through the platform.",
    icon: Lightbulb,
  },
  {
    title: "Session Scheduling",
    desc: "Plan and manage your learning sessions in a calendar-based interface.",
    icon: Rocket,
  },
];

const steps = [
  {
    title: "1. Create Your Profile",
    desc: "List the skills you can teach and those you want to learn.",
  },
  {
    title: "2. Get Matched",
    desc: "The platform finds ideal partners based on your preferences.",
  },
  {
    title: "3. Learn & Teach",
    desc: "Connect, chat, and schedule sessions to swap skills!",
  },
];

export default function HomePage() {
  return (
    <MainLayout>
        {/* Main Content */}
        <main className="flex-grow flex justify-center items-center p-4 py-12 w-full">
          <div className="w-full max-w-[90%] xl:max-w-[1400px] bg-yellow-300 rounded-[40px] overflow-hidden shadow-xl flex flex-col lg:flex-row">
            {/* Left side with avatars (visual section) */}
            <div className="relative w-full lg:w-1/2 p-8 lg:p-16">
              <div className="relative h-64 lg:h-full">
                <div className="absolute left-[10%] top-[15%] transform -rotate-6">
                  <div className="bg-orange-300 rounded-3xl p-1 shadow-md">
                    <img
                      src="/white.jpeg"
                      alt="Avatar 1 - Youthful"
                      width={120}
                      height={120}
                      className="rounded-2xl"
                    />
                  </div>
                </div>

                <div className="absolute right-[40%] top-[10%] transform rotate-3">
                  <div className="bg-pink-200 rounded-2xl p-1 shadow-md">
                    <img
                      src="/brown.jpeg"
                      alt="Avatar 2 - Female"
                      width={90}
                      height={90}
                      className="rounded-xl"
                    />
                  </div>
                </div>

                <div className="absolute left-[25%] top-[50%] transform rotate-12">
                  <div className="bg-gray-800 rounded-3xl p-1 shadow-md">
                    <img
                      src="/black.jpeg"
                      alt="Avatar 3"
                      width={100}
                      height={100}
                      className="rounded-2xl"
                    />
                  </div>
                </div>

                <div className="absolute right-[15%] top-[45%] transform -rotate-6">
                  <div className="bg-pink-200 rounded-3xl p-1 shadow-md">
                    <img
                      src="/hij.jpeg"
                      alt="Avatar 4"
                      width={150}
                      height={150}
                      className="rounded-2xl"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right side with content */}
            <div className="w-full lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center">
              <div className="max-w-lg mx-auto lg:mx-0">
                <h1 className="text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-6">
                  Let&apos;s Get Started
                </h1>

                <p className="text-lg mb-10 max-w-md">
                  Unlock a world of limitless skills and knowledge with our free skill swapping app, where sharing is
                  caring!
                </p>

                <div className="space-y-4">
                  <Link
                    to="/signup"
                    className="w-full py-4 bg-[#4a3630] text-white rounded-xl text-lg font-medium hover:bg-[#3a2a24] transition-colors flex items-center justify-center gap-2"
                  >
                    Join Now
                    <ArrowRight className="w-5 h-5" />
                  </Link>

                  <div className="text-center lg:text-left text-lg">
                    Already have an account?{" "}
                    <Link to="/login" className="font-bold hover:underline">
                      Login
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>


        <section className="bg-white py-20 px-4" id="about">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6 text-[#4a3630]">About SkillXchange</h2>
            <p className="text-lg text-gray-700 mb-4">
              SkillXchange is built for students and young professionals to connect, share, and grow through
              peer-to-peer learning. Developed as a final year project for Mogadishu University, it empowers skill
              exchange through a simple and intuitive platform.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-gray-100 py-20 px-4" id="features">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-12 text-[#4a3630]">Key Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map(({ title, desc, icon: Icon }, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl shadow-lg p-6 border border-yellow-200 hover:shadow-xl transition"
                >
                  <Icon className="w-10 h-10 text-[#123C94] mb-4 mx-auto" />
                  <h3 className="text-xl font-semibold mb-2">{title}</h3>
                  <p className="text-gray-600 text-sm">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="bg-white py-20 px-4" id="how-it-works">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-12 text-[#4a3630]">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {steps.map(({ title, desc }, idx) => (
                <div
                  key={idx}
                  className="bg-yellow-100 rounded-xl p-6 shadow border border-yellow-200"
                >
                  <h3 className="text-xl font-semibold mb-2 text-[#4a3630]">{title}</h3>
                  <p className="text-gray-700 text-sm">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
    
    </MainLayout>
  );
}
