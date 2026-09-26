import React, { useState } from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import Header from "../components/auth/Header";
import Tabs from "../components/auth/Tabs";
import FormInput from "../components/auth/FormInput";
import PasswordInput from "../components/auth/PasswordInput";
import PrimaryButton from "../components/auth/PrimaryButton";
import GoogleButton from "../components/auth/GoogleButton";
import ForgotPassword from "../components/auth/ForgotPassword";

const Signin = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleTabChange = (tab: "signin" | "create") => {
    if (tab === "create") {
      router.replace("/register");
    }
  };

  const handleContinue = () => {
    router.replace("/dashboard");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="flex-grow px-6 pt-4 pb-6"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Header
            title={"Welcome\nback"}
            subtitle="Sign in to manage your Fall 2026 semester."
          />

          <Tabs activeTab="signin" onChange={handleTabChange} />

          <FormInput
            label="Email address"
            placeholder="ahmed@university.edu"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            value={email}
            onChangeText={setEmail}
          />

          <PasswordInput value={password} onChangeText={setPassword} />

          <ForgotPassword onPress={() => router.push("/forgot-password")} />

          {/* Pushes the actions to the bottom of the screen */}
          <View className="flex-1 min-h-[40px]" />

          <View>
            <PrimaryButton label="Continue" onPress={handleContinue} />
            <GoogleButton onPress={() => {}} />
            {/* <InlineLink
              prefix="Need university department access?"
              linkText="Contact admin"
              onPress={() => {}}
            /> */}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Signin;
