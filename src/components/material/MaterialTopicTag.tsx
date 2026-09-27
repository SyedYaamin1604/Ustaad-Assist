import { ACCENT_BG_CLASS, getTopicTagColor } from "@/utils/material";
import { Text, View } from "react-native";

interface MaterialTopicTagProps {
  topic: string;
}

export function MaterialTopicTag({ topic }: MaterialTopicTagProps) {
  const color = getTopicTagColor(topic);
  return (
    <View className={`self-start rounded-full px-2.5 py-1 ${ACCENT_BG_CLASS[color]}`}>
      <Text numberOfLines={1} className="font-outfit-medium text-[11px] text-[var(--primary-font)]">
        {topic}
      </Text>
    </View>
  );
}
