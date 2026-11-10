import { Category, getCategory } from "@/constant/categories";
import { Period, Transaction, TransactionType } from "@/types/finance.type";
import { addDays, DateRange, DAY_NAMES, isInRange, MONTH_NAMES, startOfMonth } from "./date";

export interface Totals {
    income: number;
    expense: number;
    balance: number;
}

export interface CategoryTotal {
    category: Category;
    total: number;
    percent: number;
    count: number;
}

export interface Bucket {
    label: string;
    range: DateRange;
    income: number;
    expense: number;
}

export const filterByRange = (transactions: Transaction[], range: DateRange) =>
    transactions.filter((transaction) => isInRange(transaction.date, range));

export const getTotals = (transactions: Transaction[]): Totals => {
    const totals = transactions.reduce(
        (acc, transaction) => {
            acc[transaction.type] += transaction.amount;
            return acc;
        },
        { income: 0, expense: 0 }
    );

    return { ...totals, balance: totals.income - totals.expense };
};

export const groupByCategory = (transactions: Transaction[], type: TransactionType): CategoryTotal[] => {
    const filtered = transactions.filter((transaction) => transaction.type === type);
    const sum = filtered.reduce((acc, transaction) => acc + transaction.amount, 0);
    const map = new Map<string, { total: number; count: number }>();

    filtered.forEach((transaction) => {
        const current = map.get(transaction.categoryId) ?? { total: 0, count: 0 };
        map.set(transaction.categoryId, {
            total: current.total + transaction.amount,
            count: current.count + 1,
        });
    });

    return Array.from(map.entries())
        .map(([categoryId, { total, count }]) => ({
            category: getCategory(categoryId),
            total,
            count,
            percent: sum > 0 ? (total / sum) * 100 : 0,
        }))
        .sort((a, b) => b.total - a.total);
};

const createBuckets = (period: Period, range: DateRange) => {
    const buckets: { label: string; range: DateRange }[] = [];

    if (period === "week") {
        for (let i = 0; i < 7; i++) {
            const start = addDays(range.start, i);
            buckets.push({ label: DAY_NAMES[start.getDay()], range: { start, end: addDays(start, 1) } });
        }
    } else if (period === "month") {
        let start = range.start;
        while (start < range.end) {
            const end = addDays(start, 7) < range.end ? addDays(start, 7) : range.end;
            buckets.push({ label: `${start.getDate()}-${addDays(end, -1).getDate()}`, range: { start, end } });
            start = end;
        }
    } else {
        for (let i = 0; i < 12; i++) {
            const start = new Date(range.start.getFullYear(), i, 1);
            buckets.push({ label: MONTH_NAMES[i], range: { start, end: new Date(start.getFullYear(), i + 1, 1) } });
        }
    }

    return buckets;
};

export const getBuckets = (transactions: Transaction[], period: Period, range: DateRange): Bucket[] =>
    createBuckets(period, range).map((bucket) => ({
        ...bucket,
        ...getTotals(filterByRange(transactions, bucket.range)),
    }));

// balance at the end of every bucket, counting everything that happened before it
export const getBalanceTrend = (transactions: Transaction[], buckets: Bucket[]) => {
    const now = Date.now();

    return buckets
        .filter((bucket) => bucket.range.start.getTime() <= now)
        .map((bucket) => {
            const before = transactions.filter(
                (transaction) => new Date(transaction.date).getTime() < bucket.range.end.getTime()
            );
            return { label: bucket.label, value: getTotals(before).balance };
        });
};

export const getPercentChange = (current: number, previous: number) => {
    if (previous === 0) return current === 0 ? 0 : 100;
    return ((current - previous) / previous) * 100;
};

export const getDaysInRange = (range: DateRange) => {
    const end = Math.min(range.end.getTime(), Date.now());
    const days = Math.ceil((end - range.start.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(days, 1);
};

export const getMonthSpent = (transactions: Transaction[], categoryId: string, date = new Date()) => {
    const start = startOfMonth(date);
    const range = { start, end: new Date(start.getFullYear(), start.getMonth() + 1, 1) };

    return filterByRange(transactions, range)
        .filter((transaction) => transaction.type === "expense" && transaction.categoryId === categoryId)
        .reduce((acc, transaction) => acc + transaction.amount, 0);
};

export const getBiggestExpense = (transactions: Transaction[]) =>
    transactions
        .filter((transaction) => transaction.type === "expense")
        .reduce<Transaction | null>((max, transaction) => (!max || transaction.amount > max.amount ? transaction : max), null);
