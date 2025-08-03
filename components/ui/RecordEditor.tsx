/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import ProficiencyTable from "@/components/ui/Proficiencies";
import { WeaponDetails } from "@/types/weapon.types";

interface RecordEditorProps {
  record: {
    id: string;
    user_id: string;
    data: any;
    is_public: boolean;
    created_at: string;
    updated_at: string;
  };
  weaponDetail: WeaponDetails | null;
  selectedPerks: { [level: number]: number | null };
  onSave: (updatedData: { is_public?: boolean; data?: any }) => Promise<void>;
  onCancel: () => void;
}

export function RecordEditor({
  record,
  weaponDetail,
  selectedPerks: initialSelectedPerks,
  onSave,
  onCancel,
}: RecordEditorProps) {
  const [isPublic, setIsPublic] = useState(record.is_public);
  const [selectedPerks, setSelectedPerks] = useState(initialSelectedPerks);
  const [isSaving, setIsSaving] = useState(false);


  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updateData: any = {};
      
      // Verificar se houve mudança na visibilidade
      if (isPublic !== record.is_public) {
        updateData.is_public = isPublic;
      }

      // Verificar se houve mudança nas proficiências
      const originalPerks = record.data.weaponDetail?.proficiencies || {};
      const hasPerksChanged = JSON.stringify(originalPerks) !== JSON.stringify(selectedPerks);
      
      if (hasPerksChanged && weaponDetail) {
        const updatedData = {
          ...record.data,
          weaponDetail: {
            ...record.data.weaponDetail,
            proficiencies: selectedPerks,
          }
        };
        updateData.data = updatedData;
      }

      if (Object.keys(updateData).length > 0) {
        await onSave(updateData);
      } else {
        onCancel(); // Nenhuma mudança, apenas cancela
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePerkChange = (level: number, selectedProficiency: number | null) => {
    setSelectedPerks(prev => ({
      ...prev,
      [level]: selectedProficiency,
    }));
  };

  return (
    <Card className="border-blue-200 bg-blue-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-blue-900">
          ✏️ Editando Registro
        </h3>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancelar
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Toggle de Visibilidade */}
        <div className="p-4 bg-white rounded-lg border">
          <h4 className="font-medium text-gray-900 mb-3">🔒 Visibilidade</h4>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="visibility"
                checked={!isPublic}
                onChange={() => setIsPublic(false)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm">
                <span className="font-medium">Privado</span>
                <span className="text-gray-600 ml-1">- Apenas você pode ver</span>
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="visibility"
                checked={isPublic}
                onChange={() => setIsPublic(true)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm">
                <span className="font-medium">Público</span>
                <span className="text-gray-600 ml-1">- Qualquer pessoa pode ver</span>
              </span>
            </label>
          </div>
          
          {isPublic !== record.is_public && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
              <strong className="text-yellow-800">⚠️ Atenção:</strong>
              <span className="text-yellow-700 ml-1">
                {isPublic 
                  ? "Este registro ficará visível publicamente e poderá ser usado em comparações por outros usuários."
                  : "Este registro ficará privado e será removido automaticamente de comparações públicas existentes."
                }
              </span>
            </div>
          )}
        </div>

        {/* Proficiências da Arma */}
        {weaponDetail && (
          <div className="p-4 bg-white rounded-lg border">
            <h4 className="font-medium text-gray-900 mb-3">⚔️ Proficiências da Arma</h4>
            <div className="flex flex-col items-center gap-4">
              <div className="text-center">
                <h5 className="text-lg font-medium text-gray-900">{weaponDetail.name}</h5>
                <p className="text-sm text-gray-600">Ajuste as proficiências selecionadas</p>
              </div>
              <ProficiencyTable
                proficiencies={weaponDetail.proficiencies}
                selectedPerks={selectedPerks}
                onPerkChange={handlePerkChange}
                isDisabled={false}
              />
            </div>
            
            {JSON.stringify(selectedPerks) !== JSON.stringify(initialSelectedPerks) && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
                <strong className="text-blue-800">ℹ️ Info:</strong>
                <span className="text-blue-700 ml-1">
                  As proficiências selecionadas foram alteradas e afetarão os cálculos nas comparações.
                </span>
              </div>
            )}
          </div>
        )}

        {!weaponDetail && record.data.weaponDetail && (
          <div className="p-4 bg-gray-50 rounded-lg border">
            <p className="text-sm text-gray-600">
              ⚠️ Não foi possível carregar os detalhes da arma para edição das proficiências.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}