// ============================================================
// POST /api/upload
// Header: Authorization: Bearer <token>
// Body: FormData dengan field "file" (gambar struk)
//
// Flow: FE → Next.js (auth check) → FastAPI (OCR processing)
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromHeader, verifyToken } from '@/lib/jwt';
import { ApiError, UploadResponse } from '@/types';

const FASTAPI_URL = process.env.FASTAPI_URL ?? 'http://localhost:8000';

function fastApiErrorMessage(body: unknown, fallback: string): string {
  if (typeof body === 'object' && body !== null && 'detail' in body) {
    const detail = (body as { detail: unknown }).detail;
    if (typeof detail === 'string') return detail;
  }
  return fallback;
}

export async function POST(req: NextRequest) {
  // --- Auth check ---
  const token = getTokenFromHeader(req.headers.get('authorization'));
  const payload = token ? await verifyToken(token) : null;

  if (!payload) {
    return NextResponse.json<ApiError>(
      { error: 'Unauthorized - login terlebih dahulu' },
      { status: 401 }
    );
  }

  try {
    // --- Ambil file dari request ---
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json<ApiError>(
        { error: 'File tidak ditemukan dalam request' },
        { status: 400 }
      );
    }

    // Validasi tipe file
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json<ApiError>(
        { error: 'Format file tidak didukung. Gunakan JPG, PNG, atau WEBP' },
        { status: 400 }
      );
    }

    // Validasi ukuran file (max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json<ApiError>(
        { error: 'Ukuran file maksimal 10MB' },
        { status: 400 }
      );
    }

    // --- Forward ke FastAPI (NotaLens AI: POST /ekstrak-struk) ---
    const forwardForm = new FormData();
    forwardForm.append('file', file);

    const fastApiResponse = await fetch(`${FASTAPI_URL}/ekstrak-struk`, {
      method: 'POST',
      body: forwardForm,
    });

    const result = await fastApiResponse.json().catch(() => null);

    if (!fastApiResponse.ok) {
      console.error('FastAPI error:', result);
      return NextResponse.json<ApiError>(
        {
          error: fastApiErrorMessage(
            result,
            'Gagal memproses struk, coba lagi'
          ),
        },
        { status: fastApiResponse.status >= 500 ? 502 : fastApiResponse.status }
      );
    }

    return NextResponse.json<UploadResponse>({
      message: 'Struk berhasil diproses',
      data: result,
    });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json<ApiError>(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
