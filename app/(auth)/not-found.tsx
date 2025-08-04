"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";

export default function AuthNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card className="p-8 text-center">
          {/* Ícone */}
          <div className="mb-6">
            <span className="text-8xl">🔐</span>
          </div>

          {/* Título */}
          <Typography variant="h2" className="mb-4">
            Página de autenticação não encontrada
          </Typography>
          
          <Typography variant="p" className="mb-8">
            A página de autenticação que você está procurando não existe. 
            Escolha uma das opções abaixo para continuar.
          </Typography>

          {/* Botões de navegação */}
          <div className="space-y-3">
            <Link href="/login" className="block">
              <Button className="w-full">
                🔑 Fazer Login
              </Button>
            </Link>
            
            <Link href="/" className="block">
              <Button variant="secondary" className="w-full">
                🏠 Página Inicial
              </Button>
            </Link>
          </div>

          {/* Link adicional */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <Typography variant="small">
              Novo no Hunt Compare?{" "}
              <Link href="/login" className="text-blue-600 hover:text-blue-800">
                Criar conta
              </Link>
            </Typography>
          </div>
        </Card>
      </div>
    </div>
  );
}