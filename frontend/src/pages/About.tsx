
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-6 text-[#4a3630]">About SkillXchange</h1>
        <p className="text-lg text-gray-700 mb-4">
          SkillXchange is a platform built for students and young professionals to connect, share, and grow through
          skill exchange. It was developed as a final year project for Mogadishu University to empower peer-to-peer
          learning in a practical and engaging environment.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          The platform enables users to list skills they can teach, and those they want to learn, and then get matched
          with others for learning sessions. This project also integrates gamification, session scheduling, and
          communication tools to create a rich collaborative experience.
        </p>
        <p className="text-sm text-gray-500 mt-8 italic">
          Proudly developed for Mogadishu University — Department of Computer Science.
        </p>

        <div className="mt-8">
          <Link
            to="/features"
            className="text-[#123C94] hover:underline font-medium"
          >
            Explore Features →
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}