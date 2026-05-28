import cv2
import re
import json
import numpy as np
import easyocr
from fastapi import FastAPI, UploadFile, File, HTTPException
from ultralytics import YOLO

MODEL_PATH = "models/best2.pt"

app = FastAPI(title="NotaLens AI API", version="1.0.0")

try:
    model_yolo = YOLO(MODEL_PATH)
    reader = easyocr.Reader(['id', 'en'], gpu=False)
except Exception as e:
    raise RuntimeError(f"Gagal memuat model: {e}")


def parse_receipt(hasil_ekstraksi: list[str], hasil_full: list[str]) -> dict:
    data_struk = {
        "nama_toko": "Tidak Terdeteksi",
        "tanggal": None,
        "items": [],
        "total_pengeluaran": None
    }

    pola_harga = r'(?:Rp\s?)?(\d{1,3}(?:[.,]\d{3})+)'

    # Nama toko dari baris kedua OCR full
    if len(hasil_full) > 1:
        data_struk["nama_toko"] = hasil_full[1].replace('"', '').strip()

    # Tanggal dari OCR full
    for baris in hasil_full:
        match_tanggal = re.search(r'(\d{1,2}\s+\w+\s+\d{2,4})', baris)
        if match_tanggal:
            data_struk["tanggal"] = match_tanggal.group(1)
            break

    # Total dari OCR full (baris setelah kata "Total")
    for i, baris in enumerate(hasil_full):
        if baris.lower() == 'total':
            if i + 1 < len(hasil_full):
                match_harga = re.search(pola_harga, hasil_full[i + 1])
                if match_harga:
                    data_struk["total_pengeluaran"] = "Rp " + match_harga.group(1).replace(',', '.')
            break

    # Parsing item dari hasil YOLO crop
    harga_buffer = None
    for i, baris in enumerate(hasil_ekstraksi):
        match_harga = re.search(pola_harga, baris)
        if match_harga:
            angka = "Rp " + match_harga.group(1).replace(',', '.')
            if angka != data_struk["total_pengeluaran"]:
                if i + 1 < len(hasil_ekstraksi):
                    nama_candidate = hasil_ekstraksi[i + 1]
                    if not re.search(pola_harga, nama_candidate):
                        harga_buffer = angka
            continue

        if "total" not in baris.lower():
            harga = harga_buffer
            harga_buffer = None
            data_struk["items"].append({
                "nama_item": baris.strip(),
                "harga": harga
            })

    return data_struk


@app.get("/")
def root():
    return {"status": "ok", "message": "NotaLens AI API is running"}


@app.post("/ekstrak-struk")
async def ekstrak_struk(file: UploadFile = File(...)):
    if file.content_type not in ["image/jpeg", "image/png", "image/jpg"]:
        raise HTTPException(status_code=400, detail="Format file harus JPG atau PNG.")

    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if img is None:
        raise HTTPException(status_code=400, detail="Gambar tidak dapat dibaca.")

    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    # OCR full gambar untuk nama toko, tanggal, dan total
    hasil_full = reader.readtext(img_rgb, detail=0)

    # YOLO + OCR per crop untuk item
    results = model_yolo(img)
    hasil_ekstraksi = []

    if len(results[0].boxes) > 0:
        boxes = results[0].boxes.xyxy.cpu().numpy()
        boxes = sorted(boxes, key=lambda b: b[1])
        for box in boxes:
            x1, y1, x2, y2 = map(int, box)
            cropped_img = img_rgb[y1:y2, x1:x2]
            ocr_result = reader.readtext(cropped_img, detail=0)
            if ocr_result:
                hasil_ekstraksi.append(" ".join(ocr_result))

    if not hasil_ekstraksi:
        raise HTTPException(status_code=422, detail="Tidak ada teks yang berhasil diekstrak dari gambar.")

    return parse_receipt(hasil_ekstraksi, hasil_full)