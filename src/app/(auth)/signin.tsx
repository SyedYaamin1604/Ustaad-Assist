import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import ForgotPassword from "@/components/auth/ForgotPassword";
import FormInput from "@/components/auth/FormInput";
import GoogleButton from "@/components/auth/GoogleButton";
import Header from "@/components/auth/Header";
import PasswordInput from "@/components/auth/PasswordInput";
import PrimaryButton from "@/components/auth/PrimaryButton";
import Tabs from "@/components/auth/Tabs";
import { useAction } from "@/hooks/useAction";
import { config } from "@/lib/config";
import { useAuth } from "@/providers/AuthProvider";

const Signin = () => {
  const router = useRouter();
  const { signIn, signInWithGoogle } = useAuth();
  const { busy, run } = useAction();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleTabChange = (tab: "signin" | "create") => {
    if (tab === "create") router.replace("/register");
  };

  // On success the auth guard in app/_layout.tsx moves the teacher into the app.
  const handleContinue = () => {
    if (!email.trim() || !password) {
      Alert.alert("Missing details", "Enter your email address and password.");
      return;
    }
    run(() => signIn(email, password), "Couldn't sign in");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          className="flex-1"
          contentContainerClassName="flex-grow px-6 pt-4 pb-6"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Header title={"Welcome\nback"} subtitle="Sign in to manage your semester." />

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
            <PrimaryButton label="Continue" loading={busy} onPress={handleContinue} />
            {config.googleSignIn && (
              <GoogleButton onPress={() => run(signInWithGoogle, "Couldn't sign in with Google")} />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Signin;
