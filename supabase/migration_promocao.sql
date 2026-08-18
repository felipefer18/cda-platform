-- Migração: adiciona suporte aos CDAs de promoção (3 códigos de verba,
-- codigo_lc_issqn passa a ser opcional). Rode no SQL Editor do Supabase —
-- seguro rodar mesmo já tendo dados na tabela (usa IF NOT EXISTS / DROP NOT NULL).

ALTER TABLE cdas ALTER COLUMN codigo_lc_issqn DROP NOT NULL;

ALTER TABLE cdas ADD COLUMN IF NOT EXISTS verba_dimac TEXT;
ALTER TABLE cdas ADD COLUMN IF NOT EXISTS verba_internalizada TEXT;
ALTER TABLE cdas ADD COLUMN IF NOT EXISTS verba_endomarketing TEXT;
