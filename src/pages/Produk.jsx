import { useState, useEffect } from 'react'
import { Package, Plus, Pencil, Trash2, X, Loader } from 'lucide-react'
import { getProduk, tambahProduk, updateProduk, hapusProduk } from '../mock/api'
import { rupiah } from '../utils/format'
import toast from 'react-hot-toast'

const KOSONG = { nama: '', deskripsi: '', harga: '', hargaIDR: '', kategori: 'Makanan', satuan: 'pack', stok: '' }

export default function Produk() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [edit, setEdit] = useState(null)
  const [form, setForm] = useState(KOSONG)
  const [simpan, setSimpan] = useState(false)

  useEffect(() => { load() }, [])

  async function load() { setList(await getProduk()); setLoading(false) }

  function buka(item = null) {
    setEdit(item)
    setForm(item ? { nama: item.nama, deskripsi: item.deskripsi || '', harga: item.harga, hargaIDR: item.hargaIDR || '', kategori: item.kategori || 'Makanan', satuan: item.satuan || 'pack', stok: item.stok ?? '' } : KOSONG)
    setModal(true)
  }

  function tutup() { setModal(false); setEdit(null); setForm(KOSONG) }

  async function submit(e) {
    e.preventDefault()
    setSimpan(true)
    try {
      if (edit) {
        const updated = await updateProduk(edit._id, form)
        setList(l => l.map(p => p._id === edit._id ? updated : p))
        toast.success('Produk diperbarui!')
      } else {
        const baru = await tambahProduk(form)
        setList(l => [baru, ...l])
        toast.success('Produk ditambahkan!')
      }
      tutup()
    } catch { toast.error('Gagal menyimpan') }
    finally { setSimpan(false) }
  }

  async function hapus(id) {
    if (!confirm('Hapus produk ini?')) return
    await hapusProduk(id)
    setList(l => l.filter(p => p._id !== id))
    toast.success('Produk dihapus')
  }

  return (
    <div className="space-y-5 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Produk</h1>
          <p className="text-slate-500 text-sm">{list.length} produk terdaftar</p>
        </div>
        <button onClick={() => buka()} className="btn-primary btn-sm"><Plus size={16} /> Tambah Produk</button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="card shimmer h-40 rounded-2xl" />)}
        </div>
      ) : list.length === 0 ? (
        <div className="card text-center py-16">
          <Package size={44} className="mx-auto mb-3 text-slate-300" />
          <p className="font-semibold text-slate-600 mb-1">Belum ada produk</p>
          <p className="text-slate-400 text-sm mb-4">Tambahkan produk untuk mempermudah buat invoice</p>
          <button onClick={() => buka()} className="btn-primary mx-auto"><Plus size={16} /> Tambah Produk</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map(p => (
            <div key={p._id} className="card hover:shadow-md transition-shadow group">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                  <Package size={18} />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => buka(p)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"><Pencil size={14} /></button>
                  <button onClick={() => hapus(p._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                </div>
              </div>
              <h3 className="font-bold text-slate-900">{p.nama}</h3>
              {p.deskripsi && <p className="text-slate-500 text-sm mt-0.5 line-clamp-2">{p.deskripsi}</p>}
              <div className="mt-3 flex items-end justify-between">
                <div>
                  <p className="text-xl font-extrabold text-purple-700">{p.harga} <span className="text-sm font-normal text-slate-400">USDC</span></p>
                  {p.hargaIDR && <p className="text-xs text-slate-400">≈ {rupiah(p.hargaIDR)}</p>}
                </div>
                <div className="text-right">
                  <span className="badge badge-purple">{p.kategori}</span>
                  {p.stok !== null && p.stok !== undefined && (
                    <p className="text-xs text-slate-400 mt-1">Stok: {p.stok} {p.satuan}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h2 className="font-bold text-lg text-slate-900">{edit ? 'Edit Produk' : 'Tambah Produk'}</h2>
              <button onClick={tutup} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"><X size={18} /></button>
            </div>
            <form onSubmit={submit} className="p-5 space-y-4">
              <div>
                <label className="label">Nama Produk *</label>
                <input className="input" placeholder="Bakso Aci Original" value={form.nama} onChange={e => setForm({...form, nama: e.target.value})} required />
              </div>
              <div>
                <label className="label">Deskripsi</label>
                <textarea className="input resize-none" rows={2} value={form.deskripsi} onChange={e => setForm({...form, deskripsi: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Harga (USDC) *</label>
                  <input type="number" step="0.01" className="input" value={form.harga} onChange={e => setForm({...form, harga: e.target.value})} required />
                </div>
                <div>
                  <label className="label">Harga (IDR)</label>
                  <input type="number" className="input" value={form.hargaIDR} onChange={e => setForm({...form, hargaIDR: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Kategori</label>
                  <input className="input" value={form.kategori} onChange={e => setForm({...form, kategori: e.target.value})} />
                </div>
                <div>
                  <label className="label">Satuan</label>
                  <input className="input" value={form.satuan} onChange={e => setForm({...form, satuan: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="label">Stok (opsional)</label>
                <input type="number" className="input" placeholder="Kosongkan jika tidak terbatas" value={form.stok} onChange={e => setForm({...form, stok: e.target.value})} />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={tutup} className="btn-secondary flex-1">Batal</button>
                <button type="submit" className="btn-primary flex-1" disabled={simpan}>
                  {simpan ? <Loader size={16} className="animate-spin" /> : edit ? 'Simpan' : 'Tambah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}