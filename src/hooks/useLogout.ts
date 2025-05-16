import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      // No API call needed — logout is handled locally
      localStorage.removeItem("token"); // Clear JWT token
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authStatus"] }); // Refresh auth state
      toast.success("Logged out successfully");
      navigate({ to: "/login" }); // Redirect to login
    },
    onError: () => {
      toast.error("Logout failed");
    },
  });
};
