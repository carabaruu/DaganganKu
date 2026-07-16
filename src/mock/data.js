// src/mock/data.js
// Data dummy yang realistis berdasarkan usaha Bakso Aci Skyni

export const USER = {
  id: '1',
  nama: 'Agung Pratama',
  email: 'agung@daganganku.id',
  namaUsaha: 'Bakso Aci Skyni',
  jenisUsaha: 'Makanan & Minuman',
  kota: 'Bandung',
  provinsi: 'Jawa Barat',
  userId: 'DK-SKYNI',
  stellarPublicKey: '',  // diisi dari config/stellar.js
  totalTransaksi: 38,
  totalPendapatan: 285.50,
}

export const TRANSAKSI = [
  { _id: '1', namaPembeli: 'Rizky Fadillah', catatan: 'PO Bakso Aci Original 3 pack', jumlah: 12.00, aset: 'USDC', status: 'selesai', stellarHash: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2', createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString() },
  { _id: '2', namaPembeli: 'Siti Nurhaliza', catatan: 'PO Bakso Aci Spicy 2 pack + Ori 1 pack', jumlah: 9.00, aset: 'USDC', status: 'selesai', stellarHash: 'b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
  { _id: '3', namaPembeli: 'Budi Santoso', catatan: 'PO Bundling 5 pack hemat', jumlah: 18.50, aset: 'USDC', status: 'selesai', stellarHash: 'c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
  { _id: '4', namaPembeli: 'Dewi Rahayu', catatan: 'PO Bakso Aci Keju 4 pack', jumlah: 16.00, aset: 'USDC', status: 'selesai', stellarHash: 'd4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
  { _id: '5', namaPembeli: 'Hendra Wijaya', catatan: 'PO Hampers Lebaran 2 set', jumlah: 35.00, aset: 'USDC', status: 'selesai', stellarHash: 'e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
  { _id: '6', namaPembeli: 'Nurul Aini', catatan: 'PO Bakso Aci Original 1 pack', jumlah: 4.00, aset: 'USDC', status: 'menunggu', stellarHash: null, createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
  { _id: '7', namaPembeli: 'Eko Prasetyo', catatan: 'PO Mix Pack Spicy + Original', jumlah: 8.00, aset: 'XLM', status: 'selesai', stellarHash: 'f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString() },
]

export const PRODUK = [
  { _id: '1', nama: 'Bakso Aci Original', deskripsi: 'Bakso aci kenyal dengan bumbu original khas Skyni, isi 10 pcs per pack', harga: 4.00, hargaIDR: 64000, kategori: 'Makanan', satuan: 'pack', stok: 20 },
  { _id: '2', nama: 'Bakso Aci Spicy', deskripsi: 'Bakso aci dengan level pedas yang bisa disesuaikan, favorit pelanggan!', harga: 4.00, hargaIDR: 64000, kategori: 'Makanan', satuan: 'pack', stok: 15 },
  { _id: '3', nama: 'Bakso Aci Keju', deskripsi: 'Bakso aci dengan isian keju meleleh di dalam, unik dan gurih', harga: 4.50, hargaIDR: 72000, kategori: 'Makanan', satuan: 'pack', stok: 10 },
  { _id: '4', nama: 'Bundling 3 Pack', deskripsi: 'Hemat! Beli 3 pack bebas pilih rasa dengan harga spesial', harga: 11.00, hargaIDR: 176000, kategori: 'Bundling', satuan: 'bundling', stok: null },
  { _id: '5', nama: 'Bundling 5 Pack', deskripsi: 'Super hemat untuk stok atau kado, bebas pilih rasa', harga: 17.50, hargaIDR: 280000, kategori: 'Bundling', satuan: 'bundling', stok: null },
  { _id: '6', nama: 'Hampers Skyni', deskripsi: 'Paket hampers cantik isi 3 pack + kartu ucapan, cocok buat hadiah', harga: 18.00, hargaIDR: 288000, kategori: 'Hampers', satuan: 'set', stok: 5 },
]

export const INVOICE = [
  {
    _id: '1', nomorInvoice: 'INV-202407-0001',
    namaPelanggan: 'Toko Oleh-Oleh Merdeka',
    items: [
      { nama: 'Bakso Aci Original', qty: 10, satuan: 'pack', harga: 4.00, subtotal: 40.00 },
      { nama: 'Bakso Aci Spicy', qty: 5, satuan: 'pack', harga: 4.00, subtotal: 20.00 },
    ],
    subtotal: 60.00, diskon: 5.00, total: 55.00, aset: 'USDC',
    status: 'lunas', paymentId: 'pay-inv-001',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString()
  },
  {
    _id: '2', nomorInvoice: 'INV-202407-0002',
    namaPelanggan: 'Kantin Kampus Unpad',
    items: [
      { nama: 'Bundling 5 Pack', qty: 4, satuan: 'bundling', harga: 17.50, subtotal: 70.00 },
    ],
    subtotal: 70.00, diskon: 0, total: 70.00, aset: 'USDC',
    status: 'dikirim', paymentId: 'pay-inv-002',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
  },
  {
    _id: '3', nomorInvoice: 'INV-202407-0003',
    namaPelanggan: 'Rizky Fadillah',
    items: [
      { nama: 'Hampers Skyni', qty: 2, satuan: 'set', harga: 18.00, subtotal: 36.00 },
    ],
    subtotal: 36.00, diskon: 0, total: 36.00, aset: 'USDC',
    status: 'draft', paymentId: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
  },
]

export const STATISTIK = {
  hariIni: { total: 21.00, jumlah: 3 },
  bulanIni: { total: 285.50, jumlah: 38 },
  bulanLalu: { total: 241.00, jumlah: 31 },
}

export const GRAFIK = [
  { hari: '08', pendapatan: 32.00 },
  { hari: '09', pendapatan: 18.50 },
  { hari: '10', pendapatan: 45.00 },
  { hari: '11', pendapatan: 27.00 },
  { hari: '12', pendapatan: 55.50 },
  { hari: '13', pendapatan: 38.00 },
  { hari: '14', pendapatan: 21.00 },
]

export const SALDO = {
  usdc: '285.50',
  xlm: '4250.00',
}

// Template konten yang sudah jadi (hasil AI)
export const TEMPLATE_KONTEN = [
  {
    id: '1',
    judul: 'Flash Sale Weekend',
    platform: 'Instagram',
    tipe: 'Caption Promosi',
    isi: `✨ FLASH SALE WEEKEND BAKSO ACI SKYNI ✨

Halo Skyniers! Weekend ini ada promo spesial buat kalian yang udah lama nunggu! 🎉

🔥 Bundling 3 Pack cuma Rp 176.000
🔥 FREE ongkir untuk order di atas Rp 200.000
⏰ Berlaku Sabtu-Minggu aja ya!

Bakso aci kenyal favorit kalian dengan tiga pilihan rasa:
✅ Original — klasik, ga pernah gagal
✅ Spicy — buat yang suka tantangan
✅ Keju — gurih dan bikin ketagihan!

Cara order:
DM langsung atau chat WA di bio 📲
Jangan sampai kehabisan ya, stok terbatas! 

#BaksoAciSkyni #BaksoAci #KulinerBandung #HomemadeFood #FoodBandung #JualanOnline`,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
  },
  {
    id: '2',
    judul: 'Testimoni Pelanggan',
    platform: 'WhatsApp',
    tipe: 'Story / Status',
    isi: `⭐⭐⭐⭐⭐ REVIEW PELANGGAN SETIA SKYNI

"Udah langganan Bakso Aci Skyni dari pertama buka, dan sampe sekarang ga pernah kecewa. Kenyal, bumbunya ngangenin, dan packagingnya selalu rapi!"
— Kak Siti, pelanggan dari Bandung

Makasih udah percaya sama Skyni dari awal! 🙏
Kalian juga mau cobain? DM sekarang ya, masih buka PO untuk minggu ini!

👇 Cara Order
Chat WA: [nomor WA]
IG: @baksoaci.skyni`,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
  }
]
