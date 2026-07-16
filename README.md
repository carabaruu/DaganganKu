cat > /mnt/user-data/outputs/DaganganKu/README.md << 'ENDOFFILE'
# 🛒 DaganganKu

**Platform manajemen bisnis berbasis blockchain Stellar untuk pedagang kecil** — terima pembayaran crypto, kelola produk, buat invoice digital, dan generate konten promosi dengan AI. Dibangun khusus untuk UMKM Indonesia yang ingin go digital tanpa kerumitan teknis.

---

## ✨ Fitur

| Fitur | Deskripsi |
|---|---|
| 💰 **Terima Pembayaran** | Generate QR code pembayaran USDC/XLM via jaringan Stellar (SEP-0007) |
| 📦 **Manajemen Produk** | Tambah, edit, dan hapus produk dengan harga ganda (IDR + crypto) |
| 🧾 **Invoice Digital** | Buat dan kirim invoice profesional dengan status pembayaran real-time |
| 👛 **Stellar Wallet** | Pantau saldo USDC & XLM langsung dari Horizon API dengan estimasi IDR |
| 📊 **Dashboard Analitik** | Grafik pendapatan, statistik transaksi, dan ringkasan bisnis |
| ✨ **AI Konten Generator** | Generate caption promosi untuk Instagram, TikTok, WhatsApp, dan lainnya |
| 🔗 **Verifikasi Blockchain** | Setiap transaksi bisa diverifikasi langsung di Stellar Explorer |

---

## 🛠️ Tech Stack

- **Frontend:** React 18 + Vite 5
- **Styling:** Tailwind CSS v3
- **Routing:** React Router DOM v6
- **Charts:** Recharts
- **QR Code:** qrcode.react
- **Icons:** Lucide React
- **Notifications:** react-hot-toast
- **Blockchain:** Stellar Network (Testnet/Mainnet) via Horizon API
- **AI:** Kimi K2 (via Dahl inference) — untuk AI Konten Generator
- **Deployment:** Netlify (sudah dikonfigurasi)

---

## 🚀 Cara Memulai

### Prasyarat

- Node.js v18+
- npm atau yarn
- Akun Stellar — buat di [Freighter Wallet](https://www.freighter.app)
- Untuk testnet: fund akun via [Friendbot](https://friendbot.stellar.org)

### Instalasi

```bash
git clone https://github.com/username/daganganku.git
cd daganganku
npm install
```

### Konfigurasi

Buat file `.env` di root project:

```env
VITE_STELLAR_PUBLIC_KEY=GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_STELLAR_NETWORK=testnet
VITE_HORIZON_URL=https://horizon-testnet.stellar.org
VITE_USDC_ISSUER=GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5
VITE_DAHL_API_KEY=dahl_xxxxxxxxxxxxxxxxxxxxxxxx
VITE_KURS_USDC=16000
VITE_KURS_XLM=3200
```

> Untuk mainnet, ganti `VITE_STELLAR_NETWORK=mainnet`, `VITE_HORIZON_URL=https://horizon.stellar.org`, dan `VITE_USDC_ISSUER=GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN`

### Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:5173](http://localhost:5173) di browser.

### Build untuk Produksi

```bash
npm run build
```

---

## 📁 Struktur Project

```
daganganku/
├── src/
│   ├── pages/
│   │   ├── Landing.jsx          # Landing page publik
│   │   ├── Login.jsx            # Login pengguna
│   │   ├── Daftar.jsx           # Registrasi pengguna
│   │   ├── Dashboard.jsx        # Ringkasan bisnis & analitik
│   │   ├── TerimaYaraman.jsx    # Generator QR pembayaran Stellar
│   │   ├── Transaksi.jsx        # Riwayat transaksi
│   │   ├── Produk.jsx           # Manajemen produk
│   │   ├── Invoice.jsx          # Daftar invoice
│   │   ├── BuatInvoice.jsx      # Buat invoice baru
│   │   ├── Wallet.jsx           # Info & saldo wallet Stellar
│   │   ├── AIKonten.jsx         # Generator konten promosi AI
│   │   ├── HalamanBayar.jsx     # Halaman pembayaran publik (QR + polling)
│   │   └── Pengaturan.jsx       # Pengaturan akun & bisnis
│   ├── components/
│   │   └── layout/              # Layout utama & navigasi
│   ├── config/
│   │   └── stellar.js           # Konfigurasi jaringan Stellar (baca dari .env)
│   ├── mock/
│   │   └── api.js               # API layer: Horizon + localStorage + Kimi AI
│   ├── utils/
│   │   ├── auth.js              # Helper autentikasi (localStorage)
│   │   └── format.js            # Format mata uang, tanggal, dan status
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example                 # Template environment variables
├── netlify.toml
├── vite.config.js
└── package.json
```

---

## 🌐 Deploy ke Netlify

1. Push repo ke GitHub (pastikan `.env` tidak ikut — sudah ada di `.gitignore`)
2. Buka [netlify.com](https://netlify.com) → "Add new site" → pilih repo
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Tambahkan semua variabel dari `.env` di Netlify dashboard → Site configuration → Environment variables

---

## 💳 Cara Kerja Pembayaran

1. Penjual buat QR di menu **Terima Pembayaran** atau kirim **Invoice**
2. Pembeli scan QR dengan **Freighter** atau **LOBSTR** di HP
3. Wallet pembeli langsung terbuka dengan jumlah & tujuan terisi otomatis (format SEP-0007)
4. Pembeli konfirmasi → transaksi broadcast ke Stellar network
5. Halaman penjual otomatis update jadi **"Pembayaran Berhasil"** dalam 3-5 detik

---

## ⚠️ Catatan Penting

- **Tidak ada backend** — semua data (produk, invoice, konten) tersimpan di `localStorage`. Data akan hilang jika cache browser dihapus.
- **Saldo & transaksi** diambil langsung dari Stellar Horizon API (data blockchain nyata).
- **Jangan commit file `.env`** ke repository publik. Selalu gunakan environment variables.
- **Satu wallet untuk semua** — model ini cocok untuk satu toko/operator. Untuk multi-user, perlu backend tambahan.
- **API key Kimi AI** dipanggil dari frontend. Untuk produksi skala besar, route melalui backend/serverless function.

---

## 🗺️ Roadmap

- [ ] Backend nyata (Express/Hono + database)
- [ ] Notifikasi pembayaran real-time via Stellar event stream
- [ ] Export laporan ke PDF/Excel
- [ ] Multi-user / tim support
- [ ] Integrasi marketplace (Tokopedia, Shopee)
- [ ] Verifikasi KYC untuk deployment mainnet

---

## 📄 Lisensi

MIT License — bebas digunakan, dimodifikasi, dan didistribusikan.

---

<div align="center">
  Dibangun dengan ❤️ untuk UMKM Indonesia
</div>
