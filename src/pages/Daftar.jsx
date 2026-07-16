import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, CheckCircle, Loader } from 'lucide-react'
import { daftar } from '../mock/api'
import { simpanLogin } from '../utils/auth'
import toast from 'react-hot-toast'

export default function Daftar() {
  const navigate = useNavigate()
  const [langkah, setLangkah] = useState(1)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    nama: '', email: '', password: '', noHp: '',
    namaUsaha: '', jenisUsaha: 'Makanan & Minuman', kota: '', provinsi: '',
  })

  const ubah = (k, v) => setForm(p => ({ ...p, [k]: v }))

  async function submit(e) {
    e.preventDefault()
    if (langkah === 1) { setLangkah(2); return }
    setLoading(true)
    try {
      const res = await daftar(form)
      simpanLogin(res.token, res.user)
      toast.success('Akun berhasil dibuat! 🚀')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.message || 'Gagal mendaftar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 flex items-center justify-center p-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <ShoppingBag size={20} className="text-white" />
            </div>
            <span className="text-white font-bold text-xl">DaganganKu</span>
          </Link>
          <h1 className="text-white font-bold text-2xl">Daftar Gratis</h1>
          <p className="text-purple-200 text-sm mt-1">Mulai terima pembayaran digital</p>
        </div>

        {/* Indikator langkah */}
        <div className="flex items-center gap-2 mb-5 px-2">
          {[1, 2].map(no => (
            <div key={no} className="flex items-center gap-2 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-colors ${
                langkah >= no ? 'bg-white text-purple-700' : 'bg-white/20 text-white'
              }`}>
                {langkah > no ? <CheckCircle size={14} /> : no}
              </div>
              <span className={`text-sm ${langkah >= no ? 'text-white' : 'text-purple-300'}`}>
                {no === 1 ? 'Data Diri' : 'Data Usaha'}
              </span>
              {no < 2 && <div className="flex-1 h-0.5 bg-white/20 rounded" />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-7">
          <form onSubmit={submit} className="space-y-4">
            {langkah === 1 && (
              <>
                <div>
                  <label className="label">Nama Lengkap</label>
                  <input className="input" placeholder="Nama kamu"
                    value={form.nama} onChange={e => ubah('nama', e.target.value)} required />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input type="email" className="input" placeholder="email@kamu.com"
                    value={form.email} onChange={e => ubah('email', e.target.value)} required />
                </div>
                <div>
                  <label className="label">Password</label>
                  <input type="password" className="input" placeholder="Min. 8 karakter" minLength={8}
                    value={form.password} onChange={e => ubah('password', e.target.value)} required />
                </div>
                <div>
                  <label className="label">No. HP / WhatsApp</label>
                  <input className="input" placeholder="08123456789"
                    value={form.noHp} onChange={e => ubah('noHp', e.target.value)} required />
                </div>
              </>
            )}

            {langkah === 2 && (
              <>
                <div>
                  <label className="label">Nama Usaha</label>
                  <input className="input" placeholder="Nama toko / brand kamu"
                    value={form.namaUsaha} onChange={e => ubah('namaUsaha', e.target.value)} required />
                </div>
                <div>
                  <label className="label">Kategori Usaha</label>
                  <select className="input" value={form.jenisUsaha} onChange={e => ubah('jenisUsaha', e.target.value)}>
                    <option>Makanan & Minuman</option>
                    <option>Fashion & Pakaian</option>
                    <option>Kerajinan & Handmade</option>
                    <option>Kecantikan & Perawatan</option>
                    <option>Jasa & Layanan</option>
                    <option>Pertanian & Perkebunan</option>
                    <option>Lainnya</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Kota</label>
                    <input className="input" placeholder="Bandung"
                      value={form.kota} onChange={e => ubah('kota', e.target.value)} required />
                  </div>
                  <div>
                    <label className="label">Provinsi</label>
                    <input className="input" placeholder="Jawa Barat"
                      value={form.provinsi} onChange={e => ubah('provinsi', e.target.value)} required />
                  </div>
                </div>
                <div className="bg-purple-50 border border-purple-100 rounded-xl p-3 flex items-start gap-2">
                  <CheckCircle size={15} className="text-purple-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-purple-700">
                    Wallet pembayaran digital sudah disiapkan otomatis. Kamu bisa langsung terima pembayaran setelah daftar.
                  </p>
                </div>
              </>
            )}

            <div className="flex gap-3 pt-1">
              {langkah === 2 && (
                <button type="button" onClick={() => setLangkah(1)} className="btn-secondary flex-1">
                  Kembali
                </button>
              )}
              <button type="submit" className="btn-primary flex-1" disabled={loading}>
                {loading
                  ? <><Loader size={16} className="animate-spin" /> Membuat akun...</>
                  : langkah === 1 ? 'Lanjut →' : 'Daftar Sekarang'
                }
              </button>
            </div>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-purple-600 font-semibold hover:underline">Masuk</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
