import { useAuth } from '@/features/auth/hook/useAuth';
import { axiosInstance } from '@/lib/axios-config';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseMutateAsyncFunction } from '@tanstack/react-query';

export type PlayerPosition = 'Quarterback' | 'Wide Receiver' | 'Runningback' | 'Tightends' | 'Kicker';

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
  rb: string;
  wr: string;
  te: string;
  k: string;
}

interface UseMyTeamReturn {
  teams: Team[] | undefined;
  isLoading: boolean;
  isError: boolean;
  updateTeam: UseMutateAsyncFunction<any, Error, Team, unknown>;
  isUpdating: boolean;
  deleteTeam: UseMutateAsyncFunction<void, Error, number, unknown>;
  isDeleting: boolean;
  teamToPlayers: (team: Team) => Player[];
}

export const useMyTeam = (): UseMyTeamReturn => {
  const queryClient = useQueryClient();
  const { data: authData } = useAuth();
  const userId = authData?.userId;

  const parsePlayer = (playerString: string, position: PlayerPosition): Player => {
    if (!playerString) return { name: '', team: '', fantasyPoints: 0, position };
    
    const parts = playerString.split(',');
    return {
      name: parts[0]?.trim() || '',
      team: parts[1]?.trim() || '',
      fantasyPoints: parseFloat(parts[2]) || 0,
      position,
    };
  };

  const { data: teams, isLoading, isError } = useQuery<Team[]>({
    queryKey: ['myTeams', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User not authenticated');
      const response = await axiosInstance.get(`/api/teams/team1/${userId}`);
      return response.data;
    },
    enabled: !!userId,
  });

  const updateTeamMutation = useMutation({
    mutationFn: async (updatedTeam: Team) => {
      if (!userId) throw new Error('User not authenticated');
      const response = await axiosInstance.put(
        `/api/teams/${updatedTeam.teamId}`,
        { ...updatedTeam, userId }
      );
      return response.data;
    },
    onSuccess: (updatedTeam) => {
      queryClient.setQueryData(['myTeams', userId], (old: Team[] | undefined) => 
        old?.map(team => team.teamId === updatedTeam.teamId ? updatedTeam : team)
      );
    },
  });

  const deleteTeamMutation = useMutation({
    mutationFn: async (teamId: number) => {
      if (!userId) throw new Error('User not authenticated');
      await axiosInstance.delete(`/api/teams/${teamId}`, {
        data: { userId },
      });
    },
    onSuccess: (_, teamId) => {
      queryClient.setQueryData(['myTeams', userId], (old: Team[] | undefined) => 
        old?.filter(team => team.teamId !== teamId)
      );
    },
  });

  const teamToPlayers = (team: Team): Player[] => {
    return [
      ...(team.qb ? [parsePlayer(team.qb, 'Quarterback')] : []),
      ...(team.rb ? [parsePlayer(team.rb, 'Wide Receiver')] : []),
      ...(team.wr ? [parsePlayer(team.wr, 'Wide Receiver')] : []),
      ...(team.te ? [parsePlayer(team.te, 'Tightends')] : []),
      ...(team.k ? [parsePlayer(team.k, 'Kicker')] : []),
    ];
  };

  return {
    teams,
    isLoading,
    isError,
    updateTeam: updateTeamMutation.mutateAsync,
    isUpdating: updateTeamMutation.isPending,
    deleteTeam: deleteTeamMutation.mutateAsync,
    isDeleting: deleteTeamMutation.isPending,
    teamToPlayers,
  };
};