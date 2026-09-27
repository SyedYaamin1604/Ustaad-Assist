import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Calendar, GraduationCap, Pencil } from 'lucide-react-native';

interface CourseOverviewCardProps {
  semesterLabel: string;
  courseTitle: string;
  subtitle: string;
  dateRangeLabel: string;
  durationLabel: string;
  onEditPress?: () => void;
}

export default function CourseOverviewCard({
  semesterLabel,
  courseTitle,
  subtitle,
  dateRangeLabel,
  durationLabel,
  onEditPress,
}: CourseOverviewCardProps) {
  return (
    <View className="bg-white rounded-3xl px-5 py-5 mx-5">
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center bg-[#F4F5FA] rounded-full pl-2.5 pr-3.5 py-1.5">
          <View className="w-6 h-6 rounded-full bg-[#111318] items-center justify-center mr-2">
            <GraduationCap size={13} color="#FFFFFF" />
          </View>
          <Text className="text-[12px] font-outfit-semibold text-[#111318]">{semesterLabel}</Text>
        </View>

        {onEditPress && (
          <Pressable onPress={onEditPress} className="flex-row items-center" hitSlop={8}>
            <Text className="text-[13px] font-outfit-semibold text-[#111318] mr-1">Edit course info</Text>
            <Pencil size={13} color="#111318" />
          </Pressable>
        )}
      </View>

      <Text className="text-[20px] font-outfit-bold text-[#0F1424] mb-1">{courseTitle}</Text>
      <Text className="font-outfit text-[13px] text-[#8A8F9C] mb-4">{subtitle}</Text>

      <View className="flex-row items-center bg-[#F4F5FA] rounded-2xl px-4 py-3">
        <View className="w-9 h-9 rounded-full bg-white items-center justify-center mr-3">
          <Calendar size={16} color="#111318" />
        </View>
        <View>
          <Text className="text-[13px] font-outfit-bold text-[#0F1424]">{dateRangeLabel}</Text>
          <Text className="font-outfit text-[11px] text-[#8A8F9C] mt-0.5">{durationLabel}</Text>
        </View>
      </View>
    </View>
  );
}
