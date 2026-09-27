import z from "zod";

export const registerUser = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string().max(16).min(8),
})

export const loginUser = z.object({
    email: z.email(),
    password: z.string()
})

export type RegisterUserInput = z.infer<typeof registerUser>;
export type LoginUserInput = z.infer<typeof loginUser>;