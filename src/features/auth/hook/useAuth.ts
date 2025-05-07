
import { axiosInstance } from "@/lib/axios-config";
import { useQuery } from "@tanstack/react-query"

export const useAuth = () =>{
    return useQuery({
        queryKey: ["nfl"],
        queryFn: async () => {
            try {
                const resp = await axiosInstance.get("/nfl/session");
                return resp.data;
            }
            catch (error){
                console.error(error);
                return null;
            }
        },
    });
};