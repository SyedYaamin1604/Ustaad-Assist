import { useState } from "react";
import { Modal, View } from "react-native";
import CreateCourseModal from "./CreateCourseModal";
import CourseDetailsScreen from "./CourseDetailsScreen";
import TopicsScreen from "./TopicsScreens";
import ImportedSyllabusReviewScreen from "./ImportedSyllabusReviewScreen";
import HolidaysScreen from "./HolidaysScreen";
import CloneCourseScreen from "./CloneCourseScreen";
import { CloneCourseFormData, NewCourseFormData } from "../../types/create-course";

type Stage =
  | "choose"
  | "new-details"
  | "new-topics"
  | "new-import"
  | "new-holidays"
  | "clone";

const emptyNewCourseForm: NewCourseFormData = {
  details: {
    courseName: "Database Systems CS-301",
    semesterTerm: "Fall 2026",
    startDate: "2026-09-01",
    endDate: "2026-12-20",
    classDays: ["T", "F"],
    aiCopilotEnabled: true,
  },
  topics: [
    { id: "1", title: "ER Modeling" },
    { id: "2", title: "Relational Model" },
    { id: "3", title: "Relational Algebra" },
    { id: "4", title: "SQL Basics" },
    { id: "5", title: "SQL Joins" },
    { id: "6", title: "Aggregation" },
    { id: "7", title: "Normalization" },
    { id: "8", title: "Transactions" },
    { id: "9", title: "Indexing" },
  ],
  gradingCriteria: [
    { id: "quizzes", label: "Quizzes", weight: 10 },
    { id: "assignments", label: "Assignments", weight: 10 },
    { id: "midterm", label: "Midterm Exam", weight: 30 },
    { id: "final", label: "Final Exam", weight: 40 },
    { id: "participation", label: "Class Participation", weight: 10 },
  ],
  holidays: [
    { id: "h1", day: "09", month: "NOV", title: "Iqbal Day", note: "Monday · No class conflict", skipClasses: true },
    { id: "h2", day: "25", month: "DEC", title: "Quaid-e-Azam Day", note: "Friday · Affects 1 class session", skipClasses: true },
    { id: "h3", day: "09", month: "OCT", title: "Fall Mid-Term Break", note: "Friday · Affects 1 class session", skipClasses: true },
    { id: "h4", day: "12", month: "OCT", title: "Department Research Day", note: "Optional / Guest lecture", skipClasses: false },
  ],
};

interface CourseCreationFlowProps {
  visible: boolean;
  onClose: () => void;
}

const CourseCreationFlow = ({ visible, onClose }: CourseCreationFlowProps) => {
  const [stage, setStage] = useState<Stage>("choose");
  const [form, setForm] = useState<NewCourseFormData>(emptyNewCourseForm);

  const reset = () => {
    setStage("choose");
    onClose();
  };

  const submitNewCourse = () => {
    console.log("NEW COURSE SUBMITTED:", { kind: "new", ...form });
    reset();
  };

  const submitClone = (cloneData: CloneCourseFormData) => {
    console.log("COURSE CLONED:", { kind: "clone", ...cloneData });
    reset();
  };

  // The chooser is its own transparent bottom-sheet Modal; nesting it inside the
  // full-screen Modal below renders a blank white screen, so show it on its own.
  if (stage === "choose") {
    return (
      <CreateCourseModal
        visible={visible}
        onClose={reset}
        onSelectNew={() => setStage("new-details")}
        onSelectClone={() => setStage("clone")}
      />
    );
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={reset}>
      <View className="flex-1 bg-slate-50">
        {stage === "new-details" && (
          <CourseDetailsScreen
            value={form.details}
            onChange={(details) => setForm((f) => ({ ...f, details }))}
            onBack={reset}
            onContinue={() => setStage("new-topics")}
          />
        )}

        {stage === "new-topics" && (
          <TopicsScreen
            topics={form.topics}
            onChange={(topics) => setForm((f) => ({ ...f, topics }))}
            onBack={() => setStage("new-details")}
            onContinue={() => setStage("new-holidays")}
            onImportOutline={() => setStage("new-import")}
          />
        )}

        {stage === "new-import" && (
          <ImportedSyllabusReviewScreen
            topics={form.topics}
            onChangeTopics={(topics) => setForm((f) => ({ ...f, topics }))}
            onAddTopic={() =>
              setForm((f) => ({
                ...f,
                topics: [...f.topics, { id: `topic-${Date.now()}`, title: "New topic" }],
              }))
            }
            gradingCriteria={form.gradingCriteria}
            onChangeCriterion={(id, delta) =>
              setForm((f) => ({
                ...f,
                gradingCriteria: f.gradingCriteria.map((c) =>
                  c.id === id ? { ...c, weight: Math.max(0, c.weight + delta) } : c
                ),
              }))
            }
            onSave={() => setStage("new-topics")}
          />
        )}

        {stage === "new-holidays" && (
          <HolidaysScreen
            holidays={form.holidays}
            onToggle={(id) =>
              setForm((f) => ({
                ...f,
                holidays: f.holidays.map((h) =>
                  h.id === id ? { ...h, skipClasses: !h.skipClasses } : h
                ),
              }))
            }
            onAddCustom={() =>
              setForm((f) => ({
                ...f,
                holidays: [
                  ...f.holidays,
                  {
                    id: `holiday-${Date.now()}`,
                    day: "01",
                    month: "JAN",
                    title: "New holiday",
                    note: "Custom",
                    skipClasses: true,
                  },
                ],
              }))
            }
            onBack={() => setStage("new-topics")}
            onGenerate={submitNewCourse}
          />
        )}

        {stage === "clone" && (
          <CloneCourseScreen onBack={reset} onComplete={submitClone} />
        )}
      </View>
    </Modal>
  );
}

export default CourseCreationFlow; 