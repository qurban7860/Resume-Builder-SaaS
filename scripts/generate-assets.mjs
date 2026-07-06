/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║         RESUMEBUILDER PRO — ENTERPRISE ASSET GENERATION PIPELINE        ║
 * ║  Generates: Cinematic Demo Video · Executive PDF · Full-Page Screenshots ║
 * ║  Zero-ripple: operates completely external to the Next.js app state.    ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 *
 * PREREQUISITES
 *   npm install --save-dev playwright
 *   npx playwright install chromium
 *
 * USAGE
 *   1. Start the dev server in a separate terminal:  npm run dev
 *   2. Run this script:  node scripts/generate-assets.mjs
 *
 * OUTPUT
 *   output/screenshots/       — Viewport PNG screenshots per route/section
 *   output/artifacts/         — ENTERPRISE_DEMO_REPORT.pdf · ENTERPRISE_DEMO_VIDEO.mp4
 */

import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';

/* CONFIGURATION */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BASE_URL = 'http://localhost:3000';

const outputRoot = path.resolve(__dirname, '..', 'output');
const screenshotsDir = path.join(outputRoot, 'screenshots');
const artifactsDir = path.join(outputRoot, 'artifacts');
const videoTempDir = path.join(artifactsDir, 'video-temp');

const reportHtmlPath = path.join(outputRoot, 'ENTERPRISE_DEMO_REPORT.html');
const reportPdfPath = path.join(artifactsDir, 'ENTERPRISE_DEMO_REPORT.pdf');
const finalVideoPath = path.join(artifactsDir, 'ENTERPRISE_DEMO_VIDEO.mp4');

const CAPTURE_TARGETS = [
  { slug: '01-landing-hero', title: 'Landing Hero', detail: 'Primary hero CTA — AI-powered ATS resume ecosystem pitch and live sandbox demo.', url: `${BASE_URL}/`, scrollAnchor: null },
  { slug: '02-landing-features', title: 'Feature Grid', detail: 'Six-module feature matrix: ATS Engine, Recruiter Vision, Gemini AI, FAANG presets, local privacy, serverless PDF.', url: `${BASE_URL}/`, scrollAnchor: '#features' },
  { slug: '03-landing-recruiter-sim', title: 'Recruiter Vision Simulator', detail: 'Eye-fixation heatmap explainer illustrating the 6-second recruiter scan optimisation.', url: `${BASE_URL}/`, scrollAnchor: '#recruiter-sim' },
  { slug: '04-landing-pricing', title: 'Pricing Tiers', detail: 'Transparent SaaS tier architectures: Free Core, Pro AI ($9/mo), Enterprise ($29/mo).', url: `${BASE_URL}/`, scrollAnchor: '#pricing' },
  { slug: '05-builder-workspace', title: 'Resume Workspace', detail: 'Dual-pane ATS editor with live A4 preview, score gauge, template picker, and revision history.', url: `${BASE_URL}/builder`, scrollAnchor: null },
  { slug: '06-builder-preview-panel', title: 'A4 Preview & ATS Feedback', detail: 'Pixel-perfect A4 preview with recruiter heatmap overlay and AI ATS feedback widget docked below.', url: `${BASE_URL}/builder`, scrollAnchor: '#preview-workspace-parent' },
];

const wait = (ms) => new Promise(r => setTimeout(r, ms));
const ensureDir = (dir) => { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); };
const cleanFile = (fp) => { if (fs.existsSync(fp)) fs.unlinkSync(fp); };

async function gotoStable(page, url, extraMs = 1200) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await wait(extraMs);
}

async function scrollToAnchor(page, anchor) {
  if (!anchor) return;
  const selector = anchor.startsWith('#') ? anchor : `[id="${anchor.replace('#', '')}"]`;
  const found = await page.locator(selector).first().isVisible().catch(() => false);
  if (found) {
    await page.locator(selector).first().scrollIntoViewIfNeeded();
  } else {
    await page.evaluate((h) => { const el = document.querySelector(h); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, anchor);
  }
  await wait(600);
}

async function injectOverlay(page) {
  await page.evaluate(() => {
    if (document.getElementById('__ag-overlay')) return;
    const el = document.createElement('div');
    el.id = '__ag-overlay';
    el.style.cssText = 'position:fixed;inset:0;z-index:2147483647;background:#05060b;opacity:1;pointer-events:none;transition:opacity 0.85s cubic-bezier(0.25,1,0.5,1)';
    document.documentElement.appendChild(el);
  });
}

async function fadeIn(page) {
  await injectOverlay(page);
  await page.evaluate(() => { const el = document.getElementById('__ag-overlay'); if (el) { void el.offsetWidth; el.style.opacity = '0'; } });
  await wait(950);
}

async function fadeOut(page) {
  await page.evaluate(() => {
    let el = document.getElementById('__ag-overlay');
    if (!el) { el = document.createElement('div'); el.id = '__ag-overlay'; el.style.cssText = 'position:fixed;inset:0;z-index:2147483647;background:#05060b;opacity:0;pointer-events:none;transition:opacity 0.65s cubic-bezier(0.25,1,0.5,1)'; document.documentElement.appendChild(el); }
    void el.offsetWidth; el.style.opacity = '1';
  });
  await wait(750);
}

async function captureViewport(page, filePath) {
  await page.screenshot({ path: filePath, fullPage: false, animations: 'disabled' });
}

async function scrollPass(page) {
  const landmarks = await page.locator('header, section, main, footer').all();
  if (landmarks.length > 0) {
    for (const lm of landmarks) { await lm.scrollIntoViewIfNeeded().catch(() => { }); await wait(380); }
  } else {
    const h = await page.evaluate(() => document.body.scrollHeight);
    for (let s = 0; s <= 3; s++) { await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'smooth' }), (h / 3) * s); await wait(500); }
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await wait(900);
}

