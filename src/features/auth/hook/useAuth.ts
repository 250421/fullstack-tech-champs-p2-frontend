import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-config";

interface User {
  userId: number;
  userName: string;
  email: string;
  password:string;
  role:string;
  // Add other fields from your backend User DTO
}

interface AuthError {
  code?: string;
  message: string;
  status?: number;
}

export const useAuth = () => {
  return useQuery<User | null, AuthError>({
    queryKey: ["auth"], // Changed from "link" to more semantic key
    queryFn: async () => {
      try {
        console.debug("[useAuth] Fetching user data...");
        const response = await axiosInstance.get("/api/users/me");
        console.debug("[useAuth] Authentication successful", response.data);
        return response.data;
      } catch (error: any) {
        // Error is already logged by axiosInstance interceptor
        // Just add auth-specific handling here if needed
        
        // The interceptor already handles:
        // - Token cleanup
        // - Redirects on auth failures
        // - Network error logging
        
        return null;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    retry: false, // Important for auth queries
    refetchOnWindowFocus: false, // Reduce unnecessary requests
    
  });
};

// Usage example:
// const { data: user, isLoading, error } = useAuth();