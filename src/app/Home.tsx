import { Text, ScrollView } from "react-native";

export default function Index() {
  return (
    <ScrollView 
      className="flex-1 bg-white"
      contentContainerClassName="flex-grow items-center justify-center py-10 min-h-[100vh]"
    >
      <Text className="text-2xl font-bold text-black">
        NativeWind is working!
      </Text>
    </ScrollView>
  );
}