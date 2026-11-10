import { getCurrencySymbol } from "@/constant/currencies";
import { CurrencyCode } from "@/types/finance.type";

const withSpaces = (value: string) => value.replace(/\B(?=(\d{3})+(?!\d))/g, " ");

export const formatMoney = (amount: number, currency: CurrencyCode, showSign = false) => {
    const symbol = getCurrencySymbol(currency);
    const [whole, cents] = Math.abs(amount).toFixed(2).split(".");
    const sign = amount < 0 ? "-" : showSign && amount > 0 ? "+" : "";

    return `${sign}${symbol}${withSpaces(whole)}.${cents}`;
};

export const formatCompact = (value: number) => {
    const abs = Math.abs(value);
    if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (abs >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
    return `${Math.round(value)}`;
};

export const formatPercent = (value: number) => `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;

export const parseAmount = (value: string) => Number(value.replace(",", ".").replace(/\s/g, ""));
