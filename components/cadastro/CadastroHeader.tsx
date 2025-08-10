import { Typography } from "@/components/ui/Typography";
import { CharacterSelector } from "./CharacterSelector";

interface CadastroHeaderProps {
  onCharacterChange?: (characterId: string | undefined) => void;
}

export function CadastroHeader({ onCharacterChange }: CadastroHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <Typography variant="h1">Novo Registro</Typography>
          <Typography variant="lead" className="mt-2">
            Crie um novo registro usando JSON ou formato de texto
          </Typography>
        </div>
        
        {/* Seletor de personagem */}
        <div className="lg:min-w-[300px]">
          <CharacterSelector onCharacterChange={onCharacterChange} />
        </div>
      </div>
    </div>
  );
}