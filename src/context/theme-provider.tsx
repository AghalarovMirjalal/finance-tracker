import { ThemeContext } from "@/hooks/use-theme"
import { getItem, setItem, STORAGE_KEYS } from "@/services/storage"
import { ThemeType } from "@/types/theme-types"
import { useEffect, useState } from "react"
import { useColorScheme as useSystemColorScheme } from "react-native"

interface ThemeProviderProps {
    children: React.ReactNode
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
    const [appTheme, setAppTheme] = useState<ThemeType>("system")
    const systemColorScheme = useSystemColorScheme()

    useEffect(() => {
        getItem<ThemeType>(STORAGE_KEYS.theme, "system").then(setAppTheme)
    }, [])

    const toggleTheme = (theme: ThemeType) => {
        setAppTheme(theme)
        void setItem(STORAGE_KEYS.theme, theme)
    }

    const getColorScheme = (): "light" | "dark" => {
        if (appTheme === "light") return "light";
        if (appTheme === "dark") return "dark";
        return systemColorScheme === "dark" ? "dark" : "light";
    };

    return (
        <ThemeContext.Provider value={{
            theme: appTheme,
            colorScheme: getColorScheme(),
            toggleTheme: toggleTheme,
        }}>
            {children}
        </ThemeContext.Provider>
    )
}
