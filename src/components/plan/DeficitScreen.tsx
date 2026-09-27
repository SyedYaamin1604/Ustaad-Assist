import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";

import type { DeficitChoice, DeficitOptions } from "@/api/types";
import { PlanTopBar } from "@/components/plan/PlanTopBar";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { EmptyState } from "@/components/ui/ScreenState";
import { formatShortDate, parseISODate } from "@/utils/date";
import { plural } from "@/utils/format";

interface DeficitScreenProps {
  options: DeficitOptions;
  busy: boolean;
  onBack: () => void;
  onApply: (choice: DeficitChoice) => void;
}

const OPTION_STYLE: Record<DeficitChoice, { bg: string; icon: keyof typeof Feather.glyphMap; title: string; highlight: string }> = {
  drop: { bg: "bg-[#F8DB77]", icon: "scissors", title: "Drop topics", highlight: "Keeps the remaining dates" },
  compress: { bg: "bg-[#3EB6AA]", icon: "zap", title: "Compress topics", highlight: "No extra classes" },
  extend: { bg: "bg-[#E77CA5]", icon: "clock", title: "Add makeup classes", highlight: "Keeps the full syllabus" },
};

type OptionView = {
  type: DeficitChoice;
  description: string;
  affects: string[];
  recovered: number;
  covers: boolean;
};

/** Turn the backend's three computed options into what each card says. */
function describe(options: DeficitOptions): OptionView[] {
  const { drop, compress, extend } = options;
  return [
    {
      type: "compress",
      description: "Teach some topics in fewer classes, never below their minimum.",
      affects: compress.topics.map((t) => `${t.title}: ${plural(t.from, "class", "classes")} → ${t.to}`),
      recovered: compress.sessions_recovered,
      covers: compress.covers_deficit,
    },
    {
      type: "extend",
      description: `Schedule ${plural(extend.dates.length, "makeup class", "makeup classes")} on days you don't normally teach.`,
      affects: extend.dates.map((d) => formatShortDate(parseISODate(d))),
      recovered: extend.sessions_recovered,
      covers: extend.covers_deficit,
    },
    {
      type: "drop",
      description: `Remove the ${plural(drop.topics.length, "lowest-priority topic")} to finish on time.`,
      affects: drop.topics.map((t) => `${t.title} (${plural(t.sessions_freed, "class", "classes")})`),
      recovered: drop.sessions_recovered,
      covers: drop.covers_deficit,
    },
  ];
}

