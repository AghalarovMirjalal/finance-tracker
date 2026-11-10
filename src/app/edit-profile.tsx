import {
  changeEmailSchema,
  ChangeEmailSchema,
  changePasswordSchema,
  ChangePasswordSchema,
  profileSchema,
  ProfileSchema,
} from "@/components/auth/ui/auth.schema";
import Button from "@/components/base/button";
import Header from "@/components/base/header";
import Input from "@/components/base/input";
import Avatar from "@/components/shared/avatar";
import Card from "@/components/shared/card";
import { layout, Palette } from "@/constant/layout";
import { useAuth } from "@/hooks/use-auth";
import { useColors } from "@/hooks/use-theme";
import { showMessage } from "@/utils/confirm";
import { pickImage } from "@/utils/pick-image";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const errorMessage = (error: unknown) => (error instanceof Error ? error.message : "Something went wrong");

export default function EditProfile() {
  const { user, updateProfile, changeEmail, changePassword } = useAuth();
  const colors = useColors();
  const styles = getStyles(colors);

  const profileForm = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? "" },
  });

  const emailForm = useForm<ChangeEmailSchema>({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: { email: user?.email ?? "", password: "" },
  });

  const passwordForm = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  if (!user) return null;

  const saveName = async ({ name }: ProfileSchema) => {
    await updateProfile({ name: name.trim() });
    showMessage("Saved", "Your name was updated");
  };

  const saveEmail = async ({ email, password }: ChangeEmailSchema) => {
    try {
      await changeEmail(email, password);
      emailForm.reset({ email: email.trim().toLowerCase(), password: "" });
      showMessage("Saved", "Your email was updated");
    } catch (error) {
      emailForm.setError("password", { message: errorMessage(error) });
    }
  };

  const savePassword = async ({ currentPassword, newPassword }: ChangePasswordSchema) => {
    try {
      await changePassword(currentPassword, newPassword);
      passwordForm.reset();
      showMessage("Saved", "Your password was changed");
    } catch (error) {
      passwordForm.setError("currentPassword", { message: errorMessage(error) });
    }
  };

  const changeAvatar = async () => {
    const uri = await pickImage("Profile photo");
    if (uri) await updateProfile({ avatar: uri });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Header title="Edit profile" />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.avatar}>
          <Avatar uri={user.avatar} name={user.name} size={96} />
          <Pressable onPress={() => void changeAvatar()}>
            <Text style={styles.link}>Change photo</Text>
          </Pressable>
        </View>

        <Card title="Personal info">
          <Controller
            control={profileForm.control}
            name="name"
            render={({ field: { value, onChange, onBlur } }) => (
              <Input label="Full name" icon="person-outline" value={value} onChangeText={onChange} onBlur={onBlur} error={profileForm.formState.errors.name?.message} />
            )}
          />
          <Button title="Save name" loading={profileForm.formState.isSubmitting} onPress={() => void profileForm.handleSubmit(saveName)()} />
        </Card>

        <Card title="Email">
          <Controller
            control={emailForm.control}
            name="email"
            render={({ field: { value, onChange, onBlur } }) => (
              <Input label="New email" icon="mail-outline" keyboardType="email-address" autoCapitalize="none" value={value} onChangeText={onChange} onBlur={onBlur} error={emailForm.formState.errors.email?.message} />
            )}
          />
          <Controller
            control={emailForm.control}
            name="password"
            render={({ field: { value, onChange, onBlur } }) => (
              <Input label="Password" icon="lock-closed-outline" isPassword autoCapitalize="none" placeholder="Confirm with your password" value={value} onChangeText={onChange} onBlur={onBlur} error={emailForm.formState.errors.password?.message} />
            )}
          />
          <Button title="Update email" variant="outline" loading={emailForm.formState.isSubmitting} onPress={() => void emailForm.handleSubmit(saveEmail)()} />
        </Card>

        <Card title="Change password">
          <Controller
            control={passwordForm.control}
            name="currentPassword"
            render={({ field: { value, onChange, onBlur } }) => (
              <Input label="Current password" icon="lock-closed-outline" isPassword autoCapitalize="none" value={value} onChangeText={onChange} onBlur={onBlur} error={passwordForm.formState.errors.currentPassword?.message} />
            )}
          />
          <Controller
            control={passwordForm.control}
            name="newPassword"
            render={({ field: { value, onChange, onBlur } }) => (
              <Input label="New password" icon="key-outline" isPassword autoCapitalize="none" value={value} onChangeText={onChange} onBlur={onBlur} error={passwordForm.formState.errors.newPassword?.message} />
            )}
          />
          <Controller
            control={passwordForm.control}
            name="confirmPassword"
            render={({ field: { value, onChange, onBlur } }) => (
              <Input label="Repeat new password" icon="shield-checkmark-outline" isPassword autoCapitalize="none" value={value} onChangeText={onChange} onBlur={onBlur} error={passwordForm.formState.errors.confirmPassword?.message} />
            )}
          />
          <Button title="Change password" variant="outline" loading={passwordForm.formState.isSubmitting} onPress={() => void passwordForm.handleSubmit(savePassword)()} />
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const getStyles = (colors: Palette) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 40,
    gap: 16,
  },
  avatar: {
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
  },
  link: {
    color: layout.colors.primary,
    fontWeight: "700",
  },
});
