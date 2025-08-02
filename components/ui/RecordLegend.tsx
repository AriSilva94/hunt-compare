/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card } from "@/components/ui/Card";
import { getRecordColor } from "@/utils/recordColors";

interface Record {
  id: string;
  data: any;
  created_at: string;
  is_public: boolean;
}

interface RecordLegendProps {
  records: Record[];
  getRecordTitle: (record: Record) => string;
}

export function RecordLegend({ records, getRecordTitle }: RecordLegendProps) {
  return (
    <Card className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        🎨 Legenda de Cores
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {records.map((record, index) => {
          const recordColor = getRecordColor(index);

          return (
            <Card
              key={record.id}
              className="relative overflow-hidden"
              style={{ backgroundColor: recordColor.light }}
            >
              {/* Barra lateral colorida */}
              <div
                className="absolute left-0 top-0 bottom-0 w-1"
                style={{ backgroundColor: recordColor.primary }}
              />

              <div className="pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center border-2"
                    style={{
                      backgroundColor: recordColor.primary,
                      borderColor: recordColor.dark,
                    }}
                  >
                    <span className="text-white text-sm font-bold">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="font-medium text-gray-900 truncate">
                    {getRecordTitle(record)}
                  </h3>
                </div>

                <p className="text-sm text-gray-600 mb-2">
                  {new Date(record.created_at).toLocaleDateString("pt-BR")}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {record.is_public && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Público
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <div
                      className="w-3 h-3 rounded-full border"
                      style={{
                        backgroundColor: recordColor.primary,
                        borderColor: recordColor.dark,
                      }}
                    />
                    <span className="font-medium">{recordColor.name}</span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          💡 <strong>Dica:</strong> Cada registro tem uma cor única que é
          mantida consistente em todos os gráficos e visualizações.
        </p>
      </div>
    </Card>
  );
}
