import { IconName } from "@/constant/categories";
import { layout } from "@/constant/layout";
import { useColors } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

interface EmptyStateProps {
    icon: IconName;
    title: string;
    description?: string;
    children?: React.ReactNode;
}

export default function EmptyState({ icon, title, description, children }: EmptyStateProps) {
    const colors = useColors();

    return (
        <View style={styles.container}>
            <View style={styles.iconWrapper}>
                <Ionicons name={icon} size={36} color={layout.colors.primary} />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            {description && <Text style={[styles.description, { color: colors.subtext }]}>{description}</Text>}
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        paddingVertical: 32,
        paddingHorizontal: 24,
        gap: 8,
    },
    iconWrapper: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: "rgba(108, 92, 231, 0.12)",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
    },
    title: {
        fontSize: 17,
        fontWeight: "700",
        textAlign: "center",
    },
    description: {
        fontSize: 14,
        textAlign: "center",
        lineHeight: 20,
        marginBottom: 8,
    },
});
