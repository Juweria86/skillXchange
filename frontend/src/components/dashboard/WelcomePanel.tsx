import {Card} from "../ui/Card"
import Button from "../ui/Button"

interface StatItemProps {
  label: string
  value: number
}

function StatItem({ label, value }: StatItemProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-bold text-[#4a3630]">{value}</div>
    </div>
  )
}

interface WelcomePanelProps {
  userName?: string
  stats?: {
    teaching: number
    learning: number
    matches: number
    sessions: number
  }
}

export default function WelcomePanel({
  userName = "User",
  stats = { teaching: 0, learning: 0, matches: 0, sessions: 0 },
}: WelcomePanelProps) {
  return (
    <Card variant="yellow" className="mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Hi {userName} 👋 Ready to learn something new today?
          </h1>
          <p className="text-gray-700 mt-1">Here's a quick overview of your activity.</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button variant="primary" asLink to="/skill-matches">
            Find New Skills
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <StatItem 
          label="Skills you teach" 
          value={stats.teaching} 
        />
        <StatItem 
          label="Skills you're learning" 
          value={stats.learning} 
        />
        <StatItem 
          label="Matches" 
          value={stats.matches} 
        />
        <StatItem 
          label="Upcoming sessions" 
          value={stats.sessions} 
        />
      </div>
    </Card>
  )
}