-- Tabela para armazenar imagens ausentes
CREATE TABLE missing_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_name VARCHAR(255) NOT NULL,
  image_url TEXT NOT NULL,
  monster_name VARCHAR(255) NOT NULL,
  first_detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  detection_count INTEGER DEFAULT 1,
  is_resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX idx_missing_images_image_name ON missing_images(image_name);
CREATE INDEX idx_missing_images_monster_name ON missing_images(monster_name);
CREATE INDEX idx_missing_images_is_resolved ON missing_images(is_resolved);
CREATE INDEX idx_missing_images_last_detected ON missing_images(last_detected_at);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
CREATE TRIGGER update_missing_images_updated_at
    BEFORE UPDATE ON missing_images
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Política RLS (Row Level Security) - permite acesso a usuários autenticados e anônimos para scripts
ALTER TABLE missing_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all to view missing images" ON missing_images
    FOR SELECT USING (true);

CREATE POLICY "Allow all to insert missing images" ON missing_images
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all to update missing images" ON missing_images
    FOR UPDATE USING (true);