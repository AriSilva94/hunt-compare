import { Typography } from "@/components/ui/Typography";

export function CadastroHeader() {
  return (
    <div className="mb-8">
      <Typography variant="h1">Novo Registro</Typography>
      <Typography variant="lead" className="mt-2">
        Crie um novo registro usando JSON ou formato de texto
      </Typography>
    </div>
  );
}