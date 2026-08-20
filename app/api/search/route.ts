import { getSupabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

function escapeForIlike(value: string) {
  return value.replace(/[%,()]/g, ' ').trim();
}

const VERBA_COLUMN: Record<string, string> = {
  dimac: 'verba_dimac',
  internalizada: 'verba_internalizada',
  endomarketing: 'verba_endomarketing',
  portaria808: 'verba_portaria808',
};

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const q = escapeForIlike(searchParams.get('q') || '');
  const filtro = searchParams.get('tipo') || 'todos';
  const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10) || 20, 100);
  const offset = Math.max(parseInt(searchParams.get('offset') || '0', 10) || 0, 0);

  try {
    let query = getSupabase()
      .from('cdas')
      .select('*', { count: 'exact' })
      .is('deleted_at', null);

    if (filtro === 'dipes') {
      query = query.eq('tipo', 'corporativo');
    } else if (VERBA_COLUMN[filtro]) {
      query = query.eq('tipo', 'promoção').not(VERBA_COLUMN[filtro], 'is', null);
    }

    if (q) {
      query = query.or(
        `nome.ilike.%${q}%,codigo_lc_issqn.ilike.%${q}%,categoria_lc.ilike.%${q}%,descricao.ilike.%${q}%,verba_dimac.ilike.%${q}%,verba_internalizada.ilike.%${q}%,verba_endomarketing.ilike.%${q}%,verba_portaria808.ilike.%${q}%`
      );
    }

    query = query.order('nome', { ascending: true }).range(offset, offset + limit - 1);

    const { data, count, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      data: data || [],
      count: count || 0,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Erro ao buscar CDAs' }, { status: 500 });
  }
}
