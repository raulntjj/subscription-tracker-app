import { z } from "zod";

export interface User {
  id: string;
  name: string;
  surname: string | null;
  email: string;
  profile_path: string | null;
  created_at: string;
  updated_at: string;
}

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    surname: z.string().min(2, "Surname must be at least 2 characters"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export interface RegisterResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}
