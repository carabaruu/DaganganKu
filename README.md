# 🛒 DaganganKu

**A Stellar blockchain-powered business management platform for small merchants** — accept crypto payments, manage products, generate invoices, and create promotional content with AI. Built specifically for Indonesian micro, small, and medium enterprises (MSMEs) looking to go digital without the complexity.

> Demo data is based on a fictional business called "Bakso Aci Skyni" (a meatball snack brand from Bandung, Indonesia) as a realistic usage example.

---

## ✨ Features

| Feature | Description |
|---|---|
| 💰 **Receive Payments** | Generate QR code payments via USDC/XLM on the Stellar network |
| 📦 **Product Management** | Add, edit, and delete products with dual pricing (IDR + crypto) |
| 🧾 **Digital Invoices** | Create and send professional invoices with real-time payment status |
| 👛 **Stellar Wallet** | Monitor USDC & XLM balances with estimated IDR conversion |
| 📊 **Analytics Dashboard** | Monthly revenue charts, transaction statistics, and business summary |
| ✨ **AI Content Generator** | Generate promotional captions for Instagram, TikTok, WhatsApp, and more |
| 🔗 **Blockchain Verification** | Every transaction is verifiable directly on the Stellar blockchain explorer |

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
- **AI:** Claude API (Anthropic) — powers the AI Content Generator
- **Deployment:** Netlify (pre-configured)

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- npm or yarn
- A Stellar account — create one at [Stellar Laboratory](https://laboratory.stellar.org)

### Installation

```bash
# Clone the repository
git clone https://github.com/username/daganganku.git
cd daganganku

# Install dependencies
npm install
```

### Configuration

**1. Stellar Wallet** — open `src/config/stellar.js` and fill in your public key:

```js
const stellarConfig = {
  PLATFORM_PUBLIC_KEY: 'GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  NETWORK: 'testnet', // change to 'mainnet' for production
  HORIZON_URL: 'https://horizon-testnet.stellar.org',
  // ...
}
```

**2. Claude API Key** (required for AI Content Generator) — create a `.env` file in the project root:

```env
VITE_ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxx
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

---

## 📁 Project Structure

```
daganganku/
├── src/
│   ├── pages/
│   │   ├── Landing.jsx          # Public landing page
│   │   ├── Login.jsx            # User login
│   │   ├── Daftar.jsx           # User registration
│   │   ├── Dashboard.jsx        # Business overview & analytics
│   │   ├── TerimaYaraman.jsx    # Stellar QR payment generator
│   │   ├── Transaksi.jsx        # Transaction history
│   │   ├── Produk.jsx           # Product CRUD management
│   │   ├── Invoice.jsx          # Invoice list
│   │   ├── BuatInvoice.jsx      # Create new invoice
│   │   ├── Wallet.jsx           # Stellar wallet info & balance
│   │   ├── AIKonten.jsx         # AI promotional content generator
│   │   ├── HalamanBayar.jsx     # Public payment confirmation page
│   │   └── Pengaturan.jsx       # Account & business settings
│   ├── components/
│   │   └── layout/              # Main layout & navigation
│   ├── config/
│   │   └── stellar.js           # Stellar network configuration
│   ├── mock/
│   │   ├── api.js               # Simulated API (replace with real backend)
│   │   └── data.js              # Dummy data for development
│   ├── utils/
│   │   ├── auth.js              # Authentication helpers (localStorage)
│   │   └── format.js            # Currency, date, and status formatters
│   ├── App.jsx                  # Root router
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles + Tailwind
├── netlify.toml                 # Netlify deployment config
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## 🌐 Deploy to Netlify

This project is ready to deploy on Netlify. The `netlify.toml` file already handles SPA redirect routing.

**Steps:**

1. Push the repo to GitHub
2. Go to [netlify.com](https://netlify.com) → "Add new site" → select your repo
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add the `VITE_ANTHROPIC_API_KEY` environment variable in the Netlify dashboard

---

## ⚠️ Important Notes

- **Mock data only** — there is no real backend. All data is stored in `localStorage` and will be cleared if the browser cache is wiped.
- **Stellar Testnet** is used by default. For production, switch `NETWORK` to `mainnet` and update `HORIZON_URL` accordingly.
- **Never commit your API key** to a public repository. Always use `.env` and make sure `.env` is listed in `.gitignore`.
- The "Simulate Payment" feature is for demo/development purposes only and does not create real blockchain transactions.
- The Claude API key is currently called from the frontend (`import.meta.env`), which exposes it in the browser. For production use, route API calls through a backend or serverless function instead.

---

## 🗺️ Roadmap

- [ ] Real backend integration (Express/Hono + database)
- [ ] Real-time payment notifications via Stellar event stream
- [ ] Export reports to PDF/Excel
- [ ] Multi-user / team support
- [ ] Marketplace integrations (Tokopedia, Shopee)
- [ ] KYC verification for mainnet deployment

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

```bash
# Fork → clone → create a new branch
git checkout -b feature/your-feature-name

# Commit your changes
git commit -m "feat: add some feature"

# Push and open a Pull Request
git push origin feature/your-feature-name
```

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

<div align="center">
  Built with ❤️ for Indonesian small businesses
</div>
