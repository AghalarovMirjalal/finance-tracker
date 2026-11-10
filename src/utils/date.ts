import { Period } from "@/types/finance.type";

export const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export interface DateRange {
    start: Date;
    end: Date;
}

export const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

export const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export const startOfWeek = (date: Date) => {
    const day = startOfDay(date);
    const diff = (day.getDay() + 6) % 7;
    return addDays(day, -diff);
};

export const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);

export const isInRange = (iso: string, range: DateRange) => {
    const time = new Date(iso).getTime();
    return time >= range.start.getTime() && time < range.end.getTime();
};

// offset = 0 -> current period, -1 -> previous one
export const getPeriodRange = (period: Period, offset = 0, now = new Date()): DateRange => {
    if (period === "week") {
        const start = addDays(startOfWeek(now), offset * 7);
        return { start, end: addDays(start, 7) };
    }

    if (period === "month") {
        const start = new Date(now.getFullYear(), now.getMonth() + offset, 1);
        return { start, end: new Date(start.getFullYear(), start.getMonth() + 1, 1) };
    }

    const start = new Date(now.getFullYear() + offset, 0, 1);
    return { start, end: new Date(start.getFullYear() + 1, 0, 1) };
};

export const getPeriodTitle = (period: Period, range: DateRange) => {
    const { start } = range;

    if (period === "week") {
        const last = addDays(range.end, -1);
        return `${start.getDate()} ${MONTH_NAMES[start.getMonth()]} - ${last.getDate()} ${MONTH_NAMES[last.getMonth()]}`;
    }
    if (period === "month") {
        return `${MONTH_NAMES[start.getMonth()]} ${start.getFullYear()}`;
    }
    return `${start.getFullYear()}`;
};

export const formatDay = (iso: string) => {
    const date = new Date(iso);
    const today = new Date();

    if (isSameDay(date, today)) return "Today";
    if (isSameDay(date, addDays(today, -1))) return "Yesterday";

    const year = date.getFullYear() !== today.getFullYear() ? ` ${date.getFullYear()}` : "";
    return `${DAY_NAMES[date.getDay()]}, ${date.getDate()} ${MONTH_NAMES[date.getMonth()]}${year}`;
};

export const formatTime = (iso: string) => {
    const date = new Date(iso);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
};

export const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return "Good night";
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
};
