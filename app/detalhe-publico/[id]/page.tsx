import { notFound } from "next/navigation";
import { recordsService } from "@/services/records.service";
import { createMetadata } from "@/lib/seo";
import { Card } from "@/components/ui/Card";
import { JsonViewer } from "@/components/ui/JsonViewer";
import { Typography } from "@/components/ui/Typography";
import WeaponDropdown from "@/components/ui/WeaponDropdown";
import ProficiencyTable from "@/components/ui/Proficiencies";
import { weaponService } from "@/services/weapon.service";
import { WeaponDetails } from "@/types/weapon.types";

interface PageProps {
  params: Promise<{ id: string }>;
}

type WeaponDetailsWithSelection = WeaponDetails & {
  proficiencies: { [level: number]: number | null };
};

// Enable ISR for public record pages
export const revalidate = 300; // 5 minutes

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const record = await recordsService.getPublicRecord(resolvedParams.id);

  if (!record) {
    return createMetadata({
      title: "Registro não encontrado",
      description: "O registro solicitado não foi encontrado ou não é público.",
      noIndex: true,
    });
  }

  const title =
    record.data._metadata?.title ||
    `Registro de Hunt #${record.id.slice(0, 8)}`;
  const description =
    record.data._metadata?.description ||
    `Visualize dados detalhados desta sessão de hunt do Tibia. XP, lucro, monstros eliminados e muito mais.`;

  return createMetadata({
    title,
    description,
    path: `/detalhe-publico/${record.id}`,
  });
}

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
        <Typography variant="h1">Registro Público</Typography>
        <Typography variant="lead" className="mt-2">
          {record.data._metadata?.title || `Registro #${record.id.slice(0, 8)}`}
        </Typography>
        {record.data._metadata?.description && (
          <Typography variant="p" className="mt-1">
            {record.data._metadata.description}
          </Typography>
        )}
      </div>

      <div className="space-y-6">
        <Card>
          <div className="mb-4">
            <Typography variant="h2" className="mb-2">
              Informações
            </Typography>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Typography variant="small" className="font-medium">
                  ID do Registro:
                </Typography>
                <Typography variant="caption" className="font-mono">
                  {record.id}
                </Typography>
              </div>
              <div>
                <Typography variant="small" className="font-medium">
                  Criado em:
                </Typography>
                <Typography variant="small">
                  {new Date(record.created_at).toLocaleString("pt-BR")}
                </Typography>
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
                <Typography variant="h3" className="my-1">
                  {weaponDetail?.name}
                </Typography>
                <div className="my-1 max-w-md text-green-700 dark:text-green-400 font-bold text-xs">
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
