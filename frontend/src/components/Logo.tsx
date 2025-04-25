import { Link } from "react-router-dom"

interface LogoProps {
  linkTo?: string
  size?: "sm" | "md" | "lg"
}

export default function Logo({ linkTo = "/", size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "p-1.5",
    md: "p-2",
    lg: "p-3",
  }

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  }

  const LogoContent = () => (
    <div className="flex items-center gap-2">
      <div className={`bg-[#4a3630] text-white ${sizeClasses[size]} rounded-lg shadow-md`}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M21 10H3M16 2V6M8 2V6M10.5 14L8 16.5L10.5 19M13.5 14L16 16.5L13.5 19"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className={`font-bold ${textSizeClasses[size]} tracking-tight`}>SkillXchange</span>
    </div>
  )

  if (linkTo) {
    return (
      <Link to={linkTo} className="flex items-center gap-2">
        <LogoContent />
      </Link>
    )
  }

  return <LogoContent />
}
