import React from 'react';
import { View, Text } from 'react-native';
import type { AssessmentMark } from '../../types/students-status';

export default function AssessmentItem({ type, title, score, maxScore }: AssessmentMark) {
  const isQuiz = type === 'Quiz';
  return (
    <View className="mb-3 flex-row items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
      <View className="flex-row items-center">
        <View className={`rounded-md px-2 py-1 ${isQuiz ? 'bg-amber-100' : 'bg-indigo-100'}`}>
          <Text
            className={`text-[11px] font-outfit-bold ${isQuiz ? 'text-amber-700' : 'text-indigo-600'}`}
          >
            {type}
          </Text>
        </View>
        <Text className="ml-3 text-[15px] font-outfit-medium text-gray-800">{title}</Text>
      </View>
      <Text className="text-[15px] font-outfit-bold text-gray-900">
        {score} / {maxScore}
      </Text>
    </View>
  );
}