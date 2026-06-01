# NotaLens AI — Backend Setup

Folder `venv/` tidak ikut di git. **Wajib buat virtual environment dulu** sebelum `activate` atau `uvicorn`.

## Instalasi (Windows PowerShell)

```powershell
cd D:\Daffa\Pijak\notalens\notalens\ai

# 1. Buat virtual environment (hanya sekali)
python -m venv venv

# 2. Aktifkan venv — pakai .\ di depan path
.\venv\Scripts\Activate.ps1

# Jika muncul error execution policy:
# Set-ExecutionPolicy -Scope CurrentUser RemoteSigned

# 3. Install dependencies (bisa 5–15 menit, termasuk PyTorch)
pip install -r requirements.txt
```

**Jangan** menjalankan `venv\Scripts\activate` sebelum langkah 1 selesai — folder `venv` belum ada akan memicu error seperti *"The module 'venv' could not be loaded"* di PowerShell.

### Tanpa activate (alternatif)

```powershell
cd ai
.\venv\Scripts\python.exe -m pip install -r requirements.txt
.\venv\Scripts\python.exe -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

## Instalasi (Mac/Linux)

```bash
cd ai
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Jalankan Server

```powershell
cd ai
.\venv\Scripts\Activate.ps1
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

Pertama kali jalan, EasyOCR mengunduh model (~100MB+) — tunggu sampai muncul `Uvicorn running on http://0.0.0.0:8000`.

## Test Endpoint

Buka `http://localhost:8000/docs` untuk UI testing otomatis dari FastAPI.

Endpoint utama: `POST /ekstrak-struk` (upload gambar JPG/PNG).

## Integrasi dengan Next.js (NotaLens)

1. Jalankan FastAPI di port **8000** (sesuai `FASTAPI_URL` di `.env.local`).
2. Di app Next.js, buka **Scan** → ambil foto / pilih dari galeri.
3. Halaman **Verify** mengirim gambar ke `POST /api/upload` (auth JWT), lalu Next.js meneruskan ke FastAPI `/ekstrak-struk`.
4. Hasil OCR (nama toko, tanggal, item, total) diisi otomatis di form verify.

```powershell
# Terminal 1 — AI server
cd ai
.\venv\Scripts\python.exe -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload

# Terminal 2 — Next.js (root project)
npm run dev
```
