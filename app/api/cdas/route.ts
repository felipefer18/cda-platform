import { getSupabase } from '@/lib/supabase';
import { CDAInput } from '@/lib/types';
import { NextRequest, NextResponse } from 'next/server';

function hasText(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

function isValidCDA(body: unknown): body is CDAInput {
  if (!body || typeof body !== 'object') return false;
  const b = body as Record<string, unknown>;
  const hasAnyCode =
    hasText(b.codigo_lc_issqn) ||
    hasText(b.verba_dimac) ||
    hasText(b.verba_internalizada) ||
    hasText(b.verba_endomarketing) ||
    hasText(b.verba_portaria808);
  return hasText(b.nome) && hasAnyCode && (b.tipo === 'corporativo' || b.tipo === 'promoção');
}

// GET: Listar todos CDAs (admin)
export async function GET() {
  try {
    const { data, error } = await getSupabase()
      .from('cdas')
      .select('*')
      .is('deleted_at', null)
      .order('nome', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Erro ao listar CDAs' }, { status: 500 });
  }
}

// POST: Criar CDA único ou batch import
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Batch import
    if (Array.isArray(body.cdas)) {
      const validCdas = body.cdas.filter(isValidCDA);
      const errors = body.cdas.length - validCdas.length;

      if (validCdas.length === 0) {
        return NextResponse.json(
          { error: 'Nenhum CDA válido no lote enviado' },
          { status: 400 }
        );
      }

      const { data, error } = await getSupabase()
        .from('cdas')
        .upsert(validCdas, { onConflict: 'codigo_lc_issqn' })
        .select();

      if (error) throw error;

      return NextResponse.json({
        success: true,
        inserted: data?.length || 0,
        errors,
        message: `${data?.length || 0} CDAs processados com sucesso`,
      });
    }

    // Single CDA
    if (!isValidCDA(body)) {
      return NextResponse.json(
        { error: 'Nome, tipo e ao menos um código são obrigatórios' },
        { status: 400 }
      );
    }

    const { data, error } = await getSupabase().from('cdas').insert([body]).select();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: data?.[0],
    });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Erro ao criar CDA' }, { status: 500 });
  }
}
