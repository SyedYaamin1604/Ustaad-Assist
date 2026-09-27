import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, Pressable, ScrollView, Text, TextInput, View } from "react-native";

import type { ComponentType, GradeBand } from "@/api/types";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SegmentedPills } from "@/components/ui/SegmentedPills";
import { COMPONENT_LABEL, COMPONENTS } from "@/utils/format";

interface GradingSettingsSheetProps {
  visible: boolean;
  weightage: Record<string, number>;
  gradeScale: GradeBand[];
  saving: boolean;
  onClose: () => void;
  onSaveWeightage: (weights: Record<ComponentType, number>) => void;
  onSaveGradeScale: (bands: GradeBand[]) => void;
}

const WEIGHT_STEP = 5;
const BAND_STEP = 1;

/** The same rules PUT /grade-scale enforces, checked before sending. */
function gradeScaleProblem(bands: GradeBand[]): string | null {
  if (bands.length === 0) return "Add at least one grade.";
  if (bands.some((b) => b.grade.trim() === "")) return "Every band needs a grade letter.";
  const letters = new Set(bands.map((b) => b.grade.trim().toUpperCase()));
  if (letters.size !== bands.length) return "The same grade letter appears twice.";
  if (Math.min(...bands.map((b) => b.min_percentage)) !== 0) return "The lowest band must start at 0%, so every mark gets a grade.";
  return null;
}

// Parent should remount (key) it each time it opens, so it starts from the saved values.
export function GradingSettingsSheet({
  visible,
  weightage,
  gradeScale,
  saving,
  onClose,
  onSaveWeightage,
  onSaveGradeScale,
}: GradingSettingsSheetProps) {
  const [tab, setTab] = useState<"Weightage" | "Grade scale">("Weightage");
  const [weights, setWeights] = useState<Record<ComponentType, number>>(
    () => Object.fromEntries(COMPONENTS.map((c) => [c, weightage[c] ?? 0])) as Record<ComponentType, number>,
  );
  const [bands, setBands] = useState<GradeBand[]>(gradeScale);

  const total = COMPONENTS.reduce((sum, c) => sum + weights[c], 0);
  const bandProblem = gradeScaleProblem(bands);

  const stepWeight = (c: ComponentType, delta: number) =>
    setWeights((prev) => ({ ...prev, [c]: Math.min(100, Math.max(0, prev[c] + delta)) }));

  const updateBand = (index: number, patch: Partial<GradeBand>) =>
    setBands((prev) => prev.map((b, i) => (i === index ? { ...b, ...patch } : b)));

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40">
        <Pressable className="absolute inset-0" onPress={onClose} />

        <View className="bg-white rounded-t-[28px] px-5 pt-5 pb-8 max-h-[92%]">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="font-outfit-bold text-xl text-black">Grading</Text>
            <Pressable onPress={onClose} className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center">
              <Feather name="x" size={18} color="#0F172A" />
            </Pressable>
          </View>

          <View className="mb-4">
            <SegmentedPills options={["Weightage", "Grade scale"]} value={tab} onChange={(v) => setTab(v as typeof tab)} />
          </View>

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {tab === "Weightage" ? (
              <View className="rounded-2xl bg-violet-100 p-4 mb-5">
                <View className="mb-3 flex-row items-center justify-between">
                  <Text className="font-outfit-semibold text-slate-900">Component weightage</Text>
                  <Text className={`rounded-full bg-white px-3 py-1 text-xs font-outfit-semibold ${total === 100 ? "text-slate-700" : "text-red-600"}`}>
                    Total: {total}%
                  </Text>
                </View>
                {COMPONENTS.map((c) => (
                  <View key={c} className="mb-2 flex-row items-center justify-between rounded-full bg-white/70 px-4 py-2.5">
                    <Text className="text-sm font-outfit-medium text-slate-800">{COMPONENT_LABEL[c]}</Text>
                    <View className="flex-row items-center gap-3">
                      <StepButton label="−" onPress={() => stepWeight(c, -WEIGHT_STEP)} />
                      <Text className="w-10 text-center text-sm font-outfit-semibold text-slate-900">{weights[c]}%</Text>
                      <StepButton label="+" onPress={() => stepWeight(c, WEIGHT_STEP)} />
                    </View>
                  </View>
                ))}
                {total !== 100 && (
                  <Text className="mt-1 font-outfit text-xs text-red-600">The weightage must total exactly 100%.</Text>
                )}
              </View>
            ) : (
              <View className="rounded-2xl bg-slate-50 p-4 mb-5">
                <Text className="font-outfit-semibold text-slate-900 mb-1">Grade bands</Text>
                <Text className="font-outfit text-xs text-slate-500 mb-3">A student gets the highest grade whose minimum they reach.</Text>
                {bands.map((band, index) => (
                  <View key={index} className="mb-2 flex-row items-center rounded-full bg-white px-4 py-2">
                    <TextInput
                      value={band.grade}
                      onChangeText={(grade) => updateBand(index, { grade })}
                      placeholder="A"
                      autoCapitalize="characters"
                      className="w-14 font-outfit-bold text-base text-slate-900"
                    />
                    <Text className="flex-1 font-outfit text-xs text-slate-500">from</Text>
                    <StepButton label="−" onPress={() => updateBand(index, { min_percentage: Math.max(0, band.min_percentage - BAND_STEP) })} />
                    <Text className="w-12 text-center font-outfit-semibold text-sm text-slate-900">{band.min_percentage}%</Text>
                    <StepButton label="+" onPress={() => updateBand(index, { min_percentage: Math.min(100, band.min_percentage + BAND_STEP) })} />
                    <Pressable onPress={() => setBands((prev) => prev.filter((_, i) => i !== index))} hitSlop={8} className="ml-3">
                      <Feather name="trash-2" size={15} color="#94A3B8" />
                    </Pressable>
                  </View>
                ))}
                <Pressable onPress={() => setBands((prev) => [...prev, { grade: "", min_percentage: 0 }])} className="items-center py-2">
                  <Text className="text-sm font-outfit-semibold text-slate-700">+ Add grade</Text>
                </Pressable>
                {bandProblem && <Text className="mt-1 font-outfit text-xs text-red-600">{bandProblem}</Text>}
              </View>
            )}

            {tab === "Weightage" ? (
              <PrimaryButton
                label={saving ? "Saving..." : "Save weightage"}
                icon="check"
                disabled={total !== 100 || saving}
                onPress={() => onSaveWeightage(weights)}
              />
            ) : (
              <PrimaryButton
                label={saving ? "Saving..." : "Save grade scale"}
                icon="check"
                disabled={!!bandProblem || saving}
                onPress={() => onSaveGradeScale(bands.map((b) => ({ ...b, grade: b.grade.trim() })))}
              />
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function StepButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} className="h-7 w-7 items-center justify-center rounded-full bg-slate-100">
      <Text className="font-outfit">{label}</Text>
    </Pressable>
  );
}
