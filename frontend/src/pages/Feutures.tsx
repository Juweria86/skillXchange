import MainLayout from "../components/layout/MainLayout";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  "Create & manage your profile with skills you can teach and want to learn",
  "Find perfect matches based on mutual interests",
  "Schedule skill sessions and track your learning progress",
  "Communicate directly through in-app messaging",
  "Receive feedback and earn badges for active participation",
  "Designed with modern tools: React, Node.js, and TailwindCSS",
];

export default function FeaturesPage() {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-6 text-[#4a3630]">Key Features</h1>
        <ul className="space-y-4 text-lg text-gray-700">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <CheckCircle className="text-green-600 mt-1" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <Link
            to="/about"
            className="text-[#123C94] hover:underline font-medium"
          >
            ← Learn About SkillXchange
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}