import { View, Text } from "react-native";

const StepProgress = ({
  current,
  total,
}: {
  current: number;
  total: number;
}) => {
  return (
    <View className="flex-row items-center gap-2">
      <Text className="text-xs font-medium text-slate-500">
        Step {current} of {total}
      </Text>
      <View className="flex-row gap-1">
        {Array.from({ length: total }).map((_, i) => (
          <View
            key={i}
            className={`h-1 w-6 rounded-full ${
              i < current ? "bg-slate-900" : "bg-slate-200"
            }`}
          />
        ))}
      </View>
    </View>
  );
}

export default StepProgress;