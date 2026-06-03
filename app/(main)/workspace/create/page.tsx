'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateWorkspacePage() {
  const router = useRouter()
  
  // # STATE UNTUK MENAMPUNG DATA INPUTAN FORM
  const [eventName, setEventName] = useState('')
  const [category, setCategory] = useState('')
  const [budget, setBudget] = useState('')
  const joinCode = 'NL-2026X' // # KODE JOIN DEFAULT UNTUK NOTALENS
  const [loading, setLoading] = useState(false)

  // # FUNGSI UNTUK MENANGANI PENGIRIMAN FORM (SUBMIT)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      alert('Workspace Created Successfully!')
      router.push('/workspace') // # REDIRECT KEMBALI KE DAFTAR WORKSPACE
    }, 1000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '24px' }}>
      
      {/* # HEADER: TOMBOL PANAH DAN JUDUL UTAMA SEJAJAR */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '10px' }}>
        <button 
          type="button"
          onClick={() => router.push('/workspace')}
          style={{ 
            background: 'transparent', 
            border: 'none', 
            cursor: 'pointer', 
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* # IKON PANAH BIRU GELAP (#0D307F) MINIMALIS */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0D307F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        
        {/* # JUDUL BESAR: WARNA BIRU GELAP SESUAI image_8d5500.png */}
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0D307F', margin: 0, letterSpacing: '-0.5px' }}>
          New Workspace
        </h1>
      </div>

      {/* # DESKRIPSI: SEKARANG RATA KIRI (TIDAK SEJAJAR TEKS JUDUL) AGAR LEBIH RAPI SESUAI image_8d5500.png */}
      <div style={{ marginTop: '-12px' }}>
        <p style={{ fontSize: '12px', color: '#626f84', margin: 0, lineHeight: '1.4' }}>
          Configure your event workspace parameters with surgical precision.
        </p>
      </div>

      {/* # FORMULIR UTAMA UNTUK INPUT DATA WORKSPACE BARU */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '10px' }}>
        
        {/* # FIELD 1: NAMA EVENT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '10px', fontWeight: 800, color: '#475569', letterSpacing: '0.5px' }}>EVENT NAME</label>
          <input 
            type="text"
            required
            placeholder="Example: Annual Gala 2026"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', color: '#334155', outline: 'none' }}
          />
        </div>

        {/* # FIELD 2 & 3: KATEGORI DAN BUDGET (TAMPILAN GRID KIRI-KANAN) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '10px', fontWeight: 800, color: '#475569', letterSpacing: '0.5px' }}>CATEGORY</label>
            <input 
              type="text"
              required
              placeholder="e.g. Conference"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', color: '#334155', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '10px', fontWeight: 800, color: '#475569', letterSpacing: '0.5px' }}>ESTIMATED BUDGET</label>
            <input 
              type="text"
              required
              value={budget ? `Rp ${Number(budget).toLocaleString('id-ID')}` : ''}
              placeholder="Rp 0"
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '') // # HANYA MENERIMA ANGKA
                setBudget(val)
              }}
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', color: '#334155', outline: 'none' }}
            />
          </div>
        </div>

        {/* # FIELD 4: KODE AKSES UNIK (READ-ONLY) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '10px', fontWeight: 800, color: '#475569', letterSpacing: '0.5px' }}>UNIQUE ACCESS CODE (JOIN CODE)</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="text"
              readOnly
              value={joinCode}
              style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f1f5f9', fontSize: '14px', fontWeight: 700, color: '#334155', letterSpacing: '0.5px' }}
            />
            <button 
              type="button"
              onClick={() => { navigator.clipboard.writeText(joinCode); alert('Code Copied! 📋') }}
              style={{ padding: '0 20px', borderRadius: '8px', border: '1px solid #0D307F', background: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer', color: '#0D307F' }}
            >
              Copy
            </button>
          </div>
        </div>

        {/* # TOMBOL SUBMIT UNTUK MEMBUAT WORKSPACE */}
        <button 
          type="submit"
          disabled={loading}
          style={{
            marginTop: '20px', background: '#0D307F', color: '#fff', border: 'none',
            padding: '14px', borderRadius: '8px', fontSize: '15px', fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          {loading ? 'Creating...' : 'Create Workspace Now'}
        </button>

      </form>
    </div>
  )
}