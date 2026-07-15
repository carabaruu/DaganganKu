// src/mock/api.js
// Semua fungsi ini meniru backend API dengan data dummy
// Nanti tinggal ganti dengan axios call ke server asli

import { USER, TRANSAKSI, PRODUK, INVOICE, STATISTIK, GRAFIK, SALDO, TEMPLATE_KONTEN } from './data'
import stellarConfig from '../config/stellar'

const tunda = (ms = 700) => new Promise(r => setTimeout(r, ms))

// State di memory — reset saat refresh (normal untuk demo)
let transaksiList = [...TRANSAKSI]
let produkList    = [...PRODUK]
let invoiceList   = [...INVOICE]
let kontenList    = [...TEMPLATE_KONTEN]

// ─── AUTH ────────────────────────────────────────────────────

export async function login(email, password) {
  await tunda()
  if (!email || !password) throw new Error('Email dan password wajib diisi')
  return {
    token: 'dk-demo-token-2024',
    user: { ...USER, stellarPublicKey: stellarConfig.PLATFORM_PUBLIC_KEY }
  }
}

export async function daftar(data) {
  await tunda(2000) // Simulasi buat wallet Stellar
  return {
    token: 'dk-demo-token-2024',
    user: {
      ...USER,
      nama: data.nama,
      namaUsaha: data.namaUsaha,
      email: data.email,
      stellarPublicKey: stellarConfig.PLATFORM_PUBLIC_KEY
    }
  }
}

export async function updateProfil(data) {
  await tunda()
  return { ...USER, ...data }
}

// ─── DASHBOARD ───────────────────────────────────────────────

export async function getDashboard() {
  await tunda()
  return {
    statistik: {
      ...STATISTIK,
      transaksiTerbaru: transaksiList.slice(0, 5),
      grafik: GRAFIK,
    },
    saldo: {
      usdc: SALDO.usdc,
      xlm: SALDO.xlm,
      estimasiIDR: {
        usdc: parseFloat(SALDO.usdc) * stellarConfig.KURS.USDC,
        xlm:  parseFloat(SALDO.xlm)  * stellarConfig.KURS.XLM,
        total: parseFloat(SALDO.usdc) * stellarConfig.KURS.USDC + parseFloat(SALDO.xlm) * stellarConfig.KURS.XLM,
      }
    }
  }
}

// ─── PAYMENT / QR ────────────────────────────────────────────

export async function buatQR(data) {
  await tunda(600)
  const paymentId = 'pay-' + Date.now().toString(36)
  const tx = {
    _id: Date.now().toString(),
    namaPembeli: data.namaPembeli || '',
    catatan: data.catatan || '',
    jumlah: parseFloat(data.jumlah),
    aset: data.aset || 'USDC',
    status: 'menunggu',
    stellarHash: null,
    paymentId,
    createdAt: new Date().toISOString()
  }
  transaksiList.unshift(tx)
  return {
    paymentId,
    jumlah: parseFloat(data.jumlah),
    aset: data.aset || 'USDC',
    catatan: data.catatan || '',
    qrPayload: JSON.stringify({
      app: 'DAGANGANKU',
      paymentId,
      namaUsaha: USER.namaUsaha,
      alamatStellar: stellarConfig.PLATFORM_PUBLIC_KEY,
      jumlah: parseFloat(data.jumlah),
      aset: data.aset || 'USDC',
      memo: paymentId.slice(0, 28),
    })
  }
}

export async function cekBayar(paymentId) {
  await tunda(300)
  const tx = transaksiList.find(t => t.paymentId === paymentId)
  return { sudahBayar: tx?.status === 'selesai', status: tx?.status || 'menunggu' }
}

export async function simulasiBayar(paymentId) {
  await tunda(2500)
  const idx = transaksiList.findIndex(t => t.paymentId === paymentId)
  if (idx !== -1) {
    const hash = 'stellar' + Math.random().toString(36).slice(2, 52)
    transaksiList[idx] = { ...transaksiList[idx], status: 'selesai', stellarHash: hash, dibayarPada: new Date().toISOString() }
    return { berhasil: true, txHash: hash }
  }
  throw new Error('Transaksi tidak ditemukan')
}

