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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            flex flex-col lg:flex-row justify-between items-center gap-4 lg:gap-0 relative
            transition-all duration-300 ease-in-out
            ${isScrolled ? "h-auto lg:h-14" : "h-auto lg:h-16"}
          `}
        >
          <div className="flex items-center justify-between w-full lg:w-auto">
            <Link
              href="/"
              className="text-xl font-bold text-gray-900 dark:text-white"
            >
              <Image
                src={"/logo.png"}
                alt="Hunt Compare Logo"
                width={isScrolled ? 36 : 40}
                height={isScrolled ? 36 : 40}
                className="transition-all duration-300 ease-in-out hover:scale-110"
              />
            </Link>

            {/* Mobile Right Side - ThemeToggle and Hamburger */}
            <div className="lg:hidden flex items-center space-x-3">
              <ThemeToggle />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="flex flex-col items-center justify-center w-8 h-8 space-y-1 focus:outline-none"
                aria-label="Toggle menu"
              >
                <span
                  className={`w-6 h-0.5 bg-gray-700 dark:bg-gray-300 transition-all duration-300 ${
                    isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
                  }`}
                ></span>
                <span
                  className={`w-6 h-0.5 bg-gray-700 dark:bg-gray-300 transition-all duration-300 ${
                    isMobileMenuOpen ? "opacity-0" : ""
                  }`}
                ></span>
                <span
                  className={`w-6 h-0.5 bg-gray-700 dark:bg-gray-300 transition-all duration-300 ${
                    isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                ></span>
              </button>
            </div>

            <div className="ml-10 hidden lg:flex items-baseline space-x-4">
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

          <div className="hidden lg:flex items-center space-x-3">
            <ThemeToggle />
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {user.email}
                </span>
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

          {/* Mobile Menu */}
          <div
            className={`lg:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out ${
              isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-3">
              {/* Mobile Navigation Links */}
              {user && (
                <>
                  <Link
                    href="/home"
                    className="block text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    href="/cadastro"
                    className="block text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Cadastro
                  </Link>
                  <Link
                    href="/comparar"
                    className="block text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Comparar
                  </Link>
                </>
              )}

              <Link
                href="/registros-publicos"
                className="block text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Registros Públicos
              </Link>

              {/* Mobile Actions */}
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                {user ? (
                  <div className="flex items-center justify-between space-x-3">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {user.email}
                    </span>
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
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button size="sm">Login</Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
