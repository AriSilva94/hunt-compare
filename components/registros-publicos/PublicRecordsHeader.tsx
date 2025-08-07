import { Typography } from "@/components/ui/Typography";

export function PublicRecordsHeader() {
  return (
    <div className="mb-8">
      <Typography variant="h1">Registros Públicos</Typography>
      <Typography variant="lead" className="mt-2">
        Explore todos os registros compartilhados publicamente pela comunidade
      </Typography>
    </div>
  );
}