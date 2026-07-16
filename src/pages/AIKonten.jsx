import { useState, useEffect } from 'react'
import { Sparkles, Copy, Trash2, CheckCircle, Loader, Info, RefreshCw } from 'lucide-react'
import { generateKonten, getKonten, hapusKonten } from '../mock/api'
import { ambilUser } from '../utils/auth'
import { tanggal } from '../utils/format'
import toast from 'react-hot-toast'

const PLATFORM_OPTIONS = ['Instagram', 'WhatsApp', 'TikTok', 'Facebook', 'Twitter/X']
const TIPE_OPTIONS = ['Caption Promosi', 'Story / Status', 'Caption Produk', 'Pengumuman PO']
const TONE_OPTIONS = ['Santai & Friendly', 'Profesional', 'Playful & Fun', 'Informatif']

export default function AIKonten() {
  const user = ambilUser()
  const [kontenList, setKontenList] = useState([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [disalinId, setDisalinId] = useState(null)
  const [form, setForm] = useState({
    platform: 'Instagram',
    tipe: 'Caption Promosi',
    produk: '',
    tujuan: '',
    tone: 'Santai & Friendly',
    tambahan: '',
    judul: '',
  })

  const belumAdaApiKey = !import.meta.env.VITE_DAHL_API_KEY ||
    import.meta.env.VITE_DAHL_API_KEY === 'ISI_DAHL_API_KEY_DISINI'

  useEffect(() => { load() }, [])
  async function load() { setKontenList(await getKonten()); setLoading(false) }

  async function generate(e) {
    e.preventDefault()
    if (!form.produk.trim()) { toast.error('Ceritakan produk atau tujuan kontenmu dulu'); return }
    setGenerating(true)
    try {
      const hasil = await generateKonten({ ...form, namaUsaha: user?.namaUsaha || 'Usaha Kami' })
      setKontenList(prev => [hasil, ...prev])
      toast.success('Konten berhasil dibuat! ✨')
    } catch (err) {
      toast.error(err.message || 'Gagal generate konten')
    } finally {
      setGenerating(false)
    }
  }

  async function hapus(id) {
    if (!confirm('Hapus konten ini?')) return
    await hapusKonten(id)
    setKontenList(prev => prev.filter(k => k.id !== id))
    toast.success('Konten dihapus')
  }

  function salin(id, teks) {
    navigator.clipboard.writeText(teks)
    setDisalinId(id)
    toast.success('Konten disalin ke clipboard!')
    setTimeout(() => setDisalinId(null), 2000)
  }

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Sparkles size={22} className="text-pink-500" /> AI Konten Marketing
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Ceritakan produkmu, AI langsung buatkan caption IG, status WA, atau promosi siap pakai.
        </p>
      </div>

      {/* Info API key */}
      {belumAdaApiKey ? (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
          <Info size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-800 text-sm">Mode Demo — Template Statis</p>
            <p className="text-blue-700 text-xs mt-1">
              Untuk AI sungguhan, tambahkan <code className="bg-blue-100 px-1 rounded">VITE_DAHL_API_KEY</code> di
              file <code className="bg-blue-100 px-1 rounded">.env</code>.
              Sekarang menggunakan template konten yang sudah didesain untuk UMKM.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-start gap-3">
          <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-green-800 text-sm">Kimi K2 AI Terhubung ✅</p>
            <p className="text-green-700 text-xs mt-1">API key terdeteksi. Konten akan dibuat menggunakan Kimi K2 AI secara real-time.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form generate */}
        <div className="card">
          <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Sparkles size={16} className="text-pink-500" /> Buat Konten Baru
          </h2>

          <form onSubmit={generate} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Platform</label>
                <select className="input" value={form.platform}
                  onChange={e => setForm({...form, platform: e.target.value})}>
                  {PLATFORM_OPTIONS.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Tipe Konten</label>
                <select className="input" value={form.tipe}
                  onChange={e => setForm({...form, tipe: e.target.value})}>
                  {TIPE_OPTIONS.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="label">Produk / Layanan yang mau dipromosikan *</label>
              <input className="input" placeholder="Contoh: Bakso Aci Spicy pack 10 pcs"
                value={form.produk} onChange={e => setForm({...form, produk: e.target.value})} required />
            </div>

            <div>
              <label className="label">Tujuan Konten</label>
              <input className="input" placeholder="Contoh: Promosi flash sale akhir pekan, diskon 20%"
                value={form.tujuan} onChange={e => setForm({...form, tujuan: e.target.value})} />
            </div>

            <div>
              <label className="label">Tone / Gaya Bahasa</label>
              <select className="input" value={form.tone}
                onChange={e => setForm({...form, tone: e.target.value})}>
                {TONE_OPTIONS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="label">Info Tambahan <span className="text-slate-400 font-normal">(opsional)</span></label>
              <textarea className="input resize-none" rows={2}
                placeholder="Harga, stok, cara order, promo khusus, dll"
                value={form.tambahan} onChange={e => setForm({...form, tambahan: e.target.value})} />
            </div>

            <button type="submit" disabled={generating}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-3 px-5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50">
              {generating
                ? <><Loader size={17} className="animate-spin" /> {belumAdaApiKey ? 'Menyusun template...' : 'Claude sedang menulis...'}</>
                : <><Sparkles size={17} /> Generate Konten</>
              }
            </button>
          </form>
        </div>

        {/* Hasil konten terbaru */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900">Konten Tersimpan</h2>
            <button onClick={load} className="btn-secondary btn-sm"><RefreshCw size={14} /></button>
          </div>

          {loading ? (
            <div className="space-y-3">{[1,2].map(i => <div key={i} className="card shimmer h-40" />)}</div>
          ) : kontenList.length === 0 ? (
            <div className="card text-center py-12">
              <Sparkles size={36} className="mx-auto mb-3 text-slate-300" />
              <p className="text-slate-500 text-sm">Belum ada konten. Buat konten pertamamu!</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              {kontenList.map(k => (
                <div key={k.id} className="card hover:shadow-md transition-shadow">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="badge badge-purple">{k.platform}</span>
                        <span className="badge badge-gray">{k.tipe}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{tanggal(k.createdAt)}</p>
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <button onClick={() => salin(k.id, k.isi)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600">
                        {disalinId === k.id ? <CheckCircle size={15} className="text-green-500" /> : <Copy size={15} />}
                      </button>
                      <button onClick={() => hapus(k.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Isi konten */}
                  <div className="bg-slate-50 rounded-xl p-3">
                    <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed line-clamp-8">
                      {k.isi}
                    </pre>
                  </div>

                  <button onClick={() => salin(k.id, k.isi)}
                    className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm transition-colors">
                    {disalinId === k.id ? <><CheckCircle size={14} className="text-green-500" /> Disalin!</> : <><Copy size={14} /> Salin Konten</>}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
