import { ArrowLeft } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

interface MaterialListHeaderProps {
  folderLabel: string;
  subtitle: string;
  onBack: () => void;
}

export function MaterialListHeader({ folderLabel, subtitle, onBack }: MaterialListHeaderProps) {
  return (
    <View>
      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={onBack} className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
          <ArrowLeft size={18} color="#111827" />
        </TouchableOpacity>

        <View className="flex-row items-center bg-[var(--color-primary)] rounded-full px-3 py-1.5 ml-3 flex-shrink">
          <Text className="font-outfit-medium text-xs text-[var(--primary-font)]/50">Course Material</Text>
          <Text className="font-outfit-medium text-xs text-[var(--primary-font)]/30 mx-1.5">/</Text>
          <Text className="font-outfit-medium text-xs text-[var(--primary-font)]" numberOfLines={1}>
            {folderLabel}
          </Text>
        </View>
      </View>

      <Text className="font-outfit-bold text-[28px] text-[var(--primary-font)] mb-1">{folderLabel}</Text>
      <Text className="font-outfit text-sm text-[var(--primary-font)]/50 mb-4">{subtitle}</Text>
    </View>
  );
}
