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
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'

import { useState } from 'react'
import { useLeaderboard } from '@/features/nfl/hook/useLeaderboard'

export const Route = createFileRoute('/(auth)/_auth/leaderboard')({
  component: LeaderboardPage,
})

function LeaderboardPage() {
  const [selectedWeek, setSelectedWeek] = useState<number | undefined>(undefined)
  const { data, isLoading, isError } = useLeaderboard(selectedWeek)

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

  return (
    <div className="container mx-auto py-8">
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
          <Button variant="outline">View Season</Button>
        </div>
      </div>

      <div className="mb-4 w-48">
        <Select
          value={selectedWeek?.toString() ?? 'all'}
          onValueChange={(value) => {
            setSelectedWeek(value === 'all' ? undefined : parseInt(value))
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by week" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Weeks</SelectItem>
            {Array.from({ length: 18 }, (_, i) => i + 1).map((week) => (
              <SelectItem key={week} value={week.toString()}>
                Week {week}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableCaption>
            {selectedWeek
              ? `Leaderboard for Week ${selectedWeek}`
              : 'Overall Season Leaderboard'}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Rank</TableHead>
              <TableHead>Team Name</TableHead>
              <TableHead>W-L-T</TableHead>
              <TableHead className="text-right">Points</TableHead>
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
                    currentUserTeam?.id === team.id ? 'bg-secondary' : ''
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