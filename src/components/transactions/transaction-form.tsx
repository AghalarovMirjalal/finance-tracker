import Button from "@/components/base/button";
import Input from "@/components/base/input";
import SegmentedControl from "@/components/shared/segmented-control";
import { getCurrencySymbol } from "@/constant/currencies";
import { layout, Palette } from "@/constant/layout";
import { useFinance } from "@/hooks/use-finance";
import { useColors } from "@/hooks/use-theme";
import { TransactionInput } from "@/types/finance.type";
import { addDays, formatDay, isSameDay } from "@/utils/date";
import { parseAmount } from "@/utils/format";
import { pickImage } from "@/utils/pick-image";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import CategoryPicker from "./category-picker";
import { transactionSchema, TransactionSchema } from "./transaction.schema";

interface TransactionFormProps {
    initialValues?: Partial<TransactionInput>;
    submitLabel: string;
    onSubmit: (data: TransactionInput) => Promise<void>;
}

const toFormValues = (values?: Partial<TransactionInput>): TransactionSchema => ({
    type: values?.type ?? "expense",
    amount: values?.amount ? String(values.amount) : "",
    categoryId: values?.categoryId ?? "",
    note: values?.note ?? "",
    date: values?.date ? new Date(values.date) : new Date(),
    receipt: values?.receipt ?? null,
});

export default function TransactionForm({ initialValues, submitLabel, onSubmit }: TransactionFormProps) {
    const colors = useColors();
    const styles = getStyles(colors);
    const { settings } = useFinance();

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<TransactionSchema>({
        resolver: zodResolver(transactionSchema),
        defaultValues: toFormValues(initialValues),
    });

    const type = watch("type");
    const accent = type === "income" ? layout.colors.income : layout.colors.expense;

    const submit = async (data: TransactionSchema) => {
        await onSubmit({
            type: data.type,
            amount: Math.round(parseAmount(data.amount) * 100) / 100,
            categoryId: data.categoryId,
            note: data.note.trim(),
            date: data.date.toISOString(),
            receipt: data.receipt,
        });

        if (!initialValues) reset(toFormValues());
    };

    return (
        <View style={styles.container}>
            <Controller
                control={control}
                name="type"
                render={({ field: { value, onChange } }) => (
                    <SegmentedControl
                        value={value}
                        onChange={(next) => {
                            onChange(next);
                            setValue("categoryId", "");
                        }}
                        options={[
                            { label: "Expense", value: "expense", color: layout.colors.expense },
                            { label: "Income", value: "income", color: layout.colors.income },
                        ]}
                    />
                )}
            />

            <Controller
                control={control}
                name="amount"
                render={({ field: { value, onChange, onBlur } }) => (
                    <View style={styles.amountBox}>
                        <Text style={[styles.currency, { color: accent }]}>{getCurrencySymbol(settings.currency)}</Text>
                        <TextInput
                            style={[styles.amountInput, { color: accent }]}
                            value={value}
                            onChangeText={(text) => onChange(text.replace(/[^0-9.,]/g, ""))}
                            onBlur={onBlur}
                            placeholder="0.00"
                            placeholderTextColor={colors.subtext}
                            keyboardType="decimal-pad"
                            maxLength={10}
                        />
                    </View>
                )}
            />
            {errors.amount && <Text style={styles.error}>{errors.amount.message}</Text>}

            <Text style={styles.label}>Category</Text>
            <Controller
                control={control}
                name="categoryId"
                render={({ field: { value, onChange } }) => (
                    <CategoryPicker type={type} value={value} onChange={onChange} />
                )}
            />
            {errors.categoryId && <Text style={styles.error}>{errors.categoryId.message}</Text>}

            <Text style={styles.label}>Date</Text>
            <Controller
                control={control}
                name="date"
                render={({ field: { value, onChange } }) => (
                    <View style={styles.dateRow}>
                        <Pressable style={styles.dateArrow} onPress={() => onChange(addDays(value, -1))}>
                            <Ionicons name="chevron-back" size={20} color={colors.text} />
                        </Pressable>
                        <View style={styles.dateValue}>
                            <Ionicons name="calendar-outline" size={18} color={layout.colors.primary} />
                            <Text style={styles.dateText}>{formatDay(value.toISOString())}</Text>
                        </View>
                        <Pressable
                            style={[styles.dateArrow, isSameDay(value, new Date()) && { opacity: 0.3 }]}
                            disabled={isSameDay(value, new Date())}
                            onPress={() => onChange(addDays(value, 1))}
                        >
                            <Ionicons name="chevron-forward" size={20} color={colors.text} />
                        </Pressable>
                    </View>
                )}
            />
            {errors.date && <Text style={styles.error}>{errors.date.message}</Text>}

            <View style={{ height: 16 }} />
            <Controller
                control={control}
                name="note"
                render={({ field: { value, onChange, onBlur } }) => (
                    <Input
                        label="Note"
                        icon="create-outline"
                        placeholder="What was it for?"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        maxLength={60}
                        error={errors.note?.message}
                    />
                )}
            />

            <Controller
                control={control}
                name="receipt"
                render={({ field: { value, onChange } }) => value ? (
                    <View style={styles.receipt}>
                        <Image source={{ uri: value }} style={styles.receiptImage} />
                        <Pressable style={styles.removeReceipt} onPress={() => onChange(null)}>
                            <Ionicons name="close" size={18} color={layout.colors.white} />
                        </Pressable>
                    </View>
                ) : (
                    <Pressable
                        style={styles.attach}
                        onPress={async () => {
                            const uri = await pickImage("Attach receipt");
                            if (uri) onChange(uri);
                        }}
                    >
                        <Ionicons name="camera-outline" size={22} color={layout.colors.primary} />
                        <Text style={styles.attachText}>Attach receipt photo</Text>
                    </Pressable>
                )}
            />

            <Button title={submitLabel} onPress={() => void handleSubmit(submit)()} loading={isSubmitting} style={{ marginTop: 8 }} />
        </View>
    );
}

const getStyles = (colors: Palette) => StyleSheet.create({
    container: {
        gap: 4,
    },
    amountBox: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 24,
    },
    currency: {
        fontSize: 32,
        fontWeight: "700",
        marginRight: 4,
    },
    amountInput: {
        fontSize: 48,
        fontWeight: "800",
        minWidth: 120,
        textAlign: "center",
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.text,
        marginTop: 12,
        marginBottom: 8,
    },
    error: {
        color: layout.colors.expense,
        fontSize: 12,
        marginTop: 4,
        textAlign: "center",
    },
    dateRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    dateArrow: {
        width: 48,
        height: 48,
        borderRadius: layout.radius.md,
        backgroundColor: colors.input,
        alignItems: "center",
        justifyContent: "center",
    },
    dateValue: {
        flex: 1,
        height: 48,
        borderRadius: layout.radius.md,
        backgroundColor: colors.input,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    dateText: {
        fontSize: 15,
        fontWeight: "600",
        color: colors.text,
    },
    attach: {
        height: 56,
        borderRadius: layout.radius.md,
        borderWidth: 1.5,
        borderStyle: "dashed",
        borderColor: layout.colors.primary,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        marginBottom: 12,
    },
    attachText: {
        color: layout.colors.primary,
        fontWeight: "600",
    },
    receipt: {
        marginBottom: 12,
    },
    receiptImage: {
        width: "100%",
        height: 180,
        borderRadius: layout.radius.md,
    },
    removeReceipt: {
        position: "absolute",
        top: 8,
        right: 8,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        alignItems: "center",
        justifyContent: "center",
    },
});
