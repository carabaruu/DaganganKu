// src/mock/api.js
// ============================================================
// Model: SATU wallet (punya operator/hackathon team)
// Public key dibaca dari .env → VITE_STELLAR_PUBLIC_KEY
// User UMKM cukup daftar nama + usaha, tidak perlu tahu crypto
// ============================================================

import stellarConfig from '../config/stellar'

// ─── HELPER ──────────────────────────────────────────────────

async function horizonGet(path) {
  const res = await fetch(`${stellarConfig.HORIZON_URL}${path}`)
  if (!res.ok) throw new Error(`Horizon error ${res.status}`)
  return res.json()
}

// ─── AUTH ────────────────────────────────────────────────────

export async function login(email, password) {
  if (!email || !password) throw new Error('Email dan password wajib diisi')
  const stored = localStorage.getItem('dk_accounts')
  const accounts = stored ? JSON.parse(stored) : {}
  const acc = accounts[email]
  if (!acc) throw new Error('Email tidak ditemukan')
  if (acc.password !== password) throw new Error('Password salah')
  return { token: 'dk-local-' + btoa(email), user: { ...acc.user } }
}

export async function daftar(data) {
  const stored = localStorage.getItem('dk_accounts')
  const accounts = stored ? JSON.parse(stored) : {}
  if (accounts[data.email]) throw new Error('Email sudah terdaftar')

  // Wallet = public key dari .env (satu wallet untuk semua transaksi)
  const user = {
    nama: data.nama,
    namaUsaha: data.namaUsaha,
    jenisUsaha: data.jenisUsaha || 'Umum',
    kota: data.kota || '',
    provinsi: data.provinsi || '',
    email: data.email,
    noHp: data.noHp || '',
    stellarPublicKey: stellarConfig.PLATFORM_PUBLIC_KEY,
    userId: 'DK-' + Date.now().toString(36).toUpperCase(),
  }
  accounts[data.email] = { password: data.password, user }
  localStorage.setItem('dk_accounts', JSON.stringify(accounts))
  return { token: 'dk-local-' + btoa(data.email), user }
}

export async function updateProfil(data) {
  const raw = localStorage.getItem('dk_user')
  if (!raw) throw new Error('Belum login')
  const user = JSON.parse(raw)
  const stored = localStorage.getItem('dk_accounts')
  const accounts = stored ? JSON.parse(stored) : {}
  const updated = { ...user, ...data }
  if (accounts[user.email]) {
    accounts[user.email].user = updated
    localStorage.setItem('dk_accounts', JSON.stringify(accounts))
  }
  return updated
}

// ─── WALLET & SALDO (Horizon real-time) ──────────────────────

export async function getSaldo() {
  const pubKey = stellarConfig.PLATFORM_PUBLIC_KEY
  if (!pubKey) throw new Error('VITE_STELLAR_PUBLIC_KEY belum diisi di file .env')

  const account = await horizonGet(`/accounts/${pubKey}`)
  const balances = account.balances || []

  let usdc = '0.0000000'
  let xlm  = '0.0000000'

  for (const b of balances) {
    if (b.asset_type === 'native') xlm = b.balance
    if (
      b.asset_type === 'credit_alphanum4' &&
      b.asset_code === 'USDC' &&
      b.asset_issuer === stellarConfig.USDC_ISSUER
    ) usdc = b.balance
  }

  return {
    saldo: { usdc, xlm },
    estimasiIDR: {
      usdc:  parseFloat(usdc) * stellarConfig.KURS.USDC,
      xlm:   parseFloat(xlm)  * stellarConfig.KURS.XLM,
      total: parseFloat(usdc) * stellarConfig.KURS.USDC + parseFloat(xlm) * stellarConfig.KURS.XLM,
    },
    kurs: stellarConfig.KURS,
    publicKey: pubKey,
  }
}

// ─── TRANSAKSI (Horizon payments) ────────────────────────────

