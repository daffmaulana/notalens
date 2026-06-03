'use client'
import React, { useEffect, useState } from 'react'
import { useNav } from '@/app/components/AppLayout' // Sinkronisasi navbar kelompok
import { useRouter } from 'next/navigation'

export default function WorkspacePage() {
  const { setActiveNav } = useNav()
  const router = useRouter()

  // SINKRONISASI NAVBAR BAWAH
  useEffect(() => {
    if (setActiveNav) {
      setActiveNav('WORKSPACE')
    }
  }, [setActiveNav])

  // DATA DUMMY 
  const [workspaces] = useState([
    { id: 1, name: 'BEM KM Sriwijaya', members: '24 Access', expenses: 'Rp4.500.000' },
    { id: 2, name: 'Creative Design Hub', members: '12 Access', expenses: 'Rp2.100.000' },
    { id: 3, name: 'Procurement Dept', members: '8 Access', expenses: 'Rp5.800.000' }
  ])

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '20px', 
      height: 'calc(100vh - 140px)', 
      overflowY: 'auto',
      paddingRight: '2px'
    }}>
      
      {/* 1. HEADER JUDUL HALAMAN */}
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#091e42', margin: 0, letterSpacing: '-0.5px' }}>
          Your Workspaces
        </h1>
        <p style={{ fontSize: '12px', color: '#626f84', margin: '4px 0 0', lineHeight: '1.4' }}>
          Manage and monitor organizational expenses and events
        </p>
      </div>

      {/* 2. KARTU OVERVIEW (Deep Blue Tanpa Emoji) */}
      <div style={{
        background: '#0D307F',
        borderRadius: '12px',
        padding: '20px',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        boxShadow: '0 4px 12px rgba(13, 48, 127, 0.12)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1px', color: '#9bc2ff' }}>OVERVIEW</span>
        </div>
        
        <div>
          <div style={{ fontSize: '11px', color: '#cbdfff', marginBottom: '4px' }}>Total Expenses</div>
          <div style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px' }}>Rp12.400.000</div>
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          borderTop: '1px solid rgba(255,255,255,0.1)', 
          paddingTop: '12px', 
          fontSize: '11px', 
          color: '#cbdfff'
        }}>
          <div>3 Workspaces</div>
          <div>Updated 2m ago</div>
        </div>
      </div>

      {/* 3. DUA TOMBOL AKSI CEPAT  */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button 
          onClick={() => router.push('/workspace/join')}
          style={{
            width: '100%', background: '#e2e8f0', color: '#334155', border: 'none',
            padding: '12px', borderRadius: '8px', fontSize: '13px', fontWeight: 700,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
          }}
        >
          Join via Unique Code
        </button>

        <button 
          onClick={() => router.push('/workspace/create')}
          style={{
            width: '100%', background: '#0D307F', color: '#ffffff', border: 'none',
            padding: '12px', borderRadius: '8px', fontSize: '13px', fontWeight: 700,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
          }}
        >
          + Create New Workspace
        </button>
      </div>

      {/* 4. JOINED WORKSPACES LIST (Klik Langsung di Kartu + Tanda Panah) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', letterSpacing: '0.5px' }}>JOINED WORKSPACES</span>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {workspaces.map((ws) => (
            <div 
              key={ws.id} 
              onClick={() => router.push(`/workspace/${ws.id}`)}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.01)',
                position: 'relative'
              }}
            >
              {/* Baris Atas: Nama & Indikator Panah */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0 }}>{ws.name}</h4>
                <span style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 'bold' }}>&gt;</span>
              </div>

              {/* Baris Bawah: Detail Angka & Informasi */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>EXPENSES</span>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>{ws.expenses}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>MEMBERS</span>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>{ws.members}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}