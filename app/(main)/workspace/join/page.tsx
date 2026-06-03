'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function JoinWorkspacePage() {
  const router = useRouter()
  const [inputCode, setInputCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Handler untuk NOT-79 (Sementara simulasi, nanti diintegrasikan ke API real)
  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!inputCode.trim()) {
      alert('Silakan masukkan kode akses terlebih dahulu! ⚠️')
      return
    }

    setIsLoading(true)

    // Simulasi hit API Backend (NOT-79)
    setTimeout(() => {
      setIsLoading(false)
      if (inputCode.toUpperCase() === 'NL-2026X') {
        alert('Berhasil bergabung ke dalam Workspace BEM KM Sriwijaya! 🎓🎉')
        router.push('/workspace/1') // Redirect ke workspace ID 1
      } else {
        alert('Kode akses salah atau sudah tidak berlaku. Mohon periksa kembali! ❌')
      }
    }, 1200)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center', minHeight: 'calc(100vh - 180px)', padding: '0 8px', boxSizing: 'border-box' }}>
      
      {/* Header Halaman */}
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0D307F', margin: 0 }}>Join a Workspace</h2>
        <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5', margin: 0, padding: '0 20px' }}>
          Masukkan kode akses unik yang dibagikan oleh bendahara atau ketua tim kamu untuk mulai mencatat nota bersama.
        </p>
      </div>

      {/* Form Input Kode (NOT-76) */}
      <form onSubmit={handleJoinSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '11px', fontWeight: 800, color: '#475569', letterSpacing: '0.5px' }}>
            UNIQUE ACCESS CODE
          </label>
          <input
            type="text"
            placeholder="Contoh: NL-XXXXX"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            disabled={isLoading}
            style={{
              height: '48px', width: '100%', padding: '0 16px', borderRadius: '10px',
              border: '1.5px solid #cbd5e1', fontSize: '16px', fontWeight: 700,
              color: '#0f172a', letterSpacing: '1px', textTransform: 'uppercase',
              outline: 'none', background: isLoading ? '#f1f5f9' : '#fff',
              boxSizing: 'border-box', transition: 'border-color 0.2s'
            }}
          />
        </div>

        {/* Tombol Aksi */}
        <button
          type="submit"
          disabled={isLoading}
          style={{
            height: '48px', width: '100%', borderRadius: '10px', border: 'none',
            background: '#0D307F', color: '#ffffff', fontSize: '14px', fontWeight: 700,
            cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.7 : 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            boxSizing: 'border-box'
          }}
        >
          {isLoading ? (
            'Memvalidasi Kode...'
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <polyline points="17 11 19 13 23 9" />
              </svg>
              Join Group Workspace
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => router.push('/workspace')}
          disabled={isLoading}
          style={{
            height: '40px', width: '100%', borderRadius: '10px', border: '1px solid #cbd5e1',
            background: 'transparent', color: '#64748b', fontSize: '13px', fontWeight: 600,
            cursor: 'pointer', boxSizing: 'border-box'
          }}
        >
          Kembali ke Dashboard
        </button>
      </form>

    </div>
  )
}