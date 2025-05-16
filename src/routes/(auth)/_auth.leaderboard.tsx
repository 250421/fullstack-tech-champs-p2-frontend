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
import { Skeleton } from '@/components/ui/skeleton'
import { useLeaderboard } from '@/features/nfl/hook/useLeaderboard'
import { useSidebar } from '@/hooks/use-sidebar'
import { useState } from 'react'
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export const Route = createFileRoute('/(auth)/_auth/leaderboard')({
  component: LeaderboardPage,
})

const ITEMS_PER_PAGE = 10

function LeaderboardPage() {
  const { data, isLoading, isError } = useLeaderboard()
  const [sortConfig, setSortConfig] = useState<{
    key: 'teamName' | 'totalFantasyPoints'
    direction: 'ascending' | 'descending'
  }>({ key: 'totalFantasyPoints', direction: 'descending' })
  const [currentPage, setCurrentPage] = useState(1)
  const { isOpen } = useSidebar()

  const handleSort = (key: 'teamName' | 'totalFantasyPoints') => {
    setSortConfig(prev => ({
      key,
      direction:
        prev.key === key && prev.direction === 'descending'
          ? 'ascending'
          : 'descending'
    }))
    setCurrentPage(1) // Reset to first page when sorting changes
  }

  const sortedTeams = data ? [...data].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1
    }
    return 0
  }) : []

  // Pagination logic
  const totalPages = Math.ceil(sortedTeams.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedTeams = sortedTeams.slice(startIndex, endIndex)

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  if (isError) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-red-500 p-4 border rounded">
          Failed to load leaderboard data
        </div>
      </div>
    )
  }

  return (
    <div className={`container mx-auto py-8 transition-all duration-300 ${isOpen ? 'ml-8' : 'ml-0'}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold mt-5">Fantasy Leaderboard</h1>
      </div>

      <div className="rounded-md border bg-gray-800">
        <Table>
          <TableCaption className='text-white py-2'>
            Fantasy points leaderboard
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 bg-green-400 text-black hover:bg-green-500"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 bg-green-400 text-black hover:bg-green-500"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-white w-[200px]">Team</TableHead>
              <TableHead className="text-right text-white">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('totalFantasyPoints')}
                  className="flex items-center gap-1 float-right hover:bg-gray-700"
                >
                  Total Fantasy Points
                  {sortConfig.key === 'totalFantasyPoints' ? (
                    sortConfig.direction === 'ascending' ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : (
                      <ArrowDown className="h-4 w-4" />
                    )
                  ) : null}
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              paginatedTeams.map((team, index) => (
                <TableRow key={team.teamName} className="hover:bg-gray-700">
                  <TableCell className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={team.imgUrl}
                        alt={team.teamName}
                        className="object-cover"
                      />
                      <AvatarFallback>
                        {team.teamName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className='text-white font-medium'>
                      {startIndex + index + 1}. {team.teamName}
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-white font-medium">
                    {team.totalFantasyPoints.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}