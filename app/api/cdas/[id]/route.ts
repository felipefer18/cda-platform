import { getSupabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

// PUT: Atualizar CDA
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const { data, error } = await getSupabase()
      .from('cdas')
      .update(body)
      .eq('id', id)
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'CDA não encontrado' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: data[0],
    });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: 'Erro ao atualizar CDA' }, { status: 500 });
  }
}

// DELETE: Deletar CDA (soft delete)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { error } = await getSupabase()
      .from('cdas')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'CDA deletado',
    });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: 'Erro ao deletar CDA' }, { status: 500 });
  }
}
