/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

// Parser para converter texto em JSON
function parseSessionText(text: string): any {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line);
  const result: any = {};

  let currentSection = "";

  for (const line of lines) {
    // Session data
    if (line.startsWith("Session data:")) {
      const match = line.match(/From (.*) to (.*)/);
      if (match) {
        result["Session start"] = match[1].trim();
        result["Session end"] = match[2].trim();
      }
    }
    // Session duration
    else if (line.startsWith("Session:")) {
      result["Session length"] = line.replace("Session:", "").trim();
    }
    // Simple key-value pairs
    else if (line.includes(":") && !line.endsWith(":")) {
      const [key, value] = line.split(":").map((s) => s.trim());
      result[key] = value;
    }
    // Section headers
    else if (line.endsWith(":")) {
      currentSection = line.replace(":", "");
      if (currentSection === "Killed Monsters") {
        result["Killed Monsters"] = [];
      } else if (currentSection === "Looted Items") {
        result["Looted Items"] = [];
      }
    }
    // Items in sections
    else if (currentSection && line.match(/^\d+x\s+/)) {
      const match = line.match(/^(\d+)x\s+(.+)$/);
      if (match) {
        const count = parseInt(match[1]);
        const name = match[2].trim();

        if (currentSection === "Killed Monsters") {
          result["Killed Monsters"].push({ Count: count, Name: name });
        } else if (currentSection === "Looted Items") {
          result["Looted Items"].push({ Count: count, Name: name });
        }
      }
    }
  }

  return result;
}

// Função para detectar se é JSON ou texto
function detectFormat(input: string): "json" | "text" | "invalid" {
  const trimmed = input.trim();

  // Tenta detectar JSON
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      JSON.parse(trimmed);
      return "json";
    } catch (error) {
      console.error("Erro ao parsear JSON:", error);
      return "invalid";
    }
  }

  // Verifica se parece com o formato de texto
  if (trimmed.includes("Session data:") || trimmed.includes("Session:")) {
    return "text";
  }

  // Tenta parse como JSON mesmo assim
  try {
    JSON.parse(trimmed);
    return "json";
  } catch (error) {
    console.error("Erro ao parsear JSON:", error);
    return "invalid";
  }
}

const recordSchema = z.object({
  jsonData: z.string().refine((val) => {
    const format = detectFormat(val);
    return format !== "invalid";
  }, "Formato inválido. Use JSON ou o formato de texto de sessão."),
  isPublic: z.boolean(),
  title: z.string().optional(),
  description: z.string().optional(),
});

type RecordFormData = z.infer<typeof recordSchema>;

