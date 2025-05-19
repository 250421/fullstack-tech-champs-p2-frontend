// src/hooks/useAuth.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const fetchLeagueById = async (league_id: String): Promise<{ league: any }> => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.warn("No token found. Returning empty league list.");
        return { league: null };
    }

    console.log("FETCHING LEAGUE BY ID");
    try {
        const res = await axios.get(`http://3.20.227.225:8082/api/leagues/${league_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
        });

        console.log("GOT LEAGUE DATA : ", res.data);
        return {
            league: res.data,
        };
    } catch (error) {
        console.error("Error fetching league data:", error);
        return {
            league: null,
        };
    }
};

export function useGetLeagueById(league_id: String) {
  return useQuery({
    queryKey: ['league', league_id], // Make sure cache is specific to each league
    queryFn: () => fetchLeagueById(league_id),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false, // avoid refetching every time the user switches tabs
  });
}