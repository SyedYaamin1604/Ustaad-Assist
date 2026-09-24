import React from "react";
import { Text, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";

const Signout = () => {
    const router = useRouter();

    const handleDashboard = () => {
        router.replace("/dashboard");
    };

    return (
        <ScrollView
            className="flex-1 bg-white"
            contentContainerClassName="flex-grow items-center justify-center py-10 min-h-[100vh]"
        >
            <Text className="text-2xl font-outfit-bold text-black mb-6">
                Signout Screen is working!
            </Text>

            <Pressable
                onPress={handleDashboard}
                className="bg-black px-6 py-3 rounded-lg"
            >
                <Text className="text-white font-outfit-semibold">Go to Dashboard</Text>
            </Pressable>
        </ScrollView>
    );
};

export default Signout;