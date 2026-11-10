import { layout } from "@/constant/layout";
import { useColors } from "@/hooks/use-theme";
import { formatCompact } from "@/utils/format";
import { Text, useWindowDimensions, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";

interface BalanceChartProps {
    points: { label: string; value: number }[];
}

export default function BalanceChart({ points }: BalanceChartProps) {
    const colors = useColors();
    const { width } = useWindowDimensions();

    if (points.length < 2) {
        return <Text style={{ color: colors.subtext, textAlign: "center", paddingVertical: 24 }}>Not enough data yet</Text>;
    }

    const chartWidth = width - 32 - 32 - 50;
    const hasNegative = points.some((point) => point.value < 0);

    return (
        <View>
            <LineChart
                key={points.length}
                data={points.map((point) => ({
                    value: point.value,
                    label: point.label,
                    labelTextStyle: { color: colors.subtext, fontSize: 10, width: 30 },
                }))}
                width={chartWidth}
                height={170}
                adjustToWidth
                initialSpacing={10}
                endSpacing={10}
                areaChart
                curved
                thickness={3}
                color={layout.colors.primary}
                startFillColor={layout.colors.primary}
                endFillColor={layout.colors.primary}
                startOpacity={0.35}
                endOpacity={0.02}
                dataPointsColor={layout.colors.primary}
                noOfSections={4}
                yAxisThickness={0}
                xAxisThickness={0}
                rulesColor={colors.border}
                yAxisTextStyle={{ color: colors.subtext, fontSize: 10 }}
                formatYLabel={(label) => formatCompact(Number(label))}
                yAxisLabelWidth={50}
                mostNegativeValue={hasNegative ? Math.min(...points.map((point) => point.value)) : undefined}
                isAnimated
            />
        </View>
    );
}
