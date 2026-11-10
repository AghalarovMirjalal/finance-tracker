import Button from "@/components/base/button";
import Input from "@/components/base/input";
import BottomSheet from "@/components/shared/bottom-sheet";
import SegmentedControl from "@/components/shared/segmented-control";
import { layout } from "@/constant/layout";
import { useMoney } from "@/hooks/use-finance";
import { Goal } from "@/types/finance.type";
import { parseAmount } from "@/utils/format";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { depositSchema, DepositSchema } from "./goal.schema";

interface DepositSheetProps {
    goal: Goal | null;
    onClose: () => void;
    onSave: (id: string, amount: number) => Promise<void>;
}

type Mode = "add" | "withdraw";

export default function DepositSheet({ goal, onClose, onSave }: DepositSheetProps) {
    const money = useMoney();
    const [mode, setMode] = useState<Mode>("add");
    const { control, handleSubmit, reset, setError, formState: { errors, isSubmitting } } = useForm<DepositSchema>({
        resolver: zodResolver(depositSchema),
        defaultValues: { amount: "" },
    });

    useEffect(() => {
        if (goal) {
            reset({ amount: "" });
            setMode("add");
        }
    }, [goal]);

    if (!goal) return null;

    const submit = async ({ amount }: DepositSchema) => {
        const value = parseAmount(amount);
        if (mode === "withdraw" && value > goal.saved) {
            setError("amount", { message: `You can withdraw up to ${money(goal.saved)}` });
            return;
        }
        await onSave(goal.id, mode === "add" ? value : -value);
        onClose();
    };

    return (
        <BottomSheet visible title={goal.title} onClose={onClose}>
            <View style={styles.info}>
                <Text style={styles.saved}>{money(goal.saved)}</Text>
                <Text style={styles.target}>saved of {money(goal.target)}</Text>
            </View>
            <SegmentedControl<Mode>
                value={mode}
                onChange={setMode}
                options={[
                    { label: "Add money", value: "add", color: layout.colors.income },
                    { label: "Withdraw", value: "withdraw", color: layout.colors.expense },
                ]}
            />
            <View style={{ height: 16 }} />
            <Controller
                control={control}
                name="amount"
                render={({ field: { value, onChange, onBlur } }) => (
                    <Input
                        label="Amount"
                        icon="cash-outline"
                        placeholder="0.00"
                        keyboardType="decimal-pad"
                        value={value}
                        onChangeText={(text) => onChange(text.replace(/[^0-9.,]/g, ""))}
                        onBlur={onBlur}
                        error={errors.amount?.message}
                    />
                )}
            />
            <Button title={mode === "add" ? "Add" : "Withdraw"} loading={isSubmitting} onPress={() => void handleSubmit(submit)()} />
        </BottomSheet>
    );
}

const styles = StyleSheet.create({
    info: {
        alignItems: "center",
        marginBottom: 16,
    },
    saved: {
        fontSize: 28,
        fontWeight: "800",
        color: layout.colors.primary,
    },
    target: {
        fontSize: 13,
        color: layout.colors.gray,
    },
});
