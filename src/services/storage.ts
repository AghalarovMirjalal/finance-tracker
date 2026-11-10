import AsyncStorage from "@react-native-async-storage/async-storage";

export const STORAGE_KEYS = {
    users: "users",
    userAuth: "user_auth",
    theme: "app_theme",
    transactions: (userId: string) => `transactions_${userId}`,
    budgets: (userId: string) => `budgets_${userId}`,
    goals: (userId: string) => `goals_${userId}`,
    settings: (userId: string) => `settings_${userId}`,
};

export async function getItem<T>(key: string, fallback: T): Promise<T> {
    try {
        const value = await AsyncStorage.getItem(key);
        return value ? (JSON.parse(value) as T) : fallback;
    } catch (error) {
        console.error(`Failed to read ${key}:`, error);
        return fallback;
    }
}

export async function setItem<T>(key: string, value: T) {
    await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function removeItems(keys: string[]) {
    await AsyncStorage.multiRemove(keys);
}

export async function removeUserData(userId: string) {
    await removeItems([
        STORAGE_KEYS.transactions(userId),
        STORAGE_KEYS.budgets(userId),
        STORAGE_KEYS.goals(userId),
        STORAGE_KEYS.settings(userId),
    ]);
}
