import { Feather } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";

interface NewCourseButtonProps {
    onPress?: () => void;
}

const NewCourseButton = ({ onPress }: NewCourseButtonProps) => {
    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="button"
            className="w-full flex-row items-center justify-center bg-[var(--color-secondary)] active:opacity-80 h-[50px] rounded-full"
        >
            <Feather name="plus" size={18} color="#ffffff" />
            <Text className="text-[var(--secondary-font)] font-outfit-medium text-[15px] ml-2">
                New course
            </Text>
        </Pressable>
    );
};

export default NewCourseButton;
