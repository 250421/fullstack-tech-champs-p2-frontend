// src/hooks/useAuth.ts
import { useQuery } from '@tanstack/react-query';
// import axios from 'axios';

export const fetchStuff = async (): Promise<{ stuff_array: any[] }> => {

    console.log("FETCHING STUFF");
    try {
        // const res = await axios.get('http://localhost:8080/api/stuff', {
        //     headers: {
        //         Authorization: `Bearer ${token}`,
        //     },
        //     withCredentials: true,
        // });

        console.log("GOT STUFF ");
        return {
            stuff_array: [], // Assuming it's an array
        };
    } catch (error) {
        console.error("Error fetching stuff:", error);
        return {
            stuff_array: [],
        };
    }
};

export function useExample() {
  return useQuery({
    queryKey: ['stuff_array'], // ID for cached data
    queryFn: () => fetchStuff(),
    staleTime: 1000 * 60 * 5, // Refresh cache data after x time has passed
    refetchOnWindowFocus: false, // avoid refetching every time the user switches tabs
  });
}
