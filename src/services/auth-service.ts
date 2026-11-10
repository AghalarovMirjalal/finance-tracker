import { PublicUser, SignInData, SignUpData, User } from "@/types/user.type";
import * as Crypto from "expo-crypto";
import { getItem, removeItems, removeUserData, setItem, STORAGE_KEYS } from "./storage";

const hashPassword = (email: string, password: string) =>
    Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${email}:${password}`);

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const toPublic = ({ passwordHash, ...user }: User): PublicUser => user;

const getUsers = () => getItem<User[]>(STORAGE_KEYS.users, []);

const saveUsers = (users: User[]) => setItem(STORAGE_KEYS.users, users);

export async function getCurrentUser(): Promise<PublicUser | null> {
    const userId = await getItem<string | null>(STORAGE_KEYS.userAuth, null);
    if (!userId) return null;

    const users = await getUsers();
    const user = users.find((item) => item.id === userId);
    return user ? toPublic(user) : null;
}

export async function signUp({ name, email, password }: SignUpData) {
    const users = await getUsers();
    const normalized = normalizeEmail(email);

    if (users.some((user) => user.email === normalized)) {
        throw new Error("User with this email already exists");
    }

    const user: User = {
        id: Crypto.randomUUID(),
        name: name.trim(),
        email: normalized,
        passwordHash: await hashPassword(normalized, password),
        avatar: null,
        createdAt: new Date().toISOString(),
    };

    await saveUsers([...users, user]);
    await setItem(STORAGE_KEYS.userAuth, user.id);
    return toPublic(user);
}

export async function signIn({ email, password }: SignInData) {
    const users = await getUsers();
    const normalized = normalizeEmail(email);
    const user = users.find((item) => item.email === normalized);

    if (!user || user.passwordHash !== (await hashPassword(normalized, password))) {
        throw new Error("Wrong email or password");
    }

    await setItem(STORAGE_KEYS.userAuth, user.id);
    return toPublic(user);
}

export async function signOut() {
    await removeItems([STORAGE_KEYS.userAuth]);
}

export async function updateUser(userId: string, data: Partial<Pick<User, "name" | "avatar">>) {
    const users = await getUsers();
    const user = users.find((item) => item.id === userId);
    if (!user) throw new Error("User not found");

    const updated: User = { ...user, ...data };
    await saveUsers(users.map((item) => (item.id === userId ? updated : item)));
    return toPublic(updated);
}

// email is a part of the password hash, so it can be changed only with the password
export async function changeEmail(userId: string, newEmail: string, password: string) {
    const users = await getUsers();
    const user = users.find((item) => item.id === userId);
    const normalized = normalizeEmail(newEmail);

    if (!user) throw new Error("User not found");
    if (user.passwordHash !== (await hashPassword(user.email, password))) {
        throw new Error("Password is incorrect");
    }
    if (users.some((item) => item.email === normalized && item.id !== userId)) {
        throw new Error("This email is already taken");
    }

    const updated: User = { ...user, email: normalized, passwordHash: await hashPassword(normalized, password) };
    await saveUsers(users.map((item) => (item.id === userId ? updated : item)));
    return toPublic(updated);
}

export async function changePassword(userId: string, currentPassword: string, newPassword: string) {
    const users = await getUsers();
    const user = users.find((item) => item.id === userId);

    if (!user) throw new Error("User not found");
    if (user.passwordHash !== (await hashPassword(user.email, currentPassword))) {
        throw new Error("Current password is incorrect");
    }

    const updated = { ...user, passwordHash: await hashPassword(user.email, newPassword) };
    await saveUsers(users.map((item) => (item.id === userId ? updated : item)));
}

export async function deleteUser(userId: string) {
    const users = await getUsers();
    await saveUsers(users.filter((user) => user.id !== userId));
    await removeUserData(userId);
    await signOut();
}
