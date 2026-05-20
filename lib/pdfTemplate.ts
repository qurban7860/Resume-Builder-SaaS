export function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

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
    background: #f4f6f8;
    color: #111827;
    font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  }

  body {
    padding: 20px;
  }

  .resume-container {
    width: 100%;
    max-width: 820px;
    margin: 0 auto;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
    padding: 24px 28px;
  }

  .header {
    margin-bottom: 12px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e2e8f0;
  }

  .header h1 {
    font-size: 22px;
    font-weight: 800;
    margin: 0 0 2px;
    letter-spacing: -0.02em;
    color: #0f172a;
    line-height: 1.1;
  }

  .header .headline {
    margin: 0 0 6px;
    color: #2563eb;
    font-size: 13px;
    font-weight: 600;
  }

  .header .contact-row {
    margin: 0;
    color: #475569;
    font-size: 9.5px;
    line-height: 1.4;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .header .contact-row a {
    color: #475569;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 2px;
  }

  .header .contact-row a:hover {
    color: #2563eb;
    text-decoration: underline;
  }

  .section-title {
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #0f172a;
    margin-top: 0;
    margin-bottom: 10px;
    padding-bottom: 3px;
    border-bottom: 1.5px solid #e2e8f0;
  }

  .section-block {
    margin-bottom: 14px;
  }

  .section-two-col {
    display: grid;
    grid-template-columns: 1.8fr 1fr;
    gap: 20px;
  }

  .main-column,
  .sidebar-column {
    width: 100%;
  }

  .section-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 12px;
  }

  .text-body {
    font-size: 9.5px;
    line-height: 1.5;
    color: #334155;
    margin: 0;
  }

  .experience-item,
  .project-item {
    margin-bottom: 12px;
  }

  .experience-item:last-child,
  .project-item:last-child {
    margin-bottom: 0;
  }

  .item-title {
    font-size: 11.5px;
    font-weight: 700;
    margin: 0 0 1px;
    color: #0f172a;
  }

  .item-meta {
    font-size: 9.5px;
    color: #64748b;
    margin: 0 0 5px;
    line-height: 1.4;
    font-weight: 500;
  }

  .item-meta a {
    color: #2563eb;
    text-decoration: none;
    font-weight: 600;
  }

  .item-meta a:hover {
    text-decoration: underline;
  }

  .project-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 2px;
  }

  .project-links {
    font-size: 9px;
    font-weight: 600;
    display: flex;
    gap: 6px;
  }

  .project-links a {
    color: #2563eb;
    text-decoration: none;
  }

  .project-links a:hover {
    text-decoration: underline;
  }

  .skill-item,
  .education-item,
  .certification-item {
    margin-bottom: 10px;
  }

  .skill-item:last-child,
  .education-item:last-child,
  .certification-item:last-child {
    margin-bottom: 0;
  }

  .skill-item p,
  .certification-item p {
    margin: 0;
  }

  ul {
    margin: 4px 0 0 14px;
    padding: 0;
  }

  li {
    margin-bottom: 3px;
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

    .section-two-col {
      display: grid !important;
      grid-template-columns: 1.8fr 1fr !important;
      gap: 20px !important;
    }
  }
