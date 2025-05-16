import { useMutation } from "@tanstack/react-query"
import { axiosInstance } from "@/lib/axios-config"
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import type { RegisterSchemaType } from "../schemas/register-schema";

console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);
export const useRegister =() => {
    const navigate = useNavigate();
    return useMutation({
        mutationFn:async (values:RegisterSchemaType) =>{
            console.log("Sending data to backend:", values);
            const resp = await axiosInstance.post("/api/users/register",values);
            return resp.data;
        },
        onSuccess: () =>{
            toast.success("User Created Successfully");
            navigate({to:"/login"});
        },
        onError: (error) => {
            console.error("Login error:", error);

            if (error instanceof AxiosError) {
                const backendMessage = error.response?.data?.message || error.response?.data?.error || "Something went wrong. Please try again.";
                toast.error(backendMessage);
            } else {
                toast.error("Unexpected error. Please try again.");
            }
        }
    })

}