import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-config";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { AxiosError } from "axios";
import type { LoginSchemaType } from "../schemas/login-schema";

export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient(); 

  return useMutation({
    mutationFn: async (values: LoginSchemaType) => {
      const res = await axiosInstance.post("/api/users/login", values);
      const token = res.data.token;
      localStorage.setItem("token", token); //Save token
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authStatus"] });
      navigate({ to: "/" }); 
      toast.success("User Logged In");
    },
    onError: (error) => {
      console.error("Login error:", error);

      if (error instanceof AxiosError) {
        const message = error.response?.data?.message || error.response?.data?.error || "Login failed";
        toast.error(message);
      } else {
        toast.error("Unexpected error occurred. Please try again.");
      }
    },
  });
};
