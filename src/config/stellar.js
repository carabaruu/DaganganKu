// src/config/stellar.js
// ============================================================
// KONFIGURASI STELLAR - ISI DI SINI
// ============================================================

const stellarConfig = {
  // Ganti dengan public key Stellar kamu
  // Contoh: 'GBVTJKSDM5YKCXKZQFYQTXHFBZUVUEJCMVKBRGR7G5DFHFYG4NRPKJ5'
  PLATFORM_PUBLIC_KEY: 'GCUEONV3IBASFHDQIFNEPUQUT6WT5YCG7MQUIHLWI4KXTQSSTOLJ2L7E',

  // Network: 'testnet' untuk demo, 'mainnet' untuk produksi
  NETWORK: 'testnet',

  // URL Horizon
  HORIZON_URL: 'https://horizon-testnet.stellar.org',

  // USDC issuer di testnet
  USDC_ISSUER: 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',

  // Kurs estimasi (di produksi pakai price oracle)
  KURS: {
    USDC: 16000,  // 1 USDC ≈ Rp 16.000
    XLM:   3200,  // 1 XLM  ≈ Rp 3.200
  },

  // Explorer URL
  explorerTx: (hash) =>
    `https://stellar.expert/explorer/testnet/tx/${hash}`,
  explorerAccount: (address) =>
    `https://stellar.expert/explorer/testnet/account/${address}`,
}

export default stellarConfig