"use client";

import dynamic from "next/dynamic";
import { ComponentProps } from "react";
import { ComparisonChart } from "./ComparisonChart";

const DynamicComparisonChart = dynamic(
  () => import("./ComparisonChart").then((mod) => ({ default: mod.ComparisonChart })),
  {
    loading: () => (
      <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center animate-pulse">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
          <p className="text-gray-600 text-sm">Carregando gráfico...</p>
        </div>
      </div>
    ),
    ssr: false,
  }
);

export function LazyComparisonChart(props: ComponentProps<typeof ComparisonChart>) {
  return <DynamicComparisonChart {...props} />;
}