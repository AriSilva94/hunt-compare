/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MetricChartProps {
  data: any[];
  datasets: string[];
  metric: string;
  title: string;
}

const MetricChart: React.FC<MetricChartProps> = ({
  data,
  datasets,
  metric,
  title,
}) => {
  const colors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7300",
    "#8dd1e1",
    "#d084d0",
    "#ffb347",
    "#87ceeb",
  ];

  // Filter data to only show the specific metric
  const filteredData = data.filter((item) => item.metric === metric);

  const formatNumber = (value: number) => {
    return value.toLocaleString();
  };

  if (!filteredData || filteredData.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
            No data available for {metric}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="metric"
                className="text-xs"
                tick={{ fontSize: 12 }}
                hide
              />
              <YAxis
                className="text-xs"
                tick={{ fontSize: 12 }}
                tickFormatter={formatNumber}
              />
              <Tooltip
                formatter={(value: number) => [formatNumber(value), ""]}
              />
              <Legend />
              {datasets.map((dataset, index) => (
                <Bar
                  key={dataset}
                  dataKey={dataset}
                  fill={colors[index % colors.length]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricChart;
