export function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const getLinkedinDisplay = (url: string) => {
  if (!url) return '';
  let clean = url.trim();
  clean = clean.replace(/^https?:\/\//i, '');
  clean = clean.replace(/^www\./i, '');
  clean = clean.replace(/^linkedin\.com\/in\//i, '').replace(/^linkedin\.com\//i, '');
  return clean.split('?')[0].replace(/\/+$/, '');
};

const getGithubDisplay = (url: string) => {
  if (!url) return '';
  let clean = url.trim();
  clean = clean.replace(/^https?:\/\//i, '');
  clean = clean.replace(/^www\./i, '');
  clean = clean.replace(/^github\.com\//i, '');
  return clean.split('?')[0].replace(/\/+$/, '');
};

const getWebsiteDisplay = (url: string) => {
  if (!url) return '';
  let clean = url.trim();
  clean = clean.replace(/^https?:\/\//i, '');
  clean = clean.replace(/^www\./i, '');
  return clean.split('?')[0].replace(/\/+$/, '');
};

export const pageStyle = `
  * {
    box-sizing: border-box;
  }

  @page {
    size: A4;
    margin: 8mm 10mm 8mm 10mm;
  }

  html, body {
    margin: 0;
    padding: 0;
    background: #ffffff;
    color: #111111;
    font-family: Georgia, "Times New Roman", Times, serif;
    -webkit-font-smoothing: antialiased;
  }

  body {
    padding: 0;
  }

  .resume-container {
    width: 100%;
    margin: 0 auto;
    background: #ffffff;
    padding: 0;
  }

  .header {
    text-align: center;
    margin-bottom: 10px;
    padding-bottom: 0px;
  }

  .header h1 {
    font-size: 26px;
    font-weight: 700;
    margin: 0 0 3px;
    color: #111111;
    line-height: 1.1;
  }

  .header .headline {
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #4b5563;
    margin: 0 0 6px;
  }

  .header .contact-row {
    margin: 0;
    color: #111111;
    font-size: 10.5px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
  }

  .header .contact-row a {
    color: #111111;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
  }

  .header .contact-row a:hover {
    text-decoration: underline;
  }

  .section-title {
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #111111;
    margin-top: 14px;
    margin-bottom: 5px;
    padding-bottom: 2px;
    border-bottom: 1px solid #111111;
  }

  .section-block {
    margin-bottom: 7px;
  }

  .item-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 2px;
  }

  .item-left {
    font-size: 12px;
    color: #111111;
    line-height: 1.4;
  }

  .item-left .bold {
    font-weight: 700;
  }

  .item-left .italic {
    font-style: italic;
  }

  .item-right {
    font-size: 11.5px;
    font-weight: 700;
    color: #111111;
    white-space: nowrap;
  }

  .skills-row {
    font-size: 11px;
    line-height: 1.5;
    color: #222222;
    margin-bottom: 5px;
  }

  .skills-row .bold {
    font-weight: 700;
    color: #111111;
  }

  ul {
    margin: 4px 0 0 16px;
    padding: 0;
    list-style-type: disc;
  }

  li {
    font-size: 11px;
    line-height: 1.5;
    color: #222222;
    margin-bottom: 2.5px;
    display: list-item;
  }

  a {
    color: #111111;
    text-decoration: none;
  }

  .link-icon {
    width: 8px;
    height: 8px;
    display: inline-block;
    color: #2563eb;
    margin-left: 2px;
    vertical-align: middle;
  }

  @media print {
    html, body {
      background: #ffffff;
    }

    body {
      padding: 0 !important;
      margin: 0 !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .resume-container {
      box-shadow: none;
      border-radius: 0;
      padding: 0 !important;
      max-width: 100% !important;
      width: 100% !important;
    }
  }
`;

const linkIconSvg = `
  <svg class="link-icon" stroke="currentColor" fill="none" stroke-width="3.5" viewBox="0 0 24 24">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15 3 21 3 21 9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  </svg>
`;

const locationSvg = `<svg stroke="#111111" fill="none" stroke-width="2.5" viewBox="0 0 24 24" style="width: 11px; height: 11px; display: inline-block; vertical-align: middle; margin-right: 3px;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>`;
const phoneSvg = `<svg stroke="#111111" fill="none" stroke-width="2.5" viewBox="0 0 24 24" style="width: 11px; height: 11px; display: inline-block; vertical-align: middle; margin-right: 3px;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>`;
const emailSvg = `<svg stroke="#111111" fill="none" stroke-width="2.5" viewBox="0 0 24 24" style="width: 11px; height: 11px; display: inline-block; vertical-align: middle; margin-right: 3px;"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>`;
const linkedinSvg = `<svg fill="#111111" viewBox="0 0 24 24" style="width: 11px; height: 11px; display: inline-block; vertical-align: middle; margin-right: 3px;"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>`;
const githubSvg = `<svg fill="#111111" viewBox="0 0 24 24" style="width: 11px; height: 11px; display: inline-block; vertical-align: middle; margin-right: 3px;"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>`;
const websiteSvg = `<svg stroke="#111111" fill="none" stroke-width="2.5" viewBox="0 0 24 24" style="width: 11px; height: 11px; display: inline-block; vertical-align: middle; margin-right: 3px;"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>`;

function renderResumeBodyHTML(resume: any) {
  const basics = resume.basics || {};
  const sections = resume.sections || {};

  const summaryHTML = escapeHtml(sections.summary?.content || '');

  // Render contact info with links
  const contactParts: string[] = [];
  if (basics.location) {
    contactParts.push(`<span style="display: inline-flex; align-items: center;">${locationSvg}<span>${escapeHtml(basics.location)}</span></span>`);
  }
  if (basics.phone) {
    contactParts.push(`<a href="tel:${escapeHtml(basics.phone)}" style="display: inline-flex; align-items: center;">${phoneSvg}<span>${escapeHtml(basics.phone)}</span></a>`);
  }
  if (basics.email) {
    contactParts.push(`<a href="mailto:${escapeHtml(basics.email)}" style="display: inline-flex; align-items: center;">${emailSvg}<span>${escapeHtml(basics.email)}</span></a>`);
  }
  if (basics.linkedin) {
    contactParts.push(`<a href="${escapeHtml(basics.linkedin)}" target="_blank" style="display: inline-flex; align-items: center;">${linkedinSvg}<span>${escapeHtml(getLinkedinDisplay(basics.linkedin))}</span></a>`);
  }
  if (basics.github) {
    contactParts.push(`<a href="${escapeHtml(basics.github)}" target="_blank" style="display: inline-flex; align-items: center;">${githubSvg}<span>${escapeHtml(getGithubDisplay(basics.github))}</span></a>`);
  }
  if (basics.url?.href) {
    contactParts.push(`<a href="${escapeHtml(basics.url.href)}" target="_blank" style="display: inline-flex; align-items: center;">${websiteSvg}<span>${escapeHtml(getWebsiteDisplay(basics.url.href))}</span></a>`);
  }
  const contactRowHTML = contactParts.join(' <span style="color: #9ca3af; margin: 0 2px;">|</span> ');

  // Coursework fallback logic (comma separated courses for education index 0)
  const globalCourseworkNames = (sections.relevantCoursework?.items || []).map((i: any) => escapeHtml(i.name)).join(', ');

  // Render education
  const educationHTML = (sections.education?.items || [])
    .map((item: any, index: number) => {
      const courseText = item.coursework || (index === 0 ? globalCourseworkNames : '');
      return `
        <div class="section-block">
          <div class="item-row">
            <div class="item-left"><span class="bold">${escapeHtml(item.institution)}</span></div>
            <div class="item-right">${escapeHtml(item.startDate)} – ${escapeHtml(item.endDate)}</div>
          </div>
          <div class="item-row">
            <div class="item-left"><span class="italic">${escapeHtml(item.studyType)}</span></div>
            ${item.location ? `<div class="item-right" style="font-weight: normal; font-style: italic;">${escapeHtml(item.location)}</div>` : ''}
          </div>
          ${courseText ? `
            <div style="font-size: 9px; color: #222222; margin-top: 2px;">
              <span style="font-weight: 600; color: #111111;">Coursework: </span>${escapeHtml(courseText)}
            </div>
          ` : ''}
        </div>
      `;
    })
    .join('');

  // Render skills
  const skillsHTML = (sections.skills?.items || [])
    .map((skill: any) => `
      <div class="skills-row">
        <span class="bold">${escapeHtml(skill.name)}:</span> ${escapeHtml((skill.keywords || []).join(', '))}
      </div>
    `)
    .join('');

  // Render experience
  const experienceHTML = (sections.experience?.items || [])
    .map((item: any) => {
      const summaryMarkup = item.summary || '';
      
      const companyMarkup = item.companyUrl 
        ? `<a href="${escapeHtml(item.companyUrl)}" target="_blank" style="font-weight: bold; color: #111111;">${escapeHtml(item.company)}${linkIconSvg}</a>`
        : `<span class="bold">${escapeHtml(item.company)}</span>`;

      return `
        <div class="section-block">
          <div class="item-row">
            <div class="item-left">
              ${companyMarkup}
              ${item.title ? `<span class="italic" style="font-weight: normal; color: #444444;"> | ${escapeHtml(item.title)}</span>` : ''}
              ${item.location ? `<span style="font-weight: normal; color: #777777;"> | ${escapeHtml(item.location)}</span>` : ''}
            </div>
            <div class="item-right">${escapeHtml(item.startDate)} – ${escapeHtml(item.endDate)}</div>
          </div>
          <div style="margin-top: 2px;">
            ${summaryMarkup}
          </div>
        </div>
      `;
    })
    .join('');

  // Render projects
  const projectsHTML = (sections.projects?.items || [])
    .map((project: any) => {
      const isHtml = project.description.includes('<li') || project.description.includes('<ul');
      const sentences = isHtml 
        ? [] 
        : project.description
            .split(/\.(?=\s|[A-Z]|$)/)
            .map((s: string) => s.trim())
            .filter((s: string) => s.length > 0);

      const primaryUrl = project.projectUrl || project.githubUrl;

      const nameMarkup = primaryUrl
        ? `<a href="${escapeHtml(primaryUrl)}" target="_blank" style="font-weight: bold; color: #111111;">${escapeHtml(project.name)}${linkIconSvg}</a>`
        : `<span class="bold">${escapeHtml(project.name)}</span>`;

      const techMarkup = project.technologies
        ? ` | <span class="italic">${escapeHtml(project.technologies)}</span>`
        : '';

      const descMarkup = isHtml
        ? project.description
        : `<ul>${sentences.map((s: string) => `<li>${escapeHtml(s)}.</li>`).join('')}</ul>`;

      return `
        <div class="section-block">
          <div class="item-row">
            <div class="item-left">${nameMarkup}${techMarkup}</div>
            <div class="item-right">${escapeHtml(project.date || '')}</div>
          </div>
          <div style="margin-top: 2px;">
            ${descMarkup}
          </div>
        </div>
      `;
    })
    .join('');

  // Render combined Leadership & Awards
  const certificationsItems = (sections.certifications?.items || []);
  const achievementsItems = (sections.achievements?.items || []);
  
  const getAchievementText = (ach: any) => {
    const parts = [ach.title];
    if (ach.subtitle) parts.push(ach.subtitle);
    let dateStr = '';
    if (ach.startDate) {
      dateStr = ach.startDate;
      if (ach.endDate) dateStr += ` – ${ach.endDate}`;
    }
    const baseText = parts.join(' | ');
    return dateStr ? `${baseText} (${dateStr})` : baseText;
  };

  const leadershipHTML = (certificationsItems.length > 0 || achievementsItems.length > 0)
    ? `
      <div class="section-block">
        <div class="section-title">Leadership & Awards</div>
        <ul>
          ${achievementsItems.map((ach: any) => `<li>${escapeHtml(getAchievementText(ach))}</li>`).join('')}
          ${certificationsItems.map((cert: any) => `<li>${escapeHtml(cert.name)}</li>`).join('')}
        </ul>
      </div>
    `
    : '';

  return `
    <div class="header">
      <h1>${escapeHtml(basics.name)}</h1>
      ${basics.headline ? `<p class="headline">${escapeHtml(basics.headline)}</p>` : ''}
      <p class="contact-row">${contactRowHTML}</p>
    </div>

    ${summaryHTML ? `
    <div class="section-block">
      <div class="section-title">Summary</div>
      <p style="font-size: 11px; line-height: 1.5; color: #222222; margin: 0;">${summaryHTML.replace(/\n/g, '<br/>')}</p>
    </div>
    ` : ''}

    ${educationHTML ? `
    <div class="section-block">
      <div class="section-title">Education</div>
      ${educationHTML}
    </div>
    ` : ''}

    ${skillsHTML ? `
    <div class="section-block">
      <div class="section-title">Skills</div>
      ${skillsHTML}
    </div>
    ` : ''}

    ${experienceHTML ? `
    <div class="section-block">
      <div class="section-title">Experience</div>
      ${experienceHTML}
    </div>
    ` : ''}

    ${projectsHTML ? `
    <div class="section-block">
      <div class="section-title">Projects</div>
      ${projectsHTML}
    </div>
    ` : ''}

    ${leadershipHTML}
  `;
}


// ─── Template-specific CSS overrides ─────────────────────────────────────────
const modernPageStyle = `
  html, body {
    font-family: "Inter", "Segoe UI", "Helvetica Neue", Arial, sans-serif !important;
    color: #1e1b4b;
  }
  .resume-container { background: #ffffff; }
  .header { border-bottom: 3px solid #4f46e5; padding-bottom: 8px; margin-bottom: 10px; }
  .header h1 { font-family: "Inter", "Segoe UI", sans-serif; color: #0f172a; font-size: 26px; }
  .header .headline { color: #4f46e5; }
  .header .contact-row { color: #475569; }
  .header .contact-row a { color: #4f46e5; }
  .section-title {
    font-family: "Inter", "Segoe UI", sans-serif;
    font-size: 11px;
    color: #4f46e5;
    border-bottom: 2px solid #4f46e5;
    letter-spacing: 0.12em;
    margin-top: 14px;
    margin-bottom: 5px;
  }
  .item-left { font-family: "Inter", "Segoe UI", sans-serif; color: #0f172a; }
  .item-right { font-family: "Inter", "Segoe UI", sans-serif; color: #64748b; font-weight: 600; }
  .skills-row { font-family: "Inter", "Segoe UI", sans-serif; color: #374151; }
  li { font-family: "Inter", "Segoe UI", sans-serif; color: #374151; }
`;

const executivePageStyle = `
  html, body { font-family: Georgia, "Times New Roman", serif; color: #2d2d2d; }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 1.5px double #6b21a8;
    padding-bottom: 8px;
    margin-bottom: 10px;
    text-align: left;
  }
  .header h1 { font-size: 26px; color: #1a0a2e; letter-spacing: -0.01em; text-align: left; margin-bottom: 3px; }
  .header .headline { color: #3b0764; letter-spacing: 0.04em; text-align: left; }
  .header-left { flex: 1; padding-right: 16px; }
  .header-right { display: flex; flex-direction: column; align-items: flex-end; gap: 3px; font-size: 10px; color: #6b7280; }
  .header-right a { color: #3b0764; text-decoration: none; display: inline-flex; align-items: center; }
  .contact-row { display: none; }
  .section-title {
    color: #3b0764;
    font-size: 10.5px;
    border-bottom: none;
    text-align: center;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 14px;
    margin-bottom: 5px;
  }
  .section-title::before, .section-title::after {
    content: "";
    flex: 1;
    height: 1px;
    background: #d1d5db;
  }
  .item-right { font-style: italic; font-weight: normal; color: #6b7280; }
`;

// ─── Vercel: ultra-minimal monochrome (Inter, heavy whitespace) ──────────────
const vercelPageStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  html, body {
    font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif !important;
    color: #171717;
    background: #fafafa;
  }
  .resume-container { background: #fafafa; }
  .header {
    border-bottom: 1px solid #e5e5e5;
    padding-bottom: 10px;
    margin-bottom: 12px;
  }
  .header h1 {
    font-family: 'Inter', sans-serif;
    font-size: 24px;
    font-weight: 700;
    color: #000000;
    letter-spacing: -0.03em;
    margin-bottom: 2px;
  }
  .header .headline {
    font-size: 11px;
    font-weight: 500;
    text-transform: none;
    letter-spacing: 0;
    color: #525252;
  }
  .header .contact-row { color: #737373; font-size: 10px; }
  .header .contact-row a { color: #000000; }
  .section-title {
    font-family: 'Inter', sans-serif;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #000000;
    border-bottom: 1px solid #000000;
    margin-top: 16px;
    margin-bottom: 6px;
  }
  .item-left { font-family: 'Inter', sans-serif; color: #171717; }
  .item-left .bold { font-weight: 600; }
  .item-right { font-family: 'Inter', sans-serif; color: #737373; font-weight: 400; font-size: 10px; }
  .skills-row { font-family: 'Inter', sans-serif; color: #404040; font-size: 10.5px; }
  li { font-family: 'Inter', sans-serif; color: #404040; font-size: 10.5px; }
`;

// ─── Linear: high-tech indigo accents, ultra-clean ────────────────────────────
const linearPageStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  html, body {
    font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif !important;
    color: #0f172a;
  }
  .resume-container { background: #ffffff; }
  .header {
    background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%);
    border-bottom: 2px solid #6366f1;
    padding: 12px 0 10px;
    margin-bottom: 12px;
  }
  .header h1 {
    font-size: 25px;
    font-weight: 700;
    color: #0f172a;
    letter-spacing: -0.02em;
  }
  .header .headline {
    font-size: 11px;
    font-weight: 500;
    text-transform: none;
    letter-spacing: 0.01em;
    color: #6366f1;
  }
  .header .contact-row { color: #475569; font-size: 10px; }
  .header .contact-row a { color: #6366f1; }
  .section-title {
    font-family: 'Inter', sans-serif;
    font-size: 10.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #6366f1;
    border-bottom: 1.5px solid #c7d2fe;
    padding-bottom: 2px;
    margin-top: 14px;
    margin-bottom: 5px;
  }
  .item-left { font-family: 'Inter', sans-serif; color: #0f172a; }
  .item-left .bold { font-weight: 600; color: #1e293b; }
  .item-right { font-family: 'Inter', sans-serif; color: #6366f1; font-weight: 500; font-size: 10px; }
  .skills-row { font-family: 'Inter', sans-serif; color: #334155; }
  li { font-family: 'Inter', sans-serif; color: #334155; font-size: 10.5px; }
`;

// ─── Stripe: elegant dual-column (left 30% sidebar, right 70% main) ─────────
const stripePageStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  html, body {
    font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif !important;
    color: #0f172a;
    background: #f8fafc;
  }
  .resume-container { background: #f8fafc; }
  .header {
    background: #0f172a;
    color: #ffffff;
    padding: 16px 14px;
    margin-bottom: 0;
    border-bottom: 3px solid #0ea5e9;
  }
  .header h1 { font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: -0.02em; margin-bottom: 2px; }
  .header .headline { font-size: 11px; color: #7dd3fc; font-weight: 400; text-transform: none; letter-spacing: 0; }
  .header .contact-row { color: #94a3b8; font-size: 9.5px; }
  .header .contact-row a { color: #38bdf8; }
  .section-title {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #0ea5e9;
    border-bottom: 1.5px solid #e0f2fe;
    margin-top: 12px;
    margin-bottom: 5px;
  }
  .item-left .bold { font-weight: 600; color: #0f172a; }
  .item-right { color: #0ea5e9; font-size: 10px; font-weight: 500; }
  li { color: #334155; font-size: 10.5px; }
`;

// ─── Notion: clean blocky serif layout ────────────────────────────────────────
const notionPageStyle = `
  html, body {
    font-family: Georgia, 'Times New Roman', serif;
    color: #111827;
    background: #f9fafb;
  }
  .resume-container { background: #f9fafb; }
  .header {
    border-bottom: none;
    margin-bottom: 4px;
    padding-bottom: 6px;
    border-left: 4px solid #374151;
    padding-left: 12px;
  }
  .header h1 { font-size: 24px; font-weight: 700; color: #111827; letter-spacing: -0.01em; }
  .header .headline { font-family: Georgia, serif; font-size: 12px; color: #6b7280; font-weight: normal; font-style: italic; text-transform: none; letter-spacing: 0; }
  .header .contact-row { color: #6b7280; font-size: 10px; }
  .header .contact-row a { color: #374151; }
  .section-title {
    font-family: Georgia, serif;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #111827;
    border-bottom: none;
    background: #f3f4f6;
    padding: 3px 6px;
    margin-top: 14px;
    margin-bottom: 5px;
  }
  .item-left .bold { font-weight: 700; color: #111827; }
  .item-left .italic { color: #6b7280; }
  .item-right { color: #9ca3af; font-weight: normal; font-style: italic; font-size: 10.5px; }
  li { color: #374151; font-size: 10.5px; }
  .skills-row { color: #374151; }
`;

function renderExecutiveHeader(basics: any): string {
  const contactParts: string[] = [];
  if (basics.location) contactParts.push(`<span style="display:inline-flex;align-items:center;">${locationSvg}<span>${escapeHtml(basics.location)}</span></span>`);
  if (basics.phone)    contactParts.push(`<a href="tel:${escapeHtml(basics.phone)}" style="display:inline-flex;align-items:center;">${phoneSvg}<span>${escapeHtml(basics.phone)}</span></a>`);
  if (basics.email)    contactParts.push(`<a href="mailto:${escapeHtml(basics.email)}" style="display:inline-flex;align-items:center;">${emailSvg}<span>${escapeHtml(basics.email)}</span></a>`);
  if (basics.linkedin) contactParts.push(`<a href="${escapeHtml(basics.linkedin)}" style="display:inline-flex;align-items:center;">${linkedinSvg}<span>${escapeHtml(getLinkedinDisplay(basics.linkedin))}</span></a>`);
  if (basics.github)   contactParts.push(`<a href="${escapeHtml(basics.github)}" style="display:inline-flex;align-items:center;">${githubSvg}<span>${escapeHtml(getGithubDisplay(basics.github))}</span></a>`);
  if (basics.url?.href) contactParts.push(`<a href="${escapeHtml(basics.url.href)}" style="display:inline-flex;align-items:center;">${websiteSvg}<span>${escapeHtml(getWebsiteDisplay(basics.url.href))}</span></a>`);
  return `
    <div class="header" style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:1.5px double #6b21a8;padding-bottom:8px;margin-bottom:10px;text-align:left;">
      <div style="flex:1;padding-right:16px;">
        <h1 style="font-size:26px;font-weight:700;color:#1a0a2e;letter-spacing:-0.01em;line-height:1.1;margin:0 0 3px;">${escapeHtml(basics.name)}</h1>
        ${basics.headline ? `<div style="font-size:11.5px;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;color:#3b0764;">${escapeHtml(basics.headline)}</div>` : ''}
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:3px;font-size:10px;color:#6b7280;flex-shrink:0;">
        ${contactParts.join('')}
      </div>
    </div>`;
}

export function renderResumeHTML(resume: any, templateId: string = 'classic') {
  const basics = resume.basics || {};
  let extraStyle = '';
  let headerHTML = '';

  if (templateId === 'modern') {
    extraStyle = modernPageStyle;
    // Standard centered header with modern overrides
    const contactParts: string[] = [];
    if (basics.location) contactParts.push(`<span style="display:inline-flex;align-items:center;">${locationSvg}<span>${escapeHtml(basics.location)}</span></span>`);
    if (basics.phone)    contactParts.push(`<a href="tel:${escapeHtml(basics.phone)}" style="display:inline-flex;align-items:center;">${phoneSvg}<span>${escapeHtml(basics.phone)}</span></a>`);
    if (basics.email)    contactParts.push(`<a href="mailto:${escapeHtml(basics.email)}" style="display:inline-flex;align-items:center;">${emailSvg}<span>${escapeHtml(basics.email)}</span></a>`);
    if (basics.linkedin) contactParts.push(`<a href="${escapeHtml(basics.linkedin)}" style="display:inline-flex;align-items:center;color:#4f46e5;">${linkedinSvg}<span>${escapeHtml(getLinkedinDisplay(basics.linkedin))}</span></a>`);
    if (basics.github)   contactParts.push(`<a href="${escapeHtml(basics.github)}" style="display:inline-flex;align-items:center;color:#4f46e5;">${githubSvg}<span>${escapeHtml(getGithubDisplay(basics.github))}</span></a>`);
    if (basics.url?.href) contactParts.push(`<a href="${escapeHtml(basics.url.href)}" style="display:inline-flex;align-items:center;color:#4f46e5;">${websiteSvg}<span>${escapeHtml(getWebsiteDisplay(basics.url.href))}</span></a>`);
    const contactRowHTML = contactParts.join(' <span style="color:#cbd5e1;margin:0 2px;">|</span> ');
    headerHTML = `
      <div class="header">
        <h1>${escapeHtml(basics.name)}</h1>
        ${basics.headline ? `<p class="headline">${escapeHtml(basics.headline)}</p>` : ''}
        <p class="contact-row">${contactRowHTML}</p>
      </div>`;
  } else if (templateId === 'executive') {
    extraStyle = executivePageStyle;
    headerHTML = renderExecutiveHeader(basics);
  } else if (templateId === 'vercel') {
    extraStyle = vercelPageStyle;
    // Vercel uses same centered header layout as classic but with vercel styles
    headerHTML = '';
  } else if (templateId === 'linear') {
    extraStyle = linearPageStyle;
    headerHTML = '';
  } else if (templateId === 'stripe') {
    extraStyle = stripePageStyle;
    headerHTML = '';
  } else if (templateId === 'notion') {
    extraStyle = notionPageStyle;
    headerHTML = '';
  } else {
    // Classic — use default header from body render
    headerHTML = '';
  }

  const bodyHTML = renderResumeBodyHTML(resume);
  // For executive/modern, replace the header in the body output
  const finalBody = (templateId === 'executive' || templateId === 'modern')
    ? headerHTML + bodyHTML.replace(/\u003cdiv class="header"\u003e[\s\S]*?\u003c\/div\u003e\s*(?=\n|\u003cdiv)/, '')
    : bodyHTML;

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(basics.name || 'Resume')}</title>
    <style>${pageStyle}${extraStyle}</style>
  </head>
  <body>
    <div class="resume-container">
      ${finalBody}
    </div>
  </body>
</html>`;
}

export function renderResumeHTMLBody(resume: any) {
  return renderResumeBodyHTML(resume);
}