// ─── TRANSAKSI ───────────────────────────────────────────────

export async function getTransaksi(params = {}) {
  await tunda()
  let list = [...transaksiList]
  if (params.status) list = list.filter(t => t.status === params.status)
  const hal = params.halaman || 1
  const per = 10
  return {
    transaksi: list.slice((hal - 1) * per, hal * per),
    total: list.length,
    totalHalaman: Math.ceil(list.length / per),
  }
}

// ─── WALLET ──────────────────────────────────────────────────

export async function getSaldo() {
  await tunda()
  const usdc = parseFloat(SALDO.usdc)
  const xlm  = parseFloat(SALDO.xlm)
  return {
    saldo: SALDO,
    estimasiIDR: {
      usdc: usdc * stellarConfig.KURS.USDC,
      xlm:  xlm  * stellarConfig.KURS.XLM,
      total: usdc * stellarConfig.KURS.USDC + xlm * stellarConfig.KURS.XLM,
    },
    kurs: stellarConfig.KURS,
    publicKey: stellarConfig.PLATFORM_PUBLIC_KEY,
  }
}

// ─── PRODUK ──────────────────────────────────────────────────

export async function getProduk() {
  await tunda()
  return [...produkList]
}

export async function tambahProduk(data) {
  await tunda()
  const baru = { _id: Date.now().toString(), ...data, harga: parseFloat(data.harga) }
  produkList.unshift(baru)
  return baru
}

export async function updateProduk(id, data) {
  await tunda()
  const idx = produkList.findIndex(p => p._id === id)
  if (idx !== -1) produkList[idx] = { ...produkList[idx], ...data, harga: parseFloat(data.harga) }
  return produkList[idx]
}

export async function hapusProduk(id) {
  await tunda()
  produkList = produkList.filter(p => p._id !== id)
}

// ─── INVOICE ─────────────────────────────────────────────────

export async function getInvoice() {
  await tunda()
  return [...invoiceList]
}

export async function buatInvoice(data) {
  await tunda()
  const subtotal = data.items.reduce((s, i) => s + i.qty * i.harga, 0)
  const total = Math.max(0, subtotal - (parseFloat(data.diskon) || 0))
  const bulan = new Date().toISOString().slice(0, 7).replace('-', '')
  const baru = {
    _id: Date.now().toString(),
    nomorInvoice: `INV-${bulan}-${String(invoiceList.length + 1).padStart(4, '0')}`,
    ...data,
    subtotal, total,
    items: data.items.map(i => ({ ...i, subtotal: i.qty * i.harga })),
    status: 'draft',
    paymentId: null,
    createdAt: new Date().toISOString(),
  }
  invoiceList.unshift(baru)
  return baru
}

export async function kirimInvoice(id) {
  await tunda()
  const idx = invoiceList.findIndex(i => i._id === id)
  const paymentId = 'pay-inv-' + Date.now().toString(36)
  if (idx !== -1) invoiceList[idx] = { ...invoiceList[idx], status: 'dikirim', paymentId }
  return { linkBayar: `${window.location.origin}/bayar/${paymentId}`, paymentId }
}

export async function hapusInvoice(id) {
  await tunda()
  invoiceList = invoiceList.filter(i => i._id !== id)
}

// ─── AI KONTEN ───────────────────────────────────────────────

