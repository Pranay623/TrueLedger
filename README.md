<div align="center">
  <h1>🔐 TrueLedger</h1>
  <h3>The Future of Digital Certificates — AI + Blockchain Powered</h3>
  
  <p>
    <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" />
    <img src="https://img.shields.io/badge/React-19-cyan?style=flat-square&logo=react" />
    <img src="https://img.shields.io/badge/Prisma-ORM-blue?style=flat-square&logo=prisma" />
    <img src="https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwindcss" />
    <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" />
  </p>
  
  <p>
    <strong>TrueLedger</strong> is a next-generation platform for issuing, storing, and verifying digital certificates with immutable trust.
  </p>
</div>

---

## 🌟 Overview

**TrueLedger** is an enterprise-grade certificate automation platform built on the cutting-edge **Next.js 16 App Router**. It bridges the gap between traditional document management and Web3 security by combining:

- **🔗 Blockchain Immutability**: Cryptographic hashing ensures certificates can never be tampered with.
- **🧠 AI/ML Fraud Detection**: Intelligent verification layers to prevent forgery.
- **⚡ Modern Architecture**: Built with React 19, Server Actions, and a modular API-first backend.

Designed for universities, certification bodies, and training platforms to issue verifiable credentials at scale.

---

## ✨ Features

| Feature | Description |
|:---|:---|
| **🔒 Secure Authentication** | Robust JWT-based auth with NextAuth, Google OAuth, and custom credentials. |
| **🎓 Smart Issuance** | Drag-and-drop certificate generation with dynamic PDF rendering. |
| **⛓️ Blockchain Anchor** | Every certificate is hashed and anchored to the blockchain for verifiable proof of existence. |
| **🤖 AI Verification** | Automated optical character recognition (OCR) and tamper detection for uploaded certificates. |
| **🕸️ Public Verify API** | Public-facing pages to instantly verify credentials via ID or QR code. |
| **📊 Analytics Dashboard** | Real-time insights into issued, verified, and active certificates via interactive charts. |
| **🎨 Premium UI/UX** | Stunning glassmorphism interface built with Tailwind v4 and shadcn/ui. |

---

## 🛠️ Tech Stack

### Core Framework
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server Actions)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)

### Backend & Data
- **Database**: PostgreSQL
- **ORM**: [Prisma](https://www.prisma.io/)
- **Auth**: NextAuth.js / Custom JWT
- **Validation**: Zod

### Advanced Tech
- **Blockchain**: SHA-256 Hashing / Ledger Service
- **AI/ML**: OpenCV / Tesseract (OCR Integration)
- **Storage**: AWS S3 / Local Secure Storage

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
- Node.js 18+
- PostgreSQL Database

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/trueledger.git
    cd trueledger
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory and add the following variables:

    ```env
    # Database (PostgreSQL)
    DATABASE_URL="postgresql://user:password@localhost:5432/trueledger"

    # Authentication
    NEXTAUTH_URL="http://localhost:3000"
    NEXTAUTH_SECRET="your-super-secret-key-at-least-32-chars"
    JWT_SECRET="your-jwt-secret-key"

    # Google OAuth (Optional)
    GOOGLE_CLIENT_ID="your-google-client-id"
    GOOGLE_CLIENT_SECRET="your-google-client-secret"
    
    # Blockchain / API (If applicable)
    BLOCKCHAIN_ENDPOINT="http://localhost:8545"
    ```

4.  **Database Migration**
    Initialize your database schema with Prisma.
    ```bash
    npx prisma migrate dev --name init
    ```

5.  **Run Development Server**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) to see the application.

---

## 📁 Project Structure

```bash
trueledger/
├── app/
│   ├── api/            # API Routes (Auth, Certificates, Blockchain)
│   ├── dashboard/      # Protected Dashboard Pages
│   ├── verify/         # Public Verification Pages
│   ├── (auth)/         # Auth Pages (Signin/Signup)
│   └── page.tsx        # Landing Page
├── components/         # Reusable UI Components
├── lib/                # Utilities, Hooks, and Context
├── prisma/             # Database Schema
└── public/             # Static Assets
```

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

---

<p align="center">
  Built with ❤️ by Pranay
</p>