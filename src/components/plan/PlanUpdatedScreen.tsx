import { Feather } from "@expo/vector-icons";
import { Pressable, ScrollView, Text, View } from "react-native";

import type { ReplanResult, SessionChange } from "@/api/types";
import { PlanTopBar } from "@/components/plan/PlanTopBar";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { formatShortDate, parseISODate } from "@/utils/date";
import { plural } from "@/utils/format";
import { sessionTitle, type PlanSession } from "@/utils/plan";

interface PlanUpdatedScreenProps {
  result: ReplanResult;
  /** One sentence saying why the plan was rebuilt. */
  subtitle: string;
  lockedSessions: PlanSession[];
  busy?: boolean;
  onBack: () => void;
  onAccept: () => void;
  /** Only offered when the change can be reversed (a cancellation). */
  onUndo?: () => void;
  onOpenDeficit: () => void;
}

const LOCKED_PREVIEW = 3;

const short = (iso?: string) => (iso ? formatShortDate(parseISODate(iso)) : "");

export function PlanUpdatedScreen({
  result,
  subtitle,
  lockedSessions,
  busy = false,
  onBack,
  onAccept,
  onUndo,
  onOpenDeficit,
}: PlanUpdatedScreenProps) {
  const recentLocked = lockedSessions.slice(-LOCKED_PREVIEW);
  const hiddenLocked = lockedSessions.length - recentLocked.length;
  const changeCount = result.changes.length + result.assessments_moved.length;

  return (
    <View className="flex-1 bg-[var(--color-accent)]">
      <ScrollView contentContainerClassName="px-5 pt-2 pb-36" showsVerticalScrollIndicator={false}>
        <PlanTopBar label="Replan" onBack={onBack} />

        <Text className="font-outfit-bold text-[32px] leading-9 text-black mb-1">Plan updated</Text>
        <Text className="font-outfit text-[15px] text-slate-500 mb-5">{subtitle}</Text>

        {result.frozen > 0 && (
          <View className="bg-slate-100 border border-slate-200 rounded-[28px] p-4 mb-6">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center bg-slate-200 rounded-full px-3 py-1.5">
                <Feather name="lock" size={12} color="#334155" />
                <Text className="font-outfit-medium text-xs text-slate-700 ml-1.5">Past sessions (locked)</Text>
              </View>
              <Text className="font-outfit text-[13px] text-slate-500">{result.frozen} taught</Text>
            </View>
            {hiddenLocked > 0 && <Text className="font-outfit text-xs text-slate-400 mb-2">+ {hiddenLocked} earlier sessions</Text>}
            {recentLocked.map((session) => (
              <View key={session.id} className="flex-row items-center border border-dashed border-slate-300 rounded-xl px-3 py-2.5 mb-2">
                <Feather name="check-circle" size={18} color="#94A3B8" />
                <View className="flex-1 ml-3">
                  <Text className="font-outfit-medium text-sm text-slate-700">{sessionTitle(session)}</Text>
                  <Text className="font-outfit text-xs text-slate-500">{short(session.date)} · Completed</Text>
                </View>
                <Feather name="lock" size={16} color="#94A3B8" />
              </View>
            ))}
          </View>
        )}

        {result.deficit > 0 && (
          <Pressable
            onPress={onOpenDeficit}
            className="flex-row items-center bg-rose-100 border border-rose-200 rounded-3xl px-4 py-3.5 mb-6 active:opacity-80"
          >
            <Feather name="alert-triangle" size={16} color="#BE123C" />
            <View className="flex-1 ml-3">
              <Text className="font-outfit-semibold text-sm text-rose-800">
                {plural(result.deficit, "class", "classes")} short — {result.overflow.map((t) => t.title).join(", ")} no longer fit
              </Text>
              <Text className="font-outfit text-xs text-rose-700 mt-0.5">See ways to catch up</Text>
            </View>
            <Feather name="chevron-right" size={18} color="#BE123C" />
          </Pressable>
        )}

        <View className="flex-row items-center justify-between mb-3">
          <Text className="font-outfit-bold text-xl text-black">Schedule shifts</Text>
          <View className="bg-[#DFE6FB] rounded-full px-3 py-1">
            <Text className="font-outfit-semibold text-[13px] text-black">{plural(changeCount, "change")}</Text>
          </View>
        </View>

        {changeCount === 0 && (
          <View className="bg-white rounded-[28px] p-5 items-center mb-3">
            <Text className="font-outfit-medium text-slate-500">Nothing had to move.</Text>
          </View>
        )}

        {result.changes.map((change, index) => (
          <ChangeCard key={`${change.topic_id}-${change.kind}-${change.from ?? ""}-${change.to ?? ""}-${index}`} change={change} />
        ))}

        {/* Reasons come from the server as ready-made sentences — show them exactly. */}
        {result.assessments_moved.map((move) => (
          <View key={move.assessment_id} className="flex-row bg-[#3EB6AA] rounded-[28px] p-5 mb-3">
            <View className="w-12 h-12 rounded-full bg-white items-center justify-center mr-4">
              <Feather name="bell" size={20} color="#0F172A" />
            </View>
            <View className="flex-1">
              <Text className="font-outfit-bold text-lg text-black mb-1">Assessment rescheduled</Text>
              <Text className="font-outfit text-sm leading-5 text-slate-900">{move.reason}</Text>
            </View>
          </View>
        ))}

        <View className="mt-3">
          <PrimaryButton label="Done" icon="check" disabled={busy} onPress={onAccept} />
        </View>
        {onUndo && (
          <Pressable onPress={onUndo} disabled={busy} className="items-center py-4">
            <Text className="font-outfit-semibold text-[15px] text-slate-500">{busy ? "Undoing..." : "Undo cancellation"}</Text>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}

const CHANGE_TEXT: Record<SessionChange["kind"], { label: string; icon: keyof typeof Feather.glyphMap; note: string }> = {
  moved: { label: "Moved", icon: "repeat", note: "Pushed to the next free class day." },
  added: { label: "Scheduled", icon: "plus", note: "Given a new class so it is still taught." },
  removed: { label: "No longer fits", icon: "minus", note: "There is no class day left for this part." },
};

function ChangeCard({ change }: { change: SessionChange }) {
  const text = CHANGE_TEXT[change.kind];

  return (
    <View className="bg-white rounded-[28px] p-5 mb-3">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 mr-3">
          <Text className="font-outfit-medium text-xs tracking-wider text-slate-500 uppercase mb-1">{text.label}</Text>
          <Text className="font-outfit-bold text-xl text-black mb-3">{change.topic}</Text>
        </View>
        <View className="w-10 h-10 rounded-full bg-[#DFE6FB] items-center justify-center">
          <Feather name={text.icon} size={16} color="#0F172A" />
        </View>
      </View>

      <View className="flex-row items-center self-start bg-slate-100 rounded-full px-4 py-2">
        {change.from && (
          <Text className={`font-outfit text-sm text-slate-600 ${change.kind === "removed" ? "line-through" : ""}`}>
            {short(change.from)}
          </Text>
        )}
        {change.from && change.to && <Feather name="arrow-right" size={14} color="#0F172A" style={{ marginHorizontal: 8 }} />}
        {change.to && <Text className="font-outfit-semibold text-sm text-black">{short(change.to)}</Text>}
      </View>

      <View className="flex-row items-start border-t border-slate-100 mt-4 pt-3">
        <Feather name="info" size={14} color="#64748B" style={{ marginTop: 2 }} />
        <Text className="font-outfit text-[13px] text-slate-600 ml-2 flex-1">{text.note}</Text>
      </View>
    </View>
  );
}