// Fungsi ini memanggil Claude API sungguhan via Anthropic
// Kamu perlu menambahkan VITE_ANTHROPIC_API_KEY di .env
export async function generateKonten(prompt) {
  await tunda(500)

  // Cek apakah API key tersedia
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY

  if (!apiKey || apiKey === 'isi_api_key_claude_disini') {
    // Fallback: template dummy kalau belum ada API key
    await tunda(2000) // Simulasi proses AI
    const hasil = generateKontenDummy(prompt)
    const kontenBaru = {
      id: Date.now().toString(),
      judul: prompt.judul || 'Konten Baru',
      platform: prompt.platform || 'Instagram',
      tipe: prompt.tipe || 'Caption',
      isi: hasil,
      createdAt: new Date().toISOString(),
    }
    kontenList.unshift(kontenBaru)
    return kontenBaru
  }

  // Panggil Claude API sungguhan
  try {
    const systemPrompt = `Kamu adalah copywriter profesional untuk UMKM Indonesia.
Kamu membantu membuat konten marketing yang menarik, natural, dan tidak terlihat seperti dibuat AI.
Gunakan bahasa yang santai namun profesional, sesuai karakter brand UMKM lokal.
Jangan gunakan kata-kata yang terlalu formal atau klise seperti "Selamat datang di era digital".
Selalu sertakan call to action yang jelas.`

    const userPrompt = `Buat konten ${prompt.tipe} untuk platform ${prompt.platform}.
Nama usaha: ${prompt.namaUsaha}
Produk/Jasa: ${prompt.produk}
Tujuan konten: ${prompt.tujuan}
Tone: ${prompt.tone || 'santai dan friendly'}
${prompt.tambahan ? `Info tambahan: ${prompt.tambahan}` : ''}

Langsung tulis kontennya tanpa penjelasan tambahan.`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      })
    })

    const data = await response.json()
    const isi = data.content?.[0]?.text || 'Gagal generate konten'

    const kontenBaru = {
      id: Date.now().toString(),
      judul: prompt.judul || `${prompt.tipe} ${prompt.platform}`,
      platform: prompt.platform,
      tipe: prompt.tipe,
      isi,
      createdAt: new Date().toISOString(),
    }
    kontenList.unshift(kontenBaru)
    return kontenBaru

  } catch (err) {
    throw new Error('Gagal generate konten: ' + err.message)
  }
}

export async function getKonten() {
  await tunda()
  return [...kontenList]
}

export async function hapusKonten(id) {
  await tunda()
  kontenList = kontenList.filter(k => k.id !== id)
}

// ─── HELPER: Konten dummy kalau belum ada API key ─────────────

function generateKontenDummy(prompt) {
  const templates = {
    'Caption Promosi': `🔥 PROMO SPESIAL ${(prompt.namaUsaha || 'TOKO KAMI').toUpperCase()} 🔥

Halo guys! Ada kabar gembira nih buat kalian yang udah lama waiting list 🎉

${prompt.produk ? `✨ ${prompt.produk}` : '✨ Produk unggulan kami'}
hadir dengan penawaran yang sayang banget kalau dilewatin!

${prompt.tujuan || 'Dapatkan penawaran terbaik hanya hari ini!'}

Cara order:
📲 DM Instagram kami
💬 Chat WA di link bio
🛒 Marketplace link di bio

Stok terbatas, jangan sampai nyesel ya! 
Comment "MINAT" atau langsung DM sekarang 👇

#UMKM #JualanOnline #ProdukLokal #MadeInIndonesia`,

    'Story / Status': `✨ UPDATE TERBARU ✨

${prompt.produk || 'Produk baru kami'} udah tersedia!
${prompt.tujuan || 'Yuk order sekarang sebelum kehabisan'}

DM untuk info lebih lanjut 💬`,

    'Caption Produk': `Introducing... ${prompt.produk || 'produk terbaru kami'} 🌟

${prompt.tujuan || 'Dibuat dengan bahan pilihan dan cinta untuk kalian semua'}

Detail produk:
📦 ${prompt.produk || 'Produk premium'}
✅ Kualitas terjamin
🚚 Siap kirim ke seluruh Indonesia

Tertarik? DM sekarang atau cek link di bio!
.
.
#ProdukLokal #UMKM #BuatanIndonesia`,

    'Pengumuman PO': `📢 OPEN PRE-ORDER ${(prompt.namaUsaha || '').toUpperCase()} 📢

Halo Guys! PO batch baru udah dibuka nih! 🎊

${prompt.produk ? `Produk: ${prompt.produk}` : ''}
${prompt.tujuan || ''}

⚠️ CARA ORDER:
1️⃣ DM atau WA kami
2️⃣ Sebutkan produk & jumlah
3️⃣ Lakukan pembayaran
4️⃣ Tunggu konfirmasi

📅 PO ditutup saat kuota terpenuhi
Jangan sampai kehabisan ya!

Tag temen kamu yang harus tau ini 👇`,
  }

  return templates[prompt.tipe] || templates['Caption Promosi']
}