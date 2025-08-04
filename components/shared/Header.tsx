"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import Image from "next/image";
import { useEffect, useState } from "react";

export function Header() {
  const { user } = useAuth();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animação de entrada
    const timer = setTimeout(() => setIsVisible(true), 100);

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const handleSignOut = async () => {
    await authService.signOut();
    router.push("/login");
  };

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50 
        bg-white/95 dark:bg-gray-800/95 
        backdrop-blur-md 
        theme-transition
        transition-all duration-300 ease-in-out
        transform
        ${
          isVisible
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        }
        ${
          isScrolled
            ? "shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50 py-2"
            : "shadow-sm py-3"
        }
      `}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`
            flex flex-col lg:flex-row justify-between items-center gap-4 
            transition-all duration-300 ease-in-out
            ${isScrolled ? "h-auto lg:h-14" : "h-auto lg:h-16"}
          `}
        >
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold text-gray-900 dark:text-white"
            >
              <Image
                unoptimized
                src={"/logo.png"}
                alt="Hunt Compare Logo"
                width={isScrolled ? 36 : 40}
                height={isScrolled ? 36 : 40}
                className="transition-all duration-300 ease-in-out hover:scale-110"
              />
            </Link>

            <div className="ml-10 flex items-baseline space-x-4">
              {/* Links visíveis para usuários autenticados */}
              {user && (
                <>
                  <Link
                    href="/home"
                    className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Home
                  </Link>
                  <Link
                    href="/cadastro"
                    className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Cadastro
                  </Link>
                  <Link
                    href="/comparar"
                    className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Comparar
                  </Link>
                </>
              )}

              {/* Link sempre visível para registros públicos */}
              <Link
                href="/registros-publicos"
                className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Registros Públicos
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <ThemeToggle />
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">{user.email}</span>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleSignOut}
                  className="cursor-pointer"
                >
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
