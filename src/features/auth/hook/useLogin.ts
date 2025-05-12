import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-config";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { AxiosError } from "axios";
import type { LoginSchemaType } from "../schemas/login-schema";

export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // ✅ Add this to invalidate auth query

  return useMutation({
    mutationFn: async (values: LoginSchemaType) => {
      const res = await axiosInstance.post("/api/users/login", values);
      const token = res.data.token;
      localStorage.setItem("token", token); // ✅ Save token
      return res.data;
    },
    onSuccess: () => {
      toast.success("User Logged In");
      queryClient.invalidateQueries({ queryKey: ["authStatus"] }); // ✅ Refetch auth status
      navigate({ to: "/" }); // ✅ Only navigate after token + refetch
    },
    onError: (error) => {
      console.error(error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || "Login failed");
      }
    },
  });
};
