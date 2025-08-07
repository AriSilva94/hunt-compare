import { Typography } from "@/components/ui/Typography";
import Link from "next/link";

export function RecordsHeader() {
  return (
    <div className="flex justify-between items-center mb-6">
      <Typography variant="h2">Seus Registros</Typography>
      <Link
        href="/cadastro"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
      >
        <span className="mr-2">+</span>
        Novo Registro
      </Link>
    </div>
  );
}