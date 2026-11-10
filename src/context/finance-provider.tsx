import { getCategory } from "@/constant/categories";
import { useAuth } from "@/hooks/use-auth";
import { FinanceContext } from "@/hooks/use-finance";
import { cancelDailyReminder, scheduleDailyReminder, sendBudgetAlert, sendGoalReachedNotification } from "@/notification/reminders";
import { getItem, removeUserData, setItem, STORAGE_KEYS } from "@/services/storage";
import { Budget, Goal, Settings, Transaction, TransactionInput } from "@/types/finance.type";
import { demoBudgets, generateDemoGoals, generateDemoTransactions } from "@/utils/demo-data";
import { formatMoney } from "@/utils/format";
import { getMonthSpent } from "@/utils/statistics";
import * as Crypto from "expo-crypto";
import { useEffect, useState } from "react";

interface FinanceProviderProps {
    children: React.ReactNode
}

export const defaultSettings: Settings = {
    currency: "AZN",
    reminderEnabled: false,
    reminderHour: 21,
    budgetAlerts: true,
};

const sortByDate = (list: Transaction[]) =>
    [...list].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export default function FinanceProvider({ children }: FinanceProviderProps) {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [goals, setGoals] = useState<Goal[]>([]);
    const [settings, setSettings] = useState<Settings>(defaultSettings);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setTransactions([]);
            setBudgets([]);
            setGoals([]);
            setSettings(defaultSettings);
            setIsLoading(false);
            return;
        }

        const load = async () => {
            setIsLoading(true);
            const [savedTransactions, savedBudgets, savedGoals, savedSettings] = await Promise.all([
                getItem<Transaction[]>(STORAGE_KEYS.transactions(user.id), []),
                getItem<Budget[]>(STORAGE_KEYS.budgets(user.id), []),
                getItem<Goal[]>(STORAGE_KEYS.goals(user.id), []),
                getItem<Settings>(STORAGE_KEYS.settings(user.id), defaultSettings),
            ]);
            setTransactions(sortByDate(savedTransactions));
            setBudgets(savedBudgets);
            setGoals(savedGoals);
            setSettings({ ...defaultSettings, ...savedSettings });
            setIsLoading(false);
        };

        void load();
    }, [user?.id]);

    const userId = () => {
        if (!user) throw new Error("You are not logged in");
        return user.id;
    };

    const saveTransactions = async (next: Transaction[]) => {
        const sorted = sortByDate(next);
        setTransactions(sorted);
        await setItem(STORAGE_KEYS.transactions(userId()), sorted);
        return sorted;
    };

    const saveBudgets = async (next: Budget[]) => {
        setBudgets(next);
        await setItem(STORAGE_KEYS.budgets(userId()), next);
    };

    const saveGoals = async (next: Goal[]) => {
        setGoals(next);
        await setItem(STORAGE_KEYS.goals(userId()), next);
    };

    // notify only when spending crosses 80% or 100% of the limit, not on every expense
    const checkBudget = async (before: Transaction[], after: Transaction[], categoryId: string) => {
        if (!settings.budgetAlerts) return;

        const budget = budgets.find((item) => item.categoryId === categoryId);
        if (!budget || budget.limit <= 0) return;

        const prevPercent = (getMonthSpent(before, categoryId) / budget.limit) * 100;
        const spent = getMonthSpent(after, categoryId);
        const percent = (spent / budget.limit) * 100;
        const crossed = [80, 100].some((level) => prevPercent < level && percent >= level);

        if (crossed) {
            const left = formatMoney(Math.max(budget.limit - spent, 0), settings.currency);
            await sendBudgetAlert(getCategory(categoryId).name, percent, left);
        }
    };

    const addTransaction = async (data: TransactionInput) => {
        const transaction: Transaction = {
            ...data,
            id: Crypto.randomUUID(),
            createdAt: new Date().toISOString(),
        };
        const next = await saveTransactions([transaction, ...transactions]);

        if (transaction.type === "expense") {
            await checkBudget(transactions, next, transaction.categoryId);
        }
    };

    const updateTransaction = async (id: string, data: TransactionInput) => {
        const next = await saveTransactions(
            transactions.map((item) => (item.id === id ? { ...item, ...data } : item))
        );

        if (data.type === "expense") {
            await checkBudget(transactions, next, data.categoryId);
        }
    };

    const deleteTransaction = async (id: string) => {
        await saveTransactions(transactions.filter((item) => item.id !== id));
    };

    const setBudget = async (categoryId: string, limit: number) => {
        const exists = budgets.some((item) => item.categoryId === categoryId);
        await saveBudgets(
            exists
                ? budgets.map((item) => (item.categoryId === categoryId ? { ...item, limit } : item))
                : [...budgets, { categoryId, limit }]
        );
    };

    const removeBudget = async (categoryId: string) => {
        await saveBudgets(budgets.filter((item) => item.categoryId !== categoryId));
    };

    const addGoal = async (data: Pick<Goal, "title" | "target" | "color" | "icon">) => {
        const goal: Goal = {
            ...data,
            id: Crypto.randomUUID(),
            saved: 0,
            createdAt: new Date().toISOString(),
        };
        await saveGoals([goal, ...goals]);
    };

    const depositToGoal = async (id: string, amount: number) => {
        const goal = goals.find((item) => item.id === id);
        if (!goal) return;

        const saved = Math.max(goal.saved + amount, 0);
        await saveGoals(goals.map((item) => (item.id === id ? { ...item, saved } : item)));

        if (goal.saved < goal.target && saved >= goal.target) {
            await sendGoalReachedNotification(goal.title);
        }
    };

    const deleteGoal = async (id: string) => {
        await saveGoals(goals.filter((item) => item.id !== id));
    };

    const updateSettings = async (data: Partial<Settings>) => {
        const next = { ...settings, ...data };

        if (next.reminderEnabled) {
            const scheduled = await scheduleDailyReminder(next.reminderHour);
            if (!scheduled) next.reminderEnabled = false;
        } else {
            await cancelDailyReminder();
        }

        setSettings(next);
        await setItem(STORAGE_KEYS.settings(userId()), next);
    };

    const loadDemoData = async () => {
        await saveTransactions(generateDemoTransactions());
        await saveBudgets(demoBudgets);
        await saveGoals(generateDemoGoals());
    };

    const clearAllData = async () => {
        await removeUserData(userId());
        await cancelDailyReminder();
        setTransactions([]);
        setBudgets([]);
        setGoals([]);
        setSettings(defaultSettings);
    };

    return (
        <FinanceContext.Provider value={{
            transactions,
            budgets,
            goals,
            settings,
            isLoading,
            addTransaction,
            updateTransaction,
            deleteTransaction,
            setBudget,
            removeBudget,
            addGoal,
            depositToGoal,
            deleteGoal,
            updateSettings,
            loadDemoData,
            clearAllData,
        }}>
            {children}
        </FinanceContext.Provider>
    )
}
