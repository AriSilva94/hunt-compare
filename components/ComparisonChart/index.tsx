/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MetricChart from "@/components/MetricChart";

interface ComparisonChartProps {
  data: any[];
  datasets: string[];
}

const ComparisonChart: React.FC<ComparisonChartProps> = ({
  data,
  datasets,
}) => {
  if (!data || data.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Data Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            Add valid JSON data to see the comparison charts
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold">Data Comparison Charts</h2>
        <p className="text-muted-foreground">
          Balance & Raw XP Gain comparison across datasets
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <MetricChart
          data={data}
          datasets={datasets}
          metric="Balance"
          title="Balance Comparison"
        />
        <MetricChart
          data={data}
          datasets={datasets}
          metric="Raw XP Gain"
          title="Raw XP Gain Comparison"
        />
      </div>
    </div>
  );
};

export default ComparisonChart;
