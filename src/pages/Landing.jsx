import { Link } from 'react-router-dom'
import { ShoppingBag, QrCode, Sparkles, BarChart3, ArrowRight, CheckCircle, Zap, Star, FileText, Package } from 'lucide-react'

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <ShoppingBag size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900">DaganganKu</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-slate-600 hover:text-slate-900 text-sm font-medium px-3 py-2">
              Masuk
            </Link>
            <Link to="/daftar" className="btn-primary btn-sm">
              Coba Gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 py-24 px-5">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-7 text-purple-200 text-sm">
            <Zap size={14} className="text-purple-300" />
            Payment Stellar + AI Konten untuk UMKM Indonesia
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-5">
            Jualan Makin
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300"> Mudah</span>
          </h1>
          <p className="text-purple-100 text-lg md:text-xl mb-10 max-w-xl mx-auto leading-relaxed">
            Terima pembayaran digital via Stellar dan buat konten marketing dengan AI —
            semua dalam satu platform untuk UMKM Indonesia.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/daftar"
              className="inline-flex items-center justify-center gap-2 bg-white text-purple-700 font-bold py-4 px-8 rounded-xl hover:bg-purple-50 transition-colors text-lg shadow-xl">
              Mulai Gratis <ArrowRight size={20} />
            </Link>
            <Link to="/login"
              className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/25 text-white font-semibold py-4 px-8 rounded-xl hover:bg-white/20 transition-colors text-lg">
              Masuk ke Akun
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-slate-900 py-12 px-5">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { nilai: '$0.00001', label: 'Biaya Transaksi' },
            { nilai: '5 detik',  label: 'Konfirmasi Bayar' },
            { nilai: 'AI',       label: 'Generate Konten' },
            { nilai: '0.5%',     label: 'Fee Platform' },
          ].map(s => (
            <div key={s.label}>
              <div className="text-3xl font-extrabold text-purple-400">{s.nilai}</div>
              <div className="text-slate-400 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Fitur */}
      <section className="py-20 px-5 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Dua fitur utama untuk UMKM</h2>
            <p className="text-slate-500 max-w-lg mx-auto">
              Bukan cuma bayar-bayaran, tapi juga bantu kamu bikin konten yang menarik perhatian calon pembeli.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Fitur 1 - Payment */}
            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-7 text-white">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-5">
                <QrCode size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Terima Bayar via Stellar</h3>
              <p className="text-purple-100 leading-relaxed mb-5">
                Generate QR Code dalam detik. Pembeli scan dan bayar pakai USDC atau XLM.
                Konfirmasi 5 detik, uang langsung masuk ke wallet kamu.
              </p>
              <ul className="space-y-2">
                {['QR Code instan', 'USDC & XLM support', 'Riwayat on-chain transparan', 'Fee hanya $0.00001'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-purple-100">
                    <CheckCircle size={14} className="text-purple-300 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Fitur 2 - AI Konten */}
            <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-7 text-white">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-5">
                <Sparkles size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">AI Generate Konten</h3>
              <p className="text-pink-100 leading-relaxed mb-5">
                Bingung bikin caption IG atau copywriting WA? Ceritakan produkmu ke AI,
                dan dalam detik konten siap pakai langsung tersedia.
              </p>
              <ul className="space-y-2">
                {['Caption Instagram', 'Status WhatsApp', 'Pengumuman PO', 'Konten promosi'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-pink-100">
                    <CheckCircle size={14} className="text-pink-200 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Fitur pendukung */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { ikon: BarChart3, judul: 'Laporan Otomatis', isi: 'Dashboard lengkap — pemasukan hari ini, grafik 7 hari, dan total sepanjang waktu.', warna: 'bg-blue-100 text-blue-700' },
              { ikon: FileText,  judul: 'Invoice Digital',  isi: 'Buat invoice profesional dengan link pembayaran Stellar yang bisa dikirim ke pelanggan.', warna: 'bg-green-100 text-green-700' },
              { ikon: Package,   judul: 'Katalog Produk',   isi: 'Simpan daftar produk untuk mempermudah pembuatan invoice dan QR pembayaran.', warna: 'bg-amber-100 text-amber-700' },
            ].map(f => (
              <div key={f.judul} className="card hover:shadow-md transition-shadow">
                <div className={`w-10 h-10 rounded-xl ${f.warna} flex items-center justify-center mb-3`}>
                  <f.ikon size={20} />
                </div>
                <h3 className="font-bold text-slate-900 mb-1">{f.judul}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.isi}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cara kerja */}
      <section className="py-20 px-5 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-12">Cara kerjanya simpel</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { no: '1', judul: 'Daftar & Buat Wallet', isi: 'Daftar gratis, wallet Stellar otomatis dibuat dalam hitungan detik.' },
              { no: '2', judul: 'Terima Bayar / Buat Konten', isi: 'Generate QR untuk terima bayar, atau minta AI buatkan konten marketing.' },
              { no: '3', judul: 'Pantau & Berkembang', isi: 'Semua tercatat otomatis. Lihat performa usaha di dashboard.' },
            ].map(l => (
              <div key={l.no}>
                <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white font-bold text-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  {l.no}
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{l.judul}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{l.isi}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimoni */}
      <section className="py-16 px-5 bg-purple-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">Dibuat untuk UMKM seperti kamu</h2>
          <div className="card border-purple-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-200 text-purple-700 font-bold text-lg flex items-center justify-center flex-shrink-0">B</div>
              <div>
                <div className="flex items-center gap-1 mb-2">
                  {[1,2,3,4,5].map(s => <Star key={s} size={14} className="text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-slate-700 leading-relaxed text-sm">
                  "Sistem PO kami 70% online. Yang paling makan waktu itu bikin konten — tiap hari harus posting tapi sering bingung mau nulis apa. Adanya AI konten di DaganganKu ini bantu banget, langsung ada banyak pilihan dan tinggal edit dikit."
                </p>
                <p className="text-slate-500 text-xs mt-2 font-medium">— Pemilik Bakso Aci Skyni, Bandung</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-purple-900 to-indigo-900 py-20 px-5 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Siap digitalisasi usahamu?</h2>
        <p className="text-purple-200 mb-8 text-lg">Gratis. Tidak perlu rekening bank. Setup 2 menit.</p>
        <Link to="/daftar"
          className="inline-flex items-center gap-2 bg-white text-purple-700 font-bold py-4 px-9 rounded-xl hover:bg-purple-50 transition-colors text-lg shadow-xl">
          Mulai Sekarang <ArrowRight size={20} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-10 px-5 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <ShoppingBag size={16} className="text-purple-400" />
          <span className="text-white font-bold">DaganganKu</span>
        </div>
        <p className="text-slate-500 text-sm">APAC Stellar Hackathon 2026 · Track: Payment & Consumer Applications</p>
        <div className="flex items-center justify-center gap-1.5 mt-2">
          <CheckCircle size={12} className="text-purple-400" />
          <span className="text-purple-400 text-xs">Powered by Stellar Blockchain + Claude AI</span>
        </div>
      </footer>
    </div>
  )
}