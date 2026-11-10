import { ColorScheme } from "@/types/theme-types";

export const layout = {
    colors: {
        primary: "#6C5CE7",
        primaryLight: "#A29BFE",
        income: "#22C55E",
        expense: "#EF4444",
        warning: "#F59E0B",
        white: "#FFFFFF",
        black: "#000000",
        gray: "#8E8E93",
    },
    radius: {
        sm: 8,
        md: 14,
        lg: 20,
        full: 999,
    },
    spacing: 16,
};

const lightPalette = {
    background: "#F4F5FA",
    card: "#FFFFFF",
    text: "#1C1C28",
    subtext: "#8E8E93",
    border: "#E6E7EE",
    input: "#F1F2F6",
    tabBar: "#FFFFFF",
};

const darkPalette: typeof lightPalette = {
    background: "#0F0F14",
    card: "#1C1C24",
    text: "#F5F5F7",
    subtext: "#9A9AA5",
    border: "#2C2C36",
    input: "#24242E",
    tabBar: "#16161D",
};

export type Palette = typeof lightPalette & typeof layout.colors;

export const getPalette = (scheme: ColorScheme): Palette => ({
    ...layout.colors,
    ...(scheme === "dark" ? darkPalette : lightPalette),
});
