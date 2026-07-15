// src/utils/format.js

export function rupiah(n) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0
  }).format(n || 0)
}

export function tanggal(d) {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }).format(new Date(d))
}

export function tanggalPendek(d) {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric'
  }).format(new Date(d))
}

export function potongAlamat(addr, n = 6) {
  if (!addr) return ''
  return `${addr.slice(0, n)}...${addr.slice(-n)}`
}

export function statusLabel(s) {
  return {
    selesai: 'Berhasil', menunggu: 'Menunggu', gagal: 'Gagal',
    draft: 'Draft', dikirim: 'Dikirim', lunas: 'Lunas', batal: 'Dibatalkan'
  }[s] || s
}

export function statusBadge(s) {
  if (['selesai', 'lunas'].includes(s)) return 'badge-green'
  if (['menunggu', 'dikirim'].includes(s)) return 'badge-yellow'
  if (['gagal', 'batal'].includes(s)) return 'badge-red'
  return 'badge-gray'
}