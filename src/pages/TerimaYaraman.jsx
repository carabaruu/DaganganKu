import { useState, useRef, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { QrCode, RefreshCw, Copy, Share2, CheckCircle, Loader, ExternalLink } from 'lucide-react'
import { buatQR, cekBayar, simulasiBayar } from '../mock/api'
import { ambilUser } from '../utils/auth'
import { rupiah, potongAlamat } from '../utils/format'
import stellarConfig from '../config/stellar'
import toast from 'react-hot-toast'

const NOMINAL = [1, 2, 5, 10, 25, 50]

export default function TerimaYaraman() {
  const user = ambilUser()
  const [jumlah, setJumlah] = useState('')
  const [aset, setAset] = useState('USDC')
  const [catatan, setCatatan] = useState('')
  const [namaPembeli, setNamaPembeli] = useState('')
  const [loading, setLoading] = useState(false)
  const [qr, setQr] = useState(null)
  const [status, setStatus] = useState('menunggu')
  const [txHash, setTxHash] = useState('')
  const [simLoading, setSimLoading] = useState(false)
  const [disalin, setDisalin] = useState(false)
  const pollRef = useRef(null)

  useEffect(() => () => clearInterval(pollRef.current), [])

  async function generate(e) {
    e.preventDefault()
    if (!jumlah || parseFloat(jumlah) <= 0) { toast.error('Masukkan jumlah yang valid'); return }
    setLoading(true)
    clearInterval(pollRef.current)
    try {
      const res = await buatQR({ jumlah: parseFloat(jumlah), aset, catatan, namaPembeli })
      setQr(res)
      setStatus('menunggu')
      setTxHash('')
      pollRef.current = setInterval(async () => {
        const cek = await cekBayar(res.paymentId)
        if (cek.sudahBayar) { setStatus('selesai'); clearInterval(pollRef.current) }
      }, 3000)
    } catch { toast.error('Gagal membuat QR') }
    finally { setLoading(false) }
  }

  async function simulasi() {
    setSimLoading(true)
    toast('Memproses transaksi di jaringan Stellar...')
    try {
      const res = await simulasiBayar(qr.paymentId)
      setStatus('selesai')
      setTxHash(res.txHash)
      clearInterval(pollRef.current)
      toast.success('🎉 Pembayaran dikonfirmasi!')
    } catch { toast.error('Simulasi gagal') }
    finally { setSimLoading(false) }
  }

  function reset() {
    clearInterval(pollRef.current)
    setQr(null); setStatus('menunggu'); setJumlah(''); setCatatan(''); setNamaPembeli(''); setTxHash('')
  }

  function salinLink() {
    navigator.clipboard.writeText(`${window.location.origin}/bayar/${qr?.paymentId}`)
    toast.success('Link pembayaran disalin!')
  }

  function salinAlamat() {
    navigator.clipboard.writeText(stellarConfig.PLATFORM_PUBLIC_KEY)
    setDisalin(true)
    setTimeout(() => setDisalin(false), 2000)
  }

  const estimasi = jumlah ? rupiah(parseFloat(jumlah) * stellarConfig.KURS[aset]) : null

  return (
    <div className="max-w-lg mx-auto space-y-5 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Terima Pembayaran</h1>
        <p className="text-slate-500 text-sm">Generate QR Code untuk menerima USDC atau XLM via Stellar</p>
      </div>

      {!qr ? (
        <div className="card">
          <form onSubmit={generate} className="space-y-5">
            {/* Pilih aset */}
            <div>
              <label className="label">Pilih Aset</label>
              <div className="grid grid-cols-2 gap-3">
                {['USDC', 'XLM'].map(a => (
                  <button key={a} type="button" onClick={() => setAset(a)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${aset === a ? 'border-purple-500 bg-purple-50' : 'border-slate-200 hover:border-slate-300'}`}>
                    <div className="text-2xl mb-1">{a === 'USDC' ? '💵' : '⭐'}</div>
                    <p className="font-bold text-slate-900 text-sm">{a}</p>
                    <p className="text-xs text-slate-400">{a === 'USDC' ? `≈ ${rupiah(stellarConfig.KURS.USDC)}/USDC` : `≈ ${rupiah(stellarConfig.KURS.XLM)}/XLM`}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Jumlah */}
            <div>
              <label className="label">Jumlah ({aset})</label>
              <input type="number" step="0.01" min="0.01" className="input text-2xl font-bold"
                placeholder="0.00" value={jumlah} onChange={e => setJumlah(e.target.value)} required />
              {estimasi && <p className="text-sm text-slate-500 mt-1.5">≈ {estimasi}</p>}
            </div>

            {/* Nominal cepat */}
            <div className="flex flex-wrap gap-2">
              {NOMINAL.map(n => (
                <button key={n} type="button" onClick={() => setJumlah(n.toString())}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${jumlah === n.toString() ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  {n} {aset}
                </button>
              ))}
            </div>

            {/* Info opsional */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Nama Pembeli <span className="text-slate-400 font-normal">(opsional)</span></label>
                <input className="input" placeholder="Nama pembeli" value={namaPembeli} onChange={e => setNamaPembeli(e.target.value)} />
              </div>
              <div>
                <label className="label">Keterangan <span className="text-slate-400 font-normal">(opsional)</span></label>
                <input className="input" placeholder="PO, produk, dll" value={catatan} onChange={e => setCatatan(e.target.value)} />
              </div>
            </div>

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? <><Loader size={16} className="animate-spin" /> Membuat QR...</> : <><QrCode size={16} /> Generate QR Code</>}
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Banner status */}
          {status === 'selesai' ? (
            <div className="bg-green-500 text-white rounded-2xl p-4 flex items-center gap-3">
              <CheckCircle size={22} className="flex-shrink-0" />
              <div>
                <p className="font-bold">Pembayaran Diterima! 🎉</p>
                <p className="text-green-100 text-sm">{qr.jumlah} {qr.aset} sudah masuk ke wallet</p>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-center gap-3">
              <Loader size={16} className="text-amber-600 animate-spin flex-shrink-0" />
              <p className="text-amber-700 text-sm font-medium">Menunggu pembayaran... QR aktif 30 menit</p>
            </div>
          )}

          {/* QR Card */}
          <div className="card text-center">
            <p className="text-slate-500 text-sm font-medium">{user?.namaUsaha}</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">{qr.jumlah} {qr.aset}</p>
            <p className="text-slate-400 text-sm">≈ {rupiah(qr.jumlah * stellarConfig.KURS[qr.aset])}</p>
            {qr.catatan && (
              <span className="inline-block mt-2 text-sm text-slate-600 bg-slate-50 rounded-lg px-3 py-1">📝 {qr.catatan}</span>
            )}

            {/* QR Code */}
            <div className="flex justify-center my-5">
              <div className={`p-4 rounded-2xl border-4 transition-all ${status === 'selesai' ? 'border-green-500 bg-green-50' : 'border-slate-200'}`}>
                {status === 'selesai' ? (
                  <div className="w-48 h-48 flex items-center justify-center">
                    <CheckCircle size={72} className="text-green-500" />
                  </div>
                ) : (
                  <QRCodeSVG value={qr.qrPayload} size={192} level="H" fgColor="#4c1d95" />
                )}
              </div>
            </div>

            {/* Alamat Stellar */}
            <div className="bg-slate-50 rounded-xl p-3 text-left mb-4">
              <p className="text-xs text-slate-500 mb-1">Alamat Stellar Tujuan</p>
              <div className="flex items-center gap-2">
                <code className="text-xs font-mono text-slate-600 flex-1 truncate">
                  {stellarConfig.PLATFORM_PUBLIC_KEY === 'MASUKKAN_STELLAR_PUBLIC_KEY_KAMU_DI_SINI'
                    ? <span className="text-amber-600">Isi public key di src/config/stellar.js</span>
                    : stellarConfig.PLATFORM_PUBLIC_KEY
                  }
                </code>
                <button onClick={salinAlamat} className="p-1 text-slate-400 hover:text-slate-600 flex-shrink-0">
                  {disalin ? <CheckCircle size={14} className="text-green-500" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            {/* Tombol aksi */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button onClick={salinLink}
                className="flex items-center justify-center gap-1.5 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm">
                <Share2 size={15} /> Share Link
              </button>
              <a href={stellarConfig.explorerAccount(stellarConfig.PLATFORM_PUBLIC_KEY)}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm">
                <ExternalLink size={15} /> Explorer
              </a>
            </div>

            {/* Tombol simulasi demo */}
            {status !== 'selesai' && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-left">
                <p className="text-blue-700 text-xs font-semibold mb-1">🎮 Mode Demo</p>
                <p className="text-blue-600 text-xs mb-3">
                  Di produksi, pembeli scan QR ini lalu bayar via Freighter wallet. Klik tombol di bawah untuk simulasi.
                </p>
                <button onClick={simulasi} disabled={simLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
                  {simLoading
                    ? <><Loader size={15} className="animate-spin" /> Memproses di Stellar...</>
                    : '⚡ Simulasi Bayar Sekarang'
                  }
                </button>
              </div>
            )}

            {/* Hash sukses */}
            {txHash && (
              <div className="mt-3 text-left">
                <p className="text-xs text-slate-500 mb-1">Transaction Hash</p>
                <a href={stellarConfig.explorerTx(txHash)} target="_blank" rel="noopener noreferrer"
                  className="text-xs font-mono text-purple-600 hover:underline break-all">
                  {txHash}
                </a>
              </div>
            )}
          </div>

          <button onClick={reset} className="btn-secondary w-full">
            <RefreshCw size={16} /> Buat QR Baru
          </button>
        </div>
      )}
    </div>
  )
}