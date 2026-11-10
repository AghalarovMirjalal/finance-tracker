import Header from "@/components/base/header";
import TransactionForm from "@/components/transactions/transaction-form";
import { useFinance } from "@/hooks/use-finance";
import { useColors } from "@/hooks/use-theme";
import * as Haptics from "expo-haptics";
import { showMessage } from "@/utils/confirm";
import { router } from "expo-router";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from "react-native";

export default function AddTransaction() {
  const { addTransaction } = useFinance();
  const colors = useColors();

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Header title="New transaction" showBack={false} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <TransactionForm
          submitLabel="Save transaction"
          onSubmit={async (data) => {
            try {
              await addTransaction(data);
              void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              router.navigate("/home");
            } catch (error) {
              showMessage("Error", "Could not save the transaction");
            }
          }}
        />
      </ScrollView>
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
