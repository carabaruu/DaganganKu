import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ShoppingBag, CheckCircle, Loader, ExternalLink, Clock, Zap, AlertCircle, Copy } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { rupiah } from '../utils/format'
import stellarConfig from '../config/stellar'
import toast from 'react-hot-toast'

export default function HalamanBayar() {
  const { paymentId } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [berhasil, setBerhasil] = useState(false)
  const [txHash, setTxHash] = useState('')
  const [sisaWaktu, setSisaWaktu] = useState('')
  const [polling, setPolling] = useState(false)

  useEffect(() => {
    const userRaw = localStorage.getItem('dk_user')
    const user = userRaw ? JSON.parse(userRaw) : null
    let found = null

    // 1. Cari di transaksi lokal (QR Terima Bayar)
    const lokalRaw = localStorage.getItem('dk_transaksi_lokal')
    const lokal = lokalRaw ? JSON.parse(lokalRaw) : []
    const tx = lokal.find(t => t.paymentId === paymentId)
    if (tx) {
      found = {
        jumlah: tx.jumlah,
        aset: tx.aset || 'USDC',
        catatan: tx.catatan || '',
        status: tx.status,
        stellarHash: tx.stellarHash || null,
        kadaluarsa: new Date(new Date(tx.createdAt).getTime() + 30 * 60 * 1000).toISOString(),
      }
    }

    // 2. Kalau tidak ketemu, cari di invoice
    if (!found) {
      const invoiceRaw = localStorage.getItem('dk_invoice')
      const invoices = invoiceRaw ? JSON.parse(invoiceRaw) : []
      const inv = invoices.find(i => i.paymentId === paymentId)
      if (inv) {
        found = {
          jumlah: inv.total,
          aset: 'USDC',
          catatan: 'Invoice ' + inv.nomorInvoice + (inv.namaPelanggan ? ' — ' + inv.namaPelanggan : ''),
          status: inv.status === 'lunas' ? 'selesai' : 'menunggu',
          stellarHash: null,
          kadaluarsa: new Date(new Date(inv.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        }
      }
    }

    if (found) {
      setData({
        ...found,
        merchant: {
          namaUsaha: user?.namaUsaha || 'Toko',
          kota: user?.kota || '',
          provinsi: user?.provinsi || '',
        },
        destination: stellarConfig.PLATFORM_PUBLIC_KEY,
      })
      if (found.status === 'selesai') {
        setBerhasil(true)
        setTxHash(found.stellarHash || '')
      }
    } else {
      setData(null)
    }
    setLoading(false)
  }, [paymentId])

  // Countdown timer
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

  // Polling cek pembayaran tiap 4 detik
  useEffect(() => {
    if (!data || berhasil || data.status === 'selesai') return
    setPolling(true)
    const interval = setInterval(async () => {
      try {
        const pubKey = stellarConfig.PLATFORM_PUBLIC_KEY
        if (!pubKey) return
        const memo = paymentId.slice(0, 28)
        const res = await fetch(`${stellarConfig.HORIZON_URL}/accounts/${pubKey}/payments?limit=10&order=desc`)
        const json = await res.json()
        const records = json._embedded?.records || []
        for (const r of records) {
          if (r.memo === memo || r.transaction_memo === memo) {
            // Update localStorage
            const lokalRaw = localStorage.getItem('dk_transaksi_lokal')
            const lokal = lokalRaw ? JSON.parse(lokalRaw) : []
            const idx = lokal.findIndex(t => t.paymentId === paymentId)
            if (idx !== -1) {
              lokal[idx] = { ...lokal[idx], status: 'selesai', stellarHash: r.transaction_hash }
              localStorage.setItem('dk_transaksi_lokal', JSON.stringify(lokal))
            }
            setTxHash(r.transaction_hash)
            setBerhasil(true)
            setPolling(false)
            clearInterval(interval)
            toast.success('Pembayaran berhasil dikonfirmasi!')
            return
          }
        }
      } catch { /* tetap polling */ }
    }, 4000)
    return () => clearInterval(interval)
  }, [data, berhasil, paymentId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 flex items-center justify-center">
        <Loader size={32} className="text-white animate-spin" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 text-center max-w-sm w-full">
          <AlertCircle size={40} className="text-red-400 mx-auto mb-3" />
          <h2 className="font-bold text-slate-800 text-lg mb-2">Link tidak ditemukan</h2>
          <p className="text-slate-500 text-sm">Link pembayaran ini tidak valid atau sudah kedaluwarsa.</p>
        </div>
      </div>
    )
  }

  const kursAset = data.aset === 'XLM' ? stellarConfig.KURS.XLM : stellarConfig.KURS.USDC
  const estimasiIDR = rupiah(data.jumlah * kursAset)

  // Build SEP-0007 deep link untuk buka Freighter / LOBSTR
  const memo = paymentId.slice(0, 28)
  const assetParam = data.aset === 'XLM'
    ? ''
    : `&asset_code=USDC&asset_issuer=${stellarConfig.USDC_ISSUER}`
  const sep7Link = `web+stellar:pay?destination=${data.destination}&amount=${parseFloat(data.jumlah).toFixed(7)}&memo=${memo}&memo_type=text${assetParam}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-4">

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
              {data.merchant.namaUsaha?.[0]?.toUpperCase()}
            </div>
            <p className="text-white font-bold text-lg">{data.merchant.namaUsaha}</p>
            {data.merchant.kota && (
              <p className="text-purple-200 text-sm">{data.merchant.kota}{data.merchant.provinsi ? `, ${data.merchant.provinsi}` : ''}</p>
            )}
          </div>

          <div className="p-6">
            {berhasil ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={36} className="text-green-500" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-2">Pembayaran Berhasil! 🎉</h3>
                <p className="text-slate-500 text-sm mb-5">
                  {data.jumlah} {data.aset} telah dikirim ke {data.merchant.namaUsaha}
                </p>
                {txHash && (
                  <>
                    <div className="bg-slate-50 rounded-xl p-3 text-left mb-4">
                      <p className="text-xs text-slate-500 mb-1">Transaction Hash</p>
                      <code className="text-xs font-mono text-slate-700 break-all leading-relaxed">{txHash}</code>
                    </div>
                    <a href={stellarConfig.explorerTx(txHash)} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-purple-600 text-sm font-medium hover:underline">
                      Lihat di Stellar Explorer <ExternalLink size={13} />
                    </a>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-4">
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

                {polling && (
                  <div className="flex items-center justify-center gap-2 text-purple-600 bg-purple-50 rounded-xl p-2.5">
                    <Loader size={14} className="animate-spin" />
                    <span className="text-xs">Menunggu konfirmasi pembayaran...</span>
                  </div>
                )}

                {/* QR Code SEP-0007 — scan pakai Freighter/LOBSTR di HP */}
                <div className="flex flex-col items-center gap-2">
                  <p className="text-xs text-slate-500 font-medium">Scan QR dengan Freighter / LOBSTR di HP</p>
                  <div className="bg-white border-2 border-purple-200 rounded-2xl p-3 inline-block">
                    <QRCodeSVG value={sep7Link} size={180} bgColor="#ffffff" fgColor="#1e1b4b" level="M" />
                  </div>
                  <p className="text-xs text-slate-400">atau buka di wallet yang sudah install di browser</p>
                </div>

                {/* Tombol buka wallet langsung (untuk mobile) */}
                <a href={sep7Link}
                  className={`w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm ${sisaWaktu === 'Kadaluarsa' ? 'opacity-50 pointer-events-none' : ''}`}>
                  <Zap size={16} /> Buka di Wallet ({data.jumlah} {data.aset})
                </a>

                {/* Copy link */}
                <button
                  onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link disalin!') }}
                  className="w-full border border-slate-200 text-slate-600 font-medium py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
                  <Copy size={14} /> Salin Link Pembayaran
                </button>

                <p className="text-center text-xs text-slate-400">
                  Konfirmasi otomatis ~3-5 detik setelah pembayaran terkirim
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
