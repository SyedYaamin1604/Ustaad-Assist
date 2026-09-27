import { Redirect } from "expo-router";

import { useAuth } from "@/providers/AuthProvider";

/** The landing route: signed-in teachers go to their courses, everyone else to sign in. */
export default function Index() {
  const { session } = useAuth();
  return <Redirect href={session ? "/dashboard" : "/signin"} />;
}
