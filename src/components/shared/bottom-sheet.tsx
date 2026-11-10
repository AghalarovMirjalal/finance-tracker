import { layout } from "@/constant/layout";
import { useColors } from "@/hooks/use-theme";
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface BottomSheetProps {
    visible: boolean;
    title: string;
    onClose: () => void;
    children: React.ReactNode;
}

export default function BottomSheet({ visible, title, onClose, children }: BottomSheetProps) {
    const colors = useColors();
    const { bottom } = useSafeAreaInsets();

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <KeyboardAvoidingView style={styles.wrapper} behavior={Platform.OS === "ios" ? "padding" : undefined}>
                <Pressable style={styles.backdrop} onPress={onClose} />
                <View style={[styles.sheet, { backgroundColor: colors.card, paddingBottom: bottom + 20 }]}>
                    <View style={[styles.handle, { backgroundColor: colors.border }]} />
                    <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
                    {children}
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        justifyContent: "flex-end",
    },
    backdrop: {
        ...StyleSheet.absoluteFill,
        backgroundColor: "rgba(0, 0, 0, 0.45)",
    },
    sheet: {
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        padding: 20,
    },
    handle: {
        width: 40,
        height: 5,
        borderRadius: layout.radius.full,
        alignSelf: "center",
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: "800",
        marginBottom: 16,
    },
});
