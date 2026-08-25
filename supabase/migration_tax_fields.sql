-- Migração: campos de imposto e detalhes extras dos CDAs de promoção
-- (aba "Tabela CDA" da planilha de trabalho). Rode no SQL Editor do Supabase.

ALTER TABLE cdas ADD COLUMN IF NOT EXISTS irpj NUMERIC(5,2);
ALTER TABLE cdas ADD COLUMN IF NOT EXISTS cofins NUMERIC(5,2);
ALTER TABLE cdas ADD COLUMN IF NOT EXISTS csll NUMERIC(5,2);
ALTER TABLE cdas ADD COLUMN IF NOT EXISTS pis_pasep NUMERIC(5,2);
ALTER TABLE cdas ADD COLUMN IF NOT EXISTS retem_iss BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE cdas ADD COLUMN IF NOT EXISTS encaminhamentos TEXT;