export async function getTransaksi(params = {}) {
  const pubKey = stellarConfig.PLATFORM_PUBLIC_KEY
  if (!pubKey) return { transaksi: [], total: 0, totalHalaman: 0 }

  const data = await horizonGet(`/accounts/${pubKey}/payments?limit=50&order=desc`)
  const records = (data._embedded?.records || [])
    .filter(r => r.type === 'payment' && r.to === pubKey)
    .map(r => ({
      _id: r.id,
      namaPembeli: r.from ? r.from.slice(0, 8) + '...' + r.from.slice(-6) : 'Pembeli',
      catatan: r.memo || '',
      jumlah: parseFloat(r.amount),
      aset: r.asset_type === 'native' ? 'XLM' : (r.asset_code || 'USDC'),
      status: 'selesai',
      stellarHash: r.transaction_hash,
      createdAt: r.created_at,
    }))

  // Gabung transaksi pending (QR yang belum dibayar)
  const lokalRaw = localStorage.getItem('dk_transaksi_lokal')
  const lokal = lokalRaw ? JSON.parse(lokalRaw) : []
  const menunggu = lokal.filter(t => t.status === 'menunggu')
  const semua = [...menunggu, ...records]

  let filtered = semua
  if (params.status) filtered = semua.filter(t => t.status === params.status)

  const hal = params.halaman || 1
  const per = 10
  return {
    transaksi: filtered.slice((hal - 1) * per, hal * per),
    total: filtered.length,
    totalHalaman: Math.ceil(filtered.length / per),
  }
}

// ─── DASHBOARD ───────────────────────────────────────────────

export async function getDashboard() {
  const saldo = await getSaldo()
  const txData = await getTransaksi({ halaman: 1 })
  const semuaTx = txData.transaksi

  const sekarang = new Date()
  const awalBulanIni  = new Date(sekarang.getFullYear(), sekarang.getMonth(), 1)
  const awalBulanLalu = new Date(sekarang.getFullYear(), sekarang.getMonth() - 1, 1)
  const awalHariIni   = new Date(sekarang.getFullYear(), sekarang.getMonth(), sekarang.getDate())

  const selesai = (list) => list.filter(t => t.status === 'selesai')
  const sumUsdc = (list) => selesai(list).reduce((s, t) => s + (t.aset === 'USDC' ? t.jumlah : 0), 0)

  const hariIniTx  = semuaTx.filter(t => new Date(t.createdAt) >= awalHariIni)
  const bulanIniTx = semuaTx.filter(t => new Date(t.createdAt) >= awalBulanIni)
  const bulanLaluTx = semuaTx.filter(t => {
    const d = new Date(t.createdAt)
    return d >= awalBulanLalu && d < awalBulanIni
  })

  const grafik = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const label = String(d.getDate()).padStart(2, '0')
    const awal = new Date(d.getFullYear(), d.getMonth(), d.getDate())
    const akhir = new Date(awal.getTime() + 86400000)
    const total = semuaTx
      .filter(t => {
        const dt = new Date(t.createdAt)
        return dt >= awal && dt < akhir && t.status === 'selesai' && t.aset === 'USDC'
      })
      .reduce((s, t) => s + t.jumlah, 0)
    grafik.push({ hari: label, pendapatan: total })
  }

  return {
    statistik: {
      hariIni:   { total: sumUsdc(hariIniTx),   jumlah: selesai(hariIniTx).length },
      bulanIni:  { total: sumUsdc(bulanIniTx),   jumlah: selesai(bulanIniTx).length },
      bulanLalu: { total: sumUsdc(bulanLaluTx),  jumlah: selesai(bulanLaluTx).length },
      transaksiTerbaru: semuaTx.slice(0, 5),
      grafik,
    },
    saldo,
  }
}

// ─── PAYMENT / QR ────────────────────────────────────────────

