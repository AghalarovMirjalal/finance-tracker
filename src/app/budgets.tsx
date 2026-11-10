import Header from "@/components/base/header";
import BudgetCard from "@/components/budgets/budget-card";
import BudgetSheet from "@/components/budgets/budget-sheet";
import Card from "@/components/shared/card";
import EmptyState from "@/components/shared/empty-state";
import { getCategoriesByType } from "@/constant/categories";
import { layout, Palette } from "@/constant/layout";
import { useFinance, useMoney } from "@/hooks/use-finance";
import { useColors } from "@/hooks/use-theme";
import { Budget } from "@/types/finance.type";
import { MONTH_NAMES } from "@/utils/date";
import { getMonthSpent } from "@/utils/statistics";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";

export default function Budgets() {
  const { budgets, transactions, setBudget, removeBudget } = useFinance();
  const money = useMoney();
  const colors = useColors();
  const styles = getStyles(colors);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<Budget | null>(null);

  const items = budgets.map((budget) => ({ budget, spent: getMonthSpent(transactions, budget.categoryId) }));
  const totalLimit = items.reduce((acc, item) => acc + item.budget.limit, 0);
  const totalSpent = items.reduce((acc, item) => acc + item.spent, 0);
  const usedPercent = totalLimit > 0 ? Math.min((totalSpent / totalLimit) * 100, 100) : 0;
  const canAdd = budgets.length < getCategoriesByType("expense").length;

  const openSheet = (budget: Budget | null) => {
    setEditing(budget);
    setSheetOpen(true);
  };

  return (
    <View style={styles.container}>
      <Header
        title="Budgets"
        right={canAdd && (
          <Pressable style={styles.addButton} onPress={() => openSheet(null)}>
            <Ionicons name="add" size={22} color={layout.colors.white} />
          </Pressable>
        )}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {budgets.length === 0 ? (
          <Card>
            <EmptyState
              icon="pie-chart-outline"
              title="No budgets yet"
              description="Set monthly limits for categories and get a notification when you're close to the limit."
            >
              <Pressable style={styles.emptyButton} onPress={() => openSheet(null)}>
                <Text style={styles.emptyButtonText}>Create budget</Text>
              </Pressable>
            </EmptyState>
          </Card>
        ) : (
          <>
            <Card>
              <View style={styles.summary}>
                <PieChart
                  donut
                  radius={56}
                  innerRadius={42}
                  innerCircleColor={colors.card}
                  data={[
                    { value: usedPercent, color: usedPercent >= 100 ? layout.colors.expense : layout.colors.primary },
                    { value: 100 - usedPercent, color: colors.input },
                  ]}
                  centerLabelComponent={() => (
                    <Text style={styles.summaryPercent}>{Math.round(usedPercent)}%</Text>
                  )}
                />
                <View style={styles.summaryInfo}>
                  <Text style={styles.summaryLabel}>{MONTH_NAMES[new Date().getMonth()]} budget</Text>
                  <Text style={styles.summaryValue}>{money(totalSpent)}</Text>
                  <Text style={styles.summaryLabel}>spent of {money(totalLimit)}</Text>
                  <Text style={[styles.summaryLeft, { color: totalLimit - totalSpent >= 0 ? layout.colors.income : layout.colors.expense }]}>
                    {totalLimit - totalSpent >= 0 ? `${money(totalLimit - totalSpent)} left` : `${money(totalSpent - totalLimit)} over`}
                  </Text>
                </View>
              </View>
            </Card>

            {items.map(({ budget, spent }) => (
              <BudgetCard key={budget.categoryId} budget={budget} spent={spent} onPress={() => openSheet(budget)} />
            ))}
          </>
        )}
      </ScrollView>

      <BudgetSheet
        visible={sheetOpen}
        budget={editing}
        usedCategories={budgets.map((budget) => budget.categoryId)}
        onClose={() => setSheetOpen(false)}
        onSave={setBudget}
        onRemove={removeBudget}
      />
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
    paddingTop: 0,
    paddingBottom: 32,
    gap: 12,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: layout.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyButton: {
    backgroundColor: layout.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: layout.radius.md,
  },
  emptyButtonText: {
    color: layout.colors.white,
    fontWeight: "600",
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  summaryPercent: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
  },
  summaryInfo: {
    flex: 1,
    gap: 2,
  },
  summaryLabel: {
    fontSize: 13,
    color: colors.subtext,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
  },
  summaryLeft: {
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
  },
});
