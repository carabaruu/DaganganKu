// src/pages/Transaksi.jsx
import { useState, useEffect } from 'react'
import { Search, ExternalLink, RefreshCw } from 'lucide-react'
import { getTransaksi } from '../mock/api'
import { tanggal, statusLabel, statusBadge, potongAlamat } from '../utils/format'
import stellarConfig from '../config/stellar'

export default function Transaksi() {
  const [list, setList] = useState([])
  const [total, setTotal] = useState(0)
  const [hal, setHal] = useState(1)
  const [totHal, setTotHal] = useState(1)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [cari, setCari] = useState('')

  useEffect(() => { load() }, [hal, filter])

  async function load() {
    setLoading(true)
    const res = await getTransaksi({ halaman: hal, status: filter || undefined })
    setList(res.transaksi)
    setTotal(res.total)
    setTotHal(res.totalHalaman)
    setLoading(false)
  }

  const tampil = cari
    ? list.filter(t => t.namaPembeli?.toLowerCase().includes(cari.toLowerCase()) || t.catatan?.toLowerCase().includes(cari.toLowerCase()))
    : list

  return (
    <div className="space-y-5 fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Transaksi</h1>
          <p className="text-slate-500 text-sm">{total} total transaksi</p>
        </div>
        <button onClick={load} className="btn-secondary btn-sm"><RefreshCw size={15} /></button>
      </div>

      <div className="card !p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="input !py-2.5 pl-9 text-sm" placeholder="Cari nama pembeli atau keterangan..."
            value={cari} onChange={e => setCari(e.target.value)} />
        </div>
        <select className="input !py-2.5 !w-auto text-sm" value={filter}
          onChange={e => { setFilter(e.target.value); setHal(1) }}>
          <option value="">Semua Status</option>
          <option value="selesai">Berhasil</option>
          <option value="menunggu">Menunggu</option>
          <option value="gagal">Gagal</option>
        </select>
      </div>

      <div className="card !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {['Tanggal', 'Pembeli', 'Keterangan', 'Jumlah', 'Status', 'Stellar'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="px-5 py-4"><div className="shimmer h-4 rounded" /></td>
                  ))}</tr>
                ))
              ) : tampil.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-14 text-slate-400 text-sm">Tidak ada transaksi ditemukan</td></tr>
              ) : tampil.map(tx => (
                <tr key={tx._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4 text-sm text-slate-600 whitespace-nowrap">{tanggal(tx.createdAt)}</td>
                  <td className="px-5 py-4 text-sm font-medium text-slate-800">{tx.namaPembeli || '—'}</td>
                  <td className="px-5 py-4 text-sm text-slate-500 max-w-[150px] truncate">{tx.catatan || '—'}</td>
                  <td className="px-5 py-4 font-bold text-slate-900">{tx.jumlah} {tx.aset}</td>
                  <td className="px-5 py-4"><span className={statusBadge(tx.status)}>{statusLabel(tx.status)}</span></td>
                  <td className="px-5 py-4">
                    {tx.stellarHash ? (
                      <a href={stellarConfig.explorerTx(tx.stellarHash)} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-700 text-xs font-medium">
                        {potongAlamat(tx.stellarHash, 4)} <ExternalLink size={11} />
                      </a>
                    ) : <span className="text-slate-300 text-xs">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totHal > 1 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100">
            <p className="text-sm text-slate-500">Halaman {hal} dari {totHal}</p>
            <div className="flex gap-2">
              <button onClick={() => setHal(h => Math.max(1, h - 1))} disabled={hal === 1}
                className="btn-secondary btn-sm">← Prev</button>
              <button onClick={() => setHal(h => Math.min(totHal, h + 1))} disabled={hal === totHal}
                className="btn-secondary btn-sm">Next →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}