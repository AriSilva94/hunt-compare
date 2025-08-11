-- Adicionar coluna has_bestiary à tabela records
ALTER TABLE public.records 
ADD COLUMN IF NOT EXISTS has_bestiary BOOLEAN DEFAULT false;

-- Criar índice para melhor performance nas consultas
CREATE INDEX IF NOT EXISTS idx_records_has_bestiary ON public.records USING btree (has_bestiary) TABLESPACE pg_default;

-- Comentário para documentar o propósito da coluna
COMMENT ON COLUMN public.records.has_bestiary IS 'Indica se o registro possui bestiário completo dos monstros eliminados';