import { useRouter } from "expo-router";
import CourseCreationFlow from "../../components/dashboard/CourseCreationFlow";

const NewCourse = () => {
  const router = useRouter();

  return (
    <CourseCreationFlow
      visible
      onClose={() => router.back()}
    />
  );
}

export default NewCourse;