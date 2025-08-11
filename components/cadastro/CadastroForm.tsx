/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Typography } from "@/components/ui/Typography";
import { detectFormat } from "@/utils/formatDetector";
import { DataPreview } from "./DataPreview";
import { WeaponDetails } from "@/types/weapon.types";
import { Globe, BookOpen } from "lucide-react";

const recordSchema = z.object({
  jsonData: z.string().refine(
    (val) => {
      const format = detectFormat(val);
      return format !== "invalid";
    },
    {
      message:
        "Dados inválidos para sessão de hunt. Certifique-se de que os dados contenham:\n• Informações de sessão (Session start, Session end ou Session length)\n• Lista de monstros mortos (Killed Monsters)\n• Formato JSON válido ou texto de sessão do Tibia",
    }
  ),
  isPublic: z.boolean(),
  hasBestiary: z.boolean(),
  title: z.string().optional(),
  description: z.string().optional(),
  weapon_id: z.string().optional(),
});

type RecordFormData = z.infer<typeof recordSchema>;

interface CadastroFormProps {
  jsonPreview: any;
  inputFormat: "json" | "text" | null;
  weaponDetail: WeaponDetails | null;
  selectedPerks: { [level: number]: number | null };
  selectedCharacterId?: string;
  onPreviewUpdate: (input: string) => void;
  onDataProcess: (data: string) => any;
  onDataTypeDetect: (data: any) => string;
}

export function CadastroForm({
  jsonPreview,
  inputFormat,
  weaponDetail,
  selectedPerks,
  selectedCharacterId,
  onPreviewUpdate,
  onDataProcess,
  onDataTypeDetect,
}: CadastroFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      hasBestiary: false,
      title: "",
      description: "",
      weapon_id: "",
    },
  });

  const watchJsonData = watch("jsonData");

  const formatInput = () => {
    try {
      if (inputFormat === "json") {
        const formatted = JSON.stringify(JSON.parse(watchJsonData), null, 2);
        setValue("jsonData", formatted);
      }
    } catch (error) {
      console.error("Erro ao formatar entrada:", error);
    }
  };

  const onSubmit = async (data: RecordFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const parsedData = onDataProcess(data.jsonData);

      const needsNormalization = Object.values(selectedPerks).some(
        (value) => value === null
      );

      const proficiencies = needsNormalization
        ? Object.fromEntries(
            Object.entries(selectedPerks).map(([level, value]) => [
              level,
              value ?? 0,
            ])
          )
        : selectedPerks;

      const enrichedData = {
        ...parsedData,
        weaponDetail: {
          id: weaponDetail?.id || null,
          slug: weaponDetail?.slug || "",
          proficiencies,
        },
        _metadata: {
          title:
            data.title ||
            `Session ${
              parsedData["Session start"] || new Date().toISOString()
            }`,
          description: data.description || "",
          createdAt: new Date().toISOString(),
          type: onDataTypeDetect(parsedData),
          originalFormat: inputFormat,
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
          has_bestiary: data.hasBestiary,
          character_id: selectedCharacterId || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar registro");
      }

      window.location.href = "/home";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro");
    } finally {
      setIsLoading(false);
    }
  };

  return (
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
            <input
              {...register("isPublic")}
              type="checkbox"
              id="isPublic"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="isPublic"
              className="ml-3 block cursor-pointer flex-1"
            >
              <Typography variant="small" className="font-medium">
                Tornar este registro público
              </Typography>
              <Typography
                variant="caption"
                className="text-gray-500 dark:text-gray-400"
              >
                {" "}
                Qualquer pessoa poderá visualizar
              </Typography>
            </label>
          </div>

          <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <BookOpen className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2" />
            <input
              {...register("hasBestiary")}
              type="checkbox"
              id="hasBestiary"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="hasBestiary"
              className="ml-3 block cursor-pointer flex-1"
            >
              <Typography variant="small" className="font-medium">
                Tem bestiário?
              </Typography>
              <Typography
                variant="caption"
                className="text-gray-500 dark:text-gray-400"
              >
                {" "}
                Dados incluem informações do bestiário
              </Typography>
            </label>
          </div>
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
            className={`w-full px-3 py-2 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 ${
              errors.jsonData
                ? "border-red-500 dark:border-red-400"
                : "border-gray-300 dark:border-gray-600"
            }`}
            placeholder="Cole seu JSON ou texto de sessão aqui..."
            onChange={(e) => {
              register("jsonData").onChange(e);
              onPreviewUpdate(e.target.value);
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
                <Button
                  type="button"
                  onClick={formatInput}
                  variant="secondary"
                  size="sm"
                >
                  Formatar JSON
                </Button>
              )}
            </div>
            <span className="text-sm text-gray-500">
              Aceita JSON ou formato de texto de sessão
            </span>
          </div>
        </div>

        {jsonPreview && <DataPreview jsonPreview={jsonPreview} />}

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
  );
}
