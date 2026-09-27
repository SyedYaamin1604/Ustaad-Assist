import React, { useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";

import FormInput from "@/components/auth/FormInput";
import Header from "@/components/auth/Header";
import InlineLink from "@/components/auth/InlineLink";
import PrimaryButton from "@/components/auth/PrimaryButton";
import { useAction } from "@/hooks/useAction";
import { useAuth } from "@/providers/AuthProvider";

const ForgotPassword = () => {
  const router = useRouter();
  const { sendPasswordReset } = useAuth();
  const { busy, run } = useAction();
  const [email, setEmail] = useState("");

  const handleSendResetLink = async () => {
    if (!email.trim()) {
      Alert.alert("Missing email", "Enter the email address you signed up with.");
      return;
    }
    const sent = await run(() => sendPasswordReset(email).then(() => true), "Couldn't send the reset link");
    if (sent) {
      Alert.alert("Check your inbox", `If an account exists for ${email.trim()}, a reset link is on its way.`, [
        { text: "Back to sign in", onPress: () => router.replace("/signin") },
      ]);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white" contentContainerClassName="px-6 pb-20 pt-24" keyboardShouldPersistTaps="handled">
      <Header title={"Reset\npassword"} subtitle="Enter your email and we'll send you a reset link." />

      <View className="my-6">
        <FormInput
          label="Email address"
          placeholder="ahmed@university.edu"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <PrimaryButton label="Send reset link" loading={busy} onPress={handleSendResetLink} />

      <InlineLink prefix="Nevermind?" linkText="Back to sign in" onPress={() => router.replace("/signin")} />
    </ScrollView>
  );
};

export default ForgotPassword;
