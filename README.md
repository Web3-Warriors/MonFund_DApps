# MonFund - Web3 Crowdfunding Platform

MonFund adalah platform crowdfunding berbasis blockchain yang dirancang khusus untuk mendukung program-program kampus dan inisiatif mahasiswa. Platform ini menggunakan teknologi Web3 untuk memastikan transparansi, keamanan, dan desentralisasi dalam proses penggalangan dana.

## 🚀 Fitur Utama

- **Crowdfunding Terdesentralisasi**: Menggunakan smart contract Ethereum untuk transparansi penuh
- **Manajemen Program**: Admin dapat membuat dan mengelola program crowdfunding
- **Kontribusi Aman**: Sistem kontribusi yang aman menggunakan ETH
- **Penarikan Terkontrol**: Dana hanya dapat ditarik setelah program berakhir
- **Riwayat Transparan**: Semua transaksi tercatat di blockchain
- **UI Modern**: Interface yang responsif dan user-friendly

## 🛠 Teknologi yang Digunakan

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Web3**: Wagmi + RainbowKit + Viem
- **Blockchain**: Ethereum/Foundry (Anvil untuk development)
- **State Management**: TanStack Query
- **Routing**: React Router DOM

## 📋 Prerequisites

Sebelum menjalankan project, pastikan Anda memiliki:

- Node.js (versi 18 atau lebih baru)
- npm atau bun
- MetaMask atau wallet Web3 lainnya
- Foundry (untuk menjalankan local blockchain)

## 🏗 Setup Development

### 1. Clone Repository

```bash
git clone https://github.com/Web3-Warriors/MonFund_DApps.git
cd MonFund
```

### 2. Install Dependencies

```bash
npm install
# atau jika menggunakan bun
bun install
```

### 3. Setup Local Blockchain

```bash
# Install Foundry jika belum ada
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Jalankan Anvil (local blockchain)
anvil
```

### 4. Deploy Smart Contract

Smart contract untuk project ini tersedia di: https://github.com/Web3-Warriors/SmartContract

```bash
# Clone smart contract repository terlebih dahulu
git clone https://github.com/Web3-Warriors/SmartContract.git

# Deploy contract ke local blockchain
# (Sesuaikan dengan setup smart contract dari repository)
forge create --rpc-url http://127.0.0.1:8545 --private-key <PRIVATE_KEY> src/CrowdFundingContract.sol:CrowdFundingContract
```

### 5. Update Contract Address

Update alamat contract di `src/config/contract.ts`:

```typescript
export const CROWDFUNDING_CONTRACT_ADDRESS = "0x..."; // Alamat contract yang baru di-deploy
```

### 6. Jalankan Development Server

```bash
npm run dev
# atau
bun dev
```

Server akan berjalan di `http://localhost:8080` (atau port lain jika sudah digunakan).

## 🔧 Konfigurasi

### Environment Variables

Buat file `.env` di root project (opsional):

```env
VITE_CHAIN_ID=31337
VITE_RPC_URL=http://127.0.0.1:8545
```

### Contract Configuration

File `src/config/contract.ts` berisi:

- Alamat smart contract
- ABI (Application Binary Interface)
- Type definitions untuk Program dan status

## 👤 User Roles

### Admin

- Dapat membuat program crowdfunding baru
- Mengelola program yang sudah ada (edit, hapus, update status)
- Mengawasi seluruh aktivitas platform

### PIC (Person In Charge)

- Bertanggung jawab atas program tertentu
- Dapat menarik dana setelah program berakhir
- Mengelola dan memantau progress program yang ditugaskan

### Regular Users

- Melihat semua program yang tersedia
- Berkontribusi pada program aktif
- Melihat riwayat kontribusi mereka

## 🏗 Struktur Project

```
├── public/                    # Static assets
│   ├── favicon.ico
│   ├── logo-long.png
│   ├── placeholder.svg
│   └── robots.txt
├── src/
│   ├── assets/               # Image assets
│   │   ├── contrib-img.webp
│   │   ├── hero-img.webp
│   │   └── program-img.webp
│   ├── components/           # Reusable UI components
│   │   ├── animations/       # Animation components
│   │   │   ├── AnimatedCard.tsx
│   │   │   ├── AnimatedSection.tsx
│   │   │   ├── HoverAnimation.tsx
│   │   │   ├── index.ts
│   │   │   └── PageTransition.tsx
│   │   ├── ui/              # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── FeatureCard.tsx
│   │   │   ├── NavigationButton.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   └── ... (other UI components)
│   │   ├── Footer.tsx       # Footer component
│   │   ├── Header.tsx       # Navigation header
│   │   └── ProgramCard.tsx  # Program display card
│   ├── config/              # Configuration files
│   │   └── contract.ts      # Smart contract config
│   ├── hooks/               # Custom React hooks
│   │   ├── use-mobile.tsx   # Mobile detection hook
│   │   ├── use-toast.ts     # Toast notifications
│   │   └── useIsOwner.ts    # Check if user is contract owner
│   ├── lib/                 # Utility functions
│   │   └── utils.ts         # General utilities
│   ├── pages/               # Application pages
│   │   ├── CreateProgram.tsx    # Create new program
│   │   ├── Index.tsx           # Landing page
│   │   ├── MyContributions.tsx # User contributions
│   │   ├── NotFound.tsx        # 404 page
│   │   ├── ProgramDetail.tsx   # Program details
│   │   └── Programs.tsx        # Program listing
│   ├── providers/           # Context providers
│   │   └── Web3Provider.tsx # Web3 configuration
│   ├── App.css             # App-specific styles
│   ├── App.tsx             # Main App component
│   ├── index.css           # Global styles
│   ├── main.tsx            # App entry point
│   └── vite-env.d.ts       # Vite environment types
├── components.json          # shadcn/ui configuration
├── eslint.config.js        # ESLint configuration
├── index.html              # HTML template
├── package.json            # Project dependencies
├── postcss.config.js       # PostCSS configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── tsconfig.app.json       # App-specific TypeScript config
├── tsconfig.node.json      # Node-specific TypeScript config
└── vite.config.ts          # Vite configuration
```

## 🚀 Deployment

### Build untuk Production

```bash
npm run build
```

### Deploy ke Vercel/Netlify

```bash
# Build project
npm run build

# Deploy folder dist/ ke platform pilihan Anda
```

## 🧪 Testing

```bash
# Run tests (jika ada)
npm test

# Lint code
npm run lint
```

## 📝 Smart Contract Functions

### Read Functions

- `getListProgramId()`: Mendapatkan daftar ID program
- `getProgramById(id)`: Detail program berdasarkan ID
- `owner()`: Alamat owner contract
- `getHistoryWithdrawByProgram(id)`: Riwayat penarikan program

### Write Functions (Owner Only)

- `createProgram()`: Membuat program baru
- `withdraw()`: Menarik dana program

### Write Functions (Public)

- `contribute()`: Berkontribusi pada program

## 🔐 Keamanan

- Smart contract menggunakan OpenZeppelin Ownable
- Validasi input di frontend dan smart contract
- Penarikan dana hanya setelah program berakhir
- Semua transaksi tercatat di blockchain

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Buat Pull Request

## 📄 License

Project ini menggunakan MIT License.

## 📞 Support

Jika mengalami masalah atau memiliki pertanyaan:

1. Buka issue di GitHub repository
2. Hubungi tim development

---

**MonFund** - Membangun masa depan kampus melalui crowdfunding yang transparan dan aman. 🎓✨
