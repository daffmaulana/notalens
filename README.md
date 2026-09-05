# NotaLens

<p align="center">
  <strong>Turn every receipt into smarter spending decisions.</strong>
</p>

<p align="center">
  A mobile-first expense tracking and workspace collaboration app powered by AI receipt OCR.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white" alt="FastAPI" />
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#ai-pipeline">AI Pipeline</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#project-structure">Project Structure</a>
</p>

---

## What is NotaLens?

NotaLens is a mobile-first expense management application designed to simplify the process of recording purchases from receipts. Users can capture a receipt photo, let AI extract the important details, review the extracted data, and save the transaction into either a personal recap or a collaborative workspace.

The app helps users:
- track personal spending habits
- collaborate with team members in shared workspaces
- verify transactions in group budgets
- export reports into PDF and Excel
- reduce manual data entry through AI-powered OCR

```text
Receipt Photo → AI Extraction → Review & Edit → Save Transaction → Dashboard & Reporting
```

---

## Features

| Feature | Description |
| --- | --- |
| Receipt Scan | Capture or upload a receipt photo with camera or gallery support |
| AI OCR Extraction | Extract merchant name, date, item list, tax, and total automatically |
| Personal Recap | View monthly and weekly expense summaries for personal spending |
| Workspace Collaboration | Create or join shared workspaces and record expenses together |
| Verification Flow | Creator can verify transactions in workspace-based entries |
| Budget Monitoring | Track workspace spending against budget targets |
| PDF & Excel Export | Download reports for personal or workspace financial review |
| User Authentication | Login, register, reset password, and session-based access |
| Profile Management | Update profile and change password |
| Dark Mode | Toggle between light and dark interface |

---

## AI Pipeline

NotaLens uses a dedicated Python service to process receipt images and transform raw visual content into structured transaction data.

### Core pipeline

```text
Image Input
   ↓
YOLO receipt detection
   ↓
Image preprocessing
   ↓
OCR extraction (EasyOCR)
   ↓
LLM parsing (Gemini)
   ↓
Structured JSON response
```

### Extracted fields
- merchant name
- transaction date
- expense category
- list of purchased items
- quantity and price
- tax amount
- total spending

### AI stack
- YOLO for receipt detection
- OpenCV preprocessing
- EasyOCR for reading text from receipt images
- Gemini AI for structured JSON parsing
- FastAPI as the API layer

---

## Architecture

```text
┌───────────────────────────────┐
│        Next.js App            │
│  Dashboard • Scan • Recap     │
│  Workspace • Settings         │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│      Next.js API Routes       │
│ Auth • Transactions •         │
│ Workspace • Upload • Profile  │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│        Supabase               │
│ Postgres + Auth + Storage     │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│     Python AI Service         │
│   FastAPI + OCR + Gemini      │
└───────────────────────────────┘
```

This architecture keeps the frontend experience lightweight while shifting heavy visual processing into the dedicated AI backend.

---

## Tech Stack

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- App Router

### Backend
- Next.js API Routes
- JWT-based authentication
- Supabase JS SDK
- bcryptjs for password hashing

### Database & Storage
- Supabase PostgreSQL
- Supabase Storage

### AI & OCR
- Python
- FastAPI
- OpenCV
- YOLO
- EasyOCR
- Gemini

### Reporting
- jsPDF
- jsPDF AutoTable
- xlsx

---

## Project Structure

```text
notalens/
├── app/
│   ├── (auth)/
│   ├── (main)/
│   ├── api/
│   └── globals.css
├── ai/
│   ├── app.py
│   ├── Dockerfile
│   ├── README.md
│   ├── requirements.txt
│   └── models/
├── components/
├── context/
├── docs/
├── lib/
├── public/
├── supabase/
│   └── schema.sql
├── types/
├── .env.example
├── eslint.config.mjs
├── middleware.ts
├── next.config.ts
├── next-env.d.ts
├── package.json
├── postcss.config.mjs
├── tsconfig.json
├── README.md
└── ...
```

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret
```

For AI service, configure the Python service environment as well:

```env
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Run the app

#### Frontend
```bash
npm run dev
```

#### AI service
```bash
cd ai
pip install -r requirements.txt
python app.py
```

Or run both together:

```bash
npm run dev:all
```

### 4. Open the app

Visit:

```text
http://localhost:3000
```

---

## Available Scripts

```bash
npm run dev        # start Next.js development server
npm run build      # production build
npm run start      # run production build
npm run lint       # run ESLint
npm run dev:ai     # start Python AI service
npm run dev:all    # run frontend + AI service concurrently
```

---

## Database & Schema

The project uses Supabase as the primary database and storage provider. The schema can be found in:

- [supabase/schema.sql](supabase/schema.sql)

The main database entities include:
- users
- workspaces
- workspace_members
- transactions
- transaction_items

These structures support both personal expense tracking and collaborative workspace usage.

---

## Core User Flows

### Personal expense tracking
1. Open Scan page
2. Capture a receipt from camera or upload an image
3. AI extracts transaction details
4. Review and edit extracted data
5. Save as personal expense
6. View recap and summary in dashboard

### Workspace collaboration
1. Create or join a workspace using a unique code
2. Scan a receipt from within the workspace
3. Save transaction to the workspace
4. Review all transactions in one place
5. Verify eligible transactions as workspace creator

---

## Security & Access Control

- JWT-based user authentication
- protected API routes for authenticated access
- workspace-specific authorization rules
- creator-only verification and export permissions
- transaction ownership checks before modification or deletion

---

## Notes

This project is built as a full-stack application with a clear separation between:
- frontend UI and business flow
- backend API and authorization
- database persistence
- AI-powered extraction service

It is well-suited for future expansion into:
- budget alerts
- recurring expenses
- analytics dashboard
- export automation
- multi-tenant team administration

---

## Research / Development Context

NotaLens is positioned as an intelligent financial management application that combines expense tracking, collaborative workspaces, and AI-assisted receipt processing into a single workflow.

The project demonstrates how a modern web app can combine:
- user-centered product experience
- structured financial data models
- collaborative team features
- AI automation for document understanding

---

<p align="center">
  <strong>NotaLens</strong><br>
  Turn receipts into clarity.
</p>
