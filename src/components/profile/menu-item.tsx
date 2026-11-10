import { IconName } from "@/constant/categories";
import { useColors } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface MenuItemProps {
    icon: IconName;
    title: string;
    color: string;
    value?: string;
    onPress?: () => void;
    right?: React.ReactNode;
    danger?: boolean;
}

export default function MenuItem({ icon, title, color, value, onPress, right, danger }: MenuItemProps) {
    const colors = useColors();

    return (
        <Pressable
            onPress={onPress}
            disabled={!onPress}
            style={({ pressed }) => [styles.item, pressed && { opacity: 0.6 }]}
        >
            <View style={[styles.icon, { backgroundColor: `${color}26` }]}>
                <Ionicons name={icon} size={20} color={color} />
            </View>
            <Text style={[styles.title, { color: danger ? color : colors.text }]}>{title}</Text>
            {value && <Text style={[styles.value, { color: colors.subtext }]}>{value}</Text>}
            {right ?? (onPress && <Ionicons name="chevron-forward" size={18} color={colors.subtext} />)}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    item: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingVertical: 10,
    },
    icon: {
        width: 38,
        height: 38,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        flex: 1,
        fontSize: 15,
        fontWeight: "600",
    },
    value: {
        fontSize: 14,
    },
});
