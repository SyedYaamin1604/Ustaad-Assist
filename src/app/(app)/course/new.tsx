import { useRouter } from "expo-router";

import CourseCreationFlow from "@/components/dashboard/CourseCreationFlow";

export default function NewCourse() {
  const router = useRouter();
  return <CourseCreationFlow onClose={() => router.back()} />;
}
