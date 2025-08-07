import { isValidSessionData, isValidSessionText } from "@/types/session.types";

export type FormatType = "json" | "text" | "invalid";

export function detectFormat(input: string): FormatType {
  const trimmed = input.trim();

  if (!trimmed) {
    return "invalid";
  }

  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (isValidSessionData(parsed)) {
        return "json";
      } else {
        return "invalid";
      }
    } catch (error) {
      console.error("Erro ao parsear JSON:", error);
      return "invalid";
    }
  }

  if (isValidSessionText(trimmed)) {
    return "text";
  }

  try {
    const parsed = JSON.parse(trimmed);
    if (isValidSessionData(parsed)) {
      return "json";
    } else {
      return "invalid";
    }
  } catch (error) {
    console.error("Erro ao parsear JSON:", error);
    return "invalid";
  }
}