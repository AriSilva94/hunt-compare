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

const recordSchema = z.object({
  jsonData: z.string().refine((val) => {
    try {
      JSON.parse(val);
      return true;
    } catch {
      return false;
    }
  }, "JSON inválido"),
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<RecordFormData>({
    resolver: zodResolver(recordSchema),
    defaultValues: {
      jsonData: "{}",
      isPublic: false,
      title: "",
      description: "",
    },
  });

  const watchJsonData = watch("jsonData");

  // Atualiza preview do JSON
  const updateJsonPreview = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      setJsonPreview(parsed);
    } catch {
      setJsonPreview(null);
    }
  };

  const onSubmit = async (data: RecordFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Parse e enriqueça o JSON com metadados
      const parsedData = JSON.parse(data.jsonData);
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
        credentials: "include",
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

  const formatJSON = () => {
    try {
      const currentValue = watch("jsonData");
      const formatted = JSON.stringify(JSON.parse(currentValue), null, 2);
      setValue("jsonData", formatted);
      updateJsonPreview(formatted);
    } catch {
      // Ignora erros de formatação
    }
  };

  const detectDataType = (data: any): string => {
    if (data["Session start"] && data["Killed Monsters"]) return "game-session";
    if (data["transactions"] && data["balance"]) return "financial";
    if (data["items"] && data["inventory"]) return "inventory";
    return "generic";
  };

  const renderJsonPreview = () => {
    if (!jsonPreview) return null;

    // Renderização especial para dados de sessão de jogo
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
                XP Ganho: {jsonPreview["XP Gain"]}
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

    // Renderização padrão para outros tipos
    return (
      <div className="text-sm text-gray-600">
        <p>Chaves encontradas: {Object.keys(jsonPreview).length}</p>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Novo Registro</h1>
        <p className="mt-2 text-lg text-gray-600">
          Crie um novo registro com dados JSON personalizados
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
              placeholder="Ex: Sessão de Farm - Junho 2025"
            />

            <Input
              {...register("description")}
              label="Descrição (opcional)"
              placeholder="Ex: Farm de 1h com foco em XP"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dados JSON
            </label>
            <textarea
              {...register("jsonData")}
              rows={12}
              className={`w-full px-3 py-2 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.jsonData ? "border-red-500" : "border-gray-300"
              }`}
              placeholder={'{\n  "chave": "valor"\n}'}
              onChange={(e) => {
                register("jsonData").onChange(e);
                updateJsonPreview(e.target.value);
              }}
            />
            {errors.jsonData && (
              <p className="mt-1 text-sm text-red-600">
                {errors.jsonData.message}
              </p>
            )}
            <div className="mt-2 flex justify-between">
              <button
                type="button"
                onClick={formatJSON}
                className="text-sm text-blue-600 hover:underline"
              >
                Formatar JSON
              </button>
              <span className="text-sm text-gray-500">
                Cole seu JSON de sessão de jogo, relatório financeiro ou
                qualquer estrutura de dados
              </span>
            </div>
          </div>

          {jsonPreview && (
            <Card className="bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Preview dos Dados
              </h3>
              {renderJsonPreview()}
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

      <div className="mt-8">
        <Card className="bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Exemplos de JSONs Suportados
          </h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p>
              • Sessões de jogos com estatísticas, monstros eliminados e itens
              coletados
            </p>
            <p>• Relatórios financeiros com transações e balanços</p>
            <p>• Inventários de itens com quantidades e valores</p>
            <p>• Qualquer estrutura JSON válida personalizada</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
