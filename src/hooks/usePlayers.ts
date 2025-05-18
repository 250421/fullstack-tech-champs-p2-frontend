// src/hooks/useAuth.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const fetchUndraftedPlayers = async (searchTerm = ''): Promise<{ players: any[] }> => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.warn("No token found. Returning empty player list.");
        return { players: [] };
    }

    console.log("FETCHING PLAYERS", { searchTerm });
    try {
        const res = await axios.get('http://localhost:8080/api/players/not-drafted', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                search: searchTerm || undefined, // only send param if it's not empty
            },
            withCredentials: true,
        });

        console.log("GOT PLAYERS: ", res.data);
        return {
            players: res.data, // Assuming it's an array
        };
    } catch (error) {
        console.error("Error fetching players:", error);
        return {
            players: [],
        };
    }
};

export function usePlayers(searchTerm = '') {
  return useQuery({
    queryKey: ['players', searchTerm], // different cache per searchTerm
    queryFn: () => fetchUndraftedPlayers(searchTerm),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false, // avoid refetching every time the user switches tabs
  });
}
