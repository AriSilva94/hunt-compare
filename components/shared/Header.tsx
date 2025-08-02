"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

export function Header() {
  const { user } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await authService.signOut();
    router.push("/login");
  };

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-center h-auto lg:h-16 gap-4 py-2">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              <Image
                src={"/logo.png"}
                alt="Hunt Compare Logo"
                width={40}
                height={40}
              />
            </Link>

            <div className="ml-10 flex items-baseline space-x-4">
              {/* Links visíveis para usuários autenticados */}
              {user && (
                <>
                  <Link
                    href="/home"
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Home
                  </Link>
                  <Link
                    href="/cadastro"
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Cadastro
                  </Link>
                  <Link
                    href="/comparar"
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Comparar
                  </Link>
                </>
              )}

              {/* Link sempre visível para registros públicos */}
              <Link
                href="/registros-publicos"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Registros Públicos
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">{user.email}</span>
                <Button size="sm" variant="secondary" onClick={handleSignOut}>
                  Sair
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button size="sm">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
