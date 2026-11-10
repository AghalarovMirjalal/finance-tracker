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
import { signInSchema, SignInSchema } from "./auth.schema";

export default function SignInForm() {
    const { signIn } = useAuth();
    const colors = useColors();
    const [serverError, setServerError] = useState("");

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignInSchema>({
        resolver: zodResolver(signInSchema),
        defaultValues: { email: "", password: "" },
    });

    const onSubmit = async (data: SignInSchema) => {
        try {
            setServerError("");
            await signIn(data);
            router.replace("/home");
        } catch (error) {
            setServerError(error instanceof Error ? error.message : "Could not log in");
        }
    };

    return (
        <AuthLayout title="Welcome back" subtitle="Sign in to continue tracking your money">
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
                        placeholder="Your password"
                        autoCapitalize="none"
                        isPassword
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        error={errors.password?.message}
                    />
                )}
            />

            {serverError ? <Text style={styles.serverError}>{serverError}</Text> : null}

            <Button title="Sign in" onPress={() => void handleSubmit(onSubmit)()} loading={isSubmitting} style={styles.button} />

            <View style={styles.footer}>
                <Text style={{ color: colors.subtext }}>Don't have an account? </Text>
                <Link href="/auth/sign-up" replace style={styles.link}>Sign up</Link>
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
