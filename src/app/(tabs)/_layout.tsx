import { layout, Palette } from "@/constant/layout";
import { useAuth } from "@/hooks/use-auth";
import { useColors } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function TabsLayout() {
  const { user, isLoading } = useAuth();
  const colors = useColors();
  const styles = getStyles(colors);

  if (!isLoading && !user) {
    return <Redirect href="/auth/sign-in" />;
  }

  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarShowLabel: true,
      tabBarActiveTintColor: layout.colors.primary,
      tabBarInactiveTintColor: colors.subtext,
      tabBarStyle: styles.tabBar,
      tabBarLabelStyle: styles.label,
      sceneStyle: { backgroundColor: colors.background },
    }}>
      <Tabs.Screen name="home" options={{
        title: "Home",
        tabBarIcon: ({ focused }) => (
          <Ionicons name={focused ? "home" : "home-outline"} size={22} color={focused ? layout.colors.primary : colors.subtext} />
        ),
      }} />
      <Tabs.Screen name="transactions" options={{
        title: "History",
        tabBarIcon: ({ focused }) => (
          <Ionicons name={focused ? "list" : "list-outline"} size={22} color={focused ? layout.colors.primary : colors.subtext} />
        ),
      }} />
      <Tabs.Screen name="add" options={{
        title: "",
        tabBarIcon: () => (
          <View style={styles.addButton}>
            <Ionicons name="add" size={30} color={layout.colors.white} />
          </View>
        ),
      }} />
      <Tabs.Screen name="statistics" options={{
        title: "Stats",
        tabBarIcon: ({ focused }) => (
          <Ionicons name={focused ? "pie-chart" : "pie-chart-outline"} size={22} color={focused ? layout.colors.primary : colors.subtext} />
        ),
      }} />
      <Tabs.Screen name="profile" options={{
        title: "Profile",
        tabBarIcon: ({ focused }) => (
          <Ionicons name={focused ? "person" : "person-outline"} size={22} color={focused ? layout.colors.primary : colors.subtext} />
        ),
      }} />
    </Tabs>
  );
}

const getStyles = (colors: Palette) => StyleSheet.create({
  tabBar: {
    backgroundColor: colors.tabBar,
    borderTopWidth: 0,
    height: 88,
    paddingTop: 8,
    boxShadow: "0 -4px 16px rgba(0, 0, 0, 0.06)",
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: layout.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
    boxShadow: "0 6px 14px rgba(108, 92, 231, 0.45)",
  },
});
