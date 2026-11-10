import CategoryIcon from "@/components/shared/category-icon";
import { getCategory } from "@/constant/categories";
import { layout } from "@/constant/layout";
import { useMoney } from "@/hooks/use-finance";
import { useColors } from "@/hooks/use-theme";
import { Transaction } from "@/types/finance.type";
import { formatTime } from "@/utils/date";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface TransactionItemProps {
    transaction: Transaction;
}

function TransactionItem({ transaction }: TransactionItemProps) {
    const colors = useColors();
    const money = useMoney();
    const category = getCategory(transaction.categoryId);
    const isIncome = transaction.type === "income";

    return (
        <Pressable
            onPress={() => router.push(`/transaction/${transaction.id}`)}
            style={({ pressed }) => [styles.container, { backgroundColor: colors.card }, pressed && { opacity: 0.7 }]}
        >
            <CategoryIcon category={category} />
            <View style={styles.info}>
                <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
                    {transaction.note || category.name}
                </Text>
                <View style={styles.meta}>
                    <Text style={[styles.subtitle, { color: colors.subtext }]}>
                        {category.name} · {formatTime(transaction.date)}
                    </Text>
                    {transaction.receipt && <Ionicons name="image-outline" size={13} color={colors.subtext} />}
                </View>
            </View>
            <Text style={[styles.amount, { color: isIncome ? layout.colors.income : colors.text }]}>
                {money(isIncome ? transaction.amount : -transaction.amount, true)}
            </Text>
        </Pressable>
    );
}

export default memo(TransactionItem);

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderRadius: layout.radius.md,
        gap: 12,
        marginBottom: 8,
    },
    info: {
        flex: 1,
        gap: 4,
    },
    meta: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    title: {
        fontSize: 15,
        fontWeight: "600",
    },
    subtitle: {
        fontSize: 12,
    },
    amount: {
        fontSize: 15,
        fontWeight: "700",
    },
});
