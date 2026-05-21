# 🚀 ResumeBuilder Pro — Elite FAANG-Standard ATS Engine

ResumeBuilder Pro is a standard-setting, highly optimized dual-pane workstation designed to build pixel-perfect, **top 1% ATS-optimized professional resumes**. Engineered with React, Next.js, Zustand, and Puppeteer, it ensures your resume bypasses corporate automated filters and catches recruiters' attention.

---

## 🔥 Key Upgrades & Capabilities

* 🎯 **Figma-Style Workspace & Zoom Engine**: Sleek dot-blueprint canvas featuring a reactive Figma-style zoom controller (`-`, `+`, `Fit`) that dynamically fits the locked A4 sheet into any device window with zero layout shift.
* ⚡ **Sleek Accordion Editor Stack**: Highly responsive split-screen accordion stack featuring rotating chevrons, completion indicators, and beautiful inline SVG icons to eliminate scroll fatigue.
* 🔮 **Premium Focus Glow UI**: Sleek modern Indigo-focus glow inputs (`focus:ring-indigo-100 focus:border-indigo-500`) and modern responsive typography.
* 🛡️ **FAANG-Grade ATS Scoring (0-100)**: Real-time scoring algorithm checking document completeness, email details, experience lists, and tech skills to give you instant feedback.
* 📥 **Hybrid Dual-Engine PDF Export**: Zero-latency client-side PDF downloads (`html2pdf.js`) with high-fidelity Puppeteer server-side fallback for exact print dimension accuracy.
* 📦 **Zustand Real-Time Store**: Infinite client-side performance, local state-based memoization, and automatic drafts persistence.

---

## 🛠️ High-Performance Tech Stack

* **Frontend**: Next.js 14 (Pages Router) + React 18
* **State Engine**: Zustand 4 (Reactive global state)
* **Styling**: Tailwind CSS + Pure Custom HSL CSS
* **Schema Validation**: Zod + React Hook Form
* **PDF Compile Engine**: Puppeteer + html2pdf.js
* **Language**: TypeScript

---

## ⚙️ Direct Setup & Deployment

### 1. Install Workspace
```bash
npm install
```

### 2. Launch Workstation Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) for real-time split-pane editing.

### 3. Compile & Production Build
```bash
npm run build
npm run start
```

---

## 📂 Architecture Mapping

```
Resume JSON (Source of Truth)
        │
        ├── Zod Schema Validator
        │
        ├── Zustand Store (Reactive State)
        │
        ├── React Memo Components (Zero-Lag Render)
        │
        └── Dual-Pane UI Canvas
            ├── Premium Accordion Form Stack
            └── Figma-Style Zoom Workspace
```

**Built for developers, builders, and professionals who demand a top-tier resume.**
