import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { useRouter } from "expo-router";

import Header from "../components/auth/Header";
import FormInput from "../components/auth/FormInput";
import PrimaryButton from "../components/auth/PrimaryButton";
import InlineLink from "../components/auth/InlineLink";

const ForgotPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleSendResetLink = () => {
    router.push("/signin"); // This will replace with the API for reset password
  };

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerClassName="px-6 pb-20 pt-24"
      keyboardShouldPersistTaps="handled"
    >
      <Header
        title={"Reset\npassword"}
        subtitle="Enter your email and we'll send you a reset link."
      />

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

      <PrimaryButton label="Send reset link" onPress={handleSendResetLink} />

      <InlineLink
        prefix="Nevermind?"
        linkText="Back to sign in"
        onPress={() => router.push("/signin")}
      />
    </ScrollView>
  );
};

export default ForgotPassword;