function buildReportHtml(shots) {
  const total = shots.length + 1;
  const slides = shots.map((s, idx) => `
    <div class="pdf-page">
      <div class="page-header">
        <div class="header-brand"><span class="header-logo">R</span><div><h1>ResumeBuilder Pro</h1><p class="header-subtitle">Enterprise Platform Showcase</p></div></div>
        <div class="header-layer"><span class="layer-label">Layer ${String(idx + 1).padStart(2, '0')}</span><span class="layer-title">${s.title}</span></div>
      </div>
      <section class="slide-card">
        <div class="img-wrapper"><img src="./screenshots/${s.file}" alt="${s.title}" /></div>
        <div class="slide-info">
          <h2>${s.title}</h2><p>${s.detail}</p>
          <div class="slide-pills">
            <span class="pill pill-blue">Next.js 14</span><span class="pill pill-purple">React 18</span>
            <span class="pill pill-indigo">TypeScript</span><span class="pill pill-green">Zustand</span>
            <span class="pill pill-orange">Tailwind CSS</span>
          </div>
        </div>
      </section>
      <div class="page-footer"><span>Confidential Technical Showcase &middot; ResumeBuilder Pro</span><span>Page ${idx + 1} of ${total}</span></div>
    </div>`).join('');

  const execPage = `
    <div class="pdf-page exec-page">
      <div class="page-header">
        <div class="header-brand"><span class="header-logo">R</span><div><h1>ResumeBuilder Pro</h1><p class="header-subtitle">Enterprise Platform Showcase</p></div></div>
        <div class="header-layer"><span class="layer-label">Layer ${String(total).padStart(2, '0')}</span><span class="layer-title">Architect Overview</span></div>
      </div>
      <div class="exec-body">
        <div class="exec-lead">
          <p>I help startups, businesses, and founders build <strong>scalable SaaS platforms</strong>, AI-powered applications, enterprise software, and modern web products — shipped at production quality from day one.</p>
          <p>With <strong>3+ years</strong> as a Full Stack Software Engineer, I specialise in React, Next.js, Angular, TypeScript, Node.js, NestJS, PostgreSQL, MongoDB, and modern cloud technologies.</p>
        </div>
        <div class="exec-grid">
          <div class="exec-col">
            <h3>Core Expertise</h3>
            <ul class="check-list">
              <li>Full Stack Development (React, Next.js, Node.js, NestJS)</li>
              <li>SaaS Product Development &amp; Multi-Tenant Architecture</li>
              <li>AI Applications, LLM Integrations &amp; RAG Systems</li>
              <li>Enterprise Software &amp; Business Platforms</li>
              <li>REST APIs, WebSockets &amp; Backend Engineering</li>
              <li>PostgreSQL, MongoDB, Prisma &amp; Database Design</li>
              <li>Workflow Automation &amp; Business Process Solutions</li>
              <li>Performance Optimisation &amp; Scalable Architecture</li>
            </ul>
          </div>
          <div class="exec-col">
            <h3>ResumeBuilder Pro Feature Highlights</h3>
            <ul class="bullet-list">
              <li>Dual-pane live editor with ATS score engine and real-time feedback</li>
              <li>Recruiter heatmap visualisation for 6-second scan optimisation</li>
              <li>Gemini AI bullet enhancement via STAR methodology</li>
              <li>Four FAANG-grade resume templates with instant switching</li>
              <li>Client-side PDF export with server-side Puppeteer fallback</li>
              <li>Multi-workspace support and local version snapshots</li>
              <li>PDF/DOCX/TXT upload and auto-population into the editor</li>
            </ul>
          </div>
        </div>
        <div class="exec-closing">Whether you need an MVP, SaaS platform, AI-powered product, CRM, internal business tool, or a complete full-stack application — I can help turn your idea into a secure, scalable, production-ready solution.</div>
      </div>
      <div class="page-footer"><span>Confidential Technical Showcase &middot; ResumeBuilder Pro</span><span>Page ${total} of ${total}</span></div>
    </div>`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>ResumeBuilder Pro - Enterprise Showcase</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');
@page{size:A4 landscape;margin:0}
*,*::before,*::after{box-sizing:border-box}
body{font-family:'Inter',system-ui,sans-serif;margin:0;background:#08090f;color:#F8FAFC;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}
.pdf-page{width:297mm;min-height:210mm;max-height:210mm;padding:12mm 18mm;display:flex;flex-direction:column;page-break-after:always;break-after:page;overflow:hidden;position:relative;background:#08090f;background-image:radial-gradient(at 0% 0%,rgba(99,102,241,.09) 0px,transparent 55%),radial-gradient(at 100% 0%,rgba(167,139,250,.07) 0px,transparent 55%),radial-gradient(at 50% 100%,rgba(56,189,248,.05) 0px,transparent 55%)}
.page-header{display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,.07);padding-bottom:8px;margin-bottom:12px;flex-shrink:0}
.header-brand{display:flex;align-items:center;gap:10px}
.header-logo{width:34px;height:34px;border-radius:10px;background:linear-gradient(135deg,#6366f1,#8b5cf6,#ec4899);text-align:center;line-height:34px;font-weight:900;font-size:16px;color:#fff;flex-shrink:0}
.page-header h1{margin:0;font-size:17px;font-weight:900;letter-spacing:-.03em;background:linear-gradient(90deg,#a78bfa,#38bdf8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.header-subtitle{margin:0;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#64748b}
.header-layer{text-align:right}
.layer-label{display:block;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:#38bdf8}
.layer-title{font-size:11px;font-weight:700;color:#94a3b8}
.slide-card{flex:1;background:rgba(30,41,59,.28);border:1px solid rgba(255,255,255,.07);border-radius:14px;padding:14px;display:grid;grid-template-columns:1fr auto;gap:16px;align-items:start;overflow:hidden;box-shadow:0 24px 48px -12px rgba(0,0,0,.65)}
.img-wrapper{border-radius:8px;overflow:hidden;border:1px solid rgba(0,0,0,.5);background:#020617;aspect-ratio:16/9}
.img-wrapper img{width:100%;height:100%;object-fit:cover;object-position:top;display:block}
.slide-info{width:220px;flex-shrink:0;padding-top:4px}
.slide-info h2{margin:0 0 6px;font-size:15px;font-weight:800;color:#f1f5f9;line-height:1.2}
.slide-info p{margin:0 0 12px;font-size:11px;line-height:1.55;color:#94a3b8}
.slide-pills{display:flex;flex-wrap:wrap;gap:5px}
.pill{padding:2px 8px;border-radius:999px;font-size:9px;font-weight:700;letter-spacing:.04em;text-transform:uppercase}
.pill-blue{background:rgba(56,189,248,.12);color:#38bdf8;border:1px solid rgba(56,189,248,.25)}
.pill-purple{background:rgba(167,139,250,.12);color:#a78bfa;border:1px solid rgba(167,139,250,.25)}
.pill-indigo{background:rgba(99,102,241,.12);color:#818cf8;border:1px solid rgba(99,102,241,.25)}
.pill-green{background:rgba(16,185,129,.12);color:#34d399;border:1px solid rgba(16,185,129,.25)}
.pill-orange{background:rgba(251,146,60,.12);color:#fb923c;border:1px solid rgba(251,146,60,.25)}
.page-footer{display:flex;justify-content:space-between;align-items:center;border-top:1px solid rgba(255,255,255,.06);padding-top:7px;margin-top:10px;font-size:10px;color:#475569;flex-shrink:0}
.exec-body{flex:1;display:flex;flex-direction:column;gap:14px;overflow:hidden}
.exec-lead p{margin:0 0 8px;font-size:12.5px;line-height:1.58;color:#cbd5e1}
.exec-lead strong{color:#f8fafc}
.exec-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;background:rgba(15,23,42,.6);border:1px solid rgba(255,255,255,.07);border-radius:10px;padding:16px 18px}
.exec-col h3{margin:0 0 10px;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:#38bdf8}
.check-list,.bullet-list{list-style:none;padding:0;margin:0}
.check-list li,.bullet-list li{font-size:11px;color:#94a3b8;margin-bottom:7px;line-height:1.4;padding-left:16px;position:relative}
.check-list li::before{content:'✔';position:absolute;left:0;color:#10b981;font-size:10px;font-weight:700}
.bullet-list li::before{content:'•';position:absolute;left:0;color:#a78bfa;font-size:14px;line-height:.85}
.exec-closing{background:linear-gradient(90deg,rgba(56,189,248,.08),rgba(167,139,250,.08));border-left:3px solid #38bdf8;padding:12px 14px;font-size:12px;font-weight:500;color:#e2e8f0;line-height:1.6;border-radius:0 8px 8px 0}
</style>
</head>
<body>
${slides}
${execPage}
</body>
</html>`;
}

async function main() {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║      RESUMEBUILDER PRO - ENTERPRISE ASSET PIPELINE       ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  ensureDir(screenshotsDir);
  ensureDir(artifactsDir);
  ensureDir(videoTempDir);
  cleanFile(finalVideoPath);
  cleanFile(reportPdfPath);
  cleanFile(reportHtmlPath);

  console.log('Launching Chromium...');
  const browser = await chromium.launch({ headless: true });

  const videoContext = await browser.newContext({
    viewport: { width: 1366, height: 768 },
    deviceScaleFactor: 1.5,
    recordVideo: { dir: videoTempDir, size: { width: 1366, height: 768 } },
  });

  const page = await videoContext.newPage();
  const video = page.video();
  const shots = [];

  console.log(`\nRecording ${CAPTURE_TARGETS.length} capture targets...\n`);

  for (let i = 0; i < CAPTURE_TARGETS.length; i++) {
    const target = CAPTURE_TARGETS[i];
    const isFirst = i === 0;
    console.log(`  [${String(i + 1).padStart(2, '0')}/${CAPTURE_TARGETS.length}] ${target.title}`);

    const currentBase = page.url().split('#')[0];
    const targetBase = target.url.split('#')[0];

    if (isFirst || currentBase !== targetBase) {
      if (!isFirst) await fadeOut(page);
      await gotoStable(page, target.url, 1400);
      await injectOverlay(page);
    }

    if (target.scrollAnchor) {
      await scrollToAnchor(page, target.scrollAnchor);
    } else {
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
      await wait(400);
    }

    await fadeIn(page);

    const file = `${target.slug}.png`;
    const filePath = path.join(screenshotsDir, file);
    await captureViewport(page, filePath);
    console.log(`     Screenshot saved: ${file}`);

    await scrollPass(page);
    shots.push({ ...target, file });

    if (i < CAPTURE_TARGETS.length - 1) await fadeOut(page);
  }

  await fadeOut(page);
  await wait(400);
  await videoContext.close();

  const rawVideo = await video.path();
  if (rawVideo && fs.existsSync(rawVideo)) {
    fs.copyFileSync(rawVideo, finalVideoPath);
    console.log(`\nVideo saved: ${finalVideoPath}`);
  } else {
    console.warn('\nWarning: Video file not found.');
  }

  if (fs.existsSync(videoTempDir)) fs.rmSync(videoTempDir, { recursive: true, force: true });

  console.log('\nGenerating executive PDF report...');
  const html = buildReportHtml(shots);
  fs.writeFileSync(reportHtmlPath, html, 'utf8');

  const pdfContext = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const pdfPage = await pdfContext.newPage();
  const fileUrl = `file:///${reportHtmlPath.replace(/\\/g, '/')}`;

  await pdfPage.goto(fileUrl, { waitUntil: 'networkidle', timeout: 30000 });

  await pdfPage.evaluate(async () => {
    await document.fonts.ready;
    const imgs = Array.from(document.querySelectorAll('img'));
    await Promise.all(imgs.map(img => {
      if (img.complete && img.naturalHeight > 0) return img.decode ? img.decode().catch(() => { }) : Promise.resolve();
      return new Promise(resolve => {
        img.addEventListener('load', resolve, { once: true });
        img.addEventListener('error', resolve, { once: true });
      });
    }));
  });

  await pdfPage.pdf({
    path: reportPdfPath,
    format: 'A4',
    landscape: true,
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
    preferCSSPageSize: true,
  });

  await pdfContext.close();
  await browser.close();

  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║        ENTERPRISE ASSETS GENERATED SUCCESSFULLY          ║');
  console.log('╠══════════════════════════════════════════════════════════╣');
  console.log(`  Video       -> output/artifacts/ENTERPRISE_DEMO_VIDEO.mp4`);
  console.log(`  PDF         -> output/artifacts/ENTERPRISE_DEMO_REPORT.pdf`);
  console.log(`  Screenshots -> output/screenshots/ (${shots.length} files)`);
  console.log('╚══════════════════════════════════════════════════════════╝\n');
}

main().catch(err => { console.error('\nPipeline failed:', err.message || err); process.exit(1); });
