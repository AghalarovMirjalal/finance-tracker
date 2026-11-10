import { useColors } from "@/hooks/use-theme";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

interface ProgressBarProps {
    progress: number;
    color: string;
    height?: number;
}

export default function ProgressBar({ progress, color, height = 8 }: ProgressBarProps) {
    const colors = useColors();
    const width = useRef(new Animated.Value(0)).current;
    const value = Math.min(Math.max(progress, 0), 1);

    useEffect(() => {
        Animated.timing(width, {
            toValue: value,
            duration: 700,
            useNativeDriver: false,
        }).start();
    }, [value]);

    return (
        <View style={[styles.track, { height, borderRadius: height, backgroundColor: colors.input }]}>
            <Animated.View
                style={{
                    height,
                    borderRadius: height,
                    backgroundColor: color,
                    width: width.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }),
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    track: {
        width: "100%",
        overflow: "hidden",
    },
});
