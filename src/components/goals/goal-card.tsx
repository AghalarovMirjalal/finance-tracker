import ProgressBar from "@/components/shared/progress-bar";
import { IconName } from "@/constant/categories";
import { layout } from "@/constant/layout";
import { useMoney } from "@/hooks/use-finance";
import { useColors } from "@/hooks/use-theme";
import { Goal } from "@/types/finance.type";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface GoalCardProps {
    goal: Goal;
    onDeposit: () => void;
    onLongPress: () => void;
}

export default function GoalCard({ goal, onDeposit, onLongPress }: GoalCardProps) {
    const colors = useColors();
    const money = useMoney();
    const progress = goal.target > 0 ? goal.saved / goal.target : 0;
    const done = progress >= 1;

    return (
        <Pressable onLongPress={onLongPress} style={[styles.card, { backgroundColor: colors.card }]}>
            <View style={styles.row}>
                <View style={[styles.icon, { backgroundColor: `${goal.color}26` }]}>
                    <Ionicons name={goal.icon as IconName} size={24} color={goal.color} />
                </View>
                <View style={styles.info}>
                    <Text style={[styles.title, { color: colors.text }]}>{goal.title}</Text>
                    <Text style={[styles.subtitle, { color: colors.subtext }]}>
                        {money(goal.saved)} of {money(goal.target)}
                    </Text>
                </View>
                {done ? (
                    <View style={[styles.badge, { backgroundColor: `${layout.colors.income}26` }]}>
                        <Ionicons name="checkmark-circle" size={16} color={layout.colors.income} />
                        <Text style={[styles.badgeText, { color: layout.colors.income }]}>Done</Text>
                    </View>
                ) : (
                    <Pressable style={[styles.deposit, { backgroundColor: goal.color }]} onPress={onDeposit}>
                        <Ionicons name="add" size={20} color={layout.colors.white} />
                    </Pressable>
                )}
            </View>
            <ProgressBar progress={progress} color={goal.color} height={10} />
            <View style={styles.row}>
                <Text style={[styles.percent, { color: goal.color }]}>{Math.min(Math.round(progress * 100), 100)}%</Text>
                {!done && (
                    <Text style={[styles.left, { color: colors.subtext }]}>{money(goal.target - goal.saved)} to go</Text>
                )}
            </View>
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
        justifyContent: "space-between",
        gap: 12,
    },
    icon: {
        width: 50,
        height: 50,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    info: {
        flex: 1,
        gap: 2,
    },
    title: {
        fontSize: 16,
        fontWeight: "700",
    },
    subtitle: {
        fontSize: 13,
    },
    deposit: {
        width: 38,
        height: 38,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    badge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: layout.radius.full,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: "700",
    },
    percent: {
        fontSize: 13,
        fontWeight: "800",
    },
    left: {
        fontSize: 12,
    },
});
