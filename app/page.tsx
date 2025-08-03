import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Hunt Compare - Analise suas Sessões de Hunt do Tibia",
  description:
    "Analise suas sessões de hunt do Tibia com gráficos detalhados, compare armas e proficiências, calcule XP/h e lucro, e otimize sua performance no jogo.",
});

export default function LandingPage() {
  return (
    <div className="min-h-[calc(100vh-64px)]">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-indigo-600/5 to-purple-600/5"></div>
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-6">
              🎮 Hunt Compare
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Analise suas{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              hunts
            </span>
            <br />
            do Tibia como nunca
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Compare sessões de hunt, analise performance de armas e otimize sua
            gameplay com dados detalhados e visualizações interativas.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/login">
              <Button size="lg" className="text-lg px-8 py-4">
                🚀 Começar Análise
              </Button>
            </Link>
            <Link href="/registros-publicos">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8 py-4"
              >
                👀 Ver Exemplos Públicos
              </Button>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">📊</div>
              <div className="text-sm text-gray-600">Análise Detalhada</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">⚔️</div>
              <div className="text-sm text-gray-600">Comparação de Armas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">📈</div>
              <div className="text-sm text-gray-600">Gráficos Interativos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">🔄</div>
              <div className="text-sm text-gray-600">Comparações Múltiplas</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Recursos Principais
            </h2>
            <p className="text-xl text-gray-600">
              Tudo que você precisa para analisar suas hunts do Tibia
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Análise de Performance
              </h3>
              <p className="text-gray-600">
                Visualize XP/hora, lucro, eficiência e outros indicadores
                importantes das suas sessões de hunt.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">⚔️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Comparação de Armas
              </h3>
              <p className="text-gray-600">
                Compare diferentes armas e suas proficiências para otimizar seu
                setup de hunt.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Gráficos Dinâmicos
              </h3>
              <p className="text-gray-600">
                Visualizações interativas em barras, linhas e pizza para melhor
                compreensão dos dados.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Comparações Múltiplas
              </h3>
              <p className="text-gray-600">
                Compare até múltiplas sessões simultaneamente para identificar
                padrões e melhorias.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🌐</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Compartilhamento
              </h3>
              <p className="text-gray-600">
                Torne seus registros públicos e compartilhe suas melhores hunts
                com a comunidade.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Insights Automáticos
              </h3>
              <p className="text-gray-600">
                Receba sugestões e insights automáticos baseados nos seus dados
                de hunt.
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pronto para otimizar suas hunts?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Comece agora mesmo a analisar seus dados e descubra novos insights
            sobre sua gameplay.
          </p>
          <Link href="/login">
            <Button
              size="lg"
              className="bg-blue-500 text-blue-600 hover:bg-blue-50 text-lg px-8 py-4"
            >
              Começar Agora - É Grátis! 🎮
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
