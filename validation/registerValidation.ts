import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(3, { message: "Username should be longer than 2 characters" })
  .max(10, { message: "Username should be shorter than 11 characters" })
  .regex(/^[a-zA-Z0-9_.]*$/, {
    message:
      "Username should contain only letters, numbers, underscores and dots",
  });

export const emailValidation = z.string().email();

export const registerSchema = z
  .object({
    username: usernameValidation,
    email: emailValidation,
    password: z
      .string()
      .min(6, { message: "Password should be greater than 5 characters" })
      .max(20, { message: "Password should be less than 21 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;