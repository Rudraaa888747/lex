<div align="center">
  <img src="public/logo.jpg" alt="Lex AI Logo" width="120" height="120" style="border-radius: 20px; box-shadow: 0 8px 32px rgba(0,0,0,0.1);" />

  <h1>Lex — AI Legal Document Analyzer</h1>
  <p><strong>Understand every contract. In seconds, not days.</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwindcss" alt="Tailwind" />
    <img src="https://img.shields.io/badge/Prisma-v7-2D3748?logo=prisma" alt="Prisma" />
    <img src="https://img.shields.io/badge/License-Proprietary-red" alt="License" />
  </p>

  <p>
    An enterprise-grade AI-powered legal document analyzer designed to simplify complex legal jargon, identify critical risks, and provide actionable insights into contracts, agreements, and policies.
  </p>

  <p>
    <a href="#-features">Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-architecture-overview">Architecture</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-security-practices">Security</a>
  </p>
</div>

<br />

---

## ✨ Features

| | |
|---|---|
| 📄 **Instant Document Analysis** | Upload PDFs, DOCX, or TXT files and get a comprehensive, clause-by-clause breakdown within seconds. |
| 🚩 **AI Risk Detection** | Automatically identifies red flags, hidden obligations, aggressive IP clauses, and potential conflicts of interest. |
| 💬 **Interactive Document Chat** | A context-aware AI chat scoped specifically to your uploaded documents — ask questions, request summaries, or clarify specific clauses. |
| 🌐 **Multi-lingual Support** | Native support for analyzing documents in **English**, **Hindi (हिन्दी)**, and **Gujarati (ગુજરાતી)**. |
| 🔒 **Bank-Grade Security** | Built with NextAuth, secure credential hashing, JWT session management, isolated processing, and a zero-data-retention policy for AI inputs. |
| 🔍 **Smart Comparison** | Upload two versions of a contract and get a precise diff — every change highlighted and explained. |
| 📤 **Export & Portability** | Generate professional PDF and DOCX executive summaries with a single click. |

<br />

## 🛠 Tech Stack

### Core
| Category | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS 4 + Custom Glassmorphism UI tokens |
| Icons | Lucide React |

### Backend & Database
| Category | Technology |
|---|---|
| Database | PostgreSQL (hosted via Supabase) |
| ORM | Prisma Client v7 |
| Authentication | NextAuth.js (Auth.js) v5 with JWT Strategy |
| File Storage | Cloudinary (profile assets & secure document handling) |

### AI & Processing
| Category | Technology |
|---|---|
| AI Integration | OpenRouter (GPT-4o / Claude 3.5 Sonnet) via `@google/generative-ai` & `openai` SDKs |
| Document Parsing | `pdf-parse`, `pdf-lib`, `mammoth` (for DOCX) |
| OCR | `tesseract.js` for scanned documents |

<br />

## 🏗 Architecture Overview

The application follows a highly modular, feature-based architecture to ensure maintainability and scalability:

```text
legal-analyzer/
├── public/                 # Static assets (logos, icons, illustrations)
├── prisma/                 # Database schema and migrations
└── src/
    ├── app/                # Next.js App Router (Routes, API endpoints)
    │   ├── (auth)/         # Authentication routes
    │   ├── api/             # Backend API endpoints
    │   ├── dashboard/       # Protected dashboard routes
    │   └── ...              # Public landing pages
    ├── components/          # Reusable global UI components
    │   ├── layout/          # Core layout components (Header, Footer, Dashboard Shell)
    │   └── ui/               # Atomic UI components (Buttons, Inputs, Modals)
    ├── lib/                 # Core utilities, database initialization, auth config
    ├── services/            # External integrations (e.g., ai.service.ts)
    └── types/               # Global TypeScript interfaces and type definitions
```

<br />

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone <repository-url>
cd legal-analyzer
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory and populate it with your specific keys:

```env
# Database (PostgreSQL)
DATABASE_URL="postgresql://user:password@host:port/db"
DIRECT_URL="postgresql://user:password@host:port/db"

# NextAuth / Security
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_super_secret_jwt_string"

# AI Integration
OPENROUTER_API_KEY="sk-or-v1-..."
```

### 4. Database Initialization
Push the Prisma schema to your database to construct the necessary tables:
```bash
npx prisma db push
```

### 5. Start Development Server
```bash
npm run dev
```
Navigate to `http://localhost:3000` to view the application.

<br />

## 🛡 Security Practices

- **Strict Data Isolation** — Every database query is strictly scoped by `userId`.
- **Isolated Processing** — Documents are processed in memory and never used for public model training.
- **Type Safety** — The application guarantees 100% strict TypeScript compliance.
- **Payload Sanitization** — API routes include strict character limits and content sanitization to prevent LLM prompt-injection and abuse.

<br />

## 📄 License

&copy; Lex AI. All rights reserved. This software is proprietary and confidential.

<div align="center">
  <sub>Built with precision, for the people who read the fine print.</sub>
</div>