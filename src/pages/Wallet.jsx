import { useState, useEffect } from 'react'
import { Wallet, Copy, CheckCircle, ExternalLink, RefreshCw, Info, AlertTriangle } from 'lucide-react'
import { getSaldo } from '../mock/api'
import { ambilUser } from '../utils/auth'
import { rupiah } from '../utils/format'
import stellarConfig from '../config/stellar'
import toast from 'react-hot-toast'

export default function WalletPage() {
  const user = ambilUser()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [disalin, setDisalin] = useState(false)

  useEffect(() => { load() }, [])
  async function load() { setLoading(true); setData(await getSaldo()); setLoading(false) }

  function salin() {
    if (stellarConfig.PLATFORM_PUBLIC_KEY === 'MASUKKAN_STELLAR_PUBLIC_KEY_KAMU_DI_SINI') {
      toast.error('Public key belum diisi di src/config/stellar.js')
      return
    }
    navigator.clipboard.writeText(stellarConfig.PLATFORM_PUBLIC_KEY)
    setDisalin(true)
    toast.success('Alamat wallet disalin!')
    setTimeout(() => setDisalin(false), 2000)
  }

  const belumIsi = stellarConfig.PLATFORM_PUBLIC_KEY === 'MASUKKAN_STELLAR_PUBLIC_KEY_KAMU_DI_SINI'

  return (
    <div className="max-w-lg mx-auto space-y-5 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Wallet Stellar</h1>
          <p className="text-slate-500 text-sm">Saldo dan informasi wallet</p>
        </div>
        <button onClick={load} className="btn-secondary btn-sm"><RefreshCw size={15} /></button>
      </div>

      {/* Warning kalau belum isi public key */}
      {belumIsi && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-800 text-sm">Stellar Public Key belum diisi</p>
            <p className="text-amber-700 text-xs mt-1">
              Buka file <code className="bg-amber-100 px-1 rounded">src/config/stellar.js</code> dan isi
              variabel <code className="bg-amber-100 px-1 rounded">PLATFORM_PUBLIC_KEY</code> dengan public key Stellar kamu.
              Lihat panduan di halaman Pengaturan.
            </p>
          </div>
        </div>
      )}

      {/* Kartu saldo utama */}
      <div className="bg-gradient-to-br from-purple-900 to-indigo-800 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-purple-300 text-sm mb-1">Total Estimasi</p>
            <p className="text-3xl font-extrabold">
              {loading ? '...' : rupiah(data?.estimasiIDR?.total || 0)}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center">
            <Wallet size={22} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'USDC', emoji: '💵', nilai: data?.saldo?.usdc, idr: data?.estimasiIDR?.usdc },
            { label: 'XLM',  emoji: '⭐', nilai: data?.saldo?.xlm,  idr: data?.estimasiIDR?.xlm },
          ].map(s => (
            <div key={s.label} className="bg-white/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span>{s.emoji}</span>
                <span className="text-purple-200 text-sm font-medium">{s.label}</span>
              </div>
              <p className="text-2xl font-bold">{loading ? '...' : parseFloat(s.nilai || 0).toFixed(2)}</p>
              <p className="text-purple-300 text-xs mt-0.5">≈ {rupiah(s.idr || 0)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Alamat wallet */}
      <div className="card">
        <h2 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Wallet size={17} className="text-purple-600" /> Alamat Wallet Stellar
        </h2>
        <div className="bg-slate-50 rounded-xl p-4">
          <p className="text-xs text-slate-500 mb-2">Public Key</p>
          <div className="flex items-start gap-2">
            <code className={`text-xs font-mono flex-1 break-all leading-relaxed ${belumIsi ? 'text-amber-600' : 'text-slate-700'}`}>
              {stellarConfig.PLATFORM_PUBLIC_KEY}
            </code>
            {!belumIsi && (
              <button onClick={salin} className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 flex-shrink-0">
                {disalin ? <CheckCircle size={15} className="text-green-500" /> : <Copy size={15} />}
              </button>
            )}
          </div>
        </div>

        {!belumIsi && (
          <a href={stellarConfig.explorerAccount(stellarConfig.PLATFORM_PUBLIC_KEY)}
            target="_blank" rel="noopener noreferrer"
            className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors text-sm font-medium">
            <ExternalLink size={15} /> Lihat di Stellar Explorer
          </a>
        )}
      </div>

      {/* Kurs */}
      <div className="card">
        <h2 className="font-bold text-slate-900 mb-3">Kurs Saat Ini</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <p className="text-sm text-blue-600 font-medium mb-1">1 USDC</p>
            <p className="text-2xl font-bold text-blue-900">{rupiah(stellarConfig.KURS.USDC)}</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 text-center">
            <p className="text-sm text-amber-600 font-medium mb-1">1 XLM</p>
            <p className="text-2xl font-bold text-amber-900">{rupiah(stellarConfig.KURS.XLM)}</p>
          </div>
        </div>
        <div className="flex items-start gap-2 mt-3 bg-slate-50 rounded-xl p-3">
          <Info size={13} className="text-slate-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-slate-500">
            Kurs estimasi. Di produksi, kurs diambil real-time dari Stellar DEX atau price oracle.
          </p>
        </div>
      </div>

      {/* Info Stellar */}
      <div className="card">
        <h2 className="font-bold text-slate-900 mb-3">Tentang Stellar Network</h2>
        {[
          { l: 'Waktu Konfirmasi', v: '3-5 detik' },
          { l: 'Biaya Transaksi', v: '~$0.00001' },
          { l: 'Network', v: stellarConfig.NETWORK === 'testnet' ? '🟡 Testnet (Demo)' : '🟢 Mainnet' },
          { l: 'USDC Issuer', v: 'Circle (via Stellar)' },
        ].map(i => (
          <div key={i.l} className="flex justify-between py-2.5 border-b border-slate-50 last:border-0">
            <span className="text-sm text-slate-500">{i.l}</span>
            <span className="text-sm font-semibold text-slate-800">{i.v}</span>
          </div>
        ))}
      </div>
    </div>
  )
}