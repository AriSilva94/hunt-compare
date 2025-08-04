/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line
} from "recharts";
import { Typography } from "@/components/ui/Typography";

interface ChartDataPoint {
  name: string;
  value: number;
  recordId: string;
  formatted?: string;
  fill?: string;
}

interface ComparisonChartProps {
  data: ChartDataPoint[];
  title: string;
  type: "bar" | "pie" | "line";
  color?: string;
  height?: number;
  valueFormatter?: (value: number) => string;
  useRecordColors?: boolean;
}

const COLORS = [
  "#3B82F6", // blue-500
  "#EF4444", // red-500
  "#10B981", // emerald-500
  "#F59E0B", // amber-500
  "#8B5CF6", // violet-500
  "#06B6D4", // cyan-500
  "#F97316", // orange-500
  "#EC4899", // pink-500
];

const CustomTooltip = ({ active, payload, label, valueFormatter }: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
  valueFormatter?: (value: number) => string;
}) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <Typography variant="p" className="font-medium">{label}</Typography>
        <Typography variant="p" className="text-blue-600">
          {valueFormatter ? valueFormatter(value) : value.toLocaleString()}
        </Typography>
      </div>
    );
  }
  return null;
};

export function ComparisonChart({
  data,
  title,
  type,
  color = "#3B82F6",
  height = 300,
  valueFormatter,
  useRecordColors = false
}: ComparisonChartProps) {
  const formatValue = (value: number) => {
    if (valueFormatter) return valueFormatter(value);
    return value.toLocaleString();
  };
  
  // Verificar se há dados
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <Typography variant="h4" className="mb-4">{title}</Typography>
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <span className="text-4xl mb-2 block">📊</span>
            <Typography variant="p">Nenhum registro encontrado</Typography>
          </div>
        </div>
      </div>
    );
  }
  
  // Verificar se todos os valores são zero
  const allZero = data.every(item => item.value === 0);
  if (allZero) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <Typography variant="h4" className="mb-4">{title}</Typography>
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <span className="text-4xl mb-2 block">📊</span>
            <Typography variant="p">Todos os valores são zero para esta métrica</Typography>
            <Typography variant="small" className="mt-1">Verifique se os dados dos registros estão corretos</Typography>
          </div>
        </div>
      </div>
    );
  }

  const renderChart = () => {
    switch (type) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={formatValue} />
              <Tooltip content={<CustomTooltip valueFormatter={valueFormatter} />} />
              <Bar dataKey="value" fill={useRecordColors ? undefined : color} radius={[4, 4, 0, 0]}>
                {useRecordColors && data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill || COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );

      case "pie":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={Math.min(height * 0.35, 120)}
                dataKey="value"
                label={(props: any) => {
                  const { name, value } = props;
                  return value !== undefined ? `${name}: ${formatValue(value)}` : '';
                }}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={useRecordColors ? (entry.fill || COLORS[index % COLORS.length]) : COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatValue(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      case "line":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={formatValue} />
              <Tooltip content={<CustomTooltip valueFormatter={valueFormatter} />} />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={useRecordColors ? undefined : color} 
                strokeWidth={3}
                dot={useRecordColors ? undefined : { fill: color, strokeWidth: 2, r: 6 }}
                connectNulls={false}
              >
                {useRecordColors && data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill || COLORS[index % COLORS.length]} />
                ))}
              </Line>
            </LineChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <Typography variant="h4" className="mb-4">{title}</Typography>
      {renderChart()}
    </div>
  );
}