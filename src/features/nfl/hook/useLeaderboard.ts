// src/hooks/useLeaderboard.ts
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'


export interface TeamStats {
  id: string
  rank: number
  teamName: string
  wins: number
  losses: number
  ties: number
  points: number
}

interface LeaderboardResponse {
  success: boolean
  data: TeamStats[]
  currentUserTeam?: TeamStats
}

export const useLeaderboard = (week?: number) => {
  return useQuery<LeaderboardResponse>({
    queryKey: ['leaderboard', week],
    queryFn: async () => {
      const response = await axios.get('/leaderboard', {
        params: { week },
      })
      return response.data
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}