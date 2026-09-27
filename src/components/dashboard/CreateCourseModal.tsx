import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface CreateCourseModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectNew: () => void;
  onSelectClone: () => void;
}

const CreateCourseModal = ({
  visible,
  onClose,
  onSelectNew,
  onSelectClone,
}: CreateCourseModalProps) => {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      // Draw under the Android status/nav bars so the backdrop covers the whole screen
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}
    >
      {/* Blur (iOS) + dark scrim so the backdrop is dark on Android too */}
      <BlurView
        intensity={40}
        tint="dark"
        style={StyleSheet.absoluteFill}
      />
      <View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(15, 23, 42, 0.55)" }]}
      />
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        style={StyleSheet.absoluteFill}
      />

      <View className="flex-1 justify-end">
        <View
          style={{ height: "48%", paddingBottom: insets.bottom + 16 }}
          className="rounded-t-[32px] bg-white px-6 pt-3 shadow-2xl"
        >
          {/* drag handle */}
          <View className="mb-5 items-center">
            <View className="h-1.5 w-12 rounded-full bg-slate-200" />
          </View>

          <View className="mb-1 flex-row items-center justify-between">
            <Text className="text-2xl font-outfit-bold text-slate-900">
              Create Course
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="h-9 w-9 items-center justify-center rounded-full bg-slate-100"
            >
              <Text className="font-outfit text-base text-slate-500">✕</Text>
            </TouchableOpacity>
          </View>
          <Text className="font-outfit mb-6 text-sm text-slate-400">
            Choose how you&apos;d like to start this course
          </Text>

          <TouchableOpacity
            onPress={onSelectNew}
            activeOpacity={0.85}
            className="mb-4 flex-row items-center gap-4 rounded-3xl bg-emerald-50 p-5"
            style={{
              shadowColor: "#059669",
              shadowOpacity: 0.08,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 4 },
              elevation: 2,
            }}
          >
            <View className="h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500">
              <Text className="font-outfit text-xl text-white">+</Text>
            </View>
            <View className="flex-1">
              <Text className="mb-0.5 text-base font-outfit-semibold text-slate-900">
                New course
              </Text>
              <Text className="font-outfit text-sm leading-5 text-slate-500">
                Set up syllabus, weekly topics, and class schedule from
                scratch.
              </Text>
            </View>
            <Text className="font-outfit text-lg text-slate-300">›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onSelectClone}
            activeOpacity={0.85}
            className="mb-6 flex-row items-center gap-4 rounded-3xl bg-amber-50 p-5"
            style={{
              shadowColor: "#D97706",
              shadowOpacity: 0.08,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 4 },
              elevation: 2,
            }}
          >
            <View className="h-12 w-12 items-center justify-center rounded-2xl bg-amber-400">
              <Text className="font-outfit text-xl">📄</Text>
            </View>
            <View className="flex-1">
              <Text className="mb-0.5 text-base font-outfit-semibold text-slate-900">
                Clone previous semester
              </Text>
              <Text className="font-outfit text-sm leading-5 text-slate-500">
                Import topics, lecture plans, and grading criteria.
              </Text>
            </View>
            <Text className="font-outfit text-lg text-slate-300">›</Text>
          </TouchableOpacity>

          <View className="mt-auto">
            <TouchableOpacity
              onPress={onClose}
              className="items-center rounded-full bg-[var(--color-secondary)] py-4"
            >
              <Text className="font-outfit-semibold text-[var(--secondary-font)]">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CreateCourseModal;