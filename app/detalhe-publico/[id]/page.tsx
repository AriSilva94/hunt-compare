import { notFound } from "next/navigation";
import { recordsService } from "@/services/records.service";
import { createMetadata } from "@/lib/seo";
import { JsonViewer } from "@/components/ui/JsonViewer";
import { weaponService } from "@/services/weapon.service";
import { WeaponDetails } from "@/types/weapon.types";
import { PublicRecordHeader } from "@/components/detalhe-publico/PublicRecordHeader";
import { PublicRecordInfo } from "@/components/detalhe-publico/PublicRecordInfo";
import { PublicWeaponSection } from "@/components/detalhe-publico/PublicWeaponSection";

interface PageProps {
  params: Promise<{ id: string }>;
}

type WeaponDetailsWithSelection = WeaponDetails & {
  proficiencies: { [level: number]: number | null };
};

export const revalidate = 300;

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
      <PublicRecordHeader record={record} />
      
      <div className="space-y-6">
        <PublicRecordInfo record={record} />
        
        <PublicWeaponSection
          weapons={weapons}
          weaponDetail={weaponDetail}
          selectedPerks={selectedPerks}
        />

        <JsonViewer 
          data={record.data} 
          title="Visualização dos Dados" 
        />
      </div>
    </div>
  );
}
