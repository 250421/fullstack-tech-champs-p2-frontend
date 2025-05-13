// src/hooks/useAuth.ts
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-config";
import { jwtDecode } from "jwt-decode";



// Define the shape of the JWT payload
interface JwtPayload {
  userId: number;
  email: string;
  userName: string;
  exp: number;
  iat: number;
}

const fetchAuthStatus = async (): Promise<{ isAuthenticated: boolean; user: any | null; userId: number | null }> => {
  const token = localStorage.getItem("token");

  // If there's no token, return unauthenticated state
  if (!token) {
    return { isAuthenticated: false, user: null, userId: null };
  }

  try {
    // Decode token to extract user information (including userId)
    const decoded: JwtPayload = jwtDecode(token);
    const userId = decoded.userId;
    // Check if the token is valid (not expired)
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      localStorage.removeItem("token"); // Token expired, so clear it
      return { isAuthenticated: false, user: null, userId: null };
    }

    // If the token is valid, make a request to get the user info
    const res = await axiosInstance.get("/api/users/me");

    return {
      isAuthenticated: true,
      user: res.data,
      userId, // Pass the userId extracted from the token
    };
  } catch (error) {
    console.error("AUTH ERROR:", error);
    localStorage.removeItem("token"); // Clear token on error
    return {
      isAuthenticated: false,
      user: null,
      userId: null,
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
