"use client";

import { generateSampleData } from "@/utils/jsonUtils";
import { createContext, useContext, useState, ReactNode } from "react";

interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
  datasets: {
    [id: string]: { name: string; data: string };
  };
  setDatasets: React.Dispatch<
    React.SetStateAction<{
      [id: string]: { name: string; data: string };
    }>
  >;
  addDataset: () => void;
  removeDataset: (id: string) => void;
  updateDataset: (id: string, value: string) => void;
  updateDatasetName: (id: string, name: string) => void;
  loadSampleData: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [datasets, setDatasets] = useState<{
    [id: string]: { name: string; data: string };
  }>({
    "1": { name: "Hunt 1", data: "" },
    "2": { name: "Hunt 2", data: "" },
  });

  const addDataset = () => {
    const newId = (
      Math.max(...Object.keys(datasets).map(Number)) + 1
    ).toString();
    setDatasets((prev) => ({
      ...prev,
      [newId]: { name: `Dataset ${newId}`, data: "" },
    }));
  };

  const removeDataset = (id: string) => {
    setDatasets((prev) => {
      const newDatasets = { ...prev };
      delete newDatasets[id];
      return newDatasets;
    });
  };

  const updateDataset = (id: string, value: string) => {
    setDatasets((prev) => ({
      ...prev,
      [id]: { ...prev[id], data: value },
    }));
  };

  const updateDatasetName = (id: string, name: string) => {
    setDatasets((prev) => ({
      ...prev,
      [id]: { ...prev[id], name: name },
    }));
  };

  const loadSampleData = () => {
    const sampleData = generateSampleData();
    setDatasets((prev) => ({
      ...prev,
      "1": { ...prev["1"], data: sampleData },
    }));
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        datasets,
        setDatasets,
        addDataset,
        removeDataset,
        updateDataset,
        updateDatasetName,
        loadSampleData,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Hook customizado com verificação de contexto
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme deve ser usado dentro de um ThemeProvider");
  }
  return context;
};
