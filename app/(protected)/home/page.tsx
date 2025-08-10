"use client";
import { DashboardHeader } from "@/components/home/DashboardHeader";
import { StatisticsCards } from "@/components/home/StatisticsCards";
import { RecordsHeader } from "@/components/home/RecordsHeader";
import { RecordsList } from "@/components/home/RecordsList";
import { RecordFilter } from "@/components/ui/RecordFilter";
import { CharacterList } from "@/components/ui/CharacterList";
import { useRecords } from "@/hooks/useRecords";
import { useRecordFilters } from "@/hooks/useRecordFilters";
import { useCharacters } from "@/hooks/useCharacters";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/ui/ToastContainer";
import { TibiaCharacter } from "@/types/character.types";

export default function HomePage() {
  const { records, loading, user } = useRecords();
  const { filteredRecords, totalBalance, handleFilterChange } = useRecordFilters(records);
  const { characters, selectCharacter, selectedCharacterId, addCharacter, removeCharacter, canAddMore } = useCharacters();
  const { success, error: showError, toasts, removeToast } = useToast();

  const handleAddCharacter = async (character: TibiaCharacter) => {
    try {
      const savedCharacter = await addCharacter(character);
      return !!savedCharacter; // Retorna true se foi adicionado, false caso contrário
    } catch (error) {
      console.error('Erro ao adicionar personagem:', error);
      return false;
    }
  };

  const handleRemoveCharacter = async (characterId: string) => {
    try {
      const character = characters.find(c => c.id === characterId);
      await removeCharacter(characterId);
      
      success(
        'Personagem removido!',
        character ? `${character.name} foi removido com sucesso.` : 'Personagem removido com sucesso.'
      );
    } catch (error) {
      console.error('Erro ao remover personagem:', error);
      showError('Erro ao remover', 'Não foi possível remover o personagem. Tente novamente.');
    }
  };

  const handleCharacterAdded = () => {
    // Callback adicional se necessário
    console.log('Character added successfully');
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <DashboardHeader />
      <StatisticsCards records={records} loading={loading} />
      
      {/* Seção de Personagens */}
      <div className="mb-8">
        <CharacterList
          characters={characters}
          onCharacterSelect={selectCharacter}
          onCharacterRemove={handleRemoveCharacter}
          selectedCharacterId={selectedCharacterId}
        />
      </div>
      
      {/* Seção de Registros */}
      <div>
        <RecordsHeader 
          canAddMore={canAddMore}
          onAddCharacter={handleAddCharacter}
          onCharacterAdded={handleCharacterAdded}
        />
        <RecordFilter
          onFilterChange={handleFilterChange}
          loading={loading}
          totalBalance={totalBalance}
          recordCount={filteredRecords.length}
        />
        <RecordsList
          records={records}
          filteredRecords={filteredRecords}
          loading={loading}
        />
      </div>

      {/* Toast Container */}
      <ToastContainer
        toasts={toasts}
        onRemove={removeToast}
      />
    </div>
  );
}
