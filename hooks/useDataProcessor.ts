/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { detectFormat, FormatType } from "@/utils/formatDetector";
import { parseSessionText } from "@/utils/sessionParser";

export function useDataProcessor() {
  const [jsonPreview, setJsonPreview] = useState<any>(null);
  const [inputFormat, setInputFormat] = useState<"json" | "text" | null>(null);

  const updatePreview = (input: string) => {
    const format = detectFormat(input);
    setInputFormat(format === "invalid" ? null : format);

    try {
      let parsed;
      if (format === "json") {
        parsed = JSON.parse(input);
      } else if (format === "text") {
        parsed = parseSessionText(input);
      } else {
        setJsonPreview(null);
        return;
      }
      setJsonPreview(parsed);
    } catch (error) {
      console.error("Erro ao parsear dados:", error);
      setJsonPreview(null);
    }
  };

  const processData = (jsonData: string) => {
    const format = detectFormat(jsonData);

    if (format === "json") {
      return JSON.parse(jsonData);
    } else if (format === "text") {
      return parseSessionText(jsonData);
    } else {
      throw new Error("Formato inválido");
    }
  };

  const detectDataType = (data: any): string => {
    if (data["Session start"] && data["Killed Monsters"]) return "game-session";
    if (data["transactions"] && data["balance"]) return "financial";
    if (data["items"] && data["inventory"]) return "inventory";
    return "generic";
  };

  return {
    jsonPreview,
    inputFormat,
    updatePreview,
    processData,
    detectDataType,
  };
}