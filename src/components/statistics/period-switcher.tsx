import SegmentedControl from "@/components/shared/segmented-control";
import { layout } from "@/constant/layout";
import { useColors } from "@/hooks/use-theme";
import { Period } from "@/types/finance.type";
import { DateRange, getPeriodTitle } from "@/utils/date";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface PeriodSwitcherProps {
    period: Period;
    offset: number;
    range: DateRange;
    onPeriodChange: (period: Period) => void;
    onOffsetChange: (offset: number) => void;
}

export default function PeriodSwitcher({ period, offset, range, onPeriodChange, onOffsetChange }: PeriodSwitcherProps) {
    const colors = useColors();

    return (
        <View style={styles.container}>
            <SegmentedControl<Period>
                value={period}
                onChange={onPeriodChange}
                options={[
                    { label: "Week", value: "week" },
                    { label: "Month", value: "month" },
                    { label: "Year", value: "year" },
                ]}
            />
            <View style={styles.row}>
                <Pressable style={[styles.arrow, { backgroundColor: colors.card }]} onPress={() => onOffsetChange(offset - 1)}>
                    <Ionicons name="chevron-back" size={18} color={colors.text} />
                </Pressable>
                <Text style={[styles.title, { color: colors.text }]}>{getPeriodTitle(period, range)}</Text>
                <Pressable
                    style={[styles.arrow, { backgroundColor: colors.card }, offset === 0 && { opacity: 0.3 }]}
                    disabled={offset === 0}
                    onPress={() => onOffsetChange(offset + 1)}
                >
                    <Ionicons name="chevron-forward" size={18} color={colors.text} />
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 12,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    arrow: {
        width: 36,
        height: 36,
        borderRadius: layout.radius.sm,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 16,
        fontWeight: "700",
    },
});
