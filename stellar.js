// src/config/stellar.js
// ============================================================
// KONFIGURASI STELLAR — Semua nilai diambil dari .env
// Salin .env.example → .env lalu isi nilainya
// ============================================================

const network  = import.meta.env.VITE_STELLAR_NETWORK  || 'testnet'
const isMainnet = network === 'mainnet'

const stellarConfig = {
  // Public key pemilik toko — wajib diisi di .env
  PLATFORM_PUBLIC_KEY: import.meta.env.VITE_STELLAR_PUBLIC_KEY || '',

  // Network
  NETWORK: network,

  // Horizon endpoint
  HORIZON_URL: import.meta.env.VITE_HORIZON_URL ||
    (isMainnet
      ? 'https://horizon.stellar.org'
      : 'https://horizon-testnet.stellar.org'),

  // USDC issuer
  // Testnet  : GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5
  // Mainnet  : GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN
  USDC_ISSUER: import.meta.env.VITE_USDC_ISSUER || (
    isMainnet
      ? 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN'
      : 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5'
  ),

  // Kurs estimasi IDR — diisi dari .env atau fallback default
  // Di produksi, komponen Wallet akan fetch kurs real-time dari Stellar DEX
  KURS: {
    USDC: parseInt(import.meta.env.VITE_KURS_USDC || '16000'),
    XLM:  parseInt(import.meta.env.VITE_KURS_XLM  || '3200'),
  },

  // Explorer URL (otomatis sesuai network)
  explorerTx: (hash) =>
    isMainnet
      ? `https://stellar.expert/explorer/public/tx/${hash}`
      : `https://stellar.expert/explorer/testnet/tx/${hash}`,

  explorerAccount: (address) =>
    isMainnet
      ? `https://stellar.expert/explorer/public/account/${address}`
      : `https://stellar.expert/explorer/testnet/account/${address}`,
}

export default stellarConfig