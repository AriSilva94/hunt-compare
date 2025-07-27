import { notFound } from "next/navigation";
import { recordsService } from "@/services/records.service";
import { Card } from "@/components/ui/Card";
import { JsonViewer } from "@/components/ui/JsonViewer";
import WeaponDropdown from "@/components/ui/WeaponDropdown";
import ProficiencyTable from "@/components/ui/Proficiencies";
import { useEffect } from "react";
import { weaponService } from "@/services/weapon.service";
import { WeaponDetails, WeaponItem } from "@/types/weapon.types";

interface PageProps {
  params: Promise<{ id: string }>;
}

type WeaponDetailsWithSelection = WeaponDetails & {
  proficiencies: { [level: number]: number | null };
};

export default async function DetalhePublicoPage({ params }: PageProps) {
  // Await params antes de usar
  const resolvedParams = await params;
  const record = await recordsService.getPublicRecord(resolvedParams.id);

  if (!record) return notFound();

  const weapons = await weaponService.getWeaponItems();

  const weaponDetail = await weaponService.getWeaponById(
    Number(record?.data?.weaponDetail?.id)
  );

  const { proficiencies } =
    (record?.data?.weaponDetail as WeaponDetailsWithSelection) || {};

  const selectedPerks: { [level: number]: number | null } = proficiencies;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Registro Público</h1>
        <p className="mt-2 text-lg text-gray-600">
          {record.data._metadata?.title || `Registro #${record.id.slice(0, 8)}`}
        </p>
        {record.data._metadata?.description && (
          <p className="mt-1 text-gray-600">
            {record.data._metadata.description}
          </p>
        )}
      </div>

      <div className="space-y-6">
        <Card>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Informações</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">
                  ID do Registro:
                </span>
                <p className="text-gray-900 font-mono text-xs">{record.id}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Criado em:</span>
                <p className="text-gray-900">
                  {new Date(record.created_at).toLocaleString("pt-BR")}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Arma e Proficiências */}
        {weaponDetail && (
          <Card>
            <div className="flex flex-wrap items-center justify-around gap-4">
              <WeaponDropdown
                weapons={weapons}
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
              <div className="mt-4">
                <ProficiencyTable
                  proficiencies={weaponDetail?.proficiencies ?? null}
                  selectedPerks={selectedPerks}
                  isDisabled={true}
                />
              </div>
            </div>
          </Card>
        )}

        <JsonViewer data={record.data} title="Visualização dos Dados" />
      </div>
    </div>
  );
}
