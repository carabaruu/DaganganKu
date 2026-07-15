// src/pages/Invoice.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Plus, Send, Trash2, ExternalLink, RefreshCw } from 'lucide-react'
import { getInvoice, kirimInvoice, hapusInvoice } from '../mock/api'
import { tanggal, statusLabel, statusBadge } from '../utils/format'
import toast from 'react-hot-toast'

export default function Invoice() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])
  async function load() { setList(await getInvoice()); setLoading(false) }

  async function kirim(id) {
    const res = await kirimInvoice(id)
    navigator.clipboard.writeText(res.linkBayar)
    toast.success('Invoice dikirim! Link bayar disalin ke clipboard.')
    load()
  }

  async function hapus(id) {
    if (!confirm('Hapus invoice ini?')) return
    await hapusInvoice(id)
    setList(l => l.filter(i => i._id !== id))
    toast.success('Invoice dihapus')
  }

  return (
    <div className="space-y-5 fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Invoice</h1>
          <p className="text-slate-500 text-sm">{list.length} invoice</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="btn-secondary btn-sm"><RefreshCw size={15} /></button>
          <Link to="/dashboard/invoice/buat" className="btn-primary btn-sm"><Plus size={15} /> Buat Invoice</Link>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="card shimmer h-24" />)}</div>
      ) : list.length === 0 ? (
        <div className="card text-center py-16">
          <FileText size={44} className="mx-auto mb-3 text-slate-300" />
          <p className="font-semibold text-slate-600 mb-4">Belum ada invoice</p>
          <Link to="/dashboard/invoice/buat" className="btn-primary mx-auto"><Plus size={15} /> Buat Invoice Pertama</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map(inv => (
            <div key={inv._id} className="card flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
                <FileText size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold text-slate-900">{inv.nomorInvoice}</p>
                  <span className={statusBadge(inv.status)}>{statusLabel(inv.status)}</span>
                </div>
                <p className="text-sm text-slate-600">{inv.namaPelanggan}</p>
                <p className="text-xs text-slate-400">{tanggal(inv.createdAt)} · {inv.items?.length} item</p>
              </div>
              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3">
                <p className="font-bold text-lg text-slate-900">{inv.total} <span className="text-sm text-slate-400 font-normal">{inv.aset}</span></p>
                <div className="flex gap-2">
                  {inv.status === 'draft' && (
                    <button onClick={() => kirim(inv._id)} title="Kirim Invoice"
                      className="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors">
                      <Send size={14} />
                    </button>
                  )}
                  {inv.paymentId && inv.status !== 'lunas' && (
                    <a href={`/bayar/${inv.paymentId}`} target="_blank" rel="noopener noreferrer"
                      title="Lihat Link Bayar"
                      className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors">
                      <ExternalLink size={14} />
                    </a>
                  )}
                  {['draft', 'batal'].includes(inv.status) && (
                    <button onClick={() => hapus(inv._id)} title="Hapus"
                      className="p-2 rounded-lg bg-red-100 text-red-500 hover:bg-red-200 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}