export default function CadastroPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jsonPreview, setJsonPreview] = useState<any>(null);
  const [inputFormat, setInputFormat] = useState<"json" | "text" | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<RecordFormData>({
    resolver: zodResolver(recordSchema),
    defaultValues: {
      jsonData: "",
      isPublic: false,
      title: "",
      description: "",
    },
  });

  const watchJsonData = watch("jsonData");

  // Atualiza preview do JSON
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

  const onSubmit = async (data: RecordFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      let parsedData;
      const format = detectFormat(data.jsonData);

      if (format === "json") {
        parsedData = JSON.parse(data.jsonData);
      } else if (format === "text") {
        parsedData = parseSessionText(data.jsonData);
      } else {
        throw new Error("Formato inválido");
      }

      // Enriqueça com metadados
      const enrichedData = {
        ...parsedData,
        _metadata: {
          title:
            data.title ||
            `Session ${
              parsedData["Session start"] || new Date().toISOString()
            }`,
          description: data.description || "",
          createdAt: new Date().toISOString(),
          type: detectDataType(parsedData),
          originalFormat: format,
        },
      };

      const response = await fetch("/api/records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: enrichedData,
          is_public: data.isPublic,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar registro");
      }

      router.push("/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro");
    } finally {
      setIsLoading(false);
    }
  };

  const formatInput = () => {
    try {
      if (inputFormat === "json") {
        const formatted = JSON.stringify(JSON.parse(watchJsonData), null, 2);
        setValue("jsonData", formatted);
      }
      // Para texto, não formatamos
    } catch (error) {
      console.error("Erro ao formatar entrada:", error);
      // Ignora erros de formatação
    }
  };

  const detectDataType = (data: any): string => {
    if (data["Session start"] && data["Killed Monsters"]) return "game-session";
    if (data["transactions"] && data["balance"]) return "financial";
    if (data["items"] && data["inventory"]) return "inventory";
    return "generic";
  };

  const renderPreview = () => {
    if (!jsonPreview) return null;

    // Renderização especial para dados de sessão
    if (jsonPreview["Session start"]) {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700">Sessão</h4>
              <p className="text-sm text-gray-600">
                {jsonPreview["Session start"]} - {jsonPreview["Session end"]}
              </p>
              <p className="text-sm text-gray-600">
                Duração: {jsonPreview["Session length"]}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Estatísticas</h4>
              <p className="text-sm text-gray-600">
                Raw XP: {jsonPreview["Raw XP Gain"]}
              </p>
              <p className="text-sm text-gray-600">
                Dano Total: {jsonPreview["Damage"]}
              </p>
            </div>
          </div>

          {jsonPreview["Killed Monsters"] && (
            <div>
              <h4 className="font-medium text-gray-700">
                Monstros Eliminados ({jsonPreview["Killed Monsters"].length}{" "}
                tipos)
              </h4>
              <div className="text-sm text-gray-600">
                Total:{" "}
                {jsonPreview["Killed Monsters"].reduce(
                  (sum: number, m: any) => sum + m.Count,
                  0
                )}
              </div>
            </div>
          )}

          {jsonPreview["Looted Items"] && (
            <div>
              <h4 className="font-medium text-gray-700">
                Itens Coletados ({jsonPreview["Looted Items"].length} tipos)
              </h4>
              <div className="text-sm text-gray-600">
                Valor Total: {jsonPreview["Loot"]}
              </div>
            </div>
          )}
        </div>
      );
    }

    // Renderização padrão
    return (
      <div className="text-sm text-gray-600">
        <p>Chaves encontradas: {Object.keys(jsonPreview).length}</p>
      </div>
    );
  };

  // Exemplo de texto formatado
  const textExample = `Session data: From 2025-04-27, 20:32:56 to 2025-04-27, 21:27:29
Session: 00:54h
XP Gain: 5,079,482
Damage: 5,321,554
Killed Monsters:
  178x betrayed wraith
  267x dark torturer
Looted Items:
  1x a magma coat
  26x a black pearl`;

  // Exemplo de JSON
  const jsonExample = `{
  "Session start": "2025-06-19, 02:56:37",
  "Session end": "2025-06-19, 03:57:06",
  "XP Gain": "5,369,570",
  "Damage": "5,846,810"
}`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Novo Registro</h1>
        <p className="mt-2 text-lg text-gray-600">
          Crie um novo registro usando JSON ou formato de texto
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              {...register("title")}
              label="Título (opcional)"
              placeholder="Ex: Sessão de Farm - Abril 2025"
            />

            <Input
              {...register("description")}
              label="Descrição (opcional)"
              placeholder="Ex: Farm de 1h com foco em XP"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Dados (JSON ou Texto)
              </label>
              {inputFormat && (
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    inputFormat === "json"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  Formato: {inputFormat.toUpperCase()}
                </span>
              )}
            </div>
            <textarea
              {...register("jsonData")}
              rows={12}
              className={`w-full px-3 py-2 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.jsonData ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Cole seu JSON ou texto de sessão aqui..."
              onChange={(e) => {
                register("jsonData").onChange(e);
                updatePreview(e.target.value);
              }}
            />
            {errors.jsonData && (
              <p className="mt-1 text-sm text-red-600">
                {errors.jsonData.message}
              </p>
            )}
            <div className="mt-2 flex justify-between">
              <div className="flex gap-2">
                {inputFormat === "json" && (
                  <button
                    type="button"
                    onClick={formatInput}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Formatar JSON
                  </button>
                )}
              </div>
              <span className="text-sm text-gray-500">
                Aceita JSON ou formato de texto de sessão
              </span>
            </div>
          </div>

          {jsonPreview && (
            <Card className="bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Preview dos Dados
              </h3>
              {renderPreview()}
            </Card>
          )}

          <div className="flex items-center">
            <input
              {...register("isPublic")}
              type="checkbox"
              id="isPublic"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="isPublic"
              className="ml-2 block text-sm text-gray-900"
            >
              Tornar este registro público
            </label>
            <span className="ml-2 text-xs text-gray-500">
              (Qualquer pessoa poderá visualizar este registro)
            </span>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push("/home")}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar Registro"}
            </Button>
          </div>
        </form>
      </Card>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Exemplo: Formato JSON
          </h3>
          <pre className="text-xs text-blue-800 overflow-x-auto">
            {jsonExample}
          </pre>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <h3 className="text-lg font-semibold text-green-900 mb-2">
            Exemplo: Formato Texto
          </h3>
          <pre className="text-xs text-green-800 overflow-x-auto">
            {textExample}
          </pre>
        </Card>
      </div>
    </div>
  );
}
