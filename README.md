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
git clone <YOUR_GIT_URL>
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

```bash
# Deploy contract ke local blockchain
# (Sesuaikan dengan setup smart contract Anda)
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

### Admin/Owner

- Dapat membuat program crowdfunding baru
- Mengelola program yang sudah ada
- Menarik dana setelah program berakhir

### Regular Users

- Melihat semua program yang tersedia
- Berkontribusi pada program aktif
- Melihat riwayat kontribusi mereka

## 🏗 Struktur Project

```
src/
├── components/         # Reusable UI components
│   ├── ui/            # shadcn/ui components
│   ├── Header.tsx     # Navigation header
│   └── ProgramCard.tsx # Program display card
├── hooks/             # Custom React hooks
│   ├── useIsOwner.ts  # Check if user is contract owner
│   └── use-toast.ts   # Toast notifications
├── pages/             # Application pages
│   ├── Index.tsx      # Landing page
│   ├── Programs.tsx   # Program listing
│   ├── ProgramDetail.tsx # Program details
│   ├── CreateProgram.tsx # Create new program
│   └── MyContributions.tsx # User contributions
├── config/            # Configuration files
│   └── contract.ts    # Smart contract config
├── providers/         # Context providers
│   └── Web3Provider.tsx # Web3 configuration
└── lib/               # Utility functions
    └── utils.ts       # General utilities
```

## 🚀 Deployment

### Build untuk Production

```bash
npm run build
```

### Deploy ke Lovable

1. Buka [Lovable Project](https://lovable.dev/projects/2179dfe1-4ad2-4888-8595-da8c91576ddf)
2. Klik Share → Publish
3. Ikuti instruksi deployment

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
3. Cek dokumentasi di [Lovable Docs](https://docs.lovable.dev)

---

**MonFund** - Membangun masa depan kampus melalui crowdfunding yang transparan dan aman. 🎓✨
