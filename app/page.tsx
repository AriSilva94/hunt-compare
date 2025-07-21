import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function LandingPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4">
      <div className="max-w-3xl text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Sistema de Gerenciamento de Registros
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Gerencie seus dados JSON de forma simples, segura e organizada. Crie
          registros privados ou públicos e compartilhe com facilidade.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/login">
            <Button size="lg">Começar Agora</Button>
          </Link>
          <Link href="/home">
            <Button size="lg" variant="secondary">
              Acessar Sistema
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
