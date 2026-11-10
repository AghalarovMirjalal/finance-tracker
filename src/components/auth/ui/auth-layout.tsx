import { layout, Palette } from "@/constant/layout";
import { useColors } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface AuthLayoutProps {
    title: string;
    subtitle: string;
    children: React.ReactNode;
}

export default function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
    const { top } = useSafeAreaInsets();
    const colors = useColors();
    const styles = getStyles(colors);

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" bounces={false}>
                <LinearGradient
                    colors={[layout.colors.primary, "#4834D4"]}
                    style={[styles.header, { paddingTop: top + 40 }]}
                >
                    <View style={styles.logo}>
                        <Ionicons name="wallet" size={32} color={layout.colors.primary} />
                    </View>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.subtitle}>{subtitle}</Text>
                </LinearGradient>

                <View style={styles.card}>{children}</View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const getStyles = (colors: Palette) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 40,
    },
    header: {
        paddingHorizontal: 24,
        paddingBottom: 80,
        borderBottomLeftRadius: 36,
        borderBottomRightRadius: 36,
    },
    logo: {
        width: 60,
        height: 60,
        borderRadius: 18,
        backgroundColor: layout.colors.white,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 24,
    },
    title: {
        fontSize: 30,
        fontWeight: "800",
        color: layout.colors.white,
    },
    subtitle: {
        fontSize: 15,
        color: "rgba(255, 255, 255, 0.8)",
        marginTop: 6,
    },
    card: {
        backgroundColor: colors.card,
        borderRadius: layout.radius.lg,
        marginHorizontal: 20,
        marginTop: -50,
        padding: 20,
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
    },
});
