# CDA Platform V3A

Plataforma de busca e gerenciamento de códigos CDA (V3A). Next.js 16 + TypeScript + Tailwind v4 + Supabase.

- `/` — busca pública (sem login), com filtros por tipo e paginação.
- `/admin` — dashboard de gerenciamento (sem login): CRUD manual + import de Excel em lote.

## Setup

### 1. Criar o projeto no Supabase

1. Crie uma conta/projeto em [supabase.com](https://supabase.com).
2. No **SQL Editor**, rode o conteúdo de [`supabase/schema.sql`](supabase/schema.sql) — cria a tabela `cdas`, índices e as políticas de RLS (leitura/escrita liberadas, já que o app não tem login).
3. Em seguida rode [`supabase/seed.sql`](supabase/seed.sql) — insere os 3 CDAs de exemplo confirmados no documento original.
4. Em **Project Settings > API**, copie a **Project URL** e a **anon public key**.

### 2. Configurar variáveis de ambiente

Preencha `.env.local` (já criado na raiz do projeto):

```
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
```

### 3. Rodar localmente

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

### 4. Dados já importados

Os 228 CDAs reais já foram importados: **75 corporativos** (Dipes.xlsx) + **153 de promoção** (mesclados de `cda-data.json` do site do PDF "Consulta de CDA V3A" com a planilha "TABELA EVENTOS CDA - MP 808", que trouxe o código de verba **Portaria 808** e mais 17 CDAs novos). Não é preciso rodar `supabase/seed.sql` — ele só tem 3 registros de exemplo e foi superado pela importação real.

CDAs de promoção têm até 4 códigos de verba: DIMAC, Internalizada, Endomarketing e Portaria 808 — nenhum garantido presente em todos os registros.

Para importar mais CDAs no futuro, use `/admin` → **Importar Excel**. O parser espera estas colunas (ou os nomes alternativos já mapeados em `components/ExcelUpload.tsx`):

| Coluna esperada | Alternativas aceitas |
|---|---|
| `NOME DO CDA` | `Nome` |
| `CDA M &P` | `Código` |
| `DESCRITIVO ATUALIZADO` | `Descrição` |
| `CÓDIGO LC 116` | `categoria_lc` |
| `RETÉM INSS?` (`SIM...`/vazio) | `retem_inss` (boolean) |
| `Verba DIMAC` / `Verba Internalizada` / `Verba Endomarketing` | usados pelos CDAs de promoção, em vez de um código único |

O import faz upsert por `codigo_lc_issqn` quando presente — pode rodar mais de uma vez sem duplicar CDAs corporativos. CDAs de promoção sem `codigo_lc_issqn` não têm chave de deduplicação (usam as 3 colunas de verba, que nem sempre são únicas) — evite reimportar a mesma planilha de promoção duas vezes.

**Nota de qualidade dos dados**: um registro da fonte de promoção ("AQUISIÇÃO DE LIVROS") tem um texto de observação ("EVENTO CDA SERÁ CRIADO - AGUARDANDO...") no lugar do código de Verba Internalizada — isso já vem assim da fonte original, não foi alterado na importação.

## Deploy

```bash
npm i -g vercel   # se ainda não tiver a CLI
vercel link
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel deploy --prod
```

## Estrutura

```
app/
  page.tsx              # Homepage (busca)
  admin/page.tsx         # Admin Dashboard
  api/search/route.ts     # GET busca com filtros
  api/cdas/route.ts       # GET lista / POST criar (single ou batch)
  api/cdas/[id]/route.ts  # PUT atualizar / DELETE soft-delete
components/               # SearchBar, FilterChips, CDACard(Grid), AdminTable, ExcelUpload, EditModal
lib/                      # supabase client, types, utils
supabase/                 # schema.sql, seed.sql
```
