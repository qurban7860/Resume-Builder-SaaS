import React from 'react';
import { sanitizeRichText } from '@/lib/textUtils';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getLinkedinSlug = (url: string) => {
  if (!url) return '';
  let c = url.trim().replace(/^https?:\/\//i, '').replace(/^www\./i, '');
  return c.replace(/^linkedin\.com\/in\//i, '').replace(/^linkedin\.com\//i, '').split('?')[0].replace(/\/+$/, '');
};
const getGithubSlug = (url: string) => {
  if (!url) return '';
  return url.trim().replace(/^https?:\/\//i, '').replace(/^www\./i, '').replace(/^github\.com\//i, '').split('?')[0].replace(/\/+$/, '');
};
const getWebDisplay = (url: string) => {
  if (!url) return '';
  return url.trim().replace(/^https?:\/\//i, '').replace(/^www\./i, '').split('?')[0].replace(/\/+$/, '');
};

// ─── Icons (sans-serif feel — slightly bolder strokes) ──────────────────────
const sz = 'w-[10px] h-[10px] inline-block mr-[3px] flex-shrink-0';
const LocationIcon = () => <svg className={`${sz} fill-none stroke-current`} strokeWidth="2.5" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const PhoneIcon    = () => <svg className={`${sz} fill-none stroke-current`} strokeWidth="2.5" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const EmailIcon    = () => <svg className={`${sz} fill-none stroke-current`} strokeWidth="2.5" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const LinkedinIcon = () => <svg className={`${sz} fill-current`} viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>;
const GithubIcon   = () => <svg className={`${sz} fill-current`} viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>;
const WebsiteIcon  = () => <svg className={`${sz} fill-none stroke-current`} strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
const LinkIcon     = () => <svg className="w-[9px] h-[9px] fill-none stroke-current inline ml-0.5" style={{color:'#4f46e5'}} strokeWidth="3" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>;

const ACCENT = '#4f46e5'; // indigo-600

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2
    className="text-[11px] font-bold uppercase tracking-[0.12em] mb-1.5 pb-0.5"
    style={{ color: ACCENT, borderBottom: `2px solid ${ACCENT}` }}
  >
    {children}
  </h2>
);

const renderHtml = (value: string, className: string) => (
  <div
    className={`${className} [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_li]:mt-1`}
    dangerouslySetInnerHTML={{ __html: sanitizeRichText(value) }}
  />
);

interface Resume {
  basics: { name: string; headline?: string; email: string; phone: string; location: string; url?: { href: string }; linkedin?: string; github?: string };
  sections: { summary?: { content: string }; experience: { items: any[] }; education: { items: any[] }; projects: { items: any[] }; skills: { items: any[] }; certifications?: { items: any[] }; achievements?: { items: any[] }; relevantCoursework?: { items: any[] } };
}

export const ModernTemplate = React.memo(({ resume }: { resume: Resume }) => {
  const { basics, sections } = resume;
  const courseNames = sections.relevantCoursework?.items?.map((i: any) => i.name).join(', ') || '';

  const SANS = '"Inter","Segoe UI","Helvetica Neue",Arial,sans-serif';

  const contactItems = [
    basics.location && { icon: <LocationIcon />, label: basics.location, href: undefined },
    basics.phone    && { icon: <PhoneIcon />,    label: basics.phone,    href: `tel:${basics.phone}` },
    basics.email    && { icon: <EmailIcon />,    label: basics.email,    href: `mailto:${basics.email}` },
    basics.linkedin && { icon: <LinkedinIcon />, label: getLinkedinSlug(basics.linkedin), href: basics.linkedin },
    basics.github   && { icon: <GithubIcon />,   label: getGithubSlug(basics.github),    href: basics.github },
    basics.url?.href && { icon: <WebsiteIcon />, label: (basics.url as any)?.label || getWebDisplay(basics.url.href),  href: basics.url.href },
  ].filter(Boolean) as { icon: React.ReactNode; label: string; href?: string }[];

  return (
    <div className="bg-white" style={{ fontFamily: SANS, color: '#1e1b4b' }}>
      {/* ── Header ── */}
      <header className="text-center mb-3 pb-3" style={{ borderBottom: `3px solid ${ACCENT}` }}>
        <h1 className="font-bold tracking-tight leading-tight mb-0.5" style={{ fontSize: '26px', color: '#0f172a' }}>
          {basics.name}
        </h1>
        {basics.headline && (
          <div className="font-semibold uppercase tracking-[0.1em] mb-2" style={{ fontSize: '11px', color: ACCENT }}>
            {basics.headline}
          </div>
        )}
        <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-0.5" style={{ fontSize: '10px', color: '#475569' }}>
          {contactItems.map((item, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span style={{ color: '#cbd5e1' }}>|</span>}
              {item.href ? (
                <a href={item.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center transition-colors" style={{ color: ACCENT }}>
                  {item.icon}<span>{item.label}</span>
                </a>
              ) : (
                <span className="inline-flex items-center" style={{ color: '#475569' }}>{item.icon}<span>{item.label}</span></span>
              )}
            </React.Fragment>
          ))}
        </div>
      </header>

      {/* ── Summary ── */}
      {sections.summary?.content && (
        <section className="mb-2">
          <SectionTitle>Summary</SectionTitle>
          {renderHtml(sections.summary.content, 'text-[10.5px] text-[#374151] leading-[1.5]')}
        </section>
      )}

      {/* ── Education ── */}
      {sections.education.items.length > 0 && (
        <section className="mb-2">
          <SectionTitle>Education</SectionTitle>
          <div className="space-y-1.5">
            {sections.education.items.map((item: any, idx: number) => {
              const courseText = item.coursework || (idx === 0 ? courseNames : '');
              return (
                <div key={item.id} className="break-inside-avoid mb-1">
                  <div className="flex justify-between items-baseline">
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#0f172a' }}>{item.institution}</span>
                    <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#64748b' }}>{item.startDate} – {item.endDate}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span style={{ fontSize: '10.5px', fontStyle: 'italic', color: '#475569' }}>{item.studyType}</span>
                    {item.location && <span style={{ fontSize: '10px', color: '#94a3b8' }}>{item.location}</span>}
                  </div>
                  {courseText && (
                    <p style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>
                      <span style={{ fontWeight: 600, color: '#374151' }}>Coursework: </span>{courseText}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Skills ── */}
      {sections.skills.items.length > 0 && (
        <section className="mb-2">
          <SectionTitle>Skills</SectionTitle>
          <div className="space-y-0.5">
            {sections.skills.items.map((skill: any) => (
              <div key={skill.id} className="break-inside-avoid" style={{ fontSize: '10.5px', color: '#374151', lineHeight: '1.45' }}>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>{skill.name}: </span>
                <span>{skill.keywords.join(', ')}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Experience ── */}
      {sections.experience.items.length > 0 && (
        <section className="mb-2">
          <SectionTitle>Experience</SectionTitle>
          <div className="space-y-2">
            {sections.experience.items.map((item: any) => (
              <div key={item.id} className="break-inside-avoid mb-2">
                <div className="flex justify-between items-baseline">
                  <div style={{ fontSize: '11.5px', color: '#0f172a', lineHeight: '1.3' }}>
                    {item.companyUrl ? (
                      <a href={item.companyUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center" style={{ fontWeight: 700, color: ACCENT }}>
                        {item.company}<LinkIcon />
                      </a>
                    ) : (
                      <span style={{ fontWeight: 700 }}>{item.company}</span>
                    )}
                    {item.title && <span style={{ fontWeight: 400, color: '#475569' }}> | <span style={{ fontStyle: 'italic' }}>{item.title}</span></span>}
                    {item.location && <span style={{ fontWeight: 400, color: '#94a3b8' }}> | {item.location}</span>}
                  </div>
                  <div style={{ fontSize: '10.5px', fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                    {item.startDate} – {item.endDate}
                  </div>
                </div>
                {item.summary && renderHtml(item.summary, 'text-[10.5px] text-[#374151] mt-0.5 leading-[1.45]')}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Projects ── */}
      {sections.projects.items.length > 0 && (
        <section className="mb-2">
          <SectionTitle>Projects</SectionTitle>
          <div className="space-y-2">
            {sections.projects.items.map((proj: any) => {
              const primaryUrl = proj.projectUrl || proj.githubUrl;
              return (
                <div key={proj.id} className="break-inside-avoid mb-2">
                  <div className="flex justify-between items-baseline">
                    <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#0f172a' }}>
                      {primaryUrl ? (
                        <a href={primaryUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center" style={{ color: ACCENT }}>
                          {proj.name}<LinkIcon />
                        </a>
                      ) : <span>{proj.name}</span>}
                      {proj.technologies && <span style={{ fontWeight: 400, color: '#475569' }}> | <span style={{ fontStyle: 'italic' }}>{proj.technologies}</span></span>}
                    </div>
                    {proj.date && <div style={{ fontSize: '10.5px', fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap', marginLeft: '8px' }}>{proj.date}</div>}
                  </div>
                  {proj.description && renderHtml(proj.description, 'text-[10.5px] text-[#374151] mt-0.5 leading-[1.45]')}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Certificates & Awards ── */}
      {((sections.achievements?.items?.length ?? 0) > 0 || (sections.certifications?.items?.length ?? 0) > 0) && (
        <section className="mb-2">
          <SectionTitle>Certificates & Awards</SectionTitle>
          <ul style={{ fontSize: '10.5px', color: '#374151', paddingLeft: '16px', listStyleType: 'disc', lineHeight: '1.45' }}>
            {(sections.achievements?.items || []).map((ach: any) => {
              const parts = [ach.title];
              if (ach.subtitle) parts.push(ach.subtitle);
              const base = parts.join(' | ');
              const dateStr = ach.startDate ? (ach.endDate ? `${ach.startDate} – ${ach.endDate}` : ach.startDate) : '';
              return <li key={ach.id} style={{ marginBottom: '2px' }}>{base}{dateStr ? ` (${dateStr})` : ''}</li>;
            })}
            {(sections.certifications?.items || []).map((cert: any) => (
              <li key={cert.id} style={{ marginBottom: '2px' }}>{cert.name}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
});

ModernTemplate.displayName = 'ModernTemplate';
