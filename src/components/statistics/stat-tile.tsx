import { IconName } from "@/constant/categories";
import { layout } from "@/constant/layout";
import { useColors } from "@/hooks/use-theme";
import { formatPercent } from "@/utils/format";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

interface StatTileProps {
    label: string;
    value: string;
    icon: IconName;
    color: string;
    change?: number;
    // for expenses growth is bad, for income it's good
    positiveIsGood?: boolean;
}

export default function StatTile({ label, value, icon, color, change, positiveIsGood = true }: StatTileProps) {
    const colors = useColors();
    const isGood = change !== undefined && (positiveIsGood ? change >= 0 : change <= 0);

    return (
        <View style={[styles.tile, { backgroundColor: colors.card }]}>
            <View style={[styles.icon, { backgroundColor: `${color}26` }]}>
                <Ionicons name={icon} size={18} color={color} />
            </View>
            <Text style={[styles.label, { color: colors.subtext }]}>{label}</Text>
            <Text style={[styles.value, { color: colors.text }]} numberOfLines={1} adjustsFontSizeToFit>
                {value}
            </Text>
            {change !== undefined && (
                <Text style={[styles.change, { color: isGood ? layout.colors.income : layout.colors.expense }]}>
                    {formatPercent(change)} vs prev.
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    tile: {
        flex: 1,
        minWidth: "45%",
        borderRadius: layout.radius.lg,
        padding: 14,
        gap: 4,
    },
    icon: {
        width: 34,
        height: 34,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 6,
    },
    label: {
        fontSize: 12,
    },
    value: {
        fontSize: 18,
        fontWeight: "800",
    },
    change: {
        fontSize: 11,
        fontWeight: "600",
    },
});