export async function buatQR(data) {
  const pubKey = stellarConfig.PLATFORM_PUBLIC_KEY
  if (!pubKey) throw new Error('VITE_STELLAR_PUBLIC_KEY belum diisi di file .env')

  const paymentId = 'pay-' + Date.now().toString(36)
  const memo = paymentId.slice(0, 28)

  const tx = {
    _id: Date.now().toString(),
    namaPembeli: data.namaPembeli || '',
    catatan: data.catatan || '',
    jumlah: parseFloat(data.jumlah),
    aset: data.aset || 'USDC',
    status: 'menunggu',
    stellarHash: null,
    paymentId,
    createdAt: new Date().toISOString(),
  }

  const lokalRaw = localStorage.getItem('dk_transaksi_lokal')
  const lokal = lokalRaw ? JSON.parse(lokalRaw) : []
  lokal.unshift(tx)
  localStorage.setItem('dk_transaksi_lokal', JSON.stringify(lokal))

  // Format SEP-0007 — bisa discan Freighter / LOBSTR
  const assetParam = data.aset === 'XLM'
    ? ''
    : `&asset_code=USDC&asset_issuer=${stellarConfig.USDC_ISSUER}`
  const qrPayload = `web+stellar:pay?destination=${pubKey}&amount=${parseFloat(data.jumlah).toFixed(7)}&memo=${memo}&memo_type=text${assetParam}`

  return { paymentId, jumlah: parseFloat(data.jumlah), aset: data.aset || 'USDC', catatan: data.catatan || '', qrPayload }
}

export async function cekBayar(paymentId) {
  const lokalRaw = localStorage.getItem('dk_transaksi_lokal')
  const lokal = lokalRaw ? JSON.parse(lokalRaw) : []
  const tx = lokal.find(t => t.paymentId === paymentId)
  if (tx?.status === 'selesai') return { sudahBayar: true, status: 'selesai' }

  const pubKey = stellarConfig.PLATFORM_PUBLIC_KEY
  if (!pubKey) return { sudahBayar: false, status: 'menunggu' }

  try {
    const memo = paymentId.slice(0, 28)
    const data = await horizonGet(`/accounts/${pubKey}/payments?limit=10&order=desc`)
    const records = data._embedded?.records || []
    for (const r of records) {
      if (r.memo === memo || r.transaction_memo === memo) {
        const idx = lokal.findIndex(t => t.paymentId === paymentId)
        if (idx !== -1) {
          lokal[idx] = { ...lokal[idx], status: 'selesai', stellarHash: r.transaction_hash, dibayarPada: r.created_at }
          localStorage.setItem('dk_transaksi_lokal', JSON.stringify(lokal))
        }
        return { sudahBayar: true, status: 'selesai', txHash: r.transaction_hash }
      }
    }
  } catch { /* network error */ }

  return { sudahBayar: false, status: tx?.status || 'menunggu' }
}

// Simulasi hanya aktif di testnet (untuk demo hackathon)
export async function simulasiBayar(paymentId) {
  if (stellarConfig.NETWORK !== 'testnet') throw new Error('Simulasi hanya tersedia di testnet')
  const lokalRaw = localStorage.getItem('dk_transaksi_lokal')
  const lokal = lokalRaw ? JSON.parse(lokalRaw) : []
  const idx = lokal.findIndex(t => t.paymentId === paymentId)
  const fakeHash = Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0')).join('')
  if (idx !== -1) {
    lokal[idx] = { ...lokal[idx], status: 'selesai', stellarHash: fakeHash, dibayarPada: new Date().toISOString() }
    localStorage.setItem('dk_transaksi_lokal', JSON.stringify(lokal))
  }
  return { berhasil: true, txHash: fakeHash }
}

// ─── PRODUK ──────────────────────────────────────────────────

const getProdukList = () => JSON.parse(localStorage.getItem('dk_produk') || '[]')
const saveProdukList = (l) => localStorage.setItem('dk_produk', JSON.stringify(l))

export async function getProduk() { return getProdukList() }

export async function tambahProduk(data) {
  const list = getProdukList()
  const baru = { _id: Date.now().toString(), ...data, harga: parseFloat(data.harga), createdAt: new Date().toISOString() }
  list.unshift(baru); saveProdukList(list); return baru
}

