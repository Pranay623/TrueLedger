<h1 align="center">  
  🔐 TrueLedger  
</h1>

<h3 align="center">  
  <em>The Future of Digital Certificates — AI + Blockchain Powered</em>  
</h3>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js" />
  <img src="https://img.shields.io/badge/Prisma-ORM-blue?style=flat-square&logo=prisma" />
  <img src="https://img.shields.io/badge/Blockchain-Ready-green?style=flat-square&logo=bitcoin" />
  <img src="https://img.shields.io/badge/AI%2FML-Integrated-purple?style=flat-square&logo=opencv" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" />
</p>

---

## 🌟 Overview

**TrueLedger** is a modern, full-stack certificate automation and verification platform built entirely on **Next.js App Router** with a fully modular backend integrated directly into `/app/api/**`.

It combines:

- **Blockchain hashing** for tamper-proof certificates  
- **AI/ML fraud detection**  
- **PDF generation & verification**  
- **Modern dashboards and UI experiences**  
- **Enterprise-grade backend architecture (Controllers → Services → DB)**  

Designed for organizations, institutions, and platforms requiring **secure certificate issuance, automation, and verification at scale**.

---

## ✨ Features

### 🚀 Platform Features
| Feature | Description |
|--------|-------------|
| 🔐 **Authentication System** | JWT-based login, register, refresh tokens |
| 🧾 **Certificate Issuance** | Issue, store, and manage digital certificates |
| 📡 **Blockchain Integration** | Store certificate hashes in blockchain for immutability |
| 🤖 **AI/ML Verification** | Detect tampered or fraudulent certificates |
| 📄 **PDF & Template Support** | Generate certificate PDFs dynamically |
| 🔍 **Instant Verification** | Public certificate verification by ID or QR |
| 🛡️ **Role-Based Access** | Admin & user modes |
| ☁️ **File Upload System** | Next.js-compatible secure upload middleware |
| 📊 **Modern Dashboard UI** | Built with Tailwind + shadcn/UI |

---

## 📸 UI Preview

> **These are placeholders — replace with real screenshots once available.**

### 🔑 Authentication
![Auth Page](docs/screens/auth.png)

### 📊 Dashboard
![Dashboard](docs/screens/dashboard.png)

### 🎓 Certificate Issuance
![Certificate](docs/screens/certificate.png)

### 🔍 Public Verification
![Verification](docs/screens/verify.png)

---

## 🏗️ System Architecture

Frontend (Next.js App Router)
│
├── UI Components (shadcn)
├── Auth Context + Hooks
│
└── API Layer (/app/api/**)
│
├── Controller Layer (Business rules)
├── Service Layer (DB, Blockchain, ML)
├── Middleware (Auth, Validation, Upload)
└── Prisma ORM → Database
│
├── User
├── Certificate
└── BlockchainRecord

---

## 📁 Folder Structure (Backend Inside Next.js)

trueledger/
├── app/
│ ├── api/
│ │ ├── auth/
│ │ │ ├── login/route.ts
│ │ │ ├── register/route.ts
│ │ │ ├── refresh/route.ts
│ │ │ └── controller.ts
│ │ │
│ │ ├── users/
│ │ │ ├── me/route.ts
│ │ │ └── controller.ts
│ │ │
│ │ ├── certificates/
│ │ │ ├── issue/route.ts
│ │ │ ├── verify/route.ts
│ │ │ ├── list/route.ts
│ │ │ └── controller.ts
│ │ │
│ │ ├── blockchain/
│ │ │ ├── write/route.ts
│ │ │ ├── read/route.ts
│ │ │ └── controller.ts
│ │ │
│ │ ├── ml/
│ │ │ ├── detect/route.ts
│ │ │ └── controller.ts
│ │ │
│ │ ├── middlewares/
│ │ │ ├── requireAuth.ts
│ │ │ ├── validate.ts
│ │ │ └── upload.ts
│ │ │
│ │ ├── services/
│ │ │ ├── auth-service.ts
│ │ │ ├── user-service.ts
│ │ │ ├── certificate-service.ts
│ │ │ ├── blockchain-service.ts
│ │ │ └── ml-service.ts
│ │ │
│ │ ├── db/
│ │ │ ├── prisma.ts
│ │ │ └── models.ts
│ │ │
│ │ ├── utils/
│ │ │ ├── jwt.ts
│ │ │ ├── hash.ts
│ │ │ ├── responses.ts
│ │ │ └── errors.ts
│ │ │
│ │ └── types/
│ │ ├── auth.ts
│ │ ├── certificate.ts
│ │ └── user.ts
│ │
│ ├── page.tsx
│ ├── layout.tsx
│ ├── signin/page.tsx
│ └── signup/page.tsx
│
├── prisma/
├── components/
├── lib/
├── public/
└── .env


---

## 🛠️ Tech Stack

### **Frontend**
- ⚡ Next.js 14 (App Router)
- 🎨 Tailwind CSS + shadcn/UI
- 🧩 Zustand / Context
- ✨ Framer Motion

### **Backend (Inside Next.js API)**
- 🛠️ Controller → Service → DB Pattern
- 🔐 JWT Authentication
- 📦 Prisma ORM
- 🧪 Zod Validation
- 🔄 Server Actions (optional)

### **AI + Blockchain**
- 🧠 ML Fraud Detector (custom module)
- ⛓️ Blockchain Hash Storage (SHA-256 hashing → Blockchain Service)

---

## 🚀 Getting Started

### 1️⃣ Install dependencies
```bash
npm install
```
### 2️⃣ Setup environment variables
Create .env:
```bash
DATABASE_URL=Your Prisma DB URL
JWT_SECRET=your-secret
BLOCKCHAIN_ENDPOINT=your-blockchain-endpoint
```
### 3️⃣ Prisma Migration
```bash
npx prisma migrate dev
```
### 4️⃣ Run development server
```bash
npm run dev
```