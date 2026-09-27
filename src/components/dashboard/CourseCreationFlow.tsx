/**
 * New course, start to finish.
 *
 *   choose   ── new or clone?
 *   details  ── POST /courses          (PATCH if the teacher comes back to edit)
 *   topics   ── POST /courses/:id/topics   one textarea, one topic per line
 *   holidays ── POST /courses/:id/holidays  only the ticks that changed
 *               POST /courses/:id/plan/generate
 *   done     ── the generated plan
 *
 * The backend needs the course to exist before topics and holidays can be
 * attached, which is why the course is created at the end of step 1. If the
 * teacher closes the flow part-way, the course stays and shows "Plan not
 * generated" on the course list.
 */

import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Modal, View } from "react-native";

import {
  coursesApi,
  planApi,
  type CourseDetail,
  type PlanGenerateResult,
  type Topic,
} from "@/api";
import { PlanGeneratedScreen } from "@/components/plan/PlanGeneratedScreen";
import { useAction } from "@/hooks/useAction";
import { pickDocument, takePhoto } from "@/lib/pickers";
import { buildStoragePath, uploadFile } from "@/lib/storage";
import { useAuth } from "@/providers/AuthProvider";
import { useCourse } from "@/providers/CourseProvider";
import { validateCourseDetails, type CourseDetailsForm } from "@/types/create-course";
import { addDays, toISODate, today } from "@/utils/date";
import { showError } from "@/utils/errors";
import CourseDetailsScreen from "./CourseDetailsScreen";
import CreateCourseModal from "./CreateCourseModal";
import HolidaysScreen from "./HolidaysScreen";
import TopicsScreen from "./TopicsScreens";

type Stage = "choose" | "details" | "topics" | "holidays" | "done";

const SEMESTER_WEEKS = 16;

function initialDetails(): CourseDetailsForm {
  const start = today();
  return {
    name: "",
    code: "",
    semester: "",
    startDate: toISODate(start),
    endDate: toISODate(addDays(start, SEMESTER_WEEKS * 7)),
    classDays: [],
  };
}

interface CourseCreationFlowProps {
  onClose: () => void;
}

