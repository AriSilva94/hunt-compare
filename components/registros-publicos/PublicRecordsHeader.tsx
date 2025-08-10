import { Typography } from "@/components/ui/Typography";

export function PublicRecordsHeader() {
  return (
    <div className="mb-6">
      <Typography variant="h2">Registros Públicos</Typography>
      <Typography variant="small" className="mt-1 text-gray-600 dark:text-gray-400">
        Explore todos os registros compartilhados publicamente pela comunidade
      </Typography>
    </div>
  );
}