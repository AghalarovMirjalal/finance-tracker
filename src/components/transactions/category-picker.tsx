import CategoryIcon from "@/components/shared/category-icon";
import { getCategoriesByType } from "@/constant/categories";
import { layout } from "@/constant/layout";
import { useColors } from "@/hooks/use-theme";
import { TransactionType } from "@/types/finance.type";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface CategoryPickerProps {
    type: TransactionType;
    value: string;
    onChange: (categoryId: string) => void;
}

export default function CategoryPicker({ type, value, onChange }: CategoryPickerProps) {
    const colors = useColors();

    return (
        <View style={styles.grid}>
            {getCategoriesByType(type).map((category) => {
                const active = category.id === value;
                return (
                    <Pressable
                        key={category.id}
                        onPress={() => onChange(category.id)}
                        style={[
                            styles.item,
                            { backgroundColor: colors.input },
                            active && { borderColor: category.color, backgroundColor: `${category.color}1A` },
                        ]}
                    >
                        <CategoryIcon category={category} size={38} />
                        <Text style={[styles.name, { color: active ? category.color : colors.text }]} numberOfLines={1}>
                            {category.name}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    item: {
        width: "23%",
        flexGrow: 1,
        alignItems: "center",
        paddingVertical: 10,
        borderRadius: layout.radius.md,
        borderWidth: 1.5,
        borderColor: "transparent",
        gap: 6,
    },
    name: {
        fontSize: 11,
        fontWeight: "600",
    },
});