export function DeficitScreen({ options, busy, onBack, onApply }: DeficitScreenProps) {
  const views = describe(options);
  const usable = views.filter((v) => v.recovered > 0);
  // Suggest the first option that fully solves it, in the order: compress, extend, drop.
  const recommended = views.find((v) => v.covers && v.recovered > 0)?.type;
  const [selected, setSelected] = useState<DeficitChoice | undefined>(recommended ?? usable[0]?.type);

  const shortBy = options.deficit;
  const availablePercent = options.sessions_needed === 0 ? 100 : Math.min(100, (options.slots_available / options.sessions_needed) * 100);

  if (shortBy <= 0) {
    return (
      <View className="flex-1 bg-[var(--color-accent)] px-5 pt-2">
        <PlanTopBar label="Semester pacing" onBack={onBack} />
        <View className="bg-white rounded-[28px]">
          <EmptyState
            icon="check-circle"
            title="You have enough classes"
            message={`${options.slots_available} classes are left for ${plural(options.sessions_needed, "class", "classes")} of teaching. Nothing needs to change.`}
          />
        </View>
      </View>
    );
  }

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
              "Each option is worked out from your topics' classes needed, minimum classes and priority. Edit topics to change them.",
            )
          }
        />

        <Text className="font-outfit-bold text-[32px] leading-9 text-black mb-1">{plural(shortBy, "class", "classes")} short</Text>
        <Text className="font-outfit text-[15px] text-slate-500 mb-5">
          The remaining topics need {plural(options.sessions_needed, "class", "classes")}, but only {options.slots_available}{" "}
          {options.slots_available === 1 ? "is" : "are"} left before the end of the semester.
        </Text>

        <View className="bg-white rounded-[28px] p-5 mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <Feather name="calendar" size={16} color="#0F172A" />
              <Text className="font-outfit-semibold text-base text-black ml-2">Available vs needed</Text>
            </View>
            <Text className="font-outfit text-[13px] text-slate-500">
              <Text className="font-outfit-bold text-xl text-black">{options.slots_available}</Text> / {options.sessions_needed}
            </Text>
          </View>
          <View className="flex-row h-2.5 rounded-full overflow-hidden bg-rose-300 mb-3">
            <View className="h-full bg-black rounded-full" style={{ width: `${availablePercent}%` }} />
          </View>
          <View className="flex-row items-center justify-between">
            <LegendDot className="bg-black" label={`${options.slots_available} classes left`} textClassName="text-slate-600" />
            <LegendDot className="bg-red-600" label={`-${shortBy} short`} textClassName="text-red-600" />
          </View>
        </View>

        <View className="flex-row items-center justify-between mb-3">
          <Text className="font-outfit-bold text-xl text-black">Recovery strategy</Text>
          <View className="bg-slate-200 rounded-full px-3 py-1">
            <Text className="font-outfit-medium text-xs text-slate-600">Choose 1</Text>
          </View>
        </View>

        {views.map((view) => (
          <OptionCard
            key={view.type}
            view={view}
            deficit={shortBy}
            recommended={view.type === recommended}
            selected={view.type === selected}
            onPress={() => view.recovered > 0 && setSelected(view.type)}
          />
        ))}

        <View className="flex-row items-center my-4">
          <Feather name="info" size={14} color="#64748B" />
          <Text className="font-outfit text-xs text-slate-500 ml-2 flex-1">
            Classes you have already taught are never changed. You can come back and pick another option later.
          </Text>
        </View>

        <PrimaryButton
          label={busy ? "Applying..." : "Apply and regenerate plan"}
          disabled={!selected || busy}
          onPress={() => selected && onApply(selected)}
        />
      </ScrollView>
    </View>
  );
}

function OptionCard({
  view,
  deficit,
  recommended,
  selected,
  onPress,
}: {
  view: OptionView;
  deficit: number;
  recommended: boolean;
  selected: boolean;
  onPress: () => void;
}) {
  const style = OPTION_STYLE[view.type];
  const possible = view.recovered > 0;

  return (
    <Pressable
      onPress={onPress}
      disabled={!possible}
      className={`rounded-[32px] p-5 mb-3 ${style.bg} ${selected ? "border-2 border-black" : "border-2 border-transparent"} ${
        possible ? "" : "opacity-50"
      }`}
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
        <Text className="font-outfit-bold text-xl text-black mr-2">{style.title}</Text>
        {recommended && (
          <View className="bg-black rounded-full px-2.5 py-1">
            <Text className="font-outfit-medium text-xs text-white">Recommended</Text>
          </View>
        )}
      </View>
      <Text className="font-outfit text-sm text-slate-900 mb-3">
        {possible ? view.description : "Not possible for this course right now."}
      </Text>

      {selected && possible && (
        <View className="bg-white rounded-2xl p-4 mb-3">
          {view.affects.map((item) => (
            <View key={item} className="flex-row items-start mb-1.5">
              <Text className="font-outfit-semibold text-sm text-black mr-2">•</Text>
              <Text className="font-outfit-medium text-sm text-black flex-1">{item}</Text>
            </View>
          ))}
          <View className="flex-row items-center justify-between border-t border-slate-100 mt-2 pt-3">
            {/* covers_deficit is the backend's honesty flag: an option may not fully solve it. */}
            <Text className={`font-outfit-medium text-xs ${view.covers ? "text-emerald-700" : "text-amber-700"}`}>
              {view.covers ? "Covers the whole shortfall" : `Recovers only ${view.recovered} of ${deficit}`}
            </Text>
            <View className="flex-row items-center bg-emerald-50 rounded-full px-2.5 py-1">
              <Feather name="plus-circle" size={12} color="#047857" />
              <Text className="font-outfit-semibold text-xs text-emerald-700 ml-1">+{view.recovered} class slots</Text>
            </View>
          </View>
        </View>
      )}

      <View className="self-start bg-white/70 rounded-full px-3 py-1.5">
        <Text className="font-outfit-semibold text-xs text-black">{style.highlight}</Text>
      </View>
    </Pressable>
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
