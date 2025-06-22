"use client";

import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useTheme } from "@/context/ThemeContext";

export default function ActionButtons() {
  const { datasets, setDatasets } = useTheme();

  const addDataset = () => {
    const newId = (
      Math.max(...Object.keys(datasets).map(Number)) + 1
    ).toString();
    setDatasets((prev) => ({
      ...prev,
      [newId]: { name: `Dataset ${newId}`, data: "" },
    }));
  };

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      <Button onClick={addDataset} className="gap-2">
        <Plus className="h-4 w-4" />
        Add Dataset
      </Button>
    </div>
  );
}
