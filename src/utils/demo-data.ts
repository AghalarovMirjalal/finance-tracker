import { Budget, Goal, Transaction } from "@/types/finance.type";
import * as Crypto from "expo-crypto";
import { addDays, startOfDay } from "./date";

const random = (min: number, max: number) => Math.round((Math.random() * (max - min) + min) * 100) / 100;

const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];

const expenseTemplates = [
    { categoryId: "food", notes: ["Groceries", "Lunch", "Coffee", "Pizza", "Bakery"], min: 3, max: 45, chance: 0.8 },
    { categoryId: "transport", notes: ["Taxi", "Metro card", "Fuel"], min: 2, max: 40, chance: 0.4 },
    { categoryId: "shopping", notes: ["Clothes", "Sneakers", "Online order"], min: 15, max: 120, chance: 0.12 },
    { categoryId: "fun", notes: ["Cinema", "Games", "Concert"], min: 8, max: 60, chance: 0.12 },
    { categoryId: "health", notes: ["Pharmacy", "Gym"], min: 10, max: 50, chance: 0.06 },
    { categoryId: "education", notes: ["Course", "Books"], min: 10, max: 80, chance: 0.04 },
];

const makeTransaction = (data: Omit<Transaction, "id" | "createdAt" | "receipt">): Transaction => ({
    ...data,
    id: Crypto.randomUUID(),
    receipt: null,
    createdAt: data.date,
});

export function generateDemoTransactions(days = 120): Transaction[] {
    const today = startOfDay(new Date());
    const result: Transaction[] = [];

    for (let i = days; i >= 0; i--) {
        const day = addDays(today, -i);
        const at = (hour: number) => new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour, Math.floor(Math.random() * 60)).toISOString();

        if (day.getDate() === 1) {
            result.push(makeTransaction({ type: "income", amount: 1800, categoryId: "salary", note: "Monthly salary", date: at(10) }));
            result.push(makeTransaction({ type: "expense", amount: 450, categoryId: "home", note: "Rent", date: at(12) }));
        }
        if (day.getDate() === 5) {
            result.push(makeTransaction({ type: "expense", amount: random(60, 110), categoryId: "bills", note: "Electricity & internet", date: at(18) }));
        }
        if (Math.random() < 0.08) {
            result.push(makeTransaction({ type: "income", amount: random(80, 400), categoryId: "freelance", note: "Freelance project", date: at(16) }));
        }

        expenseTemplates.forEach((template) => {
            if (Math.random() < template.chance) {
                result.push(makeTransaction({
                    type: "expense",
                    amount: random(template.min, template.max),
                    categoryId: template.categoryId,
                    note: pick(template.notes),
                    date: at(9 + Math.floor(Math.random() * 12)),
                }));
            }
        });
    }

    return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export const demoBudgets: Budget[] = [
    { categoryId: "food", limit: 400 },
    { categoryId: "transport", limit: 120 },
    { categoryId: "shopping", limit: 150 },
    { categoryId: "fun", limit: 80 },
];

export const generateDemoGoals = (): Goal[] => [
    { id: Crypto.randomUUID(), title: "New laptop", target: 2000, saved: 1250, color: "#6C5CE7", icon: "laptop", createdAt: new Date().toISOString() },
    { id: Crypto.randomUUID(), title: "Summer trip", target: 1500, saved: 400, color: "#00B894", icon: "airplane", createdAt: new Date().toISOString() },
];
