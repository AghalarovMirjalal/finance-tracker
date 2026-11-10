import { AuthContext } from "@/hooks/use-auth";
import * as authService from "@/services/auth-service";
import { PublicUser, SignInData, SignUpData, User } from "@/types/user.type";
import { useEffect, useState } from "react";

interface AuthProviderProps {
    children: React.ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<PublicUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        authService.getCurrentUser()
            .then(setUser)
            .finally(() => setIsLoading(false));
    }, []);

    const requireUser = () => {
        if (!user) throw new Error("You are not logged in");
        return user;
    };

    const signIn = async (data: SignInData) => {
        setUser(await authService.signIn(data));
    };

    const signUp = async (data: SignUpData) => {
        setUser(await authService.signUp(data));
    };

    const signOut = async () => {
        await authService.signOut();
        setUser(null);
    };

    const updateProfile = async (data: Partial<Pick<User, "name" | "avatar">>) => {
        setUser(await authService.updateUser(requireUser().id, data));
    };

    const changeEmail = async (newEmail: string, password: string) => {
        setUser(await authService.changeEmail(requireUser().id, newEmail, password));
    };

    const changePassword = async (currentPassword: string, newPassword: string) => {
        await authService.changePassword(requireUser().id, currentPassword, newPassword);
    };

    const deleteAccount = async () => {
        await authService.deleteUser(requireUser().id);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            signIn,
            signUp,
            signOut,
            updateProfile,
            changeEmail,
            changePassword,
            deleteAccount,
        }}>
            {children}
        </AuthContext.Provider>
    )
}
