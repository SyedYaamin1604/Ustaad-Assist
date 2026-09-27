import { Alert } from "react-native";

/** The message to show the teacher. ApiError carries the server's own sentence. */
export function errorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  return "Something went wrong. Please try again.";
}

export function showError(error: unknown, title = "Something went wrong"): void {
  Alert.alert(title, errorMessage(error));
}
