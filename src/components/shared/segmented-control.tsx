import { layout } from "@/constant/layout";
import { useColors } from "@/hooks/use-theme";
import * as Haptics from "expo-haptics";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface Option<T> {
    label: string;
    value: T;
    color?: string;
}

interface SegmentedControlProps<T> {
    options: Option<T>[];
    value: T;
    onChange: (value: T) => void;
}

export default function SegmentedControl<T extends string>({ options, value, onChange }: SegmentedControlProps<T>) {
    const colors = useColors();

    return (
        <View style={[styles.container, { backgroundColor: colors.input }]}>
            {options.map((option) => {
                const active = option.value === value;
                return (
                    <Pressable
                        key={option.value}
                        style={[styles.item, active && { backgroundColor: option.color ?? layout.colors.primary }]}
                        onPress={() => {
                            void Haptics.selectionAsync();
                            onChange(option.value);
                        }}
                    >
                        <Text style={[styles.text, { color: active ? layout.colors.white : colors.subtext }]}>
                            {option.label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        borderRadius: layout.radius.md,
        padding: 4,
    },
    item: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: "center",
    },
    text: {
        fontSize: 14,
        fontWeight: "600",
    },
});
