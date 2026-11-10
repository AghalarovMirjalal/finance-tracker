import * as ImagePicker from "expo-image-picker";
import { Alert, Platform } from "react-native";

const options: ImagePicker.ImagePickerOptions = {
    mediaTypes: ["images"],
    allowsEditing: true,
    quality: 0.6,
};

async function fromCamera() {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) {
        Alert.alert("No access", "Allow camera access in the phone settings to take a photo.");
        return null;
    }
    const result = await ImagePicker.launchCameraAsync(options);
    return result.canceled ? null : result.assets[0].uri;
}

async function fromGallery() {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
        Alert.alert("No access", "Allow photo library access in the phone settings to choose a photo.");
        return null;
    }
    const result = await ImagePicker.launchImageLibraryAsync(options);
    return result.canceled ? null : result.assets[0].uri;
}

// shows "Camera / Gallery" choice and resolves with the picked image uri
export function pickImage(title = "Add photo"): Promise<string | null> {
    if (Platform.OS === "web") return fromGallery();

    return new Promise((resolve) => {
        Alert.alert(title, "Where do you want to take the photo from?", [
            { text: "Camera", onPress: () => fromCamera().then(resolve) },
            { text: "Gallery", onPress: () => fromGallery().then(resolve) },
            { text: "Cancel", style: "cancel", onPress: () => resolve(null) },
        ], { cancelable: true, onDismiss: () => resolve(null) });
    });
}
