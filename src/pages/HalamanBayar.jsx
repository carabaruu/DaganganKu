import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ShoppingBag, CheckCircle, Loader, ExternalLink, Clock, Zap } from 'lucide-react'
import { rupiah } from '../utils/format'
import stellarConfig from '../config/stellar'
import toast from 'react-hot-toast'

// Data dummy untuk demo halaman bayar
const DEMO_PAYMENTS = {
  'pay-inv-001': {
    jumlah: 55.00, aset: 'USDC', status: 'lunas',
    catatan: 'Catering Toko Oleh-Oleh Merdeka',
    merchant: { namaUsaha: 'Bakso Aci Skyni', kota: 'Bandung', provinsi: 'Jawa Barat' },
    kadaluarsa: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  'pay-inv-002': {
    jumlah: 70.00, aset: 'USDC', status: 'menunggu',
    catatan: 'Invoice Kantin Kampus Unpad',
    merchant: { namaUsaha: 'Bakso Aci Skyni', kota: 'Bandung', provinsi: 'Jawa Barat' },
    kadaluarsa: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString()
  }
}

export default function HalamanBayar() {
  const { paymentId } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [memproses, setMemproses] = useState(false)
  const [berhasil, setBerhasil] = useState(false)
  const [txHash, setTxHash] = useState('')
  const [sisaWaktu, setSisaWaktu] = useState('')

  useEffect(() => {
    setTimeout(() => {
      const found = DEMO_PAYMENTS[paymentId]
      if (found) {
        setData(found)
        if (found.status === 'lunas') { setBerhasil(true); setTxHash('demoTxHash' + paymentId) }
      } else {
        // Untuk paymentId yang dibuat saat runtime
        setData({
          jumlah: 10.00, aset: 'USDC', status: 'menunggu',
          catatan: 'Pembayaran via DaganganKu',
          merchant: { namaUsaha: 'Bakso Aci Skyni', kota: 'Bandung', provinsi: 'Jawa Barat' },
          kadaluarsa: new Date(Date.now() + 30 * 60 * 1000).toISOString()
        })
      }
      setLoading(false)
    }, 800)
  }, [paymentId])

  // Timer countdown
  useEffect(() => {
    if (!data?.kadaluarsa) return
    const interval = setInterval(() => {
      const sisa = new Date(data.kadaluarsa).getTime() - Date.now()
      if (sisa <= 0) { setSisaWaktu('Kadaluarsa'); clearInterval(interval); return }
      const menit = Math.floor(sisa / 60000)
      const detik = Math.floor((sisa % 60000) / 1000)
      setSisaWaktu(`${menit}:${String(detik).padStart(2, '0')}`)
    }, 1000)
    return () => clearInterval(interval)
  }, [data])

  // Simulasi proses bayar
  async function bayar() {
    setMemproses(true)
    toast('Menghubungkan ke Freighter wallet...')
    await new Promise(r => setTimeout(r, 1000))
    toast('Membangun transaksi Stellar...')
    await new Promise(r => setTimeout(r, 1000))
    toast('Menunggu konfirmasi jaringan...')
    await new Promise(r => setTimeout(r, 1500))
    const hash = 'stellar-tx-' + Math.random().toString(36).substring(2, 18)
    setBerhasil(true)
    setTxHash(hash)
    setMemproses(false)
    toast.success('✅ Pembayaran berhasil dikonfirmasi!')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 flex items-center justify-center">
        <Loader size={32} className="text-white animate-spin" />
      </div>
    )
  }

  const estimasiIDR = rupiah(data.jumlah * (stellarConfig.KURS[data.aset] || 16000))

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-4">

        {/* Logo */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <ShoppingBag size={16} className="text-white" />
            </div>
            <span className="text-white font-bold text-lg">DaganganKu</span>
          </div>
          <p className="text-purple-300 text-xs">Pembayaran via Stellar Network</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header merchant */}
          <div className="bg-gradient-to-r from-purple-800 to-indigo-700 p-5 text-center">
            <div className="w-12 h-12 rounded-full bg-white/20 text-white font-bold text-xl flex items-center justify-center mx-auto mb-2">
              {data.merchant?.namaUsaha?.[0]?.toUpperCase()}
            </div>
            <p className="text-white font-bold text-lg">{data.merchant?.namaUsaha}</p>
            <p className="text-purple-200 text-sm">{data.merchant?.kota}, {data.merchant?.provinsi}</p>
          </div>

          <div className="p-6">
            {berhasil ? (
              /* Sukses */
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={36} className="text-green-500" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-2">Pembayaran Berhasil! 🎉</h3>
                <p className="text-slate-500 text-sm mb-5">
                  {data.jumlah} {data.aset} telah dikirim ke {data.merchant?.namaUsaha}
                </p>
                <div className="bg-slate-50 rounded-xl p-3 text-left mb-4">
                  <p className="text-xs text-slate-500 mb-1">Transaction Hash</p>
                  <code className="text-xs font-mono text-slate-700 break-all leading-relaxed">{txHash}</code>
                </div>
                <a href={stellarConfig.explorerTx(txHash)} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-purple-600 text-sm font-medium hover:underline">
                  Lihat di Stellar Explorer <ExternalLink size={13} />
                </a>
              </div>
            ) : (
              /* Form bayar */
              <div className="space-y-4">
                {/* Jumlah */}
                <div className="text-center bg-slate-50 rounded-xl p-4">
                  <p className="text-slate-500 text-sm mb-1">Jumlah Pembayaran</p>
                  <p className="text-4xl font-extrabold text-slate-900">{data.jumlah}</p>
                  <p className="text-lg font-semibold text-purple-600">{data.aset}</p>
                  <p className="text-slate-400 text-sm">≈ {estimasiIDR}</p>
                  {data.catatan && (
                    <p className="text-slate-600 text-sm mt-2 bg-white rounded-lg px-3 py-1.5">
                      📝 {data.catatan}
                    </p>
                  )}
                </div>

                {/* Timer */}
                {sisaWaktu && sisaWaktu !== 'Kadaluarsa' && (
                  <div className="flex items-center justify-center gap-2 text-amber-600 bg-amber-50 rounded-xl p-2.5">
                    <Clock size={15} />
                    <span className="text-sm font-medium">Berlaku: {sisaWaktu}</span>
                  </div>
                )}
                {sisaWaktu === 'Kadaluarsa' && (
                  <div className="bg-red-50 rounded-xl p-3 text-center text-red-600 text-sm font-medium">
                    ⛔ Link pembayaran sudah kadaluarsa
                  </div>
                )}

                {/* Banner demo */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                  <p className="text-blue-700 text-xs font-semibold mb-1">🎮 Mode Demo</p>
                  <p className="text-blue-600 text-xs">
                    Di produksi, klik tombol ini akan membuka Freighter wallet untuk tanda tangan transaksi Stellar.
                  </p>
                </div>

                {/* Tombol bayar */}
                <button onClick={bayar}
                  disabled={memproses || sisaWaktu === 'Kadaluarsa' || data.status === 'lunas'}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-base">
                  {memproses
                    ? <><Loader size={18} className="animate-spin" /> Memproses di Stellar...</>
                    : data.status === 'lunas'
                    ? '✅ Sudah Dibayar'
                    : <><Zap size={18} /> Bayar {data.jumlah} {data.aset}</>
                  }
                </button>

                <p className="text-center text-xs text-slate-400">
                  Transaksi diproses di jaringan Stellar · konfirmasi ~3-5 detik
                </p>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-purple-300 text-xs">
          Powered by DaganganKu × Stellar Network
        </p>
      </div>
    </div>
  )
}