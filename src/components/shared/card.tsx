import { layout } from "@/constant/layout";
import { useColors } from "@/hooks/use-theme";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

interface CardProps {
    title?: string;
    action?: React.ReactNode;
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

export default function Card({ title, action, children, style }: CardProps) {
    const colors = useColors();

    return (
        <View style={[styles.card, { backgroundColor: colors.card }, style]}>
            {(title || action) && (
                <View style={styles.header}>
                    <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
                    {action}
                </View>
            )}
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: layout.radius.lg,
        padding: 16,
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    title: {
        fontSize: 17,
        fontWeight: "700",
    },
});
