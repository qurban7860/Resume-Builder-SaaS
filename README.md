# ResumeBuilder SaaS

ResumeBuilder is a professional-grade resume platform built with Next.js, React, Zustand, and Tailwind CSS. It combines a recruiter-aware editor, ATS-aware scoring, document parsing, and PDF export into a single modern workspace.

## What this project includes

- Dual-pane editor with live resume preview and editable resume sections
- ATS score engine with completeness, keyword, and format feedback
- Resume upload and parsing for PDF/DOCX/TXT files
- AI-assisted enhancement for bullets, summaries, and keyword suggestions
- Responsive SaaS-style UI with premium layout, glassmorphism cards, and motion transitions
- PDF export workflow with server-side and client-side fallback support
- Recruiter-focused optimization guidance and heatmap visualization
- Local draft persistence and version snapshots

## Core product features

### Editor & workflow
- Structured resume editor with experience, education, skills, projects, and certifications
- Live preview of an A4 resume layout with zoom and fit controls
- Template switching and recruiter-friendly formatting
- Keyboard shortcuts for export, snapshots, and workflow toggles

### ATS & recruiter intelligence
- Real-time ATS scoring and feedback widget
- Recruiter heatmap visualization for quick scan behavior
- Weak section warnings and document completeness indicators
- Industry-style writing guidance and impact-focused phrasing

### Upload and parse
- Upload existing resumes in PDF, DOCX, or TXT format
- Automatic parsing and resume population into the editor
- On-device parsing with `pdf-parse` and `mammoth`

### Export
- A4 PDF export using `html2pdf.js`
- Server-side PDF generation route for more stable production rendering
- Print-safe layout with margin and typography consistency

## Architecture overview

- `pages/` contains the landing page, builder workspace, and API routes
- `components/` stores editor, resume preview, and UI components
- `lib/` includes reusable PDF export utilities
- `store/` holds global resume and template state with Zustand
- `data/` contains sample resume seed data
- `types/` contains type declarations and library shims

## Technology stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Zustand
- React Hook Form
- Zod
- Puppeteer
- html2pdf.js
- pdf-parse
- mammoth

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Production build

```bash
npm run build
npm run start
```

## Notes

- The project builds successfully with `npm run build`.
- The API route `pages/api/resume/parse.ts` handles PDF/DOCX parsing.
- The resume editor supports file upload, AI enhancement, and PDF export.