const CourseCreationFlow = ({ onClose }: CourseCreationFlowProps) => {
  const router = useRouter();
  const { selectCourse } = useCourse();
  const { session } = useAuth();
  const { busy, run } = useAction();

  const [stage, setStage] = useState<Stage>("choose");
  const [details, setDetails] = useState<CourseDetailsForm>(initialDetails);
  const [topicsText, setTopicsText] = useState("");
  const [importing, setImporting] = useState(false);
  // Class counts the outline stated ("Week 3-4" = 4 classes), by lower-cased title.
  const [outlineLengths, setOutlineLengths] = useState<Record<string, number>>({});

  // Filled in as the flow reaches the backend.
  const [courseId, setCourseId] = useState<string | null>(null);
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [holidayTicks, setHolidayTicks] = useState<Record<string, boolean>>({});
  const [plan, setPlan] = useState<PlanGenerateResult | null>(null);

  // ---- step 1
  const submitDetails = async () => {
    const problem = validateCourseDetails(details);
    if (problem) {
      Alert.alert("Check the details", problem);
      return;
    }

    const input = {
      name: details.name.trim(),
      code: details.code.trim() || null,
      semester: details.semester.trim() || null,
      start_date: details.startDate,
      end_date: details.endDate,
      class_days: details.classDays,
    };

    const saved = await run(
      () => (courseId ? coursesApi.update(courseId, input) : coursesApi.create(input)),
      "Couldn't save the course",
    );
    if (!saved) return;

    setCourseId(saved.id);
    setStage("topics");
  };

  // ---- step 2
  const submitTopics = async () => {
    if (!courseId) return;

    const loaded = await run(async () => {
      let savedTopics = await coursesApi.setTopics(courseId, topicsText);

      // Topics only take titles; apply the lengths the outline stated, so the
      // planner starts with real numbers instead of 1 class each. A topic the
      // teacher renamed in the textarea simply keeps the default.
      const lengthened = savedTopics.filter((t) => (outlineLengths[t.title.trim().toLowerCase()] ?? 1) > 1);
      if (lengthened.length > 0) {
        const updated = await Promise.all(
          lengthened.map((t) =>
            coursesApi.updateTopic(t.id, { sessions_needed: outlineLengths[t.title.trim().toLowerCase()] }),
          ),
        );
        const byId = new Map(updated.map((t) => [t.id, t]));
        savedTopics = savedTopics.map((t) => byId.get(t.id) ?? t);
      }

      // Re-read the course: it carries the holidays the server preloaded, with
      // their dates already formatted.
      const detail = await coursesApi.get(courseId);
      return { savedTopics, detail };
    }, "Couldn't save the topics");
    if (!loaded) return;

    setTopics(loaded.savedTopics);
    setCourse(loaded.detail);
    setHolidayTicks(Object.fromEntries(loaded.detail.holidays.map((h) => [h.id, h.is_active])));
    setStage("holidays");
  };

  const readOutline = async (source: "camera" | "file") => {
    if (!courseId) return;
    setImporting(true);
    try {
      const file = source === "camera" ? await takePhoto() : await pickDocument(["application/pdf", "image/*"]);
      if (!file) return;

      const path = await uploadFile(file, buildStoragePath(session!.user.id, courseId, "outlines", file.name));
      const extracted = await coursesApi.importOutline(courseId, path);

      // The textarea is the review screen: the teacher corrects it before continuing.
      setTopicsText(extracted.rows.map((row) => row.title).join("\n"));
      setOutlineLengths(
        Object.fromEntries(
          extracted.rows
            .filter((row) => row.sessions_needed !== null)
            .map((row) => [row.title.trim().toLowerCase(), row.sessions_needed as number]),
        ),
      );
      const unsure = extracted.rows.filter((row) => row.confidence < 0.8).length;
      Alert.alert(
        "Check the topics",
        `We read ${extracted.rows.length} topics from the outline.${unsure > 0 ? " It was a photo, so read them through carefully." : ""} Fix anything that is wrong, then continue.`,
      );
    } catch (error) {
      showError(error, "Couldn't read the outline");
    } finally {
      setImporting(false);
    }
  };

  const importOutline = () =>
    Alert.alert("Import course outline", "Photograph the printed outline, or choose the PDF.", [
      { text: "Take a photo", onPress: () => readOutline("camera") },
      { text: "Choose a PDF or image", onPress: () => readOutline("file") },
      { text: "Cancel", style: "cancel" },
    ]);

  // ---- step 3
  const generatePlan = async () => {
    if (!courseId || !course) return;

    const changed = course.holidays
      .filter((h) => holidayTicks[h.id] !== h.is_active)
      .map((h) => ({ id: h.id, is_active: holidayTicks[h.id] }));

    const result = await run(async () => {
      if (changed.length > 0) await coursesApi.setHolidays(courseId, changed);
      return planApi.generate(courseId);
    }, "Couldn't generate the plan");
    if (!result) return;

    selectCourse(courseId);
    setPlan(result);
    setStage("done");
  };

  // The chooser is its own transparent bottom-sheet Modal; nesting it inside the
  // full-screen Modal below renders a blank white screen, so show it on its own.
  if (stage === "choose") {
    return (
      <CreateCourseModal
        visible
        onClose={onClose}
        onSelectNew={() => setStage("details")}
        onSelectClone={() => router.replace("/course/clone")}
      />
    );
  }

  return (
    <Modal visible animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-slate-50">
        {stage === "details" && (
          <CourseDetailsScreen value={details} onChange={setDetails} onBack={onClose} onContinue={submitDetails} busy={busy} />
        )}

        {stage === "topics" && (
          <TopicsScreen
            value={topicsText}
            onChange={setTopicsText}
            onBack={() => setStage("details")}
            onContinue={submitTopics}
            onImportOutline={importOutline}
            busy={busy}
            importing={importing}
          />
        )}

        {stage === "holidays" && course && (
          <HolidaysScreen
            holidays={course.holidays}
            classDays={course.class_days}
            active={holidayTicks}
            onToggle={(id) => setHolidayTicks((prev) => ({ ...prev, [id]: !prev[id] }))}
            onBack={() => setStage("topics")}
            onGenerate={generatePlan}
            busy={busy}
          />
        )}

        {stage === "done" && course && plan && (
          <PlanGeneratedScreen
            course={course}
            topics={topics}
            result={plan}
            onAddStudents={() => router.replace("/students")}
            onOpenDashboard={() => router.replace("/home")}
          />
        )}
      </View>
    </Modal>
  );
};

export default CourseCreationFlow;
