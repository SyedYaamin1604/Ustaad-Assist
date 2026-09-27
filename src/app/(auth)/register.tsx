import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import FormInput from "@/components/auth/FormInput";
import GoogleButton from "@/components/auth/GoogleButton";
import Header from "@/components/auth/Header";
import InlineLink from "@/components/auth/InlineLink";
import PasswordInput from "@/components/auth/PasswordInput";
import PrimaryButton from "@/components/auth/PrimaryButton";
import Tabs from "@/components/auth/Tabs";
import { useAction } from "@/hooks/useAction";
import { config } from "@/lib/config";
import { useAuth } from "@/providers/AuthProvider";

const MIN_PASSWORD_LENGTH = 6; // Supabase's default minimum

const Register = () => {
  const router = useRouter();
  const { signUp, signInWithGoogle } = useAuth();
  const { busy, run } = useAction();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleTabChange = (tab: "signin" | "create") => {
    if (tab === "signin") router.replace("/signin");
  };

  const handleCreateAccount = async () => {
    if (!fullName.trim() || !email.trim()) {
      Alert.alert("Missing details", "Enter your full name and email address.");
      return;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      Alert.alert("Password too short", `Use at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }

    const result = await run(() => signUp(fullName, email, password), "Couldn't create your account");

    // When the Supabase project requires email confirmation there is no session
    // yet. Otherwise the auth guard moves the teacher into the app by itself.
    if (result?.needsConfirmation) {
      Alert.alert("Confirm your email", `We sent a confirmation link to ${email.trim()}. Open it, then sign in.`, [
        { text: "OK", onPress: () => router.replace("/signin") },
      ]);
    }
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
          <Header title={"Create your\naccount"} subtitle="Join UstaadAssist to plan and run your semester." />

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
            <PrimaryButton label="Create account" loading={busy} onPress={handleCreateAccount} />
            {config.googleSignIn && (
              <GoogleButton onPress={() => run(signInWithGoogle, "Couldn't sign in with Google")} />
            )}
            <InlineLink prefix="Already have an account?" linkText="Sign in" onPress={() => router.replace("/signin")} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Register;
