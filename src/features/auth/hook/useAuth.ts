import { axiosInstance } from "@/lib/axios-config"
import { useQuery } from "@tanstack/react-query"

export const useAuth = () =>{
    return useQuery({
        queryKey: ["link"],
        queryFn: async () => {
            try {
                const resp = await axiosInstance.get("/link/session");
                return resp.data;
            }
            catch (error){
                console.error(error);
                return null;
            }
        },
    });
};