"use client";

import { CadastroHeader } from "@/components/cadastro/CadastroHeader";
import { WeaponSection } from "@/components/cadastro/WeaponSection";
import { CadastroForm } from "@/components/cadastro/CadastroForm";
import { ExampleCards } from "@/components/cadastro/ExampleCards";
import { useWeapons } from "@/hooks/useWeapons";
import { useDataProcessor } from "@/hooks/useDataProcessor";

export default function CadastroPage() {
  const {
    weapons,
    weaponDetail,
    selectedPerks,
    setSelectedPerks,
    handleWeaponSelect,
  } = useWeapons();

  const {
    jsonPreview,
    inputFormat,
    updatePreview,
    processData,
    detectDataType,
  } = useDataProcessor();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <CadastroHeader />
      
      <WeaponSection
        weapons={weapons}
        weaponDetail={weaponDetail}
        selectedPerks={selectedPerks}
        onWeaponSelect={handleWeaponSelect}
        onPerksChange={setSelectedPerks}
      />

      <CadastroForm
        jsonPreview={jsonPreview}
        inputFormat={inputFormat}
        weaponDetail={weaponDetail}
        selectedPerks={selectedPerks}
        onPreviewUpdate={updatePreview}
        onDataProcess={processData}
        onDataTypeDetect={detectDataType}
      />

      <ExampleCards />
    </div>
  );
}
