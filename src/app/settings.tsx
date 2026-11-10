import Header from "@/components/base/header";
import MenuItem from "@/components/profile/menu-item";
import Card from "@/components/shared/card";
import SegmentedControl from "@/components/shared/segmented-control";
import { currencies } from "@/constant/currencies";
import { layout, Palette } from "@/constant/layout";
import { useAuth } from "@/hooks/use-auth";
import { useFinance } from "@/hooks/use-finance";
import { useColors, useTheme } from "@/hooks/use-theme";
import { sendTestNotification } from "@/notification/reminders";
import { ThemeType } from "@/types/theme-types";
import { confirmAction, showMessage } from "@/utils/confirm";
import { router } from "expo-router";
import { Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";

const reminderHours = [9, 13, 18, 21];

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { settings, updateSettings, loadDemoData, clearAllData } = useFinance();
  const { deleteAccount } = useAuth();
  const colors = useColors();
  const styles = getStyles(colors);

  const switchColors = { false: colors.border, true: layout.colors.primary };

  const confirm = (title: string, message: string, action: () => Promise<void>, button = "Confirm") => {
    confirmAction(title, message, button, () => void action());
  };

  const handleReminder = async (enabled: boolean) => {
    if (enabled && Platform.OS === "web") {
      showMessage("Not available", "Notifications work only in the mobile app.");
      return;
    }
    await updateSettings({ reminderEnabled: enabled });
    if (enabled) {
      showMessage("Reminder is on", `We will remind you every day at ${settings.reminderHour}:00.`);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Settings" />
      <ScrollView contentContainerStyle={styles.content}>
        <Card title="Appearance">
          <SegmentedControl<ThemeType>
            value={theme}
            onChange={toggleTheme}
            options={[
              { label: "System", value: "system" },
              { label: "Light", value: "light" },
              { label: "Dark", value: "dark" },
            ]}
          />
        </Card>

        <Card title="Currency">
          <View style={styles.chips}>
            {currencies.map((currency) => {
              const active = settings.currency === currency.code;
              return (
                <Pressable
                  key={currency.code}
                  onPress={() => void updateSettings({ currency: currency.code })}
                  style={[styles.chip, active && styles.chipActive]}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {currency.symbol} {currency.code}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Card>

        <Card title="Notifications">
          <MenuItem
            icon="alarm-outline"
            title="Daily reminder"
            color="#0984E3"
            right={<Switch value={settings.reminderEnabled} onValueChange={(value) => void handleReminder(value)} trackColor={switchColors} />}
          />
          {settings.reminderEnabled && (
            <View style={[styles.chips, { marginBottom: 8 }]}>
              {reminderHours.map((hour) => {
                const active = settings.reminderHour === hour;
                return (
                  <Pressable
                    key={hour}
                    onPress={() => void updateSettings({ reminderHour: hour })}
                    style={[styles.chip, active && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>{hour}:00</Text>
                  </Pressable>
                );
              })}
            </View>
          )}
          <MenuItem
            icon="warning-outline"
            title="Budget alerts"
            color={layout.colors.warning}
            right={<Switch value={settings.budgetAlerts} onValueChange={(value) => void updateSettings({ budgetAlerts: value })} trackColor={switchColors} />}
          />
          <MenuItem
            icon="paper-plane-outline"
            title="Send test notification"
            color="#00B894"
            onPress={async () => {
              const sent = await sendTestNotification();
              if (!sent) {
                showMessage(
                  Platform.OS === "web" ? "Not available" : "No permission",
                  Platform.OS === "web" ? "Notifications work only in the mobile app." : "Allow notifications in the phone settings."
                );
              }
            }}
          />
        </Card>

        <Card title="Data">
          <MenuItem
            icon="sparkles-outline"
            title="Load demo data"
            color={layout.colors.primary}
            onPress={() => confirm("Load demo data", "Current transactions, budgets and goals will be replaced with demo data.", async () => {
              await loadDemoData();
              router.navigate("/home");
            }, "Load")}
          />
          <MenuItem
            icon="trash-outline"
            title="Clear all data"
            color={layout.colors.expense}
            danger
            onPress={() => confirm("Clear all data", "All your transactions, budgets and goals will be deleted.", clearAllData, "Delete")}
          />
          <MenuItem
            icon="person-remove-outline"
            title="Delete account"
            color={layout.colors.expense}
            danger
            onPress={() => confirm("Delete account", "Your account and all data will be deleted forever.", async () => {
              await deleteAccount();
              router.replace("/auth/sign-in");
            }, "Delete")}
          />
        </Card>

        <Text style={styles.version}>FinTrack v1.0.0</Text>
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
    paddingBottom: 40,
    gap: 16,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: layout.radius.full,
    backgroundColor: colors.input,
  },
  chipActive: {
    backgroundColor: layout.colors.primary,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  chipTextActive: {
    color: layout.colors.white,
  },
  version: {
    textAlign: "center",
    fontSize: 12,
    color: colors.subtext,
  },
});
