import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { CourseSummary, PlanSession } from "@/types/plan";
import { formatShortDate, parseISODate } from "@/utils/date";
import { sessionTitle } from "@/utils/plan";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, Modal, Pressable, ScrollView, Text, TextInput, View } from "react-native";

interface SessionSheetProps {
  session: PlanSession | null;
  lectureNo: number;
  course: CourseSummary;
  onClose: () => void;
  onMarkConducted: () => void;
  onUndoConducted: () => void;
  onCancel: (reason: string) => void;
}

const REASON_PRESETS = ["Public holiday", "Campus closed", "I was unavailable", "Exam duty"];

// Parent should pass key={session.id} so the sheet resets for each session.
export function SessionSheet({
  session,
  lectureNo,
  course,
  onClose,
  onMarkConducted,
  onUndoConducted,
  onCancel,
}: SessionSheetProps) {
  const [mode, setMode] = useState<"actions" | "cancel">("actions");
  const [reason, setReason] = useState("");
  const [showUndo, setShowUndo] = useState(false);

  if (!session) return null;

  const date = parseISODate(session.date);
  const isScheduled = session.status === "scheduled";
  const title = `${sessionTitle(session)}${session.part_no ? ` (Part ${session.part_no})` : ""}`;

  const markConducted = () => {
    onMarkConducted();
    setShowUndo(true);
  };

  const undo = () => {
    onUndoConducted();
    setShowUndo(false);
  };

  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40">
        <Pressable className="absolute inset-0" onPress={onClose} />

        <View className="bg-white rounded-t-[32px] px-5 pt-3 pb-8 max-h-[92%]">
          <View className="w-10 h-1 rounded-full bg-slate-200 self-center mb-3" />
          <View className="flex-row items-start justify-between">
            <View className="flex-row items-center bg-[#DFE6FB] rounded-full px-3 py-1.5 mb-3">
              <View className="w-1.5 h-1.5 rounded-full bg-black mr-2" />
              <Text className="font-outfit-medium text-xs tracking-wider text-black">
                {session.kind === "regular" ? `LECTURE ${lectureNo} · ` : ""}
                {formatShortDate(date).toUpperCase()}
              </Text>
            </View>
            <Pressable onPress={onClose} className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center">
              <Feather name="x" size={18} color="#0F172A" />
            </Pressable>
          </View>

          <Text className="font-outfit-bold text-[28px] leading-8 text-black">{title}</Text>
          <Text className="font-outfit text-sm text-slate-500 mt-1 mb-5">
            {course.name} {course.code} · {course.timeLabel}
          </Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {mode === "cancel" ? (
              <View>
                <Text className="font-outfit-medium text-[13px] text-slate-500 mb-2">Why is this class cancelled?</Text>
                <View className="flex-row flex-wrap gap-2 mb-3">
                  {REASON_PRESETS.map((preset) => (
                    <Pressable
                      key={preset}
                      onPress={() => setReason(preset)}
                      className={`px-4 py-2.5 rounded-full border ${
                        reason === preset ? "bg-black border-black" : "bg-white border-slate-200"
                      }`}
                    >
                      <Text
                        className={`font-outfit-medium text-[13px] ${reason === preset ? "text-white" : "text-slate-600"}`}
                      >
                        {preset}
                      </Text>
                    </Pressable>
                  ))}
                </View>
                <TextInput
                  value={reason}
                  onChangeText={setReason}
                  placeholder="Or type a reason"
                  placeholderTextColor="#94A3B8"
                  className="bg-slate-100 rounded-2xl px-4 py-3.5 font-outfit text-[15px] text-black mb-3"
                />
                <View className="flex-row items-center mb-5">
                  <Feather name="info" size={14} color="#64748B" />
                  <Text className="font-outfit text-xs text-slate-500 ml-2 flex-1">
                    Cancelling rebuilds the rest of the plan. You will see everything that moved.
                  </Text>
                </View>
                <PrimaryButton
                  label="Cancel class and replan"
                  disabled={reason.trim().length === 0}
                  onPress={() => onCancel(reason.trim())}
                />
                <Pressable onPress={() => setMode("actions")} className="items-center py-4">
                  <Text className="font-outfit-semibold text-[15px] text-slate-500">Keep this class</Text>
                </Pressable>
              </View>
            ) : (
              <View className="gap-3">
                {session.status === "cancelled" && (
                  <View className="flex-row items-center bg-rose-50 border border-rose-100 rounded-2xl px-4 py-3">
                    <Feather name="x-circle" size={16} color="#BE123C" />
                    <Text className="font-outfit text-sm text-rose-800 ml-2 flex-1">
                      Cancelled: {session.cancel_reason}
                    </Text>
                  </View>
                )}
                <ActionRow
                  icon="check-circle"
                  title={session.status === "conducted" ? "Conducted" : "Mark conducted"}
                  subtitle="Record attendance & log topics covered"
                  done={session.status === "conducted"}
                  disabled={!isScheduled}
                  onPress={markConducted}
                />
                <ActionRow
                  icon="calendar"
                  title="Mark cancelled"
                  subtitle="Notify students & flag for rescheduling"
                  disabled={!isScheduled}
                  onPress={() => setMode("cancel")}
                />
                <ActionRow
                  icon="clock"
                  title="Needs extra class"
                  subtitle="Queue makeup session into semester calendar"
                  onPress={() => Alert.alert("Extra class", "Makeup classes will be queued here once the planner API is connected.")}
                />
                <ActionRow
                  icon="upload"
                  title="Attach material"
                  subtitle="Upload slides, code snippets, or notes"
                  onPress={() => Alert.alert("Attach material", "Uploading material will be available from the Material tab.")}
                />
              </View>
            )}
          </ScrollView>

          {showUndo && session.status === "conducted" && (
            <View className="flex-row items-center justify-between bg-black rounded-full px-4 py-3.5 mt-5">
              <View className="flex-row items-center">
                <View className="w-7 h-7 rounded-full bg-white items-center justify-center mr-3">
                  <Feather name="check" size={14} color="#0F172A" />
                </View>
                <Text className="font-outfit-semibold text-[15px] text-white">Marked conducted</Text>
              </View>
              <Pressable onPress={undo} hitSlop={8}>
                <Text className="font-outfit-semibold text-[15px] text-white underline">Undo</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

interface ActionRowProps {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  subtitle: string;
  done?: boolean;
  disabled?: boolean;
  onPress: () => void;
}

function ActionRow({ icon, title, subtitle, done = false, disabled = false, onPress }: ActionRowProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`flex-row items-center bg-slate-50 border border-slate-100 rounded-3xl p-4 active:opacity-80 ${
        disabled && !done ? "opacity-50" : ""
      }`}
    >
      <View
        className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${done ? "bg-[#3EB6AA]" : "bg-white"}`}
      >
        <Feather name={icon} size={20} color="#0F172A" />
      </View>
      <View className="flex-1">
        <Text className="font-outfit-semibold text-base text-black">{title}</Text>
        <Text className="font-outfit text-[13px] text-slate-500 mt-0.5">{subtitle}</Text>
      </View>
      {!disabled && <Feather name="chevron-right" size={18} color="#0F172A" />}
    </Pressable>
  );
}
