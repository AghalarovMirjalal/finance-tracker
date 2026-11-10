import { TransactionType } from "@/types/finance.type";
import { Ionicons } from "@expo/vector-icons";
import { ComponentProps } from "react";

export type IconName = ComponentProps<typeof Ionicons>["name"];

export interface Category {
    id: string;
    name: string;
    icon: IconName;
    color: string;
    type: TransactionType;
}

export const categories: Category[] = [
    { id: "food", name: "Food", icon: "fast-food", color: "#FF7675", type: "expense" },
    { id: "transport", name: "Transport", icon: "car", color: "#74B9FF", type: "expense" },
    { id: "shopping", name: "Shopping", icon: "bag-handle", color: "#FD79A8", type: "expense" },
    { id: "home", name: "Home", icon: "home", color: "#FDCB6E", type: "expense" },
    { id: "bills", name: "Bills", icon: "receipt", color: "#E17055", type: "expense" },
    { id: "health", name: "Health", icon: "medkit", color: "#00B894", type: "expense" },
    { id: "education", name: "Education", icon: "school", color: "#0984E3", type: "expense" },
    { id: "fun", name: "Fun", icon: "game-controller", color: "#A29BFE", type: "expense" },
    { id: "travel", name: "Travel", icon: "airplane", color: "#00CEC9", type: "expense" },
    { id: "other-expense", name: "Other", icon: "ellipsis-horizontal", color: "#B2BEC3", type: "expense" },
    { id: "salary", name: "Salary", icon: "briefcase", color: "#22C55E", type: "income" },
    { id: "freelance", name: "Freelance", icon: "laptop", color: "#10B981", type: "income" },
    { id: "gift", name: "Gift", icon: "gift", color: "#F472B6", type: "income" },
    { id: "investment", name: "Investment", icon: "trending-up", color: "#6C5CE7", type: "income" },
    { id: "other-income", name: "Other", icon: "cash", color: "#84CC16", type: "income" },
];

export const getCategory = (id: string): Category =>
    categories.find((category) => category.id === id) ?? categories[categories.length - 1];

export const getCategoriesByType = (type: TransactionType) =>
    categories.filter((category) => category.type === type);

export const goalColors = ["#6C5CE7", "#00B894", "#0984E3", "#E17055", "#FD79A8", "#FDCB6E"];

export const goalIcons: IconName[] = ["airplane", "car-sport", "home", "laptop", "phone-portrait", "gift", "school", "heart"];
