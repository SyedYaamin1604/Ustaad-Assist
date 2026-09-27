import { Text, View } from "react-native";
import { FolderOpen } from "lucide-react-native";

type ReportsTitleProps = {
  title: string;
  subtitle: string;
};

export function ReportsTitle({ title, subtitle }: ReportsTitleProps) {
  return (
    <View className="px-6 pb-6 pt-5">
      <Text className="text-[32px] font-extrabold leading-9 text-gray-900">
        {title}
      </Text>
      <View className="mt-2 flex-row items-center gap-1.5">
        <FolderOpen size={14} color="#6B7280" />
        <Text className="text-[13px] text-gray-500">{subtitle}</Text>
      </View>
    </View>
  );
}