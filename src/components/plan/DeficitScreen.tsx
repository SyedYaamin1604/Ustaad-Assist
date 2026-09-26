import { PlanTopBar } from "@/components/plan/PlanTopBar";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { DeficitOption, DeficitSummary, DeficitType } from "@/types/plan";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";

interface DeficitScreenProps {
  summary: DeficitSummary;
  onBack: () => void;
  onApply: (type: DeficitType) => void;
}

const OPTION_STYLE: Record<DeficitType, { bg: string; dot: string; icon: keyof typeof Feather.glyphMap }> = {
  drop: { bg: "bg-[#F8DB77]", dot: "bg-[#E0B93A]", icon: "star" },
  compress: { bg: "bg-[#3EB6AA]", dot: "bg-[#3EB6AA]", icon: "zap" },
  extend: { bg: "bg-[#E77CA5]", dot: "bg-[#E77CA5]", icon: "clock" },
};

export function DeficitScreen({ summary, onBack, onApply }: DeficitScreenProps) {
  const [selected, setSelected] = useState<DeficitType>(
    () => summary.options.find((o) => o.recommended)?.type ?? summary.options[0].type
  );

  const shortBy = summary.needed - summary.available;
  const selectedOption = summary.options.find((o) => o.type === selected)!;
  const availablePercent = Math.min(100, (summary.available / summary.needed) * 100);

  return (
    <View className="flex-1 bg-[var(--color-accent)]">
      <ScrollView contentContainerClassName="px-5 pt-2 pb-36" showsVerticalScrollIndicator={false}>
        <PlanTopBar
          label="Semester pacing deficit"
          onBack={onBack}
          actionIcon="info"
          onAction={() =>
            Alert.alert(
              "How these options work",
              "Each option is worked out from your topics' classes needed, minimum classes and priority. Edit topics to change them."
            )
          }
        />

        <Text className="font-outfit-bold text-[32px] leading-9 text-black mb-1">
          {shortBy} {shortBy === 1 ? "class" : "classes"} short
        </Text>
        <Text className="font-outfit text-[15px] text-slate-500 mb-5">{summary.reason}</Text>

        <View className="bg-white rounded-[28px] p-5 mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <Feather name="calendar" size={16} color="#0F172A" />
              <Text className="font-outfit-semibold text-base text-black ml-2">Available vs needed</Text>
            </View>
            <Text className="font-outfit text-[13px] text-slate-500">
              <Text className="font-outfit-bold text-xl text-black">{summary.available}</Text> / {summary.needed} planned
            </Text>
          </View>
          <View className="flex-row h-2.5 rounded-full overflow-hidden bg-rose-300 mb-3">
            <View className="h-full bg-black rounded-full" style={{ width: `${availablePercent}%` }} />
          </View>
          <View className="flex-row items-center justify-between">
            <LegendDot className="bg-black" label={`${summary.available} confirmed slots`} textClassName="text-slate-600" />
            <LegendDot className="bg-red-600" label={`-${shortBy} classes deficit`} textClassName="text-red-600" />
          </View>
        </View>

        <View className="flex-row items-center justify-between mb-3">
          <Text className="font-outfit-bold text-xl text-black">Recovery strategy</Text>
          <View className="bg-slate-200 rounded-full px-3 py-1">
            <Text className="font-outfit-medium text-xs text-slate-600">Choose 1</Text>
          </View>
        </View>

        {summary.options.map((option) => (
          <OptionCard
            key={option.type}
            option={option}
            selected={option.type === selected}
            onPress={() => setSelected(option.type)}
          />
        ))}

        <Roadmap summary={summary} option={selectedOption} />

        <View className="flex-row items-center mb-4">
          <Feather name="info" size={14} color="#64748B" />
          <Text className="font-outfit text-xs text-slate-500 ml-2 flex-1">
            This is not final. You can come back and pick a different option any time.
          </Text>
        </View>

        <PrimaryButton label="Apply and regenerate plan" onPress={() => onApply(selected)} />
      </ScrollView>
    </View>
  );
}

