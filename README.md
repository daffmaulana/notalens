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
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white" alt="FastAPI" />
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#ai-pipeline">AI Pipeline</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#getting-started">Getting Started</a> •
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

This project was developed as a submission for the capstone project of the AI Intensive Course by Pijak Dicoding x IBM SkillsBuild
Created by [Ahmad](https://github.com/AhmadSabani475), [Bima](https://github.com/ABimantara), [Daffa ](https://github.com/daffmaulana), [Kholilah](https://github.com/kholilah78), [Selvi](https://github.com/selvi-ra)

---

## Demo
 
https://github.com/user-attachments/assets/e6c2213b-57ba-4bbd-a389-eaaa4ab299bc

Full Demo [Here](https://www.youtube.com/watch?v=KexCd-TetH0)
<table>
  <tr>
    <td align="center" width="20%">
      <img src="https://github.com/user-attachments/assets/cde12563-a863-4e7f-8786-8a47f6db7486" width="160" alt="Recap" /><br />
      <sub><strong>Recap</strong></sub>
    </td>
    <td align="center" width="20%">
      <img src="https://github.com/user-attachments/assets/8f14563a-ffe7-4fb0-923e-5326cc54143b" width="160" alt="Verif Scan" /><br />
      <sub><strong>Verif Scan</strong></sub>
    </td>
    <td align="center" width="20%">
      <img src="https://github.com/user-attachments/assets/91d5e5d3-33ce-4c55-a91b-853813e97c38" width="160" alt="Detail Receipt" /><br />
      <sub><strong>Detail Receipt</strong></sub>
    </td>
    <td align="center" width="20%">
      <img src="https://github.com/user-attachments/assets/8b39d822-2cf6-41ba-9c6a-faa8d6f3bd7f" width="160" alt="Workspace" /><br />
      <sub><strong>Workspace</strong></sub>
    </td>
    <td align="center" width="20%">
      <img src="https://github.com/user-attachments/assets/5a72b9f1-b1bc-4454-a3eb-6cdb2d046c80" width="160" alt="Manage Workspace" /><br />
      <sub><strong>Manage Workspace</strong></sub>
    </td>
  </tr>
</table>
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


### Available Scripts

```bash
npm run dev        # start Next.js development server
npm run build      # production build
npm run start      # run production build
npm run lint       # run ESLint
npm run dev:ai     # start Python AI service
npm run dev:all    # run frontend + AI service concurrently
```

---
<p align="center">
  <strong>NotaLens</strong><br>
  Turn receipts into clarity.
</p>
