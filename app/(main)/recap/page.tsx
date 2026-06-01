'use client'
import React, { useState, useEffect, useMemo } from 'react'
import { useNav } from '@/app/components/AppLayout'
import { useTheme } from '@/context/ThemeContext'
import { fetchTransactions } from '@/lib/transactions-api'
import { formatRp, formatDisplayDate } from '@/lib/amount'
import type { TransactionWithItems } from '@/types'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']

const CATEGORY_COLORS = ['#0D307F', '#1e4bb8', '#2d5fd4', '#4a7feb', '#7aa5f5', '#94a3b8']

export default function RecapPage() {
  const { setActiveNav } = useNav()
  const { darkMode } = useTheme()
  const now = new Date()
  const [monthIndex, setMonthIndex] = useState(now.getMonth())
  const [year] = useState(now.getFullYear())
  const [filter, setFilter] = useState<'All' | 'This Week' | 'This Month'>('This Month')
  const [transactions, setTransactions] = useState<TransactionWithItems[]>([])
  const [total, setTotal] = useState(0)
  const [byCategory, setByCategory] = useState<{ name: string; amount: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { setActiveNav('RECAP') }, [setActiveNav])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const data = await fetchTransactions({
        month: monthIndex + 1,
        year,
      })
      if (data) {
        setTransactions(data.transactions)
        setTotal(data.summary.total_expenses)
        setByCategory(data.summary.by_category)
      } else {
        setTransactions([])
        setTotal(0)
        setByCategory([])
      }
      setLoading(false)
    }
    load()
  }, [monthIndex, year])

  const filteredTransactions = useMemo(() => {
    if (filter === 'All') return transactions

    const today = new Date()
    return transactions.filter((tx) => {
      const d = new Date(tx.transaction_date + 'T12:00:00')
      if (filter === 'This Month') {
        return d.getMonth() === monthIndex && d.getFullYear() === year
      }
      const weekAgo = new Date(today)
      weekAgo.setDate(today.getDate() - 7)
      return d >= weekAgo && d <= today
    })
  }, [transactions, filter, monthIndex, year])

  const maxAmount = Math.max(...byCategory.map((c) => c.amount), 1)

  const bg = darkMode ? '#0f172a' : '#f4f7fb'
  const cardBg = darkMode ? '#1e293b' : '#fff'
  const textPrimary = darkMode ? '#f1f5f9' : '#0f172a'
  const textSecondary = darkMode ? '#94a3b8' : '#64748b'
  const borderColor = darkMode ? '#334155' : '#e2e8f0'

  const exportRows = filteredTransactions.map((tx) => [
    tx.merchant_name || '—',
    formatDisplayDate(tx.transaction_date),
    tx.notes || 'Other',
    formatRp(Number(tx.total_amount)),
  ])

  const handleExportPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.setTextColor(13, 48, 127)
    doc.text('NotaLens', 14, 18)
    doc.setFontSize(11)
    doc.setTextColor(100, 116, 139)
    doc.text('Rekap Pengeluaran Pribadi', 14, 26)
    doc.text(`${MONTHS[monthIndex]} ${year}`, 14, 33)
    doc.setFontSize(12)
    doc.setTextColor(13, 48, 127)
    doc.text(`Total: ${formatRp(total)}`, 14, 42)
    autoTable(doc, {
      startY: 50,
      head: [['Toko', 'Tanggal', 'Kategori', 'Jumlah']],
      body: exportRows.length ? exportRows : [['—', '—', '—', '—']],
      headStyles: { fillColor: [13, 48, 127], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [239, 246, 255] },
      styles: { fontSize: 10, cellPadding: 6 },
    })
    doc.save(`NotaLens_${MONTHS[monthIndex]}_${year}.pdf`)
  }

  const handleExportExcel = () => {
    const wsData = [
      ['NotaLens - Rekap Pengeluaran Pribadi'],
      [`Periode: ${MONTHS[monthIndex]} ${year}`],
      [`Total Pengeluaran: ${formatRp(total)}`],
      [],
      ['Toko', 'Tanggal', 'Kategori', 'Jumlah'],
      ...exportRows,
      [],
      ['', '', 'TOTAL', formatRp(total)],
    ]
    const ws = XLSX.utils.aoa_to_sheet(wsData)
    ws['!cols'] = [{ wch: 20 }, { wch: 15 }, { wch: 18 }, { wch: 15 }]
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Rekap')
    XLSX.writeFile(wb, `NotaLens_${MONTHS[monthIndex]}_${year}.xlsx`)
  }

  return (
    <div style={{
      height: '100%', overflowY: 'auto', background: bg,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      transition: 'background 0.3s',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px', background: cardBg, borderBottom: `1px solid ${borderColor}`,
      }}>
        <div onClick={() => setMonthIndex((p) => Math.max(0, p - 1))}
          style={{ cursor: 'pointer', padding: '4px 10px', fontSize: '18px', color: '#0D307F' }}>‹</div>
        <span style={{ fontSize: '14px', fontWeight: 700, color: textPrimary }}>
          {MONTHS[monthIndex]} {year}
        </span>
        <div onClick={() => setMonthIndex((p) => Math.min(11, p + 1))}
          style={{ cursor: 'pointer', padding: '4px 10px', fontSize: '18px', color: '#0D307F' }}>›</div>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

        <div style={{ background: '#0D307F', borderRadius: '20px', padding: '20px', color: '#fff' }}>
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1px', opacity: 0.7, marginBottom: '8px' }}>
            TOTAL PENGELUARAN
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, marginBottom: '12px' }}>
            {loading ? '...' : formatRp(total)}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {(['All', 'This Week', 'This Month'] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '7px 14px', borderRadius: '20px', border: 'none',
              fontSize: '11px', fontWeight: 700, cursor: 'pointer',
              background: filter === f ? '#0D307F' : cardBg,
              color: filter === f ? '#fff' : textSecondary,
            }}>{f}</button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handleExportPDF} style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '6px', padding: '11px', borderRadius: '12px',
            background: cardBg, border: `1px solid ${borderColor}`,
            fontSize: '11px', fontWeight: 700, color: '#dc2626', cursor: 'pointer',
          }}>
            Export PDF
          </button>
          <button onClick={handleExportExcel} style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '6px', padding: '11px', borderRadius: '12px',
            background: cardBg, border: `1px solid ${borderColor}`,
            fontSize: '11px', fontWeight: 700, color: '#16a34a', cursor: 'pointer',
          }}>
            Export Excel
          </button>
        </div>

        <div style={{ background: cardBg, borderRadius: '16px', padding: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: 800, color: textPrimary, marginBottom: '14px' }}>
            Category Breakdown
          </div>
          {loading ? (
            <p style={{ fontSize: '12px', color: textSecondary }}>Memuat...</p>
          ) : byCategory.length === 0 ? (
            <p style={{ fontSize: '12px', color: textSecondary }}>Belum ada data bulan ini.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {byCategory.map((cat, i) => (
                <div key={cat.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', color: textSecondary }}>{cat.name}</span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: darkMode ? '#7aa5f5' : '#0D307F' }}>{formatRp(cat.amount)}</span>
                  </div>
                  <div style={{ height: '4px', background: borderColor, borderRadius: '2px' }}>
                    <div style={{
                      width: `${(cat.amount / maxAmount) * 100}%`,
                      height: '100%',
                      background: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
                      borderRadius: '2px',
                      transition: 'width 0.5s ease',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ background: cardBg, borderRadius: '16px', padding: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: 800, color: textPrimary, marginBottom: '14px' }}>
            Recent Transactions
          </div>
          {loading ? (
            <p style={{ fontSize: '12px', color: textSecondary }}>Memuat...</p>
          ) : filteredTransactions.length === 0 ? (
            <p style={{ fontSize: '12px', color: textSecondary }}>Belum ada transaksi.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredTransactions.map((tx) => (
                <div key={tx.transaction_id} style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', paddingBottom: '12px',
                  borderBottom: `1px solid ${borderColor}`,
                }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: textPrimary }}>{tx.merchant_name}</div>
                    <div style={{ fontSize: '11px', color: textSecondary, marginTop: '2px' }}>
                      {formatDisplayDate(tx.transaction_date)}
                    </div>
                    <div style={{
                      display: 'inline-block', marginTop: '4px',
                      background: darkMode ? '#1e3a5f' : '#eff6ff', color: '#0D307F',
                      fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '10px',
                    }}>{tx.notes || 'Other'}</div>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: darkMode ? '#7aa5f5' : '#0D307F' }}>
                    {formatRp(Number(tx.total_amount))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
