import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { ambilUser, hapusLogin } from '../../utils/auth'
import {
  LayoutDashboard, QrCode, Receipt, Package,
  FileText, Wallet, Sparkles, Settings,
  LogOut, Menu, X, ShoppingBag
} from 'lucide-react'

const MENU = [
  { ke: '/dashboard',            label: 'Dashboard',     ikon: LayoutDashboard, exact: true },
  { ke: '/dashboard/terima',     label: 'Terima Bayar',  ikon: QrCode },
  { ke: '/dashboard/transaksi',  label: 'Transaksi',     ikon: Receipt },
  { ke: '/dashboard/invoice',    label: 'Invoice',       ikon: FileText },
  { ke: '/dashboard/produk',     label: 'Produk',        ikon: Package },
  { ke: '/dashboard/wallet',     label: 'Wallet',        ikon: Wallet },
  { ke: '/dashboard/ai-konten',  label: 'AI Konten',     ikon: Sparkles },
  { ke: '/dashboard/pengaturan', label: 'Pengaturan',    ikon: Settings },
]

export default function Layout() {
  const user     = ambilUser()
  const navigate = useNavigate()
  const [buka, setBuka] = useState(false)

  function keluar() {
    hapusLogin()
    navigate('/login')
  }

  function SidebarIsi() {
    return (
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
              <ShoppingBag size={18} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-base leading-tight">DaganganKu</p>
              <p className="text-purple-300 text-xs">APAC Stellar Hackathon</p>
            </div>
          </div>
        </div>

        {/* Info usaha */}
        <div className="px-4 py-3 border-b border-white/10">
          <div className="bg-white/10 rounded-xl p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-purple-400 text-purple-900 font-bold text-sm flex items-center justify-center flex-shrink-0">
              {user?.namaUsaha?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm truncate">{user?.namaUsaha}</p>
              <p className="text-purple-300 text-xs">{user?.userId}</p>
            </div>
          </div>
        </div>

        {/* Navigasi */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {MENU.map(item => (
            <NavLink
              key={item.ke}
              to={item.ke}
              end={item.exact}
              onClick={() => setBuka(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors ${
                  isActive
                    ? 'bg-white text-purple-700 font-semibold shadow-sm'
                    : 'text-purple-100 hover:bg-white/10'
                }`
              }
            >
              <item.ikon size={17} />
              {item.label}
              {/* Badge khusus AI Konten */}
              {item.label === 'AI Konten' && (
                <span className="ml-auto text-[10px] bg-purple-400 text-purple-900 font-bold px-1.5 py-0.5 rounded-full">
                  AI
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Keluar */}
        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={keluar}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-300 hover:bg-red-500/20 transition-colors text-sm"
          >
            <LogOut size={17} />
            Keluar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex flex-col w-60 bg-gradient-to-b from-purple-900 to-purple-800 flex-shrink-0">
        <SidebarIsi />
      </aside>

      {/* Sidebar mobile */}
      {buka && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setBuka(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-gradient-to-b from-purple-900 to-purple-800">
            <button onClick={() => setBuka(false)} className="absolute top-4 right-4 text-white/60 hover:text-white">
              <X size={20} />
            </button>
            <SidebarIsi />
          </aside>
        </div>
      )}

      {/* Konten utama */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header mobile */}
        <header className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3 flex-shrink-0">
          <button onClick={() => setBuka(true)} className="p-2 rounded-lg hover:bg-slate-100">
            <Menu size={20} className="text-slate-600" />
          </button>
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-purple-600" />
            <span className="font-bold text-slate-900">DaganganKu</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}