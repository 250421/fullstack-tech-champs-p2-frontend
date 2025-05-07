import { axiosInstance } from "@/lib/axios-config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router"
import { AxiosError } from "axios";
import { error } from "console";
import { toast } from "sonner";


export const useLogout = () =>{
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async () => {
            const resp = await axiosInstance.post("/link/logout");
            return resp.data;
        },
        onSuccess: ()=>{
            queryClient.invalidateQueries({
                queryKey:["link"],
            });
            toast.success("Logged out Successfully");
            navigate({to:"/login"});
        },
        onError: (error) =>{
            console.error(error);
            if(error instanceof AxiosError){
                toast.error(error.response?.data.message || "An error occured");
            }
        },
    });
};