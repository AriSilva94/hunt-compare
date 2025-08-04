import { AuthForm } from "@/components/auth/AuthForm";
import { createMetadata } from "@/lib/seo";
import { Typography } from "@/components/ui/Typography";
import Link from "next/link";

export const metadata = createMetadata({
  title: "Login",
  description: "Entre na sua conta Hunt Compare para gerenciar seus registros de hunt do Tibia e acompanhar suas estatísticas de jogo.",
  path: "/login"
});

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 theme-transition">
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
              <span className="text-white text-2xl font-bold">🎮</span>
            </div>
            <Typography variant="h1" className="mb-2">
              Bem-vindo de volta!
            </Typography>
            <Typography variant="p">
              Entre na sua conta para continuar analisando suas hunts do Tibia
            </Typography>
          </div>

          {/* Auth Form */}
          <AuthForm />

          {/* Footer Links */}
          <div className="mt-8 text-center space-y-4">
            <div className="flex items-center justify-center gap-4">
              <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                <Typography variant="small">← Voltar ao início</Typography>
              </Link>
              <Typography variant="small">•</Typography>
              <Link
                href="/registros-publicos"
                className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                <Typography variant="small">Ver registros públicos</Typography>
              </Link>
            </div>
          </div>

          {/* Features Preview */}
          <div className="mt-12 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-white/20 dark:border-gray-700/20">
            <Typography variant="h3" className="mb-4 text-center">
              ✨ O que você pode fazer:
            </Typography>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400">📊</span>
                </div>
                <Typography variant="small">Analise XP/hora, lucro e eficiência das suas hunts</Typography>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400">⚔️</span>
                </div>
                <Typography variant="small">Compare performance de diferentes armas</Typography>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 dark:text-purple-400">📈</span>
                </div>
                <Typography variant="small">Visualize dados com gráficos interativos</Typography>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 dark:text-orange-400">🌐</span>
                </div>
                <Typography variant="small">Compartilhe suas melhores sessões</Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
