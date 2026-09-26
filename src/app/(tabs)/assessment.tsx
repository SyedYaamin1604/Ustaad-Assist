import { useState } from "react";
import { Alert } from "react-native";
import { AssessmentListScreen } from "@/components/assessment/AssessmentListScreen";
import { CreateAssessmentModal } from "@/components/assessment/CreateAssessmentModal";
import { EnterMarksScreen } from "@/components/assessment/EnterMarksScreen";
import { ResultsGradesScreen } from "@/components/assessment/ResultsGradesScreen";
import { AssessmentDraft, AssessmentItem, MOCK_ASSESSMENTS } from "@/types/assessment";
import { formatDateTime } from "@/utils/date";

type AssessmentView = "list" | "enter-marks" | "results";

const Assessment = () => {
  const [view, setView] = useState<AssessmentView>("list");
  const [assessments, setAssessments] = useState<AssessmentItem[]>(MOCK_ASSESSMENTS);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AssessmentItem | null>(null);

  const openCreate = () => {
    setEditingItem(null);
    setCreateOpen(true);
  };

  const openEdit = (id: string) => {
    const item = assessments.find((a) => a.id === id);
    if (!item) return;
    setEditingItem(item);
    setCreateOpen(true);
  };

  const handleSubmit = (draft: AssessmentDraft) => {
    setCreateOpen(false);

    if (draft.id) {
      // Editing an existing assessment
      setAssessments((prev) =>
        prev.map((item) =>
          item.id === draft.id
            ? {
                ...item,
                type: draft.type,
                title: draft.title,
                marksLabel: `${draft.marks} marks`,
                topics: draft.topics,
                dateLabel:
                  item.status === "draft" ? `Scheduled ${formatDateTime(draft.scheduledDate)}` : formatDateTime(draft.scheduledDate),
              }
            : item
        )
      );
      setEditingItem(null);
      Alert.alert("Saved", "Assessment updated.");
      return;
    }

    // Creating a new assessment
    const newItem: AssessmentItem = {
      id: `assessment-${Date.now()}`,
      type: draft.type,
      title: draft.title,
      status: "scheduled",
      statusLabel: "Scheduled",
      dateLabel: formatDateTime(draft.scheduledDate),
      marksLabel: `${draft.marks} marks`,
      topics: draft.topics,
      color: draft.type === "Assignment" ? "blue" : "yellow",
    };
    setAssessments((prev) => [newItem, ...prev]);
    setView("enter-marks");
  };

  if (view === "enter-marks") {
    return <EnterMarksScreen onBack={() => setView("list")} onDone={() => setView("results")} />;
  }

  if (view === "results") {
    return <ResultsGradesScreen onBack={() => setView("list")} />;
  }

  return (
    <>
      <AssessmentListScreen
        assessments={assessments}
        onOpenCreate={openCreate}
        onOpenAssessment={(id) => setView(id === "quiz-1" ? "results" : "enter-marks")}
        onEditAssessment={openEdit}
      />
      <CreateAssessmentModal
        visible={isCreateOpen}
        editingItem={editingItem}
        onClose={() => {
          setCreateOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default Assessment;
