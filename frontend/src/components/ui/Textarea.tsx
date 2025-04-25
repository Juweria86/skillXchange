import type React from "react"

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  fullWidth?: boolean
  variant?: "default" | "yellow"
}

export default function Textarea({
  label,
  error,
  fullWidth = true,
  variant = "default",
  className = "",
  id,
  ...props
}: TextareaProps) {
  const textareaId = id || `textarea-${Math.random().toString(36).substring(2, 9)}`

  const baseClasses =
    "px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4a3630] focus:border-transparent"

  const variantClasses = {
    default: "bg-white",
    yellow: "bg-[#FBEAA0]",
  }

  const widthClass = fullWidth ? "w-full" : ""

  const textareaClasses = `${baseClasses} ${variantClasses[variant]} ${widthClass} ${className}`

  return (
    <div className={`${fullWidth ? "w-full" : ""}`}>
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <textarea id={textareaId} className={textareaClasses} {...props} />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}
