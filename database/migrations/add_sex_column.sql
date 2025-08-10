-- Adicionar coluna 'sex' na tabela characters
ALTER TABLE characters 
ADD COLUMN sex VARCHAR(10);

-- Comentário explicativo
COMMENT ON COLUMN characters.sex IS 'Sexo do personagem (Male/Female)';