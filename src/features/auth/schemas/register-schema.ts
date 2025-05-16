import{z} from "zod";

export const RegisterSchema = z.object({
    userName: z.string().min(4, {
        message: "Username must be at least 4 characters",
    }),
    email: z.string()
        .min(1, {message: "Username is required",})
        .email({message:"Invalid email Address"}),
        password: z.string()
        .min(8, { message: "Password must be at least 8 characters" })
        .regex(/^(?=.*\d)(?=.*[!@#$%^&*])/, {
            message: "Password must include at least one number and one special character",
    }),
});

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
