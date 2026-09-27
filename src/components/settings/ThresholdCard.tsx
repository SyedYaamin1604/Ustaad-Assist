import React from 'react';
import { Text, View } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';

import ThresholdSlider from './ThresholdSlider';

interface ThresholdCardProps {
  threshold: number;
  onThresholdChange: (value: number) => void;
}

export default function ThresholdCard({ threshold, onThresholdChange }: ThresholdCardProps) {
  return (
    <View className="bg-white rounded-3xl px-5 py-5 mx-5 mt-4">
      <View className="flex-row items-center mb-1.5">
        <AlertTriangle size={16} color="#0F1424" />
        <Text className="text-[16px] font-outfit-bold text-[#0F1424] ml-2">{threshold}% Threshold</Text>
      </View>
      <Text className="font-outfit text-[12px] text-[#8A8F9C] mb-8 leading-[17px]">
        Students falling below this line are flagged for exam ineligibility.
      </Text>

      <ThresholdSlider value={threshold} min={50} max={90} onChange={onThresholdChange} scaleLabels={[50, 65, 75, 90]} />
    </View>
  );
}
