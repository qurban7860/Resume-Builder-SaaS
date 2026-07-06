<div align="center">
  <!-- <div align="center">
    <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/NextJS-Dark.svg" width="50" height="50" alt="Next.js"/>
    <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/React-Dark.svg" width="50" height="50" alt="React"/>
    <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/TypeScript.svg" width="50" height="50" alt="TypeScript"/>
    <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/TailwindCSS-Dark.svg" width="50" height="50" alt="Tailwind"/>
  </div>
  <br /> -->
  <h1 align="center">ResumeBuilder Pro Ecosystem</h1>
  <p align="center">
    <strong>Top 1% FAANG-Standard ATS Resume Builder & Enterprise Asset Generator</strong>
  </p>
  <p align="center">
    A premium SaaS ecosystem engineered to outperform technical ATS filters and secure engineering roles at market-leading organizations. Includes a zero-ripple automation pipeline for cinematic asset generation.
  </p>
  <br />
</div>

---

## 🌟 Platform Overview

ResumeBuilder Pro is a professional-grade Next.js workspace combining a recruiter-aware editor, ATS-aware scoring, document parsing, and PDF export into a single, cohesive ecosystem.

- **Dual-Pane Editor**: Live resume preview alongside structured editing fields.
- **ATS Intelligence Engine**: Real-time scoring, keyword optimization, and completeness tracking.
- **Recruiter Vision Simulator**: Heatmap visualization highlighting the 6-second recruiter focal points.
- **Zero-Distortion Export**: Pixel-perfect PDF rendering (Client-side with Server-side Puppeteer fallback).
- **Gemini AI Integration**: Contextual bullet enhancements using the STAR methodology.
- **Local Decentralized Privacy**: Complete data portability with local persistence and snapshots.

---

## 🎬 The Universal Asset Generation Pipeline

This project includes a **Top 1% Enterprise Asset Generation Script** designed for seamless portfolio showcases on Upwork, Fiverr, LinkedIn, and YouTube.

Operating completely external to your application state (**zero-ripple architecture**), this Playwright-driven engine autonomously crawls the live application to generate recruiter-grade artifacts.

### 🚀 What it Generates

1. **Cinematic Demo Video (`.mp4`)**: Smooth, continuous-scroll interactions captured at 1366x768 (16:9) with cinematic fade-in/fade-out scene transitions.
2. **Executive Case Study (`.pdf`)**: A dynamic, multi-page A4 landscape HTML-to-PDF report mapping all visual assets alongside an embedded Engineering Profile.
3. **High-Res Screenshots (`.png`)**: Pixel-perfect, viewport-isolated captures of critical business logic and UI components.

### ⚙️ How to Run the Pipeline

The pipeline is fully automated. Simply ensure your Next.js development server is running.

```bash
# Terminal 1: Start the application
npm run dev

# Terminal 2: Execute the generation pipeline
npm run generate-assets
```

**Pipeline Outputs:**
Find your premium artifacts safely stored outside the source tree:
- 📂 `output/screenshots/`
- 📄 `output/artifacts/ENTERPRISE_DEMO_REPORT.pdf`
- 🎬 `output/artifacts/ENTERPRISE_DEMO_VIDEO.mp4`

---

## 🧠 The "Golden Prompt" (For Reusability)

Want to deploy this exact cinematic asset pipeline in your next SaaS project? Copy and paste the prompt below into any AI coding assistant to guarantee a top-notch automation architecture:

> *"I need a top-notch, enterprise-grade Playwright automation script to generate recruiter-grade portfolio assets. Use the exact robust pattern:
> 1. Use Playwright (Chromium only) to capture viewport screenshots, a continuous scrolling demo video (`recordVideo` at 1366x768), and a dynamic HTML-to-PDF executive case study report.
> 2. Implement an `ensurePageReady` function with `gotoStable` (using `waitUntil: 'domcontentloaded'` and manual buffers). If the app has auth, handle login dynamically. Support smooth scrolling to anchor tags for single-page marketing sites.
> 3. Generate a stunning, landscape A4 HTML report dynamically mapping the screenshots, using a premium dark-mode aesthetic (linear gradients, pill summaries).
> 4. For PDF generation, wait for all images to decode using a robust `Promise.all` evaluation (`document.querySelectorAll('img')` with `load` and `decode` checks) before calling `page.pdf()` with zero margins and CSS page size.
> 5. Output structure should be `/output/screenshots`, `/output/artifacts/REPORT.pdf`, and `/output/artifacts/VIDEO.mp4`.
> Ensure it's efficient, uses ES modules, and has absolutely no ripple effect on the main app codebase."*

---

## 🛠️ Architecture & Tech Stack

- **Core**: Next.js 14 (Pages Router), React 18, TypeScript
- **Styling**: Tailwind CSS, Vanilla CSS (Glassmorphism, gradients, micro-animations)
- **State Management**: Zustand, React Hook Form
- **Automation**: Playwright (Chromium), Puppeteer Core
- **Utilities**: Zod, HTML2PDF.js, Mammoth, PDF-Parse

## 🚀 Quick Start

```bash
# 1. Install dependencies (including Playwright)
npm install

# 2. Run the development server
npm run dev
```

Visit `http://localhost:3000` to access the platform.

---
<div align="center">
  <p>Engineered for High-Conversion Engineering Portfolios.</p>
</div>
