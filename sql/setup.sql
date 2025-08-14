-- =============================================
-- SETUP DO BANCO DE DADOS - SUPABASE
-- =============================================

-- Criar tabela de personagens
CREATE TABLE IF NOT EXISTS characters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(255) NOT NULL,
  level INTEGER NOT NULL,
  vocation VARCHAR(100),
  world VARCHAR(100),
  sex VARCHAR(10),
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, name)
);

-- Criar tabela de registros
CREATE TABLE IF NOT EXISTS records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  character_id UUID REFERENCES characters(id) ON DELETE SET NULL,
  data JSONB NOT NULL,
  is_public BOOLEAN DEFAULT false,
  has_bestiary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_characters_user_id ON characters(user_id);
CREATE INDEX IF NOT EXISTS idx_characters_name ON characters(name);
CREATE INDEX IF NOT EXISTS idx_characters_is_active ON characters(is_active);
CREATE INDEX IF NOT EXISTS idx_characters_created_at ON characters(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_records_user_id ON records(user_id);
CREATE INDEX IF NOT EXISTS idx_records_character_id ON records(character_id);
CREATE INDEX IF NOT EXISTS idx_records_is_public ON records(is_public);
CREATE INDEX IF NOT EXISTS idx_records_has_bestiary ON records(has_bestiary);
CREATE INDEX IF NOT EXISTS idx_records_created_at ON records(created_at DESC);

-- Habilitar RLS (Row Level Security)
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE records ENABLE ROW LEVEL SECURITY;

-- =============================================
-- POLÍTICAS DE SEGURANÇA (RLS)
-- =============================================

-- POLÍTICAS PARA CHARACTERS
-- Política: Usuários podem ver seus próprios personagens
CREATE POLICY "Users can view own characters" 
ON characters 
FOR SELECT 
USING (auth.uid() = user_id);

-- Política: Usuários podem criar seus próprios personagens
CREATE POLICY "Users can create own characters" 
ON characters 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Política: Usuários podem atualizar seus próprios personagens
CREATE POLICY "Users can update own characters" 
ON characters 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Política: Usuários podem deletar seus próprios personagens
CREATE POLICY "Users can delete own characters" 
ON characters 
FOR DELETE 
USING (auth.uid() = user_id);

-- Política: Personagens de registros públicos são visíveis para todos
-- CRÍTICO: Esta política permite que usuários vejam personagens de outros usuários
-- APENAS quando esses personagens estão associados a registros públicos
-- Sem esta política, registros públicos aparecerão como "personagem não identificado"
CREATE POLICY "Characters of public records are viewable by everyone" 
ON characters 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM records 
    WHERE records.character_id = characters.id 
    AND records.is_public = true
  )
);

-- POLÍTICAS PARA RECORDS
-- Política: Usuários podem ver seus próprios registros
CREATE POLICY "Users can view own records" 
ON records 
FOR SELECT 
USING (auth.uid() = user_id);

-- Política: Usuários podem criar seus próprios registros
CREATE POLICY "Users can create own records" 
ON records 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Política: Usuários podem atualizar seus próprios registros
CREATE POLICY "Users can update own records" 
ON records 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Política: Usuários podem deletar seus próprios registros
CREATE POLICY "Users can delete own records" 
ON records 
FOR DELETE 
USING (auth.uid() = user_id);

-- Política: Registros públicos são visíveis para todos (incluindo usuários não autenticados)
CREATE POLICY "Public records are viewable by everyone" 
ON records 
FOR SELECT 
USING (is_public = true);

-- =============================================
-- FUNÇÃO E TRIGGER PARA ATUALIZAR updated_at
-- =============================================

-- Criar função para atualizar o campo updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $function$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$function$ LANGUAGE plpgsql;

-- Criar triggers que chamam a função antes de cada UPDATE
CREATE TRIGGER update_characters_updated_at 
  BEFORE UPDATE ON characters
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_records_updated_at 
  BEFORE UPDATE ON records
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- PERMISSÕES ADICIONAIS (OPCIONAL)
-- =============================================

-- Garantir que a tabela tem as permissões corretas
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- =============================================
-- DADOS DE EXEMPLO (OPCIONAL - REMOVA EM PRODUÇÃO)
-- =============================================

-- Inserir um registro de exemplo (substitua USER_ID_AQUI pelo ID de um usuário real)
-- INSERT INTO records (user_id, data, is_public) 
-- VALUES (
--   'USER_ID_AQUI'::uuid,
--   '{"titulo": "Exemplo de Registro", "descricao": "Este é um registro de exemplo", "tags": ["exemplo", "teste"]}'::jsonb,
--   true
-- );

-- =============================================
-- VERIFICAÇÃO DO SETUP
-- =============================================

-- Para verificar se tudo foi criado corretamente, execute:
-- SELECT * FROM records;
-- SELECT schemaname, tablename, policyname FROM pg_policies WHERE tablename = 'records';