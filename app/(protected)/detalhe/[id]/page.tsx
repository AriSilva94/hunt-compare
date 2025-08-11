/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { JsonViewer } from "@/components/ui/JsonViewer";
import { Typography } from "@/components/ui/Typography";
import Link from "next/link";
import { WeaponDetails, WeaponItem } from "@/types/weapon.types";
import { weaponService } from "@/services/weapon.service";
import WeaponDropdown from "@/components/ui/WeaponDropdown";
import ProficiencyTable from "@/components/ui/Proficiencies";
import { RecordEditor } from "@/components/ui/RecordEditor";
import { useToastContext } from "@/components/providers/ToastProvider";
import { useConfirm } from "@/hooks/useConfirm";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

interface Record {
  id: string;
  user_id: string;
  data: any;
  is_public: boolean;
  has_bestiary: boolean;
  character_id: string | null;
  character?: {
    id: string;
    name: string;
    level: number;
    vocation: string;
    world: string;
    sex: string;
  } | null;
  created_at: string;
  updated_at: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

type WeaponDetailsWithSelection = WeaponDetails & {
  proficiencies: { [level: number]: number | null };
};

export default function DetalhePage({ params }: PageProps) {
  // Use a função 'use' do React para resolver a Promise
  const resolvedParams = use(params);

  const [record, setRecord] = useState<Record | null>(null);
  const [weapons, setWeapons] = useState<WeaponItem[]>([]);
  const [weaponDetail, setWeaponDetail] = useState<WeaponDetails | null>(null);
  // const [loadingWeapons] = useState(true);
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);
  const [selectedPerks, setSelectedPerks] = useState<{
    [level: number]: number | null;
  }>({});
  const [isEditing, setIsEditing] = useState(false);
  const { error: showError } = useToastContext();
  const { confirm, confirmProps } = useConfirm();

  useEffect(() => {
    async function fetchWeapons() {
      try {
        const weaponsList = await weaponService.getWeaponItems();
        setWeapons(weaponsList);
      } catch (error) {
        console.error("Erro ao buscar armas:", error);
      }
    }

    fetchWeapons();
  }, []);

