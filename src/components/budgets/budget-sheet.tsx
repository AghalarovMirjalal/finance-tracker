import Button from "@/components/base/button";
import Input from "@/components/base/input";
import BottomSheet from "@/components/shared/bottom-sheet";
import CategoryIcon from "@/components/shared/category-icon";
import { getCategoriesByType } from "@/constant/categories";
import { layout } from "@/constant/layout";
import { useColors } from "@/hooks/use-theme";
import { Budget } from "@/types/finance.type";
import { parseAmount } from "@/utils/format";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

interface BudgetSheetProps {
    visible: boolean;
    budget: Budget | null;
    usedCategories: string[];
    onClose: () => void;
    onSave: (categoryId: string, limit: number) => Promise<void>;
    onRemove: (categoryId: string) => Promise<void>;
}

export default function BudgetSheet({ visible, budget, usedCategories, onClose, onSave, onRemove }: BudgetSheetProps) {
    const colors = useColors();
    const [categoryId, setCategoryId] = useState("");
    const [limit, setLimit] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (visible) {
            setCategoryId(budget?.categoryId ?? "");
            setLimit(budget ? String(budget.limit) : "");
            setError("");
        }
    }, [visible, budget]);

    const available = getCategoriesByType("expense").filter(
        (category) => category.id === budget?.categoryId || !usedCategories.includes(category.id)
    );

    const handleSave = async () => {
        const value = parseAmount(limit);
        if (!categoryId) return setError("Choose a category");
        if (!value || value <= 0) return setError("Enter a valid limit");

        await onSave(categoryId, Math.round(value * 100) / 100);
        onClose();
    };

    return (
        <BottomSheet visible={visible} title={budget ? "Edit budget" : "New budget"} onClose={onClose}>
            {!budget && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categories}>
                    {available.map((category) => (
                        <Pressable
                            key={category.id}
                            onPress={() => setCategoryId(category.id)}
                            style={[
                                styles.category,
                                { backgroundColor: colors.input },
                                categoryId === category.id && { borderColor: category.color },
                            ]}
                        >
                            <CategoryIcon category={category} size={36} />
                            <Text style={[styles.categoryName, { color: colors.text }]}>{category.name}</Text>
                        </Pressable>
                    ))}
                </ScrollView>
            )}

            <Input
                label="Monthly limit"
                icon="cash-outline"
                placeholder="e.g. 300"
                keyboardType="decimal-pad"
                value={limit}
                onChangeText={(text) => setLimit(text.replace(/[^0-9.,]/g, ""))}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <View style={styles.buttons}>
                {budget && (
                    <Button
                        title="Remove"
                        variant="outline"
                        style={{ flex: 1, borderColor: layout.colors.expense }}
                        onPress={async () => {
                            await onRemove(budget.categoryId);
                            onClose();
                        }}
                    />
                )}
                <Button title="Save" style={{ flex: 1 }} onPress={() => void handleSave()} />
            </View>
        </BottomSheet>
    );
}

const styles = StyleSheet.create({
    categories: {
        gap: 8,
        paddingBottom: 16,
    },
    category: {
        alignItems: "center",
        gap: 6,
        padding: 10,
        width: 84,
        borderRadius: layout.radius.md,
        borderWidth: 1.5,
        borderColor: "transparent",
    },
    categoryName: {
        fontSize: 11,
        fontWeight: "600",
    },
    error: {
        color: layout.colors.expense,
        marginBottom: 12,
        textAlign: "center",
    },
    buttons: {
        flexDirection: "row",
        gap: 12,
    },
});
