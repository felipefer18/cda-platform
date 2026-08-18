-- CDA Platform V3A — seed inicial
-- Rode depois de supabase/schema.sql.
--
-- IMPORTANTE: seus documentos de especificação citam ~150 CDAs (76 da planilha
-- "Dipes.xlsx" + ~75 da "Consulta PDF V3A"), mas só continham 3 registros de
-- exemplo completos — o restante não foi fornecido, então não foi inventado aqui.
-- Os 3 CDAs abaixo são os únicos confirmados pelo seu documento original.
--
-- Para popular o resto: abra /admin no app rodando, use "Importar Excel" e
-- suba o Dipes.xlsx e a planilha de Consulta PDF originais — o parser em
-- components/ExcelUpload.tsx já espera as colunas dessas planilhas
-- (NOME DO CDA, CDA M&P, DESCRITIVO ATUALIZADO, CÓDIGO LC 116, RETÉM INSS?).

INSERT INTO cdas (nome, codigo_lc_issqn, descricao, tipo, categoria_lc, retem_inss)
VALUES
(
  'CAPITAL HUMANO',
  '1379',
  'Evento destina-se ao pagamento de pessoa jurídica ou cooperativa. Evento para registrar gastos com pessoal de apoio (recepcionistas, mestre de cerimônia, copeiras, seguranças, serventes, pessoal de limpeza, manobristas, brigadistas, estivas e congêneres) contratados para viabilizar eventos corporativos de mobilização e/ou premiação, subcontratados/adquiridos por empresa de organização e logística de eventos.',
  'corporativo',
  '17.05',
  false
),
(
  'MONTAGEM DE PALCO',
  '1381',
  'Evento destina-se ao pagamento de pessoa jurídica ou cooperativa. Para registrar gastos com montagem de palco, utilizado em eventos corporativos de mobilização e/ou premiação, subcontratados/adquiridos por empresa de organização e logística de eventos.',
  'corporativo',
  '3.05',
  true
),
(
  'LOCAÇÃO DE ESPAÇO',
  '1382',
  'O evento destina-se ao pagamento de pessoa jurídica ou cooperativa. Para registrar gastos com aluguel de espaço (sala, auditórios internos ou externos, teatro, etc), para realização de eventos de mobilização e/ou premiação, subcontratados/adquiridos por empresa de organização e logística de eventos.',
  'corporativo',
  'FATURA',
  false
)
ON CONFLICT (codigo_lc_issqn) DO NOTHING;
