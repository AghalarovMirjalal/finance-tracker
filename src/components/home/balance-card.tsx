import { layout } from "@/constant/layout";
import { useMoney } from "@/hooks/use-finance";
import { Totals } from "@/utils/statistics";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface BalanceCardProps {
    balance: number;
    month: Totals;
}

export default function BalanceCard({ balance, month }: BalanceCardProps) {
    const money = useMoney();
    const [hidden, setHidden] = useState(false);

    const show = (value: number) => (hidden ? "••••••" : money(value));

    return (
        <LinearGradient colors={[layout.colors.primary, "#4834D4"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
            <View style={styles.circle} />
            <View style={styles.row}>
                <Text style={styles.label}>Total balance</Text>
                <Pressable onPress={() => setHidden(!hidden)} hitSlop={10}>
                    <Ionicons name={hidden ? "eye-off-outline" : "eye-outline"} size={20} color={layout.colors.white} />
                </Pressable>
            </View>
            <Text style={styles.balance}>{show(balance)}</Text>

            <View style={styles.stats}>
                <View style={styles.stat}>
                    <View style={styles.statIcon}>
                        <Ionicons name="arrow-down" size={16} color={layout.colors.income} />
                    </View>
                    <View>
                        <Text style={styles.statLabel}>Income</Text>
                        <Text style={styles.statValue}>{show(month.income)}</Text>
                    </View>
                </View>
                <View style={styles.stat}>
                    <View style={styles.statIcon}>
                        <Ionicons name="arrow-up" size={16} color={layout.colors.expense} />
                    </View>
                    <View>
                        <Text style={styles.statLabel}>Expenses</Text>
                        <Text style={styles.statValue}>{show(month.expense)}</Text>
                    </View>
                </View>
            </View>
            <Text style={styles.caption}>This month</Text>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 24,
        padding: 20,
        overflow: "hidden",
    },
    circle: {
        position: "absolute",
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        top: -60,
        right: -50,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    label: {
        color: "rgba(255, 255, 255, 0.8)",
        fontSize: 14,
    },
    balance: {
        color: layout.colors.white,
        fontSize: 34,
        fontWeight: "800",
        marginTop: 6,
        marginBottom: 20,
    },
    stats: {
        flexDirection: "row",
        gap: 12,
    },
    stat: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        borderRadius: layout.radius.md,
        padding: 10,
    },
    statIcon: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: layout.colors.white,
        alignItems: "center",
        justifyContent: "center",
    },
    statLabel: {
        color: "rgba(255, 255, 255, 0.8)",
        fontSize: 12,
    },
    statValue: {
        color: layout.colors.white,
        fontSize: 14,
        fontWeight: "700",
    },
    caption: {
        color: "rgba(255, 255, 255, 0.6)",
        fontSize: 11,
        marginTop: 10,
        textAlign: "right",
    },
});
