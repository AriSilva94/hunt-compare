/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";

interface DataPreviewProps {
  jsonPreview: any;
}

export function DataPreview({ jsonPreview }: DataPreviewProps) {
  if (!jsonPreview) return null;

  const renderPreview = () => {
    if (jsonPreview["Session start"]) {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Typography variant="h4">Sessão</Typography>
              <Typography variant="small">
                {jsonPreview["Session start"]} - {jsonPreview["Session end"]}
              </Typography>
              <Typography variant="small">
                Duração: {jsonPreview["Session length"]}
              </Typography>
            </div>
            <div>
              <Typography variant="h4">Estatísticas</Typography>
              <Typography variant="small">
                XP Ganho: {jsonPreview["XP Gain"] || jsonPreview["Raw XP Gain"]}
              </Typography>
              <Typography variant="small">
                Dano Total: {jsonPreview["Damage"]}
              </Typography>
            </div>
          </div>

          {jsonPreview["Killed Monsters"] && (
            <div>
              <Typography variant="h4">
                Monstros Eliminados ({jsonPreview["Killed Monsters"].length}{" "}
                tipos)
              </Typography>
              <Typography variant="small">
                Total:{" "}
                {jsonPreview["Killed Monsters"].reduce(
                  (sum: number, m: any) => sum + m.Count,
                  0
                )}
              </Typography>
            </div>
          )}

          {jsonPreview["Looted Items"] && (
            <div>
              <Typography variant="h4">
                Itens Coletados ({jsonPreview["Looted Items"].length} tipos)
              </Typography>
              <Typography variant="small">
                Valor Total: {jsonPreview["Loot"]}
              </Typography>
            </div>
          )}
        </div>
      );
    }

    return (
      <Typography variant="small">
        Chaves encontradas: {Object.keys(jsonPreview).length}
      </Typography>
    );
  };

  return (
    <Card className="bg-gray-50">
      <Typography variant="h3" className="mb-3">
        Preview dos Dados
      </Typography>
      {renderPreview()}
    </Card>
  );
}