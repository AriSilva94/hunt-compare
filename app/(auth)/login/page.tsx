import { AuthForm } from "@/components/auth/AuthForm";
import { createMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata = createMetadata({
  title: "Login",
  description: "Entre na sua conta Hunt Compare para gerenciar seus registros de hunt do Tibia e acompanhar suas estatísticas de jogo.",
  path: "/login"
});

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
              <span className="text-white text-2xl font-bold">🎮</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Bem-vindo de volta!
            </h1>
            <p className="text-gray-600">
              Entre na sua conta para continuar analisando suas hunts do Tibia
            </p>
          </div>

          {/* Auth Form */}
          <AuthForm />

          {/* Footer Links */}
          <div className="mt-8 text-center space-y-4">
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <Link href="/" className="hover:text-gray-700 transition-colors">
                ← Voltar ao início
              </Link>
              <span>•</span>
              <Link
                href="/registros-publicos"
                className="hover:text-gray-700 transition-colors"
              >
                Ver registros públicos
              </Link>
            </div>
          </div>

          {/* Features Preview */}
          <div className="mt-12 bg-white/50 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              ✨ O que você pode fazer:
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600">📊</span>
                </div>
                <span>Analise XP/hora, lucro e eficiência das suas hunts</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600">⚔️</span>
                </div>
                <span>Compare performance de diferentes armas</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600">📈</span>
                </div>
                <span>Visualize dados com gráficos interativos</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600">🌐</span>
                </div>
                <span>Compartilhe suas melhores sessões</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