  useEffect(() => {
    async function fetchRecord() {
      try {
        const response = await fetch(`/api/records/${resolvedParams.id}`);
        if (!response.ok) {
          throw new Error("Record not found");
        }
        const data = await response.json();
        setRecord(data);
        if (data.data.weaponDetail) {
          fetchWeapon(data.data.weaponDetail);
        }
      } catch (error) {
        console.error("Erro ao buscar registro:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    }

    fetchRecord();
  }, [resolvedParams.id]);

  const fetchWeapon = async (item: WeaponDetailsWithSelection) => {
    try {
      const weapon = await weaponService.getWeaponById(Number(item.id));
      setWeaponDetail(weapon);
      setSelectedPerks(item.proficiencies || {});
    } catch (error) {
      console.error("Erro ao buscar detalhes da arma:", error);
    }
  };

  const handleWeaponSelect = async (item: WeaponItem) => {
    try {
      const weapon = await weaponService.getWeaponById(Number(item.id));
      setWeaponDetail(weapon);
      setSelectedPerks({});
    } catch (error) {
      console.error("Erro ao buscar detalhes da arma:", error);
    }
  };

  const copyPublicLink = () => {
    const publicUrl = `${window.location.origin}/detalhe-publico/${record?.id}`;
    navigator.clipboard.writeText(publicUrl);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleSave = async (updateData: {
    is_public?: boolean;
    has_bestiary?: boolean;
    data?: any;
    character_id?: string | null;
  }) => {
    try {
      const response = await fetch(`/api/records/${resolvedParams.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar registro");
      }

      const updatedRecord = await response.json();
      setRecord(updatedRecord);

      // Atualizar proficiências se foram alteradas
      if (updateData.data?.weaponDetail?.proficiencies) {
        setSelectedPerks(updateData.data.weaponDetail.proficiencies);
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao salvar registro:", error);
      showError(
        "Erro ao salvar",
        "Não foi possível salvar as alterações no registro."
      );
    }
  };

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: "Excluir registro",
      message:
        "Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita.",
      confirmText: "Excluir",
      cancelText: "Cancelar",
    });

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/records/${resolvedParams.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir registro");
      }

      // Força um refresh da página home para garantir que o registro excluído não apareça
      window.location.href = "/home";
    } catch (error) {
      console.error("Erro ao excluir registro:", error);
      showError("Erro ao excluir", "Não foi possível excluir o registro.");
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!record) return notFound();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <Typography variant="h1" className="text-3xl">
              {record.data._metadata?.title || "Detalhes do Registro"}
            </Typography>
            <Typography variant="lead" className="mt-2">
              ID: {record.id}
            </Typography>
            {record.data._metadata?.description && (
              <Typography variant="p" className="mt-1">
                {record.data._metadata.description}
              </Typography>
            )}
          </div>
        </div>
        <div className="flex gap-2 align-center justify-center md:justify-end my-4 md:my-0">
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} size="sm">
              Editar
            </Button>
          )}
          <Button variant="danger" onClick={handleDelete} size="sm">
            Excluir
          </Button>
          <Link href="/home">
            <Button variant="secondary">Voltar</Button>
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        {/* Editor de Registro */}
        {isEditing && (
          <RecordEditor
            record={record}
            weaponDetail={weaponDetail}
            selectedPerks={selectedPerks}
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
          />
        )}

        <Card>
          <Typography variant="h3" className="mb-4">
            Informações do Registro
          </Typography>

          {/* Layout responsivo: personagem + informações */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Seção do Personagem */}
            <div className="lg:w-80 flex-shrink-0">
              {record.character ? (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <Typography
                    variant="small"
                    className="text-gray-600 dark:text-gray-900 mb-3 font-medium"
                  >
                    👤 Personagem do registro
                  </Typography>

                  <div className="flex items-center gap-3">
                    {/* Avatar com ícone da vocação */}
                    <div className="relative flex-shrink-0">
                      <div
                        className={`w-12 h-12 rounded-full ${
                          record.character.vocation
                            .toLowerCase()
                            .includes("druid")
                            ? "bg-green-500"
                            : record.character.vocation
                                .toLowerCase()
                                .includes("knight")
                            ? "bg-red-500"
                            : record.character.vocation
                                .toLowerCase()
                                .includes("paladin")
                            ? "bg-yellow-500"
                            : record.character.vocation
                                .toLowerCase()
                                .includes("sorcerer")
                            ? "bg-blue-500"
                            : record.character.vocation
                                .toLowerCase()
                                .includes("monk")
                            ? "bg-orange-500"
                            : "bg-gray-500"
                        } flex items-center justify-center shadow-md`}
                      >
                        <span
                          className="text-lg text-white"
                          role="img"
                          aria-label={record.character.vocation}
                        >
                          {record.character.vocation
                            .toLowerCase()
                            .includes("druid")
                            ? "🍃"
                            : record.character.vocation
                                .toLowerCase()
                                .includes("knight")
                            ? "⚔️"
                            : record.character.vocation
                                .toLowerCase()
                                .includes("paladin")
                            ? "🏹"
                            : record.character.vocation
                                .toLowerCase()
                                .includes("sorcerer")
                            ? "🔥"
                            : record.character.vocation
                                .toLowerCase()
                                .includes("monk")
                            ? "🥋"
                            : "👤"}
                        </span>
                      </div>

                      {/* Indicador de sexo */}
                      <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 rounded-full p-0.5 shadow-sm">
                        <span className="text-xs">
                          {record.character.sex === "male"
                            ? "♂️"
                            : record.character.sex === "female"
                            ? "♀️"
                            : "❓"}
                        </span>
                      </div>
                    </div>

                    {/* Informações do personagem */}
                    <div className="flex-1 min-w-0">
                      <Typography
                        variant="lead"
                        className="font-semibold truncate mb-1"
                      >
                        {record.character.name}
                      </Typography>

                      <div className="space-y-1 text-sm">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">
                            Vocação:
                          </span>
                          <span className="ml-1 font-medium">
                            {record.character.vocation}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">
                              Level:
                            </span>
                            <span className="ml-1 font-bold">
                              {record.character.level.toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">
                              Mundo:
                            </span>
                            <span className="ml-1">
                              {record.character.world}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                    <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                      <span className="text-lg">❓</span>
                    </div>
                    <Typography variant="small">
                      Personagem não informado
                    </Typography>
                  </div>
                </div>
              )}
            </div>

            {/* Seção das Informações do Registro */}
            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300 block mb-1">
                      📅 Criado em:
                    </span>
                    <Typography
                      variant="p"
                      className="text-gray-600 dark:text-gray-400"
                    >
                      {new Date(record.created_at).toLocaleString("pt-BR")}
                    </Typography>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300 block mb-1">
                      🔄 Atualizado em:
                    </span>
                    <Typography
                      variant="p"
                      className="text-gray-600 dark:text-gray-400"
                    >
                      {new Date(record.updated_at).toLocaleString("pt-BR")}
                    </Typography>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300 block mb-1">
                      👁️ Visibilidade:
                    </span>
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                        record.is_public
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {record.is_public ? "Público" : "Privado"}
                    </span>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300 block mb-1">
                      📖 Bestiário:
                    </span>
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                        record.has_bestiary
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {record.has_bestiary ? "Com bestiário" : "Sem bestiário"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {record.is_public && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Typography variant="h4" className="mb-2">
                🔗 Link Público
              </Typography>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/detalhe-publico/${record.id}`}
                  className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-gray-100"
                  onClick={(e) => e.currentTarget.select()}
                />
                <Button
                  size="sm"
                  onClick={copyPublicLink}
                  className="whitespace-nowrap"
                >
                  {copySuccess ? "✓ Copiado!" : "Copiar Link"}
                </Button>
                <Link
                  href={`/detalhe-publico/${record.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="sm" variant="secondary">
                    Abrir
                  </Button>
                </Link>
              </div>
              <Typography variant="caption" className="mt-2">
                Compartilhe este link com qualquer pessoa para visualizar este
                registro
              </Typography>
            </div>
          )}
        </Card>

        {/* Arma e Proficiências */}
        <Card>
          <div className="flex flex-wrap items-center justify-around gap-4">
            <WeaponDropdown
              weapons={weapons}
              onSelect={handleWeaponSelect}
              defaultSelectedId={
                weaponDetail?.id ? Number(weaponDetail.id) : undefined
              }
            />
            <div className="flex flex-col w-80">
              <div className="my-1 text-2xl text-gray-900">
                {weaponDetail?.name}
              </div>
              <div className="my-1 text-sm max-w-md text-green-700 font-bold">
                {weaponDetail?.description_raw ? (
                  weaponDetail.description_raw
                    .replace(
                      /(Max\. Tier: \d+)\s+(It weighs)/,
                      "$1.|||BREAK|||$2"
                    )
                    .split(
                      /(?<!\b(?:Max|Mr|Ms|St|Dr))\. (?=[A-Z])|\|\|\|BREAK\|\|\|/g
                    )
                    .filter((s) => !!s?.trim())
                    .map((sentence, index, arr) => {
                      const trimmed = sentence.trim();
                      const isWeigh = /weighs?/i.test(trimmed);
                      const needsDot =
                        index !== arr.length - 1 &&
                        !isWeigh &&
                        !trimmed.endsWith(".");
                      return (
                        <div key={index}>
                          {trimmed}
                          {needsDot ? "." : ""}
                        </div>
                      );
                    })
                ) : (
                  <></>
                )}
              </div>
            </div>
            <ProficiencyTable
              proficiencies={weaponDetail?.proficiencies ?? null}
              selectedPerks={selectedPerks}
              isDisabled={true}
            />
          </div>
        </Card>

        <JsonViewer
          data={record.data}
          title="Visualização Completa dos Dados"
        />

        {/* Botão adicional para download do JSON */}
        <Card className="bg-gray-50">
          <div className="flex justify-between items-center">
            <div>
              <Typography variant="h4">Exportar Dados</Typography>
              <Typography variant="small">
                Baixe os dados em formato JSON
              </Typography>
            </div>
            <Button
              size="sm"
              onClick={() => {
                const dataStr = JSON.stringify(record.data, null, 2);
                const dataUri =
                  "data:application/json;charset=utf-8," +
                  encodeURIComponent(dataStr);
                const exportFileDefaultName = `registro-${record.id.slice(
                  0,
                  8
                )}.json`;

                const linkElement = document.createElement("a");
                linkElement.setAttribute("href", dataUri);
                linkElement.setAttribute("download", exportFileDefaultName);
                linkElement.click();
              }}
            >
              Baixar JSON
            </Button>
          </div>
        </Card>
      </div>
      <ConfirmDialog {...confirmProps} />
    </div>
  );
}
