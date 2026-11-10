import { useColors, useTheme } from "@/hooks/use-theme";
import { removeNotificationListeners, setupNotificationListeners } from "@/notification/listeners";
import { configureNotificationHandler } from "@/notification/register";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

configureNotificationHandler();

export default function LayoutContent() {
  const { colorScheme } = useTheme();
  const colors = useColors();

  useEffect(() => {
    setupNotificationListeners();
    return () => removeNotificationListeners();
  }, []);

  return (
    <>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth/sign-in" options={{ animation: "fade" }} />
        <Stack.Screen name="auth/sign-up" />
        <Stack.Screen name="(tabs)" options={{ animation: "fade" }} />
        <Stack.Screen name="transaction/[id]" />
        <Stack.Screen name="transaction/edit/[id]" options={{ presentation: "modal" }} />
        <Stack.Screen name="budgets" />
        <Stack.Screen name="goals" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="edit-profile" />
      </Stack>
    </>
  )
}
