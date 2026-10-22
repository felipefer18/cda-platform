-- Migração: observações dos CDAs DIPES, exceção do INSS e Retém INSS "em branco".
-- Rode no SQL Editor do Supabase.

-- Retém INSS passa a aceitar vazio (NULL = a planilha não informa).
ALTER TABLE cdas ALTER COLUMN retem_inss DROP NOT NULL;

ALTER TABLE cdas ADD COLUMN IF NOT EXISTS observacoes TEXT;
ALTER TABLE cdas ADD COLUMN IF NOT EXISTS outras_observacoes TEXT;
ALTER TABLE cdas ADD COLUMN IF NOT EXISTS excecao_inss TEXT;
