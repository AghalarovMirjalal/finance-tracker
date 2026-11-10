import { FinanceContextType } from "@/types/finance.type";
import { formatMoney } from "@/utils/format";
import { createContext, useCallback, useContext } from "react";

export const FinanceContext = createContext<FinanceContextType | undefined>(undefined)

export const useFinance = () => {
    const context = useContext(FinanceContext)

    if (context === undefined) {
        throw new Error("useFinance must be used within a FinanceProvider")
    }
    return context
}

export const useMoney = () => {
    const { settings } = useFinance()

    return useCallback(
        (amount: number, showSign = false) => formatMoney(amount, settings.currency, showSign),
        [settings.currency]
    )
}
