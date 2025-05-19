// src/hooks/useLeaderboard.ts
import { useAuth } from '@/features/auth/hook/useAuth';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';


export interface TeamLeaderboardDto {
  teamName: string;
  imgUrl: string;
  totalFantasyPoints: number;
}

export const useLeaderboard = () => {
  const { isLoading: authLoading } = useAuth();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  return useQuery<TeamLeaderboardDto[]>({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      if (!token) throw new Error('No token found');
      
      const response = await axios.get<TeamLeaderboardDto[]>(
        'http://3.20.227.225:8082/api/teams/leaderboard',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      return response.data;
    },
    enabled: !!token && !authLoading,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
