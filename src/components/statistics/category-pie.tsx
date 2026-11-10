import ProgressBar from "@/components/shared/progress-bar";
import SegmentedControl from "@/components/shared/segmented-control";
import { useMoney } from "@/hooks/use-finance";
import { useColors } from "@/hooks/use-theme";
import { Transaction, TransactionType } from "@/types/finance.type";
import { groupByCategory } from "@/utils/statistics";
import { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";

interface CategoryPieProps {
    transactions: Transaction[];
}

export default function CategoryPie({ transactions }: CategoryPieProps) {
    const colors = useColors();
    const money = useMoney();
    const [type, setType] = useState<TransactionType>("expense");
    const [selected, setSelected] = useState<number | null>(null);

    const groups = useMemo(() => groupByCategory(transactions, type), [transactions, type]);
    const total = groups.reduce((acc, group) => acc + group.total, 0);
    const active = selected !== null ? groups[selected] : null;

    const data = groups.map((group, index) => ({
        value: group.total,
        color: group.category.color,
        focused: index === selected,
        onPress: () => setSelected(index === selected ? null : index),
    }));

    return (
        <View style={styles.container}>
            <SegmentedControl<TransactionType>
                value={type}
                onChange={(value) => {
                    setType(value);
                    setSelected(null);
                }}
                options={[
                    { label: "Expenses", value: "expense" },
                    { label: "Income", value: "income" },
                ]}
            />

            {groups.length === 0 ? (
                <Text style={[styles.empty, { color: colors.subtext }]}>No data for this period</Text>
            ) : (
                <>
                    <View style={styles.chart}>
                        <PieChart
                            data={data}
                            donut
                            radius={100}
                            innerRadius={68}
                            innerCircleColor={colors.card}
                            focusOnPress
                            isAnimated
                            centerLabelComponent={() => (
                                <View style={styles.center}>
                                    <Text style={[styles.centerLabel, { color: colors.subtext }]}>
                                        {active ? active.category.name : "Total"}
                                    </Text>
                                    <Text style={[styles.centerValue, { color: colors.text }]}>
                                        {money(active ? active.total : total)}
                                    </Text>
                                    {active && (
                                        <Text style={[styles.centerLabel, { color: active.category.color }]}>
                                            {active.percent.toFixed(1)}%
                                        </Text>
                                    )}
                                </View>
                            )}
                        />
                    </View>

                    {groups.map((group) => (
                        <View key={group.category.id} style={styles.legend}>
                            <View style={styles.legendRow}>
                                <View style={styles.legendLeft}>
                                    <View style={[styles.dot, { backgroundColor: group.category.color }]} />
                                    <Text style={[styles.legendName, { color: colors.text }]}>{group.category.name}</Text>
                                    <Text style={[styles.legendCount, { color: colors.subtext }]}>×{group.count}</Text>
                                </View>
                                <Text style={[styles.legendValue, { color: colors.text }]}>
                                    {money(group.total)} · {group.percent.toFixed(0)}%
                                </Text>
                            </View>
                            <ProgressBar progress={group.percent / 100} color={group.category.color} height={6} />
                        </View>
                    ))}
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 12,
    },
    empty: {
        textAlign: "center",
        paddingVertical: 32,
    },
    chart: {
        alignItems: "center",
        paddingVertical: 8,
    },
    center: {
        alignItems: "center",
        width: 120,
    },
    centerLabel: {
        fontSize: 12,
        fontWeight: "600",
    },
    centerValue: {
        fontSize: 16,
        fontWeight: "800",
    },
    legend: {
        gap: 6,
    },
    legendRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    legendLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    legendName: {
        fontSize: 14,
        fontWeight: "600",
    },
    legendCount: {
        fontSize: 12,
    },
    legendValue: {
        fontSize: 13,
        fontWeight: "600",
    },
});
