import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import type { Course } from "@/api/types";
import { formatShortDate, parseISODate, relativeDayLabel } from "@/utils/date";
import { partLabel, sessionTitle, type PlanSession } from "@/utils/plan";

interface SelectedSessionCardProps {
  date: string;
  session?: PlanSession;
  lectureNo: number;
  course: Course;
  isHoliday: boolean;
  onOpen: () => void;
}

export function SelectedSessionCard({ date, session, lectureNo, course, isHoliday, onOpen }: SelectedSessionCardProps) {
  const day = parseISODate(date);
  const dayLabel = formatShortDate(day).toUpperCase();

  if (!session) {
    return (
      <View className="bg-white rounded-[32px] p-5 items-center">
        <View className="w-12 h-12 rounded-full bg-slate-100 items-center justify-center mb-3">
          <Feather name={isHoliday ? "sun" : "coffee"} size={20} color="#64748B" />
        </View>
        <Text className="font-outfit-semibold text-base text-black">
          {isHoliday ? `${formatShortDate(day)} is a holiday` : `No class on ${formatShortDate(day)}`}
        </Text>
        <Text className="font-outfit text-[13px] text-slate-500 mt-1">Tap a highlighted day to see its class.</Text>
      </View>
    );
  }

  const isCancelled = session.status === "cancelled";
  const part = partLabel(session);
  const title =
    session.kind === "regular"
      ? `Lecture ${lectureNo}: ${sessionTitle(session)}${session.part_no && part ? ` (Part ${session.part_no})` : ""}`
      : sessionTitle(session);

  return (
    <View className={`rounded-[32px] p-5 ${isCancelled ? "bg-slate-200" : "bg-[#3EB6AA]"}`}>
      <View className="flex-row items-center justify-between mb-4">
        <View className="bg-black rounded-full px-3.5 py-1.5">
          <Text className="font-outfit-medium text-xs tracking-wider text-white">SELECTED: {dayLabel}</Text>
        </View>
        <View className="bg-white/80 rounded-full px-3 py-1">
          <Text className="font-outfit-semibold text-xs text-black">
            {isCancelled ? "Cancelled" : session.status === "conducted" ? "Conducted" : relativeDayLabel(day)}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center mb-4">
        <View className="w-14 h-14 rounded-full bg-white items-center justify-center mr-4">
          <Feather name="book-open" size={22} color="#0F172A" />
        </View>
        <View className="flex-1">
          <Text className={`font-outfit-bold text-lg text-black ${isCancelled ? "line-through" : ""}`}>{title}</Text>
          <View className="flex-row items-center mt-1">
            <Feather name="calendar" size={13} color="#1E293B" />
            <Text className="font-outfit text-[13px] text-slate-800 ml-1.5">
              {[course.code ?? course.name, `Week ${session.week_no}`].join(" · ")}
            </Text>
          </View>
        </View>
      </View>

      <View className={`rounded-3xl px-4 py-3 mb-4 gap-2 ${isCancelled ? "bg-white/60" : "bg-[#C5E9E5]"}`}>
        {isCancelled ? (
          <PanelRow icon="x-circle" text={session.cancel_reason ?? "Cancelled"} />
        ) : (
          <>
            <PanelRow
              icon={session.status === "conducted" ? "check-circle" : "circle"}
              text={session.status === "conducted" ? "Taught and recorded" : part ?? "Single class"}
            />
            {session.assessment_title && <PanelRow icon="flag" text={`${session.assessment_title} scheduled`} />}
          </>
        )}
      </View>

      <Pressable onPress={onOpen} className="flex-row items-center justify-center bg-white rounded-full py-4 active:opacity-80">
        <Text className="font-outfit-semibold text-[15px] text-black mr-2">Open session details</Text>
        <Feather name="arrow-right" size={16} color="#0F172A" />
      </Pressable>
    </View>
  );
}

function PanelRow({ icon, text }: { icon: keyof typeof Feather.glyphMap; text: string }) {
  return (
    <View className="flex-row items-center">
      <Feather name={icon} size={16} color="#0F172A" />
      <Text className="font-outfit text-sm text-black ml-2.5 flex-1">{text}</Text>
    </View>
  );
}
