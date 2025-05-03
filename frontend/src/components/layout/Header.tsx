import Logo from "../Logo"
import Button from "../ui/Button"

interface HeaderProps {
  showAuthButtons?: boolean
}

export default function Header({ showAuthButtons = true }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Logo />

        {showAuthButtons && (
          <div className="flex items-center gap-4">
            <Button variant="ghost" asLink to="#">
              About
            </Button>
            <Button variant="ghost" asLink to="/feautures">
              feautures
            </Button>
            <Button variant="ghost" asLink to="/login">
              Login
            </Button>
            <Button variant="primary" asLink to="/signup">
              Sign Up
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
