import React from 'react';
import { Text, View } from 'react-native';

import type { StudentRecord } from '@/api/types';
import { COMPONENT_LABEL } from '@/utils/format';

type MarkRow = StudentRecord['marks'][number];

/** One assessment and this student's mark. A mark never entered shows as pending, not zero. */
export default function AssessmentItem({ mark }: { mark: MarkRow }) {
  const isQuiz = mark.type === 'quiz';
  const score = mark.is_absent ? 'Absent' : mark.obtained === null ? 'Pending' : `${mark.obtained} / ${mark.total_marks}`;

  return (
    <View className="mb-3 flex-row items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
      <View className="flex-row items-center flex-1 mr-2">
        <View className={`rounded-md px-2 py-1 ${isQuiz ? 'bg-amber-100' : 'bg-indigo-100'}`}>
          <Text className={`text-[11px] font-outfit-bold ${isQuiz ? 'text-amber-700' : 'text-indigo-600'}`}>
            {COMPONENT_LABEL[mark.type]}
          </Text>
        </View>
        <Text className="ml-3 text-[15px] font-outfit-medium text-gray-800 flex-1" numberOfLines={1}>
          {mark.title}
        </Text>
      </View>
      <Text className={`text-[15px] font-outfit-bold ${mark.obtained === null && !mark.is_absent ? 'text-gray-400' : 'text-gray-900'}`}>
        {score}
      </Text>
    </View>
  );
}
