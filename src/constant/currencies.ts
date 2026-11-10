import { CurrencyCode } from "@/types/finance.type";

export const currencies: { code: CurrencyCode; symbol: string }[] = [
    { code: "AZN", symbol: "₼" },
    { code: "USD", symbol: "$" },
    { code: "EUR", symbol: "€" },
    { code: "RUB", symbol: "₽" },
    { code: "TRY", symbol: "₺" },
];

export const getCurrencySymbol = (code: CurrencyCode) =>
    currencies.find((currency) => currency.code === code)?.symbol ?? "$";
