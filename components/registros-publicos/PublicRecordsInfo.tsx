import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";

export function PublicRecordsInfo() {
  return (
    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-blue-50 border-blue-200">
        <Typography variant="h3" className="text-blue-900 mb-2">
          📊 Sobre os Registros Públicos
        </Typography>
        <Typography variant="small" className="text-blue-800">
          Os registros públicos são dados compartilhados por usuários que
          decidiram torná-los acessíveis a todos. Qualquer pessoa pode
          visualizar estes registros sem necessidade de autenticação.
        </Typography>
      </Card>

      <Card className="bg-green-50 border-green-200">
        <Typography variant="h3" className="text-green-900 mb-2">
          🔗 Como Compartilhar
        </Typography>
        <Typography variant="small" className="text-green-800">
          Para tornar seus registros públicos, marque a opção &quot;Tornar
          este registro público&quot; ao criar um novo registro. Você receberá
          um link único que pode ser compartilhado com qualquer pessoa.
        </Typography>
      </Card>
    </div>
  );
}