`;

function renderResumeBodyHTML(resume: any) {
  const basics = resume.basics || {};
  const sections = resume.sections || {};

  const summaryHTML = escapeHtml(sections.summary?.content || '');

  // Render contact info with links
  const contactParts: string[] = [];
  if (basics.email) {
    contactParts.push(`<a href="mailto:${escapeHtml(basics.email)}">${escapeHtml(basics.email)}</a>`);
  }
  if (basics.phone) {
    contactParts.push(`<a href="tel:${escapeHtml(basics.phone)}">${escapeHtml(basics.phone)}</a>`);
  }
  if (basics.location) {
    contactParts.push(`<span>${escapeHtml(basics.location)}</span>`);
  }
  if (basics.linkedin) {
    const displayLinkedin = basics.linkedin.replace(/https?:\/\/(www\.)?linkedin\.com\/in\//, 'linkedin.com/in/');
    contactParts.push(`<a href="${escapeHtml(basics.linkedin)}" target="_blank">${escapeHtml(displayLinkedin)}</a>`);
  }
  if (basics.github) {
    const displayGithub = basics.github.replace(/https?:\/\/(www\.)?github\.com\//, 'github.com/');
    contactParts.push(`<a href="${escapeHtml(basics.github)}" target="_blank">${escapeHtml(displayGithub)}</a>`);
  }
  if (basics.url?.href) {
    const displayWebsite = basics.url.href.replace(/https?:\/\/(www\.)?/, '');
    contactParts.push(`<a href="${escapeHtml(basics.url.href)}" target="_blank">${escapeHtml(displayWebsite)}</a>`);
  }
  const contactRowHTML = contactParts.join(' • ');

  // Render experience list with companyUrl support
  const experienceHTML = (sections.experience?.items || [])
    .map((item: any) => {
      const summaryMarkup = item.summary || '';
      const companyMarkup = item.companyUrl 
        ? `<a href="${escapeHtml(item.companyUrl)}" target="_blank">${escapeHtml(item.company)}</a>`
        : escapeHtml(item.company);
      return `
        <div class="experience-item">
          <p class="item-title">${escapeHtml(item.title)}</p>
          <p class="item-meta">${companyMarkup} • ${escapeHtml(item.startDate)} - ${escapeHtml(item.endDate)}</p>
          <div class="text-body">${summaryMarkup}</div>
        </div>
      `;
    })
    .join('');

  // Render projects with githubUrl and projectUrl support
  const projectsHTML = (sections.projects?.items || [])
    .map((project: any) => {
      const linksParts: string[] = [];
      if (project.projectUrl) {
        linksParts.push(`<a href="${escapeHtml(project.projectUrl)}" target="_blank">Demo</a>`);
      }
      if (project.githubUrl) {
        linksParts.push(`<a href="${escapeHtml(project.githubUrl)}" target="_blank">Code</a>`);
      }
      const linksMarkup = linksParts.length > 0
        ? `<span class="project-links">${linksParts.join(' | ')}</span>`
        : '';
      return `
        <div class="project-item">
          <div class="project-header">
            <span class="item-title">${escapeHtml(project.name)}</span>
            ${linksMarkup}
          </div>
          <p class="text-body">${escapeHtml(project.description)}</p>
        </div>
      `;
    })
    .join('');

  const skillsHTML = (sections.skills?.items || [])
    .map((skill: any) => `
      <div class="skill-item">
        <p class="item-title">${escapeHtml(skill.name)}</p>
        <p class="text-body">${escapeHtml((skill.keywords || []).join(', '))}</p>
      </div>
    `)
    .join('');

  const educationHTML = (sections.education?.items || [])
    .map((item: any) => `
      <div class="education-item">
        <div class="item-title">${escapeHtml(item.studyType)}</div>
        <div class="item-meta">${escapeHtml(item.institution)} • ${escapeHtml(item.startDate)} - ${escapeHtml(item.endDate)}</div>
      </div>
    `)
    .join('');

  const certificationsHTML = (sections.certifications?.items || [])
    .map((item: any) => `
      <div class="certification-item">
        <p class="text-body">• ${escapeHtml(item.name)}</p>
      </div>
    `)
    .join('');

  return `
      <div class="header">
        <h1>${escapeHtml(basics.name)}</h1>
        <p class="headline">${escapeHtml(basics.headline)}</p>
        <p class="contact-row">${contactRowHTML}</p>
      </div>

      <div class="section-block">
        <div class="section-title">Summary</div>
        <p class="text-body">${summaryHTML.replace(/\n/g, '<br/>')}</p>
      </div>

      <div class="section-block section-two-col">
        <div class="main-column">
          <div class="section-block">
            <div class="section-title">Experience</div>
            ${experienceHTML}
          </div>
          <div class="section-block">
            <div class="section-title">Projects</div>
            ${projectsHTML}
          </div>
        </div>
        <aside class="sidebar-column">
          <div class="section-card">
            <div class="section-title">Skills</div>
            ${skillsHTML}
          </div>
          <div class="section-card">
            <div class="section-title">Education</div>
            ${educationHTML}
          </div>
          <div class="section-card">
            <div class="section-title">Certifications</div>
            ${certificationsHTML}
          </div>
        </aside>
      </div>
  `;
}

export function renderResumeHTML(resume: any) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(resume.basics?.name || 'Resume')}</title>
    <style>${pageStyle}</style>
  </head>
  <body>
    <div class="resume-container">
      ${renderResumeBodyHTML(resume)}
    </div>
  </body>
</html>`;
}

export function renderResumeHTMLBody(resume: any) {
  return renderResumeBodyHTML(resume);
}
