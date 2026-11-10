import { Palette } from "@/constant/layout";
import { useColors } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface HeaderProps {
    title?: string;
    showBack?: boolean;
    right?: React.ReactNode;
}

export default function Header({ title, showBack = true, right }: HeaderProps) {
    const { top } = useSafeAreaInsets();
    const colors = useColors();
    const styles = getStyles(colors);

    const handleBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace("/home");
        }
    }

    return (
        <View style={[styles.container, { paddingTop: top + 12 }]}>
            <View style={styles.side}>
                {showBack && (
                    <Pressable onPress={handleBack} style={styles.iconButton} hitSlop={10}>
                        <Ionicons name="chevron-back" size={22} color={colors.text} />
                    </Pressable>
                )}
            </View>
            <Text style={styles.title} numberOfLines={1}>{title}</Text>
            <View style={[styles.side, { alignItems: "flex-end" }]}>{right}</View>
        </View>
    )
}

const getStyles = (colors: Palette) => StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: colors.background,
    },
    side: {
        width: 44,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: colors.card,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        flex: 1,
        textAlign: "center",
        fontSize: 18,
        fontWeight: "700",
        color: colors.text,
    },
});
