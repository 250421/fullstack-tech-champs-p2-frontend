import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Trash2, PlusCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useMyTeam, type Player } from '@/features/nfl/hook/useMyTeam';

export const Route = createFileRoute('/(auth)/_auth/my-team-page')({
  component: TeamPage,
});

function TeamPage() {
  const { teams, isLoading, isError, deleteTeam, isDeleting, teamToPlayers } = useMyTeam();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load team data. Please try again later.
      </div>
    );
  }

  if (!teams || teams.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-6">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>No Teams Found</CardTitle>
            <CardDescription>You don't have any teams yet</CardDescription>
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
    );
  }

  return (
    <div className="container mx-auto py-15 space-y-8">
      {/* Check if 'teams' is an array and not empty */}
      {Array.isArray(teams) && teams.length > 0 ? (
        teams.map((team) => (
          <div key={team.teamId} className="space-y-4">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">{team.teamName}</h1>
              <DeleteTeamDialog
                onConfirm={() => deleteTeam(team.teamId)}
                isDeleting={isDeleting}
              />
            </div>

            {/* Ensure teamToPlayers returns a valid array */}
            <TeamPlayersCard players={teamToPlayers(team) || []} />
          </div>
        ))
      ) : (
        <p>No teams available.</p> // Fallback message when no teams are present
      )}
    </div>

  );
}

function TeamPlayersCard({ players }: { players: Player[] }) {
  return (
    <Card className="w-full bg-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Players</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 text-white">
          {players.map((player) => (
            <div key={`${player.name}-${player.position}`} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-4">
                <Avatar className="h-10 w-10 bg-gray-100">
                  <AvatarImage src="" alt="Default avatar" />
                  <AvatarFallback>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-gray-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v1.2h19.2v-1.2c0-3.2-6.4-4.8-9.6-4.8z" />
                    </svg>
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{player.name}</p>
                  <p className="text-sm text-muted-foreground">{player.team}</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <Badge variant="outline" className="capitalize mb-1 bg-green-400 text-base">
                  {player.position}
                </Badge>
                {/* <span className="text-sm font-medium">
                  {player.fantasyPoints} pts
                </span> */}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
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
  );
}