<div align="center">
  <img src="public/logo.jpg" alt="Lex AI Logo" width="120" height="120" style="border-radius: 20px; box-shadow: 0 8px 32px rgba(0,0,0,0.1);" />
  
  <h1 style="margin-top: 20px;">Lex — AI Legal Document Analyzer</h1>
  <p><strong>Understand every contract. In seconds, not days.</strong></p>
  <p>
    An enterprise-grade AI-powered legal document analyzer designed to simplify complex legal jargon, identify critical risks, and provide actionable insights into contracts, agreements, and policies.
  </p>
</div>

---

## ✨ Features

- **Instant Document Analysis**: Upload PDFs, DOCX, or TXT files and get a comprehensive, clause-by-clause breakdown within seconds.
- **AI Risk Detection**: Automatically identifies "Red Flags", hidden obligations, aggressive IP clauses, and potential conflicts of interest.
- **Interactive Document Chat**: A context-aware AI chat scoped specifically to your uploaded documents. Ask questions, request summaries, or clarify specific clauses.
- **Multi-lingual Support**: Native support for analyzing documents in **English**, **Hindi (हिन्दी)**, and **Gujarati (ગુજરાતી)**.
- **Bank-Grade Security**: Built with NextAuth, secure credential hashing, JWT session management, isolated processing, and a zero-data-retention policy for AI inputs.
- **Smart Comparison**: Upload two versions of a contract and get a precise diff — every change highlighted and explained.
- **Export & Portability**: Generate professional PDF and DOCX executive summaries with a single click.

## 🛠 Tech Stack

### Core
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 + Custom Glassmorphism UI tokens
- **Icons**: Lucide React

### Backend & Database
- **Database**: PostgreSQL (hosted via Supabase)
- **ORM**: Prisma Client v7
- **Authentication**: NextAuth.js (Auth.js) v5 with JWT Strategy
- **File Storage**: Cloudinary (for profile assets and safe document handling)

### AI & Processing
- **AI Integration**: OpenRouter (GPT-4o / Claude 3.5 Sonnet) via `@google/generative-ai` & `openai` SDKs
- **Document Parsing**: `pdf-parse`, `pdf-lib`, and `mammoth` (for DOCX)
- **OCR**: `tesseract.js` for scanned documents

## 🏗 Architecture Overview

The application follows a highly modular, feature-based architecture to ensure maintainability and scalability:

```text
legal-analyzer/
├── public/                 # Static assets (logos, icons, illustrations)
├── prisma/                 # Database schema and migrations
└── src/
    ├── app/                # Next.js App Router (Routes, API endpoints)
    │   ├── (auth)/         # Authentication routes
    │   ├── api/            # Backend API endpoints
    │   ├── dashboard/      # Protected dashboard routes
    │   └── ...             # Public landing pages
    ├── components/         # Reusable global UI components
    │   ├── layout/         # Core layout components (Header, Footer, Dashboard Shell)
    │   └── ui/             # Atomic UI components (Buttons, Inputs, Modals)
    ├── lib/                # Core utilities, database initialization, auth config
    ├── services/           # External integrations (e.g., ai.service.ts)
    └── types/              # Global TypeScript interfaces and type definitions
```

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

## 🛡 Security Practices

- **Strict Data Isolation**: Every database query is strictly scoped by `userId`.
- **Isolated Processing**: Documents are processed in memory and never used for public model training.
- **Type Safety**: The application guarantees 100% strict TypeScript compliance.
- **Payload Sanitization**: API routes include strict character limits and content sanitization to prevent LLM prompt-injection and abuse.

## 📄 License

&copy; Lex AI. All rights reserved. This software is proprietary and confidential.
