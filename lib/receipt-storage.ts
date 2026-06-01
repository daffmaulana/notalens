import { supabaseAdmin } from '@/lib/supabase';

const BUCKET = 'receipts';

export async function uploadReceiptImage(
  userId: number,
  file: File
): Promise<string | null> {
  const ext = file.name.split('.').pop() || 'jpg';
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(path, buffer, {
      contentType: file.type || 'image/jpeg',
      upsert: false,
    });

  if (error) {
    console.error('Receipt upload error:', error);
    return null;
  }

  const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
