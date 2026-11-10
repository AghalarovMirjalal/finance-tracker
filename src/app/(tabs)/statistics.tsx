import Header from "@/components/base/header";
import Card from "@/components/shared/card";
import EmptyState from "@/components/shared/empty-state";
import BalanceChart from "@/components/statistics/balance-chart";
import CategoryPie from "@/components/statistics/category-pie";
import IncomeExpenseChart from "@/components/statistics/income-expense-chart";
import PeriodSwitcher from "@/components/statistics/period-switcher";
import StatTile from "@/components/statistics/stat-tile";
import TransactionItem from "@/components/transactions/transaction-item";
import { layout, Palette } from "@/constant/layout";
import { useFinance, useMoney } from "@/hooks/use-finance";
import { useColors } from "@/hooks/use-theme";
import { Period } from "@/types/finance.type";
import { getPeriodRange } from "@/utils/date";
import {
  filterByRange,
  getBalanceTrend,
  getBuckets,
  getDaysInRange,
  getPercentChange,
  getTotals,
} from "@/utils/statistics";
import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function Statistics() {
  const { transactions } = useFinance();
  const money = useMoney();
  const colors = useColors();
  const styles = getStyles(colors);

  const [period, setPeriod] = useState<Period>("month");
  const [offset, setOffset] = useState(0);

  const stats = useMemo(() => {
    const range = getPeriodRange(period, offset);
    const current = filterByRange(transactions, range);
    const previous = filterByRange(transactions, getPeriodRange(period, offset - 1));

    const totals = getTotals(current);
    const prevTotals = getTotals(previous);
    const buckets = getBuckets(transactions, period, range);
    const savingsRate = totals.income > 0 ? (totals.balance / totals.income) * 100 : 0;

    const topExpenses = current
      .filter((transaction) => transaction.type === "expense")
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3);

    return {
      range,
      current,
      totals,
      buckets,
      savingsRate,
      topExpenses,
      trend: getBalanceTrend(transactions, buckets),
      incomeChange: getPercentChange(totals.income, prevTotals.income),
      expenseChange: getPercentChange(totals.expense, prevTotals.expense),
      dailyAverage: totals.expense / getDaysInRange(range),
    };
  }, [transactions, period, offset]);

  return (
    <View style={styles.container}>
      <Header title="Statistics" showBack={false} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <PeriodSwitcher
          period={period}
          offset={offset}
          range={stats.range}
          onPeriodChange={(value) => {
            setPeriod(value);
            setOffset(0);
          }}
          onOffsetChange={setOffset}
        />

        <View style={styles.tiles}>
          <StatTile
            label="Income"
            value={money(stats.totals.income)}
            icon="arrow-down-circle"
            color={layout.colors.income}
            change={stats.incomeChange}
          />
          <StatTile
            label="Expenses"
            value={money(stats.totals.expense)}
            icon="arrow-up-circle"
            color={layout.colors.expense}
            change={stats.expenseChange}
            positiveIsGood={false}
          />
          <StatTile
            label="Daily average"
            value={money(stats.dailyAverage)}
            icon="today"
            color="#0984E3"
          />
          <StatTile
            label="Savings rate"
            value={`${stats.savingsRate.toFixed(0)}%`}
            icon="shield-checkmark"
            color={layout.colors.primary}
          />
        </View>

        {stats.current.length === 0 ? (
          <Card>
            <EmptyState icon="bar-chart-outline" title="No transactions in this period" description="Choose another period or add new transactions." />
          </Card>
        ) : (
          <>
            <Card title="By category">
              <CategoryPie transactions={stats.current} />
            </Card>

            <Card title="Income vs expenses">
              <IncomeExpenseChart buckets={stats.buckets} />
            </Card>

            <Card title="Balance trend">
              <BalanceChart points={stats.trend} />
            </Card>

            <Card title="Biggest expenses">
              {stats.topExpenses.length ? (
                stats.topExpenses.map((transaction) => (
                  <TransactionItem key={transaction.id} transaction={transaction} />
                ))
              ) : (
                <Text style={styles.muted}>No expenses in this period</Text>
              )}
            </Card>

            <Card title="Summary">
              <View style={styles.summaryRow}>
                <Text style={styles.muted}>Transactions</Text>
                <Text style={styles.summaryValue}>{stats.current.length}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.muted}>Net result</Text>
                <Text style={[styles.summaryValue, { color: stats.totals.balance >= 0 ? layout.colors.income : layout.colors.expense }]}>
                  {money(stats.totals.balance, true)}
                </Text>
              </View>
            </Card>
          </>
        )}
      </ScrollView>
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
    gap: 16,
  },
  tiles: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  muted: {
    color: colors.subtext,
    fontSize: 14,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },
});