function OptionCard({ option, selected, onPress }: { option: DeficitOption; selected: boolean; onPress: () => void }) {
  const style = OPTION_STYLE[option.type];

  return (
    <Pressable
      onPress={onPress}
      className={`rounded-[32px] p-5 mb-3 ${style.bg} ${selected ? "border-2 border-black" : "border-2 border-transparent"}`}
    >
      <View className="flex-row items-start justify-between mb-3">
        <View className="w-12 h-12 rounded-full bg-white items-center justify-center">
          <Feather name={style.icon} size={20} color="#0F172A" />
        </View>
        {selected ? (
          <View className="w-8 h-8 rounded-full bg-black items-center justify-center">
            <Feather name="check" size={16} color="#fff" />
          </View>
        ) : (
          <View className="w-8 h-8 rounded-full bg-white border border-slate-200" />
        )}
      </View>

      <View className="flex-row items-center flex-wrap mb-1">
        <Text className="font-outfit-bold text-xl text-black mr-2">{option.title}</Text>
        {option.recommended && (
          <View className="bg-black rounded-full px-2.5 py-1">
            <Text className="font-outfit-medium text-xs text-white">Recommended</Text>
          </View>
        )}
      </View>
      <Text className="font-outfit text-sm text-slate-900 mb-3">{option.description}</Text>

      {selected && (
        <View className="bg-white rounded-2xl p-4 mb-3">
          {option.affects.map((item) => (
            <View key={item} className="flex-row items-start mb-1.5">
              <Text className="font-outfit-semibold text-sm text-black mr-2">•</Text>
              <Text className="font-outfit-medium text-sm text-black flex-1">{item}</Text>
            </View>
          ))}
          <View className="flex-row items-center justify-between border-t border-slate-100 mt-2 pt-3">
            <Text className="font-outfit-medium text-xs text-slate-500">Syllabus covered {option.coverage_percent}%</Text>
            <View className="flex-row items-center bg-emerald-50 rounded-full px-2.5 py-1">
              <Feather name="plus-circle" size={12} color="#047857" />
              <Text className="font-outfit-semibold text-xs text-emerald-700 ml-1">
                +{option.sessions_recovered} class slots recovered
              </Text>
            </View>
          </View>
        </View>
      )}

      <View className="self-start bg-white/70 rounded-full px-3 py-1.5">
        <Text className="font-outfit-semibold text-xs text-black">{option.highlight}</Text>
      </View>
    </Pressable>
  );
}

function Roadmap({ summary, option }: { summary: DeficitSummary; option: DeficitOption }) {
  const accelerated = option.sessions_recovered;
  const standard = Math.max(0, summary.needed - summary.done - accelerated);
  const dots = [
    ...Array(summary.done).fill("bg-black"),
    ...Array(standard).fill("bg-slate-200"),
    ...Array(accelerated).fill(OPTION_STYLE[option.type].dot),
  ];

  return (
    <View className="bg-white rounded-[28px] p-5 mt-3 mb-5">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="font-outfit-semibold text-xs tracking-wider text-slate-500">
          PROJECTED {summary.needed}-SESSION ROADMAP
        </Text>
        <Text className="font-outfit-semibold text-xs text-black">{option.coverage_percent}% covered</Text>
      </View>
      <View className="flex-row flex-wrap gap-3 mb-4">
        {dots.map((color, i) => (
          <View key={i} className={`w-5 h-5 rounded-full ${color}`} />
        ))}
      </View>
      <View className="flex-row items-center justify-between">
        <LegendDot className="bg-black" label={`${summary.done} done`} />
        <LegendDot className="bg-slate-200" label={`${standard} standard`} />
        <LegendDot className={OPTION_STYLE[option.type].dot} label={`${accelerated} recovered`} />
      </View>
    </View>
  );
}

function LegendDot({ className, label, textClassName = "text-slate-500" }: { className: string; label: string; textClassName?: string }) {
  return (
    <View className="flex-row items-center">
      <View className={`w-2.5 h-2.5 rounded-full mr-1.5 ${className}`} />
      <Text className={`font-outfit text-xs ${textClassName}`}>{label}</Text>
    </View>
  );
}
