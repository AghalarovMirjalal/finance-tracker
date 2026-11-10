import Button from "@/components/base/button";
import Input from "@/components/base/input";
import { layout } from "@/constant/layout";
import { useAuth } from "@/hooks/use-auth";
import { useColors } from "@/hooks/use-theme";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import AuthLayout from "./auth-layout";
import { signUpSchema, SignUpSchema } from "./auth.schema";

export default function SignUpForm() {
    const { signUp } = useAuth();
    const colors = useColors();
    const [serverError, setServerError] = useState("");

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignUpSchema>({
        resolver: zodResolver(signUpSchema),
        defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
    });

    const onSubmit = async ({ name, email, password }: SignUpSchema) => {
        try {
            setServerError("");
            await signUp({ name, email, password });
            router.replace("/home");
        } catch (error) {
            setServerError(error instanceof Error ? error.message : "Could not create account");
        }
    };

    return (
        <AuthLayout title="Create account" subtitle="Start managing your finances today">
            <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                        label="Full name"
                        icon="person-outline"
                        placeholder="John Doe"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        error={errors.name?.message}
                    />
                )}
            />

            <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                        label="Email"
                        icon="mail-outline"
                        placeholder="example@mail.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        error={errors.email?.message}
                    />
                )}
            />

            <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                        label="Password"
                        icon="lock-closed-outline"
                        placeholder="At least 8 characters"
                        autoCapitalize="none"
                        isPassword
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        error={errors.password?.message}
                    />
                )}
            />

            <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                        label="Confirm password"
                        icon="shield-checkmark-outline"
                        placeholder="Repeat password"
                        autoCapitalize="none"
                        isPassword
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        error={errors.confirmPassword?.message}
                    />
                )}
            />

            {serverError ? <Text style={styles.serverError}>{serverError}</Text> : null}

            <Button title="Create account" onPress={() => void handleSubmit(onSubmit)()} loading={isSubmitting} style={styles.button} />

            <View style={styles.footer}>
                <Text style={{ color: colors.subtext }}>Already have an account? </Text>
                <Link href="/auth/sign-in" replace style={styles.link}>Sign in</Link>
            </View>
        </AuthLayout>
    );
}

const styles = StyleSheet.create({
    serverError: {
        color: layout.colors.expense,
        textAlign: "center",
        marginBottom: 12,
    },
    button: {
        marginTop: 8,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
    },
    link: {
        color: layout.colors.primary,
        fontWeight: "700",
    },
});
