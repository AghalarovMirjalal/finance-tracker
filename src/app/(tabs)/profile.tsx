import Avatar from "@/components/shared/avatar";
import Card from "@/components/shared/card";
import MenuItem from "@/components/profile/menu-item";
import { layout, Palette } from "@/constant/layout";
import { useAuth } from "@/hooks/use-auth";
import { useFinance, useMoney } from "@/hooks/use-finance";
import { useColors } from "@/hooks/use-theme";
import { confirmAction } from "@/utils/confirm";
import { MONTH_NAMES } from "@/utils/date";
import { pickImage } from "@/utils/pick-image";
import { getTotals } from "@/utils/statistics";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const { user, signOut, updateProfile } = useAuth();
  const { transactions, goals, budgets } = useFinance();
  const money = useMoney();
  const colors = useColors();
  const styles = getStyles(colors);

  if (!user) return null;

  const totals = getTotals(transactions);
  const joined = new Date(user.createdAt);

  const changeAvatar = async () => {
    const uri = await pickImage("Profile photo");
    if (uri) await updateProfile({ avatar: uri });
  };

  const handleAvatarPress = () => {
    if (!user.avatar || Platform.OS === "web") {
      void changeAvatar();
      return;
    }
    Alert.alert("Profile photo", undefined, [
      { text: "Change photo", onPress: () => void changeAvatar() },
      { text: "Remove photo", style: "destructive", onPress: () => void updateProfile({ avatar: null }) },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleSignOut = () => {
    confirmAction("Log out", "Do you really want to log out?", "Log out", async () => {
      await signOut();
      router.replace("/auth/sign-in");
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.top}>
          <Pressable onPress={handleAvatarPress}>
            <Avatar uri={user.avatar} name={user.name} size={100} />
            <View style={styles.cameraBadge}>
              <Ionicons name="camera" size={16} color={layout.colors.white} />
            </View>
          </Pressable>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <Text style={styles.joined}>Member since {MONTH_NAMES[joined.getMonth()]} {joined.getFullYear()}</Text>
        </View>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{transactions.length}</Text>
            <Text style={styles.statLabel}>Transactions</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{goals.length}</Text>
            <Text style={styles.statLabel}>Goals</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: totals.balance >= 0 ? layout.colors.income : layout.colors.expense }]} numberOfLines={1} adjustsFontSizeToFit>
              {money(totals.balance)}
            </Text>
            <Text style={styles.statLabel}>Balance</Text>
          </View>
        </View>

        <Card title="Account">
          <MenuItem icon="person-outline" title="Edit profile" color="#0984E3" onPress={() => router.push("/edit-profile")} />
          <MenuItem icon="settings-outline" title="Settings" color="#636E72" onPress={() => router.push("/settings")} />
        </Card>

        <Card title="Finance">
          <MenuItem icon="pie-chart-outline" title="Budgets" color="#FF7675" value={`${budgets.length}`} onPress={() => router.push("/budgets")} />
          <MenuItem icon="flag-outline" title="Saving goals" color="#00B894" value={`${goals.length}`} onPress={() => router.push("/goals")} />
          <MenuItem icon="stats-chart-outline" title="Statistics" color={layout.colors.primary} onPress={() => router.navigate("/statistics")} />
        </Card>

        <Card>
          <MenuItem icon="log-out-outline" title="Log out" color={layout.colors.expense} danger onPress={handleSignOut} />
        </Card>
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
  top: {
    alignItems: "center",
    paddingTop: 16,
    gap: 4,
  },
  cameraBadge: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: layout.colors.primary,
    borderWidth: 3,
    borderColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
    marginTop: 12,
  },
  email: {
    fontSize: 14,
    color: colors.subtext,
  },
  joined: {
    fontSize: 12,
    color: colors.subtext,
  },
  stats: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: layout.radius.lg,
    paddingVertical: 16,
  },
  stat: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: colors.subtext,
    marginTop: 2,
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
});
