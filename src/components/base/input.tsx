import { layout, Palette } from "@/constant/layout";
import { useColors } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { ComponentProps, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";

interface InputProps extends TextInputProps {
    label?: string;
    icon?: ComponentProps<typeof Ionicons>["name"];
    error?: string;
    isPassword?: boolean;
}

export default function Input({ label, icon, error, isPassword, style, ...props }: InputProps) {
    const colors = useColors();
    const styles = getStyles(colors);
    const [hidden, setHidden] = useState(true);
    const [focused, setFocused] = useState(false);

    return (
        <View style={styles.field}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={[styles.wrapper, focused && styles.focused, error && styles.error]}>
                {icon && <Ionicons name={icon} size={20} color={focused ? layout.colors.primary : colors.subtext} />}
                <TextInput
                    {...props}
                    style={[styles.input, style]}
                    placeholderTextColor={colors.subtext}
                    secureTextEntry={isPassword && hidden}
                    onFocus={(event) => {
                        setFocused(true);
                        props.onFocus?.(event);
                    }}
                    onBlur={(event) => {
                        setFocused(false);
                        props.onBlur?.(event);
                    }}
                />
                {isPassword && (
                    <Pressable onPress={() => setHidden(!hidden)} hitSlop={10}>
                        <Ionicons name={hidden ? "eye-off" : "eye"} size={20} color={colors.subtext} />
                    </Pressable>
                )}
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}

const getStyles = (colors: Palette) => StyleSheet.create({
    field: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.text,
        marginBottom: 8,
    },
    wrapper: {
        flexDirection: "row",
        alignItems: "center",
        minHeight: 52,
        borderRadius: layout.radius.md,
        backgroundColor: colors.input,
        borderWidth: 1.5,
        borderColor: "transparent",
        paddingHorizontal: 16,
        gap: 12,
    },
    focused: {
        borderColor: layout.colors.primary,
    },
    error: {
        borderColor: layout.colors.expense,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: colors.text,
        paddingVertical: 12,
    },
    errorText: {
        color: layout.colors.expense,
        fontSize: 12,
        marginTop: 6,
        marginLeft: 4,
    },
});
