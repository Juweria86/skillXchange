import { cn } from "../../utils/cn"

interface FooterProps {
  className?: string
}

export default function Footer({ className }: FooterProps) {
  return (
  <footer className="bg-[#F9F9F9] py-8 text-center text-sm text-gray-500 border-t">
    Built for <strong>Mogadishu University</strong> — Final Year CS Project © {new Date().getFullYear()}
  </footer>
  )
}
