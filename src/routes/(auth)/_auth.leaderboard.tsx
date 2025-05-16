// src/routes/(auth)/_auth/leaderboard.tsx
import { createFileRoute } from '@tanstack/react-router'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
// import { Button } from '@/components/ui/button'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useLeaderboard } from '@/features/nfl/hook/useLeaderboard'
import { useSidebar } from '@/hooks/use-sidebar'

export const Route = createFileRoute('/(auth)/_auth/leaderboard')({
  component: LeaderboardPage,
})

function LeaderboardPage() {
  // const [selectedWeek, setSelectedWeek] = useState<number | undefined>(undefined)
  const { data, isLoading, isError } = useLeaderboard();

  if (isError) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-red-500 p-4 border rounded">
          Failed to load leaderboard data
        </div>
      </div>
    )
  }

  const teams = data?.data || []
  const currentUserTeam = data?.currentUserTeam
  const { isOpen } = useSidebar();
  return (
    <div className={`container mx-auto py-8 transition-all duration-300 ${isOpen ? 'ml-8' : 'ml-0'}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Season Leaderboard</h1>
        <div className="flex items-center gap-4">
          {currentUserTeam && (
            <div className="bg-secondary px-4 py-2 rounded-lg">
              <p className="text-sm text-muted-foreground">Your Team Rank</p>
              <p className="font-bold">
                #{currentUserTeam.rank} - {currentUserTeam.teamName}
              </p>
            </div>
          )}
          {/* <Button variant="outline">View Season</Button> */}
        </div>
      </div>

      <div className="mb-4 w-48">
        {/* <Select
          value={selectedWeek?.toString() ?? 'all'}
          onValueChange={(value) => {
            setSelectedWeek(value === 'all' ? undefined : parseInt(value))
          }}
        >
          <SelectTrigger className='text-white bg-gray-800'>
            <SelectValue placeholder="Filter by week" />
          </SelectTrigger>
          <SelectContent className='bg-gray-800'>
            <SelectItem value="all" className="text-white">All Weeks</SelectItem>
            {Array.from({ length: 18 }, (_, i) => i + 1).map((week) => (
              <SelectItem key={week} value={week.toString()} className='bg-gray-800 text-white'>
                Week {week}
              </SelectItem>
            ))}
          </SelectContent>
        </Select> */}
      </div>

      <div className="rounded-md border bg-gray-800">
        <Table>
          <TableCaption className='text-white py-2'>
            {/* {selectedWeek
              ? `Leaderboard for Week ${selectedWeek}`
              : 'Overall Season Leaderboard'} */}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] text-white">Rank</TableHead>
              <TableHead className="text-white">Team Name</TableHead>
              <TableHead className='text-white'>Wins - Losses - Total</TableHead>
              <TableHead className="text-right text-white">Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-8" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              teams.map((team) => (
                <TableRow
                  key={team.id}
                  className={
                    currentUserTeam?.id === team.id ? 'bg-secondary ' : ''
                  }
                >
                  <TableCell className="font-medium">#{team.rank}</TableCell>
                  <TableCell>{team.teamName}</TableCell>
                  <TableCell>
                    {team.wins}-{team.losses}-{team.ties}
                  </TableCell>
                  <TableCell className="text-right">{team.points}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}