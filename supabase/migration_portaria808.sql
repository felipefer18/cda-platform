-- Migração: adiciona a coluna de verba Portaria 808.
-- Rode no SQL Editor do Supabase.

ALTER TABLE cdas ADD COLUMN IF NOT EXISTS verba_portaria808 TEXT;
