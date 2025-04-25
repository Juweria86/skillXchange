import { cn } from "../../utils/cn"

interface FooterProps {
  className?: string
}

export default function Footer({ className }: FooterProps) {
  return (
    <footer className={cn("bg-white py-6", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-gray-500">© {new Date().getFullYear()} SkillXchange. All rights reserved.</p>
      </div>
    </footer>
  )
}
