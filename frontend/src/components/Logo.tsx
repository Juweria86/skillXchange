import { Link } from "react-router-dom";
import { ArrowLeftRight } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
}

const Logo = ({ size = "md" }: LogoProps) => {
  // Size classes for different logo sizes
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <Link to="/" className="flex items-center gap-2">
      <div className="bg-[#0C4B93] text-white p-2 rounded-lg shadow-md flex items-center justify-center">
        <ArrowLeftRight className="w-6 h-6" />
      </div>
      <div className={`font-bold ${sizeClasses[size]} text-[#0C4B93]`}>
        <span>Skill</span>
        <span className="text-[#106CC8]">Xchange</span>
      </div>
    </Link>
  );
};

export default Logo;
