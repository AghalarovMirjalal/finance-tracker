import BalanceCard from "@/components/home/balance-card";
import WeekChart from "@/components/home/week-chart";
import Avatar from "@/components/shared/avatar";
import Card from "@/components/shared/card";
import EmptyState from "@/components/shared/empty-state";
import ProgressBar from "@/components/shared/progress-bar";
import TransactionItem from "@/components/transactions/transaction-item";
import { getCategory, IconName } from "@/constant/categories";
import { layout, Palette } from "@/constant/layout";
import { useAuth } from "@/hooks/use-auth";
import { useFinance, useMoney } from "@/hooks/use-finance";
import { useColors } from "@/hooks/use-theme";
import { getGreeting, getPeriodRange } from "@/utils/date";
import { filterByRange, getMonthSpent, getTotals } from "@/utils/statistics";
import { Ionicons } from "@expo/vector-icons";
import { Href, router } from "expo-router";
import { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const quickActions: { title: string; icon: IconName; href: Href; color: string }[] = [
  { title: "Budgets", icon: "pie-chart", href: "/budgets", color: "#FF7675" },
  { title: "Goals", icon: "flag", href: "/goals", color: "#00B894" },
  { title: "Statistics", icon: "stats-chart", href: "/statistics", color: "#0984E3" },
  { title: "Settings", icon: "settings", href: "/settings", color: "#FDCB6E" },
];

export default function Home() {
  const { user } = useAuth();
  const { transactions, budgets, loadDemoData } = useFinance();
  const money = useMoney();
  const colors = useColors();
  const styles = getStyles(colors);

  const { balance, month } = useMemo(() => ({
    balance: getTotals(transactions).balance,
    month: getTotals(filterByRange(transactions, getPeriodRange("month"))),
  }), [transactions]);

  const recent = transactions.slice(0, 5);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable style={styles.user} onPress={() => router.navigate("/profile")}>
            <Avatar uri={user?.avatar ?? null} name={user?.name ?? ""} size={46} />
            <View>
              <Text style={styles.greeting}>{getGreeting()},</Text>
              <Text style={styles.name}>{user?.name}</Text>
            </View>
          </Pressable>
          <Pressable style={styles.iconButton} onPress={() => router.push("/settings")}>
            <Ionicons name="notifications-outline" size={22} color={colors.text} />
          </Pressable>
        </View>

        <BalanceCard balance={balance} month={month} />

        <View style={styles.actions}>
          {quickActions.map((action) => (
            <Pressable key={action.title} style={styles.action} onPress={() => router.push(action.href)}>
              <View style={[styles.actionIcon, { backgroundColor: `${action.color}26` }]}>
                <Ionicons name={action.icon} size={22} color={action.color} />
              </View>
              <Text style={styles.actionText}>{action.title}</Text>
            </Pressable>
          ))}
        </View>

        {transactions.length === 0 ? (
          <Card>
            <EmptyState
              icon="wallet-outline"
              title="No transactions yet"
              description="Add your first income or expense with the + button, or load demo data to see how the app works."
            >
              <Pressable style={styles.demoButton} onPress={() => void loadDemoData()}>
                <Text style={styles.demoText}>Load demo data</Text>
              </Pressable>
            </EmptyState>
          </Card>
        ) : (
          <>
            <Card title="This week">
              <WeekChart />
            </Card>

            {budgets.length > 0 && (
              <Card
                title="Budgets"
                action={<Pressable onPress={() => router.push("/budgets")}><Text style={styles.link}>Manage</Text></Pressable>}
              >
                {budgets.slice(0, 3).map((budget) => {
                  const category = getCategory(budget.categoryId);
                  const spent = getMonthSpent(transactions, budget.categoryId);
                  const progress = spent / budget.limit;
                  return (
                    <View key={budget.categoryId} style={styles.budget}>
                      <View style={styles.budgetRow}>
                        <Text style={styles.budgetName}>{category.name}</Text>
                        <Text style={styles.budgetValue}>{money(spent)} / {money(budget.limit)}</Text>
                      </View>
                      <ProgressBar
                        progress={progress}
                        color={progress >= 1 ? layout.colors.expense : progress >= 0.8 ? layout.colors.warning : category.color}
                      />
                    </View>
                  );
                })}
              </Card>
            )}

            <View>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent transactions</Text>
                <Pressable onPress={() => router.navigate("/transactions")}>
                  <Text style={styles.link}>See all</Text>
                </Pressable>
              </View>
              {recent.map((transaction) => (
                <TransactionItem key={transaction.id} transaction={transaction} />
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (colors: Palette) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  user: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  greeting: {
    fontSize: 13,
    color: colors.subtext,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  action: {
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  actionIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text,
  },
  demoButton: {
    backgroundColor: layout.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: layout.radius.md,
  },
  demoText: {
    color: layout.colors.white,
    fontWeight: "600",
  },
  link: {
    color: layout.colors.primary,
    fontWeight: "600",
  },
  budget: {
    marginBottom: 12,
    gap: 6,
  },
  budgetRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  budgetName: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  budgetValue: {
    fontSize: 13,
    color: colors.subtext,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
  },
});
