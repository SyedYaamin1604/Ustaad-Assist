import { Feather } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

/** A full-area spinner for the first load of a screen. */
export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <View className="flex-1 items-center justify-center py-16">
      <ActivityIndicator color="#0F172A" />
      <Text className="font-outfit text-sm text-slate-500 mt-3">{label}</Text>
    </View>
  );
}

/** The server's error message, with a retry. */
export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      <View className="w-12 h-12 rounded-full bg-rose-100 items-center justify-center mb-3">
        <Feather name="alert-triangle" size={20} color="#BE123C" />
      </View>
      <Text className="font-outfit-semibold text-base text-black text-center">Couldn&apos;t load this</Text>
      <Text className="font-outfit text-sm text-slate-500 text-center mt-1">{message}</Text>
      {onRetry && (
        <Pressable onPress={onRetry} className="mt-5 rounded-full bg-black px-6 py-3 active:opacity-80">
          <Text className="font-outfit-semibold text-sm text-white">Try again</Text>
        </Pressable>
      )}
    </View>
  );
}

/** Nothing here yet, with an optional call to action. */
export function EmptyState({
  icon = "inbox",
  title,
  message,
  actionLabel,
  onAction,
}: {
  icon?: keyof typeof Feather.glyphMap;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View className="items-center justify-center px-8 py-16">
      <View className="w-12 h-12 rounded-full bg-slate-100 items-center justify-center mb-3">
        <Feather name={icon} size={20} color="#64748B" />
      </View>
      <Text className="font-outfit-semibold text-base text-black text-center">{title}</Text>
      {message && <Text className="font-outfit text-sm text-slate-500 text-center mt-1">{message}</Text>}
      {actionLabel && onAction && (
        <Pressable onPress={onAction} className="mt-5 rounded-full bg-black px-6 py-3 active:opacity-80">
          <Text className="font-outfit-semibold text-sm text-white">{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}
