import Header from "@/components/base/header";
import EmptyState from "@/components/shared/empty-state";
import TransactionForm from "@/components/transactions/transaction-form";
import { useFinance } from "@/hooks/use-finance";
import { useColors } from "@/hooks/use-theme";
import { router, useLocalSearchParams } from "expo-router";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";

export default function EditTransaction() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { transactions, updateTransaction } = useFinance();
  const colors = useColors();

  const transaction = transactions.find((item) => item.id === id);

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Header title="Edit transaction" />
      {transaction ? (
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <TransactionForm
            initialValues={transaction}
            submitLabel="Save changes"
            onSubmit={async (data) => {
              await updateTransaction(transaction.id, data);
              router.back();
            }}
          />
        </ScrollView>
      ) : (
        <View>
          <EmptyState icon="alert-circle-outline" title="Transaction not found" />
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
});
