import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Hunt Compare - Analise suas Sessões de Hunt do Tibia",
  description:
    "Analise suas sessões de hunt do Tibia com gráficos detalhados, compare armas e proficiências, calcule XP/h e lucro, e otimize sua performance no jogo.",
});

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-20 theme-transition">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-indigo-600/5 to-purple-600/5 dark:from-blue-400/10 dark:via-indigo-400/10 dark:to-purple-400/10"></div>
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 mb-6">
              🎮 Hunt Compare
            </span>
          </div>

          <Typography variant="h1" className="text-5xl md:text-6xl mb-6 leading-tight">
            Analise suas{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              hunts
            </span>
            <br />
            do Tibia como nunca
          </Typography>

          <Typography variant="lead" className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed">
            Compare sessões de hunt, analise performance de armas e otimize sua
            gameplay com dados detalhados e visualizações interativas.
          </Typography>

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
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">📊</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Análise Detalhada</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">⚔️</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Comparação de Armas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">📈</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Gráficos Interativos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">🔄</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Comparações Múltiplas</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 bg-white dark:bg-gray-900 theme-transition">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Typography variant="h2" className="text-3xl md:text-4xl mb-4">
              Recursos Principais
            </Typography>
            <Typography variant="lead" className="text-xl">
              Tudo que você precisa para analisar suas hunts do Tibia
            </Typography>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg dark:hover:shadow-gray-700/50 transition-shadow">
              <div className="text-4xl mb-4">📊</div>
              <Typography variant="h4" className="mb-3">
                Análise de Performance
              </Typography>
              <Typography variant="p">
                Visualize XP/hora, lucro, eficiência e outros indicadores
                importantes das suas sessões de hunt.
              </Typography>
            </Card>

            <Card className="p-6 hover:shadow-lg dark:hover:shadow-gray-700/50 transition-shadow">
              <div className="text-4xl mb-4">⚔️</div>
              <Typography variant="h4" className="mb-3">
                Comparação de Armas
              </Typography>
              <Typography variant="p">
                Compare diferentes armas e suas proficiências para otimizar seu
                setup de hunt.
              </Typography>
            </Card>

            <Card className="p-6 hover:shadow-lg dark:hover:shadow-gray-700/50 transition-shadow">
              <div className="text-4xl mb-4">📈</div>
              <Typography variant="h4" className="mb-3">
                Gráficos Dinâmicos
              </Typography>
              <Typography variant="p">
                Visualizações interativas em barras, linhas e pizza para melhor
                compreensão dos dados.
              </Typography>
            </Card>

            <Card className="p-6 hover:shadow-lg dark:hover:shadow-gray-700/50 transition-shadow">
              <div className="text-4xl mb-4">🔄</div>
              <Typography variant="h4" className="mb-3">
                Comparações Múltiplas
              </Typography>
              <Typography variant="p">
                Compare até múltiplas sessões simultaneamente para identificar
                padrões e melhorias.
              </Typography>
            </Card>

            <Card className="p-6 hover:shadow-lg dark:hover:shadow-gray-700/50 transition-shadow">
              <div className="text-4xl mb-4">🌐</div>
              <Typography variant="h4" className="mb-3">
                Compartilhamento
              </Typography>
              <Typography variant="p">
                Torne seus registros públicos e compartilhe suas melhores hunts
                com a comunidade.
              </Typography>
            </Card>

            <Card className="p-6 hover:shadow-lg dark:hover:shadow-gray-700/50 transition-shadow">
              <div className="text-4xl mb-4">💡</div>
              <Typography variant="h4" className="mb-3">
                Insights Automáticos
              </Typography>
              <Typography variant="p">
                Receba sugestões e insights automáticos baseados nos seus dados
                de hunt.
              </Typography>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Typography variant="h2" className="text-3xl md:text-4xl text-white mb-6">
            Pronto para otimizar suas hunts?
          </Typography>
          <Typography variant="lead" className="text-xl text-blue-100 mb-8">
            Comece agora mesmo a analisar seus dados e descubra novos insights
            sobre sua gameplay.
          </Typography>
          <Link href="/login">
            <Button
              size="lg"
              variant="secondary"
              className="!bg-white !text-blue-600 hover:!bg-blue-50 dark:!bg-gray-800 dark:!text-blue-400 dark:hover:!bg-gray-700 border-0 shadow-lg px-8 py-4 font-semibold"
            >
              Começar Agora - É Grátis! 🎮
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
