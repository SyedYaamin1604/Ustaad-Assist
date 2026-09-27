import { View, Text, TouchableOpacity, ScrollView, Switch } from "react-native";
import StepProgress from "./StepProgress";
import { Holiday } from "../../types/create-course";
import { router, useRouter } from "expo-router";

interface HolidaysScreenProps {
  holidays: Holiday[];
  onToggle: (id: string) => void;
  onAddCustom: () => void;
  onBack: () => void;
  onGenerate: () => void;
}

const HolidaysScreen = ({
  holidays,
  onToggle,
  onAddCustom,
  onBack,
  onGenerate,
}: HolidaysScreenProps) => {

  const router = useRouter();
  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ padding: 24 }}>
      <View className="mb-6 flex-row items-center justify-between">
        <TouchableOpacity
          onPress={onBack}
          className="h-12 w-12 items-center justify-center rounded-full bg-slate-200"
        >
          <Text className="text-2xl font-outfit text-[var(--color-secondary)]">←</Text>
        </TouchableOpacity>
        <StepProgress current={3} total={3} />
      </View>

      <Text className="mb-1 text-2xl font-bold text-slate-900">Holidays</Text>
      <Text className="mb-6 text-sm text-slate-500">
        Official university holidays. Toggle to skip classes on these dates.
      </Text>

      <View className="mb-6 rounded-2xl bg-white">
        {holidays.map((h) => (
          <View key={h.id} className="flex-row items-center gap-3 border-b border-slate-100 p-4">
            <View className="h-11 w-11 items-center justify-center rounded-full bg-slate-100">
              <Text className="text-xs font-semibold">{h.day}</Text>
              <Text className="text-[10px] uppercase text-slate-400">{h.month}</Text>
            </View>
            <View className="flex-1">
              <Text className="font-semibold text-slate-900">{h.title}</Text>
              <Text className="text-xs text-slate-400">{h.note}</Text>
            </View>
            <Switch value={h.skipClasses} onValueChange={() => onToggle(h.id)} />
          </View>
        ))}
      </View>

      <TouchableOpacity
        onPress={onAddCustom}
        className="mb-6 items-center rounded-full bg-white py-3.5"
      >
        <Text className="font-semibold text-slate-900">+ Add custom holiday</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onGenerate} className="items-center rounded-full bg-slate-900 py-4">
        <Text className="font-semibold text-white" onPress={()=>router.push("/(tabs)/Home")}>Generate my plan →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

export default HolidaysScreen;