import Card from "../ui/Card"
import Avatar from "../ui/Avatar"
import Badge from "../ui/Badge"
import Button from "../ui/Button"

interface MatchCardProps {
  name: string
  matchPercentage?: number
  isNewMatch?: boolean
  wantsToLearn: string
  teaches: string
  avatarSrc?: string
}

export default function MatchCard({
  name,
  matchPercentage,
  isNewMatch,
  wantsToLearn,
  teaches,
  avatarSrc,
}: MatchCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-3 mb-3">
        <Avatar src={avatarSrc || "/placeholder.svg?height=48&width=48"} size="lg" fallback={name} />
        <div>
          <h3 className="font-medium text-gray-900">{name}</h3>
          <div className="flex items-center gap-1">
            {matchPercentage ? (
              <Badge variant="green">{matchPercentage}% Match</Badge>
            ) : isNewMatch ? (
              <Badge variant="yellow">New Match</Badge>
            ) : null}
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Wants to learn:</span>
          <Badge variant="blue">{wantsToLearn}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Teaches:</span>
          <Badge variant="purple">{teaches}</Badge>
        </div>
      </div>

      <Button variant="primary" fullWidth>
        View Profile
      </Button>
    </Card>
  )
}
