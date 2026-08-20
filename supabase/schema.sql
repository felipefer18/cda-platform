-- CDA Platform V3A — schema
-- Rode este script inteiro no SQL Editor do Supabase (Dashboard > SQL Editor > New query)

CREATE TABLE IF NOT EXISTS cdas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  nome TEXT NOT NULL,
  -- Único código do CDA (usado pelos CDAs "Dipes"/corporativo). NULL para CDAs
  -- de promoção, que em vez disso usam as 3 colunas de verba abaixo.
  codigo_lc_issqn TEXT UNIQUE,
  descricao TEXT,

  tipo TEXT NOT NULL CHECK (tipo IN ('corporativo', 'promoção')),
  categoria_lc TEXT,
  retem_inss BOOLEAN NOT NULL DEFAULT false,

  -- Códigos de verba dos CDAs de promoção (planilha "Consulta de CDA V3A").
  -- Cada CDA de promoção pode ter até 3 códigos distintos, nenhum garantido
  -- presente em 100% dos registros — por isso ficam em colunas próprias em
  -- vez de forçar um único codigo_lc_issqn.
  verba_dimac TEXT,
  verba_internalizada TEXT,
  verba_endomarketing TEXT,
  verba_portaria808 TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL
);

CREATE INDEX IF NOT EXISTS idx_cdas_nome ON cdas (nome);
CREATE INDEX IF NOT EXISTS idx_cdas_codigo ON cdas (codigo_lc_issqn);
CREATE INDEX IF NOT EXISTS idx_cdas_tipo ON cdas (tipo);
CREATE INDEX IF NOT EXISTS idx_cdas_deleted ON cdas (deleted_at);

-- updated_at automático
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_cdas_updated_at ON cdas;
CREATE TRIGGER trg_cdas_updated_at
  BEFORE UPDATE ON cdas
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Row Level Security: homepage e admin são públicos (sem login),
-- então liberamos leitura/escrita para a chave anon.
ALTER TABLE cdas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cdas_select_all" ON cdas;
CREATE POLICY "cdas_select_all" ON cdas FOR SELECT USING (true);

DROP POLICY IF EXISTS "cdas_insert_all" ON cdas;
CREATE POLICY "cdas_insert_all" ON cdas FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "cdas_update_all" ON cdas;
CREATE POLICY "cdas_update_all" ON cdas FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "cdas_delete_all" ON cdas;
CREATE POLICY "cdas_delete_all" ON cdas FOR DELETE USING (true);
