// src/hooks/useAuth.ts
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-config";

const fetchAuthStatus = async (): Promise<{ isAuthenticated: boolean; user: any | null }> => {
  const token = localStorage.getItem("token");
  if (!token) return { isAuthenticated: false, user: null };

  try {
    const res = await axiosInstance.get("/api/users/me");
    return {
      isAuthenticated: true,
      user: res.data,
    };
  } catch (error) {
    console.error("AUTH ERROR:", error);
    localStorage.removeItem("token"); // Clear token on error
    return {
      isAuthenticated: false,
      user: null,
    };
  }
};

export const useAuth = () => {
  return useQuery({
    queryKey: ["authStatus"],
    queryFn: fetchAuthStatus,
    staleTime: 1000 * 60 * 5,
    retry: false,
    refetchOnWindowFocus: false,
  });
};
