interface AvatarProps {
  src?: string
  alt?: string
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  className?: string
  fallback?: string
}

export default function Avatar({ src, alt = "Avatar", size = "md", className = "", fallback }: AvatarProps) {
  const sizeClasses = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  }

  const getFallbackInitials = () => {
    if (!fallback) return "U"
    return fallback
      .split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase()
  }

  return (
    <div
      className={`relative rounded-full overflow-hidden bg-gray-100 flex items-center justify-center ${sizeClasses[size]} ${className}`}
    >
      {src ? (
        <img
          src={src || "/placeholder.svg"}
          alt={alt}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none"
          }}
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-[#4a3630] text-white font-medium">
          {getFallbackInitials()}
        </div>
      )}
    </div>
  )
}
