import { layout } from "@/constant/layout";
import { useFinance, useMoney } from "@/hooks/use-finance";
import { useColors } from "@/hooks/use-theme";
import { addDays, DAY_NAMES, isSameDay, startOfDay } from "@/utils/date";
import { formatCompact } from "@/utils/format";
import { filterByRange, getTotals } from "@/utils/statistics";
import { useMemo } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

export default function WeekChart() {
    const { transactions } = useFinance();
    const colors = useColors();
    const money = useMoney();
    const { width } = useWindowDimensions();

    const { data, total } = useMemo(() => {
        const today = startOfDay(new Date());
        let sum = 0;

        const bars = Array.from({ length: 7 }, (_, index) => {
            const start = addDays(today, index - 6);
            const { expense } = getTotals(filterByRange(transactions, { start, end: addDays(start, 1) }));
            sum += expense;

            return {
                value: expense,
                label: DAY_NAMES[start.getDay()],
                frontColor: isSameDay(start, today) ? layout.colors.primary : layout.colors.primaryLight,
            };
        });

        return { data: bars, total: sum };
    }, [transactions]);

    const chartWidth = width - 32 - 32 - 40;

    return (
        <View>
            <Text style={[styles.total, { color: colors.subtext }]}>
                Spent in last 7 days: <Text style={{ color: colors.text, fontWeight: "700" }}>{money(total)}</Text>
            </Text>
            <BarChart
                data={data}
                width={chartWidth}
                height={140}
                barWidth={chartWidth / 7 - 14}
                spacing={14}
                initialSpacing={8}
                roundedTop
                barBorderRadius={6}
                noOfSections={3}
                yAxisThickness={0}
                xAxisThickness={0}
                rulesColor={colors.border}
                yAxisTextStyle={{ color: colors.subtext, fontSize: 10 }}
                xAxisLabelTextStyle={{ color: colors.subtext, fontSize: 11 }}
                formatYLabel={(label) => formatCompact(Number(label))}
                yAxisLabelWidth={40}
                isAnimated
            />
        </View>
    );
}

const styles = StyleSheet.create({
    total: {
        fontSize: 13,
        marginBottom: 12,
    },
});
