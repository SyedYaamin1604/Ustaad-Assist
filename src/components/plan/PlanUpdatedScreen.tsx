import { PlanTopBar } from "@/components/plan/PlanTopBar";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { PlanChange, PlanSession, ReplanResult } from "@/types/plan";
import { formatShortDate, parseISODate } from "@/utils/date";
import { sessionTitle } from "@/utils/plan";
import { Feather } from "@expo/vector-icons";
import { Pressable, ScrollView, Text, View } from "react-native";

interface PlanUpdatedScreenProps {
  result: ReplanResult;
  lockedSessions: PlanSession[];
  onBack: () => void;
  onAccept: () => void;
  onUndo: () => void;
}

const LOCKED_PREVIEW = 3;

export function PlanUpdatedScreen({ result, lockedSessions, onBack, onAccept, onUndo }: PlanUpdatedScreenProps) {
  const recentLocked = lockedSessions.slice(-LOCKED_PREVIEW);
  const hiddenLocked = lockedSessions.length - recentLocked.length;
  const changeCount = result.sessions.length + result.assessments.length;

  return (
    <View className="flex-1 bg-[var(--color-accent)]">
      <ScrollView contentContainerClassName="px-5 pt-2 pb-36" showsVerticalScrollIndicator={false}>
        <PlanTopBar label="Replan" onBack={onBack} />

        <Text className="font-outfit-bold text-[32px] leading-9 text-black mb-1">Plan updated</Text>
        <Text className="font-outfit text-[15px] text-slate-500 mb-5">
          We re-aligned your semester timeline around the cancelled class.
        </Text>

        {lockedSessions.length > 0 && (
          <View className="bg-slate-100 border border-slate-200 rounded-[28px] p-4 mb-6">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center bg-slate-200 rounded-full px-3 py-1.5">
                <Feather name="lock" size={12} color="#334155" />
                <Text className="font-outfit-medium text-xs text-slate-700 ml-1.5">Past sessions (locked)</Text>
              </View>
              <Text className="font-outfit text-[13px] text-slate-500">{lockedSessions.length} completed</Text>
            </View>
            {hiddenLocked > 0 && (
              <Text className="font-outfit text-xs text-slate-400 mb-2">+ {hiddenLocked} earlier sessions</Text>
            )}
            {recentLocked.map((session) => (
              <View
                key={session.id}
                className="flex-row items-center border border-dashed border-slate-300 rounded-xl px-3 py-2.5 mb-2"
              >
                <Feather name="check-circle" size={18} color="#94A3B8" />
                <View className="flex-1 ml-3">
                  <Text className="font-outfit-medium text-sm text-slate-700">{sessionTitle(session)}</Text>
                  <Text className="font-outfit text-xs text-slate-500">
                    {formatShortDate(parseISODate(session.date))} · Completed
                  </Text>
                </View>
                <Feather name="lock" size={16} color="#94A3B8" />
              </View>
            ))}
          </View>
        )}

        <View className="flex-row items-center justify-between mb-3">
          <Text className="font-outfit-bold text-xl text-black">Schedule shifts</Text>
          <View className="bg-[#DFE6FB] rounded-full px-3 py-1">
            <Text className="font-outfit-semibold text-[13px] text-black">
              {changeCount} {changeCount === 1 ? "change" : "changes"}
            </Text>
          </View>
        </View>

        {changeCount === 0 && (
          <View className="bg-white rounded-[28px] p-5 items-center mb-3">
            <Text className="font-outfit-medium text-slate-500">Nothing else had to move.</Text>
          </View>
        )}

        {result.sessions.map((change) => (
          <ChangeCard key={change.id} change={change} />
        ))}

        {/* Reasons come from the server as ready-made sentences — show them exactly. */}
        {result.assessments.map((change) => (
          <View key={change.id} className="flex-row bg-[#3EB6AA] rounded-[28px] p-5 mb-3">
            <View className="w-12 h-12 rounded-full bg-white items-center justify-center mr-4">
              <Feather name="bell" size={20} color="#0F172A" />
            </View>
            <View className="flex-1">
              <Text className="font-outfit-bold text-lg text-black mb-1">{change.title} rescheduled</Text>
              <Text className="font-outfit text-sm leading-5 text-slate-900">{change.reason}</Text>
            </View>
          </View>
        ))}

        <View className="mt-3">
          <PrimaryButton label="Accept new plan" onPress={onAccept} />
        </View>
        <Pressable onPress={onUndo} className="items-center py-4">
          <Text className="font-outfit-semibold text-[15px] text-slate-500">Undo changes</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function ChangeCard({ change }: { change: PlanChange }) {
  return (
    <View className="bg-white rounded-[28px] p-5 mb-3">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 mr-3">
          <Text className="font-outfit-medium text-xs tracking-wider text-slate-500 uppercase mb-1">{change.label}</Text>
          <Text className="font-outfit-bold text-xl text-black mb-3">{change.title}</Text>
        </View>
        <View className="w-10 h-10 rounded-full bg-[#DFE6FB] items-center justify-center">
          <Feather name="repeat" size={16} color="#0F172A" />
        </View>
      </View>

      <View className="flex-row items-center self-start bg-slate-100 rounded-full px-4 py-2">
        <Text className="font-outfit text-sm text-slate-600">{formatShortDate(parseISODate(change.from_date))}</Text>
        <Feather name="arrow-right" size={14} color="#0F172A" style={{ marginHorizontal: 8 }} />
        <Text className="font-outfit-semibold text-sm text-black">{formatShortDate(parseISODate(change.to_date))}</Text>
      </View>

      <View className="flex-row items-start border-t border-slate-100 mt-4 pt-3">
        <Feather name="info" size={14} color="#64748B" style={{ marginTop: 2 }} />
        <Text className="font-outfit text-[13px] text-slate-600 ml-2 flex-1">{change.reason}</Text>
      </View>
    </View>
  );
}
