import Header from "@/components/base/header";
import DepositSheet from "@/components/goals/deposit-sheet";
import GoalCard from "@/components/goals/goal-card";
import GoalSheet from "@/components/goals/goal-sheet";
import Card from "@/components/shared/card";
import EmptyState from "@/components/shared/empty-state";
import ProgressBar from "@/components/shared/progress-bar";
import { layout, Palette } from "@/constant/layout";
import { useFinance, useMoney } from "@/hooks/use-finance";
import { useColors } from "@/hooks/use-theme";
import { Goal } from "@/types/finance.type";
import { confirmAction } from "@/utils/confirm";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function Goals() {
  const { goals, addGoal, depositToGoal, deleteGoal } = useFinance();
  const money = useMoney();
  const colors = useColors();
  const styles = getStyles(colors);

  const [createOpen, setCreateOpen] = useState(false);
  const [depositGoal, setDepositGoal] = useState<Goal | null>(null);

  const totalSaved = goals.reduce((acc, goal) => acc + goal.saved, 0);
  const totalTarget = goals.reduce((acc, goal) => acc + goal.target, 0);
  const completed = goals.filter((goal) => goal.saved >= goal.target).length;

  const handleDelete = (goal: Goal) => {
    confirmAction("Delete goal", `Delete "${goal.title}"?`, "Delete", () => void deleteGoal(goal.id));
  };

  return (
    <View style={styles.container}>
      <Header
        title="Saving goals"
        right={
          <Pressable style={styles.addButton} onPress={() => setCreateOpen(true)}>
            <Ionicons name="add" size={22} color={layout.colors.white} />
          </Pressable>
        }
      />

      <ScrollView contentContainerStyle={styles.content}>
        {goals.length === 0 ? (
          <Card>
            <EmptyState icon="flag-outline" title="No goals yet" description="Create a goal, for example a new laptop or a trip, and track how much you've saved.">
              <Pressable style={styles.emptyButton} onPress={() => setCreateOpen(true)}>
                <Text style={styles.emptyButtonText}>Create goal</Text>
              </Pressable>
            </EmptyState>
          </Card>
        ) : (
          <>
            <Card>
              <Text style={styles.summaryLabel}>Total saved</Text>
              <Text style={styles.summaryValue}>{money(totalSaved)}</Text>
              <ProgressBar progress={totalTarget ? totalSaved / totalTarget : 0} color={layout.colors.primary} height={10} />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>of {money(totalTarget)}</Text>
                <Text style={styles.summaryLabel}>{completed}/{goals.length} completed</Text>
              </View>
            </Card>

            {goals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} onDeposit={() => setDepositGoal(goal)} onLongPress={() => handleDelete(goal)} />
            ))}
            <Text style={styles.hint}>Long press on a goal to delete it</Text>
          </>
        )}
      </ScrollView>

      <GoalSheet visible={createOpen} onClose={() => setCreateOpen(false)} onSave={addGoal} />
      <DepositSheet goal={depositGoal} onClose={() => setDepositGoal(null)} onSave={depositToGoal} />
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
  summaryLabel: {
    fontSize: 13,
    color: colors.subtext,
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text,
    marginVertical: 8,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  hint: {
    textAlign: "center",
    fontSize: 12,
    color: colors.subtext,
  },
});
