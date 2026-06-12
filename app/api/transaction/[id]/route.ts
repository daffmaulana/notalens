// ============================================================
// DELETE /api/transaction/[id]  → hapus transaksi berdasarkan ID
// GET    /api/transaction/[id]  → detail satu transaksi
//
// Header: Authorization: Bearer <token>
// Hanya pemilik transaksi (user yang scan) yang bisa hapus
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { ApiError } from '@/types';

type Params = { params: Promise<{ id: string }> };

// ── GET /api/transaction/[id] ─────────────────────────────────
export async function GET(req: NextRequest, { params }: Params) {
  const userId = req.headers.get('x-user-id');
  if (!userId) {
    return NextResponse.json<ApiError>({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const transactionId = Number(id);

  const { data: transaction, error } = await supabaseAdmin
    .from('transactions')
    .select(`
      transaction_id,
      user_id,
      workspace_id,
      event_id,
      category,
      merchant_name,
      total_amount,
      tax_amount,
      transaction_date,
      notes,
      receipt_url,
      created_at,
      transaction_items(item_id, item_name, quantity, price)
    `)
    .eq('transaction_id', transactionId)
    .single();

  if (error || !transaction) {
    return NextResponse.json<ApiError>({ error: 'Transaksi tidak ditemukan' }, { status: 404 });
  }

  // Hanya pemilik yang bisa lihat detail
  if (transaction.user_id !== Number(userId)) {
    return NextResponse.json<ApiError>({ error: 'Akses ditolak' }, { status: 403 });
  }

  return NextResponse.json({ transaction });
}

// ── DELETE /api/transaction/[id] ──────────────────────────────
export async function DELETE(req: NextRequest, { params }: Params) {
  const userId = req.headers.get('x-user-id');
  if (!userId) {
    return NextResponse.json<ApiError>({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const transactionId = Number(id);

  // Cek transaksi ada & milik user ini
  const { data: transaction, error: findError } = await supabaseAdmin
    .from('transactions')
    .select('transaction_id, user_id')
    .eq('transaction_id', transactionId)
    .single();

  if (findError || !transaction) {
    return NextResponse.json<ApiError>({ error: 'Transaksi tidak ditemukan' }, { status: 404 });
  }

  if (transaction.user_id !== Number(userId)) {
    return NextResponse.json<ApiError>(
      { error: 'Kamu tidak punya akses untuk menghapus transaksi ini' },
      { status: 403 }
    );
  }

  // Hapus items dulu, baru transaksinya
  await supabaseAdmin
    .from('transaction_items')
    .delete()
    .eq('transaction_id', transactionId);

  const { error: deleteError } = await supabaseAdmin
    .from('transactions')
    .delete()
    .eq('transaction_id', transactionId);

  if (deleteError) {
    console.error('Delete transaction error:', deleteError);
    return NextResponse.json<ApiError>({ error: 'Gagal menghapus transaksi' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Transaksi berhasil dihapus' });
}
