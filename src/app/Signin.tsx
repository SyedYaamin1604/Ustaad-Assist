import { Text, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
// import React from "react";

const Signin = () => {
    const router = useRouter();

    const handleNavigateToSignout = () => {
        router.push("/signout");
    };

    return (
        <ScrollView
            className="flex-1 bg-white"
            contentContainerClassName="flex-grow items-center justify-center py-10 min-h-[100vh]"
        >
            <Text className="text-2xl font-bold text-black mb-6">
                Signin Screen is working!
            </Text>

            <Pressable
                onPress={handleNavigateToSignout}
                className="bg-blue-600 active:bg-blue-700 px-6 py-3 rounded-lg shadow-sm"
            >
                <Text className="text-white font-semibold text-base">
                    Go to Sign Out
                </Text>
            </Pressable>
        </ScrollView>
    );
};

export default Signin;