# 🎮 Hunt Compare

Uma aplicação moderna para análise de sessões de hunt do Tibia, desenvolvida com Next.js e Supabase. Compare sessões, analise performance de armas e otimize sua gameplay com dados detalhados e visualizações interativas.

## ✨ Funcionalidades

### 🏠 Dashboard Principal
- Visão geral das sessões de hunt com estatísticas consolidadas
- Gerenciamento de personagens do Tibia
- Filtros avançados por período, tipo de sessão e personagem
- Cards estatísticos com XP/hora, lucro e eficiência

### 📊 Análise Detalhada
- **Gráficos Interativos**: Visualizações em barras, linhas e pizza
- **Comparação de Sessões**: Compare múltiplas hunts simultaneamente
- **Métricas Avançadas**: XP/hora, lucro, waste, eficiência por arma
- **Insights Automáticos**: Sugestões baseadas nos dados

### ⚔️ Sistema de Armas
- Catálogo completo de armas do Tibia
- Análise de proficiências por tipo de arma
- Comparação de performance entre diferentes armas
- Sistema de perks e modificadores

### 👥 Registros Públicos
- Visualização de sessões compartilhadas pela comunidade
- Inspiração através de hunts de outros jogadores
- Sistema de privacidade configurável

### 🔐 Autenticação
- Sistema de login seguro via Supabase Auth
- Gerenciamento de usuários e sessões
- Proteção de rotas privadas

## 🛠️ Tecnologias

### Frontend
- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework de CSS utilitário
- **Lucide React** - Ícones modernos
- **Recharts** - Biblioteca de gráficos
- **React Hook Form + Zod** - Validação de formulários

### Backend & Database
- **Supabase** - Backend as a Service
- **PostgreSQL** - Banco de dados relacional
- **Row Level Security** - Segurança de dados

### DevTools
- **ESLint** - Linting de código
- **TypeScript** - Verificação de tipos
- **PostCSS** - Processamento de CSS

## 🚀 Início Rápido

### Pré-requisitos
- Node.js 18+ 
- npm, yarn, pnpm ou bun

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/hunt-compare.git
cd hunt-compare
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env.local
```

Configure as seguintes variáveis:
```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. **Execute o servidor de desenvolvimento**
```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

5. **Acesse a aplicação**
Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📁 Estrutura do Projeto

```
hunt-compare/
├── app/                          # App Router do Next.js
│   ├── (auth)/                   # Rotas de autenticação
│   ├── (protected)/              # Rotas protegidas
│   ├── api/                      # API routes
│   └── registros-publicos/       # Página pública
├── components/                   # Componentes React
│   ├── auth/                     # Componentes de autenticação
│   ├── cadastro/                 # Componentes de cadastro
│   ├── home/                     # Componentes do dashboard
│   ├── shared/                   # Componentes compartilhados
│   └── ui/                       # Componentes de interface
├── hooks/                        # Custom hooks
├── lib/                          # Utilitários e configurações
├── services/                     # Serviços de API
├── types/                        # Definições de tipos
├── utils/                        # Funções utilitárias
└── public/                       # Arquivos estáticos
```

## 🎯 Scripts Disponíveis

```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build de produção
npm run start        # Inicia servidor de produção
npm run lint         # Executa o linter
```

## 🔧 Configuração do Banco de Dados

A aplicação utiliza Supabase como backend. Execute o script SQL para configurar as tabelas:

```sql
-- Veja o arquivo sql/setup.sql para a configuração completa
```

## 📝 Como Usar

### 1. **Login/Cadastro**
- Acesse a página de login
- Crie uma conta ou faça login com suas credenciais

### 2. **Adicionar Personagens**
- Na dashboard, clique em "Adicionar Personagem"
- Digite o nome do seu personagem do Tibia
- O sistema validará e importará os dados automaticamente

### 3. **Cadastrar Sessões**
- Vá para "Cadastro" no menu
- Cole os dados da sua sessão de hunt do Tibia
- Selecione a arma utilizada e configure os perks
- Visualize a prévia dos dados e confirme o cadastro

### 4. **Analisar Dados**
- Na dashboard, visualize suas estatísticas
- Use os filtros para segmentar os dados
- Compare diferentes sessões
- Acesse detalhes de cada hunt individual

### 5. **Compartilhar**
- Torne suas melhores sessões públicas
- Explore registros de outros jogadores
- Inspire-se com diferentes estratégias de hunt

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Ari Silva**
- Email: ariovaldo.bsjunior@gmail.com
- Twitter: [@hunt_compare](https://twitter.com/hunt_compare)

## 🙏 Agradecimentos

- Comunidade Tibia pela inspiração
- CipSoft pelo jogo Tibia
- Tibia.com API para dados dos personagens
- Vercel pela hospedagem
- Supabase pelo backend

---

⭐ Se este projeto te ajudou, considere dar uma estrela!
