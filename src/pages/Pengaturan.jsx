import { useState } from 'react'
import { Save, Loader, User, Info, CheckCircle, AlertTriangle, ExternalLink, Copy } from 'lucide-react'
import { updateProfil } from '../mock/api'
import { ambilUser, simpanLogin, ambilToken, updateUserLocal } from '../utils/auth'
import stellarConfig from '../config/stellar'
import toast from 'react-hot-toast'

export default function Pengaturan() {
  const user = ambilUser()
  const [tab, setTab] = useState('profil')
  const [form, setForm] = useState({
    nama: user?.nama || '',
    noHp: user?.noHp || '',
    namaUsaha: user?.namaUsaha || '',
    jenisUsaha: user?.jenisUsaha || 'Makanan & Minuman',
    kota: user?.kota || '',
    provinsi: user?.provinsi || '',
  })
  const [loading, setLoading] = useState(false)
  const [disalin, setDisalin] = useState('')

  const belumIsi = stellarConfig.PLATFORM_PUBLIC_KEY === 'MASUKKAN_STELLAR_PUBLIC_KEY_KAMU_DI_SINI'

  async function simpan(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const updated = await updateProfil(form)
      updateUserLocal(updated)
      toast.success('Profil berhasil diperbarui!')
    } catch { toast.error('Gagal menyimpan') }
    finally { setLoading(false) }
  }

  function salin(teks, id) {
    navigator.clipboard.writeText(teks)
    setDisalin(id)
    toast.success('Disalin!')
    setTimeout(() => setDisalin(''), 2000)
  }

  const tabs = [
    { id: 'profil', label: 'Profil & Usaha' },
    { id: 'stellar', label: '⭐ Panduan Stellar' },
    { id: 'ai', label: '🤖 Panduan AI' },
  ]

  return (
    <div className="max-w-2xl mx-auto space-y-5 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Pengaturan</h1>
        <p className="text-slate-500 text-sm">Profil, wallet Stellar, dan konfigurasi AI</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
              tab === t.id ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab: Profil */}
      {tab === 'profil' && (
        <div className="space-y-4">
          {/* Info akun */}
          <div className="card bg-purple-50 border border-purple-100 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-600 text-white font-bold text-2xl flex items-center justify-center flex-shrink-0">
              {user?.namaUsaha?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-slate-900">{user?.namaUsaha}</p>
              <p className="text-sm text-slate-500">{user?.email}</p>
              <p className="text-xs font-semibold text-purple-600">{user?.userId}</p>
            </div>
          </div>

          <div className="card">
            <h2 className="font-bold text-slate-900 mb-5 flex items-center gap-2">
              <User size={17} className="text-purple-600" /> Informasi Usaha
            </h2>
            <form onSubmit={simpan} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Nama Lengkap</label>
                  <input className="input" value={form.nama} onChange={e => setForm({...form, nama: e.target.value})} />
                </div>
                <div>
                  <label className="label">Nama Usaha</label>
                  <input className="input" value={form.namaUsaha} onChange={e => setForm({...form, namaUsaha: e.target.value})} />
                </div>
                <div>
                  <label className="label">Kategori Usaha</label>
                  <select className="input" value={form.jenisUsaha} onChange={e => setForm({...form, jenisUsaha: e.target.value})}>
                    <option>Makanan & Minuman</option>
                    <option>Fashion & Pakaian</option>
                    <option>Kerajinan & Handmade</option>
                    <option>Kecantikan & Perawatan</option>
                    <option>Jasa & Layanan</option>
                    <option>Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="label">No. HP</label>
                  <input className="input" value={form.noHp} onChange={e => setForm({...form, noHp: e.target.value})} />
                </div>
                <div>
                  <label className="label">Kota</label>
                  <input className="input" value={form.kota} onChange={e => setForm({...form, kota: e.target.value})} />
                </div>
                <div>
                  <label className="label">Provinsi</label>
                  <input className="input" value={form.provinsi} onChange={e => setForm({...form, provinsi: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? <><Loader size={16} className="animate-spin" /> Menyimpan...</> : <><Save size={16} /> Simpan Perubahan</>}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab: Panduan Stellar */}
      {tab === 'stellar' && (
        <div className="space-y-4">

          {/* Status koneksi */}
          <div className={`card border ${belumIsi ? 'border-amber-200 bg-amber-50' : 'border-green-200 bg-green-50'}`}>
            <div className="flex items-center gap-3">
              {belumIsi
                ? <AlertTriangle size={22} className="text-amber-500 flex-shrink-0" />
                : <CheckCircle size={22} className="text-green-500 flex-shrink-0" />
              }
              <div>
                <p className={`font-bold ${belumIsi ? 'text-amber-800' : 'text-green-800'}`}>
                  {belumIsi ? 'Stellar belum dikonfigurasi' : 'Stellar sudah terhubung ✅'}
                </p>
                <p className={`text-xs mt-0.5 ${belumIsi ? 'text-amber-700' : 'text-green-700'}`}>
                  {belumIsi
                    ? 'Ikuti panduan di bawah untuk menghubungkan wallet Stellar'
                    : `Public Key: ${stellarConfig.PLATFORM_PUBLIC_KEY.slice(0, 20)}...`
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Langkah-langkah */}
          <div className="card">
            <h2 className="font-bold text-slate-900 mb-5">📋 Cara Menghubungkan Stellar Testnet</h2>

            <div className="space-y-6">
              {/* Langkah 1 */}
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900 mb-1">Buat Stellar Keypair</p>
                  <p className="text-slate-600 text-sm mb-3">
                    Buka Stellar Laboratory untuk generate public key dan secret key baru.
                  </p>
                  <a href="https://laboratory.stellar.org/#account-creator?network=test"
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors">
                    Buka Stellar Laboratory <ExternalLink size={13} />
                  </a>
                  <div className="mt-3 bg-slate-50 rounded-xl p-3">
                    <p className="text-xs text-slate-500 mb-1">Di sana kamu akan dapat:</p>
                    <p className="text-xs text-slate-700">• <strong>Public Key</strong> — alamat wallet (aman dibagikan)</p>
                    <p className="text-xs text-slate-700">• <strong>Secret Key</strong> — kunci rahasia (JANGAN dibagikan!)</p>
                  </div>
                </div>
              </div>

              {/* Langkah 2 */}
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900 mb-1">Danai dengan Friendbot (Testnet)</p>
                  <p className="text-slate-600 text-sm mb-3">
                    Friendbot akan mengisi wallet testnetmu dengan 10.000 XLM gratis.
                    Paste public key kamu ke URL ini di browser:
                  </p>
                  <div className="bg-slate-800 rounded-xl p-3 flex items-center gap-2">
                    <code className="text-green-400 text-xs flex-1 break-all">
                      https://friendbot.stellar.org?addr=PASTE_PUBLIC_KEY_KAMU
                    </code>
                    <button onClick={() => salin('https://friendbot.stellar.org?addr=', 'friendbot')}
                      className="p-1 text-slate-400 hover:text-white flex-shrink-0">
                      {disalin === 'friendbot' ? <CheckCircle size={14} className="text-green-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Langkah 3 */}
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900 mb-1">Buka File Konfigurasi</p>
                  <p className="text-slate-600 text-sm mb-3">
                    Di VS Code, buka file ini:
                  </p>
                  <div className="bg-slate-800 rounded-xl p-3 flex items-center gap-2">
                    <code className="text-yellow-400 text-xs flex-1">src/config/stellar.js</code>
                    <button onClick={() => salin('src/config/stellar.js', 'path')}
                      className="p-1 text-slate-400 hover:text-white flex-shrink-0">
                      {disalin === 'path' ? <CheckCircle size={14} className="text-green-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Langkah 4 */}
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">4</div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900 mb-1">Isi Public Key</p>
                  <p className="text-slate-600 text-sm mb-3">
                    Ganti baris <code className="bg-slate-100 px-1 rounded text-purple-600">PLATFORM_PUBLIC_KEY</code> dengan public key kamu:
                  </p>
                  <div className="bg-slate-800 rounded-xl p-3 text-xs font-mono leading-relaxed">
                    <p className="text-slate-400">// Sebelum:</p>
                    <p className="text-red-400">PLATFORM_PUBLIC_KEY: <span className="text-orange-300">'MASUKKAN_STELLAR_PUBLIC_KEY_KAMU_DI_SINI'</span>,</p>
                    <br />
                    <p className="text-slate-400">// Sesudah:</p>
                    <p className="text-green-400">PLATFORM_PUBLIC_KEY: <span className="text-orange-300">'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'</span>,</p>
                  </div>
                  <div className="mt-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
                    <p className="text-xs text-amber-700">
                      ⚠️ Hanya isi <strong>Public Key</strong> di sini. Secret key jangan diletakkan di frontend karena bisa dilihat orang.
                    </p>
                  </div>
                </div>
              </div>

              {/* Langkah 5 */}
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">5</div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900 mb-1">Verifikasi di Stellar Explorer</p>
                  <p className="text-slate-600 text-sm mb-3">
                    Setelah diisi, cek wallet kamu di Stellar Explorer untuk memastikan sudah aktif dan ada saldo.
                  </p>
                  <a href="https://stellar.expert/explorer/testnet"
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 btn-outline btn-sm">
                    Buka Stellar Explorer <ExternalLink size={13} />
                  </a>
                </div>
              </div>

              {/* Langkah 6 */}
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">6</div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900 mb-1">Install Freighter Wallet (untuk demo bayar)</p>
                  <p className="text-slate-600 text-sm mb-3">
                    Freighter adalah wallet Stellar berbasis extensi browser. Ini yang pembeli pakai untuk scan QR dan bayar.
                  </p>
                  <a href="https://freighter.app" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 btn-outline btn-sm">
                    Download Freighter <ExternalLink size={13} />
                  </a>
                  <div className="mt-2 bg-slate-50 rounded-xl p-3">
                    <p className="text-xs text-slate-600">Setelah install:</p>
                    <p className="text-xs text-slate-600">1. Buka Freighter → Settings → Network</p>
                    <p className="text-xs text-slate-600">2. Pilih <strong>"Test SDF Network"</strong> (bukan Mainnet)</p>
                    <p className="text-xs text-slate-600">3. Buat akun baru atau import secret key dari Stellar Laboratory</p>
                    <p className="text-xs text-slate-600">4. Danai akun Freighter dengan Friendbot juga</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Panduan AI */}
      {tab === 'ai' && (
        <div className="space-y-4">
          <div className="card">
            <h2 className="font-bold text-slate-900 mb-5">🤖 Cara Sambungkan Claude AI</h2>

            <div className="space-y-6">
              {/* Langkah 1 */}
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-pink-500 text-white font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900 mb-1">Daftar di Anthropic Console</p>
                  <p className="text-slate-600 text-sm mb-3">
                    Buat akun dan dapatkan API key Claude di Anthropic Console.
                  </p>
                  <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors">
                    Buka Anthropic Console <ExternalLink size={13} />
                  </a>
                </div>
              </div>

              {/* Langkah 2 */}
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-pink-500 text-white font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900 mb-1">Buat File .env</p>
                  <p className="text-slate-600 text-sm mb-3">
                    Di root folder project (sejajar dengan <code className="bg-slate-100 px-1 rounded">package.json</code>), buat file baru bernama <code className="bg-slate-100 px-1 rounded">.env</code>:
                  </p>
                  <div className="bg-slate-800 rounded-xl p-3 flex items-start gap-2">
                    <code className="text-green-400 text-xs flex-1 break-all">
                      VITE_ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxx
                    </code>
                    <button onClick={() => salin('VITE_ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxx', 'envkey')}
                      className="p-1 text-slate-400 hover:text-white flex-shrink-0">
                      {disalin === 'envkey' ? <CheckCircle size={14} className="text-green-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Langkah 3 */}
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-pink-500 text-white font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900 mb-1">Restart Dev Server</p>
                  <p className="text-slate-600 text-sm mb-3">
                    Stop server yang berjalan (Ctrl+C), lalu jalankan lagi:
                  </p>
                  <div className="bg-slate-800 rounded-xl p-3 flex items-center gap-2">
                    <code className="text-yellow-400 text-xs">npm run dev</code>
                  </div>
                </div>
              </div>

              {/* Langkah 4 */}
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-pink-500 text-white font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">4</div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900 mb-1">Coba di Halaman AI Konten</p>
                  <p className="text-slate-600 text-sm">
                    Pergi ke menu <strong>AI Konten</strong> dan coba generate. Kalau berhasil, banner akan berubah menjadi hijau bertuliskan "Claude AI Terhubung".
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}