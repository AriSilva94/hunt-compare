import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";

const textExample = `Session data: From 2025-04-27, 20:32:56 to 2025-04-27, 21:27:29
Session: 00:54h
XP Gain: 5,079,482
Damage: 5,321,554
Killed Monsters:
  178x betrayed wraith
  267x dark torturer
Looted Items:
  1x a magma coat
  26x a black pearl`;

const jsonExample = `{
  "Session start": "2025-06-19, 02:56:37",
  "Session end": "2025-06-19, 03:57:06",
  "XP Gain": "5,369,570",
  "Damage": "5,846,810"
}`;

export function ExampleCards() {
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="bg-blue-50 border-blue-200">
        <Typography variant="h3" className="text-blue-900 mb-2">
          Exemplo: Formato JSON
        </Typography>
        <pre className="text-xs text-blue-800 overflow-x-auto">
          {jsonExample}
        </pre>
      </Card>

      <Card className="bg-green-50 border-green-200">
        <Typography variant="h3" className="text-green-900 mb-2">
          Exemplo: Formato Texto
        </Typography>
        <pre className="text-xs text-green-800 overflow-x-auto">
          {textExample}
        </pre>
      </Card>
    </div>
  );
}