import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { QrCode, TrendingUp, ShoppingBag, DollarSign, ExternalLink, Sparkles, ArrowUpRight } from 'lucide-react'
import { getDashboard } from '../mock/api'
import { ambilUser } from '../utils/auth'
import { rupiah, tanggal, statusLabel, statusBadge, potongAlamat } from '../utils/format'
import stellarConfig from '../config/stellar'

export default function Dashboard() {
  const user = ambilUser()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboard().then(setData).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => <div key={i} className="card shimmer h-28 rounded-2xl" />)}
      </div>
    )
  }

  const { statistik, saldo } = data
  const pertumbuhan = statistik.bulanLalu.total > 0
    ? Math.round(((statistik.bulanIni.total - statistik.bulanLalu.total) / statistik.bulanLalu.total) * 100)
    : 0

  return (
    <div className="space-y-5 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm">{user?.namaUsaha} · {user?.kota}</p>
        </div>
        <div className="flex gap-2">
          <Link to="/dashboard/ai-konten" className="btn-outline btn-sm">
            <Sparkles size={15} /> AI Konten
          </Link>
          <Link to="/dashboard/terima" className="btn-primary btn-sm">
            <QrCode size={15} /> Terima Bayar
          </Link>
        </div>
      </div>

      {/* Wallet Stellar */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-800 rounded-2xl p-5 text-white">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-purple-300 text-xs font-medium mb-1">Wallet Stellar</p>
            <p className="font-mono text-sm text-purple-100">
              {stellarConfig.PLATFORM_PUBLIC_KEY === 'MASUKKAN_STELLAR_PUBLIC_KEY_KAMU_DI_SINI'
                ? <span className="text-amber-300">⚠ Belum diisi — lihat src/config/stellar.js</span>
                : potongAlamat(stellarConfig.PLATFORM_PUBLIC_KEY, 10)
              }
            </p>
          </div>
          {stellarConfig.PLATFORM_PUBLIC_KEY !== 'MASUKKAN_STELLAR_PUBLIC_KEY_KAMU_DI_SINI' && (
            <a href={stellarConfig.explorerAccount(stellarConfig.PLATFORM_PUBLIC_KEY)}
              target="_blank" rel="noopener noreferrer"
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
              <ExternalLink size={15} />
            </a>
          )}
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-purple-300 text-xs">USDC</p>
            <p className="text-xl font-bold">{parseFloat(saldo.usdc).toFixed(2)}</p>
            <p className="text-purple-300 text-xs">{rupiah(saldo.estimasiIDR.usdc)}</p>
          </div>
          <div>
            <p className="text-purple-300 text-xs">XLM</p>
            <p className="text-xl font-bold">{parseFloat(saldo.xlm).toFixed(2)}</p>
            <p className="text-purple-300 text-xs">{rupiah(saldo.estimasiIDR.xlm)}</p>
          </div>
          <div>
            <p className="text-purple-300 text-xs">Total ≈</p>
            <p className="text-xl font-bold">{rupiah(saldo.estimasiIDR.total)}</p>
            <p className="text-purple-300 text-xs">estimasi IDR</p>
          </div>
        </div>
      </div>

      {/* Kartu statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
              <DollarSign size={18} />
            </div>
            <span className="text-xs text-slate-400">Hari ini</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{statistik.hariIni.total.toFixed(2)} <span className="text-sm font-normal text-slate-400">USDC</span></p>
          <p className="text-slate-400 text-sm">{statistik.hariIni.jumlah} transaksi</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <TrendingUp size={18} />
            </div>
            <span className={`text-xs font-semibold ${pertumbuhan >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {pertumbuhan >= 0 ? '+' : ''}{pertumbuhan}%
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{statistik.bulanIni.total.toFixed(2)} <span className="text-sm font-normal text-slate-400">USDC</span></p>
          <p className="text-slate-400 text-sm">Bulan ini · {statistik.bulanIni.jumlah} transaksi</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <ShoppingBag size={18} />
            </div>
            <ArrowUpRight size={15} className="text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{user?.totalTransaksi || 0}</p>
          <p className="text-slate-400 text-sm">Total transaksi</p>
        </div>
      </div>

      {/* Grafik & Transaksi terbaru */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="card lg:col-span-3">
          <h2 className="font-bold text-slate-900 mb-4">Pendapatan 7 Hari Terakhir</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={statistik.grafik}>
              <XAxis dataKey="hari" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={v => [`${v} USDC`, 'Pendapatan']} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
              <Bar dataKey="pendapatan" fill="#9333ea" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900">Transaksi Terbaru</h2>
            <Link to="/dashboard/transaksi" className="text-purple-600 text-sm hover:underline">Lihat semua</Link>
          </div>
          <div className="space-y-3">
            {statistik.transaksiTerbaru.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-6">Belum ada transaksi</p>
            ) : statistik.transaksiTerbaru.map(tx => (
              <div key={tx._id} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${tx.status === 'selesai' ? 'bg-green-500' : 'bg-amber-400'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{tx.namaPembeli || 'Pembeli'}</p>
                  <p className="text-xs text-slate-400 truncate">{tx.catatan || tanggal(tx.createdAt)}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-slate-900">{tx.jumlah} {tx.aset}</p>
                  <span className={statusBadge(tx.status)}>{statusLabel(tx.status)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Banner AI Konten */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <Sparkles size={22} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold">Buat Konten Marketing dengan AI</p>
            <p className="text-pink-100 text-sm">Caption IG, status WA, promosi PO — tinggal ceritakan produkmu</p>
          </div>
        </div>
        <Link to="/dashboard/ai-konten" className="flex-shrink-0 inline-flex items-center gap-2 bg-white text-pink-600 font-semibold py-2.5 px-5 rounded-xl hover:bg-pink-50 transition-colors text-sm">
          Coba Sekarang <ArrowUpRight size={16} />
        </Link>
      </div>
    </div>
  )
}