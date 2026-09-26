import { PlanSession } from "@/types/plan";
import { parseISODate, shortMonth, shortWeekday } from "@/utils/date";
import { partLabel, sessionTitle } from "@/utils/plan";
import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

interface SessionCardProps {
  session: PlanSession;
  classSize: number;
  highlighted?: boolean;
  onPress: () => void;
}

export function SessionCard({ session, classSize, highlighted = false, onPress }: SessionCardProps) {
  const isCancelled = session.status === "cancelled";
  const isConducted = session.status === "conducted";
  const part = partLabel(session);

  const container = highlighted
    ? "bg-white border-2 border-black"
    : isCancelled
      ? "border border-dashed border-slate-300"
      : isConducted
        ? "bg-slate-100 border border-slate-200"
        : "bg-white border border-slate-100";

  return (
    <Pressable onPress={onPress} className={`flex-row rounded-[28px] p-4 mb-3 active:opacity-80 ${container}`}>
      <DateBadge date={session.date} highlighted={highlighted} muted={isCancelled || isConducted} />

      <View className="flex-1 ml-3">
        <View className="flex-row items-center justify-between mb-1.5">
          {isCancelled ? (
            <Pill label="Cancelled" className="bg-rose-100" textClassName="text-rose-700" />
          ) : isConducted ? (
            <View className="flex-row items-center">
              <Feather name="lock" size={13} color="#64748B" />
              <Text className="font-outfit-medium text-xs text-slate-500 ml-1">Session recorded</Text>
            </View>
          ) : session.kind !== "regular" ? (
            <Pill label={session.kind === "revision" ? "Revision" : "Makeup class"} className="bg-[#CBABF7]" />
          ) : part ? (
            <Pill label={part} className="bg-slate-100" />
          ) : (
            <View />
          )}
          <StatusLabel session={session} highlighted={highlighted} />
        </View>

        <Text
          className={`font-outfit-bold text-lg ${
            isCancelled || isConducted ? "text-slate-500 line-through" : "text-black"
          }`}
        >
          {sessionTitle(session)}
        </Text>
        {(isCancelled ? session.cancel_reason : session.description) && (
          <Text className="font-outfit text-[13px] text-slate-500 mt-0.5">
            {isCancelled ? session.cancel_reason : session.description}
          </Text>
        )}

        {!isCancelled && (
          <View className="flex-row items-center justify-between border-t border-slate-200/70 mt-3 pt-3">
            {isConducted ? (
              <>
                <Text className="font-outfit text-xs text-slate-500">
                  {session.attended != null
                    ? `${session.attended} / ${classSize} students attended`
                    : "Attendance not recorded"}
                </Text>
                <Text className="font-outfit-medium text-xs text-slate-600">View details</Text>
              </>
            ) : (
              <>
                <View className="flex-row flex-wrap gap-2 flex-1">
                  {!!session.slides_count && (
                    <Chip icon="paperclip" label={`${session.slides_count} slides attached`} className="bg-slate-100" />
                  )}
                  {session.assessment_title && (
                    <Chip icon="flag" label={`${session.assessment_title} scheduled`} className="bg-[#F8DB77]" />
                  )}
                </View>
                <View
                  className={`w-9 h-9 rounded-full items-center justify-center ${highlighted ? "bg-black" : "bg-slate-100"}`}
                >
                  <Feather
                    name={highlighted ? "arrow-up-right" : "chevron-right"}
                    size={16}
                    color={highlighted ? "#fff" : "#0F172A"}
                  />
                </View>
              </>
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
}

function DateBadge({ date, highlighted, muted }: { date: string; highlighted: boolean; muted: boolean }) {
  const d = parseISODate(date);
  const circle = highlighted ? "bg-black" : muted ? "bg-slate-200" : "bg-white border-2 border-slate-200";
  const text = highlighted ? "text-white" : muted ? "text-slate-500" : "text-slate-800";

  return (
    <View className={`w-16 h-16 rounded-full items-center justify-center ${circle}`}>
      <Text className={`font-outfit-semibold text-[11px] uppercase ${text}`}>{shortWeekday(d)}</Text>
      <Text className={`font-outfit-bold text-xl leading-6 ${text}`}>{d.getDate()}</Text>
      <Text className={`font-outfit text-[9px] uppercase ${text}`}>{shortMonth(d)}</Text>
    </View>
  );
}

function StatusLabel({ session, highlighted }: { session: PlanSession; highlighted: boolean }) {
  if (session.status === "cancelled") {
    return <Feather name="x-circle" size={16} color="#64748B" />;
  }
  if (session.status === "conducted") {
    return (
      <View className="flex-row items-center bg-white rounded-full px-2.5 py-1">
        <Feather name="check-circle" size={12} color="#0F172A" />
        <Text className="font-outfit-medium text-xs text-slate-800 ml-1">Conducted</Text>
      </View>
    );
  }
  return (
    <View className="flex-row items-center bg-slate-100 rounded-full px-2.5 py-1">
      <View className={`w-2 h-2 rounded-full mr-1.5 ${highlighted ? "bg-emerald-500" : "bg-blue-500"}`} />
      <Text className="font-outfit-medium text-xs text-slate-800">{highlighted ? "Next class" : "Upcoming"}</Text>
    </View>
  );
}

function Pill({ label, className, textClassName = "text-slate-800" }: { label: string; className: string; textClassName?: string }) {
  return (
    <View className={`rounded-full px-2.5 py-1 ${className}`}>
      <Text className={`font-outfit-medium text-xs ${textClassName}`}>{label}</Text>
    </View>
  );
}

function Chip({ icon, label, className }: { icon: keyof typeof Feather.glyphMap; label: string; className: string }) {
  return (
    <View className={`flex-row items-center rounded-full px-3 py-1.5 ${className}`}>
      <Feather name={icon} size={12} color="#0F172A" />
      <Text className="font-outfit-medium text-xs text-black ml-1.5">{label}</Text>
    </View>
  );
}
