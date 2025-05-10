import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-config";

interface User {
  userId: number;
  userName: string;
  email: string;
  password:string;
  role:string;
<<<<<<< HEAD
 
=======
  
>>>>>>> 40fa4da1a98118ed204b10736978028a5b4d20e6
}

interface AuthError {
  code?: string;
  message: string;
  status?: number;
}

export const useAuth = () => {
  return useQuery<User | null, AuthError>({
    queryKey: ["auth"], 
    queryFn: async () => {
      try {
        console.debug("[useAuth] Fetching user data...");
        const response = await axiosInstance.get("/api/users/me");
        console.debug("[useAuth] Authentication successful", response.data);
        return response.data;
      } catch (error: any) {
<<<<<<< HEAD
=======
    
>>>>>>> 40fa4da1a98118ed204b10736978028a5b4d20e6
        return null;
      }
    },
    staleTime: 1000 * 60 * 5, 
    retry: false, 
    refetchOnWindowFocus: false, 
    
  });
};

