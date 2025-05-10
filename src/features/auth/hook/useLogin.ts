import { useMutation } from "@tanstack/react-query"

import { axiosInstance } from "@/lib/axios-config"
import { toast } from "sonner"

import { useNavigate } from "@tanstack/react-router";
import { AxiosError } from "axios";
import type { LoginSchemaType } from "../schemas/login-schema";
export const useLogin =() =>{
    const navigate = useNavigate();
    return useMutation({
        mutationFn: async (values:LoginSchemaType)=>{
            const res = await axiosInstance.post("/api/users/login",values);
            return res.data;

        },
        onSuccess: ()=>{
            toast.success("User Logged In")
            navigate({to:"/"});
            toast.success("User Logged In");
        },
        onError: (error) =>{
            console.error(error);
            if(error instanceof AxiosError)
            {
                toast.error(error.response?.data.message);
            }
        }
    });
}