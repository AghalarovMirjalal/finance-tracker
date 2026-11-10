import { layout } from "@/constant/layout";
import { useAuth } from "@/hooks/use-auth";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text } from "react-native";

export default function Index() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const scale = useRef(new Animated.Value(0.6)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const timer = setTimeout(() => {
      router.replace(user ? "/home" : "/auth/sign-in");
    }, 1500);

    return () => clearTimeout(timer);
  }, [isLoading, user]);

  return (
    <LinearGradient colors={[layout.colors.primary, "#4834D4"]} style={styles.container}>
      <Animated.View style={[styles.logo, { opacity, transform: [{ scale }] }]}>
        <Ionicons name="wallet" size={64} color={layout.colors.primary} />
      </Animated.View>
      <Animated.View style={{ opacity, alignItems: "center" }}>
        <Text style={styles.title}>FinTrack</Text>
        <Text style={styles.subtitle}>Control your money</Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 36,
    backgroundColor: layout.colors.white,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)",
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: layout.colors.white,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
  },
});
