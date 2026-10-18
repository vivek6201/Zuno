import z from "zod";

export const registerUser = z
  .object({
    name: z.string().nonempty("Name is required"),
    email: z.email(),
    password: z
      .string()
      .max(16, "Password cannot be more than 16 characters")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Confirm password must be at least 8 characters")
      .max(16, "Confirm password cannot be more than 16 characters"),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginUser = z.object({
  email: z.email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(16, "Password cannot be more than 16 characters"),
});

export type RegisterUserInput = z.infer<typeof registerUser>;
export type LoginUserInput = z.infer<typeof loginUser>;
