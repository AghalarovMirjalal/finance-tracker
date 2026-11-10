import { Category } from "@/constant/categories";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

interface CategoryIconProps {
    category: Category;
    size?: number;
}

export default function CategoryIcon({ category, size = 44 }: CategoryIconProps) {
    return (
        <View
            style={[
                styles.container,
                { width: size, height: size, borderRadius: size / 3, backgroundColor: `${category.color}26` },
            ]}
        >
            <Ionicons name={category.icon} size={size * 0.5} color={category.color} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
    },
});
