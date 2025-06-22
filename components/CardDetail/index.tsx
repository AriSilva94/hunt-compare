"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { processDataForChart } from "@/utils/jsonUtils";
import ComparisonChart from "@/components/ComparisonChart";
import { FileJson } from "lucide-react";
import { useMemo } from "react";
import JsonTextarea from "../JsonTextarea";
import { useTheme } from "@/context/ThemeContext";

export default function CardDetail() {
  const { datasets, removeDataset, updateDataset, updateDatasetName } =
    useTheme();

  const chartData = useMemo(() => {
    const validDatasets = Object.fromEntries(
      Object.entries(datasets).filter(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, dataset]) => dataset.data.trim() !== ""
      )
    );
    return processDataForChart(validDatasets);
  }, [datasets]);

  const datasetIds = Object.keys(datasets).sort(
    (a, b) => Number(a) - Number(b)
  );
  const canRemove = datasetIds.length > 2;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileJson className="h-5 w-5" />
            Dataset Input
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {datasetIds.map((id) => (
              <JsonTextarea
                key={id}
                id={id}
                name={datasets[id].name}
                value={datasets[id].data}
                onChange={updateDataset}
                onNameChange={updateDatasetName}
                onRemove={removeDataset}
                canRemove={canRemove}
                placeholder="Paste your JSON data here..."
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <ComparisonChart
        data={chartData}
        datasets={datasetIds
          .filter((id) => datasets[id].data.trim() !== "")
          .map((id) => datasets[id].name)}
      />
    </>
  );
}
