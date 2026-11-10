import { parseAmount } from "@/utils/format";
import { z } from "zod";

export const transactionSchema = z.object({
    type: z.enum(["income", "expense"]),
    amount: z
        .string()
        .min(1, "Enter the amount")
        .refine((value) => !Number.isNaN(parseAmount(value)), "Amount must be a number")
        .refine((value) => parseAmount(value) > 0, "Amount must be greater than 0")
        .refine((value) => parseAmount(value) <= 1_000_000, "Amount is too big"),
    categoryId: z.string().min(1, "Choose a category"),
    note: z.string().max(60, "Note is too long"),
    date: z.date().refine((date) => date.getTime() <= Date.now() + 60 * 1000, "Date can't be in the future"),
    receipt: z.string().nullable(),
});

export type TransactionSchema = z.infer<typeof transactionSchema>;
