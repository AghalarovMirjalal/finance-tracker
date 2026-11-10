import Header from "@/components/base/header";
import EmptyState from "@/components/shared/empty-state";
import SegmentedControl from "@/components/shared/segmented-control";
import TransactionItem from "@/components/transactions/transaction-item";
import { categories, getCategory } from "@/constant/categories";
import { layout, Palette } from "@/constant/layout";
import { useFinance, useMoney } from "@/hooks/use-finance";
import { useColors } from "@/hooks/use-theme";
import { Transaction, TransactionType } from "@/types/finance.type";
import { formatDay, startOfDay } from "@/utils/date";
import { getTotals } from "@/utils/statistics";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, SectionList, StyleSheet, Text, TextInput, View } from "react-native";

type Filter = "all" | TransactionType;
type Sort = "date" | "amount";

export default function Transactions() {
  const { transactions } = useFinance();
  const money = useMoney();
  const colors = useColors();
  const styles = getStyles(colors);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [sort, setSort] = useState<Sort>("date");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    const list = transactions.filter((transaction) => {
      if (filter !== "all" && transaction.type !== filter) return false;
      if (categoryId && transaction.categoryId !== categoryId) return false;
      if (!query) return true;

      const category = getCategory(transaction.categoryId).name.toLowerCase();
      return transaction.note.toLowerCase().includes(query) || category.includes(query);
    });

    return sort === "amount" ? [...list].sort((a, b) => b.amount - a.amount) : list;
  }, [transactions, search, filter, categoryId, sort]);

  // group by day only when sorted by date, otherwise one flat section
  const sections = useMemo(() => {
    if (sort === "amount") return [{ title: "Biggest first", data: filtered }];

    const groups = new Map<number, Transaction[]>();
    filtered.forEach((transaction) => {
      const key = startOfDay(new Date(transaction.date)).getTime();
      groups.set(key, [...(groups.get(key) ?? []), transaction]);
    });

    return Array.from(groups.entries()).map(([key, data]) => ({
      title: formatDay(new Date(key).toISOString()),
      data,
    }));
  }, [filtered, sort]);

  const totals = getTotals(filtered);
  const visibleCategories = categories.filter((category) => filter === "all" || category.type === filter);

  return (
    <View style={styles.container}>
      <Header
        title="History"
        showBack={false}
        right={
          <Pressable style={styles.sortButton} onPress={() => setSort(sort === "date" ? "amount" : "date")}>
            <Ionicons name={sort === "date" ? "calendar-outline" : "cash-outline"} size={20} color={colors.text} />
          </Pressable>
        }
      />

      <View style={styles.filters}>
        <View style={styles.search}>
          <Ionicons name="search" size={18} color={colors.subtext} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search by note or category"
            placeholderTextColor={colors.subtext}
            style={styles.searchInput}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={18} color={colors.subtext} />
            </Pressable>
          )}
        </View>

        <SegmentedControl<Filter>
          value={filter}
          onChange={(value) => {
            setFilter(value);
            setCategoryId(null);
          }}
          options={[
            { label: "All", value: "all" },
            { label: "Income", value: "income", color: layout.colors.income },
            { label: "Expense", value: "expense", color: layout.colors.expense },
          ]}
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {visibleCategories.map((category) => {
            const active = category.id === categoryId;
            return (
              <Pressable
                key={category.id}
                onPress={() => setCategoryId(active ? null : category.id)}
                style={[styles.chip, active && { backgroundColor: category.color }]}
              >
                <Ionicons name={category.icon} size={14} color={active ? layout.colors.white : category.color} />
                <Text style={[styles.chipText, active && { color: layout.colors.white }]}>{category.name}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.summary}>
          <Text style={styles.summaryText}>{filtered.length} transactions</Text>
          <Text style={[styles.summaryText, { color: layout.colors.income }]}>{money(totals.income, true)}</Text>
          <Text style={[styles.summaryText, { color: layout.colors.expense }]}>{money(-totals.expense)}</Text>
        </View>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionItem transaction={item} />}
        renderSectionHeader={({ section }) => <Text style={styles.sectionTitle}>{section.title}</Text>}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            icon="search-outline"
            title="Nothing found"
            description={transactions.length ? "Try to change filters or search text." : "You don't have any transactions yet."}
          />
        }
      />
    </View>
  );
}

const getStyles = (colors: Palette) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  sortButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  filters: {
    paddingHorizontal: 16,
    gap: 12,
  },
  search: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    height: 46,
    paddingHorizontal: 14,
    borderRadius: layout.radius.md,
    backgroundColor: colors.card,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
  },
  chips: {
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: layout.radius.full,
    backgroundColor: colors.card,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
  },
  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.subtext,
  },
  list: {
    padding: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.subtext,
    textTransform: "uppercase",
    marginTop: 8,
    marginBottom: 8,
  },
});
