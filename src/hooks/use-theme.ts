import { getPalette } from "@/constant/layout";
import { ThemeContextType } from "@/types/theme-types";
import { createContext, useContext } from "react";

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
    const context = useContext(ThemeContext)

    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider")
    }
    return context
}

export const useColors = () => {
    const { colorScheme } = useTheme()
    return getPalette(colorScheme)
}
