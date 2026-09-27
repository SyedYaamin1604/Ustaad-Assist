import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import CloneCourseScreen from "../../components/dashboard/CloneCourseScreen";
import { CloneCourseFormData } from "../../types/create-course";

const CloneCourse = () => {
  const router = useRouter();

  const submitClone = (cloneData: CloneCourseFormData) => {
    console.log("COURSE CLONED:", { kind: "clone", ...cloneData });
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <CloneCourseScreen onBack={() => router.back()} onComplete={submitClone} />
    </SafeAreaView>
  );
}

export default CloneCourse;
