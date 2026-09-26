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
import InlineLink from "../components/auth/InlineLink";

const Register = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleTabChange = (tab: "signin" | "create") => {
    if (tab === "signin") {
      router.replace("/signin");
    }
  };

  const handleCreateAccount = () => {
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
            title={"Create your\naccount"}
            subtitle="Join UstaadAssist to manage your Fall 2026 semester."
          />

          <Tabs activeTab="create" onChange={handleTabChange} />

          <FormInput
            label="Full name"
            placeholder="Ahmed Khan"
            autoCapitalize="words"
            autoComplete="name"
            value={fullName}
            onChangeText={setFullName}
          />

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

          {/* Pushes the actions to the bottom of the screen */}
          <View className="flex-1 min-h-[40px]" />

          <View>
            <PrimaryButton label="Create account" onPress={handleCreateAccount} />
            <GoogleButton onPress={() => {}} />
            <InlineLink
              prefix="Already have an account?"
              linkText="Sign in"
              onPress={() => router.replace("/signin")}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Register;
