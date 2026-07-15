import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Trash2, ChevronLeft, Loader } from 'lucide-react'
import { buatInvoice, getProduk } from '../mock/api'
import toast from 'react-hot-toast'

let idCounter = 1
const itemBaru = () => ({ id: `item-${idCounter++}`, nama: '', qty: 1, satuan: 'pack', harga: 0 })

export default function BuatInvoice() {
  const navigate = useNavigate()
  const [produkList, setProdukList] = useState([])
  const [loading, setLoading] = useState(false)
  const [pelanggan, setPelanggan] = useState({ namaPelanggan: '', noHpPelanggan: '', emailPelanggan: '' })
  const [items, setItems] = useState([itemBaru()])
  const [diskon, setDiskon] = useState(0)
  const [catatan, setCatatan] = useState('')
  const [aset, setAset] = useState('USDC')

  useEffect(() => { getProduk().then(setProdukList) }, [])

  const subtotal = items.reduce((s, i) => s + (parseFloat(i.qty) || 0) * (parseFloat(i.harga) || 0), 0)
  const total = Math.max(0, subtotal - parseFloat(diskon || 0))

  const ubahItem = (id, f, v) => setItems(p => p.map(i => i.id === id ? { ...i, [f]: v } : i))

  function pilihProduk(itemId, pid) {
    const p = produkList.find(x => x._id === pid)
    if (p) {
      ubahItem(itemId, 'nama', p.nama)
      ubahItem(itemId, 'harga', p.harga)
      ubahItem(itemId, 'satuan', p.satuan || 'pack')
    }
  }

  async function submit(e) {
    e.preventDefault()
    if (!pelanggan.namaPelanggan.trim()) { toast.error('Nama pelanggan wajib diisi'); return }
    if (items.some(i => !i.nama.trim())) { toast.error('Nama item tidak boleh kosong'); return }
    if (total <= 0) { toast.error('Total harus lebih dari 0'); return }

    setLoading(true)
    try {
      await buatInvoice({
        ...pelanggan,
        items: items.map(i => ({ ...i, qty: parseFloat(i.qty), harga: parseFloat(i.harga) })),
        diskon: parseFloat(diskon || 0),
        catatan,
        aset
      })
      toast.success('Invoice berhasil dibuat!')
      navigate('/dashboard/invoice')
    } catch { toast.error('Gagal membuat invoice') }
    finally { setLoading(false) }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5 fade-in">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-600">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Buat Invoice</h1>
          <p className="text-slate-500 text-sm">Invoice profesional dengan link pembayaran Stellar</p>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-5">
        {/* Data pelanggan */}
        <div className="card">
          <h2 className="font-bold text-slate-900 mb-4">Data Pelanggan</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Nama Pelanggan *</label>
              <input className="input" placeholder="Kantin Kampus" value={pelanggan.namaPelanggan}
                onChange={e => setPelanggan({...pelanggan, namaPelanggan: e.target.value})} required />
            </div>
            <div>
              <label className="label">No. HP</label>
              <input className="input" placeholder="08..." value={pelanggan.noHpPelanggan}
                onChange={e => setPelanggan({...pelanggan, noHpPelanggan: e.target.value})} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Email</label>
              <input type="email" className="input" value={pelanggan.emailPelanggan}
                onChange={e => setPelanggan({...pelanggan, emailPelanggan: e.target.value})} />
            </div>
          </div>
        </div>

        {/* Item pesanan */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900">Item Pesanan</h2>
            <button type="button" onClick={() => setItems(p => [...p, itemBaru()])} className="btn-secondary btn-sm">
              <Plus size={14} /> Tambah Item
            </button>
          </div>
          <div className="space-y-4">
            {items.map((item, idx) => (
              <div key={item.id} className="bg-slate-50 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-500">Item #{idx + 1}</span>
                  {items.length > 1 && (
                    <button type="button" onClick={() => setItems(p => p.filter(i => i.id !== item.id))}
                      className="p-1 rounded-lg text-red-400 hover:bg-red-50">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                {produkList.length > 0 && (
                  <div>
                    <label className="label text-xs">Pilih dari katalog (opsional)</label>
                    <select className="input text-sm !py-2" onChange={e => pilihProduk(item.id, e.target.value)} defaultValue="">
                      <option value="">— Pilih produk —</option>
                      {produkList.map(p => <option key={p._id} value={p._id}>{p.nama} ({p.harga} USDC/{p.satuan})</option>)}
                    </select>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="label text-xs">Nama Item *</label>
                    <input className="input text-sm !py-2" value={item.nama}
                      onChange={e => ubahItem(item.id, 'nama', e.target.value)} required />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="label text-xs">Qty</label>
                      <input type="number" min="1" className="input text-sm !py-2" value={item.qty}
                        onChange={e => ubahItem(item.id, 'qty', e.target.value)} />
                    </div>
                    <div>
                      <label className="label text-xs">Satuan</label>
                      <input className="input text-sm !py-2" value={item.satuan}
                        onChange={e => ubahItem(item.id, 'satuan', e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="label text-xs">Harga (USDC)</label>
                    <input type="number" step="0.01" min="0" className="input text-sm !py-2 w-36"
                      value={item.harga || ''} onChange={e => ubahItem(item.id, 'harga', e.target.value)} />
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Subtotal</p>
                    <p className="font-bold text-purple-700">
                      {((parseFloat(item.qty) || 0) * (parseFloat(item.harga) || 0)).toFixed(4)} USDC
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ringkasan */}
        <div className="card">
          <h2 className="font-bold text-slate-900 mb-4">Ringkasan</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="label">Diskon (USDC)</label>
              <input type="number" step="0.01" min="0" className="input" placeholder="0"
                value={diskon} onChange={e => setDiskon(e.target.value)} />
            </div>
            <div>
              <label className="label">Aset Pembayaran</label>
              <select className="input" value={aset} onChange={e => setAset(e.target.value)}>
                <option value="USDC">💵 USDC (Stablecoin)</option>
                <option value="XLM">⭐ XLM (Stellar Native)</option>
              </select>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm text-slate-600">
              <span>Subtotal</span><span>{subtotal.toFixed(4)} USDC</span>
            </div>
            {parseFloat(diskon || 0) > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Diskon</span><span>- {parseFloat(diskon).toFixed(4)} USDC</span>
              </div>
            )}
            <div className="flex justify-between font-extrabold text-xl text-slate-900 border-t border-slate-200 pt-3 mt-1">
              <span>Total</span>
              <span className="text-purple-700">{total.toFixed(4)} USDC</span>
            </div>
          </div>

          <div className="mt-4">
            <label className="label">Catatan</label>
            <textarea className="input resize-none" rows={2} placeholder="Terima kasih atas kepercayaan Anda..."
              value={catatan} onChange={e => setCatatan(e.target.value)} />
          </div>
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">Batal</button>
          <button type="submit" className="btn-primary flex-1" disabled={loading}>
            {loading ? <><Loader size={16} className="animate-spin" /> Menyimpan...</> : 'Buat Invoice'}
          </button>
        </div>
      </form>
    </div>
  )
}