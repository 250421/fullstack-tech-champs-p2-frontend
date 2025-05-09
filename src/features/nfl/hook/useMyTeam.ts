// src/hooks/useMyTeam.ts
import { axiosInstance } from '@/lib/axios-config'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'


export type PlayerPosition = 'QB' | 'WR' | 'RB' | 'TE' | 'K' | 'DEF'

export interface Player {
  id: string
  name: string
  position: PlayerPosition
}

export interface Team {
  id: string
  name: string
  players: Player[]
}

export const useMyTeam = () => {
  const queryClient = useQueryClient()

  const { data: team, isLoading, isError } = useQuery<Team>({
    queryKey: ['myTeam'],
    queryFn: async () => {
      const response = await axiosInstance.get('/link/data')
      return response.data
    },
  })

  const deleteTeamMutation = useMutation({
    mutationFn: async () => {
      await axiosInstance.delete('/api/teams/my-team')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myTeam'] })
    },
  })

  return {
    team,
    isLoading,
    isError,
    deleteTeam: deleteTeamMutation.mutateAsync,
    isDeleting: deleteTeamMutation.isPending,
  }
}