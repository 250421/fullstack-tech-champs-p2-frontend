
import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'

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
  const { team, isLoading, isError, deleteTeam, isDeleting } = useMyTeam()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  // if (isError) {
  //   return (
  //     <div className="text-center py-10 text-red-500">
  //       Failed to load team data. Please try again later.
  //     </div>
  //   )
  // }

  if (!team || team.players.length === 0) {
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
        <h1 className="text-3xl font-bold">{team.name}</h1>
        
        <DeleteTeamDialog 
          onConfirm={deleteTeam} 
          isDeleting={isDeleting} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {team.players.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>
    </div>
  )
}

function PlayerCard({ player }: { player: Player }) {
  const positionColors = {
    QB: 'bg-blue-100 text-blue-800',
    WR: 'bg-green-100 text-green-800',
    RB: 'bg-yellow-100 text-yellow-800',
    TE: 'bg-purple-100 text-purple-800',
    K: 'bg-red-100 text-red-800',
    DEF: 'bg-gray-100 text-gray-800',
  }

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center p-4">
        <CardTitle className="text-lg">{player.name}</CardTitle>
        <span className={`px-3 py-1 rounded-full text-sm ${positionColors[player.position]}`}>
          {player.position}
        </span>
      </CardHeader>
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
        <Button variant="destructive">
          <Trash2 className="h-4 w-4 mr-2" />
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
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Confirm Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}