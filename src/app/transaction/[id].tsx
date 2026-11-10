import Button from "@/components/base/button";
import Header from "@/components/base/header";
import CategoryIcon from "@/components/shared/category-icon";
import EmptyState from "@/components/shared/empty-state";
import { getCategory } from "@/constant/categories";
import { layout, Palette } from "@/constant/layout";
import { useFinance, useMoney } from "@/hooks/use-finance";
import { useColors } from "@/hooks/use-theme";
import { confirmAction } from "@/utils/confirm";
import { formatDay, formatTime } from "@/utils/date";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function TransactionDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { transactions, deleteTransaction } = useFinance();
  const money = useMoney();
  const colors = useColors();
  const styles = getStyles(colors);
  const [previewOpen, setPreviewOpen] = useState(false);

  const transaction = transactions.find((item) => item.id === id);

  if (!transaction) {
    return (
      <View style={styles.container}>
        <Header title="Transaction" />
        <EmptyState icon="alert-circle-outline" title="Transaction not found" description="It may have been deleted." />
      </View>
    );
  }

  const category = getCategory(transaction.categoryId);
  const isIncome = transaction.type === "income";

  const handleDelete = () => {
    confirmAction("Delete transaction", "Are you sure? This action can't be undone.", "Delete", async () => {
      await deleteTransaction(transaction.id);
      router.back();
    });
  };

  const rows = [
    { icon: "pricetag-outline" as const, label: "Category", value: category.name },
    { icon: "swap-vertical-outline" as const, label: "Type", value: isIncome ? "Income" : "Expense" },
    { icon: "calendar-outline" as const, label: "Date", value: formatDay(transaction.date) },
    { icon: "time-outline" as const, label: "Time", value: formatTime(transaction.date) },
  ];

  return (
    <View style={styles.container}>
      <Header
        title="Details"
        right={
          <Pressable style={styles.iconButton} onPress={() => router.push(`/transaction/edit/${transaction.id}`)}>
            <Ionicons name="create-outline" size={20} color={colors.text} />
          </Pressable>
        }
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.top}>
          <CategoryIcon category={category} size={72} />
          <Text style={[styles.amount, { color: isIncome ? layout.colors.income : layout.colors.expense }]}>
            {money(isIncome ? transaction.amount : -transaction.amount, true)}
          </Text>
          <Text style={styles.note}>{transaction.note || "No note"}</Text>
        </View>

        <View style={styles.card}>
          {rows.map((row, index) => (
            <View key={row.label} style={[styles.row, index < rows.length - 1 && styles.rowBorder]}>
              <View style={styles.rowLeft}>
                <Ionicons name={row.icon} size={18} color={colors.subtext} />
                <Text style={styles.rowLabel}>{row.label}</Text>
              </View>
              <Text style={styles.rowValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        {transaction.receipt && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Receipt</Text>
            <Pressable onPress={() => setPreviewOpen(true)}>
              <Image source={{ uri: transaction.receipt }} style={styles.receipt} />
            </Pressable>
          </View>
        )}

        <Button title="Delete transaction" variant="danger" icon="trash-outline" onPress={handleDelete} />
      </ScrollView>

      <Modal visible={previewOpen} transparent animationType="fade" onRequestClose={() => setPreviewOpen(false)}>
        <Pressable style={styles.preview} onPress={() => setPreviewOpen(false)}>
          {transaction.receipt && (
            <Image source={{ uri: transaction.receipt }} style={styles.previewImage} resizeMode="contain" />
          )}
        </Pressable>
      </Modal>
    </View>
  );
}

const getStyles = (colors: Palette) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  top: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 16,
  },
  amount: {
    fontSize: 36,
    fontWeight: "800",
    marginTop: 8,
  },
  note: {
    fontSize: 16,
    color: colors.subtext,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: layout.radius.lg,
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  rowLabel: {
    fontSize: 15,
    color: colors.subtext,
  },
  rowValue: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
  },
  receipt: {
    width: "100%",
    height: 220,
    borderRadius: layout.radius.md,
  },
  preview: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.92)",
    justifyContent: "center",
  },
  previewImage: {
    width: "100%",
    height: "80%",
  },
});
