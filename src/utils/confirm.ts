import { Alert, Platform } from "react-native";

// Alert with buttons doesn't work in the browser, so on web we use window.confirm
export function confirmAction(title: string, message: string, confirmText: string, onConfirm: () => void) {
    if (Platform.OS === "web") {
        if (window.confirm(`${title}\n\n${message}`)) onConfirm();
        return;
    }

    Alert.alert(title, message, [
        { text: "Cancel", style: "cancel" },
        { text: confirmText, style: "destructive", onPress: onConfirm },
    ]);
}

export function showMessage(title: string, message?: string) {
    if (Platform.OS === "web") {
        window.alert(message ? `${title}\n\n${message}` : title);
        return;
    }
    Alert.alert(title, message);
}
