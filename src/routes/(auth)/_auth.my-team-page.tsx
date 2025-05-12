import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Loader2, Trash2, PlusCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useMyTeam, type Player } from '@/features/nfl/hook/useMyTeam'

export const Route = createFileRoute('/(auth)/_auth/my-team-page')({
  component: TeamPage,
})

function TeamPage() {
  const { team, players, isLoading, isError, deleteTeam, isDeleting } = useMyTeam()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load team data. Please try again later.
      </div>
    )
  }

  if (!team || players.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-6">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>No Team Found</CardTitle>
            <CardDescription>You don't have a team yet</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="gap-2">
              <a href="/create-team">
                <PlusCircle className="h-4 w-4" />
                Create Team
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{team.teamName}</h1>
        <DeleteTeamDialog 
          onConfirm={() => deleteTeam(team.teamId)} 
          isDeleting={isDeleting} 
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {players.map((player, index) => (
          <PlayerCard key={`${player.position}-${index}`} player={player} />
        ))}
      </div>
    </div>
  )
}

function PlayerCard({ player }: { player: Player }) {
  // Define the type for position colors
  type PositionColorMap = {
    [key in Player['position']]: {
      bg: string
      text: string
      border: string
    }
  }

  // Create the position colors object with proper typing
  const positionColors: PositionColorMap = {
    QB: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
    WR: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
    RB: { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-200' },
    TE: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
    K: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
  }

  // Safely get the position styles
  const position = positionColors[player.position]

  return (
    <Card className={`hover:shadow-lg transition-shadow ${position.border}`}>
      <CardHeader className="flex flex-row items-center gap-4 pb-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={`/avatars/${player.position.toLowerCase()}.png`} />
          <AvatarFallback className={position.bg}>
            {player.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <CardTitle className="text-lg">{player.name}</CardTitle>
          <CardDescription className="text-sm">{player.team}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">Fantasy Points</p>
            <p className="text-2xl font-bold">{player.fantasyPoints}</p>
          </div>
          <Badge variant="outline" className={`${position.bg} ${position.text} border-0`}>
            {player.position}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <Button variant="outline" size="sm">
          Stats
        </Button>
        <Button variant="outline" size="sm">
          Trade
        </Button>
      </CardFooter>
    </Card>
  )
}

function DeleteTeamDialog({ 
  onConfirm, 
  isDeleting 
}: { 
  onConfirm: () => Promise<void>, 
  isDeleting: boolean 
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" className="gap-2">
          <Trash2 className="h-4 w-4" />
          Delete Team
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Team</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete your team? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button 
            variant="destructive" 
            onClick={onConfirm}
            disabled={isDeleting}
            className="gap-2"
          >
            {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
            Confirm Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}