'use client'
import React, { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function WorkspaceDetailPage() {
  const router = useRouter()
  const { id } = useParams()

  // --- STATE MANAGEMENT ---
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  
  // CRUD - Mengizinkan Update Nama Workspace (NOT-19)
  const [workspaceName, setWorkspaceName] = useState(
    id === '1' ? 'BEM KM Sriwijaya' : id === '2' ? 'Creative Design Hub' : 'Procurement Dept'
  )

  const joinCode = 'NL-2026X'
  const shareLink = `https://notalens.vercel.app/workspace/join?code=${joinCode}`

  // Data transaksi dummy pendukung mockup (NOT-77 & NOT-78: Diperluas dengan info tim panitia)
  const workspaceData = {
    totalExpenses: 'Rp4.500.000',
    budgetUsedPercent: 45,
    budgetRatio: 'Rp4.5M / Rp10M Spent',
    transactions: [
      { id: 1, item: 'Warung Nasi Padang', category: 'CONSUMPTION', date: '24 Okt 2023', buyer: 'Ahmad R.', role: 'Committee', amount: 'Rp120.000' },
      { id: 2, item: 'Gramedia Bookstore', category: 'LOGISTICS', date: '23 Okt 2023', buyer: 'Sarah F.', role: 'Treasurer', amount: 'Rp850.000' },
      { id: 3, item: 'Sewa Sound System', category: 'TECHNICAL', date: '20 Okt 2023', buyer: 'Dimas K.', role: 'Logistics', amount: 'Rp3.530.000' }
    ]
  }

  const getCategoryStyle = (category: string) => {
    switch (category) {
      case 'CONSUMPTION': return { bg: '#e0f2fe', text: '#0369a1' }
      case 'LOGISTICS': return { bg: '#fee2e2', text: '#b91c1c' }
      case 'TECHNICAL': return { bg: '#f3e8ff', text: '#6b21a8' }
      default: return { bg: '#f1f5f9', text: '#475569' }
    }
  }

  // --- HANDLER FUNCTIONS ---

  // CRUD: Update Workspace Name (NOT-19)
  const handleUpdateWorkspace = () => {
    const newName = prompt("Ubah nama workspace ini:", workspaceName)
    if (newName && newName.trim() !== "") {
      setWorkspaceName(newName)
      alert("Nama workspace berhasil diubah! 📝")
    }
  }

  // CRUD: Delete Workspace (NOT-19)
  const handleDeleteWorkspace = () => {
    const confirmDelete = confirm("Apakah Anda yakin ingin menghapus workspace ini?")
    if (confirmDelete) {
      alert("Workspace berhasil dihapus! Mengalihkan ke Dashboard...")
      router.push('/workspace')
    }
  }

  // LANGSUNG NAVIGASI KE HALAMAN SCAN SESUAI ID WORKSPACE (NOT-22)
  const handleGoToScan = () => {
    router.push(`/workspace/${id}/scan`)
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(joinCode)
    alert('Unique Access Code successfully copied to clipboard! 📋')
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink)
    alert('Workspace Invitation Link successfully copied to clipboard! 📋')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: 'calc(100vh - 140px)', overflowY: 'auto', paddingRight: '2px', position: 'relative', boxSizing: 'border-box' }}>
      
      {/* # 1. HEADER DENGAN KONTROL CRUD UPDATE & DELETE */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px', paddingBottom: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={() => router.push('/workspace')}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0D307F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0D307F', margin: 0 }}>
            {workspaceName}
          </h2>
        </div>

        {/* Action Button CRUD (NOT-19) */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button onClick={handleUpdateWorkspace} style={{ background: '#f1f5f9', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: '#475569' }}>
            Edit
          </button>
          <button onClick={handleDeleteWorkspace} style={{ background: '#fee2e2', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: '#b91c1c' }}>
            Hapus
          </button>
        </div>
      </div>

      {/* # 2. KARTU INFORMASI ANGGARAN */}
      <div style={{
        background: 'linear-gradient(135deg, #0D307F 0%, #061b4a 100%)',
        borderRadius: '14px', padding: '20px', color: '#ffffff',
        display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: '0 4px 15px rgba(13, 48, 127, 0.2)',
        boxSizing: 'border-box'
      }}>
        <div style={{ fontSize: '11px', fontWeight: 600, color: '#9bc2ff', letterSpacing: '0.5px' }}>TOTAL GROUP EXPENSES</div>
        <div style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.5px' }}>{workspaceData.totalExpenses}</div>
        
        <div style={{ marginTop: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#cbdfff', marginBottom: '6px' }}>
            <span>Budget Used</span>
            <span>{workspaceData.budgetUsedPercent}%</span>
          </div>
          <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.2)', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ width: `${workspaceData.budgetUsedPercent}%`, height: '100%', background: '#9bc2ff', borderRadius: '10px' }}></div>
          </div>
          <div style={{ fontSize: '11px', color: '#cbdfff', marginTop: '6px' }}>{workspaceData.budgetRatio}</div>
        </div>
      </div>

      {/* # 3. PILIHAN OPSI LAPORAN WORKSPACE */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', letterSpacing: '0.5px' }}>REPORT OPTIONS</span>
        
        <button 
          onClick={() => setIsShareModalOpen(true)}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px 16px', cursor: 'pointer', boxSizing: 'border-box', width: '100%' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0D307F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
            Invite Committee Members
          </div>
          <span style={{ color: '#94a3b8', fontSize: '14px' }}>➔</span>
        </button>

        <button style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px 16px', cursor: 'pointer', boxSizing: 'border-box', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0D307F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            Export Report (.xlsx)
          </div>
          <span style={{ color: '#94a3b8', fontSize: '14px' }}>➔</span>
        </button>
      </div>

      {/* # 4. TOMBOL UTAMA TRANSAKSI */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <button 
          onClick={handleGoToScan}
          style={{ background: '#0D307F', color: '#fff', border: 'none', height: '48px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxSizing: 'border-box' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
          Scan Receipt
        </button>
        
        <button style={{ background: '#fff', color: '#1e293b', border: '1.5px solid #1e293b', height: '48px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxSizing: 'border-box' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z" />
          </svg>
          Manual Input
        </button>
      </div>

      {/* # 5. LIST DAFTAR RIWAYAT TRANSAKSI TERBARU (DIUPDATE: INTEGRASI TAMPILAN KOLABORATIF NOT-77 & NOT-78) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', letterSpacing: '0.5px' }}>RECENT TRANSACTIONS</span>
            <span style={{ fontSize: '10px', color: '#94a3b8' }}>Daftar nota gabungan seluruh tim panitia</span>
          </div>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#0D307F', cursor: 'pointer' }}>View All</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {workspaceData.transactions.map((tx) => {
            const badge = getCategoryStyle(tx.category);
            return (
              <div 
                key={tx.id} 
                style={{ 
                  background: '#ffffff', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '12px', 
                  padding: '14px 16px', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  boxSizing: 'border-box',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.01)'
                }}
              >
                {/* Sisi Kiri: Detail Pengeluaran & Identitas Pengunggah */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{tx.item}</div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ background: badge.bg, color: badge.text, fontSize: '9px', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>{tx.category}</span>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>{tx.date}</span>
                  </div>

                  {/* Profil Mini Panitia yang Melakukan Scan (NOT-77) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px' }}>
                    <div style={{ 
                      width: '16px', height: '16px', borderRadius: '50%', 
                      background: '#0D307F', color: '#ffffff', fontSize: '9px', 
                      fontWeight: 800, display: 'flex', alignItems: 'center', 
                      justifyContent: 'center', textTransform: 'uppercase' 
                    }}>
                      {tx.buyer.charAt(0)}
                    </div>
                    <span style={{ fontSize: '11px', color: '#475569', fontWeight: 500 }}>
                      Scanned by: <strong style={{ color: '#0f172a', fontWeight: 600 }}>{tx.buyer}</strong> <span style={{ color: '#94a3b8', fontSize: '10px' }}>({tx.role})</span>
                    </span>
                  </div>
                </div>

                {/* Sisi Kanan: Nominal Rupiah */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{tx.amount}</div>
                  <span style={{ fontSize: '9px', color: '#16a34a', background: '#dcfce7', padding: '1px 6px', borderRadius: '20px', fontWeight: 600 }}>
                    Verified
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* # 6. MODAL POP-UP "SHARE WORKSPACE" */}
      {isShareModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px', boxSizing: 'border-box' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '340px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', boxSizing: 'border-box' }}>
            <div style={{ textAlign: 'center' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Share Workspace</h4>
              <p style={{ fontSize: '12px', color: '#64748b', marginTop: '6px', lineHeight: '1.4' }}>Invite your panitia and team members using credentials below.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '10px', fontWeight: 800, color: '#475569', letterSpacing: '0.5px' }}>WORKSPACE INVITATION LINK</span>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input type="text" readOnly value={shareLink} style={{ flex: 1, height: '38px', padding: '0 10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f1f5f9', fontSize: '12px', color: '#64748b', outline: 'none', textOverflow: 'ellipsis', boxSizing: 'border-box' }} />
                <button type="button" onClick={handleCopyLink} style={{ height: '38px', padding: '0 14px', borderRadius: '8px', border: 'none', background: '#0D307F', color: '#fff', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}>Copy</button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '10px', fontWeight: 800, color: '#475569', letterSpacing: '0.5px' }}>UNIQUE ACCESS CODE</span>
              <div style={{ background: '#f8fafc', border: '1.5px dashed #0D307F', borderRadius: '10px', padding: '14px', textAlign: 'center', fontSize: '20px', fontWeight: 800, color: '#0D307F', letterSpacing: '1px', boxSizing: 'border-box' }}>{joinCode}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '8px' }}>
              <button onClick={() => setIsShareModalOpen(false)} style={{ height: '40px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#fff', fontSize: '13px', fontWeight: 700, color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}>Tutup</button>
              <button onClick={handleCopyCode} style={{ height: '40px', borderRadius: '10px', border: 'none', background: '#0D307F', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}>Salin Kode</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}