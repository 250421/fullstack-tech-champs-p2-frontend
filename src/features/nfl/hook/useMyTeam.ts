import { axiosInstance } from '@/lib/axios-config';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { InvalidateQueryFilters } from '@tanstack/react-query';

export type PlayerPosition = 'QB' | 'WR' | 'RB' | 'TE' | 'K';

export interface Player {
  name: string;
  team: string;
  fantasyPoints: number;
  position: PlayerPosition;
}

export interface Team {
  teamId: number;
  teamName: string;
  qb: string; // Format: "Name,Team,FantasyPoints"
  rb: string; // Format: "Name,Team,FantasyPoints"
  wr: string; // Format: "Name,Team,FantasyPoints"
  te: string; // Format: "Name,Team,FantasyPoints"
  k: string; // Format: "Name,Team,FantasyPoints"
}

export const useMyTeam = () => {
  const queryClient = useQueryClient();

  // Helper function to get authenticated user ID
  const getUserId = (): number | null => {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId, 10) : null;
  };

  const userId = 18;
  console.log(userId);
  // Fetch team by user ID
  const { 
    data: team, 
    isLoading, 
    isError 
  } = useQuery<Team>({
    queryKey: ['myTeam', userId],
    queryFn: async () => {
      if (!userId) {
        throw new Error('User not authenticated');
      }
      const response = await axiosInstance.get("/api/teams/${userId}");
      return response.data;
    },
    enabled: !!userId, // Only fetch if user is authenticated
  });

  // Mutation to update team
  const updateTeamMutation = useMutation({
    mutationFn: async (updatedTeam: Team) => {
      if (!userId) {
        throw new Error('User not authenticated');
      }
      const response = await axiosInstance.put(
        `/api/teams/${updatedTeam.teamId}`,
        { ...updatedTeam, userId }
      );
      return response.data;
    },
    onSuccess: (updatedTeam) => {
      // Update the cache with new data
      queryClient.setQueryData(['myTeam', userId], updatedTeam);
    },
  });

  // Mutation to delete team
  const deleteTeamMutation = useMutation({
    mutationFn: async (teamId: number) => {
      if (!userId) {
        throw new Error('User not authenticated');
      }
      await axiosInstance.delete(`/api/teams/${teamId}`, {
        data: { userId }
      });
    },
    onSuccess: () => {
      // Properly invalidate queries with correct typing
      queryClient.invalidateQueries({
        queryKey: ['myTeam', userId],
      } as InvalidateQueryFilters);
    },
  });

  // Convert backend team format to frontend player array
  const parsePlayer = (playerString: string, position: PlayerPosition): Player => {
    const [name, team, fantasyPoints] = playerString.split(',');
    return {
      name,
      team,
      fantasyPoints: parseFloat(fantasyPoints),
      position,
    };
  };

  const players = team
    ? [
        ...(team.qb ? [parsePlayer(team.qb, 'QB')] : []),
        ...(team.rb ? [parsePlayer(team.rb, 'RB')] : []),
        ...(team.wr ? [parsePlayer(team.wr, 'WR')] : []),
        ...(team.te ? [parsePlayer(team.te, 'TE')] : []),
        ...(team.k ? [parsePlayer(team.k, 'K')] : []),
      ]
    : [];

  return {
    team,
    players,
    isLoading,
    isError,
    updateTeam: updateTeamMutation.mutateAsync,
    isUpdating: updateTeamMutation.isPending,
    deleteTeam: deleteTeamMutation.mutateAsync,
    isDeleting: deleteTeamMutation.isPending,
  };
};