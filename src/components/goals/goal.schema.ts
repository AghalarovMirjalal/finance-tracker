import { parseAmount } from "@/utils/format";
import { z } from "zod";

const amount = z
    .string()
    .min(1, "Enter the amount")
    .refine((value) => parseAmount(value) > 0, "Amount must be greater than 0");

export const goalSchema = z.object({
    title: z.string().trim().min(2, "Title is too short").max(30, "Title is too long"),
    target: amount,
    color: z.string(),
    icon: z.string(),
});

export const depositSchema = z.object({
    amount,
});

export type GoalSchema = z.infer<typeof goalSchema>;
export type DepositSchema = z.infer<typeof depositSchema>;
