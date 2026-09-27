import React from "react";
import { View, Text, Pressable } from "react-native";
import { Check, X, MapPin } from "lucide-react-native";

interface TodayClassCardProps {
  timeRangeLabel: string;
  topicTitle: string;
  room: string;
  subject: string;
  status?: "conducted" | "cancelled" | null;
  onMarkConducted?: () => void;
  onMarkCancelled?: () => void;
  onPress?: () => void;
}

export default function TodayClassCard({
  timeRangeLabel,
  topicTitle,
  room,
  subject,
  status = null,
  onMarkConducted,
  onMarkCancelled,
  onPress,
}: TodayClassCardProps) {
  // Only make the card itself pressable when a handler is provided; an outer
  // Pressable without onPress still grabs the touch responder and can swallow
  // presses on the action buttons inside it.
  const Container = onPress ? Pressable : View;

  return (
    <Container
      {...(onPress ? { onPress } : {})}
      className="mx-5 overflow-hidden rounded-[28px] bg-[#F6C94D] px-5 pb-5 pt-4"
    >
      {/* Badge */}
      <View className="self-start rounded-full bg-white/70 px-3.5 py-1.5">
        <Text className="text-[11px] font-semibold tracking-wide text-gray-800">
          TODAY&apos;S CLASS · {timeRangeLabel}
        </Text>
      </View>

      {/* Title */}
      <Text className="mt-3 text-[24px] font-bold leading-7 text-gray-900">
        {topicTitle}
      </Text>

      {/* Location */}
      <View className="mt-1.5 flex-row items-center">
        <MapPin size={14} color="#57534E" />
        <Text className="ml-1 text-[13px] text-gray-700">
          {room} · {subject}
        </Text>
      </View>

      {/* Actions */}
      <View className="mt-4 flex-row">
        <Pressable
          onPress={onMarkConducted}
          className={`mr-3 flex-row items-center rounded-full px-5 py-2.5 ${
            status === "conducted" ? "bg-gray-900" : "bg-gray-900"
          }`}
        >
          <Check size={16} color="#FFFFFF" />
          <Text className="ml-1.5 text-[14px] font-semibold text-white">
            Conducted
          </Text>
        </Pressable>

        <Pressable
          onPress={onMarkCancelled}
          className="flex-row items-center rounded-full bg-white px-5 py-2.5"
        >
          <X size={16} color="#111827" />
          <Text className="ml-1.5 text-[14px] font-semibold text-gray-900">
            Cancelled
          </Text>
        </Pressable>
      </View>
    </Container>
  );
}