import MainLayout from "../components/layout/MainLayout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { Link } from "react-router-dom";
import { ArrowRight} from "lucide-react";

import WatermarkedSection from "../components/ui/WatermarkedSection";

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
                      src="https://api.dicebear.com/7.x/adventurer/svg?seed=Jordan"
                      alt="Avatar 1 - Youthful"
                      width={120}
                      height={120}
                      className="rounded-2xl"
                    />
                  </div>
                </div>

                <div className="absolute right-[30%] top-[10%] transform rotate-3">
                  <div className="bg-pink-200 rounded-2xl p-1 shadow-md">
                    <img
                      src="https://api.dicebear.com/7.x/fun-emoji/svg?seed=Fatima"
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
                      src="https://api.dicebear.com/7.x/adventurer/svg?seed=Raj"
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
                      src="https://api.dicebear.com/7.x/adventurer/svg?seed=Kwame"
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
    </MainLayout>
  );
}
