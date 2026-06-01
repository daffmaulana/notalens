import type { ReceiptExtraction } from '@/types';

/** Convert canvas/data-URL capture to a File for multipart upload. */
export async function dataUrlToFile(
  dataUrl: string,
  filename = 'receipt.jpg'
): Promise<File> {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  const type = blob.type && blob.type.startsWith('image/') ? blob.type : 'image/jpeg';
  return new File([blob], filename, { type });
}

/** Strip "Rp" prefix for the verify form amount field. */
export function parseRpAmount(value: string | null | undefined): string {
  if (!value) return '';
  return value.replace(/^Rp\s?/i, '').trim();
}

export function mapReceiptToForm(data: ReceiptExtraction) {
  return {
    storeName: data.nama_toko || 'Tidak Terdeteksi',
    date: data.tanggal || '',
    totalAmount: parseRpAmount(data.total_pengeluaran),
    items: data.items ?? [],
  };
}

/** Simple heuristic when the model does not return a confidence score. */
export function estimateConfidence(data: ReceiptExtraction): number {
  let score = 0;
  if (data.nama_toko && data.nama_toko !== 'Tidak Terdeteksi') score += 25;
  if (data.tanggal) score += 25;
  if (data.total_pengeluaran) score += 25;
  if (data.items.length > 0) score += 25;
  return score;
}
