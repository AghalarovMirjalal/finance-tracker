export interface User {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    avatar: string | null;
    createdAt: string;
}

export type PublicUser = Omit<User, "passwordHash">;

export interface SignUpData {
    name: string;
    email: string;
    password: string;
}

export interface SignInData {
    email: string;
    password: string;
}

export interface AuthContextType {
    user: PublicUser | null;
    isLoading: boolean;
    signIn: (data: SignInData) => Promise<void>;
    signUp: (data: SignUpData) => Promise<void>;
    signOut: () => Promise<void>;
    updateProfile: (data: Partial<Pick<User, "name" | "avatar">>) => Promise<void>;
    changeEmail: (newEmail: string, password: string) => Promise<void>;
    changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
    deleteAccount: () => Promise<void>;
}
