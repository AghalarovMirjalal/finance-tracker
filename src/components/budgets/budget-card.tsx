import CategoryIcon from "@/components/shared/category-icon";
import ProgressBar from "@/components/shared/progress-bar";
import { getCategory } from "@/constant/categories";
import { layout } from "@/constant/layout";
import { useMoney } from "@/hooks/use-finance";
import { useColors } from "@/hooks/use-theme";
import { Budget } from "@/types/finance.type";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface BudgetCardProps {
    budget: Budget;
    spent: number;
    onPress: () => void;
}

export default function BudgetCard({ budget, spent, onPress }: BudgetCardProps) {
    const colors = useColors();
    const money = useMoney();
    const category = getCategory(budget.categoryId);
    const progress = spent / budget.limit;
    const left = budget.limit - spent;

    const status = progress >= 1
        ? { text: `Over by ${money(-left)}`, color: layout.colors.expense }
        : progress >= 0.8
            ? { text: `Only ${money(left)} left`, color: layout.colors.warning }
            : { text: `${money(left)} left`, color: layout.colors.income };

    return (
        <Pressable onPress={onPress} style={({ pressed }) => [styles.card, { backgroundColor: colors.card }, pressed && { opacity: 0.7 }]}>
            <View style={styles.row}>
                <CategoryIcon category={category} />
                <View style={styles.info}>
                    <Text style={[styles.name, { color: colors.text }]}>{category.name}</Text>
                    <Text style={[styles.status, { color: status.color }]}>{status.text}</Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                    <Text style={[styles.spent, { color: colors.text }]}>{money(spent)}</Text>
                    <Text style={[styles.limit, { color: colors.subtext }]}>of {money(budget.limit)}</Text>
                </View>
            </View>
            <ProgressBar progress={progress} color={progress >= 1 ? layout.colors.expense : progress >= 0.8 ? layout.colors.warning : category.color} height={10} />
            <Text style={[styles.percent, { color: colors.subtext }]}>{Math.round(progress * 100)}% used</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: layout.radius.lg,
        padding: 16,
        gap: 12,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    info: {
        flex: 1,
        gap: 2,
    },
    name: {
        fontSize: 16,
        fontWeight: "700",
    },
    status: {
        fontSize: 12,
        fontWeight: "600",
    },
    spent: {
        fontSize: 16,
        fontWeight: "700",
    },
    limit: {
        fontSize: 12,
    },
    percent: {
        fontSize: 12,
        textAlign: "right",
        marginTop: -6,
    },
});
