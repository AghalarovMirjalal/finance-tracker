import Button from "@/components/base/button";
import Input from "@/components/base/input";
import BottomSheet from "@/components/shared/bottom-sheet";
import { goalColors, goalIcons } from "@/constant/categories";
import { layout } from "@/constant/layout";
import { useColors } from "@/hooks/use-theme";
import { parseAmount } from "@/utils/format";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { goalSchema, GoalSchema } from "./goal.schema";

interface GoalSheetProps {
    visible: boolean;
    onClose: () => void;
    onSave: (data: { title: string; target: number; color: string; icon: string }) => Promise<void>;
}

const defaultValues: GoalSchema = { title: "", target: "", color: goalColors[0], icon: goalIcons[0] };

export default function GoalSheet({ visible, onClose, onSave }: GoalSheetProps) {
    const colors = useColors();
    const { control, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm<GoalSchema>({
        resolver: zodResolver(goalSchema),
        defaultValues,
    });

    useEffect(() => {
        if (visible) reset(defaultValues);
    }, [visible]);

    const color = watch("color");

    const submit = async (data: GoalSchema) => {
        await onSave({ ...data, title: data.title.trim(), target: parseAmount(data.target) });
        onClose();
    };

    return (
        <BottomSheet visible={visible} title="New saving goal" onClose={onClose}>
            <Controller
                control={control}
                name="title"
                render={({ field: { value, onChange, onBlur } }) => (
                    <Input label="Title" icon="flag-outline" placeholder="e.g. New phone" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.title?.message} />
                )}
            />
            <Controller
                control={control}
                name="target"
                render={({ field: { value, onChange, onBlur } }) => (
                    <Input
                        label="Target amount"
                        icon="cash-outline"
                        placeholder="e.g. 1000"
                        keyboardType="decimal-pad"
                        value={value}
                        onChangeText={(text) => onChange(text.replace(/[^0-9.,]/g, ""))}
                        onBlur={onBlur}
                        error={errors.target?.message}
                    />
                )}
            />

            <Text style={[styles.label, { color: colors.text }]}>Color</Text>
            <Controller
                control={control}
                name="color"
                render={({ field: { value, onChange } }) => (
                    <View style={styles.row}>
                        {goalColors.map((item) => (
                            <Pressable key={item} onPress={() => onChange(item)} style={[styles.color, { backgroundColor: item }]}>
                                {value === item && <Ionicons name="checkmark" size={18} color={layout.colors.white} />}
                            </Pressable>
                        ))}
                    </View>
                )}
            />

            <Text style={[styles.label, { color: colors.text }]}>Icon</Text>
            <Controller
                control={control}
                name="icon"
                render={({ field: { value, onChange } }) => (
                    <View style={styles.row}>
                        {goalIcons.map((icon) => (
                            <Pressable
                                key={icon}
                                onPress={() => onChange(icon)}
                                style={[styles.icon, { backgroundColor: value === icon ? color : colors.input }]}
                            >
                                <Ionicons name={icon} size={20} color={value === icon ? layout.colors.white : colors.subtext} />
                            </Pressable>
                        ))}
                    </View>
                )}
            />

            <Button title="Create goal" loading={isSubmitting} onPress={() => void handleSubmit(submit)()} style={{ marginTop: 8 }} />
        </BottomSheet>
    );
}

const styles = StyleSheet.create({
    label: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 8,
    },
    row: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        marginBottom: 16,
    },
    color: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
    },
    icon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
});