export async function updateProduk(id, data) {
  const list = getProdukList()
  const idx = list.findIndex(p => p._id === id)
  if (idx === -1) throw new Error('Produk tidak ditemukan')
  list[idx] = { ...list[idx], ...data, harga: parseFloat(data.harga) }
  saveProdukList(list); return list[idx]
}

export async function hapusProduk(id) { saveProdukList(getProdukList().filter(p => p._id !== id)) }

// ─── INVOICE ─────────────────────────────────────────────────

const getInvoiceList = () => JSON.parse(localStorage.getItem('dk_invoice') || '[]')
const saveInvoiceList = (l) => localStorage.setItem('dk_invoice', JSON.stringify(l))

export async function getInvoice() { return getInvoiceList() }

export async function buatInvoice(data) {
  const list = getInvoiceList()
  const subtotal = data.items.reduce((s, i) => s + i.qty * i.harga, 0)
  const total = Math.max(0, subtotal - (parseFloat(data.diskon) || 0))
  const bulan = new Date().toISOString().slice(0, 7).replace('-', '')
  const baru = {
    _id: Date.now().toString(),
    nomorInvoice: `INV-${bulan}-${String(list.length + 1).padStart(4, '0')}`,
    ...data, subtotal, total,
    items: data.items.map(i => ({ ...i, subtotal: i.qty * i.harga })),
    status: 'draft', paymentId: null,
    createdAt: new Date().toISOString(),
  }
  list.unshift(baru); saveInvoiceList(list); return baru
}

export async function kirimInvoice(id) {
  const list = getInvoiceList()
  const idx = list.findIndex(i => i._id === id)
  if (idx === -1) throw new Error('Invoice tidak ditemukan')
  const paymentId = 'pay-inv-' + Date.now().toString(36)
  list[idx] = { ...list[idx], status: 'dikirim', paymentId }
  saveInvoiceList(list)
  return { linkBayar: `${window.location.origin}/bayar/${paymentId}`, paymentId }
}

export async function hapusInvoice(id) { saveInvoiceList(getInvoiceList().filter(i => i._id !== id)) }

// ─── AI KONTEN ───────────────────────────────────────────────

const getKontenList = () => JSON.parse(localStorage.getItem('dk_konten') || '[]')

export async function generateKonten(prompt) {
  const apiKey = import.meta.env.VITE_DAHL_API_KEY
  if (!apiKey || apiKey === 'ISI_DAHL_API_KEY_DISINI') {
    throw new Error('VITE_DAHL_API_KEY belum diisi di file .env')
  }

  const userPrompt = `Kamu adalah copywriter profesional untuk UMKM Indonesia. Buat konten marketing yang natural, menarik, dan tidak terlihat seperti dibuat AI. Bahasa santai tapi profesional. Selalu ada call to action yang jelas.

Buat konten ${prompt.tipe} untuk platform ${prompt.platform}.
Nama usaha: ${prompt.namaUsaha}
Produk/Jasa: ${prompt.produk}
Tujuan: ${prompt.tujuan}
Tone: ${prompt.tone || 'santai dan friendly'}
${prompt.tambahan ? `Info tambahan: ${prompt.tambahan}` : ''}

Langsung tulis kontennya tanpa penjelasan.`

  const response = await fetch('https://inference.dahl.global/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'moonshotai/Kimi-K2.6',
      messages: [{ role: 'user', content: userPrompt }],
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error?.message || `Dahl API error ${response.status}`)
  }

  const data = await response.json()
  const isi = data.choices?.[0]?.message?.content || 'Gagal generate konten'
  const kontenBaru = {
    id: Date.now().toString(),
    judul: prompt.judul || `${prompt.tipe} ${prompt.platform}`,
    platform: prompt.platform, tipe: prompt.tipe, isi,
    createdAt: new Date().toISOString(),
  }
  const list = getKontenList()
  list.unshift(kontenBaru)
  localStorage.setItem('dk_konten', JSON.stringify(list))
  return kontenBaru
}

export async function getKonten() { return getKontenList() }

export async function hapusKonten(id) {
  const list = getKontenList().filter(k => k.id !== id)
  localStorage.setItem('dk_konten', JSON.stringify(list))
}
