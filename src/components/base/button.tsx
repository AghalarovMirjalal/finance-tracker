import { layout } from "@/constant/layout";
import { useColors } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { ComponentProps } from "react";
import { ActivityIndicator, Pressable, StyleProp, StyleSheet, Text, ViewStyle } from "react-native";

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: "primary" | "outline" | "danger" | "ghost";
    icon?: ComponentProps<typeof Ionicons>["name"];
    loading?: boolean;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
}

export default function Button({ title, onPress, variant = "primary", icon, loading, disabled, style }: ButtonProps) {
    const colors = useColors();

    const background = {
        primary: layout.colors.primary,
        outline: "transparent",
        danger: layout.colors.expense,
        ghost: colors.card,
    }[variant];

    const textColor = variant === "outline"
        ? layout.colors.primary
        : variant === "ghost" ? colors.text : layout.colors.white;

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled || loading}
            style={({ pressed }) => [
                styles.button,
                { backgroundColor: background },
                variant === "outline" && { borderWidth: 1.5, borderColor: layout.colors.primary },
                (pressed || disabled) && { opacity: 0.7 },
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator color={textColor} />
            ) : (
                <>
                    {icon && <Ionicons name={icon} size={20} color={textColor} />}
                    <Text style={[styles.text, { color: textColor }]}>{title}</Text>
                </>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        height: 52,
        borderRadius: layout.radius.md,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        paddingHorizontal: 20,
    },
    text: {
        fontSize: 16,
        fontWeight: "600",
    },
});
