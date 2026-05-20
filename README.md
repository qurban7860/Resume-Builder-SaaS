# 🚀 ATS-Optimized Resume Builder

A **top 1% resume builder** built with React, Next.js, Zustand, and Puppeteer for PDF export.

---

## 🎯 Architecture Overview

```
Resume JSON (source of truth)
        ↓
Schema Validator Layer (Zod)
        ↓
Zustand State Management
        ↓
React Components (Memoized)
        ↓
Live Resume Renderer
        ↓
HTML/CSS (TailwindCSS)
        ↓
PDF Export (Puppeteer/HTML2PDF)
```

---

## 📦 Project Structure

```
ResumeBuilder/
├── components/
│   └── resume/
│       ├── Header.tsx
│       ├── Summary.tsx
│       ├── Experience.tsx
│       ├── Projects.tsx
│       ├── Skills.tsx
│       ├── Education.tsx
│       ├── Certifications.tsx
│       └── ResumeRenderer.tsx
├── pages/
│   ├── index.tsx
│   ├── _app.tsx
│   └── api/
│       └── resume/
│           └── pdf.ts
├── store/
│   └── useResumeStore.ts
├── lib/
│   ├── schema.ts (Zod validation)
│   └── pdfExport.ts
├── data/
│   └── resume.json
├── styles/
│   └── globals.css
├── tailwind.config.js
├── tsconfig.json
├── next.config.js
└── package.json
```

---

## 🔧 Tech Stack

| Component | Technology |
|-----------|-----------|
| **Frontend Framework** | React 18 + Next.js 14 |
| **State Management** | Zustand |
| **Styling** | TailwindCSS |
| **Validation** | Zod |
| **PDF Engine** | Puppeteer + HTML2PDF |
| **Form Handling** | React Hook Form |
| **Language** | TypeScript |

---

## ✨ Key Features

### 1. **Lossless Resume Parsing**
- Extracts resume data from PDF/DOCX
- Preserves original text and structure
- Stores in strict Reactive Resume v4 JSON format

### 2. **Real-Time State Management**
```typescript
const { resume, updateSection, getScore } = useResumeStore();
```

- Instant updates across the app
- No network requests for edits
- Score recalculates in real-time

### 3. **Live Resume Preview**
- Renders from JSON components
- No double rendering
- Memoized for performance

### 4. **ATS Optimization**
- A4 size only
- No images (ATS safe)
- Clean typography (11px body, 14-16px headings)
- Proper section ordering:
  1. Header
  2. Summary
  3. Experience
  4. Projects
  5. Skills
  6. Education
  7. Certifications

### 5. **Resume Scoring Engine**
```
Experience      30 pts
Skills          20 pts
Projects        20 pts
Email           10 pts
Education       10 pts
Certifications  10 pts
─────────────────────
TOTAL          100 pts
```

### 6. **PDF Export**
- **Client-side**: HTML2PDF (fast, no server needed)
- **Server-side**: Puppeteer (better quality, A4 format)

---

## 🚀 Installation & Setup

### Prerequisites
```bash
Node.js 16+ 
npm or yarn
```

### Installation
```bash
cd ResumeBuilder
npm install
```

### Development
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build
```bash
npm run build
npm start
```

---

## 📊 Resume Data Format

The app uses **Reactive Resume v4** JSON schema:

```json
{
  "basics": {
    "name": "Qurban Hanif",
    "headline": "Software Engineer",
    "email": "qurbanhanif120@gmail.com",
    "phone": "03085651015",
    "location": "Lahore"
  },
  "sections": {
    "summary": { "content": "..." },
    "experience": {
      "items": [
        {
          "id": "uuid",
          "title": "Frontend Engineer",
          "company": "Company Name",
          "startDate": "07/2025",
          "endDate": "Present",
          "summary": "<ul><li>Bullet point</li></ul>"
        }
      ]
    },
    "skills": {
      "items": [
        {
          "id": "uuid",
          "name": "Frontend Development",
          "keywords": ["React", "Next.js", "TypeScript"]
        }
      ]
    }
  }
}
```

---

## 🎨 Component System

### Experience Card
```typescript
<ExperienceCard 
  item={{
    title: "Frontend Engineer",
    company: "Sigi Technologies",
    startDate: "07/2025",
    endDate: "Present",
    summary: "<ul><li>Built frontend...</li></ul>"
  }}
/>
```

### Skills
```typescript
<Skills 
  items={[
    {
      id: "uuid",
      name: "Frontend Development",
      keywords: ["React", "Next.js"]
    }
  ]}
/>
```

All components are **memoized** for performance.

---

## 📥 PDF Export

### Client-Side Export (Fast)
```typescript
import { exportResumeToPDF } from '@/lib/pdfExport';

await exportResumeToPDF(html, 'resume.pdf');
```

### Server-Side Export (High Quality)
```typescript
POST /api/resume/pdf
Content-Type: application/json

{
  "html": "<div>...</div>",
  "filename": "resume.pdf"
}
```

Returns: PDF as binary blob

---

## 🔐 Validation

All resume data is validated against Zod schema:

```typescript
import { ResumeSchema } from '@/lib/schema';

const validated = ResumeSchema.parse(resumeData);
```

---

## 📈 Resume Scoring

Real-time score calculation:

```typescript
const score = useResumeStore((state) => state.getScore());

// Displays 0-100 in the dashboard
```

---

## 🎯 Next Steps (Enhancement Ideas)

1. **Real-time Editor**
   - Side-by-side JSON editor
   - Live preview as you type

2. **Template System**
   - Multiple resume designs
   - Custom color schemes

3. **ATS Parser**
   - Scan resume for ATS compatibility issues
   - Keyword extraction

4. **Multi-Resume**
   - Save multiple versions
   - A/B testing for different jobs

5. **AI Suggestions**
   - Improve bullet points
   - Suggest better skills
   - Auto-format content

---

## 📝 License

MIT - Use freely

---

## 🤝 Contributing

Contributions welcome! Fork and submit PRs.

---

## 📧 Support

For issues, open a GitHub issue or contact support.

---

**Built with ❤️ for job seekers everywhere**
