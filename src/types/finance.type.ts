export type TransactionType = "income" | "expense";

export interface Transaction {
    id: string;
    type: TransactionType;
    amount: number;
    categoryId: string;
    note: string;
    date: string;
    receipt: string | null;
    createdAt: string;
}

export type TransactionInput = Omit<Transaction, "id" | "createdAt">;

export interface Budget {
    categoryId: string;
    limit: number;
}

export interface Goal {
    id: string;
    title: string;
    target: number;
    saved: number;
    color: string;
    icon: string;
    createdAt: string;
}

export type CurrencyCode = "AZN" | "USD" | "EUR" | "RUB" | "TRY";

export interface Settings {
    currency: CurrencyCode;
    reminderEnabled: boolean;
    reminderHour: number;
    budgetAlerts: boolean;
}

export type Period = "week" | "month" | "year";

export interface FinanceContextType {
    transactions: Transaction[];
    budgets: Budget[];
    goals: Goal[];
    settings: Settings;
    isLoading: boolean;
    addTransaction: (data: TransactionInput) => Promise<void>;
    updateTransaction: (id: string, data: TransactionInput) => Promise<void>;
    deleteTransaction: (id: string) => Promise<void>;
    setBudget: (categoryId: string, limit: number) => Promise<void>;
    removeBudget: (categoryId: string) => Promise<void>;
    addGoal: (data: Pick<Goal, "title" | "target" | "color" | "icon">) => Promise<void>;
    depositToGoal: (id: string, amount: number) => Promise<void>;
    deleteGoal: (id: string) => Promise<void>;
    updateSettings: (data: Partial<Settings>) => Promise<void>;
    loadDemoData: () => Promise<void>;
    clearAllData: () => Promise<void>;
}
