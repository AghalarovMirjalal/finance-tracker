import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { requestNotificationPermission } from "./register";

const DAILY_REMINDER_ID = "daily-reminder";

export async function scheduleDailyReminder(hour: number) {
  const granted = await requestNotificationPermission();
  if (!granted) return false;

  await cancelDailyReminder();
  await Notifications.scheduleNotificationAsync({
    identifier: DAILY_REMINDER_ID,
    content: {
      title: "Don't forget your expenses 💸",
      body: "Take a minute to add today's transactions.",
      data: { screen: "/add" },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute: 0,
    },
  });
  return true;
}

export async function cancelDailyReminder() {
  if (Platform.OS === "web") return;
  await Notifications.cancelScheduledNotificationAsync(DAILY_REMINDER_ID).catch(() => null);
}

export async function sendBudgetAlert(categoryName: string, percent: number, left: string) {
  const granted = await requestNotificationPermission();
  if (!granted) return;

  const exceeded = percent >= 100;
  await Notifications.scheduleNotificationAsync({
    content: {
      title: exceeded ? `${categoryName} budget exceeded!` : `${categoryName} budget almost spent`,
      body: exceeded
        ? "You have spent more than you planned this month."
        : `You used ${Math.round(percent)}% of the budget. ${left} left.`,
      data: { screen: "/budgets" },
    },
    trigger: null,
  });
}

export async function sendGoalReachedNotification(title: string) {
  const granted = await requestNotificationPermission();
  if (!granted) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Goal reached 🎉",
      body: `Congratulations! You saved enough for "${title}".`,
      data: { screen: "/goals" },
    },
    trigger: null,
  });
}

export async function sendTestNotification() {
  const granted = await requestNotificationPermission();
  if (!granted) return false;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "FinTrack",
      body: "Notifications are working 👍",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 3,
    },
  });
  return true;
}
