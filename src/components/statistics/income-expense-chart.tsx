import { layout } from "@/constant/layout";
import { useColors } from "@/hooks/use-theme";
import { formatCompact } from "@/utils/format";
import { Bucket } from "@/utils/statistics";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

interface IncomeExpenseChartProps {
    buckets: Bucket[];
}

export default function IncomeExpenseChart({ buckets }: IncomeExpenseChartProps) {
    const colors = useColors();
    const { width } = useWindowDimensions();

    const chartWidth = width - 32 - 32 - 44;
    const groupWidth = chartWidth / buckets.length;
    const barWidth = Math.max(Math.min(groupWidth / 2 - 4, 18), 5);

    // gifted-charts draws grouped bars as pairs: income with small spacing, then expense with a bigger one
    const data = buckets.flatMap((bucket) => [
        {
            value: bucket.income,
            label: bucket.label,
            frontColor: layout.colors.income,
            spacing: 2,
            labelWidth: barWidth * 2 + 2,
            labelTextStyle: { color: colors.subtext, fontSize: 10 },
        },
        {
            value: bucket.expense,
            frontColor: layout.colors.expense,
        },
    ]);

    return (
        <View>
            <View style={styles.legend}>
                <View style={styles.legendItem}>
                    <View style={[styles.dot, { backgroundColor: layout.colors.income }]} />
                    <Text style={{ color: colors.subtext }}>Income</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.dot, { backgroundColor: layout.colors.expense }]} />
                    <Text style={{ color: colors.subtext }}>Expenses</Text>
                </View>
            </View>
            <BarChart
                key={buckets.length}
                data={data}
                width={chartWidth}
                height={180}
                barWidth={barWidth}
                spacing={Math.max(groupWidth - barWidth * 2 - 2, 6)}
                initialSpacing={6}
                roundedTop
                noOfSections={4}
                yAxisThickness={0}
                xAxisThickness={0}
                rulesColor={colors.border}
                yAxisTextStyle={{ color: colors.subtext, fontSize: 10 }}
                formatYLabel={(label) => formatCompact(Number(label))}
                yAxisLabelWidth={44}
                isAnimated
            />
        </View>
    );
}

const styles = StyleSheet.create({
    legend: {
        flexDirection: "row",
        gap: 16,
        marginBottom: 12,
    },
    legendItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
});
