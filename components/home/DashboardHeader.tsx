import { Typography } from "@/components/ui/Typography";

export function DashboardHeader() {
  return (
    <div className="mb-8">
      <Typography variant="h1">Dashboard</Typography>
      <Typography variant="lead" className="mt-2">
        Gerencie seus registros de dados
      </Typography>
    </div>
  );
}