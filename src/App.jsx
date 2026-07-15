import { Routes, Route, Navigate } from 'react-router-dom'
import { sudahLogin } from './utils/auth'

import Landing      from './pages/Landing'
import Login        from './pages/Login'
import Daftar       from './pages/Daftar'
import HalamanBayar from './pages/HalamanBayar'

import Layout       from './components/layout/Layout'
import Dashboard    from './pages/Dashboard'
import TerimaYaraman from './pages/TerimaYaraman'
import Transaksi    from './pages/Transaksi'
import Produk       from './pages/Produk'
import Invoice      from './pages/Invoice'
import BuatInvoice  from './pages/BuatInvoice'
import Wallet       from './pages/Wallet'
import AIKonten     from './pages/AIKonten'
import Pengaturan   from './pages/Pengaturan'

function PrivateRoute({ children }) {
  return sudahLogin() ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      {/* Halaman publik */}
      <Route path="/"             element={<Landing />} />
      <Route path="/login"        element={<Login />} />
      <Route path="/daftar"       element={<Daftar />} />
      <Route path="/bayar/:paymentId" element={<HalamanBayar />} />

      {/* Dashboard — harus login */}
      <Route path="/dashboard" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index                element={<Dashboard />} />
        <Route path="terima"        element={<TerimaYaraman />} />
        <Route path="transaksi"     element={<Transaksi />} />
        <Route path="produk"        element={<Produk />} />
        <Route path="invoice"       element={<Invoice />} />
        <Route path="invoice/buat"  element={<BuatInvoice />} />
        <Route path="wallet"        element={<Wallet />} />
        <Route path="ai-konten"     element={<AIKonten />} />
        <Route path="pengaturan"    element={<Pengaturan />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}