"use client"

import type React from "react"
import { useState } from "react"

interface ProfileImageProps {
  src: string | null
  alt?: string
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

const ProfileImage: React.FC<ProfileImageProps> = ({ src, alt = "Profile", size = "md", className = "" }) => {
  const [hasError, setHasError] = useState(false)

  // Determine size class
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-24 h-24",
    xl: "w-32 h-32",
  }

  const sizeClass = sizeClasses[size]

  // Get initial for fallback
  const initial = alt ? alt.charAt(0).toUpperCase() : "?"

  // Handle image error
  const handleError = () => {
    console.log("Image failed to load:", src)
    setHasError(true)
  }

  return (
    <div
      className={`${sizeClass} rounded-full bg-[#FBEAA0] flex items-center justify-center overflow-hidden ${className}`}
    >
      {src && !hasError ? (
        <img src={src || "/placeholder.svg"} alt={alt} className="w-full h-full object-cover" onError={handleError} />
      ) : (
        <span
          className="text-[#4a3630] font-bold text-center"
          style={{
            fontSize: size === "xl" ? "2.5rem" : size === "lg" ? "2rem" : size === "md" ? "1.5rem" : "1rem",
          }}
        >
          {initial}
        </span>
      )}
    </div>
  )
}

export default ProfileImage
