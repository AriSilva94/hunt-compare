import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";
import type { Database } from "@/types/database.types";
import type { DatabaseCharacter } from "@/types/character.types";

type Record = Database["public"]["Tables"]["records"]["Row"] & {
  character?: DatabaseCharacter | null;
};

interface PublicRecordInfoProps {
  record: Record;
}

export function PublicRecordInfo({ record }: PublicRecordInfoProps) {
  // Usa o personagem do JOIN da tabela characters, não dos dados JSON
  const character = record.character;
  
  return (
    <Card>
      <Typography variant="h3" className="mb-4">
        Informações do Registro
      </Typography>
      
      {/* Layout responsivo: personagem + informações */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Seção do Personagem */}
        <div className="lg:w-80 flex-shrink-0">
          {character ? (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <Typography variant="small" className="text-gray-600 dark:text-gray-400 mb-3 font-medium">
                👤 Personagem do registro
              </Typography>
              
              <div className="flex items-center gap-3">
                {/* Avatar com ícone da vocação */}
                <div className="relative flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full ${
                    character.vocation?.toLowerCase().includes('druid') ? 'bg-green-500' :
                    character.vocation?.toLowerCase().includes('knight') ? 'bg-red-500' :
                    character.vocation?.toLowerCase().includes('paladin') ? 'bg-yellow-500' :
                    character.vocation?.toLowerCase().includes('sorcerer') ? 'bg-blue-500' :
                    character.vocation?.toLowerCase().includes('monk') ? 'bg-orange-500' : 'bg-gray-500'
                  } flex items-center justify-center shadow-md`}>
                    <span className="text-lg text-white" role="img" aria-label={character.vocation || 'Unknown'}>
                      {character.vocation?.toLowerCase().includes('druid') ? '🍃' :
                       character.vocation?.toLowerCase().includes('knight') ? '⚔️' :
                       character.vocation?.toLowerCase().includes('paladin') ? '🏹' :
                       character.vocation?.toLowerCase().includes('sorcerer') ? '🔥' :
                       character.vocation?.toLowerCase().includes('monk') ? '🥋' : '👤'}
                    </span>
                  </div>
                  
                  {/* Indicador de sexo */}
                  <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 rounded-full p-0.5 shadow-sm">
                    <span className="text-xs">
                      {character.sex === 'male' ? '♂️' : character.sex === 'female' ? '♀️' : '❓'}
                    </span>
                  </div>
                </div>
                
                {/* Informações do personagem */}
                <div className="flex-1 min-w-0">
                  <Typography variant="lead" className="font-semibold truncate mb-1">
                    {character.name}
                  </Typography>
                  
                  <div className="space-y-1 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Vocação:</span>
                      <span className="ml-1 font-medium">{character.vocation || 'Não informada'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Level:</span>
                        <span className="ml-1 font-bold">{character.level.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Mundo:</span>
                        <span className="ml-1">{character.world || 'Não informado'}</span>
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
                <span className="font-medium text-gray-700 dark:text-gray-300 block mb-1">🆔 ID do Registro:</span>
                <Typography variant="p" className="text-gray-600 dark:text-gray-400 font-mono text-xs break-all">
                  {record.id}
                </Typography>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300 block mb-1">📅 Criado em:</span>
                <Typography variant="p" className="text-gray-600 dark:text-gray-400">
                  {new Date(record.created_at).toLocaleString("pt-BR")}
                </Typography>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300 block mb-1">🌍 Visibilidade:</span>
                <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  Público
                </span>
              </div>
              
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300 block mb-1">📖 Bestiário:</span>
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
    </Card>
  );
}