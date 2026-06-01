-- NotaLens — jalankan di Supabase SQL Editor jika tabel belum ada

-- Users (biasanya sudah ada dari auth flow)
-- CREATE TABLE users (...);

CREATE TABLE IF NOT EXISTS transactions (
  transaction_id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  workspace_id BIGINT NULL,
  category TEXT DEFAULT 'personal' CHECK (category IN ('personal', 'organization')),
  merchant_name TEXT,
  total_amount NUMERIC(14, 2) NOT NULL DEFAULT 0,
  tax_amount NUMERIC(14, 2) NULL,
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT NULL,
  receipt_url TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transaction_items (
  item_id BIGSERIAL PRIMARY KEY,
  transaction_id BIGINT NOT NULL REFERENCES transactions(transaction_id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  quantity INT NULL DEFAULT 1,
  price NUMERIC(14, 2) NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_transactions_user_date
  ON transactions(user_id, transaction_date DESC);

-- Storage (wajib untuk foto struk):
-- 1. Supabase Dashboard → Storage → New bucket → nama: receipts
-- 2. Set bucket Public, atau atur policy agar service role bisa upload
