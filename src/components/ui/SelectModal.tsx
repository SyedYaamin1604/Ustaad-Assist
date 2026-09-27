import { Feather } from "@expo/vector-icons";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

interface SelectModalProps {
  visible: boolean;
  title: string;
  options: string[];
  value: string | null;
  onSelect: (value: string) => void;
  onClose: () => void;
  allowClear?: boolean;
}

export function SelectModal({ visible, title, options, value, onSelect, onClose, allowClear }: SelectModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-[var(--color-secondary)]/40">
        <Pressable className="absolute inset-0" onPress={onClose} />

        <View className="bg-[var(--color-primary)] rounded-t-[28px] px-5 pt-5 pb-8 max-h-[70%]">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="font-outfit-bold text-lg text-[var(--primary-font)]">{title}</Text>
            <Pressable onPress={onClose} className="w-9 h-9 rounded-full bg-[var(--primary-font)]/5 items-center justify-center">
              <Feather name="x" size={18} color="#0F172A" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {allowClear && (
              <Pressable
                onPress={() => {
                  onSelect("");
                  onClose();
                }}
                className="flex-row items-center justify-between py-3.5 border-b border-[var(--primary-font)]/10"
              >
                <Text className="font-outfit-medium text-[15px] text-[var(--primary-font)]/55">None</Text>
                {!value && <Feather name="check" size={16} color="#0F172A" />}
              </Pressable>
            )}
            {options.map((option) => {
              const isSelected = option === value;
              return (
                <Pressable
                  key={option}
                  onPress={() => {
                    onSelect(option);
                    onClose();
                  }}
                  className="flex-row items-center justify-between py-3.5 border-b border-[var(--primary-font)]/10"
                >
                  <Text className="font-outfit-medium text-[15px] text-[var(--primary-font)]">{option}</Text>
                  {isSelected && <Feather name="check" size={16} color="#0F172A" />}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
