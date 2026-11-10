import { layout } from "@/constant/layout";
import { Image, StyleSheet, Text, View } from "react-native";

interface AvatarProps {
    uri: string | null;
    name: string;
    size?: number;
}

const getInitials = (name: string) =>
    name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join("");

export default function Avatar({ uri, name, size = 48 }: AvatarProps) {
    const sizeStyle = { width: size, height: size, borderRadius: size / 2 };

    if (uri) {
        return <Image source={{ uri }} style={sizeStyle} />;
    }

    return (
        <View style={[styles.placeholder, sizeStyle]}>
            <Text style={[styles.initials, { fontSize: size * 0.38 }]}>{getInitials(name) || "?"}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    placeholder: {
        backgroundColor: layout.colors.primaryLight,
        alignItems: "center",
        justifyContent: "center",
    },
    initials: {
        color: layout.colors.white,
        fontWeight: "700",
    },
});
