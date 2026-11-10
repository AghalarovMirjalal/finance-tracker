import { z } from "zod";

const password = z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Za-z]/, "Password must contain a letter")
    .regex(/\d/, "Password must contain a number");

export const signInSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

export const signUpSchema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
    email: z.email("Invalid email address"),
    password,
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Enter your current password"),
    newPassword: password,
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export const profileSchema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
});

export const changeEmailSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

export type SignInSchema = z.infer<typeof signInSchema>;
export type SignUpSchema = z.infer<typeof signUpSchema>;
export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
export type ProfileSchema = z.infer<typeof profileSchema>;
export type ChangeEmailSchema = z.infer<typeof changeEmailSchema>;
